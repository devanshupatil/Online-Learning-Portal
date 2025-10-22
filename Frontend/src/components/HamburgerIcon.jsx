import React from 'react';

const HamburgerIcon = ({ isOpen = false, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`hamburger-button ${className}`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      type="button"
    >
      <div className={`hamburger-container ${isOpen ? 'active' : ''}`}>
        <span className="hamburger-line line-1"></span>
        <span className="hamburger-line line-2"></span>
        <span className="hamburger-line line-3"></span>
      </div>
      
      <style jsx>{`
        .hamburger-button {
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
          border: none;
          cursor: pointer;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          contain: layout style paint;
        }

        .hamburger-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transform: scale(1.05);
        }

        .hamburger-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }

        .hamburger-button:active {
          transform: scale(0.95);
        }

        .hamburger-button:active .hamburger-container {
          transform: scale(0.9);
        }

        .hamburger-container {
          width: 24px;
          height: 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hamburger-line {
          width: 100%;
          height: 2px;
          background-color: white;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
          will-change: transform, opacity;
        }

        /* Staggered Line Animation */
        .hamburger-line:nth-child(1) {
          transition-delay: 0ms;
        }

        .hamburger-line:nth-child(2) {
          transition-delay: 50ms;
        }

        .hamburger-line:nth-child(3) {
          transition-delay: 100ms;
        }

        /* Hover Effects */
        .hamburger-button:hover .hamburger-line {
          background-color: rgba(255, 255, 255, 0.9);
          transform: scaleX(1.1);
        }

        /* Animation States */
        .hamburger-container.active .line-1 {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .hamburger-container.active .line-2 {
          opacity: 0;
          transform: scaleX(0);
        }

        .hamburger-container.active .line-3 {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        /* Shimmer effect */
        .hamburger-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
          border-radius: 0.5rem;
        }

        .hamburger-button:hover::before {
          transform: translateX(100%);
        }

        /* Focus visible for keyboard navigation */
        .hamburger-button:focus-visible {
          outline: 2px solid white;
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .hamburger-button {
            border: 2px solid currentColor;
          }
          
          .hamburger-line {
            background-color: currentColor;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .hamburger-line,
          .hamburger-button,
          .hamburger-button::before,
          .hamburger-container {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .hamburger-button {
            min-width: 44px;
            min-height: 44px;
          }
        }
      `}</style>
    </button>
  );
};

export default HamburgerIcon;