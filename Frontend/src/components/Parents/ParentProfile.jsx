import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PARENT_CHILD } from '../../mockData/data';

const ParentProfile = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rakesh Sharma',
    relation: t('parentProfileOfChild', { childName: PARENT_CHILD.name }),
    email: 'rakesh.sharma@example.com',
    phone: '+91 98765 43210',
    childName: PARENT_CHILD.name,
    stream: PARENT_CHILD.stream,
    grade: PARENT_CHILD.grade,
    rollNo: PARENT_CHILD.rollNo,
    institute: PARENT_CHILD.institute,
    note: 'Please share regular progress updates and notify me about any upcoming parent-teacher meetings.',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success(t('parentProfileSaved'));
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium outline-none focus:border-primary disabled:opacity-75 disabled:bg-surface-container-low";

  return (
    <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5 w-full">
      {/* Header Profile Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 sm:p-8 soft-bloom shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-md flex-shrink-0">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-on-surface">{profile.name}</h2>
                <p className="text-sm font-semibold text-tertiary mt-0.5">{profile.relation}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{profile.institute}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isEditing
                    ? 'border border-outline-variant bg-surface text-on-surface'
                    : 'bg-primary text-primary-foreground hover:opacity-90'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isEditing ? 'close' : 'edit'}
                </span>
                {isEditing ? t('parentProfileCancelEdit') : t('parentProfileEdit')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form / Details */}
      <form onSubmit={handleSave} className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 sm:p-8 soft-bloom shadow-xs space-y-6">
        <h3 className="text-lg font-bold font-display text-on-surface border-b border-surface-variant pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
          {t('parentProfileParentInfo')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">{t('parentProfileName')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">{t('parentProfileRelation')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.relation}
              onChange={(e) => setProfile({ ...profile, relation: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">{t('parentProfileEmail')}</label>
            <input
              type="email"
              disabled={!isEditing}
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">{t('parentProfilePhone')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <h3 className="text-lg font-bold font-display text-on-surface border-b border-surface-variant pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">school</span>
          {t('parentProfileChildInfo')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">{t('parentProfileChildName')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.childName}
              onChange={(e) => setProfile({ ...profile, childName: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">{t('parentProfileStream')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.stream}
              onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">{t('parentProfileGrade')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.grade}
              onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">{t('parentProfileRollNo')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.rollNo}
              onChange={(e) => setProfile({ ...profile, rollNo: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface mb-1.5">{t('parentProfileNote')}</label>
          <textarea
            rows={3}
            disabled={!isEditing}
            value={profile.note}
            onChange={(e) => setProfile({ ...profile, note: e.target.value })}
            className={inputClass + " resize-none"}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-outline-variant font-semibold text-sm hover:bg-surface-container-low cursor-pointer"
            >
              {t('parentProfileCancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 cursor-pointer shadow-sm"
            >
              {t('parentProfileSave')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ParentProfile;