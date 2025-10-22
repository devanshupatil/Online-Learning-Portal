import React from 'react';
import { useSidebar } from './SidebarProvider';
import HamburgerIcon from './HamburgerIcon';

const SidebarToggle = ({ 
  className = '',
  size = 24,
  variant = 'default' // 'default', 'header', 'floating'
}) => {
  const { isOpen, toggle, isMobile, isTablet } = useSidebar();

  // Don't render on desktop unless explicitly needed
  const shouldRender = isMobile || isTablet;

  if (!shouldRender) {
    return null;
  }

  const baseClasses = `
    hamburger-button
    relative p-2 rounded-lg transition-all duration-300
    hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
    focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    active:scale-95
    ${className}
  `;

  const variantClasses = {
    default: 'bg-white shadow-sm border border-gray-200',
    header: 'bg-transparent hover:bg-white/10 focus:bg-white/10',
    floating: 'bg-white shadow-lg border border-gray-200 fixed top-4 left-4 z-50'
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${baseClasses} ${variantClasses[variant]}`}
      data-sidebar-toggle
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
      aria-controls="sidebar-navigation"
      role="button"
      tabIndex={0}
    >
      <HamburgerIcon 
        isOpen={isOpen} 
        size={size}
        className="transition-transform duration-200"
      />
      
      {/* Ripple effect container */}
      <span className="ripple-container absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
        <span className="ripple absolute bg-blue-500/20 rounded-full transform scale-0 transition-transform duration-300"></span>
      </span>

      <style jsx>{`
        .hamburger-button:active .ripple {
          transform: scale-100;
          animation: ripple-effect 0.6s ease-out;
        }

        @keyframes ripple-effect {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        .hamburger-button {
          position: relative;
          overflow: hidden;
        }

        .hamburger-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .hamburger-button:hover::before {
          transform: translateX(100%);
        }

        /* Focus visible for keyboard navigation */
        .hamburger-button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .hamburger-button {
            border: 2px solid currentColor;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .hamburger-button,
          .hamburger-button::before,
          .ripple {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </button>
  );
};

export default SidebarToggle;