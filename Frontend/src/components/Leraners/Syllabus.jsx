import React from 'react';
import { BookOpen } from 'lucide-react';

const Syllabus = () => {
  // Mock data for syllabus
  const syllabusData = [
    {
      id: 1,
      subject: 'Mathematics',
      topic: 'Algebra Fundamentals',
      week: 'Week 1-2',
      status: 'completed'
    },
    {
      id: 2,
      subject: 'Physics',
      topic: 'Newton\'s Laws of Motion',
      week: 'Week 3-4',
      status: 'in-progress'
    },
    {
      id: 3,
      subject: 'Chemistry',
      topic: 'Periodic Table',
      week: 'Week 5-6',
      status: 'upcoming'
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Syllabus</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {syllabusData.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-300 hover:border-blue-300">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.subject}</p>
              <p className="text-sm text-gray-600 mt-1">{item.topic}</p>
              <p className="text-xs text-gray-500 mt-1">{item.week}</p>
            </div>
            <div className="flex items-center">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300">
          View Full Syllabus
        </button>
      </div>
    </div>
  );
};

export default Syllabus;