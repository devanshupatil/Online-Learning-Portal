import React from 'react';

// Props: title (string), titleColor (string), children (ReactNode)
const ExamInfoCard = ({ title, titleColor, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <h3 className={`text-xl font-semibold ${titleColor} mb-4`}>{title}</h3>
      {children}
    </div>
  );
};

export default ExamInfoCard;