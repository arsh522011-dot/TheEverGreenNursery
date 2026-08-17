import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Sun,
  Droplets,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import { Plant, Category, FilterState } from '../../types';

interface PlantsCatalogueViewProps {
  plants: Plant[];
  categories: Category[];
  initialCategory?: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenEnquiry: (plant: Plant) => void;
}

export const PlantsCatalogueView: React.FC<PlantsCatalogueViewProps> = ({
  plants,
  categories,
  initialCategory,
  onNavigate,
  onOpenEnquiry,
}) => {
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    category: initialCategory || 'All',
    sunlight: 'All',
    water: 'All',
    difficulty: 'All',
    size: 'All',
    isFeaturedOnly: false,
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (initialCategory) {
      setFilterState((prev) => ({ ...prev, category: initialCategory }));
    } else {
      setFilterState((prev) => ({ ...prev, category: 'All' }));
    }
  }, [initialCategory]);

  // Filter logic
  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      // Search
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase();
        const matchesName = plant.name.toLowerCase().includes(q);
        const matchesSci = plant.scientificName.toLowerCase().includes(q);
        const matchesCat = plant.category.toLowerCase().includes(q);
        const matchesDesc = plant.shortDescription.toLowerCase().includes(q);
        if (!matchesName && !matchesSci && !matchesCat && !matchesDesc) return false;
      }

      // Category
      if (filterState.category !== 'All') {
        if (!plant.category.toLowerCase().includes(filterState.category.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [plants, filterState]);

  const resetFilters = () => {
    setFilterState({
      searchQuery: '',
      category: 'All',
      sunlight: 'All',
      water: 'All',
      difficulty: 'All',
      size: 'All',
      isFeaturedOnly: false,
    });
  };

  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="relative bg-[#183925] text-white p-8 sm:p-10 rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785825477/ChatGPT_Image_Aug_4_2026_12_03_18_PM_ilzwov.png"
              alt="Botanical Catalogue Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#183925]/92 via-[#183925]/80 to-[#183925]/88 backdrop-brightness-90" />
          </div>

          <div className="relative z-10 space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-emerald-300 block drop-shadow-xs">
              COMPLETE BOTANICAL CATALOGUE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold drop-shadow-md">
              Explore Our Living Collection
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed drop-shadow-xs">
              Browse our hand-reared tropical specimens, architectural landscape trees, flowering bulbs, and artisanal pots.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => onNavigate('bulk-orders')}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>Need Bulk Plants? (Inquiry)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-600" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => setFilterState({ ...filterState, searchQuery: e.target.value })}
              placeholder="Search plant name, pots, or taxonomy..."
              className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl pl-10 pr-4 py-2 text-sm text-[#062319] placeholder-emerald-800/50 focus:outline-none focus:border-emerald-600"
            />
            {filterState.searchQuery && (
              <button
                onClick={() => setFilterState({ ...filterState, searchQuery: '' })}
                className="absolute right-3 top-3 text-xs text-emerald-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setFilterState({ ...filterState, category: 'All' })}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterState.category === 'All'
                ? 'bg-[#062319] text-emerald-300 shadow-sm'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-emerald-900/10'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterState({ ...filterState, category: cat.name })}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterState.category.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-[#062319] text-emerald-300 shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 border border-emerald-900/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Full-Width Plant Grid */}
        <div className="w-full">
          {filteredPlants.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredPlants.map((plant) => (
                <div
                  key={plant.id}
                  data-cursor="VIEW"
                  className={`group bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex ${
                    viewMode === 'grid' ? 'flex-col justify-between' : 'flex-col sm:flex-row items-center p-4 gap-6'
                  }`}
                >
                  <div
                    className={`relative overflow-hidden cursor-pointer ${
                      viewMode === 'grid' ? 'h-64 w-full' : 'h-40 w-full sm:w-48 shrink-0 rounded-2xl'
                    }`}
                    onClick={() => onNavigate('plant-detail', { id: plant.id })}
                  >
                    <img
                      src={plant.images[0]}
                      alt={plant.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#062319]/80 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      {plant.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 space-y-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => onNavigate('plant-detail', { id: plant.id })}
                    >
                      <h3 className="font-serif text-xl text-[#062319] group-hover:text-emerald-700 transition-colors">
                        {plant.name}
                      </h3>
                      <p className="text-xs italic text-emerald-800 font-mono mt-0.5">
                        {plant.scientificName}
                      </p>
                    </div>

                    <p className="text-xs text-emerald-950/70 line-clamp-2 leading-relaxed">
                      {plant.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-emerald-900/80 pt-1">
                      <span className="flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        {plant.sunlight}
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                        {plant.water}
                      </span>
                    </div>
                  </div>

                  <div className={`p-5 pt-0 flex gap-2 ${viewMode === 'list' ? 'sm:pt-5 sm:pl-0 shrink-0' : ''}`}>
                    <button
                      onClick={() => onNavigate('plant-detail', { id: plant.id })}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#062319] text-emerald-200 text-xs font-semibold uppercase tracking-wider hover:bg-emerald-900 transition-colors"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => onOpenEnquiry(plant)}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 transition-colors"
                      title="Enquire via WhatsApp"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border border-emerald-900/10 p-8 space-y-4">
              <Sparkles className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-2xl text-[#062319]">No Plants Matched Your Search</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Try searching for another plant or selecting a different category.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-full bg-[#062319] text-emerald-300 text-xs font-semibold uppercase tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
