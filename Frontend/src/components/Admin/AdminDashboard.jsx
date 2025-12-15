import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, Activity, Settings, Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Header from '../Header';
import AdminSidebar from './AdminSidebar';
import BackNavigation from '../BackNavigation';
import ResponsiveSidebar from '../ResponsiveSidebar';
import { useSidebar } from '../SidebarProvider';
import { useAdminAuth } from '../Auth/AdminAuthContext';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userTab, setUserTab] = useState('students');
  const [contentTab, setContentTab] = useState('materials');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedModel, setSelectedModel] = useState('openAI');
  const { isMobile, isTablet } = useSidebar();
  const { getAuthHeaders, logout, admin } = useAdminAuth();
  const URL = import.meta.env.VITE_BACKEND_URL;

  // Mock data for admin overview
  const [overviewData, setOverviewData] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalMaterials: 0,
    totalTests: 0,
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

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New student registered: john.doe@example.com',
      timestamp: '2 hours ago',
      color: 'green'
    },
    {
      id: 2,
      type: 'course_created',
      message: 'New course created: Advanced Mathematics',
      timestamp: '1 day ago',
      color: 'blue'
    },
    {
      id: 3,
      type: 'material_uploaded',
      message: 'Study material uploaded to Physics class',
      timestamp: '2 days ago',
      color: 'purple'
    },
    {
      id: 4,
      type: 'test_published',
      message: 'Test results published for Chemistry',
      timestamp: '3 days ago',
      color: 'orange'
    }
  ];

  // Mock data for users
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

  // Mock data for courses
  const mockCourses = [
    { id: 1, name: 'Mathematics 101', teacher: 'Dr. Alice Wilson', enrolledStudents: 45, status: 'Active', createdDate: '2024-01-01' },
    { id: 2, name: 'Physics Fundamentals', teacher: 'Prof. Michael Brown', enrolledStudents: 32, status: 'Active', createdDate: '2024-01-15' },
    { id: 3, name: 'Chemistry Basics', teacher: 'Ms. Sarah Davis', enrolledStudents: 28, status: 'Inactive', createdDate: '2024-02-01' },
  ];

  // Mock data for materials
  const mockMaterials = [
    { id: 1, name: 'Algebra Notes.pdf', type: 'PDF', uploader: 'Dr. Alice Wilson', uploadDate: '2024-03-01', course: 'Mathematics 101' },
    { id: 2, name: 'Physics Lab Guide.docx', type: 'DOCX', uploader: 'Prof. Michael Brown', uploadDate: '2024-03-05', course: 'Physics Fundamentals' },
    { id: 3, name: 'Chemistry Experiments.pdf', type: 'PDF', uploader: 'Ms. Sarah Davis', uploadDate: '2024-03-10', course: 'Chemistry Basics' },
  ];

  // Mock data for tests
  const mockTests = [
    { id: 1, title: 'Math Quiz 1', subject: 'Mathematics', questionsCount: 20, assignedTo: 'Mathematics 101', createdDate: '2024-03-01' },
    { id: 2, title: 'Physics Midterm', subject: 'Physics', questionsCount: 30, assignedTo: 'Physics Fundamentals', createdDate: '2024-03-05' },
    { id: 3, title: 'Chemistry Lab Test', subject: 'Chemistry', questionsCount: 15, assignedTo: 'Chemistry Basics', createdDate: '2024-03-10' },
  ];

  const overviewCards = [
    {
      title: 'Total Users',
      value: overviewData.totalUsers,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Courses',
      value: overviewData.totalCourses,
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Total Materials',
      value: overviewData.totalMaterials,
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Total Tests',
      value: overviewData.totalTests,
      icon: Activity,
      color: 'orange'
    },
    {
      title: 'System Health',
      value: overviewData.systemHealth,
      icon: CheckCircle,
      color: 'teal'
    }
  ];

  // Fetch data on component mount
  useEffect(() => {
    // In a real app, fetch data from APIs
    setOverviewData({
      totalUsers: 156,
      totalCourses: 24,
      totalMaterials: 89,
      totalTests: 45,
      systemHealth: 'Good'
    });

    // Load selected model from API
    fetchSelectedModel();
  }, []);

  const fetchSelectedModel = async () => {
    try {
      const response = await fetch(`${URL}/admin/settings/llm_model`);
      if (response.ok) {
        const data = await response.json();
        setSelectedModel(data.value);
      } else {
        console.warn('Failed to fetch selected model, using default');
        setSelectedModel('openAI');
      }
    } catch (error) {
      console.error('Error fetching selected model:', error);
      setSelectedModel('openAI');
    }
  };

  return (
    <div>
      <Header />

      {/* Mobile Slide-out Sidebar */}
      {(isMobile || isTablet) && (
        <ResponsiveSidebar>
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isMobile={isMobile || isTablet}
            logout={logout}
          />
        </ResponsiveSidebar>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <BackNavigation className='cursor-pointer' />
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            <p className="text-gray-600">Welcome back, {admin?.name || admin?.email}! Manage your online learning platform efficiently.</p>
            {/* <span className="text-sm text-gray-600">Welcome, {admin?.name || admin?.email}</span> */}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation - Desktop Only */}
            <div className="lg:w-1/4 sticky top-25 self-start hidden lg:block">
              <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} logout={logout} />
            </div>

            {/* Main Content Area */}
            <div className="lg:w-3/4">
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {overviewCards.map((card, index) => {
                      const IconComponent = card.icon;
                      return (
                        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{card.title}</p>
                              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-${card.color}-100`}>
                              <IconComponent className={`w-6 h-6 text-${card.color}-600`} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <Activity className="w-6 h-6 text-blue-600 mr-2" />
                      <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full mr-3`}></div>
                          <p className="text-sm text-gray-700">{activity.message}</p>
                          <span className="text-xs text-gray-500 ml-auto">{activity.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'users' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setUserTab('students')}
                          className={`cursor-pointer flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${userTab === 'students'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Students
                        </button>
                        <button
                          onClick={() => setUserTab('teachers')}
                          className={`cursor-pointer flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${userTab === 'teachers'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Teachers
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {/* Search and Filter */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      {/* Users Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Registration Date</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(userTab === 'students' ? mockStudents : mockTeachers)
                              .filter(user =>
                                (filterStatus === 'all' || user.status.toLowerCase() === filterStatus) &&
                                (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  user.email.toLowerCase().includes(searchTerm.toLowerCase()))
                              )
                              .map((user) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-4">{user.name}</td>
                                  <td className="py-3 px-4">{user.email}</td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                      }`}>
                                      {user.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">{user.registrationDate}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleViewUserProfile(user)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        title="View"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        title="Edit"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
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

              {activeSection === 'courses' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Course Management</h2>
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Course
                        </button>
                      </div>

                      {/* Search and Filter */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Courses Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Course Name</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Teacher</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Enrolled Students</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Created Date</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockCourses
                              .filter(course =>
                                (filterStatus === 'all' || course.status.toLowerCase() === filterStatus) &&
                                (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  course.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
                              )
                              .map((course) => (
                                <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-4 font-medium">{course.name}</td>
                                  <td className="py-3 px-4">{course.teacher}</td>
                                  <td className="py-3 px-4">{course.enrolledStudents}</td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${course.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                      }`}>
                                      {course.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">{course.createdDate}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex space-x-2">
                                      <button
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        title="View Details"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        title="Edit"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Course Statistics */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900">Total Courses</h3>
                          <p className="text-2xl font-bold text-blue-600">{mockCourses.length}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900">Active Courses</h3>
                          <p className="text-2xl font-bold text-green-600">
                            {mockCourses.filter(c => c.status === 'Active').length}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900">Total Enrollments</h3>
                          <p className="text-2xl font-bold text-purple-600">
                            {mockCourses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'content' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Content Management</h2>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setContentTab('materials')}
                          className={`cursor-pointer flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${contentTab === 'materials'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Materials
                        </button>
                        <button
                          onClick={() => setContentTab('tests')}
                          className={`cursor-pointer flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${contentTab === 'tests'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Tests
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {contentTab === 'materials' && (
                        <div>
                          {/* Materials Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">File Name</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Uploader</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Upload Date</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Course</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {mockMaterials.map((material) => (
                                  <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{material.name}</td>
                                    <td className="py-3 px-4">
                                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                        {material.type}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">{material.uploader}</td>
                                    <td className="py-3 px-4">{material.uploadDate}</td>
                                    <td className="py-3 px-4">{material.course}</td>
                                    <td className="py-3 px-4">
                                      <div className="flex space-x-2">
                                        <button
                                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                          title="Download"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                                          title="Approve"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                        </button>
                                        <button
                                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                                          title="Remove"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {contentTab === 'tests' && (
                        <div>
                          {/* Tests Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Test Title</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Questions</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned To</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created Date</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {mockTests.map((test) => (
                                  <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{test.title}</td>
                                    <td className="py-3 px-4">{test.subject}</td>
                                    <td className="py-3 px-4">{test.questionsCount}</td>
                                    <td className="py-3 px-4">{test.assignedTo}</td>
                                    <td className="py-3 px-4">{test.createdDate}</td>
                                    <td className="py-3 px-4">
                                      <div className="flex space-x-2">
                                        <button
                                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                          title="View Details"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                                          title="Edit"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Content Statistics */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900">
                            {contentTab === 'materials' ? 'Total Materials' : 'Total Tests'}
                          </h3>
                          <p className="text-2xl font-bold text-blue-600">
                            {contentTab === 'materials' ? mockMaterials.length : mockTests.length}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900">Recent Uploads</h3>
                          <p className="text-2xl font-bold text-green-600">
                            {contentTab === 'materials' ? '12' : '8'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Analytics & Reports</h2>
                        <div className="flex space-x-2">
                          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 3 months</option>
                          </select>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Export Report
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-blue-800">User Growth</h3>
                          <p className="text-2xl font-bold text-blue-900">+12%</p>
                          <p className="text-xs text-blue-700">vs last month</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-green-800">Course Popularity</h3>
                          <p className="text-2xl font-bold text-green-900">85%</p>
                          <p className="text-xs text-green-700">avg completion</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-purple-800">Test Performance</h3>
                          <p className="text-2xl font-bold text-purple-900">78%</p>
                          <p className="text-xs text-purple-700">avg score</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-orange-800">Attendance Rate</h3>
                          <p className="text-2xl font-bold text-orange-900">92%</p>
                          <p className="text-xs text-orange-700">overall</p>
                        </div>
                      </div>

                      {/* Charts Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* User Registration Trend */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration Trend</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Mon</span>
                              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                              </div>
                              <span className="text-sm font-medium">24</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Tue</span>
                              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                              <span className="text-sm font-medium">30</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Wed</span>
                              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                              </div>
                              <span className="text-sm font-medium">36</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Thu</span>
                              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                              <span className="text-sm font-medium">34</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Fri</span>
                              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                              </div>
                              <span className="text-sm font-medium">38</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-4">* Full charts with Chart.js/Recharts integration planned</p>
                        </div>

                        {/* Course Enrollment Distribution */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollment Distribution</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Mathematics 101</span>
                                <span>45 students</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Physics Fundamentals</span>
                                <span>32 students</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Chemistry Basics</span>
                                <span>28 students</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '56%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Biology 101</span>
                                <span>21 students</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-4">* Full charts with Chart.js/Recharts integration planned</p>
                        </div>
                      </div>

                      {/* Detailed Reports Table */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Report Type</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Generated</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="py-3 px-4">User Activity Report</td>
                                <td className="py-3 px-4">Last 30 days</td>
                                <td className="py-3 px-4">2024-12-10</td>
                                <td className="py-3 px-4">
                                  <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                                </td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="py-3 px-4">Course Performance</td>
                                <td className="py-3 px-4">Last 7 days</td>
                                <td className="py-3 px-4">2024-12-08</td>
                                <td className="py-3 px-4">
                                  <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3 px-4">Test Results Summary</td>
                                <td className="py-3 px-4">Last 30 days</td>
                                <td className="py-3 px-4">2024-12-05</td>
                                <td className="py-3 px-4">
                                  <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
                    </div>

                    <div className="p-6 space-y-8">
                      {/* User Registration Settings */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Require Admin Approval</label>
                              <p className="text-xs text-gray-500">New user registrations need admin approval before activation</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Email Verification</label>
                              <p className="text-xs text-gray-500">Require email verification for new accounts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Content Moderation */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Moderation</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Auto-approve Teacher Content</label>
                              <p className="text-xs text-gray-500">Automatically approve content uploaded by teachers</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Content Review Required</label>
                              <p className="text-xs text-gray-500">Require admin review for all uploaded materials</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                              <p className="text-xs text-gray-500">Send email notifications for important events</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">System Alerts</label>
                              <p className="text-xs text-gray-500">Receive alerts for system maintenance and issues</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Model Settings */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Image Analysis Model</label>
                            <p className="text-xs text-gray-500">Select the AI model to use for analyzing uploaded images and extracting questions</p>
                            <select
                              value={selectedModel}
                              onChange={(e) => setSelectedModel(e.target.value)}
                              className="cursor-pointer mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="openAI">OpenAI (GPT-4o)</option>
                              <option value="perplexity">Perplexity</option>
                              <option value="claude">Claude (Anthropic)</option>
                              <option value="gemini">Gemini (Google)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Maintenance Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button className="cursor-pointer flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Settings className="w-4 h-4 mr-2" />
                            Database Backup
                          </button>
                          <button className="cursor-pointer flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <Activity className="w-4 h-4 mr-2" />
                            View System Logs
                          </button>
                        </div>
                      </div>

                      {/* Save Settings */}
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex justify-end">
                          <button className="cursor-pointer px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors mr-4">
                            Reset to Defaults
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const response = await fetch(`${URL}/admin/settings`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    key: 'llm_model',
                                    value: selectedModel
                                  }),
                                });

                                if (response.ok) {
                                  alert('Settings saved successfully!');
                                } else {
                                  alert('Failed to save settings.');
                                }
                              } catch (error) {
                                console.error('Error saving settings:', error);
                                alert('Error saving settings.');
                              }
                            }}
                            className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">User Details</h3>
            <div className="space-y-3">
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
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;