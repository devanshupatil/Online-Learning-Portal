import React, { useState } from 'react';
import { HelpCircle, MessageSquare, BookOpen, Video, Search, Send } from 'lucide-react';
import CTAButton from './CTAButton';

const SupportHelpdesk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faq');

  // Mock FAQ data
  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Navigate to the Course Catalog, find a course you\'re interested in, and click the "Enroll" button. You\'ll receive a confirmation email once enrolled.'
    },
    {
      question: 'What are the technical requirements?',
      answer: 'You need a modern browser (Chrome, Firefox, Safari, or Edge) and a stable internet connection. For live classes, a webcam and microphone are recommended.'
    },
    {
      question: 'How do I submit assignments?',
      answer: 'Go to the Assignments section in your course dashboard, upload your files, and click "Submit". You\'ll receive a confirmation when your submission is received.'
    },
    {
      question: 'How can I contact my instructor?',
      answer: 'Use the messaging system in the Communication Tools section to send a direct message to your instructor. You can also participate in course discussion forums.'
    }
  ];

  // Mock tutorials data
  const tutorials = [
    { title: 'Getting Started Guide', duration: '5 min', type: 'article' },
    { title: 'Navigating the Dashboard', duration: '8 min', type: 'video' },
    { title: 'Submitting Assignments', duration: '3 min', type: 'article' },
    { title: 'Joining Live Classes', duration: '6 min', type: 'video' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <HelpCircle className="w-6 h-6 text-cyan-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Support & Helpdesk</h2>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'faq'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          FAQ
        </button>
        <button
          onClick={() => setActiveTab('tutorials')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'tutorials'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tutorials
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'contact'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Contact Support
        </button>
      </div>
      
      {/* FAQ Content */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition-colors duration-300">
              <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Tutorials Content */}
      {activeTab === 'tutorials' && (
        <div className="space-y-4">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 gap-3">
              <div className="flex items-center">
                {tutorial.type === 'video' ? (
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <Video className="w-5 h-5 text-red-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
                  <p className="text-sm text-gray-600">{tutorial.duration} tutorial</p>
                </div>
              </div>
              <CTAButton variant="primary" className="px-3 py-1 text-sm min-w-0 min-h-0 self-start sm:self-center">
                {tutorial.type === 'video' ? 'Watch' : 'Read'}
              </CTAButton>
            </div>
          ))}
        </div>
      )}
      
      {/* Contact Support Content */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">Live Chat Support</h3>
            <p className="text-gray-700 mb-3">Get instant help from our support team</p>
            <CTAButton variant="primary" className="flex items-center px-4 py-2 text-sm min-w-0 min-h-0">
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Chat
            </CTAButton>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Send us a message</h3>
            <textarea
              placeholder="Describe your issue or question..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
            />
            <CTAButton variant="accent" className="flex items-center px-4 py-2 text-sm min-w-0 min-h-0">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </CTAButton>
          </div>
        </div>
      )}
      
      {/* Quick Links */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CTAButton variant="secondary" className="flex items-center p-3 text-sm min-w-0 min-h-0">
            <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium">User Guide</span>
          </CTAButton>
          <CTAButton variant="secondary" className="flex items-center p-3 text-sm min-w-0 min-h-0">
            <Video className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm font-medium">Video Tutorials</span>
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default SupportHelpdesk;