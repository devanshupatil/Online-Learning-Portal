import React, { useState } from 'react';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Video, 
  Book, 
  MessageCircle, 
  HelpCircle, 
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';
import MyStuffSection from './MyStuffSection';
import MyAccountSection from './MyAccountSection';
import PersonalizedDashboard from './PersonalizedDashboard';
import LiveRecordedClasses from './LiveRecordedClasses';
import CourseCatalog from './CourseCatalog';
import CommunicationTools from './CommunicationTools';
import SupportHelpdesk from './SupportHelpdesk';
import InteractiveResources from './InteractiveResources';
import GradesFeedback from './GradesFeedback';

const EnhancedLearnerDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  // Mock data for quick stats
  const quickStats = [
    { title: 'Active Courses', value: '12', icon: Book, color: 'bg-blue-100 text-blue-600' },
    { title: 'Upcoming Classes', value: '3', icon: Clock, color: 'bg-green-100 text-green-600' },
    { title: 'Pending Assignments', value: '5', icon: BookOpen, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Overall Progress', value: '85%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Learner Dashboard</h1>
              <p className="text-gray-600">Welcome back, Alex! Here's your personalized learning overview.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  AJ
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">Alex Johnson</p>
                <p className="text-sm text-gray-600">Student</p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mr-3`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Dashboard Navigation */}
        <div className="flex overflow-x-auto mb-6 pb-2">
          <div className="flex space-x-2 bg-white rounded-lg p-1 border border-gray-200">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeView === 'dashboard' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveView('courses')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeView === 'courses' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              My Courses
            </button>
            <button 
              onClick={() => setActiveView('resources')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeView === 'resources' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Resources
            </button>
            <button 
              onClick={() => setActiveView('community')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeView === 'community' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Community
            </button>
            <button 
              onClick={() => setActiveView('support')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeView === 'support' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Support
            </button>
          </div>
        </div>
        
        {/* Dashboard Content */}
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Dashboard */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MyStuffSection />
                <MyAccountSection />
              </div>
              <PersonalizedDashboard />
            </div>
            
            {/* Right Column - Additional Components */}
            <div className="space-y-6">
              <LiveRecordedClasses />
              <CommunicationTools />
            </div>
          </div>
        )}
        
        {/* Courses View */}
        {activeView === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CourseCatalog />
            </div>
            <div className="space-y-6">
              <GradesFeedback />
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Path</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div className="h-16 w-0.5 bg-gray-200 my-1"></div>
                    </div>
                    <div className="pb-4">
                      <h4 className="font-bold text-gray-900">Algebra Fundamentals</h4>
                      <p className="text-sm text-gray-600">Complete by June 15</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-bold">2</span>
                      </div>
                      <div className="h-16 w-0.5 bg-gray-200 my-1"></div>
                    </div>
                    <div className="pb-4">
                      <h4 className="font-bold text-gray-900">Trigonometry Basics</h4>
                      <p className="text-sm text-gray-600">Starts June 16</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-bold">3</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Calculus Introduction</h4>
                      <p className="text-sm text-gray-600">Starts July 1</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Resources View */}
        {activeView === 'resources' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InteractiveResources />
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Study Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Mathematics Practice</p>
                      <p className="text-sm text-gray-600">Today, 3:00 PM</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">1 hour</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Physics Reading</p>
                      <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">2 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Chemistry Lab Prep</p>
                      <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">1.5 hours</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Resources</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Advanced Calculus Guide</h4>
                    <p className="text-sm text-gray-600">PDF • 4.2 MB</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Physics Problem Solver</h4>
                    <p className="text-sm text-gray-600">Interactive Tool</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Chemistry Flashcards</h4>
                    <p className="text-sm text-gray-600">Study Set</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Community View */}
        {activeView === 'community' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Discussion Forums</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">Mathematics Help Group</h4>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">12 posts</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Discussion about calculus problems and solutions</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Latest post by Sarah M.</span>
                      <span className="mx-2">•</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">Physics Study Buddies</h4>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">8 posts</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Preparing for the midterm exam together</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Latest post by Mike T.</span>
                      <span className="mx-2">•</span>
                      <span>1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Study Groups</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Advanced Mathematics</h4>
                    <p className="text-sm text-gray-600">5 members • Meets Wed 4:00 PM</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Organic Chemistry</h4>
                    <p className="text-sm text-gray-600">3 members • Meets Fri 3:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Events</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Science Fair</h4>
                    <p className="text-sm text-gray-600">June 20, 2023 • 10:00 AM</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Study Workshop</h4>
                    <p className="text-sm text-gray-600">June 25, 2023 • 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Support View */}
        {activeView === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SupportHelpdesk />
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-900">Contact Instructor</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <div className="flex items-center">
                      <HelpCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="font-medium text-gray-900">Submit Feedback</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-purple-600 mr-3" />
                      <span className="font-medium text-gray-900">Report Issue</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Learning Platform</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Video Streaming</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Assignment Submission</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLearnerDashboard;