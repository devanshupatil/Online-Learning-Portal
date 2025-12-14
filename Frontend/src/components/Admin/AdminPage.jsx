import React from 'react';

import AdminDashboard from './AdminDashboard';
import Footer from '../Footer';

const AdminPage = () => {
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