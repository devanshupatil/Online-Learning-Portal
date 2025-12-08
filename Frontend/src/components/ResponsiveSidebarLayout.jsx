import React, { memo } from 'react';
import { SidebarProvider } from './SidebarProvider';
import ResponsiveSidebar from './ResponsiveSidebar';
import SidebarToggle from './SidebarToggle';
import '../styles/sidebar-animations.css';

/**
 * ResponsiveSidebarLayout - A complete responsive sidebar layout component
 * 
 * This component provides:
 * - Responsive behavior across all screen sizes
 * - Hamburger menu toggle for mobile/tablet
 * - Smooth animations and micro-interactions
 * - Accessibility features
 * - Performance optimizations
 * 
 * Usage:
 * <ResponsiveSidebarLayout 
 *   sidebar={<YourSidebarComponent />}
 *   header={<YourHeaderComponent />}
 * >
 *   <YourMainContent />
 * </ResponsiveSidebarLayout>
 */
const ResponsiveSidebarLayout = memo(({ 
  children, 
  sidebar, 
  header,
  className = '',
  sidebarSide = 'left'
}) => {
  return (
    <SidebarProvider>
      <div className={`responsive-sidebar-layout min-h-screen bg-gray-50 ${className}`}>
        {/* Header with hamburger toggle */}
        {header && (
          <header className="header-with-toggle sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
              <SidebarToggle variant="header" className="lg:hidden" />
              <div className="flex-1 ml-4 lg:ml-0">
                {header}
              </div>
            </div>
          </header>
        )}

        <div className="flex min-h-screen">
          {/* Responsive Sidebar */}
          <ResponsiveSidebar side={sidebarSide} className="sidebar-container">
            {sidebar}
          </ResponsiveSidebar>

          {/* Main Content Area */}
          <main className="main-content flex-1 p-6 lg:p-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        <style jsx>{`
          .responsive-sidebar-layout {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            overflow-x: hidden;
            max-width: 100vw;
          }

          .header-with-toggle {
            backdrop-filter: blur(8px);
            background-color: rgba(255, 255, 255, 0.95);
          }

          .main-content {
            min-height: calc(100vh - 73px); /* Adjust based on header height */
          }

          /* Responsive adjustments */
          @media (min-width: 1024px) {
            .main-content {
              margin-left: 0;
            }
          }

          @media (max-width: 1023px) {
            .main-content {
              width: 100%;
            }
          }

          /* Loading state */
          .sidebar-container.loading {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          /* Focus management */
          .responsive-sidebar-layout:focus-within {
            outline: none;
          }

          /* Print styles */
          @media print {
            .header-with-toggle,
            .sidebar-container {
              display: none !important;
            }
            
            .main-content {
              margin: 0 !important;
              padding: 0 !important;
              max-width: none !important;
            }
          }
        `}</style>
      </div>
    </SidebarProvider>
  );
});

ResponsiveSidebarLayout.displayName = 'ResponsiveSidebarLayout';

export default ResponsiveSidebarLayout;