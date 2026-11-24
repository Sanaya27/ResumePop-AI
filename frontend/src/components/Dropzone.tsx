import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { UploadResponse } from '../types';

interface DropzoneProps {
  onUploadSuccess?: (response: UploadResponse) => void;
  compact?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onUploadSuccess, compact = false }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    setErrorMessage(null);
    setUploadResult(null);
    const validPdfs = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (validPdfs.length < files.length) {
      setErrorMessage('Only PDF files are supported. Non-PDF files were skipped.');
    }
    setSelectedFiles(prev => [...prev, ...validPdfs]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setErrorMessage(null);
    setUploadResult(null);

    try {
      const res = await api.uploadResumes(selectedFiles);
      setUploadResult(res);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadSuccess) onUploadSuccess(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload and parse resumes');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-[3px] border-dashed rounded-card cursor-pointer transition-all ${
          isDragging
            ? 'border-pop-pink bg-pop-pink/10 scale-[1.01]'
            : 'border-pop-border bg-pop-surface hover:bg-pop-softYellow/30 hover:border-pop-pink'
        } ${compact ? 'p-6' : 'p-10'} text-center shadow-pop`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-pop-yellow border-2 border-pop-border shadow-pop-sm flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-pop-dark" />
          </div>

          <div>
            <h3 className="font-grotesk font-black text-xl text-pop-dark">
              Drag & Drop PDF Resumes
            </h3>
            <p className="font-mono text-xs text-pop-dark/70 mt-1">
              or <span className="text-pop-pink font-bold underline">browse files</span> from your computer
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-pop-dark/50">
            <span>Supports multiple PDF files</span>
            <span>•</span>
            <span>Real-time NLP parsing</span>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="card-pop p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-pop-border/20 pb-2">
            <span className="font-grotesk font-bold text-sm text-pop-dark">
              Selected Files ({selectedFiles.length})
            </span>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-xs font-mono text-pop-error hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-pop-blush border border-pop-border text-xs font-mono"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileText className="w-4 h-4 text-pop-pink shrink-0" />
                  <span className="font-bold truncate">{file.name}</span>
                  <span className="text-pop-dark/50 shrink-0">({formatFileSize(file.size)})</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="p-1 rounded-full hover:bg-pop-surface text-pop-dark/60 hover:text-pop-error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleProcess}
            disabled={uploading}
            className="btn-primary w-full py-3 text-base gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Extraction Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Extract & Process {selectedFiles.length} Resume{selectedFiles.length > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-pink-100 border-2 border-pop-error text-pop-error font-mono text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {uploadResult && (
        <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-600 text-emerald-950 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Successfully extracted {uploadResult.uploaded_count} resume{uploadResult.uploaded_count > 1 ? 's' : ''}!</span>
          </div>
          <div className="space-y-1 pl-7">
            {uploadResult.results.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-bold">{r.candidate_name}</span>
                <span className="text-emerald-800">({r.filename})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
