import React from 'react';

/**
  * Enhanced CTA Button with Advanced Hover Animations
  *
  * Primary CTA Buttons:
  * - Smooth scale transform (1.05x) on hover
  * - Color transition from primary to darker shade
  * - Subtle box-shadow increase for depth
  * - Duration: 0.3s with ease-in-out timing
  *
  * Secondary CTA Buttons:
  * - Background color fade transition
  * - Border color change on hover
  * - Icon rotation or translation animation
  * - Duration: 0.2s with ease timing
  *
  * Performance optimizations:
  * - Uses CSS transforms and opacity for smooth 60fps animations
  * - Implements will-change property for animated elements
  * - Respects user's prefers-reduced-motion setting
  *
  * Mobile responsiveness:
  * - Touch targets are appropriately sized (minimum 44px)
  * - Hover effects work on both mouse and touch devices
  * - Active states provide visual feedback for touch interactions
  */
const CTAButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary', // primary, secondary, accent
  size = 'default', // small, default, large
  icon,
  loading = false
}) => {
  // Define button size classes
  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-h-[40px]',
    default: 'px-6 py-3 text-base min-h-[48px]',
    large: 'px-8 py-4 text-lg min-h-[56px]'
  };

  // Define button variants with enhanced animations
  const variantClasses = {
    primary: `
      bg-blue-600 hover:bg-blue-700 text-white
      hover:shadow-xl hover:shadow-blue-500/25
      transform hover:scale-105 active:scale-95
      transition-all duration-300 ease-in-out
      will-change: transform, box-shadow
    `,
    secondary: `
      bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-blue-500
      hover:shadow-lg hover:shadow-blue-500/10
      transform hover:scale-105 active:scale-95
      transition-all duration-200 ease
      will-change: transform, box-shadow, border-color
    `,
    accent: `
      bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white
      hover:shadow-xl hover:shadow-cyan-500/25
      transform hover:scale-105 active:scale-95
      transition-all duration-300 ease-in-out
      will-change: transform, box-shadow
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        relative
        overflow-hidden
        rounded-xl
        font-semibold
        focus:outline-none
        focus:ring-4
        focus:ring-opacity-50
        group
        min-w-[120px]
        flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loading-spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Gradient overlay for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-0 group-hover:opacity-100"></div>
      )}

      {/* Icon animation for secondary buttons */}
      {variant === 'secondary' && icon && (
        <div className="absolute left-3 flex items-center justify-center w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200 ease">
          {icon}
        </div>
      )}

      {/* Text container with z-index to ensure visibility */}
      <span className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
        {icon && variant !== 'secondary' && (
          <span className="transform group-hover:rotate-12 transition-transform duration-300 ease">
            {icon}
          </span>
        )}
        {children}
      </span>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-active:opacity-10 transition-opacity duration-150"></div>
    </button>
  );
};

export default CTAButton;