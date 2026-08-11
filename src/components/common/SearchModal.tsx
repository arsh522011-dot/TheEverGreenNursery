import React, { useState } from 'react';
import { Search, X, Leaf, ArrowRight, Sparkles } from 'lucide-react';
import { Plant } from '../../types';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  plants: Plant[];
  onSelectPlant: (plantId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  plants,
  onSelectPlant,
}) => {
  const [query, setQuery] = useState('');

  // Lock background body scroll when search modal is open
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const filteredPlants = query.trim()
    ? plants.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.scientificName.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
    : plants.slice(0, 4); // Suggest top 4 featured when empty

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-start justify-center pt-20 px-4 animate-fadeIn modal-backdrop-overlay">
      <div className="w-full max-w-2xl bg-[#062319] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden text-white overscroll-contain">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-6 border-b border-emerald-800/60 flex items-center gap-3">
          <Search className="w-6 h-6 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by common name, scientific taxonomy, or category..."
            className="w-full bg-transparent text-lg text-emerald-100 placeholder-emerald-600 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto overscroll-contain modal-scroll-content p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-2">
            <span>{query.trim() ? `SEARCH RESULTS (${filteredPlants.length})` : 'SUGGESTED BOTANICALS'}</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          </div>

          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant) => (
              <button
                key={plant.id}
                onClick={() => {
                  onSelectPlant(plant.id);
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/40 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={plant.images[0]}
                    alt={plant.name}
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-500/30"
                  />
                  <div>
                    <h4 className="font-serif text-base text-emerald-100 group-hover:text-emerald-300 transition-colors">
                      {plant.name}
                    </h4>
                    <span className="block text-xs italic text-emerald-400 font-mono">
                      {plant.scientificName}
                    </span>
                    <span className="inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-900 text-emerald-300">
                      {plant.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))
          ) : (
            <div className="py-12 text-center text-emerald-400/80 space-y-2">
              <Leaf className="w-10 h-10 mx-auto text-emerald-600 opacity-50" />
              <p className="font-serif text-lg">We couldn't find that plant in our garden.</p>
              <p className="text-xs text-emerald-500/80">Try searching for "Monstera", "Olive", "Bonsai", or "Indoor"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
