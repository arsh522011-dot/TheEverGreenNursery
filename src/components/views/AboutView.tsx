import React from 'react';
import { SiteSettings } from '../../types';
import { Sprout, Award, HeartHandshake, ShieldCheck, TreeDeciduous, Users } from 'lucide-react';

interface AboutViewProps {
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ settings, onNavigate }) => {
  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Banner */}
        <div className="bg-[#062319] text-white p-6 sm:p-16 rounded-3xl relative overflow-hidden shadow-2xl border border-emerald-500/20 text-center space-y-4">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={
                settings.aboutBgImage ||
                'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785834693/ChatGPT_Image_Aug_4_2026_02_17_46_PM_druljs.png'
              }
              alt="Botanical Heritage Background"
              className="w-full h-full object-cover opacity-50 sm:opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#062319]/75 via-[#062319]/65 to-[#062319]/85" />
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          </div>

          <div className="relative z-10 space-y-3 sm:space-y-4">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 block">
              {settings.aboutEyebrow || 'OUR BOTANICAL HERITAGE'}
            </span>
            <h1 className="font-serif text-2xl sm:text-5xl md:text-6xl text-emerald-100 font-light max-w-3xl mx-auto leading-tight">
              {settings.aboutTitle || 'Cultivating Life, Beauty & Architectural Flora Since 2012'}
            </h1>
            <p className="text-xs sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-light">
              {settings.aboutStory}
            </p>
          </div>
        </div>

        {/* Mission & Vision Cards if provided */}
        {(settings.aboutMissionDesc || settings.aboutVisionDesc) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settings.aboutMissionDesc && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-sm space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  {settings.aboutMissionTitle || 'Our Mission'}
                </span>
                <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
                  {settings.aboutMissionDesc}
                </p>
              </div>
            )}
            {settings.aboutVisionDesc && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-sm space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  {settings.aboutVisionTitle || 'Our Vision'}
                </span>
                <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
                  {settings.aboutVisionDesc}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Animated Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-sm text-center space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-light text-emerald-700">{settings.experienceYears}+</span>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-900/80 block">{settings.statsLabel1 || 'Years Growing'}</span>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-sm text-center space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-light text-emerald-700">{settings.plantVarietiesCount}+</span>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-900/80 block">{settings.statsLabel2 || 'Flora Species'}</span>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-sm text-center space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-light text-emerald-700">
              {typeof settings.happyClientsCount === 'number' && settings.happyClientsCount >= 1000
                ? (settings.happyClientsCount / 1000).toFixed(1) + 'k+'
                : settings.happyClientsCount + '+'}
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-900/80 block">{settings.statsLabel3 || 'Green Spaces'}</span>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-sm text-center space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-light text-emerald-700">{settings.projectsCompletedCount}+</span>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-900/80 block">{settings.statsLabel4 || 'Estates Designed'}</span>
          </div>
        </div>

        {/* Core Principles */}
        <div className="space-y-8">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-700 block mb-2">
              {settings.philosophySubtitle || 'OUR PHILOSOPHY'}
            </span>
            <h2 className="font-serif text-3xl text-[#062319]">
              {settings.philosophyTitle || `The Four Pillars of ${settings.nurseryName || 'Verdant Realm'}`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-emerald-900/10 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 w-fit">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#062319]">{settings.pillar1Title || 'Pesticide-Free Growing'}</h3>
              <p className="text-xs text-emerald-900/70 leading-relaxed">
                {settings.pillar1Desc || 'We utilize beneficial predatory insects and organic neem teas to protect foliage without harsh chemicals.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-900/10 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#062319]">{settings.pillar2Title || 'Acclimatized Root Systems'}</h3>
              <p className="text-xs text-emerald-900/70 leading-relaxed">
                {settings.pillar2Desc || 'Every specimen undergoes mandatory root training and shade transition before entering residential spaces.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-900/10 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 w-fit">
                <TreeDeciduous className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#062319]">{settings.pillar3Title || 'Specimen Sourcing'}</h3>
              <p className="text-xs text-emerald-900/70 leading-relaxed">
                {settings.pillar3Desc || 'Our horticulturists search globally for rare variegated mutations, mature olive standards, and heritage bonsai.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-900/10 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 w-fit">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#062319]">{settings.pillar4Title || 'Lifetime Plant Support'}</h3>
              <p className="text-xs text-emerald-900/70 leading-relaxed">
                {settings.pillar4Desc || 'Clients receive ongoing care consultation, repotting guidance, and soil nutrient diagnostics from our nursery team.'}
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-[#062319] text-white p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl border border-emerald-500/20">
          <div className="space-y-1 text-center md:text-left relative z-10">
            <h3 className="font-serif text-2xl text-emerald-100 font-medium">
              {settings.aboutCtaTitle || 'Ready to Visit Our Nursery in Person?'}
            </h3>
            <p className="text-xs text-emerald-300/80">
              {settings.aboutCtaDesc || 'Explore 15 acres of climate-controlled glasshouses and outdoor growing beds.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3.5 rounded-full bg-emerald-500 text-[#062319] font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors relative z-10 shrink-0"
          >
            {settings.aboutCtaButtonText || 'Get Nursery Directions'}
          </button>
        </div>
      </div>
    </div>
  );
};
