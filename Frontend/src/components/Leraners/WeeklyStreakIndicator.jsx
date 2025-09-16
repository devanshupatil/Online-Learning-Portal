import React from 'react';
import { TrendingUp, Flame } from 'lucide-react';

const WeeklyStreakIndicator = ({ streak = 0 }) => {
  // Create an array of 7 days for the streak visualization
  const days = Array(7).fill(false);
  // Mark the last 'streak' days as active
  for (let i = 7 - streak; i < 7; i++) {
    if (i >= 0) {
      days[i] = true;
    }
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Flame className="w-5 h-5 text-orange-500 mr-2" />
          <span className="font-bold text-gray-900">Weekly Streak</span>
        </div>
        <div className="flex items-center">
          <span className="text-lg font-bold text-orange-600">{streak}</span>
          <span className="text-sm text-gray-600 ml-1">days</span>
        </div>
      </div>
      
      <div className="flex justify-between mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
          <div key={index} className="text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
              days[index] 
                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                : 'bg-white border-2 border-gray-200 text-gray-400'
            }`}>
              {days[index] ? (
                <Flame className="w-4 h-4" />
              ) : (
                <span className="text-xs font-bold">{day}</span>
              )}
            </div>
            <span className="text-xs text-gray-500">{day}</span>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-600 text-center">
        {streak > 0 
          ? `Keep going! You're on a ${streak}-day streak!` 
          : 'Complete a lesson today to start your streak!'}
      </p>
    </div>
  );
};

export default WeeklyStreakIndicator;