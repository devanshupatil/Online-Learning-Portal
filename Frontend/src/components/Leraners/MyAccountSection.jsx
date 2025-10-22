import React from 'react';
import { User } from 'lucide-react';
import Progress from './Progress';
import StudentProfile from './StudentProfile';

const MyAccountSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <User className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">MY ACCOUNT</h2>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <Progress className='cursor-pointer'/>
        <StudentProfile />
      </div>
    </div>
  );
};

export default MyAccountSection;