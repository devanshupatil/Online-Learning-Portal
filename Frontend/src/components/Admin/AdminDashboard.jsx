import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminNavbar from './AdminNavbar';
import { SiteFooter } from '../SiteChrome';
import { useAdminAuth } from '../Auth/AdminAuthContext';
import { mockFetch } from '../../mockData/mockFetch';
import FeesManager from './sections/FeesManager';

const OVERVIEW_CARDS = [
  { title: 'Total Users', key: 'totalUsers', icon: 'group', colorClass: 'bg-primary-fixed text-on-primary-fixed' },
  { title: 'Total Courses', key: 'totalCourses', icon: 'menu_book', colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { title: 'Total Materials', key: 'totalMaterials', icon: 'description', colorClass: 'bg-secondary-fixed text-on-secondary-fixed' },
  { title: 'Total Tests', key: 'totalTests', icon: 'quiz', colorClass: 'bg-error-container text-on-error-container' },
  { title: 'System Health', key: 'systemHealth', icon: 'check_circle', colorClass: 'bg-primary-container text-on-primary-container' },
];

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userTab, setUserTab] = useState('students');
  const [contentTab, setContentTab] = useState('materials');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedModel, setSelectedModel] = useState('openAI');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClassModal, setShowClassModal] = useState(false);
  const [classForm, setClassForm] = useState({ course: '', teacher: '', date: '', time: '', duration: '60' });
  const { logout, admin } = useAdminAuth();
  const URL = import.meta.env.VITE_BACKEND_URL;

  const STORAGE_KEY = 'adminScheduledClasses';

  const seedClasses = [
    { id: 1, course: 'Mathematics 101', teacher: 'Dr. Alice Wilson', date: new Date().toISOString().slice(0, 10), time: '09:00', duration: '60' },
    { id: 2, course: 'Physics Fundamentals', teacher: 'Prof. Michael Brown', date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), time: '11:30', duration: '90' },
    { id: 3, course: 'Chemistry Basics', teacher: 'Ms. Sarah Davis', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), time: '14:00', duration: '45' },
  ];

  const loadClasses = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return stored && stored.length ? stored : seedClasses;
    } catch (error) {
      return seedClasses;
    }
  };

  const [scheduledClasses, setScheduledClasses] = useState(loadClasses);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduledClasses));
  }, [scheduledClasses]);

  // Mock data for admin overview
  const [overviewData, setOverviewData] = useState({
    totalUsers: 156,
    totalCourses: 24,
    totalMaterials: 89,
    totalTests: 45,
    systemHealth: 'Good'
  });

  const handleViewUserProfile = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${suffix}`;
  };

  const getClassStatus = (cls) => {
    const end = new Date(`${cls.date}T${cls.time}`);
    end.setMinutes(end.getMinutes() + Number(cls.duration || 60));
    return end < new Date() ? 'Completed' : 'Upcoming';
  };

  const isClassActive = (cls) => getClassStatus(cls) === 'Upcoming';

  const handleScheduleClass = (e) => {
    e.preventDefault();
    if (!classForm.course || !classForm.teacher || !classForm.date || !classForm.time) return;
    const newClass = { id: Date.now(), ...classForm };
    setScheduledClasses((prev) => [...prev, newClass]);
    setClassForm({ course: '', teacher: '', date: '', time: '', duration: '60' });
    setShowClassModal(false);
  };

  const handleDeleteClass = (id) => {
    setScheduledClasses((prev) => prev.filter((cls) => cls.id !== id));
  };

  const recentActivity = [
    { id: 1, type: 'user_registration', message: 'New student registered: john.doe@example.com', timestamp: '2 hours ago', icon: 'person_add' },
    { id: 2, type: 'course_created', message: 'New course created: Advanced Mathematics', timestamp: '1 day ago', icon: 'add_task' },
    { id: 3, type: 'material_uploaded', message: 'Study material uploaded to Physics class', timestamp: '2 days ago', icon: 'upload_file' },
    { id: 4, type: 'test_published', message: 'Test results published for Chemistry', timestamp: '3 days ago', icon: 'assignment_turned_in' }
  ];

  const mockStudents = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'Active', registrationDate: '2024-01-15', enrolledCourses: 3 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'Active', registrationDate: '2024-02-20', enrolledCourses: 2 },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', status: 'Inactive', registrationDate: '2024-01-10', enrolledCourses: 1 },
  ];

  const mockTeachers = [
    { id: 1, name: 'Dr. Alice Wilson', email: 'alice.wilson@example.com', status: 'Active', registrationDate: '2023-12-01', coursesTaught: 4 },
    { id: 2, name: 'Prof. Michael Brown', email: 'michael.brown@example.com', status: 'Active', registrationDate: '2023-11-15', coursesTaught: 3 },
    { id: 3, name: 'Ms. Sarah Davis', email: 'sarah.davis@example.com', status: 'Inactive', registrationDate: '2023-10-20', coursesTaught: 2 },
  ];

  const mockCourses = [
    { id: 1, name: 'Mathematics 101', teacher: 'Dr. Alice Wilson', enrolledStudents: 45, status: 'Active', createdDate: '2024-01-01' },
    { id: 2, name: 'Physics Fundamentals', teacher: 'Prof. Michael Brown', enrolledStudents: 32, status: 'Active', createdDate: '2024-01-15' },
    { id: 3, name: 'Chemistry Basics', teacher: 'Ms. Sarah Davis', enrolledStudents: 28, status: 'Inactive', createdDate: '2024-02-01' },
  ];

  const mockMaterials = [
    { id: 1, name: 'Algebra Notes.pdf', type: 'PDF', uploader: 'Dr. Alice Wilson', uploadDate: '2024-03-01', course: 'Mathematics 101' },
    { id: 2, name: 'Physics Lab Guide.docx', type: 'DOCX', uploader: 'Prof. Michael Brown', uploadDate: '2024-03-05', course: 'Physics Fundamentals' },
    { id: 3, name: 'Chemistry Experiments.pdf', type: 'PDF', uploader: 'Ms. Sarah Davis', uploadDate: '2024-03-10', course: 'Chemistry Basics' },
  ];

  const mockTests = [
    { id: 1, title: 'Math Quiz 1', subject: 'Mathematics', questionsCount: 20, assignedTo: 'Mathematics 101', createdDate: '2024-03-01' },
    { id: 2, title: 'Physics Midterm', subject: 'Physics', questionsCount: 30, assignedTo: 'Physics Fundamentals', createdDate: '2024-03-05' },
    { id: 3, title: 'Chemistry Lab Test', subject: 'Chemistry', questionsCount: 15, assignedTo: 'Chemistry Basics', createdDate: '2024-03-10' },
  ];

  useEffect(() => {
    fetchSelectedModel();
  }, []);

  const fetchSelectedModel = async () => {
    try {
      const response = await mockFetch(`${URL}/admin/settings/llm_model`);
      if (response.ok) {
        const data = await response.json();
        setSelectedModel(data.value);
      } else {
        setSelectedModel('openAI');
      }
    } catch (error) {
      setSelectedModel('openAI');
    }
  };

  const currentSearch = searchQuery || searchTerm;

  return (
    <>
      <AdminNavbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        admin={admin}
        logout={logout}
      />

      <main className="px-4 sm:px-6 lg:px-8 pb-12 pt-[65px] lg:pt-[114px] flex flex-col min-h-[calc(100vh-8rem)] w-full">
        <div className="section-fade-in" key={activeSection}>
          {/* 1. Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <div className="space-y-5 mt-4 sm:mt-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-on-surface">Admin Dashboard</h2>
                  <p className="text-sm font-medium text-on-surface-variant mt-0.5">
                    Welcome back, {admin?.name || admin?.email || 'Admin'}! Manage your online learning platform efficiently.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveSection('users')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                    Manage Users
                  </button>
                  <button
                    onClick={() => setActiveSection('courses')}
                    className="px-4 py-2 border border-outline-variant bg-surface rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                    View Courses
                  </button>
                </div>
              </div>

              {/* Overview Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                {OVERVIEW_CARDS.map((card, index) => {
                  const value = overviewData[card.key];
                  return (
                    <div key={index} className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 interactive-card shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{card.title}</p>
                          <p className="text-2xl font-bold text-on-surface mt-1">{value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.colorClass} shadow-xs`}>
                          <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity & Quick Links */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-display text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">history</span>
                      Recent Activity
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl gap-2 border border-surface-variant/40">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
                          </div>
                          <p className="text-sm font-semibold text-on-surface">{activity.message}</p>
                        </div>
                        <span className="text-xs font-medium text-on-surface-variant whitespace-nowrap">{activity.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display text-on-surface mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">bolt</span>
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveSection('users')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer border border-surface-variant/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">person_add</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">Manage Users</p>
                          <p className="text-xs text-on-surface-variant">View students & teacher list</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveSection('courses')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer border border-surface-variant/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">add_box</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">Add New Course</p>
                          <p className="text-xs text-on-surface-variant">Create and assign classes</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveSection('settings')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer border border-surface-variant/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">tune</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">System Settings</p>
                          <p className="text-xs text-on-surface-variant">Configure AI model & approvals</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. User Management Tab */}
          {activeSection === 'users' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-on-surface">User Management</h2>
                    <p className="text-sm text-on-surface-variant font-medium mt-0.5">Control registered students and teachers</p>
                  </div>
                  <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-variant">
                    <button
                      onClick={() => setUserTab('students')}
                      className={`cursor-pointer flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        userTab === 'students' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] mr-1.5">group</span>
                      Students
                    </button>
                    <button
                      onClick={() => setUserTab('teachers')}
                      className={`cursor-pointer flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        userTab === 'teachers' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] mr-1.5">school</span>
                      Teachers
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={currentSearch}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setSearchQuery(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto rounded-xl border border-surface-variant/50">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-surface-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          <th className="py-3.5 px-4">Name</th>
                          <th className="py-3.5 px-4">Email</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Registration Date</th>
                          <th className="py-3.5 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-variant/30 text-sm font-medium text-on-surface">
                        {(userTab === 'students' ? mockStudents : mockTeachers)
                          .filter(user =>
                            (filterStatus === 'all' || user.status.toLowerCase() === filterStatus) &&
                            (user.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              user.email.toLowerCase().includes(currentSearch.toLowerCase()))
                          )
                          .map((user) => (
                            <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="py-3.5 px-4 font-bold">{user.name}</td>
                              <td className="py-3.5 px-4 text-on-surface-variant">{user.email}</td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  user.status === 'Active'
                                    ? 'bg-[#10B981]/15 text-[#10B981]'
                                    : 'bg-error-container text-on-error-container'
                                }`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-on-surface-variant">{user.registrationDate}</td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleViewUserProfile(user)}
                                    className="p-1.5 text-primary hover:bg-primary-container/40 rounded-lg transition-colors cursor-pointer"
                                    title="View"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                  </button>
                                  <button
                                    className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                  </button>
                                  <button
                                    className="p-1.5 text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fee Management Tab */}
          {activeSection === 'fees' && (
            <FeesManager />
          )}

          {/* 3. Course Management Tab */}
          {activeSection === 'courses' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-on-surface">Course Management</h2>
                    <p className="text-sm text-on-surface-variant font-medium mt-0.5">Manage active learning modules and assigned instructors</p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add Course
                  </button>
                </div>

                <div className="pt-6 space-y-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={currentSearch}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Courses Table */}
                  <div className="overflow-x-auto rounded-xl border border-surface-variant/50">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-surface-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          <th className="py-3.5 px-4">Course Name</th>
                          <th className="py-3.5 px-4">Teacher</th>
                          <th className="py-3.5 px-4">Enrolled Students</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Created Date</th>
                          <th className="py-3.5 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-variant/30 text-sm font-medium text-on-surface">
                        {mockCourses
                          .filter(course =>
                            (filterStatus === 'all' || course.status.toLowerCase() === filterStatus) &&
                            (course.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              course.teacher.toLowerCase().includes(currentSearch.toLowerCase()))
                          )
                          .map((course) => (
                            <tr key={course.id} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="py-3.5 px-4 font-bold">{course.name}</td>
                              <td className="py-3.5 px-4 text-on-surface-variant">{course.teacher}</td>
                              <td className="py-3.5 px-4 font-bold">{course.enrolledStudents}</td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  course.status === 'Active'
                                    ? 'bg-[#10B981]/15 text-[#10B981]'
                                    : 'bg-error-container text-on-error-container'
                                }`}>
                                  {course.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-on-surface-variant">{course.createdDate}</td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 text-primary hover:bg-primary-container/40 rounded-lg transition-colors cursor-pointer" title="View Details">
                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                  </button>
                                  <button className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer" title="Edit">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                  </button>
                                  <button className="p-1.5 text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer" title="Delete">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Course Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Courses</p>
                      <p className="text-2xl font-bold text-primary mt-1">{mockCourses.length}</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Courses</p>
                      <p className="text-2xl font-bold text-[#10B981] mt-1">{mockCourses.filter(c => c.status === 'Active').length}</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Enrollments</p>
                      <p className="text-2xl font-bold text-tertiary mt-1">{mockCourses.reduce((sum, course) => sum + course.enrolledStudents, 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Content Management Tab */}
          {activeSection === 'content' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-on-surface">Content Management</h2>
                    <p className="text-sm text-on-surface-variant font-medium mt-0.5">Review study materials and uploaded assessments</p>
                  </div>
                  <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-variant">
                    <button
                      onClick={() => setContentTab('materials')}
                      className={`cursor-pointer flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        contentTab === 'materials' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] mr-1.5">description</span>
                      Materials
                    </button>
                    <button
                      onClick={() => setContentTab('tests')}
                      className={`cursor-pointer flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        contentTab === 'tests' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] mr-1.5">quiz</span>
                      Tests
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  {contentTab === 'materials' && (
                    <div className="overflow-x-auto rounded-xl border border-surface-variant/50">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low border-b border-surface-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                            <th className="py-3.5 px-4">File Name</th>
                            <th className="py-3.5 px-4">Type</th>
                            <th className="py-3.5 px-4">Uploader</th>
                            <th className="py-3.5 px-4">Upload Date</th>
                            <th className="py-3.5 px-4">Course</th>
                            <th className="py-3.5 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-variant/30 text-sm font-medium text-on-surface">
                          {mockMaterials.map((material) => (
                            <tr key={material.id} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="py-3.5 px-4 font-bold">{material.name}</td>
                              <td className="py-3.5 px-4">
                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-container text-on-primary-container">
                                  {material.type}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-on-surface-variant">{material.uploader}</td>
                              <td className="py-3.5 px-4 text-on-surface-variant">{material.uploadDate}</td>
                              <td className="py-3.5 px-4">{material.course}</td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 text-primary hover:bg-primary-container/40 rounded-lg transition-colors cursor-pointer" title="Download">
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                  </button>
                                  <button className="p-1.5 text-[#10B981] hover:bg-[#10B981]/20 rounded-lg transition-colors cursor-pointer" title="Approve">
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                  </button>
                                  <button className="p-1.5 text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer" title="Remove">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {contentTab === 'tests' && (
                    <div className="overflow-x-auto rounded-xl border border-surface-variant/50">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low border-b border-surface-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                            <th className="py-3.5 px-4">Test Title</th>
                            <th className="py-3.5 px-4">Subject</th>
                            <th className="py-3.5 px-4">Questions</th>
                            <th className="py-3.5 px-4">Assigned To</th>
                            <th className="py-3.5 px-4">Created Date</th>
                            <th className="py-3.5 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-variant/30 text-sm font-medium text-on-surface">
                          {mockTests.map((test) => (
                            <tr key={test.id} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="py-3.5 px-4 font-bold">{test.title}</td>
                              <td className="py-3.5 px-4 text-on-surface-variant">{test.subject}</td>
                              <td className="py-3.5 px-4 font-bold">{test.questionsCount}</td>
                              <td className="py-3.5 px-4">{test.assignedTo}</td>
                              <td className="py-3.5 px-4 text-on-surface-variant">{test.createdDate}</td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 text-primary hover:bg-primary-container/40 rounded-lg transition-colors cursor-pointer" title="View Details">
                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                  </button>
                                  <button className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer" title="Edit">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                  </button>
                                  <button className="p-1.5 text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer" title="Delete">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. Class Scheduling Tab */}
          {activeSection === 'classes' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-on-surface">Class Scheduling</h2>
                    <p className="text-sm text-on-surface-variant font-medium mt-0.5">Schedule classes and track upcoming session timings</p>
                  </div>
                  <button
                    onClick={() => setShowClassModal(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Schedule Class
                  </button>
                </div>

                <div className="pt-6 space-y-6">
                  {/* Class Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Classes</p>
                      <p className="text-2xl font-bold text-primary mt-1">{scheduledClasses.length}</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Classes</p>
                      <p className="text-2xl font-bold text-[#10B981] mt-1">{scheduledClasses.filter(isClassActive).length}</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Classes Today</p>
                      <p className="text-2xl font-bold text-tertiary mt-1">
                        {scheduledClasses.filter((cls) => cls.date === new Date().toISOString().slice(0, 10)).length}
                      </p>
                    </div>
                  </div>

                  {/* Classes Table */}
                  <div className="overflow-x-auto rounded-xl border border-surface-variant/50">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-surface-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          <th className="py-3.5 px-4">Course</th>
                          <th className="py-3.5 px-4">Teacher</th>
                          <th className="py-3.5 px-4">Date</th>
                          <th className="py-3.5 px-4">Timing</th>
                          <th className="py-3.5 px-4">Duration</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-variant/30 text-sm font-medium text-on-surface">
                        {scheduledClasses
                          .slice()
                          .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
                          .map((cls) => {
                            const status = getClassStatus(cls);
                            const endTime = new Date(`${cls.date}T${cls.time}`);
                            endTime.setMinutes(endTime.getMinutes() + Number(cls.duration || 60));
                            return (
                              <tr key={cls.id} className="hover:bg-surface-container-low/50 transition-colors">
                                <td className="py-3.5 px-4 font-bold">{cls.course}</td>
                                <td className="py-3.5 px-4 text-on-surface-variant">{cls.teacher}</td>
                                <td className="py-3.5 px-4">{cls.date}</td>
                                <td className="py-3.5 px-4">
                                  <span className="inline-flex items-center gap-1.5 text-primary">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    {formatTime(cls.time)} - {formatTime(`${endTime.getHours()}:${endTime.getMinutes()}`)}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-on-surface-variant">{cls.duration} min</td>
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    status === 'Upcoming'
                                      ? 'bg-[#10B981]/15 text-[#10B981]'
                                      : 'bg-error-container text-on-error-container'
                                  }`}>
                                    {status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <button
                                    onClick={() => handleDeleteClass(cls.id)}
                                    className="p-1.5 text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. Analytics Tab */}
          {activeSection === 'analytics' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-on-surface">Analytics & Reports</h2>
                    <p className="text-sm text-on-surface-variant font-medium mt-0.5">Platform growth, test metrics and user statistics</p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export Report
                  </button>
                </div>

                <div className="pt-6 space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">User Growth</p>
                      <p className="text-2xl font-bold text-primary mt-1">+12%</p>
                      <p className="text-xs text-on-surface-variant mt-1">vs last month</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Course Completion</p>
                      <p className="text-2xl font-bold text-[#10B981] mt-1">85%</p>
                      <p className="text-xs text-on-surface-variant mt-1">avg completion</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Test Performance</p>
                      <p className="text-2xl font-bold text-tertiary mt-1">78%</p>
                      <p className="text-xs text-on-surface-variant mt-1">avg score</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-4 border border-surface-variant/40">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Attendance Rate</p>
                      <p className="text-2xl font-bold text-secondary mt-1">92%</p>
                      <p className="text-xs text-on-surface-variant mt-1">overall average</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. Settings Tab */}
          {activeSection === 'settings' && (
            <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
                <div className="pb-6 border-b border-surface-variant">
                  <h2 className="text-2xl font-bold font-display text-on-surface">System Settings</h2>
                  <p className="text-sm text-on-surface-variant font-medium mt-0.5">Configure system parameters and AI integrations</p>
                </div>

                <div className="pt-6 space-y-8 max-w-2xl">
                  {/* AI Model Selection */}
                  <div>
                    <h3 className="text-lg font-bold font-display text-on-surface mb-2">Image Analysis & AI Model</h3>
                    <p className="text-xs text-on-surface-variant mb-3">Select the default AI model to process test uploads and images</p>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="openAI">OpenAI (GPT-4o)</option>
                      <option value="perplexity">Perplexity</option>
                      <option value="claude">Claude (Anthropic)</option>
                      <option value="gemini">Gemini (Google)</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-surface-variant flex gap-3">
                    <button
                      onClick={async () => {
                        try {
                          const response = await mockFetch(`${URL}/admin/settings`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'llm_model', value: selectedModel }),
                          });
                          if (response.ok) alert('Settings saved successfully!');
                          else alert('Failed to save settings.');
                        } catch (error) {
                          alert('Error saving settings.');
                        }
                      }}
                      className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />

      {/* Schedule Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-md w-full border border-surface-variant shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-display text-on-surface">Schedule Class</h3>
              <button
                onClick={() => setShowClassModal(false)}
                className="p-1.5 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleScheduleClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Course</label>
                <select
                  required
                  value={classForm.course}
                  onChange={(e) => setClassForm({ ...classForm, course: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="">Select course</option>
                  {mockCourses.map((course) => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Teacher</label>
                <select
                  required
                  value={classForm.teacher}
                  onChange={(e) => setClassForm({ ...classForm, teacher: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="">Select teacher</option>
                  {mockTeachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    required
                    type="date"
                    value={classForm.date}
                    onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Time</label>
                  <input
                    required
                    type="time"
                    value={classForm.time}
                    onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Duration (minutes)</label>
                <select
                  value={classForm.duration}
                  onChange={(e) => setClassForm({ ...classForm, duration: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                  <option value="120">120 min</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 border border-outline-variant bg-surface rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-md w-full border border-surface-variant shadow-xl">
            <h3 className="text-xl font-bold font-display text-on-surface mb-4">User Details</h3>
            <div className="space-y-2 text-sm text-on-surface">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Registration Date:</strong> {selectedUser.registrationDate}</p>
              {selectedUser.enrolledCourses && <p><strong>Enrolled Courses:</strong> {selectedUser.enrolledCourses}</p>}
              {selectedUser.coursesTaught && <p><strong>Courses Taught:</strong> {selectedUser.coursesTaught}</p>}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseUserModal}
                className="px-4 py-2 border border-outline-variant bg-surface rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;