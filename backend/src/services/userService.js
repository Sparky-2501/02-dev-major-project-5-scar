import bcrypt from 'bcryptjs';

// Pre-seeded users in memory for resilient standalone/demo operations
const initialUsers = [
  {
    id: 'usr_admin_01',
    name: 'Prathamesh Shelke (Admin)',
    email: 'admin@scar.local',
    passwordHash: bcrypt.hashSync('AdminSecurePassword123!', 10),
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
    address: { street: 'HQ Tower, Cyber City', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001' },
  },
  {
    id: 'usr_manager_01',
    name: 'Priya Sharma (Catalog Manager)',
    email: 'manager@scar.local',
    passwordHash: bcrypt.hashSync('ManagerSecurePassword123!', 10),
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
    address: { street: 'Design Studio 4B', city: 'Bengaluru', state: 'Karnataka', postalCode: '560001' },
  },
  {
    id: 'usr_demo_user',
    name: 'Demo Customer',
    email: 'user@gmail.com',
    passwordHash: bcrypt.hashSync('user', 10),
    role: 'customer',
    permissions: [],
    phone: '+91 98765 43210',
    address: { street: 'Flat 402, Skyline Residency, Ring Road', city: 'Bengaluru', state: 'Karnataka', postalCode: '560103' },
  },
];

class UserService {
  constructor() {
    this.users = new Map();
    initialUsers.forEach((u) => this.users.set(u.email.toLowerCase(), { ...u }));
  }

  findByEmail(email) {
    if (!email) return null;
    return this.users.get(email.toLowerCase()) || null;
  }

  findById(id) {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  async verifyPassword(user, password) {
    if (!user || !user.passwordHash) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  createUser({ name, email, password, role = 'customer' }) {
    const normalizedEmail = email.toLowerCase();
    if (this.users.has(normalizedEmail)) {
      const err = new Error('User with this email already exists.');
      err.statusCode = 400;
      throw err;
    }

    const newUser = {
      id: `usr_${Date.now().toString(36)}`,
      name,
      email: normalizedEmail,
      passwordHash: bcrypt.hashSync(password, 10),
      role,
      permissions: role === 'admin' ? initialUsers[0].permissions : role === 'manager' ? initialUsers[1].permissions : [],
      phone: '',
      address: { street: '', city: '', state: '', postalCode: '' },
      createdAt: new Date().toISOString(),
    };

    this.users.set(normalizedEmail, newUser);
    return this.sanitizeUser(newUser);
  }

  updateProfile(id, updates) {
    const user = this.findById(id);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    if (updates.name) user.name = updates.name;
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.address) user.address = { ...user.address, ...updates.address };

    this.users.set(user.email.toLowerCase(), user);
    return this.sanitizeUser(user);
  }

  sanitizeUser(user) {
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

export const userService = new UserService();
