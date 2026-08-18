import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MaterialViewer, detectFileType } from './MaterialViewer';
import { mockFetch } from '../../mockData/mockFetch';

const FILTER_OPTIONS = ['all', 'pdf', 'video', 'image', 'document'];

const Material = () => {
  const { t } = useTranslation();
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const fetchStudyMaterials = async () => {
    try {
      const response = await mockFetch(`${URL}/api/studyMaterials/student123`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.studyMaterials) setMaterials(data.studyMaterials);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyMaterials();
  }, []);

  const handleViewMaterial = (material) => {
    if (material.url) window.open(material.url, '_blank');
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setSelectedMaterial(null);
  };

  const getFileType = (fileName) => detectFileType(fileName);

  const getIcon = (fileName) => {
    const fileType = getFileType(fileName);
    switch (fileType) {
      case 'pdf': return 'picture_as_pdf';
      case 'image': return 'image';
      case 'video': return 'play_circle';
      default: return 'description';
    }
  };

  const getIconTheme = (fileName) => {
    const fileType = getFileType(fileName);
    switch (fileType) {
      case 'pdf': return 'bg-error-container text-on-error-container';
      case 'image': return 'bg-accent text-primary';
      case 'video': return 'bg-primary-fixed text-on-primary-fixed';
      default: return 'bg-secondary-fixed text-on-secondary-fixed';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFilterLabel = (filter) => {
    const keyMap = {
      all: 'learnerFilterAll',
      pdf: 'learnerFilterPDFs',
      video: 'learnerFilterVideos',
      image: 'learnerFilterImages',
      document: 'learnerFilterDocuments',
    };
    return t(keyMap[filter]);
  };

  const filteredMaterials = materials.filter((item) => {
    if (activeFilter === 'all') return true;
    return getFileType(item.name) === activeFilter;
  });

  return (
    <div className="mt-4 lg:mt-8">
      <header className="mb-10">
        <h1 className="font-display text-[28px] leading-[36px] md:text-[48px] md:leading-[60px] text-on-surface mb-2 tracking-tight">
          {t('learnerMaterialTitle')}
        </h1>
        <p className="text-lg leading-[28px] text-on-surface-variant max-w-2xl">
          {t('learnerMaterialSubtitle')}
        </p>
      </header>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-8 snap-x">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`snap-start px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === filter
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            {getFilterLabel(filter)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl skeleton shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 skeleton w-3/4"></div>
                  <div className="h-3 skeleton w-1/2"></div>
                  <div className="h-3 skeleton w-full"></div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-6 w-20 skeleton rounded-md"></div>
                <div className="w-8 h-8 skeleton rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredMaterials.map((item, index) => (
            <div
              key={index}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 group flex items-start gap-4 relative overflow-hidden"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${getIconTheme(item.name)}`}
              >
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {getIcon(item.name)}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm text-outline mb-4">
                    {t('learnerMaterialUploaded', { date: new Date(item.uploaded_at).toLocaleDateString() })} &bull; {formatFileSize(item.size)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface-variant text-xs font-medium tracking-wide">
                    {item.course || t('learnerMaterialGeneral')}
                  </span>
                  <button
                    onClick={() => handleViewMaterial(item)}
                    className="w-8 h-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    aria-label={t('learnerMaterialDownloadAria', { name: item.name })}
                  >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-on-surface-variant py-12 bg-surface-container-lowest border border-outline-variant rounded-xl">
          <span className="material-symbols-outlined text-[64px] text-outline mb-4 block">folder_off</span>
          <p className="text-lg font-semibold text-on-surface mb-2">{t('learnerMaterialEmpty')}</p>
          <p className="text-sm text-on-surface-variant mb-6 max-w-sm mx-auto">{t('learnerMaterialEmptyHint')}</p>
          <button
            onClick={() => setActiveFilter('all')}
            className="bg-surface-container-low text-primary px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            {t('learnerMaterialViewAll')}
          </button>
        </div>
      )}

      {selectedMaterial && (
        <MaterialViewer
          fileUrl={selectedMaterial.url}
          fileName={selectedMaterial.name}
          onClose={handleCloseViewer}
          isOpen={viewerOpen}
        />
      )}
    </div>
  );
};

export default Material;
