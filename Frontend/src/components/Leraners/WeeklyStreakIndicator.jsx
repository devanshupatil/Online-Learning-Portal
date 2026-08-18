import React from 'react';
import { useTranslation } from 'react-i18next';

const WeeklyStreakIndicator = ({ streak = 0 }) => {
  const { t } = useTranslation();
  const days = Array(7).fill(false);
  for (let i = 7 - streak; i < 7; i++) {
    if (i >= 0) days[i] = true;
  }

  const dayKeys = ['learnerDayMon', 'learnerDayTue', 'learnerDayWed', 'learnerDayThu', 'learnerDayFri', 'learnerDaySat', 'learnerDaySun'];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px] text-tertiary-container">local_fire_department</span>
          <h3 className="font-display text-2xl text-on-surface">{t('learnerWeeklyStreak')}</h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-tertiary-container">{streak}</span>
          <span className="text-sm text-on-surface-variant">{t('learnerStreakDays')}</span>
        </div>
      </div>

      <div className="flex justify-between mb-3">
        {dayKeys.map((key, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <span className="text-xs text-on-surface-variant">{t(key)}</span>
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                days[index]
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface-container-low border border-outline-variant'
              }`}
            >
              {days[index] && (
                <span className="material-symbols-outlined text-[18px]">check</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-on-surface-variant text-center">
        {streak > 0
          ? t('learnerStreakKeepGoing', { count: streak })
          : t('learnerStreakStart')}
      </p>
    </div>
  );
};

export default WeeklyStreakIndicator;
