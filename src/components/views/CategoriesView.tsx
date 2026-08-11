import React from 'react';
import { Category } from '../../types';
import { ArrowRight, Sprout } from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ categories, onNavigate }) => {
  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-700 block">
            BOTANICAL FAMILIES
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#062319] font-light">
            Plant Categories & Taxonomy
          </h1>
          <p className="text-sm text-emerald-900/70 leading-relaxed">
            Discover plants sorted by growth habit, light requirement, and aesthetic scale. Select any category to view available nursery specimens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('plants', { category: cat.name })}
              data-cursor="EXPLORE"
              className="group relative h-96 rounded-3xl overflow-hidden shadow-lg border border-emerald-950/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062319] via-[#062319]/30 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                <span className="self-start px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/30 text-[10px] font-mono tracking-wider text-emerald-300 uppercase backdrop-blur-md">
                  {cat.plantCount ? `${cat.plantCount} Species` : 'Available'}
                </span>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-white group-hover:text-emerald-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-emerald-200/80 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                    <span>Explore Family</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
