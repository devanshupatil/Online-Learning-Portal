import React from 'react';

import TeacherDashboard from './TeacherDashboard';

const TeachersPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="bg-white">
        {/* Teacher Dashboard */}
        <TeacherDashboard />
      </div>
    </div>
  );
};

export default TeachersPage;