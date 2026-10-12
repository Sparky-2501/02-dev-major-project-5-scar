import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { correlationMiddleware, sanitizeMongoInput, errorHandler } from './middlewares/common.js';
import { inventoryService } from './services/inventoryService.js';
import { SEED_CATALOG } from './data/seedCatalog.js';

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

// Health & Readiness Endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
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
    }
  });
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
