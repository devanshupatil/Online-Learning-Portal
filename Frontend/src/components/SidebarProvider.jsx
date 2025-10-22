import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  // Initialize state from localStorage or default to false
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-open');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Track if we're on mobile/tablet for different behaviors
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Handle window resize to update responsive states
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 767);
      setIsTablet(width >= 768 && width <= 1023);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-open', JSON.stringify(isOpen));
  }, [isOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  // Toggle sidebar with useCallback for performance
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Close sidebar
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Open sidebar
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Handle outside click to close on mobile
  const handleOutsideClick = useCallback((event) => {
    if (isMobile && isOpen) {
      // Check if click is outside sidebar
      const sidebar = document.querySelector('[data-sidebar]');
      const toggle = document.querySelector('[data-sidebar-toggle]');
      
      if (sidebar && !sidebar.contains(event.target) && 
          toggle && !toggle.contains(event.target)) {
        close();
      }
    }
  }, [isMobile, isOpen, close]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape' && isOpen) {
      close();
    }
  }, [isOpen, close]);

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleOutsideClick, handleKeyDown]);

  // Auto-close sidebar on route changes for mobile
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMobile && isOpen) {
        close();
      }
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isMobile, isOpen, close]);

  const value = {
    isOpen,
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    toggle,
    close,
    open,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;