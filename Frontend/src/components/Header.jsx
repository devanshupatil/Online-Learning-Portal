import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">EduLearn Platform</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button className="cta-button cta-secondary group relative overflow-hidden px-4 sm:px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base min-h-[40px]">
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button className="cta-button cta-primary group relative overflow-hidden px-4 sm:px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base min-h-[40px]">
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;