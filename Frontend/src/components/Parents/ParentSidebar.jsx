import React, { memo } from 'react';
import { Calendar, CheckCircle, Award } from 'lucide-react';

const ParentSidebar = memo(({ activeSection, onSectionChange, onClose, isMobile = false }) => {
  const menuItems = [
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle },
    { id: 'marks', label: 'Test Marks', icon: Award },
  ];

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`bg-white shadow-lg border border-gray-200 h-full ${isMobile ? 'p-4' : 'p-6 rounded-2xl'}`}>
      <h3 className={`text-sm font-bold text-gray-500 uppercase tracking-wider ${isMobile ? 'mb-4' : 'mb-3'}`}>PARENT PORTAL</h3>
      <ul className={`${isMobile ? 'space-y-2' : 'space-y-1'}`}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => handleSectionChange(item.id)}
                className={`cursor-pointer w-full flex items-center rounded-lg text-left transition-all duration-300 ${
                  isMobile ? 'px-4 py-4 text-base' : 'px-3 py-2 text-sm'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium border-l-4 border-blue-500 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1 hover:shadow-md'
                }`}
              >
                <IconComponent className={`${isMobile ? 'w-6 h-6 mr-4' : 'w-5 h-5 mr-3'} ${isActive ? 'scale-110' : ''}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default ParentSidebar;
