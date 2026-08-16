import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SiteFooter } from '../SiteChrome';
import LearnerNavbar from './LearnerNavbar';
import LearnerOverview from './LearnerOverview';
import UserProfileCard from './UserProfileCard';
import CoursesList from './CoursesList';
import Material from './Material';
import AddCourseModal from './AddCourseModal';
import EditProfileModal from './EditProfileModal';
import WeeklyStreakIndicator from './WeeklyStreakIndicator';
import Test from './Tests';
import TestResults from './TestResults';
import ProgressTracking from './ProgressTracking';

const initialCourses = [
  {
    id: 1,
    title: 'Advanced Algorithms & Data Structures',
    category: 'Computer Science',
    description: 'Master complex algorithms, optimization techniques, and advanced data structures for software engineering.',
    instructor: 'Dr. Alan Turing',
    instructorInitials: 'AT',
    progress: 68,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGmnaWQvIPKEKP3NbRLOVon0_DCL9UCEudtRwTWEbdHKtLcGe6qlOYGlSguQiypQyRGJYZSNvxMXRs77d4_s93iG5nbc75FIZjcbjhwo_98yNb2XWTtZ5OUeX2hECyd5J1pqdwsari32pcKuTfiM3Gv9Wv9eQ1CgNGrzandPrwDHJt_RTUboLX41K0Cgjeio6SAHn16IrMYk2Ud0LYXxlmxDrJ6p0xyH-VykKBNsnmZrDj6Vkvn5jXHA'
  },
  {
    id: 2,
    title: 'Macroeconomic Principles II',
    category: 'Economics',
    description: 'An in-depth analysis of global economic trends, fiscal policies, and monetary systems.',
    instructor: 'Prof. Sarah Jenkins',
    instructorInitials: 'SJ',
    progress: 32,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2Cx12sJqioVKmY1Ry0OtopEybMOnWKPom3WVU75NkxAtTHnzF9E9LJ9g8HAYr-GzrEJQSzF0BEdibho7LZVAIpzFJ1vMYJo_-TUvEySmzY7rpafNiPnGaxPFw2d9LKUqlfm0uIQI41ZoDJ5-zt-6-7G4DIjrrj5ARl6zhMoazgHUAMyeqdQ0D7Ek1t0jCGrdCggqrxqf6d23KGQJKxpdr7XMzYa48O4Bjglda3GiG6s3mMjtAMGospg'
  },
  {
    id: 3,
    title: 'UX Research & Interaction Design',
    category: 'Design',
    description: 'Learn the fundamentals of user-centered design, usability testing, and crafting intuitive interfaces.',
    instructor: 'David Chen',
    instructorInitials: 'DC',
    progress: 89,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP0Kz1vjJIKaeHvYNAbiNEvaJztTQ7PTm7qnw0HteE3WsBu9oGkE_-rkiT38ouylwlgEJa3zT0kZyX3MLCAttmVI2LDfXLCJQceWc7yQzdruday8xNF37oO2ZMVCOBKJK-_0iQE2UGv3kEUnyy05h5OQHmdox4RCm3p-Smfmq2sAvoMoYhnSEvCtV7PYTYH-LprlV0f86VTS3sKIadZDtLUDpvZxznmGT63Oj7pKdHV_Z1GHIBYovfuA'
  }
];

const NewLearnerDashboard = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [courses, setCourses] = useState(initialCourses);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [testTab, setTestTab] = useState('Test');

  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location.state]);

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
    const newCourse = {
      id: Date.now(),
      title: courseData.title || 'Untitled Course',
      category: courseData.category || 'General',
      description: courseData.description || '',
      instructor: courseData.instructor || 'Unknown',
      instructorInitials: (courseData.instructor || 'Unknown')
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      progress: 0,
      thumbnail: courseData.thumbnail || ''
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const handleEditProfile = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = (updatedProfileData) => {
    setProfileData(updatedProfileData);
  };

  const handleViewAllResults = () => {
    setTestTab('Test Results');
    setActiveSection('test');
  };

  const testTabItems = [
    { id: 'Test', labelKey: 'learnerTestTab' },
    { id: 'Test Results', labelKey: 'learnerTestResultsTab' }
  ];

  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden min-h-screen">
      <LearnerNavbar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="pt-20 px-6 pb-12 flex flex-col min-h-screen max-w-[1440px] mx-auto w-full">
        <div>
          {activeSection === 'dashboard' && (
            <LearnerOverview
              courses={courses}
              profileName={profileData.name}
              streak={profileData.streak}
            />
          )}

          {activeSection === 'syllabus' && (
            <div className="space-y-6">
              <CoursesList
                courses={courses}
                onAddCourse={() => setIsAddCourseModalOpen(true)}
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
              <ProgressTracking onViewAllResults={handleViewAllResults} />
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
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-6 border-b border-outline-variant">
                  <div className="inline-flex bg-surface-container-high rounded-full p-1 gap-1">
                    {testTabItems.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setTestTab(tab.id)}
                        className={`cursor-pointer flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          testTab === tab.id
                            ? 'bg-surface-container-lowest text-primary shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-container-lowest/50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {tab.id === 'Test' ? 'quiz' : 'fact_check'}
                        </span>
                        <span className="font-sans">{t(tab.labelKey)}</span>
                      </button>
                    ))}
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
      </main>

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

      <SiteFooter />
    </div>
  );
};

export default NewLearnerDashboard;
