import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title?: string;
  caption?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
  title,
  caption,
}) => {
  // Lock background body scroll when Lightbox modal is open
  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn text-white modal-backdrop-overlay overscroll-contain modal-scroll-content">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div>
          {title && <h3 className="font-serif text-lg sm:text-xl text-emerald-100">{title}</h3>}
          <span className="text-xs text-emerald-400 font-mono">
            IMAGE {currentIndex + 1} OF {images.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-3 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-800 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Display */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={title || 'Nursery Lightbox'}
          className="max-h-[80vh] max-w-full object-contain rounded-2xl border border-emerald-500/20 shadow-2xl transition-all duration-300"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
              className="absolute left-2 sm:left-6 p-3.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 hover:text-white hover:scale-110 transition-all shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => onNavigate((currentIndex + 1) % images.length)}
              className="absolute right-2 sm:right-6 p-3.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 hover:text-white hover:scale-110 transition-all shadow-2xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Caption & Thumbnails */}
      <div className="z-10 flex flex-col items-center gap-3">
        {caption && (
          <p className="text-xs sm:text-sm text-emerald-200/80 text-center max-w-2xl bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800/40 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{caption}</span>
          </p>
        )}

        {/* Thumbnail Bar */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto p-2 max-w-full">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-emerald-400 scale-105 shadow-lg shadow-emerald-500/30'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
