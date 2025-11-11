import React, { useState } from 'react';
import { BookOpen, TrendingUp, User, Users } from 'lucide-react';
import Header from '../Header';
import UserProfileCard from './UserProfileCard';
import CoursesList from './CoursesList';
import Material from './Material';
import Sidebar from './Sidebar';
import AddCourseModal from './AddCourseModal';
import EditProfileModal from './EditProfileModal';
import WeeklyStreakIndicator from './WeeklyStreakIndicator';
import Test from './Tests';
import TestResults from './TestResults';
import ProgressTracking from './ProgressTracking';
import BackNavigation from '../BackNavigation';
import ResponsiveSidebar from '../ResponsiveSidebar';
import { useSidebar } from '../SidebarProvider';

const NewLearnerDashboard = () => {
  const [activeSection, setActiveSection] = useState('syllabus');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const { isMobile, isTablet } = useSidebar();
  const [testTab, setTestTab] = useState('Test');

  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate learner focused on mathematics and science. Enjoys collaborative problem-solving and exploring new technologies.',
    level: 12,
    progress: 75,
    streak: 5
  });

  const handleAddCourse = (courseData) => {
    console.log('Adding new course:', courseData);
    // In a real app, this would add the course to the user's enrolled courses
  };

  const handleEditCourses = () => {
    console.log('Editing courses');
    // In a real app, this would open the course editing interface
  };

  const handleEditProfile = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = (updatedProfileData) => {
    setProfileData(updatedProfileData);
    console.log('Profile updated:', updatedProfileData);
    // In a real app, this would send the data to a server
  };

  return (
    <div>
      <Header />

      {/* Mobile Slide-out Sidebar */}
      {(isMobile || isTablet) && (
        <ResponsiveSidebar>
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isMobile={isMobile || isTablet}
          />
        </ResponsiveSidebar>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <BackNavigation className='cursor-pointer' />
              <h1 className="text-3xl font-bold text-gray-900">Learner Dashboard</h1>
            </div>
            <p className="text-gray-600">Welcome back, {profileData.name}! Here's your personalized learning overview.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation - Desktop Only */}
            <div className="lg:w-1/4 sticky top-25 self-start hidden lg:block">
              <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            </div>

            {/* Main Content Area */}
            <div className="lg:w-3/4">
              {activeSection === 'syllabus' && (
                <div className="space-y-6">
                  <CoursesList
                    onAddCourse={() => setIsAddCourseModalOpen(true)}
                    onEditCourses={handleEditCourses}
                  />
                </div>
              )}

              {activeSection === 'material' && (
                <div className="space-y-6">
                  <Material />
                </div>
              )}

              {activeSection === 'progress' && (
                <div className="space-y-6">
                  <ProgressTracking />
                </div>
              )}

              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <UserProfileCard onEditProfile={handleEditProfile} />
                  <WeeklyStreakIndicator streak={profileData.streak} />
                </div>
              )}



              {activeSection === 'test' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => setTestTab('Test')}
                          className={`cursor-pointer flex items-center px-5 py-3 rounded-lg transition-colors duration-200 ${testTab === 'Test'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            } text-xl font-bold`}
                        >
                          Test
                        </button>
                        <button
                          onClick={() => setTestTab('Test Results')}
                          className={`cursor-pointer flex items-center px-5 py-3 rounded-lg transition-colors duration-200 ${testTab === 'Test Results'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            } text-xl font-bold`}
                        >
                          Test Results
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {testTab === 'Test' && <Test />}
                      {testTab === 'Test Results' && <TestResults />}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onAddCourse={handleAddCourse}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profileData={profileData}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default NewLearnerDashboard;