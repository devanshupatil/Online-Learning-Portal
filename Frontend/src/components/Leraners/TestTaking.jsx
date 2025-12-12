import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';

const TestTaking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testQuestions] = useState(test?.analysis_data.analysis.questions ?? []);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [timerActive, setTimerActive] = useState(true);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    // Calculate score
    let correct = 0;
    testQuestions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    const score = (correct / testQuestions.length) * 100;

    toast.success(`Test submitted! Score: ${correct}/${testQuestions.length} (${score.toFixed(1)}%)`);

    // Navigate back to test section
    navigate('/learners', { state: { activeSection: 'test' } });
  };

  const handleBackToTests = () => {
    navigate('/learners', { state: { activeSection: 'test' } });
  };

  // Timer effect
  React.useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setTimerActive(false);
            handleSubmit();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!test || !testQuestions.length) {
    return <div className="min-h-screen flex items-center justify-center">Loading test...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Question Header */}
              <div className="mb-6">
                <h2 className="text-red-600 font-semibold text-lg mb-4">
                  Question No. {currentQuestionIndex + 1}
                </h2>
                <p className="text-gray-900 text-lg leading-relaxed">
                  {testQuestions[currentQuestionIndex]?.question}
                </p>
              </div>

              {/* Options or Answer Input */}
              {testQuestions[currentQuestionIndex]?.options ? (
                <div className="space-y-4">
                  {testQuestions[currentQuestionIndex]?.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${testQuestions[currentQuestionIndex]}`}
                        value={option}
                        checked={answers[testQuestions[currentQuestionIndex]] === option}
                        onChange={() => handleAnswerSelect(testQuestions[currentQuestionIndex], option)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-blue-600 font-medium text-lg">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-gray-700 text-lg flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer</label>
                  <textarea
                    value={answers[testQuestions[currentQuestionIndex]] || ''}
                    onChange={(e) => handleAnswerSelect(testQuestions[currentQuestionIndex], e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Type your answer here..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Timer */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">Time left</p>
                  <p className={`font-mono text-xl font-bold ${
                    timeLeft < 300 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>
            </div>

            {/* Question Navigation Grid */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Questions</h3>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {testQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`cursor-pointer aspect-square rounded border-2 font-medium transition-all duration-200 ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white border-blue-600'
                        : answers[testQuestions[index]]
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-black text-white border-black hover:bg-gray-800'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="cursor-pointer w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white font-medium transition-colors"
              >
                Submit Test
              </button>
            </div>

            {/* Exit Button */}
            <button
              onClick={handleBackToTests}
              className="cursor-pointer w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Exit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTaking;
