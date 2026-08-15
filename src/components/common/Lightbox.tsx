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
    <div
      id="image-lightbox-modal"
      onClick={(e) => {
        // If clicking the outer backdrop container, close the image page
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 md:p-8 animate-fadeIn text-white modal-backdrop-overlay overscroll-contain select-none"
    >
      {/* Top Header with Title, Counter and Prominent X Close Button */}
      <div className="flex items-center justify-between gap-4 z-20 w-full pt-1 pb-2">
        <div className="min-w-0 pr-4">
          {title ? (
            <h3 className="font-serif text-base sm:text-xl text-emerald-100 truncate max-w-md sm:max-w-xl">{title}</h3>
          ) : (
            <h3 className="font-serif text-base sm:text-xl text-emerald-100">Gallery Preview</h3>
          )}
          <span className="text-xs text-emerald-400 font-mono tracking-wider">
            IMAGE {currentIndex + 1} OF {images.length}
          </span>
        </div>

        {/* Prominent 'X' Cut / Close Button */}
        <button
          id="lightbox-close-btn"
          onClick={onClose}
          aria-label="Close image (Esc)"
          title="Close image (Esc)"
          className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/10 hover:bg-emerald-700 active:bg-emerald-800 text-white border border-white/25 hover:border-emerald-400 transition-all duration-200 shadow-2xl hover:scale-105 group shrink-0"
        >
          <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-emerald-100 group-hover:text-white">
            Close
          </span>
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300 group-hover:text-white transition-transform group-hover:rotate-90 duration-200" />
        </button>
      </div>

      {/* Main Image Display */}
      <div
        className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <img
          src={images[currentIndex]}
          alt={title || 'Nursery Lightbox'}
          className="max-h-[75vh] max-w-full object-contain rounded-2xl border border-emerald-500/20 shadow-2xl transition-all duration-300 pointer-events-auto"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              id="lightbox-prev-btn"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((currentIndex - 1 + images.length) % images.length);
              }}
              aria-label="Previous image"
              className="absolute left-2 sm:left-6 p-3 sm:p-3.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 hover:text-white hover:bg-emerald-800 hover:scale-110 active:scale-95 transition-all shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              id="lightbox-next-btn"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((currentIndex + 1) % images.length);
              }}
              aria-label="Next image"
              className="absolute right-2 sm:right-6 p-3 sm:p-3.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 hover:text-white hover:bg-emerald-800 hover:scale-110 active:scale-95 transition-all shadow-2xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Caption & Thumbnails */}
      <div className="z-10 flex flex-col items-center gap-3">
        {caption && (
          <p className="text-xs sm:text-sm text-emerald-200/90 text-center max-w-2xl bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-800/60 flex items-center gap-2 shadow-lg">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(idx);
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-emerald-400 scale-105 shadow-lg shadow-emerald-500/40'
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
