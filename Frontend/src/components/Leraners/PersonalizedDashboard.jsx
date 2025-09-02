import React from 'react';
import { Calendar, BarChart3, TrendingUp } from 'lucide-react';
import CTAButton from './CTAButton';

const PersonalizedDashboard = () => {
  // Mock data for upcoming classes
  const upcomingClasses = [
    { subject: 'Mathematics', time: 'Today, 2:00 PM', instructor: 'Dr. Smith' },
    { subject: 'Physics', time: 'Tomorrow, 10:00 AM', instructor: 'Prof. Johnson' },
    { subject: 'Chemistry', time: 'Tomorrow, 3:00 PM', instructor: 'Dr. Williams' }
  ];

  // Mock data for assignments
  const assignments = [
    { title: 'Algebra Homework', due: 'Due in 2 days', status: 'pending' },
    { title: 'Physics Lab Report', due: 'Due in 5 days', status: 'in-progress' },
    { title: 'Chemistry Quiz', due: 'Due today', status: 'urgent' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <Calendar className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Personalized Dashboard</h2>
      </div>
      
      {/* Upcoming Classes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Classes</h3>
        <div className="space-y-3">
          {upcomingClasses.map((classItem, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50 rounded-lg gap-2">
              <div>
                <p className="font-medium text-gray-900">{classItem.subject}</p>
                <p className="text-sm text-gray-600">{classItem.time}</p>
              </div>
              <CTAButton variant="primary" className="px-4 py-2 text-sm min-w-0 min-h-0">
                Join Class
              </CTAButton>
            </div>
          ))}
        </div>
      </div>
      
      {/* Assignment Schedule */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Assignment Schedule</h3>
        <div className="space-y-3">
          {assignments.map((assignment, index) => (
            <div key={index} className={`p-3 rounded-lg border-l-4 ${
              assignment.status === 'urgent' ? 'border-red-500 bg-red-50' :
                assignment.status === 'in-progress' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <p className="font-medium text-gray-900">{assignment.title}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  assignment.status === 'urgent' ? 'bg-red-100 text-red-800' :
                  assignment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {assignment.due}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress Chart Placeholder */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Progress Overview</h3>
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-32">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Progress visualization</p>
            <p className="text-gray-400 text-xs mt-1">Interactive charts will appear here</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">85%</p>
            <p className="text-sm text-gray-600">Course Completion</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">A</p>
            <p className="text-sm text-gray-600">Current Grade</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">12</p>
            <p className="text-sm text-gray-600">Active Courses</p>
          </div>
        </div>
        
        {/* CTA Button for View Progress */}
        <div className="mt-6 text-center">
          <CTAButton variant="secondary">
            View Detailed Progress
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;