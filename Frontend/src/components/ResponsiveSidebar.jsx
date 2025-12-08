import React, { useEffect, useRef } from 'react';
import { useSidebar } from './SidebarProvider';

const ResponsiveSidebar = ({ 
  children, 
  className = '',
  side = 'right' // 'left' or 'right'
}) => {
  const { isOpen, isMobile, isTablet, isDesktop, close } = useSidebar();
  const sidebarRef = useRef(null);

  // Handle focus management when sidebar opens/closes
  useEffect(() => {
    if (isOpen && (isMobile || isTablet)) {
      // Focus the first focusable element in the sidebar
      const firstFocusable = sidebarRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen, isMobile, isTablet]);

  // Handle swipe gestures on mobile
  useEffect(() => {
    if (!isMobile) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;

      // Prevent default scrolling when swiping
      if (Math.abs(currentX - startX) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      const deltaX = currentX - startX;
      const threshold = 50;

      if (side === 'left') {
        // Swipe right to open, left to close
        if (deltaX > threshold && !isOpen) {
          // Open sidebar
        } else if (deltaX < -threshold && isOpen) {
          close();
        }
      } else if (side === 'right') {
        // Swipe left to open, right to close
        if (deltaX < -threshold && !isOpen) {
          // Open sidebar
        } else if (deltaX > threshold && isOpen) {
          close();
        }
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('touchstart', handleTouchStart, { passive: false });
      sidebar.addEventListener('touchmove', handleTouchMove, { passive: false });
      sidebar.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('touchstart', handleTouchStart);
        sidebar.removeEventListener('touchmove', handleTouchMove);
        sidebar.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isMobile, isOpen, close, side]);

  // Desktop: Always visible
  if (isDesktop) {
    return (
      <div 
        ref={sidebarRef}
        className={`sidebar-desktop ${className}`}
        data-sidebar
        id="sidebar-navigation"
      >
        {React.cloneElement(children, {
          onClose: close,
          isMobile: false
        })}
        <style jsx>{`
          .sidebar-desktop {
            position: relative;
            width: 280px;
            flex-shrink: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Smooth entrance animation */
          .sidebar-desktop {
            animation: ${side === 'left' ? 'slideInFromLeft' : 'slideInFromRight'} 0.5s ease-out;
          }

          @keyframes slideInFromLeft {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideInFromRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  // Mobile/Tablet: Overlay with backdrop
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-overlay fixed inset-0 bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={close}
          style={{ backdropFilter: 'blur(4px)' }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar-mobile fixed top-0 h-full w-80 bg-white z-50 shadow-2xl ${
          side === 'left' ? 'left-0' : 'right-0'
        } ${
          isOpen ? 'sidebar-open' : 'sidebar-closed'
        } ${className}`}
        data-sidebar
        id="sidebar-navigation"
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        {/* Back Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={close}
            className="back-button p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go back"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Sidebar content with staggered animation */}
        <div className={`sidebar-content h-full overflow-y-auto ${isOpen ? 'animate-content' : ''}`}>
          {React.cloneElement(children, {
            onClose: close,
            isMobile: isMobile || isTablet
          })}
        </div>

        <style jsx="true">{`
          .sidebar-mobile {
            will-change: transform;
            contain: layout style paint;
            transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          /* Closed state - hidden off screen */
          .sidebar-mobile.sidebar-closed {
            transform: ${side === 'left' ? 'translateX(-100%)' : 'translateX(100%)'};
          }

          /* Open state - smoothly slides in */
          .sidebar-mobile.sidebar-open {
            transform: translateX(0);
            animation: smoothSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          @keyframes smoothSlideIn {
            0% {
              transform: ${side === 'left' ? 'translateX(-50%)' : 'translateX(50%)'};
              opacity: 0.7;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          /* Content staggered animation */
          .sidebar-content.animate-content > * {
            animation: slideInStagger 0.5s ease-out forwards;
            opacity: 0;
            transform: ${side === 'left' ? 'translateX(-20px)' : 'translateX(20px)'};
          }

          .sidebar-content.animate-content > *:nth-child(1) { animation-delay: 0.2s; }
          .sidebar-content.animate-content > *:nth-child(2) { animation-delay: 0.3s; }
          .sidebar-content.animate-content > *:nth-child(3) { animation-delay: 0.4s; }
          .sidebar-content.animate-content > *:nth-child(4) { animation-delay: 0.5s; }
          .sidebar-content.animate-content > *:nth-child(5) { animation-delay: 0.6s; }

          @keyframes slideInStagger {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /* Overlay animation */
          .sidebar-overlay {
            animation: fadeIn 0.6s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(4px);
            }
          }

          /* Mobile optimizations */
          @media (max-width: 767px) {
            .sidebar-mobile {
              width: min(320px, calc(100vw - 40px));
            }
          }

          /* Tablet optimizations */
          @media (min-width: 768px) and (max-width: 1023px) {
            .sidebar-mobile {
              width: 280px;
            }
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .sidebar-mobile,
            .sidebar-overlay,
            .sidebar-content > * {
              animation: none !important;
              transition: none !important;
            }
          }

          /* High contrast mode */
          @media (prefers-contrast: high) {
            .sidebar-mobile {
              ${side === 'right' ? 'border-left: 2px solid currentColor;' : 'border-right: 2px solid currentColor;'}
            }
          }

          /* Custom scrollbar for sidebar */
          .sidebar-content::-webkit-scrollbar {
            width: 6px;
          }

          .sidebar-content::-webkit-scrollbar-track {
            background: #f1f5f9;
          }

          .sidebar-content::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }

          .sidebar-content::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
      </div>
    </>
  );
};

export default ResponsiveSidebar;