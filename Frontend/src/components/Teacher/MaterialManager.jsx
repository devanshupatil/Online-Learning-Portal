import React, { useState } from 'react';
import { FileText, Eye, Download, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const MaterialManager = () => {
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
      const response = await fetch(`${URL}/api/getStudyMaterials/teacher123`); // Placeholder teacherId
      const data = await response.json();
      if (response.ok) {
        console.log('Materials fetched successfully:', data.materials);
        // Transform backend data to match frontend structure
        const transformedMaterials = (data.materials || []).map((material, index) => {
          const pathParts = material.name.split('/');
          const category = material.category || 'Unknown';
          const course = material.course || 'Unknown';
          const fileName = pathParts.slice(2).join('/') || material.name;
          const fileType = fileName.split('.').pop()?.toUpperCase() || 'FILE';

          // Format the creation date and time
          const createdDate = material.uploaded_at ? new Date(material.uploaded_at).toLocaleDateString() : 'N/A';
          const createdTime = material.uploaded_at ? new Date(material.uploaded_at).toLocaleTimeString() : 'N/A';

          // Format file size
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
            downloads: 0, // Backend doesn't provide this
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

    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${URL}/api/deleteStudyMaterial`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: `${category}/${course}/${title}` })
      });
      const data = await response.json();
      if (response.ok) {
        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));

        toast.promise(promise, {
          loading: 'Loading...',
          success: (data) => {
            return `${data.name} deleted "${title}" successfully!`;
          },
          error: 'Error',
        });        // Refresh the materials list
        getStudyMaterials();
      } else {
        toast.error(`Failed to delete "${title}": ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error(`An error occurred while deleting "${title}". Please try again.`);
    }


  };

  const handleEdit = (id) => {
    // In a real app, this would open an edit modal
    toast(`Edit material with ID: ${id}`);
  };

  // const handleDownload = (material) => {
  //   if (material.url) {
  //     const link = document.createElement('a');
  //     link.href = material.url;
  //     link.download = material.title;
  //     link.click();
  //   } else {
  //     toast.error(`Download link not available for ${material.title}`);
  //   }
  // };

    const handleDownload = async (materialId, fileName) => {
    if (downloading) return;

    setDownloading(true);
    setDownloadingId(materialId);
    setDownloadProgress(0);
    setDownloadMessage('Preparing download...');

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 100);

      // Fetch the file through backend API
      const response = await fetch(`${URL}/api/downloadTestMaterial/${materialId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob from response
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      setDownloadProgress(100);
      setDownloadMessage('Download complete!');

      // Create download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);

      // Reset after success
      setTimeout(() => {
        setDownloading(false);
        setDownloadingId(null);
        setDownloadProgress(0);
        setDownloadMessage('');
      }, 2000);

    } catch (error) {
      console.error('Download failed:', error);
      setDownloadMessage('Download failed. Please try again.');
      setDownloading(false);
      setDownloadingId(null);
      setDownloadProgress(0);

      // Reset error message after 3 seconds
      setTimeout(() => {
        setDownloadMessage('');
      }, 3000);
    }
  };

  const handleView = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {courses.map(course => (
                <option key={course} value={course === 'All' ? '' : course}>{course}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Uploaded Materials ({filteredMaterials.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading materials...
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No materials found matching your criteria.
            </div>
          ) : (
            filteredMaterials.map((material) => (
              <div key={material.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{material.title}</h4>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded-full">{material.type}</span>
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
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(material.id)}
                      className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => handleDownload(material.id, material.fileName)}
                        className={`p-2 rounded-lg transition-all duration-300 ${downloading && downloadingId === material.id
                          ? 'text-green-600 bg-green-50 scale-110 rotate-12'
                          : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 hover:scale-105'
                          }`}
                        title={downloading && downloadingId === material.id ? "Downloading..." : "Download"}
                        disabled={downloading && downloadingId === material.id}
                      >
                        <Download className={`cursor-pointer w-5 h-5 transition-transform duration-300 ${downloading && downloadingId === material.id ? 'animate-pulse' : ''
                          }`} />
                      </button>
                      {downloading && downloadingId === material.id && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          {downloadMessage || `Downloading... ${downloadProgress}%`}
                          <div className="w-16 bg-gray-600 rounded-full h-1 mt-1">
                            <div
                              className="bg-green-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${downloadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
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