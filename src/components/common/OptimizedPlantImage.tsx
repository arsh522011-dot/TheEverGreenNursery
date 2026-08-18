import React, { useState, useEffect } from 'react';
import { ImageCache } from '../../services/imageCache';

interface OptimizedPlantImageProps {
  src: string;
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
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  fallbackSrc = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
  onClick,
}) => {
  const effectiveSrc = src && src.trim() ? src.trim() : fallbackSrc;
  const isAlreadyLoaded = loadedUrlsSession.has(effectiveSrc) || ImageCache.isPreloaded(effectiveSrc);

  const [isLoaded, setIsLoaded] = useState<boolean>(isAlreadyLoaded);
  const [currentSrc, setCurrentSrc] = useState<string>(effectiveSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const nextSrc = src && src.trim() ? src.trim() : fallbackSrc;
    setCurrentSrc(nextSrc);
    setHasError(false);

    if (loadedUrlsSession.has(nextSrc) || ImageCache.isPreloaded(nextSrc)) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
      // Preload nextSrc in background
      ImageCache.preloadImages([nextSrc]);
    }
  }, [src, fallbackSrc]);

  const handleLoad = () => {
    loadedUrlsSession.add(currentSrc);
    setIsLoaded(true);
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
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
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 via-emerald-800/5 to-emerald-900/15 animate-pulse" />
      )}

      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};
