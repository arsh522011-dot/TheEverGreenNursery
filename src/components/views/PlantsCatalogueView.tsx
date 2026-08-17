import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Sun,
  Droplets,
  ArrowRight,
  X,
  Sparkles,
  Sprout,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Plant, Category, FilterState } from '../../types';

interface PlantsCatalogueViewProps {
  plants: Plant[];
  categories: Category[];
  initialCategory?: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenEnquiry: (plant: Plant) => void;
}

const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80';

// Robust category matcher that handles "Indoor", "Indoor Plants", synonyms, and botanical names
function isCategoryMatch(plant: Plant, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === 'All') return true;
  
  const sCat = selectedCategory.toLowerCase().trim();
  const pCat = (plant.category || '').toLowerCase().trim();
  const pName = (plant.name || '').toLowerCase().trim();
  const pSci = (plant.scientificName || '').toLowerCase().trim();

  // Exact match or substring match in either direction
  if (pCat === sCat || pCat.includes(sCat) || sCat.includes(pCat)) {
    return true;
  }

  // Indoor Matchers
  const isIndoorFilter = sCat.includes('indoor') || sCat.includes('living decor') || sCat.includes('interior');
  if (isIndoorFilter) {
    if (
      pCat.includes('indoor') ||
      pCat.includes('tropical') ||
      pCat.includes('succulent') ||
      pCat.includes('trailing') ||
      pCat.includes('foliage') ||
      pCat.includes('purifier') ||
      pCat.includes('shade') ||
      pName.includes('aglaonema') ||
      pName.includes('dracaena') ||
      pName.includes('monstera') ||
      pName.includes('sansevieria') ||
      pName.includes('ficus lyrata') ||
      pName.includes('ficus elastica') ||
      pName.includes('rubber') ||
      pName.includes('snake plant') ||
      pName.includes('song of india') ||
      pName.includes('peace lily') ||
      pName.includes('pothos') ||
      pName.includes('money plant') ||
      pName.includes('zz plant') ||
      pName.includes('calathea') ||
      pName.includes('peperomia') ||
      pName.includes('philodendron') ||
      pName.includes('syngonium') ||
      pName.includes('dieffenbachia') ||
      pSci.includes('dracaena') ||
      pSci.includes('aglaonema') ||
      pSci.includes('monstera') ||
      pSci.includes('epipremnum') ||
      pSci.includes('spathiphyllum')
    ) {
      return true;
    }
  }

  // Outdoor Matchers
  const isOutdoorFilter = sCat.includes('outdoor') || sCat.includes('landscape') || sCat.includes('tree');
  if (isOutdoorFilter) {
    if (
      pCat.includes('outdoor') ||
      pCat.includes('palm') ||
      pCat.includes('bonsai') ||
      pCat.includes('tree') ||
      pCat.includes('landscape') ||
      pCat.includes('flowering') ||
      pCat.includes('hedge') ||
      pCat.includes('shrub') ||
      pCat.includes('avenue') ||
      pName.includes('palm') ||
      pName.includes('pine') ||
      pName.includes('bougainvillea') ||
      pName.includes('olive') ||
      pName.includes('cycad') ||
      pName.includes('ashoka') ||
      pName.includes('champa') ||
      pName.includes('neem') ||
      pName.includes('banyan') ||
      pName.includes('cypress') ||
      pName.includes('strelitzia')
    ) {
      return true;
    }
  }

  // Pots Matchers
  const isPotsFilter = sCat.includes('pot') || sCat.includes('planter');
  if (isPotsFilter) {
    if (
      pCat.includes('pot') ||
      pCat.includes('planter') ||
      pCat.includes('ceramic') ||
      pCat.includes('terracotta') ||
      pName.includes('pot') ||
      pName.includes('planter') ||
      pName.includes('saucer')
    ) {
      return true;
    }
  }

  return false;
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

  // Standard Popular Filter Categories
  const categoryFilters = useMemo(() => {
    const defaultList = [
      { id: 'all', name: 'All Categories', raw: 'All' },
      { id: 'indoor', name: 'Indoor Plants', raw: 'Indoor Plants' },
      { id: 'outdoor', name: 'Outdoor Plants', raw: 'Outdoor Plants' },
      { id: 'pots', name: 'Pots & Planters', raw: 'Pots' },
    ];

    // Add any extra custom category from admin that isn't already covered
    categories.forEach((cat) => {
      const isDuplicate = defaultList.some(
        (d) => d.raw.toLowerCase() === cat.name.toLowerCase() ||
               (cat.name.toLowerCase().includes('indoor') && d.id === 'indoor') ||
               (cat.name.toLowerCase().includes('outdoor') && d.id === 'outdoor') ||
               (cat.name.toLowerCase().includes('pot') && d.id === 'pots')
      );
      if (!isDuplicate) {
        defaultList.push({ id: cat.id, name: cat.name, raw: cat.name });
      }
    });

    return defaultList;
  }, [categories]);

  // Calculate count for each category filter badge
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: plants.length };
    categoryFilters.forEach((filter) => {
      if (filter.raw === 'All') {
        counts['All'] = plants.length;
      } else {
        const count = plants.filter((p) => isCategoryMatch(p, filter.raw)).length;
        counts[filter.raw] = count;
      }
    });
    return counts;
  }, [plants, categoryFilters]);

  // Optimized Filter logic
  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      // Search
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase().trim();
        const matchesName = (plant.name || '').toLowerCase().includes(q);
        const matchesSci = (plant.scientificName || '').toLowerCase().includes(q);
        const matchesCat = (plant.category || '').toLowerCase().includes(q);
        const matchesDesc = (plant.shortDescription || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSci && !matchesCat && !matchesDesc) return false;
      }

      // Robust Category Match
      if (filterState.category && filterState.category !== 'All') {
        if (!isCategoryMatch(plant, filterState.category)) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header Banner */}
        <div className="relative bg-[#183925] text-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785825477/ChatGPT_Image_Aug_4_2026_12_03_18_PM_ilzwov.png"
              alt="Botanical Catalogue Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#183925]/95 via-[#183925]/85 to-[#183925]/90" />
          </div>

          <div className="relative z-10 space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-emerald-300 block drop-shadow-xs">
              COMPLETE BOTANICAL CATALOGUE
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl text-white font-bold drop-shadow-md">
              Explore Our Living Collection
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed drop-shadow-xs">
              Browse our nursery-grown indoor foliage, architectural outdoor trees, exotic palms, and artisanal planters.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => onNavigate('bulk-orders')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Need Bulk Plants? (Inquiry)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-900/10 shadow-xs">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-700" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => setFilterState({ ...filterState, searchQuery: e.target.value })}
              placeholder="Search plant name, taxonomy, Aglaonema, Monstera, Pots..."
              className="w-full bg-[#f8faf8] border border-emerald-900/15 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#062319] placeholder-emerald-800/60 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            />
            {filterState.searchQuery && (
              <button
                onClick={() => setFilterState({ ...filterState, searchQuery: '' })}
                className="absolute right-3 top-3 text-xs text-emerald-700 p-1 hover:bg-emerald-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Quick Filter Pills with Dynamic Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryFilters.map((cat) => {
            const isSelected =
              (filterState.category === 'All' && cat.raw === 'All') ||
              (filterState.category !== 'All' &&
                (filterState.category.toLowerCase() === cat.raw.toLowerCase() ||
                 (filterState.category.toLowerCase().includes('indoor') && cat.raw.toLowerCase().includes('indoor')) ||
                 (filterState.category.toLowerCase().includes('outdoor') && cat.raw.toLowerCase().includes('outdoor')) ||
                 (filterState.category.toLowerCase().includes('pot') && cat.raw.toLowerCase().includes('pot'))));

            const count = categoryCounts[cat.raw] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => setFilterState({ ...filterState, category: cat.raw })}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#183925] text-white shadow-sm border border-[#183925]'
                    : 'bg-white text-gray-800 hover:bg-emerald-50 border border-gray-200'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isSelected
                      ? 'bg-emerald-400/30 text-emerald-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicator Bar */}
        <div className="flex items-center justify-between text-xs text-emerald-900/80 px-1">
          <span className="font-mono font-semibold">
            Showing {filteredPlants.length} of {plants.length} plant{plants.length !== 1 ? 's' : ''}
            {filterState.category !== 'All' ? ` in ${filterState.category}` : ''}
          </span>

          {(filterState.category !== 'All' || filterState.searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Full-Width Plant Grid (Mobile-optimized with 1 column on mobile, 2 on tablet, 3-4 on desktop) */}
        <div className="w-full">
          {filteredPlants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredPlants.map((plant) => {
                const plantImage = (plant.images && plant.images[0]) ? plant.images[0] : DEFAULT_PLANT_IMAGE;

                return (
                  <div
                    key={plant.id}
                    data-cursor="VIEW"
                    className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Plant Image Card Header */}
                      <div
                        className="relative h-64 w-full overflow-hidden cursor-pointer bg-gray-100"
                        onClick={() => onNavigate('plant-detail', { id: plant.id })}
                      >
                        <img
                          src={plantImage}
                          alt={plant.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== DEFAULT_PLANT_IMAGE) {
                              target.src = DEFAULT_PLANT_IMAGE;
                            }
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#183925]/90 text-white text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-400/40 shadow-xs">
                          {plant.category}
                        </span>

                        {plant.isFeatured && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-mono font-extrabold uppercase shadow-xs">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      {/* Plant Information */}
                      <div className="p-4 sm:p-5 space-y-2.5">
                        <div
                          className="cursor-pointer"
                          onClick={() => onNavigate('plant-detail', { id: plant.id })}
                        >
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#132e1f] group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {plant.name}
                          </h3>
                          <p className="text-xs italic text-gray-500 font-mono mt-0.5 line-clamp-1">
                            {plant.scientificName}
                          </p>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {plant.shortDescription || plant.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-mono text-gray-600 pt-1.5 border-t border-gray-100">
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
                    <div className="p-4 sm:p-5 pt-0 flex gap-2">
                      <button
                        onClick={() => onNavigate('plant-detail', { id: plant.id })}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors cursor-pointer text-center"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => onOpenEnquiry(plant)}
                        className="py-2.5 px-4 rounded-xl bg-[#183925] text-white hover:bg-emerald-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer active:scale-95"
                        title="Enquire via WhatsApp"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 sm:py-20 text-center bg-white rounded-3xl border border-emerald-900/10 p-8 space-y-4 shadow-xs">
              <Sparkles className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-2xl text-[#062319] font-bold">No Plants Found in this Category</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                We couldn't find any items matching "{filterState.category}". Click below to explore all varieties in our nursery catalogue.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-full bg-[#183925] text-white hover:bg-emerald-800 text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Show All Categories ({plants.length} Plants)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
