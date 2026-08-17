import React from 'react';

const TestResults = () => {
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

  const getBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-primary';
    if (percentage >= 80) return 'bg-secondary';
    if (percentage >= 70) return 'bg-tertiary-container';
    return 'bg-destructive';
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-primary';
    if (percentage >= 80) return 'text-secondary';
    if (percentage >= 70) return 'text-tertiary-container';
    return 'text-destructive';
  };

  return (
    <div className="space-y-4">
      {testResultsData.map((test) => (
        <div
          key={test.id}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-on-surface">{test.testName}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{test.subject}</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center text-sm text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-[16px] mr-1">calendar_today</span>
                <span>{test.date}</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold text-on-surface">
                  {test.marks}/{test.totalMarks}
                </span>
                <span className={`ml-3 text-lg font-bold ${getGradeColor(test.percentage)}`}>
                  {test.percentage}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full ${getBarColor(test.percentage)}`}
              style={{ width: `${test.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestResults;
