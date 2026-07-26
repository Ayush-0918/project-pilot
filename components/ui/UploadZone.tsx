import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { cn } from '@/lib/utils';

export interface UploadZoneProps {
  onFileSelect: (fileName: string, url: string) => void;
  onClear?: () => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  initialFileName?: string | null;
  endpoint?: 'avatarUploader' | 'resumeUploader';
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  onClear,
  acceptedTypes = ['.pdf', '.docx', '.txt'],
  maxSizeMB = 5,
  initialFileName = null,
  endpoint = 'resumeUploader',
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(initialFileName);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing(endpoint as keyof OurFileRouter, {
    onClientUploadComplete: (res: { url: string; name?: string }[]) => {
      if (res?.[0]?.url) {
        onFileSelect(res[0].name || 'resume', res[0].url);
        setFileName(res[0].name || 'resume');
      }
      setIsUploading(false);
    },
    onUploadError: (err: Error) => {
      setError(err.message || 'Upload failed');
      setFileName(null);
      setIsUploading(false);
    },
  });

  const processFile = async (file: File) => {
    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      setError(`Invalid file type. Supported formats: ${acceptedTypes.join(', ')}`);
      return;
    }

    setIsUploading(true);
    setFileName(file.name);
    await startUpload([file]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onClear) onClear();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept={acceptedTypes.join(',')}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {fileName && !isUploading ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full glass-panel p-5 rounded-2xl flex items-center justify-between"
style={{
  border: "1px solid rgba(16,185,129,0.30)",
}}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl"
style={{
  backgroundColor: "rgba(16,185,129,0.10)",
  color: "#34d399",
}}>
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold line-clamp-1"
style={{ color: "var(--text-primary)" }}>{fileName}</h4>
                <p className="text-xs"
style={{ color: "var(--text-muted)" }}>Resume uploaded successfully</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle
  className="w-5 h-5"
  style={{ color: "#34d399" }}
/>
              <button
                type="button"
                onClick={clearFile}
                className="p-1 rounded-lg transition-colors cursor-pointer"
style={{
  color: "var(--text-muted)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = "var(--hover-bg)";
  e.currentTarget.style.color = "var(--text-primary)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = "transparent";
  e.currentTarget.style.color = "var(--text-muted)";
}}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full glass-panel p-5 rounded-2xl flex items-center justify-center space-x-3"
          >
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            <span className="text-sm text-slate-300">Uploading resume...</span>
          </motion.div>
        ) : (
          <motion.div
            key="uploading"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full glass-panel border-dashed border-2 p-8 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300"
style={{
  borderColor: isDragActive
    ? "var(--color-primary)"
    : "var(--border-subtle)",
  backgroundColor: isDragActive
    ? "rgba(var(--color-primary-rgb),0.05)"
    : "transparent",
}}
onMouseEnter={(e) => {
  if (!isDragActive) {
    e.currentTarget.style.backgroundColor = "var(--hover-bg)";
    e.currentTarget.style.borderColor = "var(--border-medium)";
  }
}}
onMouseLeave={(e) => {
  if (!isDragActive) {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.borderColor = "var(--border-subtle)";
  }
}}
          >
            <div className={cn(
  "p-4 rounded-full mb-4 transition-all duration-300",
  isDragActive && "scale-110"
)}
style={{
  backgroundColor: isDragActive
    ? "rgba(var(--color-primary-rgb),0.20)"
    : "var(--hover-bg)",
  color: isDragActive
    ? "var(--color-primary)"
    : "var(--text-muted)",
}}>
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold mb-1"
style={{ color: "var(--text-primary)" }}>
              Drag and drop your resume here, or <span
  style={{ color: "var(--color-primary)" }}
  className="hover:underline"
>browse</span>
            </h3>
            <p className="text-xs mb-2"
style={{ color: "var(--text-muted)" }}>
              Supported formats: {acceptedTypes.join(', ')} (Max {maxSizeMB}MB)
            </p>
            {error && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-medium mt-2 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
