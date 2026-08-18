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
            toast.error(t('learnerTestLoadError'));
          }
          if (existingAnalysis && Object.keys(existingAnalysis).length > 0) {
            setAnalysisData(existingAnalysis.textAnalyses);
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching existing analysis from server:', err);
      toast.error(t('learnerTestFetchError'));
    }
  };

  const handleStartTest = (test) => {
    navigate('/test-taking', { state: { test } });
  };

  const getRelativeDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return t('learnerTestToday');
    if (date.toDateString() === tomorrow.toDateString()) return t('learnerTestTomorrow');
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {analysisData && analysisData.length > 0 ? (
        analysisData.map((test) => (
          <div
            key={test.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300 group"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">quiz</span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-on-surface group-hover:text-primary transition-colors">{test.test_name}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{test.course}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 text-sm text-on-surface-variant gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[18px] mr-1 flex-shrink-0">calendar_today</span>
                  <span className="truncate">{getRelativeDate(test.updated_at)}</span>
                </div>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[18px] mr-1 flex-shrink-0">schedule</span>
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
        <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-2xl">
          {analysisData === null ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl skeleton shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 skeleton w-3/4"></div>
                      <div className="h-3 skeleton w-1/2"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-3 skeleton w-1/3"></div>
                    <div className="h-8 w-20 skeleton rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined text-[64px] text-outline mb-4 block">assignment</span>
              <p className="text-lg font-semibold text-on-surface mb-2">{t('learnerTestsEmpty')}</p>
              <p className="text-sm text-on-surface-variant">{t('learnerTestsEmptyHint')}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Tests;
