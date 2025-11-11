import React, { useState } from 'react';
import { FileCheck, Clock, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TestResults from './TestResults';
import { toast } from 'sonner';


const Tests = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);

  React.useEffect(() => {
    geAllImageAnalysis();
  }, []);

  const geAllImageAnalysis = async () => {

    try {
      const getImageResponse = await fetch(`${URL}/api/textAnalysis`);

      if (getImageResponse.ok) {
        // Some endpoints may return empty body (204) — handle that gracefully
        const text = await getImageResponse.text();

        if (text) {

          let existingAnalysis = null;

          try {

            const analysisStart = text.indexOf('{');
            if (analysisStart !== -1) {
              const cleanedText = text.slice(analysisStart);
              existingAnalysis = JSON.parse(cleanedText);
            } else {
              throw new Error('Invalid analysis data format');
            }

            existingAnalysis = JSON.parse(text);

          } catch (parseErr) {
            console.warn('Failed to parse analysis JSON from server:', parseErr);
            toast.error('Failed to load existing text analysis data.');
          }

          if (existingAnalysis && Object.keys(existingAnalysis).length > 0) {


            setAnalysisData(existingAnalysis.textAnalyses);

            console.log('Fetched existing analysis from server:', existingAnalysis.textAnalyses
            );
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching existing analysis from server:', err);
      toast.error('Error fetching existing text analysis data from server.');
    }

  };


  // Mock data for tests
  const testsData = [
    {
      id: 1,
      title: 'Algebra Fundamentals Quiz',
      subject: 'Mathematics',
      dueDate: '2023-05-25',
      status: 'pending',
      timeLimit: '30 min'
    },
    {
      id: 2,
      title: 'Physics Midterm Exam',
      subject: 'Physics',
      dueDate: '2023-06-01',
      status: 'upcoming',
      timeLimit: '2 hours'
    },
    {
      id: 3,
      title: 'Chemistry Lab Report',
      subject: 'Chemistry',
      dueDate: '2023-05-30',
      status: 'in-progress',
      timeLimit: 'N/A'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const [testTab, setTestTab] = useState('Test');

  const handleStartTest = (test) => {
    // Mock questions - in real app, fetch from backend
    const mockQuestions = [
      {
        id: 1,
        question: "What is the average of the first five multiples of 20?",
        options: ["200", "100", "150", "120", "180"],
        correctAnswer: "200"
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn", "Mercury"],
        correctAnswer: "Mars"
      },
      {
        id: 3,
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "NaCl", "CH4"],
        correctAnswer: "H2O"
      },
      {
        id: 4,
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain", "George Orwell"],
        correctAnswer: "William Shakespeare"
      },
      {
        id: 5,
        question: "What is the square root of 144?",
        options: ["10", "12", "14", "16", "18"],
        correctAnswer: "12"
      },
      {
        id: 6,
        question: "Which gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen", "Helium"],
        correctAnswer: "Carbon Dioxide"
      },
      {
        id: 7,
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean", "Southern Ocean"],
        correctAnswer: "Pacific Ocean"
      },
      {
        id: 8,
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8", "9"],
        correctAnswer: "7"
      },
      {
        id: 9,
        question: "What is the boiling point of water in Celsius?",
        options: ["0°C", "50°C", "100°C", "150°C", "200°C"],
        correctAnswer: "100°C"
      },
      {
        id: 10,
        question: "Which animal is known as the 'King of the Jungle'?",
        options: ["Tiger", "Lion", "Elephant", "Giraffe", "Zebra"],
        correctAnswer: "Lion"
      },
      {
        id: 11,
        question: "What is 15 × 8?",
        options: ["120", "110", "100", "130", "140"],
        correctAnswer: "120"
      },
      {
        id: 12,
        question: "Which vitamin is produced when skin is exposed to sunlight?",
        options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D", "Vitamin E"],
        correctAnswer: "Vitamin D"
      },
      {
        id: 13,
        question: "What is the capital of Japan?",
        options: ["Seoul", "Beijing", "Tokyo", "Bangkok", "Singapore"],
        correctAnswer: "Tokyo"
      },
      {
        id: 14,
        question: "Which organ pumps blood in the human body?",
        options: ["Liver", "Kidney", "Heart", "Lung", "Brain"],
        correctAnswer: "Heart"
      },
      {
        id: 15,
        question: "What is the longest river in the world?",
        options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River", "Danube River"],
        correctAnswer: "Nile River"
      },
      {
        id: 16,
        question: "How many sides does a hexagon have?",
        options: ["4", "5", "6", "7", "8"],
        correctAnswer: "6"
      },
      {
        id: 17,
        question: "Which gas makes up the majority of Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon", "Hydrogen"],
        correctAnswer: "Nitrogen"
      },
      {
        id: 18,
        question: "What is the currency of the United Kingdom?",
        options: ["Euro", "Dollar", "Pound", "Yen", "Franc"],
        correctAnswer: "Pound"
      },
      {
        id: 19,
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Earth", "Mars", "Mercury", "Jupiter"],
        correctAnswer: "Mercury"
      },
      {
        id: 20,
        question: "What is 25% of 200?",
        options: ["25", "50", "75", "100", "125"],
        correctAnswer: "50"
      }
    ];

    // Navigate to test taking page with test data
    navigate('/test-taking', { state: { test, questions: mockQuestions } });
  };


  return (
    <div className="space-y-4">
      {analysisData && analysisData.length > 0 ? (
        analysisData.map((test) => (
          <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <p className="font-medium text-gray-900">{test.test_name}</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">{test.course}</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-sm text-gray-500 gap-2">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{new Date(test.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{new Date(test.updated_at).toLocaleTimeString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleStartTest(test)}
                className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded flex-shrink-0 self-start sm:self-auto"
              >
                Start Test
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-8">
          {analysisData === null ? 'Loading tests...' : 'No tests available'}
        </div>
      )}
    </div>
  );
};

export default Tests;