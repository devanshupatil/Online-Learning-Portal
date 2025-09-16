import React, { useState } from 'react';
import { BookOpen, Plus, Edit3 } from 'lucide-react';
import CourseCard from './CourseCard';

const CoursesList = ({ onAddCourse, onEditCourses }) => {
  // Mock data for courses
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Advanced Mathematics',
      category: 'Mathematics',
      progress: 75,
      instructor: 'Dr. Smith'
    },
    {
      id: 2,
      title: 'Physics Fundamentals',
      category: 'Physics',
      progress: 45,
      instructor: 'Prof. Johnson'
    },
    {
      id: 3,
      title: 'Organic Chemistry',
      category: 'Chemistry',
      progress: 90,
      instructor: 'Dr. Williams'
    }
  ]);

  const handleStartCourse = (courseId) => {
    console.log(`Starting course with ID: ${courseId}`);
    // In a real app, this would redirect to the course page
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onEditCourses}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
      </div>
      
      {/* Course List */}
      <div className="space-y-4 mb-6">
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onStart={() => handleStartCourse(course.id)} 
          />
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <button 
          onClick={onAddCourse}
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add another course
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300">
          See all courses
        </button>
      </div>
    </div>
  );
};

export default CoursesList;