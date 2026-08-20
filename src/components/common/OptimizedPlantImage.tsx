import React, { useState, useEffect } from 'react';
import { ImageCache } from '../../services/imageCache';

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
  fallbackSrc = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
  onClick,
}) => {
  const effectiveSrc = src && src.trim() ? src.trim() : fallbackSrc;
  const effectiveHoverSrc = hoverSrc && hoverSrc.trim() && hoverSrc.trim() !== effectiveSrc ? hoverSrc.trim() : null;

  const isDataUrl = effectiveSrc.startsWith('data:image/');
  const isAlreadyLoaded = isDataUrl || loadedUrlsSession.has(effectiveSrc) || ImageCache.isPreloaded(effectiveSrc);

  const [isLoaded, setIsLoaded] = useState<boolean>(isAlreadyLoaded);
  const [currentSrc, setCurrentSrc] = useState<string>(effectiveSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [hoverLoaded, setHoverLoaded] = useState<boolean>(false);

  useEffect(() => {
    const nextSrc = src && src.trim() ? src.trim() : fallbackSrc;
    const isNextDataUrl = nextSrc.startsWith('data:image/');
    setCurrentSrc(nextSrc);
    setHasError(false);

    if (isNextDataUrl || loadedUrlsSession.has(nextSrc) || ImageCache.isPreloaded(nextSrc)) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
      ImageCache.preloadImages([nextSrc]);

      const safetyTimer = setTimeout(() => {
        setIsLoaded(true);
      }, 250);
      return () => clearTimeout(safetyTimer);
    }

    if (effectiveHoverSrc) {
      ImageCache.preloadImages([effectiveHoverSrc]);
    }
  }, [src, fallbackSrc, effectiveHoverSrc]);

  const handleLoad = () => {
    if (currentSrc) loadedUrlsSession.add(currentSrc);
    setIsLoaded(true);
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
      setIsLoaded(true);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-emerald-950/5 ${className}`}
      onClick={onClick}
    >
      {/* Subtle botanical shimmer while image is decoding on slow connections */}
      {!isLoaded && !hasError && !isDataUrl && (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 via-emerald-800/5 to-emerald-900/15 animate-pulse pointer-events-none" />
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
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded || isDataUrl ? 'opacity-100' : 'opacity-0'
        } ${effectiveHoverSrc ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'} ${imgClassName}`}
      />

      {/* Secondary Hover Image with smooth crossfade and zoom transition */}
      {effectiveHoverSrc && (
        <img
          src={effectiveHoverSrc}
          alt={`${alt} alternate view`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setHoverLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out pointer-events-none opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105 ${
            hoverLoaded ? '' : 'blur-xs'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};

