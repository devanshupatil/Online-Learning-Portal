import React from 'react';
import { useTranslation } from 'react-i18next';

const UserProfileCard = ({ onEditProfile }) => {
  const { t } = useTranslation();
  const profileData = {
    name: 'Alex Johnson',
    initials: 'AJ',
    bio: 'Passionate learner focused on mathematics and science. Enjoys collaborative problem-solving.',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    level: 12,
    progress: 75
  };

  const infoRows = [
    { icon: 'mail', value: profileData.email },
    { icon: 'call', value: profileData.phone },
    { icon: 'location_on', value: profileData.location }
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-on-surface">{t('learnerProfileTitle')}</h2>
        <button
          onClick={onEditProfile}
          className="flex items-center gap-1 px-4 py-2 border border-primary text-primary text-sm rounded-lg hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          {t('learnerProfileEdit')}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="text-center shrink-0">
          <div className="relative mx-auto w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">
              {profileData.initials}
            </span>
          </div>
          <h3 className="text-xl font-bold text-on-surface mt-3">{profileData.name}</h3>
          <p className="text-sm text-on-surface-variant mt-1">{profileData.bio}</p>
        </div>

        <div className="flex-1 space-y-3">
          {infoRows.map((row) => (
            <div
              key={row.icon}
              className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">
                {row.icon}
              </span>
              <span className="text-sm text-on-surface">{row.value}</span>
            </div>
          ))}

          <div className="p-3 bg-surface-container-low rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  workspace_premium
                </span>
                <span className="text-sm font-medium text-on-surface">
                  {t('learnerProfileLevel', { level: profileData.level })}
                </span>
              </div>
              <span className="text-sm font-medium text-on-surface">{profileData.progress}%</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${profileData.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
