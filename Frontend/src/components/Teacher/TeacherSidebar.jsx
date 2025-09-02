import React from 'react';
import { BookOpen, Users, FileText, Calendar, BarChart3 } from 'lucide-react';

const TeacherSidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'tests', label: 'Tests', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'students', label: 'Students', icon: Users },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">TEACHER TOOLS</h3>
      <ul className="space-y-1">
        {menuItems.map((item) => {
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
  );
};

export default TeacherSidebar;