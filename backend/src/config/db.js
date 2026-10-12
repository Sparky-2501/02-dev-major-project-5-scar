import dns from 'dns';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { config } from './env.js';

// Ensure public DNS resolver is available for MongoDB Atlas SRV lookups on local environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if custom environment forbids overriding DNS
}

export const connectDatabase = async () => {
  if (!config.mongoUri) {
    logger.warn('No MONGODB_URI provided. Running in resilient in-memory mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (err) {
    logger.warn(`MongoDB Connection Notice: ${err.message}. Operating in resilient memory mode.`);
    return false;
  }
};
