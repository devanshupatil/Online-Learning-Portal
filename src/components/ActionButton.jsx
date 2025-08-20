import React from 'react';

// Prop types can be defined using PropTypes below if needed

const ActionButton = () => ({ 
  children, 
  variant = 'primary', 
  color = 'bg-blue-600 hover:bg-blue-700',
  className = '',
  onClick 
}) => {
  const baseClasses = "relative overflow-hidden px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg group";
  
  const variantClasses = variant === 'primary' 
    ? `${color} text-white`
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
    </button>
  );
};

export default ActionButton;