import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { mockFetch } from '../../mockData/mockFetch';

const TestManager = () => {
  const { t } = useTranslation();
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
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [editingAnalysis, setEditingAnalysis] = useState({});
  const [currentMaterialId, setCurrentMaterialId] = useState(null);

  const URL = import.meta.env.VITE_BACKEND_URL;
  const teacherId = 'teacher123';
  const selectedModel = localStorage.getItem('selectedModel') || 'openAI';

  useEffect(() => {
    fetchTestMaterials();
  }, []);

  const fetchTestMaterials = async () => {
    try {
      setLoading(true);
      const response = await mockFetch(`${URL}/api/getTestsMaterials/${teacherId}`);
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
    setDownloadMessage(t('testManager.preparingDownload'));

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
      setDownloadMessage(t('testManager.downloadComplete'));

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
      setDownloadMessage(t('testManager.downloadFailed'));
      toast.error(t('testManager.downloadFailed'));
      setDownloading(false);
      setDownloadingId(null);
      setDownloadProgress(0);

      setTimeout(() => {
        setDownloadMessage('');
      }, 3000);
    }
  };

  const handleDelete = async (fileName) => {
    if (!window.confirm(t('testManager.confirmDelete'))) return;

    try {
      const response = await mockFetch(`${URL}/api/deleteTestsMaterials`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      });

      if (response.ok) {
        setTestMaterials(prev => prev.filter(material => material.name !== fileName));
        toast.success(t('testManager.deleteSuccess'));
      } else {
        const errorData = await response.json();
        toast.error(`${t('testManager.deleteFailed')}: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting test material:', error);
      toast.error(t('testManager.deleteError'));
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
      toast.error(t('testManager.fillAllFields'));
      return;
    }

    try {
      const response = await mockFetch(`${URL}/api/updateTestMaterial/${editingMaterial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingMaterial.id,
          fileName: editFileName,
          course: editCourse,
        }),
      });

      if (response.ok) {
        setTestMaterials(prev => prev.map(material =>
          material.id === editingMaterial.id
            ? { ...material, course: editCourse, name: `/${editCourse}/${editFileName}` }
            : material
        ));
        setShowEditModal(false);
        setEditingMaterial(null);
        toast.success(t('testManager.updateSuccess'));
      } else {
        const errorData = await response.json();
        toast.error(`${t('testManager.updateFailed')}: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating test material:', error);
      toast.error(t('testManager.updateError'));
    }
  };

  const handleConvert = async (material) => {
    try {
      if (!material.id) {
        toast.error(t('testManager.invalidMaterial'));
        return;
      }

      toast.loading(t('testManager.analyzingImage'), { id: 'analyze' });

      try {
        const getImageResponse = await mockFetch(`${URL}/api/getImageAnalysis/${material.id}`);
        if (getImageResponse.ok) {
          const text = await getImageResponse.text();
          if (text) {
            let existingAnalysis = null;
            try {
              const analysisStart = text.indexOf('{');
              if (analysisStart !== -1) {
                const cleanedText = text.slice(analysisStart);
                existingAnalysis = JSON.parse(cleanedText);
              } else {
                throw new Error('Invalid analysis data format');
              }

              if (existingAnalysis && existingAnalysis.analysis && existingAnalysis.analysis.analysis) {
                existingAnalysis = { analysis: existingAnalysis.analysis.analysis };
              }
            } catch (parseErr) {
              console.warn('Failed to parse analysis JSON from server:', parseErr);
            }

            if (existingAnalysis && Object.keys(existingAnalysis).length > 0) {
              setEditingAnalysis(existingAnalysis);
              setCurrentMaterialId(material.id);
              setShowAnalysisModal(true);
              toast.dismiss('analyze');
              setTimeout(() => toast.success(t('testManager.loadedCachedAnalysis')), 100);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Error fetching existing analysis from server:', err);
      }

      const formData = new FormData();
      formData.append('id', material.id);

      const queryParams = new URLSearchParams({
        imageURL: material.url,
        modelName: selectedModel,
      });

      const analyzeResponse = await mockFetch(`${URL}/api/analyzeImage?${queryParams}`, {
        method: 'POST',
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const result = await analyzeResponse.json();

      localStorage.setItem(`imageAnalysis_${material.id}`, JSON.stringify(result));

      toast.dismiss('analyze');
      setTimeout(() => toast.success(t('testManager.analysisSuccess'), { id: 'analyze' }), 100);

      setEditingAnalysis(result);
      setCurrentMaterialId(material.id);
      setShowAnalysisModal(true);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error(`${t('testManager.analysisFailed')}: ${error.message}`, { id: 'analyze' });
    }
  };

  const handleSaveAnalysis = async () => {
    toast.loading(t('testManager.savingAnalysis'), { id: 'saveAnalysis' });

    try {
      if (!currentMaterialId) {
        console.error('currentMaterialId is null/undefined');
        throw new Error('No material ID available. Please try analyzing the image again.');
      }

      const requestBody = {
        materialId: currentMaterialId,
        analysis: editingAnalysis,
        material: testMaterials.find(m => m.id === currentMaterialId),
      };

      const response = await mockFetch(`${URL}/api/saveImageAnalysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save analysis data');
      }

      localStorage.setItem(`imageAnalysis_${currentMaterialId}`, JSON.stringify(editingAnalysis));

      setShowAnalysisModal(false);
      toast.dismiss('saveAnalysis');
      setTimeout(() => toast.success(t('testManager.saveSuccess')), 100);
    } catch (error) {
      console.error('Error saving analysis data:', error);
      toast.error(`${t('testManager.saveFailed')}: ${error.message}`);
    }
  };

  const handleAnalysisChange = (path, value) => {
    setEditingAnalysis(prev => updateNestedValue(prev, path, value));
  };

  const handleDeleteQuestion = (index) => {
    setEditingAnalysis(prev => {
      const next = { ...prev, analysis: { ...prev.analysis } };
      if (Array.isArray(next.analysis?.questions)) {
        next.analysis.questions = next.analysis.questions.filter((_, i) => i !== index);
      } else {
        next.analysis = { ...(next.analysis || {}), questions: [] };
      }
      return next;
    });
  };

  const updateNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((o, key) => {
      if (key.includes('[')) {
        const [arrayKey, index] = key.split(/\[|\]/).filter(Boolean);
        if (!o[arrayKey]) o[arrayKey] = [];
        if (!o[arrayKey][index]) o[arrayKey][index] = {};
        return o[arrayKey][index];
      }
      if (!o[key]) o[key] = {};
      return o[key];
    }, obj);

    target[lastKey] = value;
    return { ...obj };
  };

  return (
    <div className="space-y-6">
      {/* Test Materials Section */}
      <div className="bg-surface-container-lowest rounded-xl soft-bloom border border-surface-variant">
        <div className="p-6 border-b border-surface-variant">
          <h3 className="text-lg font-semibold text-on-surface">{t('testManager.title')} ({testMaterials.length})</h3>
        </div>
        {loading ? (
          <div className="p-6 text-center text-on-surface-variant">{t('testManager.loading')}</div>
        ) : testMaterials.length === 0 ? (
          <div className="p-6 text-center text-on-surface-variant">{t('testManager.noMaterials')}</div>
        ) : (
          <div className="divide-y divide-surface-variant">
            {testMaterials.map((material) => {
              const pathParts = material.name.split('/');
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

              return (
                <div key={material.id} className="p-6 hover:bg-surface-container-low transition-colors duration-200">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="bg-primary-container p-3 rounded-xl mr-4">
                        <span className="material-symbols-outlined text-primary text-2xl">description</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-on-surface">{fileName}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-on-surface-variant">
                          <span>{course}</span>
                          <span>{fileType}</span>
                          <span>{formatSize(material.size)}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant">
                          <span>{t('testManager.uploaded')}: {createdDate} {t('testManager.at')} {createdTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(material.url)}
                        className="p-2 text-primary hover:text-primary/80 hover:bg-primary-container/30 rounded-xl transition-colors duration-200"
                        title={t('testManager.view')}
                      >
                        <span className="material-symbols-outlined text-xl cursor-pointer">visibility</span>
                      </button>
                      <button
                        onClick={() => handleEdit(material)}
                        className="p-2 text-secondary hover:text-secondary/80 hover:bg-secondary-container/30 rounded-xl transition-colors duration-200"
                        title={t('testManager.edit')}
                      >
                        <span className="material-symbols-outlined text-xl cursor-pointer">edit</span>
                      </button>
                      <button
                        onClick={() => handleConvert(material)}
                        className="p-2 text-tertiary hover:text-tertiary/80 hover:bg-tertiary-container/30 rounded-xl transition-colors duration-200"
                        title={t('testManager.convert')}
                      >
                        <span className="material-symbols-outlined text-xl cursor-pointer">analytics</span>
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => handleDownload(material.id, fileName)}
                          className={`p-2 rounded-xl transition-all duration-300 ${downloading && downloadingId === material.id
                              ? 'text-primary bg-primary-container/30 scale-110 rotate-12'
                              : 'text-primary hover:text-primary/80 hover:bg-primary-container/30 hover:scale-105'
                            }`}
                          title={downloading && downloadingId === material.id ? t('testManager.downloading') : t('testManager.download')}
                          disabled={downloading && downloadingId === material.id}
                        >
                          <span className={`material-symbols-outlined text-xl cursor-pointer transition-transform duration-300 ${downloading && downloadingId === material.id ? 'animate-pulse' : ''}`}>
                            download
                          </span>
                        </button>
                        {downloading && downloadingId === material.id && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                            {downloadMessage || `${t('testManager.downloading')}... ${downloadProgress}%`}
                            <div className="w-16 bg-inverse-surface/50 rounded-full h-1 mt-1">
                              <div
                                className="bg-primary h-1 rounded-full transition-all duration-300"
                                style={{ width: `${downloadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(material.name)}
                        className="p-2 text-error hover:text-error/80 hover:bg-error-container/30 rounded-xl transition-colors duration-200"
                        title={t('testManager.delete')}
                      >
                        <span className="material-symbols-outlined text-xl cursor-pointer">delete</span>
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
        <div className="fixed inset-0 bg-shadow/50 flex items-center justify-center z-50">
          <div className="bg-surface-container-lowest rounded-xl p-6 max-w-md w-full mx-4 modal-3d-enter">
            <h3 className="text-lg font-semibold text-on-surface mb-4">{t('testManager.editMaterial')}</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">{t('testManager.fileName')}</label>
                <input
                  type="text"
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t('testManager.enterFileName')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">{t('testManager.course')}</label>
                <select
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                  className="cursor-pointer w-full px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{t('testManager.selectCourse')}</option>
                  <option value="Mathematics">{t('courses.mathematics')}</option>
                  <option value="Physics">{t('courses.physics')}</option>
                  <option value="Chemistry">{t('courses.chemistry')}</option>
                  <option value="Biology">{t('courses.biology')}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMaterial(null);
                }}
                className="cursor-pointer px-4 py-2 text-on-surface-variant hover:text-on-surface"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={saveEdit}
                className="cursor-pointer px-4 py-2 bg-primary text-on-primary rounded-xl hover:bg-primary/90"
              >
                {t('testManager.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-shadow/50 flex items-center justify-center z-100">
          <div className="bg-surface-container-lowest rounded-xl p-6 max-w-4xl w-full mx-4 modal-3d-enter max-h-[90vh] overflow-y-auto">
            <h3 className="text-3xl font-extrabold text-on-surface mb-6 text-center">{t('testManager.analysisResults')}</h3>
            <div className="mb-6">
              <div className="space-y-6">
                {Array.isArray(editingAnalysis.analysis.questions) && editingAnalysis.analysis.questions.length > 0 ? (
                  editingAnalysis.analysis.questions.map((item, index) => (
                    <div key={item.id || index} className="border-b border-surface-variant pb-4 last:border-b-0">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-semibold text-on-surface">{t('testManager.question')} {index + 1}</h4>
                        <button
                          onClick={() => handleDeleteQuestion(index)}
                          className="cursor-pointer p-1 text-error hover:text-error/80 hover:bg-error-container/30 rounded-xl transition-colors duration-200"
                          title={t('testManager.deleteQuestion')}
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-on-surface-variant mb-2">
                          {t('testManager.questionLabel')}
                        </label>
                        <textarea
                          value={item.question || ''}
                          onChange={(e) => handleAnalysisChange(`analysis.questions.${index}.question`, e.target.value)}
                          className="w-full px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={3}
                        />
                      </div>

                      {Array.isArray(item.options) && item.options.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-on-surface-variant mb-2">
                            {t('testManager.optionsLabel')}
                          </label>
                          <div className="space-y-2">
                            {item.options.map((opt, optIdx) => (
                              <div key={`opt-${index}-${optIdx}`} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt || ''}
                                  onChange={(e) => handleAnalysisChange(`analysis.questions.${index}.options.${optIdx}`, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                  placeholder={`${t('testManager.option')} ${optIdx + 1}`}
                                />
                                <button
                                  type="button"
                                  className="cursor-pointer px-2 py-2 text-error hover:text-error/80 hover:bg-error-container/30 rounded-xl"
                                  onClick={() => {
                                    setEditingAnalysis(prev => {
                                      const next = { ...prev, analysis: { ...prev.analysis } };
                                      const arr = Array.isArray(next.analysis?.questions?.[index]?.options)
                                        ? [...next.analysis.questions[index].options]
                                        : [];
                                      arr.splice(optIdx, 1);
                                      next.analysis.questions[index] = { ...next.analysis.questions[index], options: arr };
                                      return next;
                                    });
                                  }}
                                  title={t('testManager.removeOption')}
                                >
                                  {t('testManager.remove')}
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            className="cursor-pointer mt-2 px-3 py-2 text-primary hover:text-primary/80 hover:bg-primary-container/30 rounded-xl"
                            onClick={() => {
                              setEditingAnalysis(prev => {
                                const next = { ...prev, analysis: { ...prev.analysis } };
                                const q = next.analysis?.questions?.[index] || {};
                                const arr = Array.isArray(q.options) ? [...q.options] : [];
                                arr.push('');
                                next.analysis.questions[index] = { ...q, options: arr };
                                return next;
                              });
                            }}
                          >
                            + {t('testManager.addOption')}
                          </button>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-2">
                          {t('testManager.answerLabel')}
                        </label>
                        <textarea
                          value={item.answer || ''}
                          onChange={(e) => handleAnalysisChange(`analysis.questions.${index}.answer`, e.target.value)}
                          className="w-full px-3 py-2 border border-surface-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-on-surface-variant py-8">
                    {t('testManager.noQuestionsFound')}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAnalysisModal(false);
                  setEditingAnalysis({});
                }}
                className="cursor-pointer px-4 py-2 text-on-surface-variant hover:text-on-surface"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSaveAnalysis}
                className="cursor-pointer px-4 py-2 bg-primary text-on-primary rounded-xl hover:bg-primary/90"
              >
                {t('testManager.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManager;
