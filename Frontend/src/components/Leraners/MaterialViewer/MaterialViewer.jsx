import React, { useEffect } from 'react';
import { X, AlertCircle, FileX } from 'lucide-react';
import PDFViewer from './PDFViewer';
import ImageViewer from './ImageViewer';
import { detectFileType, isFileTypeSupported, getFileTypeInfo } from './FileTypeHandler';

const MaterialViewer = ({
  fileUrl,
  fileName,
  fileType: providedFileType,
  onClose,
  isOpen,
  className = ''
}) => {
  const detectedFileType = detectFileType(fileName, providedFileType);
  const isSupported = isFileTypeSupported(detectedFileType);
  const fileTypeInfo = getFileTypeInfo(detectedFileType);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ${className}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="material-viewer-title"
      aria-describedby="material-viewer-description"
    >
      <div
        className="relative w-full h-full max-w-7xl max-h-screen bg-white rounded-lg shadow-2xl overflow-hidden transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button in top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-110"
          aria-label="Close viewer"
        >
          <X size={24} />
        </button>

        {/* Main content */}
        <div className="w-full h-full">
          {isSupported ? (
            <>
              {detectedFileType === 'pdf' && (
                <PDFViewer
                  fileUrl={fileUrl}
                  fileName={fileName}
                  onClose={onClose}
                  onDownload={handleDownload}
                  className="w-full h-full"
                />
              )}

              {detectedFileType === 'image' && (
                <ImageViewer
                  fileUrl={fileUrl}
                  fileName={fileName}
                  onClose={onClose}
                  onDownload={handleDownload}
                  className="w-full h-full"
                />
              )}
            </>
          ) : (
            /* Unsupported file type view */
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="mb-6">
                <FileX size={64} className="text-gray-400 mx-auto mb-4" />
                <h2 id="material-viewer-title" className="text-2xl font-bold text-gray-900 mb-2">
                  Unsupported File Type
                </h2>
                <p id="material-viewer-description" className="text-gray-600 mb-4">
                  This file type is not supported for inline viewing.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 max-w-md w-full mb-6">
                <div className="flex items-center mb-3">
                  <AlertCircle size={20} className="text-amber-500 mr-2" />
                  <span className="font-medium text-gray-900">File Information</span>
                </div>
                <div className="text-left space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {fileName || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {detectedFileType}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="cta-button px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <FileX size={20} className="mr-2" />
                  Download File
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Supported formats: PDF documents and images (JPG, PNG, GIF, WebP)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialViewer;