import React from 'react';
import { useTranslation } from 'react-i18next';
import { mockTestResults, getBarColor, getGradeColor } from './testData';

const TestResults = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {mockTestResults.map((test) => (
        <div
          key={test.id}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300 group"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-on-surface group-hover:text-primary transition-colors">{test.testName}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{test.subject}</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center text-sm text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-[16px] mr-1">calendar_today</span>
                <span>{new Date(test.date).toLocaleDateString()}</span>
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
              className={`h-2 rounded-full transition-all duration-700 ease-out ${getBarColor(test.percentage)}`}
              style={{ width: `${test.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestResults;
