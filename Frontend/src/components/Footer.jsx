import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">EduLearn Platform</h3>
            <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
              Empowering students worldwide with free, world-class education for anyone, anywhere.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b border-blue-700 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  Teachers
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b border-blue-700 pb-2 inline-block">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline">
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b border-blue-700 pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-300 mr-3 mt-0.5" />
                <span className="text-blue-200">123 Education Street, Learning City, LC 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-blue-300 mr-3" />
                <span className="text-blue-200">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-blue-300 mr-3" />
                <span className="text-blue-200">info@edulearn.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-blue-300 text-xs sm:text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} EduLearn Platform. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <a href="#" className="link-hover text-blue-300 hover:text-white text-xs sm:text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="link-hover text-blue-300 hover:text-white text-xs sm:text-sm transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="link-hover text-blue-300 hover:text-white text-xs sm:text-sm transition-colors duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;