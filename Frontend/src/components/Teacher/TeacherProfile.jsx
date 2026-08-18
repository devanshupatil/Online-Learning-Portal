import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const TeacherProfile = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Jenkins',
    title: 'Senior Faculty - Mathematics',
    department: 'Department of Mathematics & Computing',
    email: 'sarah.jenkins@edulearning.edu',
    phone: '+1 (555) 432-8901',
    office: 'Building B, Room 304',
    officeHours: 'Mon, Wed, Fri (2:00 PM - 4:30 PM)',
    qualification: 'Ph.D. in Applied Mathematics (Stanford University)',
    experience: '12+ Years Teaching Experience',
    bio: 'Passionate mathematics educator dedicated to helping high school and competitive examination students master complex mathematical concepts through intuitive problem-solving and rigorous analytical thinking.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEpWPudJj0as1r3eKQDPVq132BVEQ2Jj5s7jJmglyJ8dX6O_CvgMlU-xcHQGM2aHGvkvBgjGWj_0350gGuT744JeyqcOaF-pPtOP_5sXqIkxhdmIQjf2ds56qEP7RB9MkVemzebm-GPZctOEirRHzpmkyXccwF9fQT1p9obNab-WbooxiG_uqbBD2E3QoNQIXJN4vMg-DBNQCuNBz_muDqezCQNRBXwIs8NCFg4EBkzsd3Tf4AYe5o',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Teacher profile updated successfully!');
  };

  return (
    <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5 w-full">
      {/* Header Profile Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 sm:p-8 soft-bloom shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-primary/20 shadow-md flex-shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-on-surface">{profile.name}</h2>
                <p className="text-sm font-semibold text-primary mt-0.5">{profile.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{profile.department}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isEditing
                    ? 'border border-outline-variant bg-surface text-on-surface'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isEditing ? 'close' : 'edit'}
                </span>
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form / Details */}
      <form onSubmit={handleSave} className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 sm:p-8 soft-bloom shadow-xs space-y-6">
        <h3 className="text-lg font-bold font-display text-on-surface border-b border-surface-variant pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
          Faculty Information & Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium outline-none focus:border-primary disabled:opacity-75 disabled:bg-surface-container-low"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Designation</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium outline-none focus:border-primary disabled:opacity-75 disabled:bg-surface-container-low"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Email Address</label>
            <input
              type="email"
              disabled={!isEditing}
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium outline-none focus:border-primary disabled:opacity-75 disabled:bg-surface-container-low"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Phone Number</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium outline-none focus:border-primary disabled:opacity-75 disabled:bg-surface-container-low"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Office Location</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.office}
              onChange={(e) => setProfile({ ...profile, office: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium outline-none focus:border-primary disabled:opacity-75 disabled:bg-surface-container-low"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Office Hours / Availability</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.officeHours}
              onChange={(e) => setProfile({ ...profile, officeHours: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium outline-none focus:border-primary disabled:opacity-75 disabled:bg-surface-container-low"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface mb-1.5">Highest Qualification</label>
          <input
            type="text"
            disabled={!isEditing}
            value={profile.qualification}
            onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
            className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium outline-none focus:border-primary disabled:opacity-75 disabled:bg-surface-container-low"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface mb-1.5">Professional Bio</label>
          <textarea
            rows={3}
            disabled={!isEditing}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium outline-none focus:border-primary disabled:opacity-75 disabled:bg-surface-container-low resize-none"
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-outline-variant font-semibold text-sm hover:bg-surface-container-low cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:opacity-90 cursor-pointer shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TeacherProfile;
