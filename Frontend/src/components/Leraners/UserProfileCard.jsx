import React, { useState } from 'react';
import { User, Edit3, Camera, Award, TrendingUp } from 'lucide-react';

const UserProfileCard = ({ onEditProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    bio: 'Passionate learner focused on mathematics and science. Enjoys collaborative problem-solving.',
    level: 12,
    progress: 75,
    streak: 5
  });

  const handleEditClick = () => {
    if (onEditProfile) {
      onEditProfile();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
        <button 
          onClick={handleEditClick}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Edit
        </button>
      </div>
      
      {/* Profile Info */}
      <div className="text-center mb-6">
        <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-2xl font-bold text-white">AJ</span>
          <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow duration-300">
            <Camera className="w-3 h-3 text-gray-600" />
          </button>
        </div>
        <h3 className="text-xl font-bold text-gray-900">{profileData.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{profileData.bio}</p>
      </div>
      
      {/* Level and Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Award className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">Level {profileData.level}</span>
          </div>
          <span className="text-sm font-medium text-gray-700">{profileData.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${profileData.progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Weekly Streak */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
            <span className="font-medium text-gray-900">Weekly Streak</span>
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white"></div>
              ))}
            </div>
            <span className="ml-2 font-bold text-orange-600">{profileData.streak} days</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">Keep learning to maintain your streak!</p>
      </div>
    </div>
  );
};

export default UserProfileCard;