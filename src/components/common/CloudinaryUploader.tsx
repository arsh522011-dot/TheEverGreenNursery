import React, { useState } from 'react';
import { Upload, Link as LinkIcon, CheckCircle2, AlertCircle, X, Image as ImageIcon, Loader2, Cloud, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../../types';
import { StorageService } from '../../services/storage';

interface CloudinaryUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  siteSettings?: SiteSettings;
  className?: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  value,
  onChange,
  label = 'Image URL',
  placeholder = 'https://...',
  helpText,
  siteSettings,
  className = '',
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Get current site settings for Cloudinary config
  const settings = siteSettings || StorageService.getSettings();
  const cloudName = settings.cloudinaryCloudName || (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = settings.cloudinaryUploadPreset || (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  const isConfigured = Boolean(cloudName && uploadPreset);

  const handleFileUpload = async (file: File) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP, SVG, etc.)');
      return;
    }

    // Check size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit.');
      return;
    }

    if (!isConfigured) {
      // If Cloudinary isn't configured, fall back to base64 with a warning
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onChange(base64);
        setSuccessMessage('Image loaded (Base64). Connect Cloudinary in Admin Settings for high-speed CDN hosting!');
      };
      reader.readAsDataURL(file);
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      setUploadProgress(50);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to upload image to Cloudinary.');
      }

      setUploadProgress(100);
      const imageUrl = data.secure_url || data.url;
      onChange(imageUrl);
      setSuccessMessage('Successfully uploaded to Cloudinary CDN!');
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setErrorMessage(
        err.message || 'Cloudinary upload failed. Check your Cloud Name and Unsigned Upload Preset in Admin Settings.'
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-mono font-semibold text-emerald-900">
            {label}
          </label>
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            {isConfigured ? (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/60">
                <Cloud className="w-3 h-3 text-emerald-600" />
                Cloudinary: {cloudName}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Cloudinary Unconnected
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 text-xs font-mono border-b border-emerald-900/10 pb-1.5">
        <button
          type="button"
          onClick={() => setActiveMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
            activeMode === 'upload'
              ? 'bg-[#062319] text-emerald-300 font-semibold shadow-sm'
              : 'bg-emerald-900/5 text-emerald-800 hover:bg-emerald-900/10'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload File {isConfigured && '(Cloudinary)'}
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
            activeMode === 'url'
              ? 'bg-[#062319] text-emerald-300 font-semibold shadow-sm'
              : 'bg-emerald-900/5 text-emerald-800 hover:bg-emerald-900/10'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          Direct Image URL
        </button>
      </div>

      {/* Upload Mode Box */}
      {activeMode === 'upload' && (
        <div className="space-y-2">
          {!isConfigured && (
            <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-[11px]">Cloudinary settings not configured yet</p>
                <p className="text-[10px] text-amber-800 leading-normal">
                  Go to <strong className="font-mono text-amber-950">Admin Settings &gt; Cloudinary Configuration</strong> to enter your Cloud Name and Unsigned Upload Preset for automatic cloud hosting.
                </p>
              </div>
            </div>
          )}

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all relative ${
              isDragging
                ? 'border-emerald-600 bg-emerald-100/50 scale-[1.01]'
                : 'border-emerald-900/20 bg-[#faf8f5] hover:border-emerald-700/40 hover:bg-emerald-50/30'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />

            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <p className="text-xs font-mono font-semibold text-emerald-900">
                    Uploading image to Cloudinary...
                  </p>
                  <div className="w-48 bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                    <Cloud className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#062319]">
                      Drag and drop image file here, or <span className="text-emerald-700 underline">browse</span>
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      Supports PNG, JPG, WEBP, SVG (Max 10MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* URL Mode Box */}
      {activeMode === 'url' && (
        <div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => {
                onChange(e.target.value);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              placeholder={placeholder}
              className="w-full bg-[#faf8f5] border border-emerald-900/15 rounded-xl p-2.5 pr-8 text-xs font-mono text-emerald-950 focus:outline-none focus:border-emerald-600"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-2 text-gray-400 hover:text-gray-600 p-1"
                title="Clear URL"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error / Success feedback messages */}
      {errorMessage && (
        <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] flex items-center gap-1.5 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Image Preview Card */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-[#faf8f5] border border-emerald-900/10 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-emerald-900/10 border border-emerald-900/20 overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <ImageIcon className="w-5 h-5 text-gray-400 -z-10" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Current Image URL</p>
            <p className="text-xs font-mono text-emerald-900 truncate" title={value}>
              {value}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-emerald-100/60 text-emerald-800 hover:bg-emerald-100 text-xs"
              title="Open full image in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-rose-100/60 text-rose-700 hover:bg-rose-100 text-xs"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {helpText && <p className="text-[11px] text-gray-500 leading-tight">{helpText}</p>}
    </div>
  );
};
