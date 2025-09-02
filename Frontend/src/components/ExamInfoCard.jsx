import React from 'react';

// Props: title (string), titleColor (string), children (ReactNode)
const ExamInfoCard = ({ title, titleColor, children }) => {
  return (
    <div className="card-hover bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold ${titleColor} mb-3 sm:mb-4`}>{title}</h3>
      <div className="text-sm sm:text-base">
        {children}
      </div>
    </div>
  );
};

export default ExamInfoCard;