import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarProvider';
import ResponsiveSidebar from './ResponsiveSidebar';
import Sidebar from './Leraners/Sidebar';
import TeacherSidebar from './Teacher/TeacherSidebar';

const MobileNavigationLayout = ({ children, activeSection, onSectionChange }) => {
  const location = useLocation();
  const { isOpen, isMobile, isTablet } = useSidebar();
  
  // Determine which sidebar to show based on route
  const isLearnerSection = location.pathname.startsWith('/learners');
  const isTeacherSection = location.pathname.startsWith('/teachers');
  const showSidebar = isLearnerSection || isTeacherSection;

  // Don't render sidebar on non-authenticated pages
  if (!showSidebar) {
    return <>{children}</>;
  }

  // Render appropriate sidebar content
  const renderSidebarContent = () => {
    if (isLearnerSection) {
      return (
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isMobile={isMobile || isTablet}
        />
      );
    }
    
    if (isTeacherSection) {
      return (
        <TeacherSidebar 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isMobile={isMobile || isTablet}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="mobile-navigation-layout">
      {/* Mobile/Tablet: Overlay sidebar */}
      {(isMobile || isTablet) && (
        <ResponsiveSidebar>
          {renderSidebarContent()}
        </ResponsiveSidebar>
      )}
      
      {/* Desktop: Side-by-side layout */}
      {!isMobile && !isTablet && (
        <div className="flex min-h-screen">
          <ResponsiveSidebar className="flex-shrink-0">
            {renderSidebarContent()}
          </ResponsiveSidebar>
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      )}
      
      {/* Mobile/Tablet: Full-width content */}
      {(isMobile || isTablet) && (
        <main className="min-h-screen">
          {children}
        </main>
      )}

      <style jsx>{`
        .mobile-navigation-layout {
          position: relative;
          min-height: 100vh;
        }

        /* Prevent body scroll when mobile sidebar is open */
        :global(body.sidebar-open) {
          overflow: hidden;
          position: fixed;
          width: 100%;
        }

        /* Smooth transitions for layout changes */
        main {
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .mobile-navigation-layout {
            overflow-x: hidden;
          }
        }

        /* Tablet optimizations */
        @media (min-width: 768px) and (max-width: 1023px) {
          .mobile-navigation-layout {
            display: flex;
            flex-direction: column;
          }
        }

        /* Desktop optimizations */
        @media (min-width: 1024px) {
          .mobile-navigation-layout {
            display: block;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          main {
            transition: none !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .mobile-navigation-layout {
            border: 1px solid currentColor;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileNavigationLayout;