import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, CloudCog } from 'lucide-react';
import { toast } from 'sonner';

const TestUpload = () => {
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

  const categories = ['Assignments', 'Lectures', 'Resources', 'Exams', 'Projects'];
  const courses = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];

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

    const validFiles = newFiles.filter(file => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.warning(`${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      if (!allowedTypes[file.type]) {
        toast.error(`${file.name} is not a supported file type.`);
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

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0 || !course) {
      toast.warning('Please select files, category, and course.');
      return;
    }

    setUploading(true);
    const progress = {};

    try {
      const formData = new FormData();
      // formData.append('category', category);
      formData.append('course', course);
      formData.append('teacherId', 'teacher123'); // Placeholder teacherId
      files.forEach(fileObj => {
        formData.append('files', fileObj.file);
      });

      const response = await fetch(`${URL}/api/UploadTestsMaterial/teacher123`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      for (const fileObj of files) {
        progress[fileObj.id] = 0;
        setUploadProgress({ ...progress });

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          progress[fileObj.id] = i;
          setUploadProgress({ ...progress });
        }

        // Mark as completed
        fileObj.status = 'completed';
      }

      setUploading(false);
      setFiles([]);
      setUploadProgress({});
      const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));

      toast.promise(promise, {
        loading: 'Loading...',
        success: (data) => {
          return `${data.name} toast has been added`;
        },
        error: 'Error',
      });
      // alert('Files uploaded successfully!');

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
      setUploading(false);
      return;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${isDragOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
        </h3>
        <p className="text-gray-600 mb-4">
          or <button
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
          >
            browse files
          </button>
        </p>
        <p className="text-sm text-gray-500">
          Supported: PDF, DOC, PPT, Images, Videos (Max 50MB each)
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
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div> */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {/* <option value="">Select Course</option> */}
            {courses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Selected Files</h4>
          {files.map((fileObj) => (
            <div key={fileObj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <File className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{fileObj.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB • {allowedTypes[fileObj.file.type]}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {uploadProgress[fileObj.id] !== undefined && (
                  <div className="mr-3 w-20">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[fileObj.id]}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{uploadProgress[fileObj.id]}%</p>
                  </div>
                )}
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="cursor-pointer w-5 h-5" />
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
          disabled={files.length === 0 || uploading || !course}
          className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload Files
            </>
          )}
        </button>
      </div>
    </div>
  );
};


export default TestUpload;