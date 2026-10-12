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
      // 1. Admin login
      if (email === 'admin@scar.local' && password === 'AdminSecurePassword123!') {
        const adminUser = {
          id: 'usr_admin_01',
          name: 'System Administrator',
          email: 'admin@scar.local',
          role: 'admin',
          permissions: ALL_PERMISSIONS,
        };
        setUser(adminUser);
        return { success: true, user: adminUser };
      }

      // 2. Manager login (demo preset)
      if (email === 'manager@scar.local' && password === 'ManagerSecurePassword123!') {
        const managerUser = {
          id: 'usr_manager_01',
          name: 'Priya Sharma (Catalog & Growth Manager)',
          email: 'manager@scar.local',
          role: 'manager',
          permissions: MANAGER_PRESET_PERMISSIONS, // Cannot publish directly unless granted
        };
        setUser(managerUser);
        return { success: true, user: managerUser };
      }

      // 3. Customer demo login
      const customerUser = {
        id: 'usr_cust_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0].toUpperCase(),
        email,
        role: 'customer',
        permissions: [],
      };
      setUser(customerUser);
      return { success: true, user: customerUser };
    } finally {
      setIsLoading(false);
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
