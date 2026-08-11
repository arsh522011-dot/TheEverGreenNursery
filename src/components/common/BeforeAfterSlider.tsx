import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  afterImage,
  afterLabel = 'COMPLETED LANDSCAPE WORK',
}) => {
  return (
    <div className="relative w-full h-[360px] sm:h-[480px] md:h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20 select-none group">
      <img
        src={afterImage}
        alt="Completed Landscape Work"
        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      <span className="absolute top-4 right-4 bg-[#062319]/85 text-emerald-300 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30 shadow-lg flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>{afterLabel}</span>
      </span>
      <div className="absolute bottom-4 left-4 bg-black/60 text-white backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-mono font-medium flex items-center gap-2 border border-white/20">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>100% Completed Work</span>
      </div>
    </div>
  );
};

