import React from 'react';
import { FileText, Calendar, Award } from 'lucide-react';

const TestResults = () => {
  // Mock data for test results
  const testResultsData = [
    {
      id: 1,
      testName: 'Algebra Fundamentals Quiz',
      subject: 'Mathematics',
      date: '2023-05-20',
      marks: 42,
      totalMarks: 50,
      percentage: 84
    },
    {
      id: 2,
      testName: 'Physics Midterm Exam',
      subject: 'Physics',
      date: '2023-05-15',
      marks: 78,
      totalMarks: 100,
      percentage: 78
    },
    {
      id: 3,
      testName: 'Chemistry Lab Test',
      subject: 'Chemistry',
      date: '2023-05-10',
      marks: 28,
      totalMarks: 30,
      percentage: 93
    },
    {
      id: 4,
      testName: 'Biology Quarterly Assessment',
      subject: 'Biology',
      date: '2023-05-05',
      marks: 85,
      totalMarks: 100,
      percentage: 85
    },
    {
      id: 5,
      testName: 'English Literature Quiz',
      subject: 'English',
      date: '2023-04-28',
      marks: 18,
      totalMarks: 20,
      percentage: 90
    }
  ];

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      <div className="space-y-4">
        {testResultsData.map((test) => (
          <div
            key={test.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                <p className="text-sm text-gray-600 mt-1">{test.subject}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{test.date}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {test.marks}/{test.totalMarks}
                  </span>
                  <span className={`ml-3 text-lg font-bold ${getGradeColor(test.percentage)}`}>
                    {test.percentage}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  test.percentage >= 90 ? 'bg-green-500' :
                  test.percentage >= 80 ? 'bg-blue-500' :
                  test.percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${test.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TestResults;