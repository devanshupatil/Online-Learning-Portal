import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  useEffect(() => {
    // Trigger entrance animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className={`max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-700 ${
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className={`mb-8 ${isLoaded ? 'fade-in-up' : ''}`}>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Join Our Learning Community'}
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? 'Sign in to continue your learning journey'
                  : 'Create your account to start learning today'
                }
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className={`flex mb-8 bg-gray-100 rounded-lg p-1 ${isLoaded ? 'fade-in-up stagger-1' : ''}`}>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  isLogin
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  !isLogin
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className={`${isLoaded ? 'slide-in-form' : ''}`}>
              {isLogin ? <LoginForm /> : <SignUpForm />}
            </div>
          </div>

          {/* Right Side - Illustration/Promotional Content */}
          <div className={`lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 lg:p-12 flex items-center justify-center ${
            isLoaded ? 'fade-in-right' : ''
          }`}>
            <div className="text-center text-white">
              <div className={`mb-8 ${isLoaded ? 'float-animation' : ''}`}>
                <svg className="w-24 h-24 mx-auto mb-4 pulse-glow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                  Empower Your Learning Journey
                </h2>
                <p className="text-indigo-100 text-lg">
                  Access thousands of courses, connect with expert instructors,
                  and achieve your educational goals with our comprehensive platform.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                <div className={`flex items-center space-x-3 ${isLoaded ? 'fade-in-up stagger-2' : ''}`}>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span className="text-sm">Interactive Learning Tools</span>
                </div>
                <div className={`flex items-center space-x-3 ${isLoaded ? 'fade-in-up stagger-3' : ''}`}>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  <span className="text-sm">Expert Instructors</span>
                </div>
                <div className={`flex items-center space-x-3 ${isLoaded ? 'fade-in-up stagger-4' : ''}`}>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <span className="text-sm">Fast & Secure Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;