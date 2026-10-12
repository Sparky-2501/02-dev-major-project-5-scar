import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { User } from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dns from 'dns';

// Ensure standard public DNS resolver is used for SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback
}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ Error: MONGODB_URI not found in root .env');
  process.exit(1);
}

// Target database name if not specified in URI path
const connectionUri = uri.includes('.net/?') 
  ? uri.replace('.net/?', '.net/scar_ecommerce?') 
  : (uri.endsWith('.net/') ? `${uri}scar_ecommerce` : uri);

console.log('🔄 Attempting MongoDB connection...');

async function run() {
  try {
    await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connection Successful! Host: ${mongoose.connection.host}, Database: ${mongoose.connection.name}`);

    // Pre-seeded users data
    const seedUsers = [
      {
        name: 'Prathamesh Shelke (Admin)',
        email: 'admin@scar.local',
        password: 'AdminSecurePassword123!',
        role: 'admin',
        permissions: [
          'analytics.read',
          'products.create',
          'products.update',
          'products.archive',
          'campaigns.create',
          'campaigns.publish',
          'campaigns.read',
          'campaigns.update',
          'campaigns.pause',
          'manager_activity.read',
          'orders.read',
          'users.manage',
        ],
        phone: '+91 98765 00001',
        address: { street: 'HQ Tower, Cyber City', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India' },
      },
      {
        name: 'Priya Sharma (Catalog Manager)',
        email: 'manager@scar.local',
        password: 'ManagerSecurePassword123!',
        role: 'manager',
        permissions: [
          'analytics.read',
          'products.create',
          'products.update',
          'campaigns.create',
          'campaigns.read',
          'campaigns.update',
          'manager_activity.read',
        ],
        phone: '+91 98765 00002',
        address: { street: 'Design Studio 4B', city: 'Bengaluru', state: 'Karnataka', postalCode: '560001', country: 'India' },
      },
      {
        name: 'Demo Customer',
        email: 'user@gmail.com',
        password: 'user',
        role: 'customer',
        permissions: [],
        phone: '+91 98765 43210',
        address: { street: 'Flat 402, Skyline Residency, Ring Road', city: 'Bengaluru', state: 'Karnataka', postalCode: '560103', country: 'India' },
      },
    ];

    console.log(`\n📦 Syncing ${seedUsers.length} seed users to MongoDB collection 'users'...`);

    for (const userData of seedUsers) {
      const existing = await User.findOne({ email: userData.email.toLowerCase() });
      if (existing) {
        console.log(`ℹ️ User already exists in DB: ${userData.email} (${userData.role}) - ID: ${existing._id}`);
      } else {
        const created = await User.create(userData);
        console.log(`✨ Created User in DB: ${created.email} (${created.role}) - ID: ${created._id}`);
      }
    }

    // Verify by counting and fetching users
    const totalUsers = await User.countDocuments();
    const allUsers = await User.find({}, 'name email role phone createdAt');
    console.log(`\n🎉 Verification Complete: Total users in MongoDB: ${totalUsers}`);
    console.log('List of users in database:');
    allUsers.forEach((u, idx) => {
      console.log(`  ${idx + 1}. [${u.role.toUpperCase()}] ${u.name} <${u.email}> (ID: ${u._id})`);
    });

    await mongoose.disconnect();
    console.log('\n🔒 Database connection closed cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB Test / Seed failed:', err.message);
    process.exit(1);
  }
}

run();
