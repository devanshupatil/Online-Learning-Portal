import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Sign up data:', data);
      toast.success('Account created successfully!');
      // Redirect logic would go here
    } catch (error) {
      toast.error('Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name Field */}
      <div className="fade-in-up stagger-1">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Full name must be at least 2 characters',
            },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 input-focus hover:border-indigo-400"
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="fade-in-up stagger-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email format',
            },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 input-focus hover:border-indigo-400"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.email.message}</p>
        )}
      </div>

      {/* User Role */}
      <div className="fade-in-up stagger-3">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          I am a
        </label>
        <select
          id="role"
          {...register('role', { required: 'Please select a role' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 input-focus hover:border-indigo-400"
        >
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.role.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="fade-in-up stagger-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 input-focus hover:border-indigo-400"
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="fade-in-up stagger-5">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 input-focus hover:border-indigo-400"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start fade-in-up stagger-6">
        <input
          id="terms"
          type="checkbox"
          {...register('terms', { required: 'You must accept the terms and conditions' })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1 transition-all duration-200 hover:scale-110"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500 link-hover transition-all duration-200 hover:scale-105">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500 link-hover transition-all duration-200 hover:scale-105">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.terms && (
        <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.terms.message}</p>
      )}

      {/* Submit Button */}
      <div className="fade-in-up stagger-7">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </div>
          ) : (
            <span className="relative">
              Create Account
              <span className="absolute inset-0 bg-white/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </span>
          )}
        </button>
      </div>

      {/* Social Login */}
      <div className="mt-6 fade-in-up stagger-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-3 px-4 rounded-lg shadow-md bg-gradient-to-r from-blue-500 via-blue-600 to-red-500 text-white text-sm font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-200" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="ml-2 relative z-10 font-semibold">Google</span>
            <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            type="button"
            className="w-full inline-flex justify-center py-3 px-4 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="ml-2 relative z-10 font-semibold">Facebook</span>
            <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;