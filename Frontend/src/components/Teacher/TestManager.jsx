import React, { useState } from 'react';
import { FileText, Calendar, Users, BarChart3, Play, Eye, Settings } from 'lucide-react';

const TestManager = () => {
  const [tests, setTests] = useState([
    {
      id: 1,
      title: 'Mathematics Quiz 1',
      course: 'Mathematics',
      questions: 10,
      totalPoints: 20,
      status: 'draft',
      createdDate: '2024-08-25',
      scheduledDate: null,
      assignedTo: [],
      submissions: 0,
      averageScore: 0
    },
    {
      id: 2,
      title: 'Science Final Exam',
      course: 'Science',
      questions: 25,
      totalPoints: 50,
      status: 'scheduled',
      createdDate: '2024-08-20',
      scheduledDate: '2024-09-01',
      assignedTo: ['Class A', 'Class B'],
      submissions: 15,
      averageScore: 78
    },
    {
      id: 3,
      title: 'History Midterm',
      course: 'History',
      questions: 15,
      totalPoints: 30,
      status: 'completed',
      createdDate: '2024-08-15',
      scheduledDate: '2024-08-20',
      assignedTo: ['Class C'],
      submissions: 25,
      averageScore: 82
    }
  ]);

  const [selectedTest, setSelectedTest] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [assignedClasses, setAssignedClasses] = useState([]);

  const classes = ['Class A', 'Class B', 'Class C', 'Class D'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSchedule = (test) => {
    setSelectedTest(test);
    setScheduleDate(test.scheduledDate || '');
    setShowScheduleModal(true);
  };

  const handleAssign = (test) => {
    setSelectedTest(test);
    setAssignedClasses(test.assignedTo || []);
    setShowAssignModal(true);
  };

  const saveSchedule = () => {
    if (!scheduleDate) {
      alert('Please select a date and time.');
      return;
    }

    setTests(prev => prev.map(test =>
      test.id === selectedTest.id
        ? { ...test, scheduledDate: scheduleDate, status: 'scheduled' }
        : test
    ));

    setShowScheduleModal(false);
    setSelectedTest(null);
    setScheduleDate('');
  };

  const saveAssignment = () => {
    setTests(prev => prev.map(test =>
      test.id === selectedTest.id
        ? { ...test, assignedTo: assignedClasses }
        : test
    ));

    setShowAssignModal(false);
    setSelectedTest(null);
    setAssignedClasses([]);
  };

  const toggleClassAssignment = (className) => {
    setAssignedClasses(prev =>
      prev.includes(className)
        ? prev.filter(c => c !== className)
        : [...prev, className]
    );
  };

  return (
    <div className="space-y-6">
      {/* Tests List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Test Management</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {tests.map((test) => (
            <div key={test.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{test.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{test.course}</span>
                      <span>{test.questions} questions</span>
                      <span>{test.totalPoints} points</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Created: {test.createdDate}</span>
                      {test.scheduledDate && <span>Scheduled: {test.scheduledDate}</span>}
                      {test.assignedTo.length > 0 && (
                        <span>Assigned to: {test.assignedTo.join(', ')}</span>
                      )}
                    </div>
                    {test.status === 'completed' && (
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-600">{test.submissions} submissions</span>
                        <span className="text-gray-600">Avg score: {test.averageScore}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {test.status === 'draft' && (
                    <button
                      onClick={() => handleSchedule(test)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Schedule Test"
                    >
                      <Calendar className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleAssign(test)}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    title="Assign to Classes"
                  >
                    <Users className="w-5 h-5" />
                  </button>
                  {test.status === 'scheduled' && (
                    <button
                      onClick={() => alert('Starting test...')}
                      className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                      title="Start Test"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  )}
                  {test.status === 'completed' && (
                    <button
                      onClick={() => alert('Viewing results...')}
                      className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                      title="View Results"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => alert('Viewing test details...')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Test</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign to Classes</h3>
            <div className="space-y-2 mb-4">
              {classes.map((className) => (
                <label key={className} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={assignedClasses.includes(className)}
                    onChange={() => toggleClassAssignment(className)}
                    className="mr-3"
                  />
                  {className}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveAssignment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManager;