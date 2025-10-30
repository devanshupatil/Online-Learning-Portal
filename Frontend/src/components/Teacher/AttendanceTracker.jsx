import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Save, UserCheck, UserX } from 'lucide-react';

const AttendanceTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('JEE');
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // Mock teacher data - in a real app, this would come from authentication
  const currentTeacher = {
    id: 1,
    name: 'John Smith'
  };

  const URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch students for selected class
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL}/api/getAllStudentInfo`);
        const data = await response.json();

        if (response.ok) {
          // Filter students by selected class
          const classStudents = data.data.filter(student => student.class === selectedClass);
          setStudents(classStudents);

          // Reset attendance when class changes
          setAttendance({});
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass, URL]);

  // Fetch today's attendance when date or class changes
  // Fetch today's attendance when date, class changes, or students are loaded
  useEffect(() => {
    if (selectedDate && selectedClass && students.length > 0) {
      fetchTodaysAttendance();
    }
  }, [selectedDate, selectedClass, students, URL]);

  const classes = ['JEE', 'NEET', 'CET (PCM)', 'CET (PCB)'];

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      const studentId = student.student_id || student.id;
      allPresent[studentId] = 'present';
    });
    setAttendance(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    students.forEach(student => {
      const studentId = student.student_id || student.id;
      allAbsent[studentId] = 'absent';
    });
    setAttendance(allAbsent);
  };

  const saveAttendance = async () => {
    if (students.length === 0) {
      alert('No students found for the selected class.');
      return;
    }

    setSaving(true);
    const attendanceData = {
      date: selectedDate,
      class: selectedClass,
      teacherId: currentTeacher.id,
      records: students.map(student => ({
        studentId: student.student_id || student.id,
        name: student.name,
        status: attendance[student.student_id || student.id] || 'absent'
      }))
    };

    try {
      const response = await fetch(`${URL}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Attendance saved successfully!');
        // Reset attendance after saving
        setAttendance({});
        // Refresh today's attendance display
        fetchTodaysAttendance();
      } else {
        alert(`Error saving attendance: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStats = () => {
    const present = Object.values(attendance).filter(status => status === 'present').length;
    const absent = Object.values(attendance).filter(status => status === 'absent').length;
    const unmarked = students.length - present - absent;
    return { present, absent, unmarked };
  };

  // Fetch today's attendance records
  const fetchTodaysAttendance = async () => {
    try {
      setLoadingAttendance(true);
      const response = await fetch(`${URL}/api/attendance?date=${selectedDate}&class=${selectedClass}`);
      const data = await response.json();


      if (response.ok) {
        // Transform the data to match our display format
        const attendanceRecords = data.data.map(record => {
          // Try multiple ID fields for lookup
          const student = students.find(s => s.id === record.student_id );
          
          return {
            student_id: record.student_id,
            name: student ? student.name : (record.name || record.student_name || 'Unknown Student'),
            status: record.status || 'Not marked',
            date: record.date || selectedDate,
            teacher_id: record.teacher_id,
            teacher_name: record.teacher_name
          };
        });

        setTodaysAttendance(attendanceRecords);
      } else {
        console.error('Error fetching attendance:', data.message);
        setTodaysAttendance([]);
      }
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      setTodaysAttendance([]);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const stats = getAttendanceStats();




  return (
    <div className="space-y-6">
      {/* Header with Date and Class Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mark Attendance</h3>
          <div className="text-sm text-gray-600">
            Teacher: <span className="font-medium text-gray-900">{currentTeacher.name}</span>
          </div>
        </div>
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
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading students...
            </div>
          ) : students.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No students found for {selectedClass}.
            </div>
          ) : (
            students.map((student) => {
              const studentId = student.student_id || student.id;
              return (
                <div key={studentId} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">ID: {studentId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAttendanceChange(studentId, 'present')}
                        className={`p-2 rounded-lg transition-colors duration-200 ${attendance[studentId] === 'present'
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                          }`}
                        title="Mark Present"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(studentId, 'absent')}
                        className={`p-2 rounded-lg transition-colors duration-200 ${attendance[studentId] === 'absent'
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                        title="Mark Absent"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-gray-500 min-w-[60px] text-center">
                        {attendance[studentId] ? attendance[studentId] : 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveAttendance}
          disabled={saving || loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Attendance
            </>
          )}
        </button>
      </div>

      {/* Today's Attendance Records */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Today's Attendance Records - {selectedDate}</h4>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-600">Class: {selectedClass}</p>
            <p className="text-sm text-gray-600">Teacher: {currentTeacher.name}</p>
          </div>
        </div>
        <div className="p-6">
          {loadingAttendance ? (
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Loading attendance records...
            </div>
          ) : todaysAttendance.length === 0 ? (
            <div className="text-center text-gray-500">
              No attendance records found for {selectedDate}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {todaysAttendance.map((record, index) => (
                    <tr key={record.student_id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{record.student_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : record.status === 'late'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {record.teacher_name || currentTeacher.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{record.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;