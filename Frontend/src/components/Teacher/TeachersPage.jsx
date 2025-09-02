import React from 'react';

import TeacherDashboard from './TeacherDashboard';
import Footer from '../Footer';

const TeachersPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="bg-white">
        {/* Teacher Dashboard */}
        <TeacherDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default TeachersPage;