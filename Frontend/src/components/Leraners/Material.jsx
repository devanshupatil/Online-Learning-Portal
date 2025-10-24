import React, { useState } from 'react';
import { useEffect } from 'react';
import { FileText, Video, Eye, CloudCog } from 'lucide-react';
import { MaterialViewer, detectFileType, getFileTypeInfo } from './MaterialViewer';

const Material = () => {

  const URL = import.meta.env.VITE_BACKEND_URL;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const fetchStudyMaterials = async () => {
    try {
      const response = await fetch(`${URL}/api/studyMaterials/student123`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // console.log('Fetched study materials:', data);
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
  } , []);

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



  // Mock data for materials
  const materialsData = [
    {
      id: 1,
      title: 'Algebra Basics Notes',
      type: 'document',
      subject: 'Mathematics',
      date: '2023-05-15'
    },
    {
      id: 2,
      title: 'Physics Lecture Video',
      type: 'video',
      subject: 'Physics',
      date: '2023-05-18'
    },
    {
      id: 3,
      title: 'Chemistry Lab Manual',
      type: 'document',
      subject: 'Chemistry',
      date: '2023-05-20'
    }
  ];

  const getIcon = (fileName) => {
    const fileType = detectFileType(fileName);
    const fileTypeInfo = getFileTypeInfo(fileType);

    switch (fileType) {
      case 'pdf':
        return <FileText className={`w-5 h-5 ${fileTypeInfo.color}`} />;
      case 'image':
        return <Eye className={`w-5 h-5 ${fileTypeInfo.color}`} />;
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getIconBg = (fileName) => {
    const fileType = detectFileType(fileName);

    switch (fileType) {
      case 'pdf':
        return 'bg-red-50';
      case 'image':
        return 'bg-blue-50';
      case 'video':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
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
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Material</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading materials...</p>
        ) : materials.length > 0 ? (
          materials.map((item, index) => (
            <div key={index} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-300 hover:border-green-300">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getIconBg(item.name)}`}>
                {getIcon(item.name)}
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600 mt-1">Size: {formatFileSize(item.size)}</p>
                <p className="text-xs text-gray-500 mt-1">Uploaded: {new Date(item.uploaded_at).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewMaterial(item)}
                  className="cursor-pointer cta-button text-gray-400 hover:text-green-600 transition-colors duration-300 p-2 rounded-lg hover:bg-green-50"
                  aria-label={`View ${item.name}`}
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No materials found.</p>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button className="w-full text-center text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-300">
          View All Materials
        </button>
      </div>

      {/* Material Viewer Modal */}
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