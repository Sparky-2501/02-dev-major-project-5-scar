import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import mongoose from 'mongoose';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { correlationMiddleware, sanitizeMongoInput, errorHandler } from './middlewares/common.js';
import { inventoryService } from './services/inventoryService.js';
import { userService } from './services/userService.js';
import { productService } from './services/productService.js';
import { bannerService } from './services/bannerService.js';
import { uploadToCloudinary, isCloudinaryConfigured } from './config/cloudinary.js';

export const app = express();

// Enforce HTTPS in production environments
app.use((req, res, next) => {
  if (config.env === 'production' && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});

// Security & Robust CORS Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    // Permissive in all environments so any deployed frontend URL or preview can wake & communicate without friction
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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

// ============================================================================
// 1. Render Keep-Alive & System Health Endpoints
// ============================================================================
app.get(['/health', '/api/v1/health'], (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    success: true,
    data: {
      status: 'UP',
      uptime: process.uptime(),
      mode: config.env,
      database: isDbConnected ? 'mongodb_connected' : 'resilient_memory_fallback_active',
      dbHost: isDbConnected ? mongoose.connection.host : 'local_memory_store',
      inventoryGuard: 'atomic_concurrency_ready',
      cloudinaryConfigured: isCloudinaryConfigured(),
      timestamp: new Date().toISOString(),
    },
  });
});

// ============================================================================
// 2. Authentication & Profile Endpoints
// ============================================================================
app.post('/api/v1/auth/login', async (req, res, next) => {
  try {
    const { email, phone, identifier, password, gender } = req.body;
    const loginId = identifier || email || phone;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please enter your registered email address or 10-digit mobile number, along with your password.',
        },
      });
    }

    const user = await userService.findByEmailOrPhone(loginId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_FAILED',
          message: 'Invalid credentials. Please verify your email / mobile number and password.',
        },
      });
    }

    const isMatch = await userService.verifyPassword(user, password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_FAILED',
          message: 'Incorrect password. Kindly re-enter your password.',
        },
      });
    }

    // If gender preference was passed, update user
    if (gender && ['female', 'male', 'other', 'all'].includes(gender)) {
      user.gender = gender;
      userService.updateProfile(user.id, { gender }).catch(() => {});
    }

    const safeUser = userService.sanitizeUser(user);
    res.json({
      success: true,
      message: `Welcome back to SCAR, ${user.name}! Login successful.`,
      data: { user: safeUser },
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/auth/register', async (req, res, next) => {
  try {
    const { name, email, phone = '', password, gender = 'all', age = 24 } = req.body;

    // Strict Field Validations with Pure Indian English error prompts
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_NAME', message: 'Please enter your full name (minimum 2 characters).' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Please provide a valid email address (e.g., name@gmail.com).' },
      });
    }

    const cleanPhone = phone.toString().trim().replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PHONE', message: 'Please enter a valid 10-digit Indian mobile number.' },
      });
    }

    const numAge = parseInt(age, 10);
    if (!numAge || numAge < 12 || numAge > 120) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_AGE', message: 'Please enter a valid age between 12 and 120 years.' },
      });
    }

    if (!gender) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_GENDER', message: 'Please select your gender (Male, Female, or Other).' },
      });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PASSWORD', message: 'Password must be at least 4 characters long.' },
      });
    }

    const newUser = await userService.createUser({
      name: name.trim(),
      email: email.trim(),
      phone: cleanPhone,
      password,
      role: 'customer',
      gender,
      age: numAge,
    });

    res.status(201).json({
      success: true,
      message: `Account created successfully! Welcome to SCAR, ${newUser.name}.`,
      data: { user: newUser },
    });
  } catch (err) {
    next(err);
  }
});

app.put('/api/v1/auth/profile', async (req, res, next) => {
  try {
    const { id, name, gender, phone, address } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: { code: 'ID_REQUIRED', message: 'User id is required to update profile.' },
      });
    }

    const updated = await userService.updateProfile(id, { name, gender, phone, address });
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: updated },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 3. Product Catalog Endpoints (CRUD)
// ============================================================================
app.get('/api/v1/products', async (req, res, next) => {
  try {
    const { category, gender } = req.query;
    const products = await productService.getAll({ category, gender });

    res.json({
      success: true,
      data: products,
      meta: {
        total: products.length,
        filterCategory: category || 'all',
        filterGender: gender || 'all',
      },
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/products/:id', async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Item not found in catalog.' },
      });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

// Add new product item (Manager & Admin)
app.post('/api/v1/products', async (req, res, next) => {
  try {
    const productData = req.body;
    if (!productData.title || !productData.price) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Product title and price are required.' },
      });
    }

    const created = await productService.addProduct(productData);
    logger.info({ id: created.id, title: created.title }, 'New product added to catalog');

    res.status(201).json({
      success: true,
      message: 'Item successfully added to atelier catalog.',
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

// Delete product item (Manager & Admin)
app.delete('/api/v1/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await productService.deleteProduct(id);

    res.json({
      success: true,
      message: success ? 'Item removed from atelier catalog.' : 'Item record cleared.',
      data: { id },
    });
  } catch (err) {
    next(err);
  }
});

// Update product item (Manager & Admin)
app.put('/api/v1/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await productService.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Item not found to update.' },
      });
    }

    res.json({
      success: true,
      message: 'Item updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 4. Promotional Discount Banners Endpoints (CRUD)
// ============================================================================
app.get(['/api/v1/banners', '/api/v1/campaigns'], async (req, res, next) => {
  try {
    const { status, gender } = req.query;
    const banners = await bannerService.getAll({ status, gender });

    res.json({
      success: true,
      data: banners,
      meta: { total: banners.length },
    });
  } catch (err) {
    next(err);
  }
});

// Add new discount banner (Manager & Admin)
app.post(['/api/v1/banners', '/api/v1/campaigns'], async (req, res, next) => {
  try {
    const bannerData = req.body;
    if (!bannerData.headline || !bannerData.name) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Banner headline and name are required.' },
      });
    }

    const created = await bannerService.createBanner(bannerData);
    logger.info({ id: created.id, name: created.name }, 'Discount banner created for home screen');

    res.status(201).json({
      success: true,
      message: 'Discount banner created for home screen.',
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

// Delete discount banner (Manager & Admin)
app.delete(['/api/v1/banners/:id', '/api/v1/campaigns/:id'], async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await bannerService.deleteBanner(id);

    res.json({
      success: true,
      message: success ? 'Discount banner removed from home screen.' : 'Banner record cleared.',
      data: { id },
    });
  } catch (err) {
    next(err);
  }
});

// Update discount banner status (Manager & Admin)
app.put(['/api/v1/banners/:id', '/api/v1/campaigns/:id'], async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await bannerService.updateBanner(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Banner not found to update.' },
      });
    }

    res.json({
      success: true,
      message: 'Banner updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 5. Cloudinary & Storage Image Upload
// ============================================================================
app.post('/api/v1/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No image file was provided in the request.' },
      });
    }

    // Try Cloudinary if keys are set
    if (isCloudinaryConfigured()) {
      try {
        const uploaded = await uploadToCloudinary(req.file.buffer, 'scar_products');
        logger.info({ publicId: uploaded.publicId, url: uploaded.secureUrl }, 'Image uploaded to Cloudinary');

        return res.status(201).json({
          success: true,
          message: 'Image successfully uploaded to Cloudinary.',
          data: uploaded,
        });
      } catch (cloudErr) {
        logger.warn(`Cloudinary upload failed: ${cloudErr.message}. Falling back to base64 data preview.`);
      }
    }

    // Seamless Fallback: convert file to Base64 data URL so image works immediately anywhere
    const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    return res.status(201).json({
      success: true,
      message: 'Image processed successfully via direct media buffer.',
      data: {
        secureUrl: base64Data,
        publicId: `upload_${Date.now()}`,
        format: req.file.mimetype.split('/')[1] || 'webp',
      },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 6. High-Concurrency Checkout / Atomic Purchase Endpoint
// ============================================================================
app.post('/api/v1/checkout/purchase', (req, res, next) => {
  const { sku, quantity = 1 } = req.body;
  if (!sku) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'sku is required' },
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

// Telemetry & analytics event ingestion
app.post(['/api/v1/telemetry/metrics', '/api/v1/analytics/events'], (req, res) => {
  const event = req.body;
  if (event && event.type) {
    logger.debug({ eventType: event.type, pathname: event.pathname }, 'Client telemetry logged');
  }
  res.status(204).end();
});

// Centralized error handler
app.use(errorHandler);
