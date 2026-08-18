import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { mockFetch } from '../../mockData/mockFetch';

const fileIcons = {
  PDF: 'picture_as_pdf',
  DOC: 'description',
  DOCX: 'description',
  PPT: 'slideshow',
  PPTX: 'slideshow',
  JPG: 'image',
  PNG: 'image',
  GIF: 'image',
  MP4: 'movie',
  AVI: 'movie',
};

const TestUpload = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
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
    'video/avi': 'AVI',
  };

  const courses = [t('tests.courses.mathematics'), t('tests.courses.physics'), t('tests.courses.chemistry'), t('tests.courses.biology'), t('tests.courses.computer')];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > 50 * 1024 * 1024) {
        toast.warning(t('tests.tooLarge', { name: file.name }));
        return false;
      }
      if (!allowedTypes[file.type]) {
        toast.error(t('tests.unsupportedType', { name: file.name }));
        return false;
      }
      return true;
    });

    setFiles((prev) => [
      ...prev,
      ...validFiles.map((file) => ({
        file,
        id: Date.now() + Math.random(),
        status: 'pending',
      })),
    ]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0 || !course) {
      toast.warning(t('tests.selectFilesAndCourse'));
      return;
    }

    setUploading(true);
    const progress = {};

    try {
      const formData = new FormData();
      formData.append('course', course);
      formData.append('teacherId', 'teacher123');
      files.forEach((fileObj) => {
        formData.append('files', fileObj.file);
      });

      const response = await mockFetch(`${URL}/api/UploadTestsMaterial/teacher123`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      for (const fileObj of files) {
        progress[fileObj.id] = 0;
        setUploadProgress({ ...progress });

        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          progress[fileObj.id] = i;
          setUploadProgress({ ...progress });
        }

        fileObj.status = 'completed';
      }

      setUploading(false);
      setFiles([]);
      setUploadProgress({});
      toast.success(t('tests.uploadSuccess'));
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(t('tests.uploadFailed'));
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
          isDragOver ? 'border-primary bg-primary/5' : 'border-outline hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="material-symbols-outlined w-12 h-12 text-on-surface-variant mx-auto mb-4">
          upload_file
        </span>
        <h3 className="text-lg font-semibold text-on-surface mb-2">
          {isDragOver ? t('tests.dropHere') : t('tests.dragDrop')}
        </h3>
        <p className="text-on-surface-variant mb-4">
          {t('tests.or')}{' '}
          <button
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer text-primary hover:text-primary-fixed font-medium"
          >
            {t('tests.browseFiles')}
          </button>
        </p>
        <p className="text-sm text-on-surface-variant">
          {t('tests.supportedFormats')}
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

      {/* Category and Course Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">{t('tests.course')}</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="cursor-pointer w-full px-3 py-2 border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-on-surface">{t('tests.selectedFiles')}</h4>
          {files.map((fileObj) => {
            const ext = allowedTypes[fileObj.file.type];
            const icon = fileIcons[ext] || 'description';
            return (
              <div key={fileObj.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <div className="flex items-center">
                  <span className="material-symbols-outlined w-5 h-5 text-on-surface-variant mr-3">
                    {icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{fileObj.file.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB • {ext}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {uploadProgress[fileObj.id] !== undefined && (
                    <div className="mr-3 w-20">
                      <div className="bg-surface-container-highest rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[fileObj.id]}%` }}
                        />
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">{uploadProgress[fileObj.id]}%</p>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    className="text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-full p-1"
                  >
                    <span className="material-symbols-outlined cursor-pointer w-5 h-5">close</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={uploadFiles}
          disabled={files.length === 0 || uploading || !course}
          className="cursor-pointer px-6 py-3 bg-primary text-on-primary rounded-xl hover:bg-primary/90 disabled:bg-surface-container-highest disabled:text-on-surface/38 disabled:cursor-not-allowed transition-colors duration-300 flex items-center"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent mr-2" />
              {t('tests.uploading')}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined w-5 h-5 mr-2">upload_file</span>
              {t('tests.uploadFiles')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TestUpload;
