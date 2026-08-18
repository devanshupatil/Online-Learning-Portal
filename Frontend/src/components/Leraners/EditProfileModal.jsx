import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const EditProfileModal = ({ isOpen, onClose, profileData, onSave }) => {
  const { t } = useTranslation();
  const nameRef = useRef(null);
  const [formData, setFormData] = useState({
    name: profileData?.name || '',
    email: profileData?.email || '',
    phone: profileData?.phone || '',
    location: profileData?.location || '',
    bio: profileData?.bio || ''
  });

  useEffect(() => {
    if (isOpen && nameRef.current) {
      nameRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    toast.success(t('editProfileSuccess'));
    onClose();
  };

  if (!isOpen) return null;

  const fields = [
    { name: 'name', icon: 'person', labelKey: 'editProfileNameLabel', placeholderKey: 'editProfileNamePlaceholder', type: 'text', required: true },
    { name: 'email', icon: 'mail', labelKey: 'editProfileEmailLabel', placeholderKey: 'editProfileEmailPlaceholder', type: 'email', required: true },
    { name: 'phone', icon: 'call', labelKey: 'editProfilePhoneLabel', placeholderKey: 'editProfilePhonePlaceholder', type: 'tel', required: false },
    { name: 'location', icon: 'location_on', labelKey: 'editProfileLocationLabel', placeholderKey: 'editProfileLocationPlaceholder', type: 'text', required: false }
  ];

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-md mx-auto border border-outline-variant">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 className="font-display text-xl text-on-surface">{t('editProfileModalTitle')}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">
                {formData.name ? formData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-on-surface mb-2 flex items-center">
                  <span className="material-symbols-outlined text-[18px] mr-2 text-primary">{field.icon}</span>
                  {t(field.labelKey)}
                </label>
                <input
                  ref={field.name === 'name' ? nameRef : undefined}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-4 py-3 border border-outline-variant rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm"
                  placeholder={t(field.placeholderKey)}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2 flex items-center">
                <span className="material-symbols-outlined text-[18px] mr-2 text-primary">info</span>
                {t('editProfileBioLabel')}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-outline-variant rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm resize-none"
                placeholder={t('editProfileBioPlaceholder')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-on-surface bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors min-h-[44px] cursor-pointer font-medium"
            >
              {t('editProfileCancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 active:scale-95 transition-all min-h-[44px] font-medium shadow-sm cursor-pointer"
            >
              {t('editProfileSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
