import React from 'react';
import ActionButton from './ActionButton';
  
const ClassSection = ({ 
  className, 
  timing, 
  fees, 
  titleColor, 
  buttonColor 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <h3 className={`text-xl font-semibold ${titleColor} mb-4`}>{className}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700">Class Timing</h4>
            <p className="text-sm text-gray-600">{timing}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-gray-700">Fees</h4>
            <p className="text-lg font-bold text-yellow-600">{fees}</p>
          </div>
        </div>
        <div className="space-y-3">
          <ActionButton color={buttonColor} className="w-full">
            Get Syllabus
          </ActionButton>
          <ActionButton color="bg-teal-600 hover:bg-teal-700" className="w-full">
            View Material
          </ActionButton>
          <ActionButton color="bg-orange-600 hover:bg-orange-700" className="w-full">
            Enroll Now
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default ClassSection;