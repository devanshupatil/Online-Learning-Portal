import React from 'react';
import { BookOpen, Users, Award } from 'lucide-react';
import CTAButton from './CTAButton';

const LearnersHeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empowering <span className="text-blue-600">Learners</span> for Success
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Your personalized learning journey with interactive resources, expert guidance,
            and a supportive community to help you achieve your academic goals.
          </p>
          
          {/* CTA Button */}
          <div className="mb-12">
            <CTAButton variant="accent">
              Get Started Today
            </CTAButton>
          </div>
          
          {/* Stats/Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Learning</h3>
              <p className="text-gray-600">Tailored content that adapts to your learning style and pace.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">Connect with peers and mentors for collaborative learning.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Achievement Tracking</h3>
              <p className="text-gray-600">Monitor your progress with detailed analytics and feedback.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearnersHeroSection;