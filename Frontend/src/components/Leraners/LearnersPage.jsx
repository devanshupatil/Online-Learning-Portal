import React from 'react';

import NewLearnerDashboard from './NewLearnerDashboard';

// LearnersPage: thin wrapper — NewLearnerDashboard renders its own
// layout, navbar, and SiteFooter internally.
const LearnersPage = () => {
  return <NewLearnerDashboard />;
};

export default LearnersPage;