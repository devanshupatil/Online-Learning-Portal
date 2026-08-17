import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { mockFetch } from '../../mockData/mockFetch';

const Tests = () => {
  const { t } = useTranslation();
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    geAllImageAnalysis();
  }, []);

  const geAllImageAnalysis = async () => {
    try {
      const getImageResponse = await mockFetch(`${URL}/api/textAnalysis`);

      if (getImageResponse.ok) {
        const text = await getImageResponse.text();

        if (text) {
          let existingAnalysis = null;

          try {
            const analysisStart = text.indexOf('{');
            if (analysisStart !== -1) {
              const cleanedText = text.slice(analysisStart);
              existingAnalysis = JSON.parse(cleanedText);
            } else {
              throw new Error('Invalid analysis data format');
            }

            existingAnalysis = JSON.parse(text);
          } catch (parseErr) {
            console.warn('Failed to parse analysis JSON from server:', parseErr);
            toast.error('Failed to load existing text analysis data.');
          }

          if (existingAnalysis && Object.keys(existingAnalysis).length > 0) {
            setAnalysisData(existingAnalysis.textAnalyses);
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching existing analysis from server:', err);
      toast.error('Error fetching existing text analysis data from server.');
    }
  };

  const handleStartTest = (test) => {
    navigate('/test-taking', { state: { test } });
  };

  const BADGE_STYLES = [
    'bg-primary-fixed text-on-primary-fixed',
    'bg-secondary-fixed text-on-secondary-fixed',
    'bg-tertiary-fixed text-on-tertiary-fixed'
  ];

  const getDueMeta = (dueAt) => {
    const dueDate = new Date(dueAt);
    const diffDays = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
    const urgent = diffDays <= 1;
    const label =
      diffDays <= 0
        ? t('learnerTestDueDate', { date: 'Today' })
        : diffDays === 1
        ? t('learnerTestDueDate', { date: 'Tomorrow' })
        : t('learnerTestDueDate', { date: dueDate.toLocaleDateString() });
    return { label, urgent };
  };

  return (
    <div>
      {analysisData && analysisData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysisData.map((test, index) => {
            const due = test.due_at ? getDueMeta(test.due_at) : null;
            const isResume = test.status === 'in_progress';
            return (
              <div
                key={test.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`inline-block font-medium text-sm px-3 py-1 rounded-full ${BADGE_STYLES[index % BADGE_STYLES.length]}`}
                  >
                    {test.course}
                  </span>
                  <span className="material-symbols-outlined text-outline">more_vert</span>
                </div>

                <h3 className="font-medium text-on-surface mb-4 line-clamp-2">{test.test_name}</h3>

                <div className="space-y-3 mb-6 flex-grow">
                  {typeof test.question_count === 'number' && (
                    <div className="flex items-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[18px] mr-2">format_list_bulleted</span>
                      {t('learnerTestQuestionsCount', { count: test.question_count })}
                    </div>
                  )}
                  {typeof test.duration_minutes === 'number' && (
                    <div className="flex items-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[18px] mr-2">schedule</span>
                      {t('learnerTestDurationMinutes', { count: test.duration_minutes })}
                    </div>
                  )}
                  {due && (
                    <div
                      className={`flex items-center text-sm ${due.urgent ? 'text-destructive' : 'text-on-surface-variant'}`}
                    >
                      <span className="material-symbols-outlined text-[18px] mr-2">event</span>
                      {due.label}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartTest(test)}
                  className={
                    isResume
                      ? 'cursor-pointer w-full h-[48px] border-2 border-primary text-primary bg-transparent rounded-lg font-medium hover:bg-surface-container-low transition-colors active:scale-[0.98]'
                      : 'cursor-pointer w-full h-[48px] bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm active:scale-[0.98]'
                  }
                >
                  {isResume ? t('learnerResumeTest') : t('learnerStartTest')}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-on-surface-variant py-10 bg-surface-container-lowest border border-outline-variant rounded-2xl">
          {analysisData === null ? t('learnerTestsLoading') : t('learnerTestsEmpty')}
        </div>
      )}
    </div>
  );
};

export default Tests;
