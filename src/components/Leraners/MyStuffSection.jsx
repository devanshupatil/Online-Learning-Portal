import React from 'react';
import { BookOpen } from 'lucide-react';
import Syllabus from './Syllabus';
import Material from './Material';
import Tests from './Tests';

const MyStuffSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">MY STUFF</h2>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <Syllabus />
        <Material />
        <Tests />
      </div>
    </div>
  );
};

export default MyStuffSection;