import React from 'react';
import { useTranslation } from 'react-i18next';

const ProgressTracking = ({ onViewAllResults }) => {
  const { t } = useTranslation();

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

  const totalMarksObtained = testResultsData.reduce((sum, test) => sum + test.marks, 0);
  const totalMarksPossible = testResultsData.reduce((sum, test) => sum + test.totalMarks, 0);
  const overallPercentage = Math.round((totalMarksObtained / totalMarksPossible) * 100);

  const testsBySubject = testResultsData.reduce((acc, test) => {
    if (!acc[test.subject]) {
      acc[test.subject] = [];
    }
    acc[test.subject].push(test);
    return acc;
  }, {});

  const subjectAverages = Object.keys(testsBySubject).map((subject) => {
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

  const recentTests = testResultsData.slice(0, 3);

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

  const SectionCard = ({ icon, title, children }) => (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant flex items-center gap-2">
        <span className="material-symbols-outlined text-[24px] text-primary">{icon}</span>
        <h2 className="font-display text-2xl text-on-surface">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionCard icon="target" title={t('learnerProgressOverall')}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold text-on-surface">{overallPercentage}%</div>
            <div className="text-on-surface-variant">{t('learnerProgressOverallAverage')}</div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-on-surface">{t('learnerProgressLabel')}</span>
              <span className="text-sm font-medium text-on-surface">{overallPercentage}%</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full ${getBarColor(overallPercentage)}`}
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-on-surface-variant">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-low p-3 rounded-xl text-center">
            <div className="text-lg font-bold text-on-surface">{testResultsData.length}</div>
            <div className="text-sm text-on-surface-variant">{t('learnerProgressTestsTaken')}</div>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl text-center">
            <div className="text-lg font-bold text-on-surface">
              {totalMarksObtained}/{totalMarksPossible}
            </div>
            <div className="text-sm text-on-surface-variant">{t('learnerProgressTotalMarks')}</div>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl text-center">
            <div className={`text-lg font-bold ${getGradeColor(overallPercentage)}`}>
              {overallPercentage}%
            </div>
            <div className="text-sm text-on-surface-variant">{t('learnerProgressAvgScore')}</div>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl text-center">
            <div className="text-lg font-bold text-on-surface">A</div>
            <div className="text-sm text-on-surface-variant">{t('learnerProgressGradeLevel')}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon="book" title={t('learnerProgressSubjectPerformance')}>
        <div className="space-y-4">
          {subjectAverages.map((subject, index) => (
            <div key={index} className="border border-outline-variant rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-on-surface">{subject.subject}</h3>
                <span className={`font-bold ${getGradeColor(subject.average)}`}>
                  {subject.average}%
                </span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant mb-2">
                <span>
                  {subject.tests} {t('learnerProgressTestsLabel')}
                </span>
                <span>{t('learnerProgressAvgScore')}</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${getBarColor(subject.average)}`}
                  style={{ width: `${subject.average}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon="history" title={t('learnerProgressRecentPerformance')}>
        <div className="space-y-4">
          {recentTests.map((test) => (
            <div key={test.id} className="border border-outline-variant rounded-xl p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-on-surface">{test.testName}</h3>
                  <p className="text-sm text-on-surface-variant">{test.subject}</p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center text-sm text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-[16px] mr-1">
                      calendar_today
                    </span>
                    <span>{test.date}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-on-surface">
                      {test.marks}/{test.totalMarks}
                    </span>
                    <span className={`ml-2 text-sm font-bold ${getGradeColor(test.percentage)}`}>
                      {test.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2 w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${getBarColor(test.percentage)}`}
                  style={{ width: `${test.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onViewAllResults}
            className="px-5 py-2 bg-accent text-primary rounded-lg font-medium hover:bg-primary/10 active:scale-95 transition-all cursor-pointer"
          >
            {t('learnerProgressViewAllResults')}
          </button>
        </div>
      </SectionCard>
    </div>
  );
};

export default ProgressTracking;
