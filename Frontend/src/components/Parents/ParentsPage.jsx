import React from 'react';

import ParentDashboard from './ParentDashboard';
import Footer from '../Footer';

const ParentsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white">
        <ParentDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default ParentsPage;