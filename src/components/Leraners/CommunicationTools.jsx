import React from 'react';
import { MessageCircle, Bell, Users, Mail } from 'lucide-react';
import CTAButton from './CTAButton';

const CommunicationTools = () => {
  // Mock data for notifications
  const notifications = [
    {
      title: 'New assignment posted',
      time: '2 hours ago',
      unread: true
    },
    {
      title: 'Class reminder: Mathematics',
      time: '1 day ago',
      unread: false
    },
    {
      title: 'Grade updated for Physics quiz',
      time: '2 days ago',
      unread: true
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <MessageCircle className="w-6 h-6 text-teal-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Communication Tools</h2>
      </div>
      
      {/* Chat/Messages */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-teal-600" />
          Messages
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors duration-300 cursor-pointer">
            <div className="flex justify-between flex-wrap gap-1">
              <h4 className="font-medium text-gray-900">Dr. Smith</h4>
              <span className="text-xs text-gray-500">10:30 AM</span>
            </div>
            <p className="text-sm text-gray-600 truncate">Regarding your assignment submission...</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
            <div className="flex justify-between flex-wrap gap-1">
              <h4 className="font-medium text-gray-900">Study Group</h4>
              <span className="text-xs text-gray-500">Yesterday</span>
            </div>
            <p className="text-sm text-gray-600 truncate">Let's meet tomorrow for the group study...</p>
          </div>
        </div>
        <CTAButton variant="primary" className="mt-4 w-full py-2 text-sm min-w-0 min-h-0">
          Open Chat
        </CTAButton>
      </div>
      
      {/* Notifications */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-orange-600" />
          Notifications
        </h3>
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                notification.unread
                  ? 'bg-orange-50 border-l-4 border-orange-500'
                  : 'bg-gray-50'
              }`}
            >
              <p className="font-medium text-gray-900">{notification.title}</p>
              <p className="text-sm text-gray-500">{notification.time}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Community */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          Community
        </h3>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-gray-700 mb-3">Connect with fellow learners in your course community</p>
          <CTAButton variant="secondary" className="px-4 py-2 text-sm min-w-0 min-h-0">
            Join Discussion
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default CommunicationTools;