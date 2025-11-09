import React, { useState, useCallback, useRef } from 'react';
import { FolderIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (files: FileList) => void;
  isLoading: boolean;
}

const ACCEPTED_FILES = ".pdf,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.csv";

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, [isLoading]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isLoading) {
      onFileSelect(e.dataTransfer.files);
    }
  }, [isLoading, onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isLoading) {
      onFileSelect(e.target.files);
    }
  };
  
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center">
      <input
        ref={fileInputRef}
        type="file"
        id="file-upload"
        className="hidden"
        accept={ACCEPTED_FILES}
        onChange={handleChange}
        disabled={isLoading}
        multiple
      />
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300
          ${isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-300 hover:border-blue-400 bg-slate-50'}`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <FolderIcon className="w-16 h-16 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <p className="text-lg text-slate-600">
            Déposez vos fichiers ici ou <span className="font-semibold text-blue-600">cliquez pour les importer</span>
          </p>
        </div>
      </div>
       <p className="text-xs text-slate-500 mt-4">Formats acceptés : PDF, DOCX, XLSX, CSV, JPG, PNG, TXT</p>
    </div>
  );
};