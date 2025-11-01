import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Eye, Edit, FileType } from 'lucide-react';
import { toast } from 'sonner';

const TestManager = () => {
  const [testMaterials, setTestMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editFileName, setEditFileName] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState('');

  const URL = import.meta.env.VITE_BACKEND_URL;
  const teacherId = 'teacher123'; // Placeholder teacherId

  useEffect(() => {
    fetchTestMaterials();
  }, []);

  const fetchTestMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URL}/api/getTestsMaterials/${teacherId}`);
      const data = await response.json();
      if (response.ok) {
        setTestMaterials(data.materials || []);
      } else {
        console.error('Failed to fetch test materials:', data.message);
      }
    } catch (error) {
      console.error('Error fetching test materials:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (fileName) => {
    if (!confirm('Are you sure you want to delete this test material?')) return;

    try {
      const response = await fetch(`${URL}/api/deleteTestsMaterials`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (response.ok) {
        setTestMaterials(prev => prev.filter(material => material.name !== fileName));
        alert('Test material deleted successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to delete test material: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting test material:', error);
      alert('Error deleting test material');
    }
  };

  const handleView = (url) => {
    window.open(url, '_blank');
  };

  const handleEdit = (material) => {
    const pathParts = material.name.split('/');
    const course = material.course || 'Unknown';
    const fileName = pathParts.slice(2).join('/') || material.name;

    setEditingMaterial(material);
    setEditFileName(fileName);
    setEditCourse(course);
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editFileName.trim() || !editCourse.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${URL}/api/updateTestMaterial/${editingMaterial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingMaterial.id,
          fileName: editFileName,
          course: editCourse,
        }),
      });

      if (response.ok) {
        // Update the local state
        setTestMaterials(prev => prev.map(material =>
          material.id === editingMaterial.id
            ? { ...material, course: editCourse, name: `/${editCourse}/${editFileName}` }
            : material
        ));
        setShowEditModal(false);
        setEditingMaterial(null);
        toast.success('Test material updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to update test material: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating test material:', error);
      alert('Error updating test material');
    }
  };

  const handleConvert = async (material) => {
    try {
      // Check if the material is an image
      // const isImage = material.mime_type && material.mime_type.startsWith('image/');
      // if (!isImage) {
      //   toast.error('Only image files can be analyzed.');
      //   return;
      // }
      if (!material.id) {
        toast.error('Invalid material for analysis.');
        return;
      }

      // Show loading state
      toast.loading('Analyzing image...', { id: 'analyze' });

      // Fetch the image as blob
      // const imageResponse = await fetch(material.url);
      // if (!imageResponse.ok) {
      //   throw new Error('Failed to fetch image');
      // }

      // const imageBlob = await imageResponse.blob();

      // Create FormData and append the image
      const formData = new FormData();
      formData.append('id', material.id);

       const queryParams = new URLSearchParams({
        imageURL: material.url,
      });

      // Call the analyze API
      const analyzeResponse = await fetch(`${URL}/api/analyzeImage?${queryParams}`, {
        method: 'POST',
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const result = await analyzeResponse.json();

      // Show success with analysis result
      toast.success('Image analyzed successfully!', { id: 'analyze' });

      // Display the analysis result (you can customize this)
      alert(`Analysis Result:\n\n${result.analysis}`);

    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error(`Analysis failed: ${error.message}`, { id: 'analyze' });
    }
  };


  return (
    <div className="space-y-6">
      {/* Test Materials Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Test Materials ({testMaterials.length})</h3>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading test materials...</div>
        ) : testMaterials.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No test materials found. Upload some test materials first.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {testMaterials.map((material) => {
              const pathParts = material.name.split('/');
              const course = material.course || 'Unknown';
              const fileName = pathParts.slice(2).join('/') || material.name;
              const fileType = material.mime_type.split('.').pop()?.toUpperCase() || 'FILE';

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

              return (
                <div key={material.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{fileName}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>{course}</span>
                          <span>{fileType}</span>
                          <span>{formatSize(material.size)}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Uploaded: {createdDate} at {createdTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(material.url)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="View"
                      >
                        <Eye className="cursor-pointer w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(material)}
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="cursor-pointer w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleConvert(material)}
                        className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                        title="Convert"
                      >
                        <FileType className="cursor-pointer w-5 h-5" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => handleDownload(material.id, fileName)}
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            downloading && downloadingId === material.id
                              ? 'text-green-600 bg-green-50 scale-110 rotate-12'
                              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 hover:scale-105'
                          }`}
                          title={downloading && downloadingId === material.id ? "Downloading..." : "Download"}
                          disabled={downloading && downloadingId === material.id}
                        >
                          <Download className={`cursor-pointer w-5 h-5 transition-transform duration-300 ${
                            downloading && downloadingId === material.id ? 'animate-pulse' : ''
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
                        onClick={() => handleDelete(material.name)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="cursor-pointer w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 modal-3d-enter">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Test Material</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Name</label>
                <input
                  type="text"
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter file name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                  className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Course</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMaterial(null);
                }}
                className="cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManager;