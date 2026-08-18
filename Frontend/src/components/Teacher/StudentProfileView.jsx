import React from 'react';
import { useTranslation } from 'react-i18next';

const StudentProfileView = ({ student, onClose }) => {
  const { t } = useTranslation();

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
      case 'present': return 'bg-primary-container text-on-primary-container';
      case 'absent': return 'bg-error-container text-on-error-container';
      case 'late': return 'bg-secondary-fixed text-on-secondary-fixed';
      default: return 'bg-surface-container-highest text-on-surface-variant';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-primary-container text-on-primary-container';
    if (grade.startsWith('B')) return 'bg-secondary-fixed text-on-secondary-fixed';
    if (grade.startsWith('C')) return 'bg-tertiary-fixed text-on-tertiary-fixed';
    return 'bg-error-container text-on-error-container';
  };

  return (
    <div className="fixed inset-0 bg-shadow/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-surface-variant">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mr-4">
                <span className="material-symbols-outlined text-[32px] text-primary">person</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-on-surface">{studentDetails.name}</h2>
                <p className="text-on-surface-variant">{t('studentProfile.rollNo')}: {studentDetails.rollNo} &bull; {studentDetails.class} &bull; {studentDetails.grade}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-on-surface">{t('studentProfile.basicInformation')}</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">mail</span>
                  <span className="text-on-surface-variant">{t('studentProfile.email')}:</span>
                  <span className="ml-2">{studentDetails.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">phone</span>
                  <span className="text-on-surface-variant">{t('studentProfile.phone')}:</span>
                  <span className="ml-2">{studentDetails.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">calendar_today</span>
                  <span className="text-on-surface-variant">{t('studentProfile.dateOfBirth')}:</span>
                  <span className="ml-2">{studentDetails.dateOfBirth}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">calendar_today</span>
                  <span className="text-on-surface-variant">{t('studentProfile.enrollmentDate')}:</span>
                  <span className="ml-2">{studentDetails.enrollmentDate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-on-surface">{t('studentProfile.parentGuardianInformation')}</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="text-on-surface-variant">{t('studentProfile.name')}:</span> {studentDetails.parentName}</p>
                <p className="text-sm"><span className="text-on-surface-variant">{t('studentProfile.phone')}:</span> {studentDetails.parentPhone}</p>
                <p className="text-sm"><span className="text-on-surface-variant">{t('studentProfile.email')}:</span> {studentDetails.parentEmail}</p>
                <p className="text-sm"><span className="text-on-surface-variant">{t('studentProfile.emergency')}:</span> {studentDetails.emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-4">{t('studentProfile.academicPerformance')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressData.map((subject, index) => (
                <div key={index} className="bg-surface-container-low rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-on-surface">{subject.subject}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-on-surface-variant">{subject.progress}% {t('studentProfile.complete')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Test Results */}
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-4">{t('studentProfile.recentTestResults')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">{t('studentProfile.subject')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">{t('studentProfile.test')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">{t('studentProfile.score')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">{t('studentProfile.date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {testResults.map((test, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-on-surface">{test.subject}</td>
                      <td className="px-4 py-2 text-sm text-on-surface">{test.test}</td>
                      <td className="px-4 py-2 text-sm text-on-surface">{test.score}/{test.maxScore}</td>
                      <td className="px-4 py-2 text-sm text-on-surface-variant">{test.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Records */}
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-4">{t('studentProfile.recentAttendance')}</h3>
            <div className="grid grid-cols-7 gap-2">
              {attendanceRecords.map((record, index) => (
                <div key={index} className="text-center">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.status)}`}>
                    {t(`studentProfile.${record.status}`)}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">{record.date.split('-')[2]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Communication History */}
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-4">{t('studentProfile.communicationHistory')}</h3>
            <div className="space-y-3">
              {communicationHistory.map((comm, index) => (
                <div key={index} className="flex items-start p-3 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-primary mr-3 mt-0.5">chat</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-on-surface">{t(`studentProfile.commType.${comm.type}`)}</span>
                      <span className="text-xs text-on-surface-variant">{comm.date}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant">{comm.message}</p>
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
