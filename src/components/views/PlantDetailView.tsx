import React, { useState } from 'react';
import {
  Sun,
  Droplets,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Sprout,
  HeartHandshake,
} from 'lucide-react';
import { Plant } from '../../types';

interface PlantDetailViewProps {
  plant: Plant;
  relatedPlants: Plant[];
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenEnquiry: (plant: Plant) => void;
  onOpenLightbox: (images: string[], index: number, title?: string) => void;
}

export const PlantDetailView: React.FC<PlantDetailViewProps> = ({
  plant,
  relatedPlants,
  onNavigate,
  onOpenEnquiry,
  onOpenLightbox,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('plants')}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </button>

        {/* Hero Section: Photo Gallery + Main Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Photo Gallery (Left) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative h-[420px] sm:h-[520px] rounded-3xl overflow-hidden border border-emerald-900/10 shadow-2xl group cursor-pointer"
              onClick={() => onOpenLightbox(plant.images, activeImageIdx, plant.name)}
              data-cursor="EXPAND"
            >
              <img
                src={plant.images[activeImageIdx] || plant.images[0]}
                alt={plant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 p-3 rounded-full bg-[#062319]/80 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div className="absolute bottom-4 left-4 bg-[#062319]/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-emerald-300 text-xs font-mono border border-emerald-500/30">
                {plant.category}
              </div>
            </div>

            {/* Thumbnail selector */}
            {plant.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {plant.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === idx
                        ? 'border-emerald-600 scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plant Core Info (Right) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-700 block mb-1">
                CLASSIFICATION • {plant.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl text-[#062319] font-light leading-tight">
                {plant.name}
              </h1>
              <p className="text-sm italic text-emerald-800 font-mono mt-1">
                {plant.scientificName}
              </p>
            </div>

            <p className="text-sm text-emerald-950/80 leading-relaxed">
              {plant.description}
            </p>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-sm space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-800 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Sunlight
                </span>
                <p className="font-serif text-base text-[#062319]">{plant.sunlight}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-sm space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-800 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" /> Hydration
                </span>
                <p className="font-serif text-base text-[#062319]">{plant.water}</p>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                onClick={() => onOpenEnquiry(plant)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white font-semibold text-xs tracking-widest uppercase shadow-xl hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enquire On WhatsApp</span>
              </button>

              <p className="text-center text-[10px] font-mono text-emerald-800/80">
                NO ONLINE PAYMENT REQUIRED • Nursery Direct Delivery & Planting Available
              </p>
            </div>
          </div>
        </div>

        {/* Botanical Story & Horticultural Specs */}
        {plant.story && (
          <div className="bg-[#062319] text-white p-8 sm:p-12 rounded-3xl space-y-4 shadow-xl border border-emerald-500/20">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 block">
              NURSERY PROPAGATION STORY
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-emerald-100">
              Cultivated in Our Climate Domes
            </h3>
            <p className="text-sm text-emerald-200/80 leading-relaxed max-w-3xl">
              {plant.story}
            </p>
          </div>
        )}

        {/* Care Guide & Soil Requirement Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step-by-Step Care */}
          <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl text-[#062319] flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-700" />
              <span>Care & Maintenance Guide</span>
            </h3>

            <div className="space-y-4">
              {plant.careGuide.map((step) => (
                <div key={step.step} className="flex gap-4 items-start border-b border-emerald-900/10 pb-4 last:border-none">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {step.step}
                  </span>
                  <div>
                    <h4 className="font-serif text-base text-[#062319] font-medium">{step.title}</h4>
                    <p className="text-xs text-emerald-950/70 mt-1 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soil, Placement & Benefits */}
          <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl text-[#062319] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Substrate & Placement</span>
            </h3>

            <div className="space-y-4 text-xs text-emerald-950/80">
              <div>
                <span className="font-mono text-[10px] uppercase text-emerald-800 block font-semibold">Recommended Substrate</span>
                <p className="mt-1 font-serif text-sm text-[#062319]">{plant.soil}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-emerald-800 block font-semibold">Ideal Placement</span>
                <p className="mt-1 font-serif text-sm text-[#062319]">{plant.placement}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-emerald-800 block font-semibold mb-2">Key Botanical Benefits</span>
                <ul className="space-y-1.5">
                  {plant.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-emerald-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Specimens */}
        {relatedPlants.length > 0 && (
          <div className="pt-12 space-y-6 border-t border-emerald-900/10">
            <h3 className="font-serif text-2xl text-[#062319]">
              Complementary Specimens
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPlants.map((rp) => (
                <div
                  key={rp.id}
                  onClick={() => onNavigate('plant-detail', { id: rp.id })}
                  className="group bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center gap-4"
                >
                  <img src={rp.images[0]} alt={rp.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div>
                    <h4 className="font-serif text-base text-[#062319] group-hover:text-emerald-700">{rp.name}</h4>
                    <span className="text-[10px] italic text-emerald-800 font-mono block">{rp.scientificName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
