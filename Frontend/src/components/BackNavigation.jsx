import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackNavigation = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <button
      onClick={handleBackClick}
      className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group ${className}`}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
      {/* <span className="font-medium">{text}</span> */}
    </button>
  );
};

export default BackNavigation;