import React, { useState, useEffect } from 'react';
import { ImageCache } from '../../services/imageCache';
import { optimizeImageUrl } from '../../utils/imageCompressor';
import { Sprout } from 'lucide-react';

interface OptimizedPlantImageProps {
  src: string;
  hoverSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  fallbackSrc?: string;
  onClick?: () => void;
}

// Global set of URLs successfully loaded in this session for instantaneous 0ms display on repeat renders
const loadedUrlsSession = new Set<string>();

export const OptimizedPlantImage: React.FC<OptimizedPlantImageProps> = ({
  src,
  hoverSrc,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  fallbackSrc = '',
  onClick,
}) => {
  const rawSrc = src && src.trim() ? src.trim() : (fallbackSrc && fallbackSrc.trim() ? fallbackSrc.trim() : '');
  const optimizedSrc = optimizeImageUrl(rawSrc, priority ? 1200 : 800);
  
  const rawHoverSrc = hoverSrc && hoverSrc.trim() && hoverSrc.trim() !== rawSrc ? hoverSrc.trim() : null;
  const optimizedHoverSrc = rawHoverSrc ? optimizeImageUrl(rawHoverSrc, 800) : null;

  const isDataUrl = optimizedSrc.startsWith('data:image/') || optimizedSrc.startsWith('blob:');
  const isAlreadyLoaded = !optimizedSrc || isDataUrl || loadedUrlsSession.has(optimizedSrc) || ImageCache.isPreloaded(optimizedSrc);

  const [isLoaded, setIsLoaded] = useState<boolean>(isAlreadyLoaded);
  const [currentSrc, setCurrentSrc] = useState<string>(optimizedSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [hoverLoaded, setHoverLoaded] = useState<boolean>(false);

  useEffect(() => {
    const nextRaw = src && src.trim() ? src.trim() : (fallbackSrc && fallbackSrc.trim() ? fallbackSrc.trim() : '');
    const nextOptimized = optimizeImageUrl(nextRaw, priority ? 1200 : 800);
    const isNextDataUrl = nextOptimized.startsWith('data:image/') || nextOptimized.startsWith('blob:');

    setCurrentSrc(nextOptimized);
    setHasError(false);

    if (!nextOptimized) {
      setIsLoaded(true);
      return;
    }

    if (isNextDataUrl || loadedUrlsSession.has(nextOptimized) || ImageCache.isPreloaded(nextOptimized)) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
      ImageCache.preloadImages([nextOptimized]);

      // Ultra-fast safety reveal (max 150ms) so users never wait on blank boxes
      const safetyTimer = setTimeout(() => {
        setIsLoaded(true);
      }, 150);
      return () => clearTimeout(safetyTimer);
    }

    if (optimizedHoverSrc) {
      ImageCache.preloadImages([optimizedHoverSrc]);
    }
  }, [src, fallbackSrc, optimizedHoverSrc, priority]);

  const handleLoad = () => {
    if (currentSrc) loadedUrlsSession.add(currentSrc);
    setIsLoaded(true);
  };

  const handleError = () => {
    if (fallbackSrc && fallbackSrc.trim() && currentSrc !== optimizeImageUrl(fallbackSrc.trim(), 800)) {
      setCurrentSrc(optimizeImageUrl(fallbackSrc.trim(), 800));
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  // If no source or image errored out, render an elegant botanical placeholder instead of random stock images
  if (!currentSrc || hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#072418] via-[#0b3826] to-[#041911] flex flex-col items-center justify-center p-4 text-center ${className}`}
        onClick={onClick}
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
          <Sprout className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-serif text-emerald-200/80 line-clamp-1 max-w-[90%] font-medium">
          {alt || 'The Evergreen Nursery'}
        </span>
        <span className="text-[9px] font-mono text-emerald-400/50 uppercase tracking-widest mt-0.5">
          Specimen Photo
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-emerald-950/10 ${className}`}
      onClick={onClick}
    >
      {/* Subtle botanical shimmer while image is decoding */}
      {!isLoaded && !hasError && !isDataUrl && (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/15 via-emerald-800/5 to-emerald-900/20 animate-pulse pointer-events-none" />
      )}

      {/* Primary Image */}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority || isDataUrl ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ease-out ${
          isLoaded || isDataUrl ? 'opacity-100' : 'opacity-0'
        } ${optimizedHoverSrc ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'} transition-transform duration-500 ${imgClassName}`}
      />

      {/* Secondary Hover Image with smooth crossfade and zoom transition */}
      {optimizedHoverSrc && (
        <img
          src={optimizedHoverSrc}
          alt={`${alt} alternate view`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setHoverLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out pointer-events-none opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105 ${
            hoverLoaded ? '' : 'blur-xs'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};
