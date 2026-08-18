import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { mockFetch } from '../../mockData/mockFetch';

const AttendanceTracker = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('JEE');
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const currentTeacher = {
    id: 1,
    name: 'John Smith'
  };

  const URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await mockFetch(`${URL}/api/getAllStudentInfo`);
        const data = await response.json();

        if (response.ok) {
          const classStudents = data.data.filter(student => student.class === selectedClass);
          setStudents(classStudents);
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
      toast.error(t('attendanceTracker.noStudentsFound'));
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
      const response = await mockFetch(`${URL}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('attendanceTracker.saveSuccess'));
        setAttendance({});
        fetchTodaysAttendance();
      } else {
        toast.error(t('attendanceTracker.saveError', { message: data.message }));
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error(t('attendanceTracker.saveFailed'));
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

  const fetchTodaysAttendance = async () => {
    try {
      setLoadingAttendance(true);
      const response = await mockFetch(`${URL}/api/attendance?date=${selectedDate}&class=${selectedClass}`);
      const data = await response.json();

      if (response.ok) {
        const attendanceRecords = data.data.map(record => {
          const student = students.find(s => s.id === record.student_id);

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
    <div className="space-y-6 section-fade-in">
      <div className="bg-surface-container-lowest rounded-xl soft-bloom p-6 border border-surface-variant">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-on-surface">{t('attendanceTracker.markAttendance')}</h3>
          <div className="text-sm text-on-surface-variant">
            {t('attendanceTracker.teacher')}: <span className="font-medium text-on-surface">{currentTeacher.name}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">{t('attendanceTracker.date')}</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">{t('attendanceTracker.class')}</label>
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
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl soft-bloom p-6 border border-surface-variant">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex gap-2">
            <button
              onClick={markAllPresent}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl hover:opacity-90 transition-opacity duration-300 flex items-center"
            >
              <span className="material-symbols-outlined w-4 h-4 mr-2">person_check</span>
              {t('attendanceTracker.markAllPresent')}
            </button>
            <button
              onClick={markAllAbsent}
              className="px-4 py-2 bg-error text-white rounded-xl hover:opacity-90 transition-opacity duration-300 flex items-center"
            >
              <span className="material-symbols-outlined w-4 h-4 mr-2">person_cancel</span>
              {t('attendanceTracker.markAllAbsent')}
            </button>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-primary font-medium">{t('attendanceTracker.present')}: {stats.present}</span>
            <span className="text-error font-medium">{t('attendanceTracker.absent')}: {stats.absent}</span>
            <span className="text-on-surface-variant font-medium">{t('attendanceTracker.unmarked')}: {stats.unmarked}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl soft-bloom border border-surface-variant">
        <div className="p-6 border-b border-surface-variant">
          <h4 className="font-semibold text-on-surface">{t('attendanceTracker.studentRoster')} - {selectedClass}</h4>
        </div>
        <div className="divide-y divide-surface-variant">
          {loading ? (
            <div className="p-6 text-center text-on-surface-variant">
              {t('attendanceTracker.loadingStudents')}
            </div>
          ) : students.length === 0 ? (
            <div className="p-6 text-center text-on-surface-variant">
              {t('attendanceTracker.noStudentsForClass', { class: selectedClass })}
            </div>
          ) : (
            students.map((student) => {
              const studentId = student.student_id || student.id;
              return (
                <div key={studentId} className="p-4 hover:bg-surface-container-low transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-surface-container p-2 rounded-full mr-3">
                        <span className="material-symbols-outlined w-5 h-5 text-on-surface-variant">group</span>
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{student.name}</p>
                        <p className="text-sm text-on-surface-variant">ID: {studentId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAttendanceChange(studentId, 'present')}
                        className={`p-2 rounded-xl transition-colors duration-200 ${attendance[studentId] === 'present'
                          ? 'bg-primary-container text-on-primary-container'
                          : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
                          }`}
                        title={t('attendanceTracker.markPresent')}
                      >
                        <span className="material-symbols-outlined w-5 h-5">check_circle</span>
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(studentId, 'absent')}
                        className={`p-2 rounded-xl transition-colors duration-200 ${attendance[studentId] === 'absent'
                          ? 'bg-error-container text-on-error-container'
                          : 'text-on-surface-variant hover:bg-error-container hover:text-error'
                          }`}
                        title={t('attendanceTracker.markAbsent')}
                      >
                        <span className="material-symbols-outlined w-5 h-5">cancel</span>
                      </button>
                      <span className="text-sm text-on-surface-variant min-w-[60px] text-center">
                        {attendance[studentId] ? attendance[studentId] : t('attendanceTracker.notSet')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveAttendance}
          disabled={saving || loading}
          className="px-6 py-3 bg-primary text-on-primary rounded-xl hover:opacity-90 disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-not-allowed transition-opacity duration-300 flex items-center"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent mr-2"></div>
              {t('attendanceTracker.saving')}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined w-5 h-5 mr-2">save</span>
              {t('attendanceTracker.saveAttendance')}
            </>
          )}
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl soft-bloom border border-surface-variant">
        <div className="p-6 border-b border-surface-variant">
          <h4 className="font-semibold text-on-surface">{t('attendanceTracker.todaysRecords')} - {selectedDate}</h4>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-on-surface-variant">{t('attendanceTracker.class')}: {selectedClass}</p>
            <p className="text-sm text-on-surface-variant">{t('attendanceTracker.teacher')}: {currentTeacher.name}</p>
          </div>
        </div>
        <div className="p-6">
          {loadingAttendance ? (
            <div className="text-center text-on-surface-variant">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
              {t('attendanceTracker.loadingRecords')}
            </div>
          ) : todaysAttendance.length === 0 ? (
            <div className="text-center text-on-surface-variant">
              {t('attendanceTracker.noRecordsForDate', { date: selectedDate })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">{t('attendanceTracker.studentId')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">{t('attendanceTracker.studentName')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">{t('attendanceTracker.status')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">{t('attendanceTracker.teacher')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">{t('attendanceTracker.date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {todaysAttendance.map((record, index) => (
                    <tr key={record.student_id || index} className="hover:bg-surface-container-low">
                      <td className="px-4 py-3 text-sm text-on-surface">{record.student_id}</td>
                      <td className="px-4 py-3 text-sm text-on-surface">{record.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'present'
                          ? 'bg-primary-container text-on-primary-container'
                          : record.status === 'absent'
                            ? 'bg-error-container text-on-error-container'
                            : record.status === 'late'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-surface-container text-on-surface'
                          }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface">
                        {record.teacher_name || currentTeacher.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{record.date}</td>
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
