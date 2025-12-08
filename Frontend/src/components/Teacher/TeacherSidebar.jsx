import React, { memo } from 'react';
import { BookOpen, Users, FileText, Calendar, BarChart3 } from 'lucide-react';

const TeacherSidebar = memo(({ activeSection, onSectionChange, onClose, isMobile = false }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'tests', label: 'Tests', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'students', label: 'Students', icon: Users },
  ];

  // Handle section change and auto-close on mobile
  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`bg-white shadow-lg border border-gray-200 h-full ${isMobile ? 'p-4' : 'p-6 rounded-2xl'}`}>
      <h3 className={`text-sm font-bold text-gray-500 uppercase tracking-wider ${isMobile ? 'mb-4' : 'mb-3'}`}>TEACHER TOOLS</h3>
      <ul className={`${isMobile ? 'space-y-2' : 'space-y-1'}`}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => handleSectionChange(item.id)}
                className={`sidebar-nav-button cursor-pointer w-full flex items-center rounded-lg text-left transition-all duration-300 relative overflow-hidden ${
                  isMobile ? 'px-4 py-4 text-base' : 'px-3 py-2 text-sm'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium border-l-4 border-blue-500 shadow-sm active'
                    : 'text-gray-700 hover:bg-gray-100 hover:transform hover:translate-x-1 hover:shadow-md'
                }`}
              >
                <IconComponent className={`transition-transform duration-200 icon ${isMobile ? 'w-6 h-6 mr-4' : 'w-5 h-5 mr-3'} ${isActive ? 'scale-110' : ''}`} />
                <span className="relative z-10">{item.label}</span>
                
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 hover-overlay"></div>
                
                {/* Active pulse effect */}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        .sidebar-nav-button {
          position: relative;
          will-change: transform;
        }

        .sidebar-nav-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.15));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 0.5rem;
        }

        .sidebar-nav-button:hover::before {
          opacity: 1;
        }

        .sidebar-nav-button:hover .hover-overlay {
          opacity: 0.1;
        }

        .sidebar-nav-button:hover .icon {
          transform: scale(1.1);
        }

        .sidebar-nav-button:active {
          transform: scale(0.98);
        }

        /* Ripple effect on click */
        .sidebar-nav-button:active::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
          border-radius: 0.5rem;
          animation: ripple 0.6s ease-out;
        }

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        /* Enhanced active state */
        .sidebar-nav-button.active {
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        /* Focus styles for accessibility */
        .sidebar-nav-button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .sidebar-nav-button,
          .sidebar-nav-button::before,
          .sidebar-nav-button::after,
          .icon {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .sidebar-nav-button {
            border: 1px solid currentColor;
          }
          
          .sidebar-nav-button.active {
            background: currentColor !important;
            color: white !important;
          }
        }
      `}</style>
    </div>
  );
});

export default TeacherSidebar;