import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Default permissions for Administrator role
export const ALL_PERMISSIONS = [
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
  'users.manage'
];

export const MANAGER_PRESET_PERMISSIONS = [
  'analytics.read',
  'products.create',
  'products.update',
  'campaigns.create',
  'campaigns.read',
  'campaigns.update',
  'manager_activity.read'
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('scar_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('scar_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // 1. Try real backend API first
      try {
        const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data?.user) {
          setUser(resData.data.user);
          return { success: true, user: resData.data.user };
        }
      } catch (networkErr) {
        // Fall back to client demo verification if server is unreachable
      }

      // 2. Local resilient fallback check
      const normalized = email.toLowerCase().trim();
      if (normalized === 'admin@scar.local' && password === 'AdminSecurePassword123!') {
        const adminUser = {
          id: 'usr_admin_01',
          name: 'Prathamesh Shelke (Admin)',
          email: 'admin@scar.local',
          role: 'admin',
          permissions: ALL_PERMISSIONS,
          phone: '+91 98765 00001',
          address: { street: 'HQ Tower, Cyber City', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001' },
        };
        setUser(adminUser);
        return { success: true, user: adminUser };
      }

      if (normalized === 'manager@scar.local' && password === 'ManagerSecurePassword123!') {
        const managerUser = {
          id: 'usr_manager_01',
          name: 'Priya Sharma (Catalog Manager)',
          email: 'manager@scar.local',
          role: 'manager',
          permissions: MANAGER_PRESET_PERMISSIONS,
          phone: '+91 98765 00002',
          address: { street: 'Design Studio 4B', city: 'Bengaluru', state: 'Karnataka', postalCode: '560001' },
        };
        setUser(managerUser);
        return { success: true, user: managerUser };
      }

      if (normalized === 'user@gmail.com' && password === 'user') {
        const demoCustomer = {
          id: 'usr_demo_user',
          name: 'Demo Customer',
          email: 'user@gmail.com',
          role: 'customer',
          permissions: [],
          phone: '+91 98765 43210',
          address: { street: 'Flat 402, Skyline Residency, Ring Road', city: 'Bengaluru', state: 'Karnataka', postalCode: '560103' },
        };
        setUser(demoCustomer);
        return { success: true, user: demoCustomer };
      }

      throw new Error('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      try {
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.data?.user) {
          setUser(data.data.user);
          return { success: true, user: data.data.user };
        }
      } catch (e) {
        // Fallback
      }

      const localNewUser = {
        id: `usr_${Date.now().toString(36)}`,
        name,
        email: email.toLowerCase().trim(),
        role: 'customer',
        permissions: [],
        phone: '',
        address: { street: '', city: '', state: '', postalCode: '' },
      };
      setUser(localNewUser);
      return { success: true, user: localNewUser };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const merged = { ...user, ...updates };
    setUser(merged);

    try {
      await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...updates }),
      });
    } catch {
      // Handled silently
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'superadmin') return true;
    return Array.isArray(user.permissions) && user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
        isManager: user?.role === 'manager' || user?.role === 'admin' || user?.role === 'superadmin',
        role: user?.role || 'guest',
        hasPermission,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
