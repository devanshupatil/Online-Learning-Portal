import React from 'react';
import { Book, User } from 'lucide-react';

const CourseCard = ({ course, onStart }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
        <div className="flex-1">
          <div className="flex items-start mb-2">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Book className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <User className="w-4 h-4 mr-1" />
                <span>{course.instructor}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {course.category}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
              {course.progress}% complete
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
        
        <button 
          onClick={onStart}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium whitespace-nowrap"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default CourseCard;