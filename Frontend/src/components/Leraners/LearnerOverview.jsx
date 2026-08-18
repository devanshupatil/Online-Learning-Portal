import React from 'react';
import { useTranslation } from 'react-i18next';
import WeeklyStreakIndicator from './WeeklyStreakIndicator';

const LearnerOverview = ({ courses, profileName, streak = 5 }) => {
  const { t } = useTranslation();

  const averageProgress = courses.length
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
    : 0;

  const quickStats = [
    { icon: 'menu_book', value: String(courses.length), labelKey: 'learnerStatActiveCourses' },
    { icon: 'event', value: '3', labelKey: 'learnerStatUpcomingClasses' },
    { icon: 'quiz', value: '2', labelKey: 'learnerStatPendingTests' },
    { icon: 'trending_up', value: `${averageProgress}%`, labelKey: 'learnerStatOverallProgress' },
  ];

  const schedule = [
    { titleKey: 'learnerScheduleMath', timeKey: 'learnerScheduleMathTime', durationKey: 'learnerScheduleMathDuration' },
    { titleKey: 'learnerSchedulePhysics', timeKey: 'learnerSchedulePhysicsTime', durationKey: 'learnerSchedulePhysicsDuration' },
    { titleKey: 'learnerScheduleChemistry', timeKey: 'learnerScheduleChemistryTime', durationKey: 'learnerScheduleChemistryDuration' },
  ];

  return (
    <div className="mt-4 lg:mt-8">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="font-display text-[32px] leading-[40px] text-on-surface">
          {t('learnerDashboardWelcomeTitle', { name: profileName })}
        </h2>
        <p className="text-base text-on-surface-variant mt-1">
          {t('learnerDashboardWelcomeSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <div
                key={stat.labelKey}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              >
                <span className="material-symbols-outlined text-primary text-[28px]">
                  {stat.icon}
                </span>
                <div className="text-2xl font-bold text-on-surface mt-2">{stat.value}</div>
                <div className="text-sm text-on-surface-variant">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>

          {/* Continue Learning */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <h3 className="font-display text-2xl text-on-surface mb-4">
              {t('learnerContinueLearning')}
            </h3>
            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 p-4 border border-outline-variant rounded-xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                >
                  <img
                    alt={course.title}
                    className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                    src={course.thumbnail}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-on-surface truncate">{course.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-primary whitespace-nowrap">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                  <button className="hidden sm:inline-flex items-center gap-1 px-4 py-2 border border-primary text-primary text-sm rounded-lg hover:bg-surface-container-low active:scale-95 transition-all shrink-0">
                    {t('learnerCourseResumeBtn')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <h3 className="font-display text-2xl text-on-surface mb-4">
              {t('learnerTodaySchedule')}
            </h3>
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl"
                >
                  <div>
                    <p className="font-medium text-on-surface">{t(item.titleKey)}</p>
                    <p className="text-sm text-on-surface-variant">{t(item.timeKey)}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-surface-container-highest text-on-surface-variant rounded-full font-medium">
                    {t(item.durationKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <WeeklyStreakIndicator streak={streak} />
        </div>
      </div>
    </div>
  );
};

export default LearnerOverview;
