import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const desktopNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Exam Info', path: '/exam-info' }
  ];

  const sidebarNavLinks = [
    { name: 'Learners', path: '/learners', icon: '👨‍🎓', color: 'text-blue-600' },
    { name: 'Teachers', path: '/teachers', icon: '👨‍🏫', color: 'text-green-600' },
    { name: 'Parents', path: '/parents', icon: '👨‍👩‍👧‍👦', color: 'text-purple-600' }
  ];

  const examButtons = [
    { name: 'JEE', color: 'bg-red-500 hover:bg-red-600' },
    { name: 'NEET', color: 'bg-green-500 hover:bg-green-600' },
    { name: 'CET', color: 'bg-purple-500 hover:bg-purple-600' },
    { name: 'All Subjects', color: 'bg-indigo-500 hover:bg-indigo-600' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              EduLearn
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {desktopNavLinks.map((link) => (
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

          {/* Desktop Exam Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
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

          {/* Mobile More Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="More options"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <MoreHorizontal className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 mobile-sidebar-backdrop"
            onClick={closeMenu}
          ></div>

          {/* Sidebar Content */}
          <div
            className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-white mobile-sidebar-content transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Main User Roles - Prominent */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Choose Your Role</h3>
                  <div className="space-y-4">
                    {sidebarNavLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={closeMenu}
                        className="flex items-center px-6 py-5 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 group border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transform hover:scale-105"
                      >
                        <span className="text-3xl mr-5 group-hover:scale-110 transition-transform duration-300">
                          {link.icon}
                        </span>
                        <div className="flex-1">
                          <div className={`text-lg font-bold ${link.color} group-hover:scale-105 transition-transform duration-300`}>
                            {link.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {link.name === 'Learners' && 'Access courses & study materials'}
                            {link.name === 'Teachers' && 'Manage classes & students'}
                            {link.name === 'Parents' && 'Track your child\'s progress'}
                          </div>
                        </div>
                        <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          →
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Navigation */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    {desktopNavLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={closeMenu}
                        className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Popular Exams */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Popular Exams</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {examButtons.map((button) => (
                      <button
                        key={button.name}
                        onClick={closeMenu}
                        className={`${button.color} text-white px-3 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden group text-xs font-medium text-center`}
                      >
                        <span className="relative z-10">{button.name}</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;