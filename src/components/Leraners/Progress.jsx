import React from 'react';
import { TrendingUp, Award } from 'lucide-react';

const Progress = () => {
  // Mock data for progress
  const progressData = [
    { subject: 'Mathematics', progress: 85, grade: 'A', color: 'bg-blue-500' },
    { subject: 'Physics', progress: 72, grade: 'B', color: 'bg-green-500' },
    { subject: 'Chemistry', progress: 90, grade: 'A+', color: 'bg-purple-500' }
  ];

  const overallProgress = 82;
  const overallGrade = 'A';

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
        </div>
      </div>
      
      <div className="p-4">
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-700">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Current Grade: {overallGrade}</span>
            </div>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              {overallProgress >= 90 ? 'Excellent' :
               overallProgress >= 75 ? 'Good' :
               'Needs Improvement'}
            </span>
          </div>
        </div>
        
        {/* Subject Progress */}
        <div className="space-y-5">
          {progressData.map((subject, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">{subject.subject}</span>
                <span className="text-sm font-medium text-gray-700">{subject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${subject.color} h-2.5 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Grade: {subject.grade}</span>
                <span>
                  {subject.progress >= 90 ? 'Excellent' :
                   subject.progress >= 75 ? 'Good' :
                   'Needs Improvement'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Achievements */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Recent Achievements</h4>
          <div className="flex flex-wrap gap-2">
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-medium hover:shadow-sm transition-shadow duration-300">
              Top 10% in Mathematics
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium hover:shadow-sm transition-shadow duration-300">
              Perfect Attendance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;