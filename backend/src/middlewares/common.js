import crypto from 'crypto';
import { logger } from '../utils/logger.js';

// Correlation ID Middleware
export const correlationMiddleware = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || `req-${crypto.randomUUID()}`;
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
};

// NoSQL Injection sanitizer
export const sanitizeMongoInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
};

// Centralized Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
  logger.error({
    correlationId: req.correlationId,
    err: err.message,
    stack: err.stack,
    url: req.originalUrl,
  }, 'Unhandled Application Error');

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: statusCode === 500 && process.env.NODE_ENV === 'production'
        ? 'An unexpected system error occurred.'
        : err.message,
    },
    correlationId: req.correlationId,
  });
};
