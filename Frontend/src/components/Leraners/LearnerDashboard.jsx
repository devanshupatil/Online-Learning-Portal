import React from 'react';
import MyStuffSection from './MyStuffSection';
import MyAccountSection from './MyAccountSection';

const LearnerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learner Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your personalized learning overview.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MY STUFF Section */}
          <MyStuffSection />
          
          {/* MY ACCOUNT Section */}
          <MyAccountSection />
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;