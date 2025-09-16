// FileTypeHandler.js - Utility for detecting and handling different file types

export const SUPPORTED_FILE_TYPES = {
  PDF: 'pdf',
  IMAGE: 'image',
  UNSUPPORTED: 'unsupported'
};

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
export const PDF_EXTENSIONS = ['pdf'];

/**
 * Detects file type based on file extension or MIME type
 * @param {string} fileName - The name of the file
 * @param {string} mimeType - The MIME type of the file (optional)
 * @returns {string} - The detected file type
 */
export const detectFileType = (fileName, mimeType = '') => {
  if (!fileName) return SUPPORTED_FILE_TYPES.UNSUPPORTED;

  const extension = fileName.split('.').pop()?.toLowerCase();

  // Check by MIME type first
  if (mimeType) {
    if (mimeType === 'application/pdf') {
      return SUPPORTED_FILE_TYPES.PDF;
    }
    if (mimeType.startsWith('image/')) {
      return SUPPORTED_FILE_TYPES.IMAGE;
    }
  }

  // Check by file extension
  if (PDF_EXTENSIONS.includes(extension)) {
    return SUPPORTED_FILE_TYPES.PDF;
  }

  if (IMAGE_EXTENSIONS.includes(extension)) {
    return SUPPORTED_FILE_TYPES.IMAGE;
  }

  return SUPPORTED_FILE_TYPES.UNSUPPORTED;
};

/**
 * Checks if a file type is supported
 * @param {string} fileType - The file type to check
 * @returns {boolean} - Whether the file type is supported
 */
export const isFileTypeSupported = (fileType) => {
  return Object.values(SUPPORTED_FILE_TYPES).includes(fileType) &&
         fileType !== SUPPORTED_FILE_TYPES.UNSUPPORTED;
};

/**
 * Gets the appropriate viewer component for a file type
 * @param {string} fileType - The detected file type
 * @returns {string} - The name of the viewer component
 */
export const getViewerComponent = (fileType) => {
  switch (fileType) {
    case SUPPORTED_FILE_TYPES.PDF:
      return 'PDFViewer';
    case SUPPORTED_FILE_TYPES.IMAGE:
      return 'ImageViewer';
    default:
      return null;
  }
};

/**
 * Gets file type display information
 * @param {string} fileType - The file type
 * @returns {object} - Display information for the file type
 */
export const getFileTypeInfo = (fileType) => {
  switch (fileType) {
    case SUPPORTED_FILE_TYPES.PDF:
      return {
        label: 'PDF Document',
        icon: 'FileText',
        color: 'text-red-600'
      };
    case SUPPORTED_FILE_TYPES.IMAGE:
      return {
        label: 'Image',
        icon: 'Image',
        color: 'text-blue-600'
      };
    default:
      return {
        label: 'Unsupported File',
        icon: 'FileX',
        color: 'text-gray-600'
      };
  }
};