import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { mockFetch } from '../../mockData/mockFetch';

const INITIAL_STUDENTS = [
  {
    id: 'MAT-2024-001',
    name: 'Alex Mercer',
    email: 'alex.m@student.edu',
    phone: '+1 (555) 123-4567',
    class: '12-A',
    subject: 'Mathematics',
    performance: 'Excellent',
    performancePercent: 94,
    dotColor: '#10B981',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrRJYRA4rjI4B-EV1z59rcATAwQLzSI0k8ECvcj_iCDQwl1F9U2F1JNKy8BVlJgX4JBIBSf695jwhs98vr4kPgmPoVfEhfmHgUc5o5pY2H4JyDqxg06d0EitK6zdXurt5Hh6cqEzU4uBD6wQJ9AU4ytek4-X8BZoMozzrTQjBDX7HaJDrZMD9nNyDpflQ8X5CmuqasphGENESAVLAr5r0SiWx7LaiDd90t6beQr4h4aLa_nQC6ELqZ',
    attendance: 96,
  },
  {
    id: 'MAT-2024-042',
    name: 'Emma Chen',
    email: 'emma.c@student.edu',
    phone: '+1 (555) 987-6543',
    class: '11-B',
    subject: 'Mathematics',
    performance: 'Good',
    performancePercent: 78,
    dotColor: '#F59E0B',
    initials: 'EC',
    initialsBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
    attendance: 88,
  },
  {
    id: 'MAT-2024-015',
    name: 'Maya Patel',
    email: 'm.patel@student.edu',
    phone: '+1 (555) 234-5678',
    class: '12-A',
    subject: 'Mathematics',
    performance: 'Excellent',
    performancePercent: 91,
    dotColor: '#10B981',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0TfnztmX5IuO_53frm_tPMTzd308Dti3H1cytsCiVns3i2Nvvkl_Du5D-Myux7bUaowoKvyVSNfyf8TQfhAhblH6g5-IS0eOWK5LsAyP8vRNqOUKvrEGXNGE-ECboN3zR23VQJKJOH3lOPcEI59EdMYmGVhLXSrBUXDSd7NZHECp4ba00sLkMx68r3zME6ZiuDsxZVh1vGhQxsP6B1GoMjNKVjRA5lXa-20b_TOA-nabol8JKJLOP',
    attendance: 94,
  },
  {
    id: 'MAT-2024-088',
    name: 'James Wilson',
    email: 'j.wilson@student.edu',
    phone: '+1 (555) 876-5432',
    class: '11-B',
    subject: 'Mathematics',
    performance: 'Needs Attention',
    performancePercent: 58,
    dotColor: '#ba1a1a',
    initials: 'JW',
    initialsBg: 'bg-error-container text-on-error-container',
    attendance: 64,
  },
  {
    id: 'MAT-2024-102',
    name: 'Aarav Sharma',
    email: 'aarav.s@student.edu',
    phone: '+91 98765 43210',
    class: '12-A',
    subject: 'Mathematics',
    performance: 'Excellent',
    performancePercent: 98,
    dotColor: '#10B981',
    initials: 'AS',
    initialsBg: 'bg-primary-container text-on-primary',
    attendance: 99,
  },
  {
    id: 'MAT-2024-105',
    name: 'Diya Nair',
    email: 'diya.n@student.edu',
    phone: '+91 90040 55667',
    class: '11-A',
    subject: 'Mathematics',
    performance: 'Good',
    performancePercent: 82,
    dotColor: '#F59E0B',
    initials: 'DN',
    initialsBg: 'bg-secondary-fixed text-on-secondary-fixed',
    attendance: 90,
  }
];

const StudentDirectory = ({ onViewProfile, externalSearch = '' }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedPerformance, setSelectedPerformance] = useState('');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    class: '12-A',
    performance: 'Good',
    performancePercent: 80,
  });
  const perPage = 4;

  const URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBackendStudents = async () => {
      try {
        const response = await mockFetch(`${URL}/api/students`);
        if (response.ok) {
          const data = await response.json();
          if (data?.data?.length > 0) {
            const transformed = data.data.map((s, idx) => ({
              id: s.student_id || `MAT-2024-0${idx + 1}`,
              name: s.name,
              email: s.email || `${s.name.toLowerCase().replace(/\s+/g, '.')}@student.edu`,
              phone: s.phone || '+1 (555) 000-0000',
              class: s.class || (idx % 2 === 0 ? '12-A' : '11-B'),
              subject: 'Mathematics',
              performance: s.last_attendance_status === 'absent' ? 'Needs Attention' : (idx % 2 === 0 ? 'Excellent' : 'Good'),
              performancePercent: s.last_attendance_status === 'absent' ? 58 : (idx % 2 === 0 ? 94 : 78),
              dotColor: s.last_attendance_status === 'absent' ? '#ba1a1a' : (idx % 2 === 0 ? '#10B981' : '#F59E0B'),
              initials: s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
              initialsBg: idx % 3 === 0 ? 'bg-primary-container text-on-primary' : idx % 3 === 1 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container',
              attendance: s.last_attendance_status === 'present' ? 95 : 70,
            }));
            setStudents(transformed);
          }
        }
      } catch {
        // Fallback to initial students on network error
      }
    };
    fetchBackendStudents();
  }, [URL]);

  const effectiveSearch = externalSearch || searchTerm;

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                          student.email.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                          student.id.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                          student.phone?.includes(effectiveSearch);
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesPerformance = !selectedPerformance || 
      (selectedPerformance === 'excellent' && student.performance === 'Excellent') ||
      (selectedPerformance === 'good' && student.performance === 'Good') ||
      (selectedPerformance === 'needs_attention' && student.performance === 'Needs Attention');
    return matchesSearch && matchesClass && matchesPerformance;
  });

  const totalPages = Math.ceil(filteredStudents.length / perPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Email,Phone,Class,Performance,Score", ...filteredStudents.map(s => `${s.id},"${s.name}",${s.email},${s.phone},${s.class},${s.performance},${s.performancePercent}%`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_students_directory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Students list exported successfully!");
  };

  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) {
      toast.error("Please fill in student name and email.");
      return;
    }
    const created = {
      id: `MAT-2024-${Math.floor(100 + Math.random() * 900)}`,
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone || '+1 (555) 000-0000',
      class: newStudent.class,
      subject: 'Mathematics',
      performance: newStudent.performance,
      performancePercent: newStudent.performance === 'Excellent' ? 95 : newStudent.performance === 'Good' ? 80 : 55,
      dotColor: newStudent.performance === 'Excellent' ? '#10B981' : newStudent.performance === 'Good' ? '#F59E0B' : '#ba1a1a',
      initials: newStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      initialsBg: 'bg-primary-container text-on-primary',
      attendance: 90,
    };
    setStudents(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewStudent({ name: '', email: '', phone: '', class: '12-A', performance: 'Good', performancePercent: 80 });
    toast.success(`${created.name} added to student directory!`);
  };

  return (
    <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-on-surface mb-1">{t('teacherStudentsTitle')}</h2>
          <p className="text-base text-on-surface-variant font-medium">
            {t('teacherStudentsSubtitle', { count: students.length, context: 'Mathematics' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface font-semibold text-sm hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            {t('teacherStudentsExport')}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            {t('teacherStudentsAdd')}
          </button>
        </div>
      </div>

      {/* Filters & Controls Bar */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-4 soft-bloom flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex-1 w-full md:w-auto relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            className="w-full md:max-w-md pl-10 pr-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface-variant/70"
            placeholder={t('teacherStudentsSearchPlaceholder')}
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setCurrentPage(1); }}
              className="appearance-none bg-surface border border-surface-variant rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none min-w-[130px] cursor-pointer"
            >
              <option value="">{t('teacherStudentsFilterAllClasses')}</option>
              <option value="12-A">{t('teacherStudentsClass12A')}</option>
              <option value="12-B">{t('teacherStudentsClass12B')}</option>
              <option value="11-A">{t('teacherStudentsClass11A')}</option>
              <option value="11-B">{t('teacherStudentsClass11B')}</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">expand_more</span>
          </div>
          <div className="relative">
            <select
              value={selectedPerformance}
              onChange={(e) => { setSelectedPerformance(e.target.value); setCurrentPage(1); }}
              className="appearance-none bg-surface border border-surface-variant rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none min-w-[150px] cursor-pointer"
            >
              <option value="">{t('teacherStudentsFilterPerformance')}</option>
              <option value="excellent">{t('teacherStudentsFilterExcellent')}</option>
              <option value="good">{t('teacherStudentsFilterGood')}</option>
              <option value="needs_attention">{t('teacherStudentsFilterNeedsAttention')}</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">expand_more</span>
          </div>
          <button
            onClick={() => { setSearchTerm(''); setSelectedClass(''); setSelectedPerformance(''); setCurrentPage(1); }}
            className="p-2.5 rounded-xl border border-surface-variant text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
          </button>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low dark:bg-surface-container border-b border-surface-variant">
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('teacherStudentsTableStudent')}</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('teacherStudentsTableContact')}</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('teacherStudentsTableClass')}</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('teacherStudentsTablePerformance')}</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">{t('teacherStudentsTableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] text-outline mb-2 block">person_search</span>
                    <p className="font-semibold text-base">{t('teacherStudentsEmpty')}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{t('teacherStudentsEmptyHint')}</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-surface-container-low/60 transition-colors group">
                    {/* Student Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {student.img ? (
                          <img
                            className="w-10 h-10 rounded-full object-cover border border-outline-variant shadow-xs flex-shrink-0"
                            src={student.img}
                            alt={student.name}
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-xs flex-shrink-0 ${student.initialsBg || 'bg-primary text-white'}`}>
                            {student.initials || 'ST'}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-on-surface">{student.name}</div>
                          <div className="text-xs text-on-surface-variant font-medium">ID: {student.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Column */}
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-on-surface">{student.email}</div>
                      <div className="text-xs text-on-surface-variant font-medium">{student.phone}</div>
                    </td>

                    {/* Class Column */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface-container dark:bg-surface-container-high text-on-surface border border-outline-variant/40">
                        {student.class}
                      </span>
                    </td>

                    {/* Performance Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: student.dotColor }}
                        />
                        <span className="text-sm font-semibold text-on-surface">{student.performance}</span>
                        <span className="text-xs font-medium text-on-surface-variant">({student.performancePercent}%)</span>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toast.info(`Viewing progress analytics for ${student.name}`)}
                          className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="View Progress"
                        >
                          <span className="material-symbols-outlined text-[20px]">analytics</span>
                        </button>
                        <button
                          onClick={() => onViewProfile && onViewProfile(student)}
                          className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="View Profile"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button
                          onClick={() => toast.info(`Options for ${student.name}`)}
                          className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="More Options"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-surface-variant px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest">
          <div className="text-xs font-medium text-on-surface-variant">
            {t('teacherStudentsPaginationShowing', { from: filteredStudents.length > 0 ? (currentPage - 1) * perPage + 1 : 0, to: Math.min(currentPage * perPage, filteredStudents.length), total: filteredStudents.length })}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-surface-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-primary text-white shadow-xs'
                    : 'hover:bg-surface-container-low text-on-surface'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-surface-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-surface-variant shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-4 border-b border-surface-variant">
              <h3 className="text-xl font-bold font-display text-on-surface">{t('teacherStudentsModalTitle')}</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-low cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddStudentSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">{t('teacherStudentsModalNameLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('teacherStudentsModalNamePlaceholder')}
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">{t('teacherStudentsModalEmailLabel')}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('teacherStudentsModalEmailPlaceholder')}
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">{t('teacherStudentsModalPhoneLabel')}</label>
                  <input
                    type="text"
                    placeholder={t('teacherStudentsModalPhonePlaceholder')}
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">{t('teacherStudentsModalClassLabel')}</label>
                  <select
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="12-A">Class 12-A</option>
                    <option value="12-B">Class 12-B</option>
                    <option value="11-A">Class 11-A</option>
                    <option value="11-B">Class 11-B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">{t('teacherStudentsModalPerformanceLabel')}</label>
                  <select
                    value={newStudent.performance}
                    onChange={(e) => setNewStudent({ ...newStudent, performance: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-surface-variant rounded-xl text-sm outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Excellent">Excellent (90%+)</option>
                    <option value="Good">Good (75%-89%)</option>
                    <option value="Needs Attention">Needs Attention (&lt;75%)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant font-semibold text-sm hover:bg-surface-container-low cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:opacity-90 cursor-pointer shadow-sm"
                >
                  {t('teacherStudentsModalSaveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;
