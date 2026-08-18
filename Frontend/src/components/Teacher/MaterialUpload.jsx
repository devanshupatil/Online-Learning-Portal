import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { mockFetch } from '../../mockData/mockFetch';

const MaterialUpload = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [category, setCategory] = useState('');
  const [course, setCourse] = useState('');
  const fileInputRef = useRef(null);
  const URL = import.meta.env.VITE_BACKEND_URL;

  const allowedTypes = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'video/mp4': 'MP4',
    'video/avi': 'AVI'
  };

  const categories = [
    { value: 'Assignments', labelKey: 'teacherMaterialCatAssignments' },
    { value: 'Lectures', labelKey: 'teacherMaterialCatLectures' },
    { value: 'Resources', labelKey: 'teacherMaterialCatResources' },
    { value: 'Exams', labelKey: 'teacherMaterialCatExams' },
    { value: 'Projects', labelKey: 'teacherMaterialCatProjects' },
  ];
  const courses = [
    { value: 'Mathematics', labelKey: 'teacherMaterialCourseMath' },
    { value: 'Science', labelKey: 'teacherMaterialCourseScience' },
    { value: 'English', labelKey: 'teacherMaterialCourseEnglish' },
    { value: 'History', labelKey: 'teacherMaterialCourseHistory' },
    { value: 'Computer Science', labelKey: 'teacherMaterialCourseCS' },
  ];

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };
  const handleFileInput = (e) => handleFiles(Array.from(e.target.files));

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        toast.warning(t('teacherMaterialUploadTooLarge', { name: file.name }));
        return false;
      }
      if (!allowedTypes[file.type]) {
        toast.error(t('teacherMaterialUploadUnsupported', { name: file.name }));
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      status: 'pending'
    }))]);
  };

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  const uploadFiles = async () => {
    if (files.length === 0 || !category || !course) {
      toast.warning(t('teacherMaterialUploadFillAll'));
      return;
    }
    setUploading(true);
    const progress = {};
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('course', course);
      formData.append('teacherId', 'teacher123');
      files.forEach(fileObj => formData.append('files', fileObj.file));
      const response = await mockFetch(`${URL}/api/UploadStudyMaterial/teacher123`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();

      for (const fileObj of files) {
        progress[fileObj.id] = 0;
        setUploadProgress({ ...progress });
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          progress[fileObj.id] = i;
          setUploadProgress({ ...progress });
        }
        fileObj.status = 'completed';
      }
      setUploading(false);
      setFiles([]);
      setUploadProgress({});
      toast.success(t('teacherMaterialUploadSuccess'));
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(t('teacherMaterialUploadFailed'));
      setUploading(false);
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'movie';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word')) return 'description';
    if (type.includes('presentation')) return 'slideshow';
    return 'draft';
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <span className="material-symbols-outlined text-[56px] text-on-surface-variant/50 block mb-3">
          {isDragOver ? 'cloud_upload' : 'upload_file'}
        </span>
        <h3 className="text-lg font-semibold text-on-surface mb-1">
          {isDragOver ? t('teacherMaterialUploadDropHere') : t('teacherMaterialUploadDragDrop')}
        </h3>
        <p className="text-on-surface-variant mb-3">
          {t('teacherMaterialUploadOr')}{' '}
          <span className="text-primary font-semibold cursor-pointer hover:underline">{t('teacherMaterialUploadBrowse')}</span>
        </p>
        <p className="text-xs text-on-surface-variant/70">
          {t('teacherMaterialUploadSupported')} (Max 50MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={Object.keys(allowedTypes).join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Category + Course */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">{t('teacherMaterialUploadCategory')}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          >
            <option value="">{t('teacherMaterialUploadSelectCategory')}</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{t(cat.labelKey)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">{t('teacherMaterialUploadCourse')}</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-3 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          >
            <option value="">{t('teacherMaterialUploadSelectCourse')}</option>
            {courses.map(c => (
              <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-on-surface">{t('teacherMaterialUploadSelectedFiles')}</h4>
          {files.map((fileObj) => (
            <div key={fileObj.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px] text-primary">{getFileIcon(fileObj.file.type)}</span>
                <div>
                  <p className="text-sm font-medium text-on-surface">{fileObj.file.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB • {allowedTypes[fileObj.file.type]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {uploadProgress[fileObj.id] !== undefined && (
                  <div className="w-24">
                    <div className="bg-surface-container-highest rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[fileObj.id]}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 text-right">{uploadProgress[fileObj.id]}%</p>
                  </div>
                )}
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={uploadFiles}
          disabled={files.length === 0 || uploading || !category || !course}
          className="px-6 py-3 bg-primary text-on-primary rounded-xl text-sm font-bold hover:shadow-md disabled:bg-surface-container-highest disabled:text-on-surface-variant/50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"></div>
              {t('teacherMaterialUploadUploading')}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              {t('teacherMaterialUploadButton')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MaterialUpload;
