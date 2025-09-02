import React from 'react';
import { Award, TrendingUp, ClipboardCheck } from 'lucide-react';
import CTAButton from './CTAButton';

const GradesFeedback = () => {
  // Mock data for grades
  const grades = [
    { subject: 'Mathematics', grade: 'A', score: 92, trend: 'up' },
    { subject: 'Physics', grade: 'B+', score: 85, trend: 'same' },
    { subject: 'Chemistry', grade: 'A-', score: 88, trend: 'up' },
    { subject: 'Biology', grade: 'A', score: 94, trend: 'down' }
  ];

  // Mock data for recent feedback
  const feedback = [
    {
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      date: '2 days ago',
      comment: 'Excellent work on the calculus assignment. Your problem-solving approach is very clear.',
      type: 'positive'
    },
    {
      subject: 'Physics',
      teacher: 'Prof. Johnson',
      date: '1 week ago',
      comment: 'Good effort on the lab report. Consider reviewing the experimental methodology section.',
      type: 'constructive'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <Award className="w-6 h-6 text-yellow-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Grades & Feedback</h2>
      </div>
      
      {/* Overall Performance */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Overall Performance</h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-900">Semester Average</span>
            <span className="text-2xl font-bold text-blue-600">87.25%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-600">
            <span>85% target</span>
            <span>Rank: 12/120</span>
          </div>
        </div>
      </div>
      
      {/* Subject Grades */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Subject Grades</h3>
        <div className="space-y-3">
          {grades.map((grade, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{grade.subject}</h4>
                <p className="text-sm text-gray-600">Latest assessment</p>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900 mr-3">{grade.grade}</span>
                <span className="text-lg font-bold text-blue-600 mr-2">{grade.score}%</span>
                {grade.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                {grade.trend === 'down' && <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />}
                {grade.trend === 'same' && <div className="w-5 h-5"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Feedback */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <ClipboardCheck className="w-5 h-5 mr-2 text-green-600" />
          Recent Feedback
        </h3>
        <div className="space-y-4">
          {feedback.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                item.type === 'positive'
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : 'bg-yellow-50 border-l-4 border-yellow-500'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900">{item.subject}</h4>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
              <p className="text-gray-700 text-sm mb-2">{item.comment}</p>
              <p className="text-sm text-gray-600">- {item.teacher}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Button for View All Feedback */}
        <div className="mt-6 text-center">
          <CTAButton variant="secondary">
            View All Feedback
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default GradesFeedback;