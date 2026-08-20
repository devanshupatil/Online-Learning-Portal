import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TeacherNavbar from './TeacherNavbar';
import MaterialUpload from './MaterialUpload';
import MaterialManager from './MaterialManager';
import TestUpload from './TestUpload';
import TestManager from './TestManager';
import AttendanceTracker from './AttendanceTracker';
import AttendanceReports from './AttendanceReports';
import StudentDirectory from './StudentDirectory';
import StudentProfileView from './StudentProfileView';
import TeacherSyllabus from './TeacherSyllabus';
import TeacherProgress from './TeacherProgress';
import TeacherProfile from './TeacherProfile';
import { SiteFooter } from '../SiteChrome';
import { mockFetch } from '../../mockData/mockFetch';

const OVERVIEW_CARDS = [
  { titleKey: 'teacherOverviewTotalStudents', fallbackTitle: 'Total Students', icon: 'group', colorClass: 'bg-primary-fixed text-on-primary-fixed' },
  { titleKey: 'teacherOverviewActiveClasses', fallbackTitle: 'Active Classes', icon: 'menu_book', colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { titleKey: 'teacherOverviewUploadedMaterials', fallbackTitle: 'Uploaded Materials', icon: 'description', colorClass: 'bg-secondary-fixed text-on-secondary-fixed' },
  { titleKey: 'teacherOverviewPendingTests', fallbackTitle: 'Tests Conducted', icon: 'quiz', colorClass: 'bg-error-container text-on-error-container' },
  { titleKey: 'teacherOverviewAvgAttendance', fallbackTitle: 'Avg Attendance', icon: 'event_available', colorClass: 'bg-primary-container text-on-primary-container' },
];

const OVERVIEW_VALUES = [
  { key: 'totalStudents', fallback: 128 },
  { key: 'activeClasses', fallback: 4 },
  { key: 'uploadedMaterials', fallback: 16 },
  { key: 'pendingTests', fallback: 8 },
  { key: 'attendanceRate', fallback: 94, suffix: '%' },
];

const TODAY_SCHEDULE = [
  { time: '09:00 AM - 10:30 AM', class: 'Class 12-A', subject: 'Mathematics: Integrals & Calculus', room: 'Hall 3', status: 'Completed' },
  { time: '11:00 AM - 12:30 PM', class: 'Class 12-B', subject: 'Mathematics: Matrices & Determinants', room: 'Hall 1', status: 'In Progress' },
  { time: '02:00 PM - 03:30 PM', class: 'Class 11-A', subject: 'Mathematics: Trigonometric Functions', room: 'Hall 4', status: 'Upcoming' },
  { time: '04:00 PM - 05:30 PM', class: 'Doubt Clearing', subject: 'Competitive JEE Practice Batch', room: 'Seminar Room', status: 'Upcoming' },
];

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('students');
  const [materialTab, setMaterialTab] = useState('upload');
  const [testTab, setTestTab] = useState('upload');
  const [attendanceTab, setAttendanceTab] = useState('tracker');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [overviewData, setOverviewData] = useState({
    totalStudents: 128,
    activeClasses: 4,
    uploadedMaterials: 16,
    pendingTests: 8,
    attendanceRate: 94
  });
  const URL = import.meta.env.VITE_BACKEND_URL;

  const handleViewStudentProfile = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setSelectedStudent(null);
    setShowProfileModal(false);
  };

  const getAllStudentsCount = async () => {
    try {
      const response = await mockFetch(`${URL}/api/getAllStudentcount`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch students count');
      const data = await response.json();
      if (data?.students) {
        setOverviewData(prev => ({ ...prev, totalStudents: data.students }));
      }
    } catch {
      // keep fallback
    }
  };

  const getAllUploadedMaterialscount = async () => {
    try {
      const response = await mockFetch(`${URL}/api/getStudyMaterials/teacher123`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch uploaded materials count');
      const data = await response.json();
      if (data?.materials) {
        setOverviewData(prev => ({ ...prev, uploadedMaterials: data.materials.length }));
      }
    } catch {
      // keep fallback
    }
  };

  useEffect(() => {
    getAllStudentsCount();
    getAllUploadedMaterialscount();
  }, []);

  return (
    <>
      <TeacherNavbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="px-4 sm:px-6 lg:px-8 pb-12 pt-[65px] lg:pt-[114px] flex flex-col min-h-[calc(100vh-8rem)] w-full">
        <div className="section-fade-in" key={activeSection}>
          {/* 1. Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <div className="space-y-5 mt-4 sm:mt-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-on-surface">{t('teacherDashboardTitle')}</h2>
                  <p className="text-sm font-medium text-on-surface-variant mt-0.5">
                    {t('teacherDashboardWelcome')}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveSection('syllabus')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {t('teacherDashboardViewSyllabus')}
                  </button>
                  <button
                    onClick={() => setActiveSection('materials')}
                    className="px-4 py-2 border border-outline-variant bg-surface rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    {t('teacherDashboardUploadNotes')}
                  </button>
                </div>
              </div>

              {/* Overview Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                {OVERVIEW_CARDS.map((card, index) => {
                  const val = OVERVIEW_VALUES[index];
                  const value = overviewData[val.key] ?? val.fallback;
                  return (
                    <div key={index} className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 interactive-card shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                            {t(card.titleKey) || card.fallbackTitle}
                          </p>
                          <p className="text-2xl font-bold text-on-surface mt-1">{value}{val.suffix || ''}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.colorClass} shadow-xs`}>
                          <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Today's Schedule & Quick Attendance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schedule Table */}
                <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-display text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">calendar_today</span>
                      {t('teacherDashboardTodayTitle')}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-container text-on-primary">
                      {t('teacherDashboardSessions', { count: TODAY_SCHEDULE.length })}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {TODAY_SCHEDULE.map((item, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-surface-container-low rounded-xl gap-2 border border-surface-variant/40">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 sm:mt-0 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-on-surface">{item.subject}</h4>
                            <p className="text-xs text-on-surface-variant font-medium">{item.class} • {item.room}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="text-xs font-semibold text-on-surface-variant">{item.time}</span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            item.status === 'Completed' ? 'bg-[#10B981]/15 text-[#10B981]' :
                            item.status === 'In Progress' ? 'bg-amber-500/15 text-amber-600' :
                            'bg-surface-container text-on-surface-variant'
                          }`}>
                            {item.status === 'Completed' ? t('teacherDashboardStatusCompleted') :
                             item.status === 'In Progress' ? t('teacherDashboardStatusInProgress') :
                             t('teacherDashboardStatusUpcoming')}
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
                      {t('teacherDashboardQuickTitle')}
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveSection('attendance')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer border border-surface-variant/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">event_available</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{t('teacherDashboardQuickAttendance')}</p>
                          <p className="text-xs text-on-surface-variant">{t('teacherDashboardQuickAttendanceSub')}</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveSection('tests')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer border border-surface-variant/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">quiz</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{t('teacherDashboardQuickTests')}</p>
                          <p className="text-xs text-on-surface-variant">{t('teacherDashboardQuickTestsSub')}</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveSection('students')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer border border-surface-variant/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">group</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{t('teacherDashboardQuickStudents')}</p>
                          <p className="text-xs text-on-surface-variant">{t('teacherDashboardQuickStudentsSub', { count: overviewData.totalStudents })}</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-surface-variant text-center">
                    <p className="text-xs text-on-surface-variant">{t('teacherDashboardFooter')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Syllabus Tab */}
          {activeSection === 'syllabus' && <TeacherSyllabus />}

          {/* 3. Materials Tab */}
          {activeSection === 'materials' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-on-surface">{t('teacherMaterialsTitle') || 'Study Materials'}</h2>
                    <p className="text-sm text-on-surface-variant font-medium mt-0.5">Upload notes, question banks, and lecture slides chapter-wise</p>
                  </div>
                  <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-variant">
                    {['upload', 'manage'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setMaterialTab(tab)}
                        className={`cursor-pointer flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          materialTab === tab
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px] mr-1.5">
                          {tab === 'upload' ? 'upload_file' : 'folder_open'}
                        </span>
                        {tab === 'upload' ? 'Upload Files' : 'Material Library'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-6">
                  {materialTab === 'upload' && <MaterialUpload />}
                  {materialTab === 'manage' && <MaterialManager />}
                </div>
              </div>
            </div>
          )}

          {/* 4. Tests Tab */}
          {activeSection === 'tests' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-on-surface">{t('teacherTestsTitle') || 'Tests & Assessments'}</h2>
                    <p className="text-sm text-on-surface-variant font-medium mt-0.5">Create, schedule and manage chapter-wise exams and mock tests</p>
                  </div>
                  <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-variant">
                    {['upload', 'manage'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setTestTab(tab)}
                        className={`cursor-pointer flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          testTab === tab
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px] mr-1.5">
                          {tab === 'upload' ? 'add_task' : 'quiz'}
                        </span>
                        {tab === 'upload' ? 'Create Test' : 'Test Manager'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-6">
                  {testTab === 'upload' && <TestUpload />}
                  {testTab === 'manage' && <TestManager />}
                </div>
              </div>
            </div>
          )}

          {/* 5. Attendance Tab */}
          {activeSection === 'attendance' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-on-surface">{t('teacherAttendanceTitle') || 'Student Attendance'}</h2>
                    <p className="text-sm text-on-surface-variant font-medium mt-0.5">Track daily class presence and view comprehensive attendance reports</p>
                  </div>
                  <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-variant">
                    {[
                      { id: 'tracker', label: 'Mark Attendance', icon: 'check_circle' },
                      { id: 'reports', label: 'Attendance Reports', icon: 'bar_chart' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setAttendanceTab(tab.id)}
                        className={`cursor-pointer flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          attendanceTab === tab.id
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px] mr-1.5">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-6">
                  {attendanceTab === 'tracker' && <AttendanceTracker />}
                  {attendanceTab === 'reports' && <AttendanceReports />}
                </div>
              </div>
            </div>
          )}

          {/* 6. Students Directory Tab */}
          {activeSection === 'students' && (
            <StudentDirectory
              onViewProfile={handleViewStudentProfile}
              externalSearch={searchQuery}
            />
          )}

          {/* 7. Progress & Analytics Tab */}
          {activeSection === 'progress' && <TeacherProgress />}

          {/* 8. Teacher Profile Tab */}
          {activeSection === 'profile' && <TeacherProfile />}
        </div>
      </main>

      <SiteFooter />

      {showProfileModal && selectedStudent && (
        <StudentProfileView student={selectedStudent} onClose={handleCloseProfileModal} />
      )}
    </>
  );
};

export default TeacherDashboard;
