import React, { useState } from 'react';
import { User, Edit3, Camera, MapPin, Calendar, Mail, Phone } from 'lucide-react';
import CTAButton from './CTAButton';

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate learner focused on mathematics and science. Enjoys collaborative problem-solving and exploring new technologies.',
    joinDate: 'January 2023'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real app, you would send this data to a server
    console.log('Profile updated:', profileData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="flex items-center mb-6">
        <User className="w-6 h-6 text-purple-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Student Profile</h2>
      </div>
      
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-3xl font-bold text-white">AJ</span>
          <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow duration-300">
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="text-xl font-bold text-gray-900 text-center w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
          />
        ) : (
          <h3 className="text-xl font-bold text-gray-900">{profileData.name}</h3>
        )}
        <p className="text-gray-600">Student ID: STU-2023-0456</p>
      </div>
      
      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
            ) : (
              <p className="text-gray-900">{profileData.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-green-600" />
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
            ) : (
              <p className="text-gray-900">{profileData.phone}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-red-600" />
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
            ) : (
              <p className="text-gray-900">{profileData.location}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-purple-600" />
              Member Since
            </label>
            <p className="text-gray-900">{profileData.joinDate}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
            ) : (
              <p className="text-gray-700">{profileData.bio}</p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          {isEditing ? (
            <>
              <CTAButton
                variant="secondary"
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm min-w-0 min-h-0"
              >
                Cancel
              </CTAButton>
              <CTAButton
                variant="primary"
                type="submit"
                className="px-4 py-2 text-sm min-w-0 min-h-0"
              >
                Save Changes
              </CTAButton>
            </>
          ) : (
            <CTAButton
              variant="accent"
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 text-sm min-w-0 min-h-0"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </CTAButton>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;