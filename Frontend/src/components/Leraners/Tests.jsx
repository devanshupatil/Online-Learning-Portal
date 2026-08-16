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

  return (
    <div className="space-y-4">
      {analysisData && analysisData.length > 0 ? (
        analysisData.map((test) => (
          <div
            key={test.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">quiz</span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-on-surface">{test.test_name}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{test.course}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 text-sm text-on-surface-variant gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[18px] mr-1 flex-shrink-0">
                    calendar_today
                  </span>
                  <span className="truncate">{new Date(test.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[18px] mr-1 flex-shrink-0">
                    schedule
                  </span>
                  <span className="truncate">{new Date(test.updated_at).toLocaleTimeString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleStartTest(test)}
                className="cursor-pointer flex items-center justify-center gap-1 px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 active:scale-95 transition-all shrink-0 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                {t('learnerStartTest')}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-on-surface-variant py-10 bg-surface-container-lowest border border-outline-variant rounded-2xl">
          {analysisData === null ? t('learnerTestsLoading') : t('learnerTestsEmpty')}
        </div>
      )}
    </div>
  );
};

export default Tests;
