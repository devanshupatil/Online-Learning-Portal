import React, { useState, useCallback, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  X,
  Move
} from 'lucide-react';

const ImageViewer = ({
  fileUrl,
  fileName,
  onClose,
  onDownload,
  className = ''
}) => {
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleImageLoad = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  const handleImageError = useCallback(() => {
    setError('Failed to load image');
    setLoading(false);
  }, []);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 5.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.1));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'image.jpg';
      link.click();
    }
  };

  const resetView = () => {
    setScale(1.0);
    setRotation(0);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = useCallback((event) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y
      });
    }
  }, [scale, dragOffset]);

  const handleMouseMove = useCallback((event) => {
    if (isDragging) {
      setDragOffset({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case '+':
      case '=':
        event.preventDefault();
        handleZoomIn();
        break;
      case '-':
        event.preventDefault();
        handleZoomOut();
        break;
      case 'r':
      case 'R':
        event.preventDefault();
        handleRotate();
        break;
      case '0':
        event.preventDefault();
        resetView();
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  }, [onClose]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleKeyDown, handleMouseMove, handleMouseUp]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-red-500 mb-4">
          <X size={48} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Image</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-gray-100 ${className}`}>
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate max-w-md">
            {fileName || 'Image'}
          </h3>
          <span className="text-sm text-gray-600">
            {Math.round(scale * 100)}%
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.1}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
            title="Zoom out (-)"
          >
            <ZoomOut size={20} />
          </button>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 5.0}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
            title="Zoom in (+)"
          >
            <ZoomIn size={20} />
          </button>

          {/* Rotate */}
          <button
            onClick={handleRotate}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            aria-label="Rotate image"
            title="Rotate (R)"
          >
            <RotateCw size={20} />
          </button>

          {/* Reset view */}
          <button
            onClick={resetView}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            aria-label="Reset view"
            title="Reset view (0)"
          >
            <Move size={20} />
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            aria-label="Download image"
          >
            <Download size={20} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
            aria-label="Close viewer"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Image content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative cursor-move"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default' }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading image...</span>
          </div>
        )}

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          }}
        >
          <img
            ref={imageRef}
            src={fileUrl}
            alt={fileName || 'Image'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="max-w-none select-none"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              maxWidth: 'none',
              maxHeight: 'none',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Footer with instructions */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="text-sm text-gray-600 text-center">
          <span className="font-medium">Controls:</span> Use mouse to drag when zoomed in.
          Keyboard: <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">+</kbd>/<kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">-</kbd> zoom,
          <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">R</kbd> rotate,
          <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">0</kbd> reset,
          <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> close
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;