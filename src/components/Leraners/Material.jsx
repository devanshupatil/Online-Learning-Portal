import React from 'react';
import { FileText, Video } from 'lucide-react';

const Material = () => {
  // Mock data for materials
  const materialsData = [
    {
      id: 1,
      title: 'Algebra Basics Notes',
      type: 'document',
      subject: 'Mathematics',
      date: '2023-05-15'
    },
    {
      id: 2,
      title: 'Physics Lecture Video',
      type: 'video',
      subject: 'Physics',
      date: '2023-05-18'
    },
    {
      id: 3,
      title: 'Chemistry Lab Manual',
      type: 'document',
      subject: 'Chemistry',
      date: '2023-05-20'
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'video':
        return 'bg-red-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Material</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {materialsData.map((item) => (
          <div key={item.id} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-300 hover:border-green-300">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getIconBg(item.type)}`}>
              {getIcon(item.type)}
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-600 mt-1">{item.subject}</p>
              <p className="text-xs text-gray-500 mt-1">{item.date}</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-green-600 transition-colors duration-300">
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button className="w-full text-center text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-300">
          View All Materials
        </button>
      </div>
    </div>
  );
};

export default Material;