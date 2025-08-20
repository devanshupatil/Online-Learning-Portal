import React from 'react';
import { Download, FileText, FileQuestion, FileSpreadsheet } from 'lucide-react';
import CTAButton from './CTAButton';

const InteractiveResources = () => {
  // Mock data for resources
  const resources = [
    {
      title: 'Lecture Notes',
      type: 'PDF',
      size: '2.4 MB',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Assignments',
      type: 'DOCX',
      size: '1.8 MB',
      icon: FileSpreadsheet,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Practice Quizzes',
      type: 'Interactive',
      size: 'Online',
      icon: FileQuestion,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Interactive Resources</h2>
      </div>
      
      {/* Resource Categories */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {resources.map((resource, index) => {
          const IconComponent = resource.icon;
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${resource.color} mr-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{resource.title}</h3>
                    <div className="flex text-sm text-gray-500">
                      <span>{resource.type}</span>
                      <span className="mx-2">•</span>
                      <span>{resource.size}</span>
                    </div>
                  </div>
                </div>
                <CTAButton variant="primary" className="p-2 min-w-0 min-h-0">
                  <Download className="w-5 h-5" />
                </CTAButton>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quizzes Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Practice Quizzes</h3>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">Algebra Fundamentals</h4>
                <p className="text-sm text-gray-600">10 questions • 15 minutes</p>
              </div>
              <CTAButton variant="primary" className="px-4 py-2 text-sm min-w-0 min-h-0">
                Start Quiz
              </CTAButton>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">Physics Concepts</h4>
                <p className="text-sm text-gray-600">15 questions • 20 minutes</p>
              </div>
              <CTAButton variant="primary" className="px-4 py-2 text-sm min-w-0 min-h-0">
                Start Quiz
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
      
      {/* Study Planner */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Study Planner</h3>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">Weekly Progress</span>
            <span className="text-sm text-gray-600">65% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>3 topics completed this week</p>
            <p className="mt-1">2 topics scheduled for tomorrow</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveResources;