import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch devices or small screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check what element is hovered
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const card = target.closest('[data-cursor]');
      if (card) {
        const text = card.getAttribute('data-cursor') || 'VIEW';
        setIsHovered(true);
        setCursorText(text);
      } else if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovered(true);
        setCursorText('');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-50 transition-transform duration-100 ease-out hidden md:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
        className={`relative -top-1/2 -left-1/2 flex items-center justify-center rounded-full transition-all duration-300 ${
          cursorText
            ? 'w-20 h-20 bg-emerald-900/90 text-emerald-200 border border-emerald-400/50 shadow-2xl backdrop-blur-md scale-100'
            : isHovered
            ? 'w-12 h-12 bg-emerald-500/30 border border-emerald-400/80 backdrop-blur-sm scale-110'
            : 'w-5 h-5 bg-emerald-600/60 border border-white/50 shadow-md scale-100'
        }`}
      >
        {cursorText && (
          <span className="text-[10px] font-bold tracking-widest text-emerald-100 uppercase animate-pulse">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
