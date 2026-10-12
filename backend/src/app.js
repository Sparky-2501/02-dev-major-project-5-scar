import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { correlationMiddleware, sanitizeMongoInput, errorHandler } from './middlewares/common.js';
import { inventoryService } from './services/inventoryService.js';
import { SEED_CATALOG } from './data/seedCatalog.js';
import { uploadToCloudinary, isCloudinaryConfigured } from './config/cloudinary.js';

export const app = express();

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(correlationMiddleware);
app.use(sanitizeMongoInput);

// Multer memory storage configuration for file uploads (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP, SVG) are permitted.'));
    }
  },
});

// Health & Readiness Endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cloudinaryConfigured: isCloudinaryConfigured(),
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'UP',
      mode: config.env,
      database: 'standalone_memory_fallback_active',
      inventoryGuard: 'atomic_concurrency_ready',
      cloudinaryConfigured: isCloudinaryConfigured(),
    }
  });
});

// Cloudinary Image Upload Endpoint
app.post('/api/v1/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No image file was provided in the request.' },
      });
    }

    if (!isCloudinaryConfigured()) {
      // In local mode without active keys, return a clean message with local fallback preview
      return res.status(200).json({
        success: true,
        message: 'Cloudinary credentials not active yet. Using local fallback asset path.',
        data: {
          secureUrl: `/images/temp-uploads/${req.file.originalname || 'sample.svg'}`,
          publicId: `local_${Date.now()}`,
          isLocalFallback: true,
        },
      });
    }

    const uploaded = await uploadToCloudinary(req.file.buffer, 'scar_products');
    logger.info({ publicId: uploaded.publicId, url: uploaded.secureUrl }, 'Image uploaded to Cloudinary');

    res.status(201).json({
      success: true,
      message: 'Image successfully uploaded to Cloudinary.',
      data: uploaded,
    });
  } catch (err) {
    next(err);
  }
});

// Catalog Endpoints
app.get('/api/v1/products', (req, res) => {
  const productsWithLiveStock = SEED_CATALOG.map((item) => ({
    ...item,
    stock: inventoryService.getStock(item.sku),
  }));

  res.json({
    success: true,
    data: productsWithLiveStock,
    meta: { total: productsWithLiveStock.length }
  });
});

// High-Concurrency Checkout / Atomic Purchase Endpoint
app.post('/api/v1/checkout/purchase', (req, res, next) => {
  const { sku, quantity = 1 } = req.body;
  if (!sku) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'sku is required' }
    });
  }

  try {
    const result = inventoryService.atomicPurchase(sku, parseInt(quantity, 10));
    res.status(201).json({
      success: true,
      message: 'Purchase succeeded and stock decremented atomically.',
      data: result,
      correlationId: req.correlationId,
    });
  } catch (err) {
    next(err);
  }
});

// Centralized error handler
app.use(errorHandler);
