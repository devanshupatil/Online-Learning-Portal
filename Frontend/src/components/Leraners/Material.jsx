import React, { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MaterialViewer, detectFileType } from './MaterialViewer';
import { mockFetch } from '../../mockData/mockFetch';

const Material = () => {
  const { t } = useTranslation();

  const URL = import.meta.env.VITE_BACKEND_URL;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const fetchStudyMaterials = async () => {
    try {
      const response = await mockFetch(`${URL}/api/studyMaterials/student123`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.studyMaterials) {
        setMaterials(data.studyMaterials);
      }
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
    if (material.url) {
      window.open(material.url, '_blank');
    } else {
      console.error(`URL not available for ${material.name}`);
    }
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setSelectedMaterial(null);
  };

  const getIcon = (fileName) => {
    const fileType = detectFileType(fileName);

    switch (fileType) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'image':
        return 'image';
      case 'video':
        return 'smart_display';
      default:
        return 'description';
    }
  };

  const getIconBg = (fileName) => {
    const fileType = detectFileType(fileName);

    switch (fileType) {
      case 'pdf':
        return 'bg-tertiary-container/10 text-tertiary-container';
      case 'image':
        return 'bg-accent text-primary';
      case 'video':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-surface-container-low text-on-surface-variant';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant flex items-center gap-2">
        <span className="material-symbols-outlined text-[24px] text-primary">folder_open</span>
        <h3 className="font-display text-2xl text-on-surface">{t('learnerMaterialTitle')}</h3>
      </div>

      <div className="p-6 space-y-4">
        {loading ? (
          <p className="text-center text-on-surface-variant">{t('learnerMaterialLoading')}</p>
        ) : materials.length > 0 ? (
          materials.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${getIconBg(item.name)}`}
              >
                <span className="material-symbols-outlined text-[24px]">{getIcon(item.name)}</span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="font-medium text-on-surface truncate">{item.name}</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  {t('learnerMaterialSize', { size: formatFileSize(item.size) })}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {t('learnerMaterialUploaded', {
                    date: new Date(item.uploaded_at).toLocaleDateString()
                  })}
                </p>
              </div>
              <button
                onClick={() => handleViewMaterial(item)}
                className="cursor-pointer flex items-center justify-center p-2 rounded-lg border border-primary text-primary hover:bg-surface-container-low active:scale-95 transition-all shrink-0"
                aria-label={`View ${item.name}`}
              >
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-on-surface-variant">{t('learnerMaterialEmpty')}</p>
        )}
      </div>

      <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant">
        <button className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
          {t('learnerMaterialViewAll')}
        </button>
      </div>

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
