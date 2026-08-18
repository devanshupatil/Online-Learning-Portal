import React, { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { mockFetch } from '../../mockData/mockFetch';

const MaterialManager = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_BACKEND_URL;

  const [downloading, setDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState('');

  const getStudyMaterials = async () => {
    setLoading(true);
    try {
      const response = await mockFetch(`${URL}/api/getStudyMaterials/teacher123`);
      const data = await response.json();
      if (response.ok) {
        const transformedMaterials = (data.materials || []).map((material, index) => {
          const pathParts = material.name.split('/');
          const category = material.category || 'Unknown';
          const course = material.course || 'Unknown';
          const fileName = pathParts.slice(2).join('/') || material.name;
          const fileType = fileName.split('.').pop()?.toUpperCase() || 'FILE';

          const createdDate = material.uploaded_at ? new Date(material.uploaded_at).toLocaleDateString() : 'N/A';
          const createdTime = material.uploaded_at ? new Date(material.uploaded_at).toLocaleTimeString() : 'N/A';

          const formatSize = (bytes) => {
            if (!bytes) return 'N/A';
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
          };

          return {
            id: index + 1,
            title: fileName,
            type: fileType,
            category: category,
            course: course,
            uploadDate: createdDate,
            uploadTime: createdTime,
            size: formatSize(material.size),
            downloads: 0,
            url: material.url
          };
        });
        setMaterials(transformedMaterials);
      } else {
        console.error('Failed to fetch materials:', data.message);
        setMaterials([]);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudyMaterials();
  }, [selectedCategory, selectedCourse]);

  const categories = ['All', 'Lectures', 'Assignments', 'Resources', 'Exams', 'Projects'];
  const courses = ['All', 'Mathematics', 'Science', 'English', 'History', 'Computer Science'];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || material.category === selectedCategory;
    const matchesCourse = selectedCourse === '' || selectedCourse === 'All' || material.course === selectedCourse;
    return matchesSearch && matchesCategory && matchesCourse;
  });

  const handleDelete = async (title, id, category, course) => {
    try {
      const response = await mockFetch(`${URL}/api/deleteStudyMaterial`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: `${category}/${course}/${title}` })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(t('materials.deleteSuccess', { title }));
        getStudyMaterials();
      } else {
        toast.error(t('materials.deleteFailed', { title, message: data.message }));
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error(t('materials.deleteError', { title }));
    }
  };

  const handleEdit = (id) => {
    toast(t('materials.editPlaceholder', { id }));
  };

  const handleDownload = async (materialId, fileName) => {
    if (downloading) return;

    setDownloading(true);
    setDownloadingId(materialId);
    setDownloadProgress(0);
    setDownloadMessage(t('materials.preparingDownload'));

    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 100);

      const response = await mockFetch(`${URL}/api/downloadTestMaterial/${materialId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      setDownloadProgress(100);
      setDownloadMessage(t('materials.downloadComplete'));

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);

      setTimeout(() => {
        setDownloading(false);
        setDownloadingId(null);
        setDownloadProgress(0);
        setDownloadMessage('');
      }, 2000);

    } catch (error) {
      console.error('Download failed:', error);
      setDownloadMessage(t('materials.downloadFailed'));
      setDownloading(false);
      setDownloadingId(null);
      setDownloadProgress(0);

      setTimeout(() => {
        setDownloadMessage('');
      }, 3000);
    }
  };

  const handleView = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="section-fade-in space-y-6">
      {/* Filters and Search */}
      <div className="bg-surface-container-lowest rounded-xl soft-bloom p-6 border border-surface-variant">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                placeholder={t('materials.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {courses.map(course => (
                <option key={course} value={course === 'All' ? '' : course}>{course}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="bg-surface-container-lowest rounded-xl soft-bloom border border-surface-variant">
        <div className="p-6 border-b border-surface-variant">
          <h3 className="text-lg font-semibold text-on-surface">{t('materials.title', { count: filteredMaterials.length })}</h3>
        </div>
        <div className="divide-y divide-surface-variant">
          {loading ? (
            <div className="p-6 text-center text-on-surface-variant">
              {t('materials.loading')}
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="p-6 text-center text-on-surface-variant">
              {t('materials.noResults')}
            </div>
          ) : (
            filteredMaterials.map((material) => (
              <div key={material.id} className="p-6 hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="bg-primary-container p-3 rounded-xl mr-4">
                      <span className="material-symbols-outlined w-6 h-6 text-primary">description</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-on-surface">{material.title}</h4>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-on-surface-variant">
                        <span className="px-2 py-1 bg-surface-container-low rounded-full">{material.type}</span>
                        <span>{material.category}</span>
                        <span>{material.course}</span>
                        <span>{material.uploadDate}</span>
                        <span>{material.size}</span>
                        <span>{material.uploadTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(material.url)}
                      className="p-2 text-primary hover:text-primary hover:bg-primary-container/30 rounded-xl transition-colors duration-200"
                      title={t('materials.view')}
                    >
                      <span className="material-symbols-outlined w-5 h-5">visibility</span>
                    </button>
                    <button
                      onClick={() => handleEdit(material.id)}
                      className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-xl transition-colors duration-200"
                      title={t('materials.edit')}
                    >
                      <span className="material-symbols-outlined w-5 h-5">edit</span>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => handleDownload(material.id, material.title)}
                        className={`p-2 rounded-xl transition-all duration-300 ${downloading && downloadingId === material.id
                          ? 'text-primary bg-primary-container/30 scale-110 rotate-12'
                          : 'text-primary hover:text-primary hover:bg-primary-container/30 hover:scale-105'
                          }`}
                        title={downloading && downloadingId === material.id ? t('materials.downloading') : t('materials.download')}
                        disabled={downloading && downloadingId === material.id}
                      >
                        <span className={`material-symbols-outlined cursor-pointer w-5 h-5 transition-transform duration-300 ${downloading && downloadingId === material.id ? 'animate-pulse' : ''
                          }`}>download</span>
                      </button>
                      {downloading && downloadingId === material.id && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-surface-container-low text-on-surface text-xs px-2 py-1 rounded-xl whitespace-nowrap z-10">
                          {downloadMessage || `${t('materials.downloading')}... ${downloadProgress}%`}
                          <div className="w-16 bg-surface-variant rounded-full h-1 mt-1">
                            <div
                              className="bg-primary h-1 rounded-xl transition-all duration-300"
                              style={{ width: `${downloadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(material.title, material.id, material.category, material.course)}
                      className="p-2 text-error hover:text-error hover:bg-error-container/30 rounded-xl transition-colors duration-200"
                      title={t('materials.delete')}
                    >
                      <span className="material-symbols-outlined w-5 h-5">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialManager;
