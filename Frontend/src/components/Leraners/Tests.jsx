import React from 'react';
import { FileCheck, Clock, Calendar } from 'lucide-react';

const Tests = () => {
  // Mock data for tests
  const testsData = [
    {
      id: 1,
      title: 'Algebra Fundamentals Quiz',
      subject: 'Mathematics',
      dueDate: '2023-05-25',
      status: 'pending',
      timeLimit: '30 min'
    },
    {
      id: 2,
      title: 'Physics Midterm Exam',
      subject: 'Physics',
      dueDate: '2023-06-01',
      status: 'upcoming',
      timeLimit: '2 hours'
    },
    {
      id: 3,
      title: 'Chemistry Lab Report',
      subject: 'Chemistry',
      dueDate: '2023-05-30',
      status: 'in-progress',
      timeLimit: 'N/A'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <FileCheck className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Tests</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {testsData.map((test) => (
          <div key={test.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-300 hover:border-purple-300">
            <div className="flex justify-between items-start">
              <p className="font-medium text-gray-900">{test.title}</p>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{test.subject}</p>
            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{test.dueDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{test.timeLimit}</span>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-300">
                {test.status === 'completed' ? 'Review Test' : 'Start Test'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button className="w-full text-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors duration-300">
          View All Upcoming Tests
        </button>
      </div>
    </div>
  );
};

export default Tests;