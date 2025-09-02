import React from 'react';
import { BookOpen, TrendingUp, User, Users } from 'lucide-react';
import materialIcon from '../../assets/graduation.png';

// Create a proper component for the material icon
const MaterialIcon = ({ className }) => (
  <img src={materialIcon} className={className} alt="Material" loading="lazy" />
);

const Sidebar = ({ activeSection, onSectionChange }) => {
  const myStuffItems = [
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'material', label: 'Material', icon: MaterialIcon },
    { id: 'test', label: 'Test', icon: BookOpen },

  ];

  const myAccountItems = [
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
    // { id: 'teachers', label: 'Teachers', icon: Users },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* MY STUFF Section */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">MY STUFF</h3>
        <ul className="space-y-1">
          {myStuffItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors duration-300 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* MY ACCOUNT Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">MY ACCOUNT</h3>
        <ul className="space-y-1">
          {myAccountItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors duration-300 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;