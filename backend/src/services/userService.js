import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';

// Pre-seeded users in memory for resilient standalone/demo operations
const initialUsers = [
  {
    id: 'usr_admin_01',
    name: 'Prathamesh Shelke (Admin)',
    email: 'admin@scar.local',
    phone: '9876500001',
    passwordHash: bcrypt.hashSync('AdminSecurePassword123!', 10),
    role: 'admin',
    gender: 'all',
    age: 28,
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
    address: { street: 'HQ Tower, Cyber City', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001' },
  },
  {
    id: 'usr_manager_01',
    name: 'Priya Sharma (Catalog Director)',
    email: 'manager@scar.local',
    phone: '9876500002',
    passwordHash: bcrypt.hashSync('ManagerSecurePassword123!', 10),
    role: 'manager',
    gender: 'female',
    age: 26,
    permissions: [
      'analytics.read',
      'products.create',
      'products.update',
      'campaigns.create',
      'campaigns.read',
      'campaigns.update',
      'manager_activity.read',
    ],
    address: { street: 'Design Studio 4B', city: 'Bengaluru', state: 'Karnataka', postalCode: '560001' },
  },
  {
    id: 'usr_demo_user',
    name: 'Demo Customer',
    email: 'user@gmail.com',
    phone: '9876543210',
    passwordHash: bcrypt.hashSync('user', 10),
    role: 'customer',
    gender: 'all',
    age: 24,
    permissions: [],
    address: { street: 'Flat 402, Skyline Residency, Ring Road', city: 'Bengaluru', state: 'Karnataka', postalCode: '560103' },
  },
];

class UserService {
  constructor() {
    this.users = new Map();
    initialUsers.forEach((u) => {
      this.users.set(u.email.toLowerCase(), { ...u });
      if (u.phone) this.users.set(u.phone, { ...u });
    });
  }

  isDbConnected() {
    return mongoose.connection.readyState === 1;
  }

  async ensureSeeded() {
    if (!this.isDbConnected()) return;
    try {
      for (const u of initialUsers) {
        const existing = await User.findOne({ email: u.email.toLowerCase() });
        if (!existing) {
          await User.create({
            name: u.name,
            email: u.email.toLowerCase(),
            phone: u.phone,
            password: u.role === 'admin' ? 'AdminSecurePassword123!' : u.role === 'manager' ? 'ManagerSecurePassword123!' : 'user',
            role: u.role,
            gender: u.gender || 'all',
            age: u.age || 25,
            permissions: u.permissions,
            address: u.address,
          });
          logger.info(`✨ Seeded default ${u.role} user: ${u.email} into MongoDB.`);
        }
      }
    } catch (err) {
      logger.warn(`Could not seed initial users into MongoDB: ${err.message}`);
    }
  }

  async findByEmailOrPhone(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();

    if (this.isDbConnected()) {
      try {
        const userDoc = await User.findOne({
          $or: [{ email: clean }, { phone: clean }],
        });
        if (userDoc) {
          return {
            id: userDoc._id.toString(),
            name: userDoc.name,
            email: userDoc.email,
            phone: userDoc.phone || '',
            passwordHash: userDoc.password,
            role: userDoc.role,
            gender: userDoc.gender || 'all',
            age: userDoc.age || 24,
            permissions: userDoc.permissions || [],
            address: userDoc.address || {},
            createdAt: userDoc.createdAt,
          };
        }
      } catch (err) {
        // Fallback to memory
      }
    }

    return this.users.get(clean) || null;
  }

  async findByEmail(email) {
    return this.findByEmailOrPhone(email);
  }

  async findById(id) {
    if (this.isDbConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const userDoc = await User.findById(id);
          if (userDoc) {
            return {
              id: userDoc._id.toString(),
              name: userDoc.name,
              email: userDoc.email,
              phone: userDoc.phone || '',
              passwordHash: userDoc.password,
              role: userDoc.role,
              gender: userDoc.gender || 'all',
              age: userDoc.age || 24,
              permissions: userDoc.permissions || [],
              address: userDoc.address || {},
              createdAt: userDoc.createdAt,
            };
          }
        }
      } catch (err) {
        // Fallback to memory
      }
    }

    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  async verifyPassword(user, password) {
    if (!user || !user.passwordHash) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  async createUser({ name, email, phone = '', password, gender = 'all', age = 24, role = 'customer' }) {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    if (this.isDbConnected()) {
      const existing = await User.findOne({
        $or: [{ email: normalizedEmail }, ...(cleanPhone ? [{ phone: cleanPhone }] : [])],
      });
      if (existing) {
        const err = new Error(
          existing.email === normalizedEmail
            ? 'An account with this email address already exists. Please sign in.'
            : 'An account with this mobile number already exists. Please sign in.'
        );
        err.statusCode = 400;
        throw err;
      }

      const permissions = role === 'admin' ? initialUsers[0].permissions : role === 'manager' ? initialUsers[1].permissions : [];
      const userDoc = await User.create({
        name,
        email: normalizedEmail,
        phone: cleanPhone,
        password,
        role,
        gender: gender || 'all',
        age: Number(age) || 24,
        permissions,
        address: { street: '', city: '', state: '', postalCode: '', country: 'India' },
      });

      const userObj = {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone,
        role: userDoc.role,
        gender: userDoc.gender,
        age: userDoc.age,
        permissions: userDoc.permissions,
        address: userDoc.address,
        createdAt: userDoc.createdAt,
      };

      this.users.set(normalizedEmail, {
        ...userObj,
        passwordHash: userDoc.password,
      });
      if (cleanPhone) {
        this.users.set(cleanPhone, {
          ...userObj,
          passwordHash: userDoc.password,
        });
      }

      return userObj;
    }

    if (this.users.has(normalizedEmail)) {
      const err = new Error('An account with this email address already exists. Please sign in.');
      err.statusCode = 400;
      throw err;
    }

    const newUser = {
      id: `usr_${Date.now().toString(36)}`,
      name,
      email: normalizedEmail,
      phone: cleanPhone,
      passwordHash: bcrypt.hashSync(password, 10),
      role,
      gender: gender || 'all',
      age: Number(age) || 24,
      permissions: role === 'admin' ? initialUsers[0].permissions : role === 'manager' ? initialUsers[1].permissions : [],
      address: { street: '', city: '', state: '', postalCode: '', country: 'India' },
      createdAt: new Date().toISOString(),
    };

    this.users.set(normalizedEmail, newUser);
    if (cleanPhone) this.users.set(cleanPhone, newUser);
    return this.sanitizeUser(newUser);
  }

  async updateProfile(id, updates) {
    if (this.isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const userDoc = await User.findById(id);
      if (userDoc) {
        if (updates.name) userDoc.name = updates.name;
        if (updates.phone !== undefined) userDoc.phone = updates.phone;
        if (updates.gender) userDoc.gender = updates.gender;
        if (updates.age) userDoc.age = Number(updates.age);
        if (updates.address) userDoc.address = { ...userDoc.address, ...updates.address };
        await userDoc.save();

        const safeUser = {
          id: userDoc._id.toString(),
          name: userDoc.name,
          email: userDoc.email,
          phone: userDoc.phone,
          role: userDoc.role,
          gender: userDoc.gender,
          age: userDoc.age,
          permissions: userDoc.permissions,
          address: userDoc.address,
          createdAt: userDoc.createdAt,
        };

        this.users.set(userDoc.email.toLowerCase(), {
          ...safeUser,
          passwordHash: userDoc.password,
        });
        if (userDoc.phone) {
          this.users.set(userDoc.phone, {
            ...safeUser,
            passwordHash: userDoc.password,
          });
        }

        return safeUser;
      }
    }

    const user = await this.findById(id);
    if (!user) {
      const err = new Error('User record not found.');
      err.statusCode = 404;
      throw err;
    }

    if (updates.name) user.name = updates.name;
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.gender) user.gender = updates.gender;
    if (updates.age) user.age = Number(updates.age);
    if (updates.address) user.address = { ...user.address, ...updates.address };

    this.users.set(user.email.toLowerCase(), user);
    if (user.phone) this.users.set(user.phone, user);
    return this.sanitizeUser(user);
  }

  sanitizeUser(user) {
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

export const userService = new UserService();
