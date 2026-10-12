import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

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
      // In live backend mode, we call /api/v1/auth/login.
      // In standalone demo mode, verify against demo credentials:
      if (email === 'admin@scar.local' && password === 'AdminSecurePassword123!') {
        const adminUser = {
          id: 'usr_admin_01',
          name: 'System Administrator',
          email: 'admin@scar.local',
          role: 'admin',
        };
        setUser(adminUser);
        return { success: true, user: adminUser };
      }

      // Customer demo login
      const customerUser = {
        id: 'usr_cust_demo',
        name: email.split('@')[0].toUpperCase(),
        email,
        role: 'customer',
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
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
