import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Save, UserCheck, UserX } from 'lucide-react';

const AttendanceTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('Class A');
  const [attendance, setAttendance] = useState({});

  // Mock student data
  const students = [
    { id: 1, name: 'Alice Johnson', rollNo: '001' },
    { id: 2, name: 'Bob Smith', rollNo: '002' },
    { id: 3, name: 'Charlie Brown', rollNo: '003' },
    { id: 4, name: 'Diana Prince', rollNo: '004' },
    { id: 5, name: 'Edward Norton', rollNo: '005' },
    { id: 6, name: 'Fiona Green', rollNo: '006' },
    { id: 7, name: 'George Lucas', rollNo: '007' },
    { id: 8, name: 'Helen Troy', rollNo: '008' }
  ];

  const classes = ['Class A', 'Class B', 'Class C', 'Class D'];

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.id] = 'present';
    });
    setAttendance(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    students.forEach(student => {
      allAbsent[student.id] = 'absent';
    });
    setAttendance(allAbsent);
  };

  const saveAttendance = () => {
    const attendanceData = {
      date: selectedDate,
      class: selectedClass,
      records: students.map(student => ({
        studentId: student.id,
        name: student.name,
        status: attendance[student.id] || 'absent'
      }))
    };

    console.log('Saving attendance:', attendanceData);
    alert('Attendance saved successfully!');
  };

  const getAttendanceStats = () => {
    const present = Object.values(attendance).filter(status => status === 'present').length;
    const absent = Object.values(attendance).filter(status => status === 'absent').length;
    const unmarked = students.length - present - absent;
    return { present, absent, unmarked };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Header with Date and Class Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions and Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex gap-2">
            <button
              onClick={markAllPresent}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center"
            >
              <UserX className="w-4 h-4 mr-2" />
              Mark All Absent
            </button>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 font-medium">Present: {stats.present}</span>
            <span className="text-red-600 font-medium">Absent: {stats.absent}</span>
            <span className="text-gray-600 font-medium">Unmarked: {stats.unmarked}</span>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Student Roster - {selectedClass}</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {students.map((student) => (
            <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAttendanceChange(student.id, 'present')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      attendance[student.id] === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                    title="Mark Present"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student.id, 'absent')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      attendance[student.id] === 'absent'
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                    title="Mark Absent"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-500 min-w-[60px] text-center">
                    {attendance[student.id] ? attendance[student.id] : 'Not set'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveAttendance}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendanceTracker;