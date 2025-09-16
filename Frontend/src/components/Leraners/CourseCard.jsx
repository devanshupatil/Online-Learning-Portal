import React from 'react';
import { Book, User } from 'lucide-react';

const CourseCard = ({ course, onStart }) => {
  return (
    <div className="card-hover border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6 hover:border-blue-300 transition-all duration-300 bg-white shadow-sm hover:shadow-lg">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <Book className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg lg:text-xl leading-tight mb-1 truncate">
              {course.title}
            </h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{course.instructor}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
            {course.category}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">
            {course.progress}% complete
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>

        <button
          onClick={onStart}
          className="cta-button cta-primary w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base font-medium whitespace-nowrap min-h-[40px] flex items-center justify-center"
        >
          Start Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;