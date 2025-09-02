import React, { useState } from 'react';
import { Calendar, Users, TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';

const AttendanceReports = () => {
  const [selectedClass, setSelectedClass] = useState('Class A');
  const [dateRange, setDateRange] = useState({
    start: '2024-08-01',
    end: '2024-08-31'
  });

  const classes = ['Class A', 'Class B', 'Class C', 'Class D'];

  // Mock attendance data
  const attendanceData = {
    'Class A': {
      students: [
        { id: 1, name: 'Alice Johnson', rollNo: '001', attendance: 85, records: [
          { date: '2024-08-01', status: 'present' },
          { date: '2024-08-02', status: 'present' },
          { date: '2024-08-03', status: 'absent' },
          { date: '2024-08-04', status: 'present' },
          { date: '2024-08-05', status: 'present' }
        ]},
        { id: 2, name: 'Bob Smith', rollNo: '002', attendance: 92, records: [
          { date: '2024-08-01', status: 'present' },
          { date: '2024-08-02', status: 'present' },
          { date: '2024-08-03', status: 'present' },
          { date: '2024-08-04', status: 'present' },
          { date: '2024-08-05', status: 'present' }
        ]},
        { id: 3, name: 'Charlie Brown', rollNo: '003', attendance: 78, records: [
          { date: '2024-08-01', status: 'absent' },
          { date: '2024-08-02', status: 'present' },
          { date: '2024-08-03', status: 'present' },
          { date: '2024-08-04', status: 'absent' },
          { date: '2024-08-05', status: 'present' }
        ]}
      ],
      summary: {
        totalStudents: 25,
        averageAttendance: 82,
        totalPresent: 20,
        totalAbsent: 5,
        trend: 'up' // up, down, stable
      }
    }
  };

  const currentClassData = attendanceData[selectedClass] || attendanceData['Class A'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Class Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{currentClassData.summary.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{currentClassData.summary.averageAttendance}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex items-center mt-2">
            {currentClassData.summary.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600 mr-1" />}
            {currentClassData.summary.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600 mr-1" />}
            <span className={`text-xs ${currentClassData.summary.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {currentClassData.summary.trend === 'up' ? '+2%' : '-1%'} from last month
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{currentClassData.summary.totalPresent}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{currentClassData.summary.totalAbsent}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Individual Student Records</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Records</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentClassData.students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.rollNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.attendance}%</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {student.records.slice(-5).map((record, index) => (
                        <span
                          key={index}
                          className={`inline-block w-6 h-6 rounded-full text-xs flex items-center justify-center text-white ${
                            record.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          title={`${record.date}: ${record.status}`}
                        >
                          {record.status === 'present' ? 'P' : 'A'}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Trends Chart (Mock) */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Attendance Trends</h4>
        <div className="h-64 flex items-end justify-between gap-2">
          {[65, 70, 75, 80, 78, 82, 85].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${value * 2}px` }}
              ></div>
              <span className="text-xs text-gray-600 mt-2">Week {index + 1}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Weekly attendance percentage over the last 7 weeks</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;