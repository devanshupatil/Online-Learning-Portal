import React from 'react';
import { BookOpen, Search, Star } from 'lucide-react';
import CTAButton from './CTAButton';

const CourseCatalog = () => {
  // Mock data for courses
  const courses = [
    {
      title: 'Advanced Mathematics',
      instructor: 'Dr. Smith',
      rating: 4.8,
      students: 1240,
      category: 'Mathematics',
      level: 'Advanced'
    },
    {
      title: 'Physics Fundamentals',
      instructor: 'Prof. Johnson',
      rating: 4.6,
      students: 980,
      category: 'Physics',
      level: 'Beginner'
    },
    {
      title: 'Organic Chemistry',
      instructor: 'Dr. Williams',
      rating: 4.9,
      students: 1560,
      category: 'Chemistry',
      level: 'Intermediate'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <BookOpen className="w-6 h-6 text-green-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Course Catalog</h2>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Recommended Courses */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended For You</h3>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div>
                  <h4 className="font-bold text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{course.rating} ({course.students} students)</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full self-start">
                  {course.level}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full self-start">
                  {course.category}
                </span>
                <CTAButton variant="primary" className="px-3 py-1 text-sm min-w-0 min-h-0 self-start">
                  Enroll
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Browse All Button */}
      <div className="text-center mt-6">
        <CTAButton variant="accent">
          Browse All Courses
        </CTAButton>
      </div>
    </div>
  );
};

export default CourseCatalog;