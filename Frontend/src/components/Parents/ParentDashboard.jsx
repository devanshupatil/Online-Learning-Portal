import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Award, TrendingUp } from 'lucide-react';
import Header from '../Header';
import ParentSidebar from './ParentSidebar';
import BackNavigation from '../BackNavigation';
import ResponsiveSidebar from '../ResponsiveSidebar';
import { useSidebar } from '../SidebarProvider';
import {
  PARENT_CHILD,
  CHILD_SCHEDULE,
  CHILD_ATTENDANCE_BY_SUBJECT,
  CHILD_RECENT_ATTENDANCE,
  CHILD_TEST_MARKS,
} from '../../mockData/data';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getGrade = (percentage) => {
  if (percentage >= 85) return { label: 'A', color: 'text-green-600 bg-green-100' };
  if (percentage >= 70) return { label: 'B', color: 'text-blue-600 bg-blue-100' };
  if (percentage >= 50) return { label: 'C', color: 'text-yellow-600 bg-yellow-100' };
  return { label: 'D', color: 'text-red-600 bg-red-100' };
};

const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 75) return 'text-yellow-600';
  return 'text-red-600';
};

const ParentDashboard = () => {
  const [activeSection, setActiveSection] = useState('schedule');
  const { isMobile, isTablet } = useSidebar();

  const scheduleByDay = DAY_ORDER
    .map((day) => ({ day, periods: CHILD_SCHEDULE.filter((p) => p.day === day) }))
    .filter((group) => group.periods.length > 0);

  const overallAttended = CHILD_ATTENDANCE_BY_SUBJECT.reduce((sum, s) => sum + s.attended, 0);
  const overallTotal = CHILD_ATTENDANCE_BY_SUBJECT.reduce((sum, s) => sum + s.totalClasses, 0);
  const overallPercentage = Math.round((overallAttended / overallTotal) * 100);

  return (
    <div>
      <Header />

      {(isMobile || isTablet) && (
        <ResponsiveSidebar>
          <ParentSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isMobile={isMobile || isTablet}
          />
        </ResponsiveSidebar>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <BackNavigation className="cursor-pointer" />
              <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
            </div>
            <p className="text-gray-600">
              Welcome back, {PARENT_CHILD.parentName}! Here's how {PARENT_CHILD.name} is doing.
            </p>
          </div>

          {/* Child summary banner */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-6 flex items-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <User className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-semibold text-gray-900">{PARENT_CHILD.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stream</p>
                <p className="font-semibold text-gray-900">{PARENT_CHILD.stream}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Grade</p>
                <p className="font-semibold text-gray-900">{PARENT_CHILD.grade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Roll No</p>
                <p className="font-semibold text-gray-900">{PARENT_CHILD.rollNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Institute</p>
                <p className="font-semibold text-gray-900">{PARENT_CHILD.institute}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4 sticky top-25 self-start hidden lg:block">
              <ParentSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            </div>

            <div className="lg:w-3/4">
              {activeSection === 'schedule' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900">Weekly Class Schedule</h2>
                      <p className="text-sm text-gray-600 mt-1">{PARENT_CHILD.name}'s timetable for the {PARENT_CHILD.stream} batch</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {scheduleByDay.map(({ day, periods }) => (
                        <div key={day} className="p-6">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            {day}
                          </h3>
                          <div className="space-y-2">
                            {periods.map((period, index) => (
                              <div
                                key={`${day}-${index}`}
                                className="flex flex-wrap items-center justify-between p-3 bg-gray-50 rounded-lg gap-2"
                              >
                                <span className="font-medium text-gray-900">{period.subject}</span>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {period.time}
                                  </span>
                                  <span className="flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    {period.teacher}
                                  </span>
                                  <span className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {period.room}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'attendance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                      <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
                      <p className={`text-3xl font-bold mt-1 ${getAttendanceColor(overallPercentage)}`}>{overallPercentage}%</p>
                      <p className="text-xs text-gray-500 mt-1">{overallAttended} of {overallTotal} classes attended</p>
                    </div>
                    {CHILD_ATTENDANCE_BY_SUBJECT.slice(0, 2).map((s) => {
                      const pct = Math.round((s.attended / s.totalClasses) * 100);
                      return (
                        <div key={s.subject} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                          <p className="text-sm font-medium text-gray-600">{s.subject}</p>
                          <p className={`text-3xl font-bold mt-1 ${getAttendanceColor(pct)}`}>{pct}%</p>
                          <p className="text-xs text-gray-500 mt-1">{s.attended} of {s.totalClasses} classes</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900">Attendance by Subject</h2>
                    </div>
                    <div className="p-6 space-y-4">
                      {CHILD_ATTENDANCE_BY_SUBJECT.map((s) => {
                        const pct = Math.round((s.attended / s.totalClasses) * 100);
                        return (
                          <div key={s.subject}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-900">{s.subject}</span>
                              <span className={`font-medium ${getAttendanceColor(pct)}`}>{pct}% ({s.attended}/{s.totalClasses})</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${pct >= 90 ? 'bg-green-500' : pct >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900">Recent Attendance</h2>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-3">
                        {CHILD_RECENT_ATTENDANCE.map((record) => (
                          <div key={record.date} className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                record.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              title={`${record.date}: ${record.status}`}
                            >
                              {record.status === 'present' ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <XCircle className="w-5 h-5" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{record.date.slice(5)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'marks' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-blue-600" />
                        Test Marks
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Recent test results for {PARENT_CHILD.name}</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {CHILD_TEST_MARKS.map((test, index) => {
                            const pct = Math.round((test.marksObtained / test.totalMarks) * 100);
                            const grade = getGrade(pct);
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.test_name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{test.subject}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{test.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{test.marksObtained} / {test.totalMarks} ({pct}%)</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${grade.color}`}>{grade.label}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Average Score</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        CHILD_TEST_MARKS.reduce((sum, t) => sum + (t.marksObtained / t.totalMarks) * 100, 0) /
                          CHILD_TEST_MARKS.length
                      )}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">across {CHILD_TEST_MARKS.length} recent tests</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
