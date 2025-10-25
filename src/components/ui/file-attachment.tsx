import React from 'react';
import { Download } from 'lucide-react'; // fallback icon

export interface FileObject {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface FileAttachmentProps {
  file: FileObject;
  onDownload?: (file: FileObject) => void;
  className?: string;
}

/**
 * FileAttachment Component - Displays file preview with download functionality
 * Matches mockup style: preview card with icon, name, size, and download button
 */
export const FileAttachment: React.FC<FileAttachmentProps> = ({
  file,
  onDownload,
  className = '',
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDownload) {
      onDownload(file);
    } else {
      // Default download behavior
      window.open(file.url, '_blank');
    }
  };

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (type.includes('pdf')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  return (
    <div className={`bg-sky-900/20 border border-sky-400/30 rounded-lg p-3 flex items-center gap-3 max-w-sm ${className}`}>
      {/* File icon */}
      <div className="flex-shrink-0">
        {getFileIcon(file.type)}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-white truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-neutral-400">
          {formatSize(file.size)}
        </p>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="flex-shrink-0 p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700/50 rounded transition-colors"
        aria-label={`Download ${file.name}`}
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FileAttachment;
