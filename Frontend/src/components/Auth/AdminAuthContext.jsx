import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on app start
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    if (token && adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
    setIsLoading(false);
  }, []);

  // Demo mode: the real backend/DB isn't connected, so login is validated
  // against a fixed demo account instead of calling the API.
  const DEMO_ADMIN_EMAIL = 'admin@example.com';
  const DEMO_ADMIN_PASSWORD = 'admin123';

  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (email !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
      return { success: false, error: 'Invalid email or password' };
    }

    const demoAdmin = { id: 1, name: 'Admin', email: DEMO_ADMIN_EMAIL };
    localStorage.setItem('adminToken', 'demo-admin-token');
    localStorage.setItem('adminData', JSON.stringify(demoAdmin));

    setAdmin(demoAdmin);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    admin,
    isLoading,
    login,
    logout,
    getAuthHeaders,
    isAuthenticated: !!admin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};