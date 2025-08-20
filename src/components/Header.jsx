import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <GraduationCap className="text-blue-600 w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">EduLearn Platform</h1>
          </div>
          <div className="flex space-x-3">
            <button className="group relative overflow-hidden px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button className="group relative overflow-hidden px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
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