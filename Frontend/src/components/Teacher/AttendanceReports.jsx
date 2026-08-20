import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { mockFetch } from '../../mockData/mockFetch';

const AttendanceReports = () => {
  const { t } = useTranslation();
  const [selectedClass, setSelectedClass] = useState('JEE');
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentDate = today.toISOString().split('T')[0];
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);

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
      const response = await mockFetch(`${URL}/api/getAllStudentInfo`);
      const data = await response.json();

      if (response.ok) {
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
      const response = await mockFetch(`${URL}/api/attendanceRecords/${teacherId.id}?${queryParams}`, {
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
    fetchStudents();
    getAttendanceRecords();
  }, [selectedClass, dateRange.start, dateRange.end]);

  const classes = ['JEE', 'NEET', 'CET (PCM)', 'CET (PCB)'];

  const calculateAttendanceStats = (className) => {
    const classRecords = attendanceRecords?.filter(record => record.class === className) || [];
    const totalPresent = classRecords.filter(record => record.status === 'present').length;
    const totalAbsent = classRecords.filter(record => record.status === 'absent').length;
    const totalRecords = totalPresent + totalAbsent;

    const averageAttendance = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

    const trend = calculateTrend(classRecords);

    return {
      totalStudents: students?.length || 0,
      averageAttendance,
      totalPresent,
      totalAbsent,
      trend
    };
  };

  const calculateTrend = (records) => {
    if (!records || records.length === 0) return 'stable';

    const sortedRecords = records.sort((a, b) => new Date(a.date) - new Date(b.date));

    const midPoint = Math.floor(sortedRecords.length / 2);
    const recentRecords = sortedRecords.slice(midPoint);
    const olderRecords = sortedRecords.slice(0, midPoint);

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

  const calculateWeeklyTrends = () => {
    const classRecords = attendanceRecords.filter(record => record.class === selectedClass);
    const sortedRecords = classRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

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

      let percentage;
      if (total === 0) {
        const daysInWeek = Math.ceil((weekEnd - weekStart) / (1000 * 60 * 60 * 24));
        percentage = daysInWeek >= 5 ? 0 : 50;
      } else {
        percentage = Math.round((present / total) * 100);
      }

      weeks.push(percentage);
    }

    return weeks;
  };

  const attendanceData = {
    'JEE': { summary: calculateAttendanceStats('JEE') },
    'NEET': { summary: calculateAttendanceStats('NEET') },
    'CET (PCM)': { summary: calculateAttendanceStats('CET (PCM)') },
    'CET (PCB)': { summary: calculateAttendanceStats('CET (PCB)') }
  };

  const currentClassData = attendanceData[selectedClass] || attendanceData['JEE'];

  return (
    <div className="space-y-6 section-fade-in">
      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-xl soft-bloom p-6 border border-surface-variant">
        <h3 className="text-lg font-semibold text-on-surface mb-4">{t('attendanceReports.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">{t('attendanceReports.class')}</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">{t('attendanceReports.startDate')}</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">{t('attendanceReports.endDate')}</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Class Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest rounded-xl soft-bloom p-6 border border-surface-variant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">{t('attendanceReports.totalStudents')}</p>
              <p className="text-2xl font-bold text-on-surface">{currentClassData.summary.totalStudents}</p>
            </div>
            <span className="material-symbols-outlined w-8 h-8 text-primary">group</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl soft-bloom p-6 border border-surface-variant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">{t('attendanceReports.averageAttendance')}</p>
              <p className="text-2xl font-bold text-on-surface">{currentClassData.summary.averageAttendance}%</p>
            </div>
            <span className="material-symbols-outlined w-8 h-8 text-primary">bar_chart</span>
          </div>
          <div className="flex items-center mt-2">
            {currentClassData.summary.trend === 'up' && <span className="material-symbols-outlined w-4 h-4 text-primary mr-1">trending_up</span>}
            {currentClassData.summary.trend === 'down' && <span className="material-symbols-outlined w-4 h-4 text-error mr-1">trending_down</span>}
            <span className={`text-xs ${currentClassData.summary.trend === 'up' ? 'text-primary' : 'text-error'}`}>
              {currentClassData.summary.trend === 'up' ? '+2%' : '-1%'} {t('attendanceReports.fromLastMonth')}
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl soft-bloom p-6 border border-surface-variant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">{t('attendanceReports.presentToday')}</p>
              <p className="text-2xl font-bold text-primary">{currentClassData.summary.totalPresent}</p>
            </div>
            <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl soft-bloom p-6 border border-surface-variant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">{t('attendanceReports.absentToday')}</p>
              <p className="text-2xl font-bold text-error">{currentClassData.summary.totalAbsent}</p>
            </div>
            <div className="w-8 h-8 bg-error-container rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-error rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-surface-container-lowest rounded-xl soft-bloom border border-surface-variant">
        <div className="p-6 border-b border-surface-variant">
          <h4 className="font-semibold text-on-surface">{t('attendanceReports.individualRecords')}</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">{t('attendanceReports.student')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">{t('attendanceReports.rollNo')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">{t('attendanceReports.attendancePercent')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">{t('attendanceReports.recentRecords')}</th>
              </tr>
            </thead>
            <tbody className="bg-surface-container-lowest divide-y divide-surface-variant">
              {students.length > 0 ? students.map((student) => (
                <tr key={student.student_id || student.id} className="hover:bg-surface-container-low">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-on-surface">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-on-surface-variant">{student.rollNo || student.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-on-surface">85%</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {['present', 'present', 'absent', 'present', 'present'].slice(-5).map((status, index) => (
                        <span
                          key={index}
                          className={`inline-block w-6 h-6 rounded-full text-xs flex items-center justify-center ${status === 'present' ? 'bg-primary text-primary-foreground' : 'bg-error text-white'
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
                  <td colSpan="4" className="px-6 py-4 text-center text-on-surface-variant">
                    {t('attendanceReports.noStudents', { class: selectedClass })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Trends Chart */}
      <div className="bg-surface-container-lowest rounded-xl soft-bloom p-6 border border-surface-variant">
        <h4 className="font-semibold text-on-surface mb-4">{t('attendanceReports.attendanceTrends')}</h4>
        <div className="h-64 flex items-end justify-between gap-2">
          {calculateWeeklyTrends().map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                style={{ height: `${value * 2}px` }}
              ></div>
              <span className="text-xs text-on-surface-variant mt-2">{t('attendanceReports.week')} {index + 1}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-on-surface-variant">{t('attendanceReports.weeklyDescription', { class: selectedClass })}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;
