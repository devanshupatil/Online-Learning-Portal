import React, { useState } from 'react';
import { Plus, Trash2, Save, Clock, Users, Target } from 'lucide-react';

const TestCreator = () => {
  const [testTitle, setTestTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(60); // minutes
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [passingScore, setPassingScore] = useState(70); // percentage
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' }
  ];

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question.');
      return;
    }

    if (currentQuestion.type === 'multiple-choice' && currentQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill all options for multiple choice questions.');
      return;
    }

    if ((currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && !currentQuestion.correctAnswer) {
      alert('Please select the correct answer.');
      return;
    }

    setQuestions(prev => [...prev, { ...currentQuestion, id: Date.now() }]);
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
  };

  const removeQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const saveTest = () => {
    if (!testTitle.trim()) {
      alert('Please enter a test title.');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    const testData = {
      title: testTitle,
      timeLimit,
      maxAttempts,
      passingScore,
      questions,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0)
    };

    console.log('Saving test:', testData);
    alert('Test saved successfully!');
    // Reset form
    setTestTitle('');
    setTimeLimit(60);
    setMaxAttempts(1);
    setPassingScore(70);
    setQuestions([]);
  };

  return (
    <div className="space-y-6">
      {/* Test Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Title</label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter test title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
            <input
              type="number"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
            <input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Add Question */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Question</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
            <select
              value={currentQuestion.type}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <textarea
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Enter your question"
            />
          </div>

          {currentQuestion.type === 'multiple-choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              {currentQuestion.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Option ${index + 1}`}
                />
              ))}
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                <select
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select correct answer</option>
                  {currentQuestion.options.map((option, index) => (
                    <option key={index} value={option}>{option || `Option ${index + 1}`}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentQuestion.type === 'true-false' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
              <select
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select correct answer</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          {currentQuestion.type === 'short-answer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Answer</label>
              <input
                type="text"
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter expected answer"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
            <input
              type="number"
              value={currentQuestion.points}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          <button
            onClick={addQuestion}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Questions ({questions.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {questions.map((q, index) => (
              <div key={q.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">Q{index + 1}.</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{q.type}</span>
                      <span className="text-xs text-gray-600">{q.points} point{q.points !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-gray-900 mb-2">{q.question}</p>
                    {q.type === 'multiple-choice' && (
                      <div className="space-y-1">
                        {q.options.map((option, i) => (
                          <div key={i} className={`text-sm ${option === q.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                            {String.fromCharCode(65 + i)}. {option}
                          </div>
                        ))}
                      </div>
                    )}
                    {q.type === 'true-false' && (
                      <p className="text-sm text-green-600 font-medium">Correct: {q.correctAnswer === 'true' ? 'True' : 'False'}</p>
                    )}
                    {q.type === 'short-answer' && (
                      <p className="text-sm text-green-600 font-medium">Expected: {q.correctAnswer}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Test */}
      <div className="flex justify-end">
        <button
          onClick={saveTest}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Test
        </button>
      </div>
    </div>
  );
};

export default TestCreator;