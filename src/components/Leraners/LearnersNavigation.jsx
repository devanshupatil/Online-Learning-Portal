import React from 'react';
import { Link } from 'react-router-dom';

const LearnersNavigation = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex space-x-8">
            <Link
              to="/learners"
              className="relative font-medium transition-colors duration-300 group text-blue-600"
            >
              Learners
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600"></span>
            </Link>
            <Link
              to="/teachers"
              className="relative font-medium transition-colors duration-300 group text-gray-700 hover:text-blue-600"
            >
              Teachers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/parents"
              className="relative font-medium transition-colors duration-300 group text-gray-700 hover:text-blue-600"
            >
              Parents
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">
              Login
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LearnersNavigation;