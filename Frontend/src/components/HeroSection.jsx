import React from 'react';
import { Star, BookOpen, GraduationCap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentImage from '../assets/student.jpg'; // Placeholder image


const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left side - Text content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="relative inline-block lg:block">
              <Star className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 transform rotate-12" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                For every student,
                <br className="hidden sm:block" />
                every classroom.
                <br />
                <span className="text-blue-600 underline decoration-blue-200 decoration-4">Real results.</span>
              </h1>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              We're a nonprofit with the mission to provide a free, world-class education
              for anyone, anywhere.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">


              <Link
                to="/learners"
                className="cta-button cta-primary cursor-pointer group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl block min-h-[48px] flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Learners
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              <Link
                to="/teachers"
                className="cta-button cta-primary cursor-pointer group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl block min-h-[48px] flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Teachers
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              <Link
                to="/parents"
                className="cta-button cta-primary cursor-pointer group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl block min-h-[48px] flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Parents
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>
          </div>

          {/* Right side - Image placeholder */}
          <div className="w-full lg:w-1/2 lg:pl-8 xl:pl-12">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Decorative elements */}
              <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 w-8 h-8 sm:w-12 sm:h-12 bg-orange-400 rounded-lg transform rotate-12 opacity-80"></div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-16 sm:h-16 bg-green-400 rounded-full opacity-60"></div>

              {/* Main image container */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform rotate-2 sm:rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl p-4 sm:p-6 lg:p-8 aspect-square flex items-center justify-center">
                  <img
                    src={StudentImage}
                    alt="Student learning"
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>

                {/* Floating achievement badge */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-yellow-400 text-yellow-900 px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg transform rotate-12">
                  ⭐ Top Rated
                </div>
              </div>

              {/* Decorative squiggly line */}
              <svg className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 sm:translate-y-8 hidden sm:block" width="120" height="40" viewBox="0 0 120 40" fill="none">
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