import React from 'react';
import { useTranslation } from 'react-i18next';

const CourseCard = ({ course, onStart }) => {
  const { t } = useTranslation();

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300">
      <div className="w-full h-40 rounded-xl mb-4 overflow-hidden bg-surface-container-low relative">
        <img
          alt={course.title}
          className="w-full h-full object-cover"
          src={course.thumbnail}
        />
        <div className="absolute top-3 right-3 bg-surface-variant text-on-surface-variant px-2 py-1 rounded-md text-xs font-semibold border border-outline-variant shadow-sm">
          {course.category}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-display text-2xl text-on-surface mb-1 leading-tight">
          {course.title}
        </h3>
        <p className="text-base text-on-surface-variant mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden shrink-0 border border-outline-variant flex items-center justify-center">
            <span className="text-xs font-bold text-primary">
              {course.instructorInitials}
            </span>
          </div>
          <span className="text-sm text-on-surface-variant">{course.instructor}</span>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-on-surface-variant">
              {t('learnerCourseProgressLabel')}
            </span>
            <span className="text-xs font-bold text-primary">{course.progress}%</span>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <button
            onClick={onStart}
            className="w-full py-2 px-4 border border-primary text-primary text-sm rounded-lg hover:bg-surface-container-low active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {t('learnerCourseResumeBtn')}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
