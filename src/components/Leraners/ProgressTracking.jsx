import React from 'react';
import { TrendingUp, Target, Calendar, BookOpen } from 'lucide-react';

const ProgressTracking = () => {
  // Mock data for test results (same as in TestResults component)
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

  // Calculate overall statistics
  const totalMarksObtained = testResultsData.reduce((sum, test) => sum + test.marks, 0);
  const totalMarksPossible = testResultsData.reduce((sum, test) => sum + test.totalMarks, 0);
  const overallPercentage = Math.round((totalMarksObtained / totalMarksPossible) * 100);

  // Group tests by subject
  const testsBySubject = testResultsData.reduce((acc, test) => {
    if (!acc[test.subject]) {
      acc[test.subject] = [];
    }
    acc[test.subject].push(test);
    return acc;
  }, {});

  // Calculate subject averages
  const subjectAverages = Object.keys(testsBySubject).map(subject => {
    const tests = testsBySubject[subject];
    const totalObtained = tests.reduce((sum, test) => sum + test.marks, 0);
    const totalPossible = tests.reduce((sum, test) => sum + test.totalMarks, 0);
    const average = Math.round((totalObtained / totalPossible) * 100);
    
    return {
      subject,
      average,
      tests: tests.length
    };
  });

  // Get recent tests (last 3)
  const recentTests = testResultsData.slice(0, 3);

  // Get grade color
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get progress bar color
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-white mr-2" />
            <h2 className="text-xl font-bold text-white">Overall Progress</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="text-center mb-4 md:mb-0">
              <div className="text-4xl font-bold text-gray-900">{overallPercentage}%</div>
              <div className="text-gray-600">Overall Average</div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{overallPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${getProgressColor(overallPercentage)}`}
                  style={{ width: `${overallPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0%</span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-900">{testResultsData.length}</div>
              <div className="text-sm text-gray-600">Tests Taken</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-900">{totalMarksObtained}/{totalMarksPossible}</div>
              <div className="text-sm text-gray-600">Total Marks</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className={`text-lg font-bold ${getGradeColor(overallPercentage)}`}>{overallPercentage}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-900">A</div>
              <div className="text-sm text-gray-600">Grade Level</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subject Performance */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-white mr-2" />
            <h2 className="text-xl font-bold text-white">Subject Performance</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {subjectAverages.map((subject, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">{subject.subject}</h3>
                  <span className={`font-bold ${getGradeColor(subject.average)}`}>{subject.average}%</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{subject.tests} test{subject.tests > 1 ? 's' : ''}</span>
                  <span>Average Score</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(subject.average)}`}
                    style={{ width: `${subject.average}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Test Performance */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-white mr-2" />
            <h2 className="text-xl font-bold text-white">Recent Test Performance</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {recentTests.map((test) => (
              <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                    <p className="text-sm text-gray-600">{test.subject}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{test.date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-gray-900">
                        {test.marks}/{test.totalMarks}
                      </span>
                      <span className={`ml-2 text-sm font-bold ${getGradeColor(test.percentage)}`}>
                        {test.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getProgressColor(test.percentage)}`}
                    style={{ width: `${test.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button 
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors duration-300"
              onClick={() => document.querySelector('[data-section="test"]').click()}
            >
              View All Test Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;