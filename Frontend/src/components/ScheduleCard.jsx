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
    <div className={`card-hover bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 ${borderColor} hover:shadow-xl transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <h3 className={`text-lg sm:text-xl font-semibold ${subjectColor} leading-tight`}>{subject}</h3>
        <span className="text-sm text-gray-500 font-medium">{time}</span>
      </div>
      <div className="space-y-3">
        <p className="text-sm sm:text-base text-gray-600">45min Teaching + 15min Doubt Session</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
          <ActionButton color={buttonColor} className="text-sm w-full sm:w-auto">
            Join Class
          </ActionButton>
          <ActionButton variant="secondary" className="text-sm w-full sm:w-auto">
            View Notes
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;