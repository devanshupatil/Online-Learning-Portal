import React, { useState, useEffect } from 'react';
import { FileCheck, Clock, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TestResults from './TestResults';
import { toast } from 'sonner';


const Tests = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
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
  // const testsData = [
  //   {
  //     id: 1,
  //     title: 'Algebra Fundamentals Quiz',
  //     subject: 'Mathematics',
  //     dueDate: '2023-05-25',
  //     status: 'pending',
  //     timeLimit: '30 min'
  //   },
  //   {
  //     id: 2,
  //     title: 'Physics Midterm Exam',
  //     subject: 'Physics',
  //     dueDate: '2023-06-01',
  //     status: 'upcoming',
  //     timeLimit: '2 hours'
  //   },
  //   {
  //     id: 3,
  //     title: 'Chemistry Lab Report',
  //     subject: 'Chemistry',
  //     dueDate: '2023-05-30',
  //     status: 'in-progress',
  //     timeLimit: 'N/A'
  //   }
  // ];

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'bg-green-100 text-green-800';
  //     case 'in-progress':
  //       return 'bg-yellow-100 text-yellow-800';
  //     case 'upcoming':
  //       return 'bg-blue-100 text-blue-800';
  //     case 'pending':
  //       return 'bg-red-100 text-red-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  const [testTab, setTestTab] = useState('Test');

  const handleStartTest = (test) => {
    // Mock questions - in real app, fetch from backend
  

    // Navigate to test taking page with test data
    navigate('/test-taking', { state: { test } });
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