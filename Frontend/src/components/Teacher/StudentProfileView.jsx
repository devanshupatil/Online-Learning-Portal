import React from 'react';
import { Users, Mail, Phone, Calendar, TrendingUp, BookOpen, MessageSquare, Award, Target } from 'lucide-react';

const StudentProfileView = ({ student, onClose }) => {
  // Mock detailed data for the student
  const studentDetails = {
    ...student,
    address: '123 Main St, Springfield, IL 62701',
    parentName: 'John Johnson',
    parentPhone: '+1 (555) 987-6543',
    parentEmail: 'john.johnson@example.com',
    enrollmentDate: '2023-09-01',
    dateOfBirth: '2008-05-15',
    emergencyContact: '+1 (555) 111-2222'
  };

  const attendanceRecords = [
    { date: '2024-08-01', status: 'present' },
    { date: '2024-08-02', status: 'present' },
    { date: '2024-08-03', status: 'absent' },
    { date: '2024-08-04', status: 'present' },
    { date: '2024-08-05', status: 'present' },
    { date: '2024-08-06', status: 'late' },
    { date: '2024-08-07', status: 'present' }
  ];

  const testResults = [
    { subject: 'Mathematics', test: 'Algebra Quiz 1', score: 85, maxScore: 100, date: '2024-08-10' },
    { subject: 'Science', test: 'Chemistry Lab', score: 92, maxScore: 100, date: '2024-08-12' },
    { subject: 'English', test: 'Literature Essay', score: 78, maxScore: 100, date: '2024-08-15' },
    { subject: 'History', test: 'World War II Exam', score: 88, maxScore: 100, date: '2024-08-18' }
  ];

  const progressData = [
    { subject: 'Mathematics', progress: 75, grade: 'B+' },
    { subject: 'Science', progress: 82, grade: 'A-' },
    { subject: 'English', progress: 70, grade: 'B-' },
    { subject: 'History', progress: 85, grade: 'A' },
    { subject: 'Computer Science', progress: 90, grade: 'A+' }
  ];

  const communicationHistory = [
    { date: '2024-08-20', type: 'Parent Meeting', message: 'Discussed student progress and goals' },
    { date: '2024-08-15', type: 'Email', message: 'Sent homework reminder' },
    { date: '2024-08-10', type: 'Phone Call', message: 'Discussed attendance concerns' },
    { date: '2024-08-05', type: 'Note', message: 'Positive feedback on recent assignment' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{studentDetails.name}</h2>
                <p className="text-gray-600">Roll No: {studentDetails.rollNo} • {studentDetails.class} • {studentDetails.grade}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2">{studentDetails.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2">{studentDetails.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="ml-2">{studentDetails.dateOfBirth}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">Enrollment Date:</span>
                  <span className="ml-2">{studentDetails.enrollmentDate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Parent/Guardian Information</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="text-gray-600">Name:</span> {studentDetails.parentName}</p>
                <p className="text-sm"><span className="text-gray-600">Phone:</span> {studentDetails.parentPhone}</p>
                <p className="text-sm"><span className="text-gray-600">Email:</span> {studentDetails.parentEmail}</p>
                <p className="text-sm"><span className="text-gray-600">Emergency:</span> {studentDetails.emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressData.map((subject, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">{subject.progress}% Complete</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Test Results */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {testResults.map((test, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.subject}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.test}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.score}/{test.maxScore}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{test.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Records */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
            <div className="grid grid-cols-7 gap-2">
              {attendanceRecords.map((record, index) => (
                <div key={index} className="text-center">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{record.date.split('-')[2]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Communication History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication History</h3>
            <div className="space-y-3">
              {communicationHistory.map((comm, index) => (
                <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{comm.type}</span>
                      <span className="text-xs text-gray-500">{comm.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{comm.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;