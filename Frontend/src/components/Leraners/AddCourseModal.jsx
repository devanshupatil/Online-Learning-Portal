import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const AddCourseModal = ({ isOpen, onClose, onAddCourse }) => {
  const { t } = useTranslation();
  const titleRef = useRef(null);
  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    instructor: ''
  });

  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
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
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddCourse) onAddCourse(courseData);
    toast.success(t('addCourseSuccess'));
    setCourseData({ title: '', category: '', instructor: '' });
    onClose();
  };

  if (!isOpen) return null;

  const fields = [
    { name: 'title', icon: 'menu_book', labelKey: 'addCourseTitleLabel', placeholderKey: 'addCourseTitlePlaceholder', required: true, type: 'text' },
    { name: 'category', icon: 'tag', labelKey: 'addCourseCategoryLabel', placeholderKey: 'addCourseCategoryPlaceholder', required: true, type: 'text' },
    { name: 'instructor', icon: 'person', labelKey: 'addCourseInstructorLabel', placeholderKey: 'addCourseInstructorPlaceholder', required: true, type: 'text' }
  ];

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-md mx-auto border border-outline-variant">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 className="font-display text-xl text-on-surface">{t('addCourseModalTitle')}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-on-surface mb-2 flex items-center">
                  <span className="material-symbols-outlined text-[18px] mr-2 text-primary">{field.icon}</span>
                  {t(field.labelKey)}
                </label>
                <input
                  ref={field.name === 'title' ? titleRef : undefined}
                  type={field.type}
                  name={field.name}
                  value={courseData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-4 py-3 border border-outline-variant rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm"
                  placeholder={t(field.placeholderKey)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-on-surface bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors min-h-[44px] cursor-pointer font-medium"
            >
              {t('addCourseCancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 active:scale-95 transition-all min-h-[44px] font-medium shadow-sm cursor-pointer"
            >
              {t('addCourseSubmit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
