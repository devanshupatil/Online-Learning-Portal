import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CourseCard from './CourseCard';

const CoursesList = ({ onAddCourse, courses }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.category.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 mt-4 lg:mt-8">
        <div>
          <h2 className="font-display text-[32px] leading-[40px] text-on-surface">
            {t('learnerCoursesTitle')}
          </h2>
          <p className="text-base text-on-surface-variant mt-1">
            {t('learnerCoursesSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-base text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-shadow"
              type="text"
              placeholder={t('learnerCoursesSearchPlaceholder')}
            />
          </div>
          <button className="flex items-center justify-center gap-1 px-4 py-2 bg-surface-container-highest text-on-surface text-sm rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant shrink-0">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            {t('learnerCoursesFilterBtn')}
          </button>
          <button
            onClick={onAddCourse}
            className="flex items-center justify-center gap-1 px-4 py-2 bg-primary-container text-on-primary-container text-sm rounded-lg hover:bg-primary-container/90 active:scale-95 transition-all shrink-0 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {t('learnerCoursesAddBtn')}
          </button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <span className="material-symbols-outlined text-[64px] text-outline mb-4 block">search_off</span>
            <p className="text-lg font-semibold text-on-surface mb-2">{t('learnerCoursesEmpty')}</p>
            <p className="text-sm text-on-surface-variant">{t('learnerCoursesEmptyHint', { query: search })}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
