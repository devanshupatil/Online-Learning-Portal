import React from 'react';

import LearnersNavigation from './LearnersNavigation';
import NewLearnerDashboard from './NewLearnerDashboard';
import Footer from '../Footer';

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
      <Footer />
    </div>
  );
};

export default LearnersPage;