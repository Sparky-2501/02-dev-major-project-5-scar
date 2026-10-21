import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from current working directory and fallback to workspace root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: (() => {
    let uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : '';
    if (!uri) {
      // In local development allow localhost fallback, but in production do NOT try localhost
      return process.env.NODE_ENV === 'production' ? '' : 'mongodb://localhost:27017/scar_ecommerce';
    }
    // Ensure database name is present before query parameters for Atlas URIs
    if (uri.includes('.net/?')) {
      uri = uri.replace('.net/?', '.net/scar_ecommerce?');
    } else if (uri.endsWith('.net/')) {
      uri = `${uri}scar_ecommerce`;
    }
    return uri;
  })(),
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_jwt_access_secret_super_secure_key_12345',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_super_secure_key_12345',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@scar.local',
    password: process.env.ADMIN_PASSWORD || 'AdminSecurePassword123!',
  },
  payment: {
    provider: process.env.PAYMENT_GATEWAY_PROVIDER || 'simulated',
  }
};
