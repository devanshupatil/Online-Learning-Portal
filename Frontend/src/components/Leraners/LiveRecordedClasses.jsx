import React from 'react';
import { Play, Video, Clock, Calendar } from 'lucide-react';
import CTAButton from './CTAButton';

const LiveRecordedClasses = () => {
  // Mock data for live classes
  const liveClasses = [
    { subject: 'Mathematics', time: 'Today, 2:00 PM', instructor: 'Dr. Smith', duration: '60 min' },
    { subject: 'Physics', time: 'Tomorrow, 10:00 AM', instructor: 'Prof. Johnson', duration: '90 min' }
  ];

  // Mock data for recorded classes
  const recordedClasses = [
    { title: 'Algebra Basics', duration: '45 min', date: '2 days ago', views: 120 },
    { title: 'Newton\'s Laws', duration: '60 min', date: '1 week ago', views: 89 },
    { title: 'Chemical Reactions', duration: '50 min', date: '3 days ago', views: 156 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <Video className="w-6 h-6 text-red-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Live & Recorded Classes</h2>
      </div>
      
      {/* Live Classes Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          Live Classes
        </h3>
        <div className="space-y-4">
          {liveClasses.map((classItem, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h4 className="font-bold text-gray-900">{classItem.subject}</h4>
                  <p className="text-sm text-gray-600">{classItem.instructor}</p>
                  <div className="flex flex-wrap items-center mt-1 text-sm text-gray-500 gap-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{classItem.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{classItem.time}</span>
                    </div>
                  </div>
                </div>
                <CTAButton variant="primary" className="px-4 py-2 text-sm min-w-0 min-h-0 flex items-center md:self-start">
                  <Play className="w-4 h-4 mr-1" />
                  Join Now
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recorded Classes Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recorded Classes</h3>
        <div className="space-y-3">
          {recordedClasses.map((classItem, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 gap-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Play className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{classItem.title}</h4>
                  <div className="flex flex-wrap text-xs text-gray-500 gap-1">
                    <span>{classItem.duration}</span>
                    <span>•</span>
                    <span>{classItem.date}</span>
                    <span>•</span>
                    <span>{classItem.views} views</span>
                  </div>
                </div>
              </div>
              <CTAButton variant="primary" className="px-3 py-1 text-sm min-w-0 min-h-0 self-start sm:self-center">
                Watch
              </CTAButton>
            </div>
          ))}
        </div>
      </div>
      
      {/* View All Button */}
      <div className="text-center mt-6">
        <CTAButton variant="secondary">
          View All Classes
        </CTAButton>
      </div>
    </div>
  );
};

export default LiveRecordedClasses;