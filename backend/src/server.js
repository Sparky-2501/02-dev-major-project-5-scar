import { app } from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { connectDatabase } from './config/db.js';

// Connect to MongoDB Atlas (or fallback to resilient in-memory mode)
connectDatabase().catch((err) => {
  logger.error(`Initial DB setup error: ${err.message}`);
});

const server = app.listen(config.port, () => {
  logger.info(`SCAR Backend API Server listening on port ${config.port} in ${config.env} mode`);
  logger.info(`Health check available at http://localhost:${config.port}/api/v1/health`);
});

// Graceful Shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down SCAR server cleanly...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
