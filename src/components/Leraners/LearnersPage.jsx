import React from 'react';

import LearnersNavigation from './LearnersNavigation';
import NewLearnerDashboard from './NewLearnerDashboard';

const LearnersPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="bg-white">
        {/* Learners Navigation */}
        {/* <LearnersNavigation /> */}
        
        {/* New Learner Dashboard */}
        <NewLearnerDashboard />
      </div>
    </div>
  );
};

export default LearnersPage;