import React from 'react';
import ActionButton from './ActionButton';

const ScheduleCard = ({ 
  subject, 
  time, 
  subjectColor, 
  borderColor, 
  buttonColor 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${borderColor} hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-xl font-semibold ${subjectColor}`}>{subject}</h3>
        <span className="text-sm text-gray-500">{time}</span>
      </div>
      <div className="space-y-2">
        <p className="text-gray-600">45min Teaching + 15min Doubt Session</p>
        <div className="flex space-x-2">
          <ActionButton color={buttonColor} className="text-sm">
            Join Class
          </ActionButton>
          <ActionButton variant="secondary" className="text-sm">
            View Notes
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;