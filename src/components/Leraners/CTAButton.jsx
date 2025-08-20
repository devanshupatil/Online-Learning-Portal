import React from 'react';

/**
 * CTA Button with Advanced Hover Animation
 * 
 * This button features a multi-layered animation effect:
 * 1. Smooth color transition with gradient overlay
 * 2. Subtle scale transformation for depth
 * 3. Shadow enhancement for a "lifted" effect
 * 4. Text color transition for enhanced contrast
 * 
 * The animation uses a combination of CSS transitions and transforms
 * for optimal performance. The gradient overlay creates a dynamic
 * color shift effect on hover, while the scale and shadow changes
 * provide a tactile, interactive feel.
 * 
 * For mobile responsiveness:
 * - Touch targets are appropriately sized (minimum 44px)
 * - Hover effects are preserved for devices with hover capability
 * - Active states provide visual feedback for touch interactions
 */
const CTAButton = ({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary' // primary, secondary, accent
}) => {
  // Define button variants with appropriate color schemes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
    accent: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative 
        overflow-hidden 
        px-8 py-4 
        rounded-xl 
        font-bold 
        text-lg 
        transition-all 
        duration-300 
        transform 
        hover:scale-105 
        hover:shadow-xl
        active:scale-95
        focus:outline-none
        focus:ring-4
        focus:ring-opacity-50
        group
        min-w-[180px]
        min-h-[56px]
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {/* Gradient overlay for advanced hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
      
      {/* Text container with z-index to ensure visibility */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};

export default CTAButton;