import dns from 'dns';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { config } from './env.js';
import { userService } from '../services/userService.js';
import { productService } from '../services/productService.js';
import { bannerService } from '../services/bannerService.js';

// Safe DNS setup: only attempt on local dev if needed; never crash cloud environments
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // Ignore environment restrictions
  }
}

// Ensure mongoose doesn't hang indefinitely on disconnected queries
mongoose.set('bufferCommands', false);

export const connectDatabase = async () => {
  if (!config.mongoUri) {
    logger.warn('ℹ️ No MONGODB_URI configured. Operating smoothly in resilient in-memory mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
      family: 4, // Force IPv4 to prevent Render IPv6 DNS timeout delays
    });

    logger.info(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed collections if empty
    Promise.all([
      userService.ensureSeeded(),
      productService.ensureSeeded(),
      bannerService.ensureSeeded(),
    ]).catch((seedErr) => {
      logger.warn(`Post-connection seeding notice: ${seedErr.message}`);
    });

    return true;
  } catch (err) {
    logger.warn(`⚠️ MongoDB Notice: ${err.message}. Seamlessly continuing in resilient memory mode.`);
    return false;
  }
};

mongoose.connection.on('error', (err) => {
  logger.warn(`MongoDB runtime notice: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.info('MongoDB disconnected. Memory fallback active.');
});
