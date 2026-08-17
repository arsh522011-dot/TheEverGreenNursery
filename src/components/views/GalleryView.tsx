import React, { useState, useMemo } from 'react';
import { GalleryItem, Plant } from '../../types';
import { Maximize2, Sparkles, Image as ImageIcon } from 'lucide-react';

interface GalleryViewProps {
  gallery: GalleryItem[];
  plants?: Plant[];
  onOpenLightbox: (images: string[], index: number, title?: string, caption?: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ gallery, plants = [], onOpenLightbox }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Combine gallery items and all plant specimen photos dynamically
  const allGalleryItems = useMemo(() => {
    const items: GalleryItem[] = [...gallery];
    
    // Also include plant specimen photos so all plant photos added in admin appear in gallery
    plants.forEach((plant) => {
      if (plant.images && Array.isArray(plant.images)) {
        plant.images.forEach((imgUrl, imgIdx) => {
          if (imgUrl && !items.some((it) => it.image === imgUrl)) {
            items.push({
              id: `plant-photo-${plant.id}-${imgIdx}`,
              title: plant.name,
              category: (plant.category || 'Plant Specimens') as any,
              image: imgUrl,
              caption: `${plant.scientificName} • ${plant.shortDescription || 'Botanical specimen photo'}`,
            });
          }
        });
      }
    });

    return items;
  }, [gallery, plants]);

  // Dynamically compute category filters from all available items
  const dynamicCategories = useMemo(() => {
    const catSet = new Set<string>();
    catSet.add('All');
    allGalleryItems.forEach((item) => {
      if (item.category && item.category.trim()) {
        catSet.add(item.category.trim());
      }
    });
    return Array.from(catSet);
  }, [allGalleryItems]);

  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'All') return allGalleryItems;
    return allGalleryItems.filter(
      (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [allGalleryItems, selectedCategory]);

  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-700 block font-bold">
            VISUAL SANCTUARY • LIVE GALLERY ({allGalleryItems.length} PHOTOS)
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#062319] font-light">
            Nursery & Plant Photography
          </h1>
          <p className="text-sm text-emerald-900/70 leading-relaxed">
            Explore our living nursery collections, tropical specimen photography, master landscaping installations, and architectural plants.
          </p>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#062319] text-emerald-300 shadow-md font-bold'
                  : 'bg-white text-emerald-900 border border-emerald-900/10 hover:bg-emerald-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Grid (Unlimited Images, Dynamic Rendering) */}
        {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                className="group relative h-80 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-emerald-950/10 bg-black/5 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062319]/90 via-[#062319]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg text-white font-bold">{item.title}</h3>
                  {item.caption && (
                    <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand Fullscreen</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-emerald-900/10 p-8 space-y-4 max-w-lg mx-auto">
            <ImageIcon className="w-12 h-12 text-emerald-600 mx-auto opacity-70" />
            <h3 className="font-serif text-2xl text-[#062319]">No Photos in this Category</h3>
            <p className="text-xs text-emerald-800">
              Select another category or browse all nursery photos above.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-6 py-2.5 rounded-full bg-[#062319] text-emerald-300 text-xs font-semibold uppercase tracking-wider"
            >
              View All Photos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
