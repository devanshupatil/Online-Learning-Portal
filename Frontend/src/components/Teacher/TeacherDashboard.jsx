import React, { useState } from 'react';
import { Users, BookOpen, FileText, Calendar, TrendingUp, Upload, Settings, Plus, BarChart3, CheckCircle, PieChart, User } from 'lucide-react';
import Header from '../Header';
import TeacherSidebar from './TeacherSidebar';
import MaterialUpload from './MaterialUpload';
import MaterialManager from './MaterialManager';
import TestCreator from './TestCreator';
import TestManager from './TestManager';
import AttendanceTracker from './AttendanceTracker';
import AttendanceReports from './AttendanceReports';
import StudentDirectory from './StudentDirectory';
import StudentProfileView from './StudentProfileView';

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [materialTab, setMaterialTab] = useState('upload');
  const [testTab, setTestTab] = useState('create');
  const [attendanceTab, setAttendanceTab] = useState('tracker');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleViewStudentProfile = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setSelectedStudent(null);
    setShowProfileModal(false);
  };

  // Mock data for teacher overview
  const overviewData = {
    totalStudents: 45,
    activeClasses: 3,
    uploadedMaterials: 12,
    pendingTests: 2,
    attendanceRate: 92
  };

  const overviewCards = [
    {
      title: 'Total Students',
      value: overviewData.totalStudents,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Classes',
      value: overviewData.activeClasses,
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Uploaded Materials',
      value: overviewData.uploadedMaterials,
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Pending Tests',
      value: overviewData.pendingTests,
      icon: BookOpen,
      color: 'orange'
    },
    {
      title: 'Avg Attendance',
      value: `${overviewData.attendanceRate}%`,
      icon: Calendar,
      color: 'teal'
    }
  ];

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
            <p className="text-gray-600">Welcome back! Manage your classes and students effectively.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4 sticky top-25 self-start">
              <TeacherSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
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
                      <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                      <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <p className="text-sm text-gray-700">New material uploaded to Mathematics class</p>
                        <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <p className="text-sm text-gray-700">Test results published for Science class</p>
                        <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <p className="text-sm text-gray-700">Attendance marked for all classes</p>
                        <span className="text-xs text-gray-500 ml-auto">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'materials' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Study Materials</h2>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setMaterialTab('upload')}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            materialTab === 'upload'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </button>
                        <button
                          onClick={() => setMaterialTab('manage')}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            materialTab === 'manage'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {materialTab === 'upload' && <MaterialUpload />}
                      {materialTab === 'manage' && <MaterialManager />}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'tests' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Test Management</h2>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setTestTab('create')}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            testTab === 'create'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create
                        </button>
                        <button
                          onClick={() => setTestTab('manage')}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            testTab === 'manage'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Manage
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {testTab === 'create' && <TestCreator />}
                      {testTab === 'manage' && <TestManager />}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'attendance' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Management</h2>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setAttendanceTab('tracker')}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            attendanceTab === 'tracker'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Attendance
                        </button>
                        <button
                          onClick={() => setAttendanceTab('reports')}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            attendanceTab === 'reports'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <PieChart className="w-4 h-4 mr-2" />
                          Reports
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {attendanceTab === 'tracker' && <AttendanceTracker />}
                      {attendanceTab === 'reports' && <AttendanceReports />}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'students' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Student Directory</h2>
                    </div>
                    <div className="p-6">
                      <StudentDirectory onViewProfile={handleViewStudentProfile} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      {showProfileModal && selectedStudent && (
        <StudentProfileView
          student={selectedStudent}
          onClose={handleCloseProfileModal}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;