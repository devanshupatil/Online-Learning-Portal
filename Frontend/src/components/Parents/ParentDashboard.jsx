import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ParentNavbar from './ParentNavbar';
import ParentProfile from './ParentProfile';
import { SiteFooter } from '../SiteChrome';
import {
  PARENT_CHILD,
  CHILD_SCHEDULE,
  CHILD_ATTENDANCE_BY_SUBJECT,
  CHILD_RECENT_ATTENDANCE,
  CHILD_TEST_MARKS,
} from '../../mockData/data';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getGrade = (percentage) => {
  if (percentage >= 85) return { label: 'A', colorClass: 'bg-primary-container text-on-primary-container' };
  if (percentage >= 70) return { label: 'B', colorClass: 'bg-secondary-fixed text-on-secondary-fixed' };
  if (percentage >= 50) return { label: 'C', colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed' };
  return { label: 'D', colorClass: 'bg-error-container text-on-error-container' };
};

const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return 'text-primary';
  if (percentage >= 75) return 'text-tertiary';
  return 'text-error';
};

const ParentDashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const scheduleByDay = DAY_ORDER
    .map((day) => ({ day, periods: CHILD_SCHEDULE.filter((p) => p.day === day) }))
    .filter((group) => group.periods.length > 0);

  const overallAttended = CHILD_ATTENDANCE_BY_SUBJECT.reduce((sum, s) => sum + s.attended, 0);
  const overallTotal = CHILD_ATTENDANCE_BY_SUBJECT.reduce((sum, s) => sum + s.totalClasses, 0);
  const overallPercentage = Math.round((overallAttended / overallTotal) * 100);

  const averageScore = Math.round(
    CHILD_TEST_MARKS.reduce((sum, test) => sum + (test.marksObtained / test.totalMarks) * 100, 0) /
      CHILD_TEST_MARKS.length
  );

  const daysPresent = CHILD_RECENT_ATTENDANCE.filter((r) => r.status === 'present').length;

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayPeriods = CHILD_SCHEDULE.filter((p) => p.day === todayName);
  const todaySchedule = todayPeriods.length > 0 ? todayPeriods : CHILD_SCHEDULE.filter((p) => p.day === 'Monday');

  const filteredMarks = CHILD_TEST_MARKS.filter(
    (m) =>
      !searchQuery ||
      m.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const OVERVIEW_CARDS = [
    { titleKey: 'parentOverviewAttendance', fallbackTitle: 'Overall Attendance', icon: 'event_available', colorClass: 'bg-primary-fixed text-on-primary-fixed', value: overallPercentage, suffix: '%' },
    { titleKey: 'parentOverviewAverage', fallbackTitle: 'Average Score', icon: 'trending_up', colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed', value: averageScore, suffix: '%' },
    { titleKey: 'parentOverviewTests', fallbackTitle: 'Tests Conducted', icon: 'quiz', colorClass: 'bg-error-container text-on-error-container', value: CHILD_TEST_MARKS.length, suffix: '' },
    { titleKey: 'parentOverviewSessions', fallbackTitle: 'Weekly Sessions', icon: 'calendar_month', colorClass: 'bg-secondary-fixed text-on-secondary-fixed', value: CHILD_SCHEDULE.length, suffix: '' },
    { titleKey: 'parentOverviewStreak', fallbackTitle: 'Days Present', icon: 'local_fire_department', colorClass: 'bg-primary-container text-on-primary-container', value: daysPresent, suffix: '/10' },
  ];

  const getStatusChip = (subject) => {
    if (subject.includes('Mock')) return 'bg-amber-500/15 text-amber-600';
    return 'bg-surface-container text-on-surface-variant';
  };

  return (
    <>
      <ParentNavbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="px-4 sm:px-6 lg:px-8 pb-12 pt-20 flex flex-col min-h-[calc(100vh-8rem)] w-full">
        <div className="section-fade-in" key={activeSection}>
          {/* 1. Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <div className="space-y-5 mt-4 sm:mt-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-on-surface">{t('parentDashboardTitle')}</h2>
                  <p className="text-sm font-medium text-on-surface-variant mt-0.5">
                    {t('parentDashboardWelcome', { parentName: PARENT_CHILD.parentName, childName: PARENT_CHILD.name })}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveSection('schedule')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {t('parentDashboardViewSchedule')}
                  </button>
                  <button
                    onClick={() => setActiveSection('marks')}
                    className="px-4 py-2 border border-outline-variant bg-surface rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    {t('parentDashboardViewMarks')}
                  </button>
                </div>
              </div>

              {/* Child Summary Banner */}
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="w-14 h-14 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <div>
                      <p className="text-xs text-on-surface-variant">{t('parentDashboardStudentLabel')}</p>
                      <p className="font-semibold text-on-surface">{PARENT_CHILD.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant">{t('parentDashboardStreamLabel')}</p>
                      <p className="font-semibold text-on-surface">{PARENT_CHILD.stream}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant">{t('parentDashboardGradeLabel')}</p>
                      <p className="font-semibold text-on-surface">{PARENT_CHILD.grade}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant">{t('parentDashboardRollNoLabel')}</p>
                      <p className="font-semibold text-on-surface">{PARENT_CHILD.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant">{t('parentDashboardInstituteLabel')}</p>
                      <p className="font-semibold text-on-surface">{PARENT_CHILD.institute}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                {OVERVIEW_CARDS.map((card, index) => (
                  <div key={index} className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 interactive-card shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          {t(card.titleKey) || card.fallbackTitle}
                        </p>
                        <p className="text-2xl font-bold text-on-surface mt-1">{card.value}{card.suffix}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.colorClass} shadow-xs`}>
                        <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Schedule & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schedule Table */}
                <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-display text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">calendar_today</span>
                      {t('parentDashboardTodayTitle')}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-container text-on-primary">
                      {t('parentDashboardSessions', { count: todaySchedule.length })}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {todaySchedule.map((item, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-surface-container-low rounded-xl gap-2 border border-surface-variant/40">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 sm:mt-0 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-on-surface">{item.subject}</h4>
                            <p className="text-xs text-on-surface-variant font-medium">{item.teacher} • {item.room}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="text-xs font-semibold text-on-surface-variant">{item.time}</span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusChip(item.subject)}`}>
                            {item.subject.includes('Mock') ? t('parentDashboardMockTest') : t('parentDashboardUpcoming')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions / Shortcuts */}
                <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display text-on-surface mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">bolt</span>
                      {t('parentDashboardQuickTitle')}
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveSection('schedule')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer border border-surface-variant/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{t('parentDashboardQuickSchedule')}</p>
                          <p className="text-xs text-on-surface-variant">{t('parentDashboardQuickScheduleSub', { childName: PARENT_CHILD.name })}</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveSection('attendance')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer border border-surface-variant/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">event_available</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{t('parentDashboardQuickAttendance')}</p>
                          <p className="text-xs text-on-surface-variant">{t('parentDashboardQuickAttendanceSub')}</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveSection('marks')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer border border-surface-variant/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">quiz</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{t('parentDashboardQuickMarks')}</p>
                          <p className="text-xs text-on-surface-variant">{t('parentDashboardQuickMarksSub')}</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-surface-variant text-center">
                    <p className="text-xs text-on-surface-variant">EduLearning Parent Portal • 2026</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Schedule Tab */}
          {activeSection === 'schedule' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom shadow-xs">
                <div className="p-6 border-b border-surface-variant">
                  <h2 className="text-2xl font-bold font-display text-on-surface">{t('parentDashboardScheduleTitle')}</h2>
                  <p className="text-sm text-on-surface-variant font-medium mt-0.5">
                    {t('parentDashboardScheduleSubtitle', { childName: PARENT_CHILD.name, stream: PARENT_CHILD.stream })}
                  </p>
                </div>
                <div className="divide-y divide-outline-variant/50">
                  {scheduleByDay.map(({ day, periods }) => (
                    <div key={day} className="p-6">
                      <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-primary">calendar_today</span>
                        {day}
                      </h3>
                      <div className="space-y-2">
                        {periods.map((period, index) => (
                          <div
                            key={`${day}-${index}`}
                            className="flex flex-wrap items-center justify-between p-3 bg-surface-container-low rounded-xl gap-2"
                          >
                            <span className="font-medium text-on-surface">{period.subject}</span>
                            <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                {period.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">person</span>
                                {period.teacher}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                {period.room}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Attendance Tab */}
          {activeSection === 'attendance' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parentDashboardOverallAttendance')}</p>
                  <p className={`text-3xl font-bold mt-1 ${getAttendanceColor(overallPercentage)}`}>{overallPercentage}%</p>
                  <p className="text-xs text-on-surface-variant mt-1">{t('parentDashboardClassesAttended', { attended: overallAttended, total: overallTotal })}</p>
                </div>
                {CHILD_ATTENDANCE_BY_SUBJECT.slice(0, 2).map((s) => {
                  const pct = Math.round((s.attended / s.totalClasses) * 100);
                  return (
                    <div key={s.subject} className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{s.subject}</p>
                      <p className={`text-3xl font-bold mt-1 ${getAttendanceColor(pct)}`}>{pct}%</p>
                      <p className="text-xs text-on-surface-variant mt-1">{t('parentDashboardClassesShort', { attended: s.attended, total: s.totalClasses })}</p>
                    </div>
                  );
                })}
              </div>

              {/* By Subject */}
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom shadow-xs">
                <div className="p-6 border-b border-surface-variant">
                  <h2 className="text-2xl font-bold font-display text-on-surface">{t('parentDashboardAttendanceBySubject')}</h2>
                </div>
                <div className="p-6 space-y-4">
                  {CHILD_ATTENDANCE_BY_SUBJECT.map((s) => {
                    const pct = Math.round((s.attended / s.totalClasses) * 100);
                    return (
                      <div key={s.subject}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-on-surface">{s.subject}</span>
                          <span className={`font-medium ${getAttendanceColor(pct)}`}>{pct}% ({s.attended}/{s.totalClasses})</span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${pct >= 90 ? 'bg-primary' : pct >= 75 ? 'bg-tertiary' : 'bg-error'}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Attendance */}
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom shadow-xs">
                <div className="p-6 border-b border-surface-variant">
                  <h2 className="text-2xl font-bold font-display text-on-surface">{t('parentDashboardRecentAttendance')}</h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {CHILD_RECENT_ATTENDANCE.map((record) => (
                      <div key={record.date} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-on-primary ${
                            record.status === 'present' ? 'bg-primary' : 'bg-error'
                          }`}
                          title={`${record.date}: ${record.status}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {record.status === 'present' ? 'check_circle' : 'cancel'}
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant mt-1">{record.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Marks Tab */}
          {activeSection === 'marks' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom shadow-xs">
                <div className="p-6 border-b border-surface-variant">
                  <h2 className="text-2xl font-bold font-display text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[24px] text-primary">emoji_events</span>
                    {t('parentDashboardTestMarksTitle')}
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-0.5">{t('parentDashboardTestMarksSubtitle', { childName: PARENT_CHILD.name })}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-container-low">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parentDashboardTableTest')}</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parentDashboardTableSubject')}</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parentDashboardTableDate')}</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parentDashboardTableMarks')}</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parentDashboardTableGrade')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/50">
                      {filteredMarks.map((test, index) => {
                        const pct = Math.round((test.marksObtained / test.totalMarks) * 100);
                        const grade = getGrade(pct);
                        return (
                          <tr key={index} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-on-surface">{test.test_name}</td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">{test.subject}</td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">{test.date}</td>
                            <td className="px-6 py-4 text-sm text-on-surface">{test.marksObtained} / {test.totalMarks} ({pct}%)</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${grade.colorClass}`}>{grade.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredMarks.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                            {t('parentDashboardNoResults')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Average Score */}
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex items-center mb-2 gap-2">
                  <span className="material-symbols-outlined text-[24px] text-primary">trending_up</span>
                  <h3 className="font-semibold text-on-surface">{t('parentDashboardAverageScore')}</h3>
                </div>
                <p className="text-2xl font-bold text-on-surface">{averageScore}%</p>
                <p className="text-sm text-on-surface-variant mt-1">{t('parentDashboardAcrossTests', { count: CHILD_TEST_MARKS.length })}</p>
              </div>
            </div>
          )}

          {/* 5. Parent Profile Tab */}
          {activeSection === 'profile' && <ParentProfile />}
        </div>
      </main>

      <SiteFooter />
    </>
  );
};

export default ParentDashboard;