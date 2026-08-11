import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { Maximize2, Sparkles } from 'lucide-react';

interface GalleryViewProps {
  gallery: GalleryItem[];
  onOpenLightbox: (images: string[], index: number, title?: string, caption?: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ gallery, onOpenLightbox }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Nursery', 'Indoor Plants', 'Outdoor Garden', 'Landscaping', 'Rare Flora'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-700 block">
            VISUAL SANCTUARY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#062319] font-light">
            Nursery & Estate Photography
          </h1>
          <p className="text-sm text-emerald-900/70 leading-relaxed">
            Take a visual tour through our 15-acre glasshouse domes, mature specimen groves, and completed landscape gardens.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-[#062319] text-emerald-300 shadow-md'
                  : 'bg-white text-emerald-900 border border-emerald-900/10 hover:bg-emerald-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() =>
                onOpenLightbox(
                  filteredGallery.map((g) => g.image),
                  idx,
                  item.title,
                  item.caption
                )
              }
              data-cursor="VIEW"
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-emerald-950/10 bg-black/5"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062319]/90 via-[#062319]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  {item.category}
                </span>
                <h3 className="font-serif text-xl text-white">{item.title}</h3>
                <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2">{item.caption}</p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand Fullscreen</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
