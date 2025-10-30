import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';

const AttendanceReports = () => {
  const [selectedClass, setSelectedClass] = useState('JEE');
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentDate = today.toISOString().split('T')[0];
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const teacherId = {
    id: 1,
    name: 'John Smith'
  };

  const [dateRange, setDateRange] = useState({
    start: firstDayOfMonth.toISOString().split('T')[0],
    end: currentDate
  });

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${URL}/api/getAllStudentInfo`);
      const data = await response.json();



      if (response.ok) {
        // Filter students by selected class
        const classStudents = data.data.filter(student => student.class === selectedClass);
        setStudents(classStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };


  const getAttendanceRecords = async () => {
    try {
      const queryParams = new URLSearchParams({
        class: selectedClass,
        startDate: dateRange.start,
        endDate: dateRange.end
      });
      const response = await fetch(`${URL}/api/attendanceRecords/${teacherId.id}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attendance records');
      }

      const data = await response.json();
      console.log('Fetched attendance records:', data);
      setAttendanceRecords(data.data || []);

    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };


  useEffect(() => {
    // Fetch any required data on component mount
    fetchStudents();
    getAttendanceRecords();
  }, [selectedClass, dateRange.start, dateRange.end]);

  const classes = ['JEE', 'NEET', 'CET (PCM)', 'CET (PCB)'];

  // Calculate attendance statistics dynamically
  const calculateAttendanceStats = (className) => {
    const classRecords = attendanceRecords?.filter(record => record.class === className) || [];
    const totalPresent = classRecords.filter(record => record.status === 'present').length;
    const totalAbsent = classRecords.filter(record => record.status === 'absent').length;
    const totalRecords = totalPresent + totalAbsent;

    // Calculate average attendance percentage
    const averageAttendance = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

    // Calculate trend based on recent vs older records
    const trend = calculateTrend(classRecords);

    return {
      totalStudents: students?.length || 0,
      averageAttendance,
      totalPresent,
      totalAbsent,
      trend
    };
  };

  // Calculate attendance trend
  const calculateTrend = (records) => {
    if (!records || records.length === 0) return 'stable';

    // Sort records by date
    const sortedRecords = records.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Split into two halves (recent vs older)
    const midPoint = Math.floor(sortedRecords.length / 2);
    const recentRecords = sortedRecords.slice(midPoint);
    const olderRecords = sortedRecords.slice(0, midPoint);

    // Calculate attendance percentages for each period
    const recentPresent = recentRecords.filter(r => r.status === 'present').length;
    const recentTotal = recentRecords.length;
    const recentPercentage = recentTotal > 0 ? (recentPresent / recentTotal) * 100 : 0;

    const olderPresent = olderRecords.filter(r => r.status === 'present').length;
    const olderTotal = olderRecords.length;
    const olderPercentage = olderTotal > 0 ? (olderPresent / olderTotal) * 100 : 0;

    const difference = recentPercentage - olderPercentage;

    if (difference > 5) return 'up';
    if (difference < -5) return 'down';
    return 'stable';
  };

  // Calculate weekly attendance trends for the chart
  const calculateWeeklyTrends = () => {
    // if (!attendanceRecords || attendanceRecords.length === 0) {
    //   return [65, 70, 75, 80, 78, 82, 85]; // Default mock data
    // }

    const classRecords = attendanceRecords.filter(record => record.class === selectedClass);
    const sortedRecords = classRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group by weeks (last 7 weeks)
    const weeks = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - 6);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (i * 7));

      const weekRecords = sortedRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= weekStart && recordDate <= weekEnd;
      });

      const present = weekRecords.filter(r => r.status === 'present').length;
      const total = weekRecords.length;

      // If around 7 days and attendance is zero, show 0
      let percentage;
      if (total === 0) {
        // Check if this week should have around 7 days of potential attendance
        const daysInWeek = Math.ceil((weekEnd - weekStart) / (1000 * 60 * 60 * 24));
        percentage = daysInWeek >= 5 ? 0 : 50; // If week has 5+ days, assume should have attendance, show 0
      } else {
        percentage = Math.round((present / total) * 100);
      }

      weeks.push(percentage);
    }

    return weeks;
  };

  // Mock attendance data - now using dynamic calculations
  const attendanceData = {
    'JEE': { summary: calculateAttendanceStats('JEE') },
    'NEET': { summary: calculateAttendanceStats('NEET') },
    'CET (PCM)': { summary: calculateAttendanceStats('CET (PCM)') },
    'CET (PCB)': { summary: calculateAttendanceStats('CET (PCB)') }
  };

  const currentClassData = attendanceData[selectedClass] || attendanceData['JEE'];

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
              {students.length > 0 ? students.map((student) => (
                <tr key={student.student_id || student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.rollNo || student.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">85%</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {/* Mock recent records - replace with actual data */}
                      {['present', 'present', 'absent', 'present', 'present'].slice(-5).map((status, index) => (
                        <span
                          key={index}
                          className={`inline-block w-6 h-6 rounded-full text-xs flex items-center justify-center text-white ${status === 'present' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          title={`Day ${index + 1}: ${status}`}
                        >
                          {status === 'present' ? 'P' : 'A'}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No students found for {selectedClass}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Trends Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Attendance Trends</h4>
        <div className="h-64 flex items-end justify-between gap-2">
          {calculateWeeklyTrends().map((value, index) => (
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
          <p className="text-sm text-gray-600">Weekly attendance percentage over the last 7 weeks for {selectedClass}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;