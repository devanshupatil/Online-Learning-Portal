import React from 'react';
import { Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentImage from '../assets/student.jpg'; // Placeholder image

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left side - Text content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <div className="relative">
              <Star className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 transform rotate-12" />
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                For every student,
                <br />
                every classroom.
                <br />
                <span className="text-blue-600 underline decoration-blue-200 decoration-4">Real results.</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're a nonprofit with the mission to provide a free, world-class education
              for anyone, anywhere.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/learners" className="cursor-pointer group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl block">
                <span className="relative z-10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learners
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
              
              <Link to="/teachers" className="cursor-pointer group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl block">
                <span className="relative z-10">Teachers</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
              
              <Link to="/parents" className="cursor-pointer group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl block">
                <span className="relative z-10">Parents</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>
          </div>

          {/* Right side - Image placeholder */}
          <div className="lg:w-1/2 lg:pl-12">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-orange-400 rounded-lg transform rotate-12 opacity-80"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full opacity-60"></div>
              
              {/* Main image container */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl p-8 aspect-square flex items-center justify-center">
                  <img
                    src={StudentImage}
                    alt="Student learning"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                {/* Floating achievement badge */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform rotate-12">
                  ⭐ Top Rated
                </div>
              </div>
              
              {/* Decorative squiggly line */}
              <svg className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8" width="120" height="40" viewBox="0 0 120 40" fill="none">
                <path d="M10 20 Q30 5, 50 20 T90 20 Q100 25, 110 20" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;