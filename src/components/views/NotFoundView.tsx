import React from 'react';
import { Sprout, Compass } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (view: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#062319] text-white min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-900/80 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl">
          <Sprout className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 block">
            BOTANICAL PATH NOT FOUND
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-emerald-100 font-light">
            Looks Like This Plant Hasn't Grown Here Yet
          </h1>
          <p className="text-xs text-emerald-300/80 leading-relaxed">
            The page or specimen you requested does not exist in our greenhouse catalogue.
          </p>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#062319] font-semibold text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-xl"
        >
          <Compass className="w-4 h-4" />
          <span>Return to Garden Sanctuary</span>
        </button>
      </div>
    </div>
  );
};
