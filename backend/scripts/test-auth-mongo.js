import request from 'supertest';
import { app } from '../src/app.js';
import { connectDatabase } from '../src/config/db.js';
import mongoose from 'mongoose';
import { User } from '../src/models/User.js';

console.log('🧪 Starting Auth & MongoDB Integration Test...');

async function testAuthIntegration() {
  try {
    // 1. Connect to Database
    const connected = await connectDatabase();
    if (!connected) {
      console.error('❌ Failed to connect to database during test.');
      process.exit(1);
    }
    console.log('✅ Connected to MongoDB.');

    // 2. Test Login with Admin (Pre-seeded in DB)
    console.log('\nTesting Login with admin@scar.local...');
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@scar.local', password: 'AdminSecurePassword123!' });

    if (loginRes.status === 200 && loginRes.body.success) {
      console.log('✅ Login verified successfully!');
      console.log('   Logged in user:', loginRes.body.data.user.name, `(${loginRes.body.data.user.role})`);
    } else {
      console.error('❌ Login failed:', loginRes.status, loginRes.body);
      process.exit(1);
    }

    // 3. Test Registering a brand new user into MongoDB
    const testEmail = `testuser_${Date.now()}@example.com`;
    console.log(`\nTesting Registration of new user: ${testEmail}...`);
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Automated Test User',
        email: testEmail,
        password: 'Password999!',
      });

    if (regRes.status === 201 && regRes.body.success) {
      console.log('✅ Registration API responded 201 Created!');
      console.log('   Created User ID:', regRes.body.data.user.id);
    } else {
      console.error('❌ Registration failed:', regRes.status, regRes.body);
      process.exit(1);
    }

    // 4. Verify the new user is actually persisted in MongoDB directly
    console.log('\nQuerying MongoDB directly to verify persistence of new user...');
    const userInDb = await User.findOne({ email: testEmail });
    if (userInDb) {
      console.log('✅ Found newly registered user directly in MongoDB collection!');
      console.log('   DB record ID:', userInDb._id.toString());
      console.log('   DB record Email:', userInDb.email);
      console.log('   DB record Name:', userInDb.name);

      // Clean up test user
      await User.deleteOne({ _id: userInDb._id });
      console.log('🧹 Cleaned up temporary test user record.');
    } else {
      console.error('❌ New user was NOT found in MongoDB.');
      process.exit(1);
    }

    // 5. Check health check endpoint
    console.log('\nTesting /api/v1/health endpoint...');
    const healthRes = await request(app).get('/api/v1/health');
    console.log('✅ Health endpoint status:', healthRes.status, healthRes.body);

    await mongoose.disconnect();
    console.log('\n✨ ALL MONGODB AUTH TESTS PASSED FLAWLESSLY! ✨\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test threw error:', err);
    process.exit(1);
  }
}

testAuthIntegration();
