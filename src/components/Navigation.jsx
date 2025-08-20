import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Exam Info', path: '/exam-info' },
    { name: 'Student', path: '/learners' },
    { name: 'Teacher', path: '/teachers' },
    { name: 'Parent', path: '/parents' }
  ];
  const examButtons = [
    { name: 'JEE', color: 'bg-red-500 hover:bg-red-600' },
    { name: 'NEET', color: 'bg-green-500 hover:bg-green-600' },
    { name: 'CET', color: 'bg-purple-500 hover:bg-purple-600' },
    { name: 'All Subjects', color: 'bg-indigo-500 hover:bg-indigo-600' }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between py-4">
          <div className="flex flex-wrap items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center space-x-4 mt-4 lg:mt-0">
            {examButtons.map((button) => (
              <button
                key={button.name}
                className={`${button.color} text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden group`}
              >
                <span className="relative z-10">{button.name}</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;