import React, { useState, useEffect } from 'react';
import { ImageCache } from '../../services/imageCache';

interface OptimizedPlantImageProps {
  src: string;
  hoverSrc?: string | null;
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
  const effectiveMainSrc = src && src.trim() ? src.trim() : fallbackSrc;
  const isMainDataUrl = effectiveMainSrc.startsWith('data:image/');
  const isMainAlreadyLoaded = isMainDataUrl || loadedUrlsSession.has(effectiveMainSrc) || ImageCache.isPreloaded(effectiveMainSrc);

  const [isMainLoaded, setIsMainLoaded] = useState<boolean>(isMainAlreadyLoaded);
  const [currentMainSrc, setCurrentMainSrc] = useState<string>(effectiveMainSrc);
  const [hasMainError, setHasMainError] = useState<boolean>(false);

  // Hover image state
  const cleanHoverSrc = hoverSrc && hoverSrc.trim() && hoverSrc.trim() !== effectiveMainSrc ? hoverSrc.trim() : null;
  const isHoverAlreadyLoaded = cleanHoverSrc ? (cleanHoverSrc.startsWith('data:image/') || loadedUrlsSession.has(cleanHoverSrc) || ImageCache.isPreloaded(cleanHoverSrc)) : false;

  const [currentHoverSrc, setCurrentHoverSrc] = useState<string | null>(cleanHoverSrc);
  const [isHoverLoaded, setIsHoverLoaded] = useState<boolean>(isHoverAlreadyLoaded);
  const [hasHoverError, setHasHoverError] = useState<boolean>(false);

  useEffect(() => {
    const nextMainSrc = src && src.trim() ? src.trim() : fallbackSrc;
    const isNextMainDataUrl = nextMainSrc.startsWith('data:image/');
    setCurrentMainSrc(nextMainSrc);
    setHasMainError(false);

    if (isNextMainDataUrl || loadedUrlsSession.has(nextMainSrc) || ImageCache.isPreloaded(nextMainSrc)) {
      setIsMainLoaded(true);
    } else {
      setIsMainLoaded(false);
      ImageCache.preloadImages([nextMainSrc]);

      const safetyTimer = setTimeout(() => {
        setIsMainLoaded(true);
      }, 250);
      return () => clearTimeout(safetyTimer);
    }
  }, [src, fallbackSrc]);

  useEffect(() => {
    const nextHover = hoverSrc && hoverSrc.trim() && hoverSrc.trim() !== currentMainSrc ? hoverSrc.trim() : null;
    setCurrentHoverSrc(nextHover);
    setHasHoverError(false);

    if (nextHover) {
      if (nextHover.startsWith('data:image/') || loadedUrlsSession.has(nextHover) || ImageCache.isPreloaded(nextHover)) {
        setIsHoverLoaded(true);
      } else {
        setIsHoverLoaded(false);
        ImageCache.preloadImages([nextHover]);
      }
    } else {
      setIsHoverLoaded(false);
    }
  }, [hoverSrc, currentMainSrc]);

  const handleMainLoad = () => {
    if (currentMainSrc) loadedUrlsSession.add(currentMainSrc);
    setIsMainLoaded(true);
  };

  const handleMainError = () => {
    if (currentMainSrc !== fallbackSrc && fallbackSrc) {
      setCurrentMainSrc(fallbackSrc);
      setHasMainError(true);
      setIsMainLoaded(true);
    } else {
      setHasMainError(true);
      setIsMainLoaded(true);
    }
  };

  const handleHoverLoad = () => {
    if (currentHoverSrc) loadedUrlsSession.add(currentHoverSrc);
    setIsHoverLoaded(true);
  };

  const handleHoverError = () => {
    setHasHoverError(true);
    setIsHoverLoaded(false);
  };

  const canShowHover = Boolean(currentHoverSrc && !hasHoverError && isHoverLoaded);

  return (
    <div
      className={`relative overflow-hidden bg-emerald-950/5 select-none ${className}`}
      onClick={onClick}
    >
      {/* Subtle botanical shimmer while primary image is decoding on slow connections */}
      {!isMainLoaded && !hasMainError && !isMainDataUrl && (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 via-emerald-800/5 to-emerald-900/15 animate-pulse pointer-events-none" />
      )}

      {/* Main Image */}
      <img
        src={currentMainSrc}
        alt={alt}
        loading={priority || isMainDataUrl ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onLoad={handleMainLoad}
        onError={handleMainError}
        className={`w-full h-full object-cover transition-all duration-500 ease-out ${
          isMainLoaded || isMainDataUrl ? 'opacity-100' : 'opacity-0'
        } ${canShowHover ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'} ${imgClassName}`}
      />

      {/* Hover Image (Secondary) - Smooth fade-in on mouse hover */}
      {currentHoverSrc && !hasHoverError && (
        <img
          src={currentHoverSrc}
          alt={`${alt} - Alternate View`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={handleHoverLoad}
          onError={handleHoverError}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out pointer-events-none ${
            isHoverLoaded ? 'opacity-0 group-hover:opacity-100 group-hover:scale-105' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};

