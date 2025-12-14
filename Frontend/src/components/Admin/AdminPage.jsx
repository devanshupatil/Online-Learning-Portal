import React from 'react';
import { useAdminAuth } from '../Auth/AdminAuthContext';
import AdminDashboard from './AdminDashboard';
import AdminLogin from '../Auth/AdminLogin';
import Footer from '../Footer';

const AdminPage = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="bg-white">
        {/* Admin Dashboard */}
        <AdminDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;