import React from 'react';

import LearnersHeroSection from './LearnersHeroSection';
import LearnersNavigation from './LearnersNavigation';
import PersonalizedDashboard from './PersonalizedDashboard';
import CourseCatalog from './CourseCatalog';
import LiveRecordedClasses from './LiveRecordedClasses';
import InteractiveResources from './InteractiveResources';
import CommunicationTools from './CommunicationTools';
import GradesFeedback from './GradesFeedback';
import StudentProfile from './StudentProfile';
import SupportHelpdesk from './SupportHelpdesk';

const LearnersPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
         
      
      {/* Main Content */}
      <div className="bg-white">
        {/* Learners Navigation */}
        <LearnersNavigation />
        
        {/* Hero Section */}
        <LearnersHeroSection />
        
        {/* Features Section */}
        {/* Responsive grid: 1 column on mobile, 2 on medium screens, 3 on large screens */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Personalized Dashboard */}
            <PersonalizedDashboard />
            
            {/* Course Catalog */}
            <CourseCatalog />
            
            {/* Live/Recorded Classes */}
            <LiveRecordedClasses />
            
            {/* Interactive Resources */}
            <InteractiveResources />
            
            {/* Communication Tools */}
            <CommunicationTools />
            
            {/* Grades & Feedback */}
            <GradesFeedback />
            
            {/* Student Profile */}
            <StudentProfile />
            
            {/* Support/Helpdesk */}
            <SupportHelpdesk />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearnersPage;