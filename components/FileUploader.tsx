import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type === 'application/pdf') {
      onFileSelect(file);
    } else {
      alert("Please upload a valid PDF document.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <label className="block text-sm font-medium text-gray-400 mb-1">Financial Report (PDF)</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-gem-500 bg-gem-900/20' 
            : 'border-slate-600 hover:border-gem-500 hover:bg-slate-800'
          }
          ${selectedFile ? 'bg-slate-800 border-gem-500' : 'bg-transparent'}
        `}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="application/pdf"
          onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])}
        />
        
        {selectedFile ? (
          <div className="animate-fade-in">
             <div className="mx-auto w-12 h-12 bg-gem-900/50 rounded-full flex items-center justify-center mb-3">
               <svg className="w-6 h-6 text-gem-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
             </div>
            <p className="text-white font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-xs text-gem-400 mt-2 hover:underline">Click to change</p>
          </div>
        ) : (
          <div>
            <div className="mx-auto w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-300 font-medium">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-500 mt-2">Annual or Quarterly Reports (PDF)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
