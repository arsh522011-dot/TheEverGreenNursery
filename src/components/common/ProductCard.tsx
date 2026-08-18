import React from 'react';
import { Sun, Droplets } from 'lucide-react';
import { Plant } from '../../types';
import { ImageCache } from '../../services/imageCache';
import { OptimizedPlantImage } from './OptimizedPlantImage';

interface ProductCardProps {
  plant: Plant;
  index?: number;
  priority?: boolean;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenEnquiry: (plant: Plant) => void;
  className?: string;
}

const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80';

/**
 * Reusable Product Card Component
 * 
 * Automatically applies a 2-image hover fade transition to products across ALL categories
 * (ALL, INDOOR, OUTDOOR, POTS) when a hover image is available.
 * 
 * If only one image exists, gracefully displays the main image without errors or broken UI.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  plant,
  index = 0,
  priority = false,
  onNavigate,
  onOpenEnquiry,
  className = '',
}) => {
  const primaryImage = ImageCache.getPrimaryImageUrl(plant, DEFAULT_PLANT_IMAGE);
  const hoverImage = ImageCache.getHoverImageUrl(plant);

  return (
    <div
      data-cursor="VIEW"
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Fixed Image Container with 2-Image Hover Animation */}
        <div
          className="relative h-60 w-full overflow-hidden cursor-pointer bg-gray-50"
          onClick={() => onNavigate('plant-detail', { id: plant.id })}
        >
          <OptimizedPlantImage
            src={primaryImage}
            hoverSrc={hoverImage}
            alt={plant.name}
            priority={priority || index < 4}
            fallbackSrc={DEFAULT_PLANT_IMAGE}
            className="w-full h-full"
          />

          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold font-mono uppercase tracking-wider shadow z-10">
            {plant.category}
          </span>

          {/* Featured Badge */}
          {plant.isFeatured && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-mono font-extrabold uppercase shadow-xs z-10">
              ★ Featured
            </span>
          )}
        </div>

        {/* Plant / Product Information */}
        <div className="p-5 space-y-2">
          <div
            className="cursor-pointer"
            onClick={() => onNavigate('plant-detail', { id: plant.id })}
          >
            <h3 className="font-serif text-lg font-bold text-[#132e1f] group-hover:text-emerald-700 transition-colors line-clamp-1">
              {plant.name}
            </h3>
            <p className="text-xs italic text-gray-500 font-mono mt-0.5 line-clamp-1">
              {plant.scientificName}
            </p>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {plant.shortDescription || plant.description}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-gray-500 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{plant.sunlight}</span>
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{plant.water}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0 flex gap-2">
        <button
          onClick={() => onNavigate('plant-detail', { id: plant.id })}
          className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors cursor-pointer text-center"
        >
          Details
        </button>

        <button
          onClick={() => onOpenEnquiry(plant)}
          className="py-2 px-4 rounded-xl bg-[#183925] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer active:scale-95"
        >
          Enquire
        </button>
      </div>
    </div>
  );
};
