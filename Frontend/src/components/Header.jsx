import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarProvider';
import HamburgerIcon from './HamburgerIcon';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();

  // Check if current route is learner or teacher section
  const isLearnerOrTeacherSection = location.pathname.startsWith('/learners') || location.pathname.startsWith('/teachers');

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Hamburger Icon - Mobile Only & Learner/Teacher Sections Only */}
            {isLearnerOrTeacherSection && (
              <div className="block md:hidden">
                <HamburgerIcon
                  isOpen={isSidebarOpen}
                  onClick={toggleSidebar}
                  className="text-white hamburger-mobile-only"
                />
              </div>
            )}
            
            {/* Logo and Title */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">EduLearn Platform</h1>
          </div>
          
          {/* Right side CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* <button 
              onClick={() => navigate('/login')} 
              className="cta-button cta-secondary group relative overflow-hidden px-4 sm:px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base min-h-[40px]"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="cta-button cta-primary group relative overflow-hidden px-4 sm:px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base min-h-[40px]"
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* CTA Button Enhancements */
        .cta-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease-out;
        }

        .cta-button:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .cta-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .cta-button:hover::before {
          transform: translateX(100%);
        }

        .cta-button:active {
          transform: scale(0.95);
        }

        /* Enhanced shadow for CTA buttons */
        .cta-button:hover {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .cta-primary:hover {
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.25);
        }

        /* Mobile hamburger positioning */
        .hamburger-mobile-only {
          display: block;
        }

        /* Hide on tablet and desktop */
        @media (min-width: 768px) {
          .hamburger-mobile-only {
            display: none;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .cta-button {
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
          }
        }

        /* Focus styles for accessibility */
        .cta-button:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.8);
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .cta-button {
            border: 2px solid currentColor;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .cta-button,
          .cta-button::before {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;