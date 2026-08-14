import React from 'react';
import { Leaf, MapPin, Phone, Mail, Clock, ArrowUpRight, MessageSquare, Shield, CheckCircle2, Navigation, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenEnquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenEnquiry }) => {
  const [logoError, setLogoError] = React.useState(false);

  const fullAddress = `${settings.address}, ${settings.city}`;
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0d2818] text-emerald-100/90 pt-16 pb-12 border-t border-emerald-800/40 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785826224/87216429-2a7f-4306-b6f6-30c436f4ccbe_t0ku0h.png"
          alt="Footer Botanical Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2818]/94 via-[#0d2818]/88 to-[#0d2818]/92 backdrop-brightness-90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-800/50">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              {settings.logoUrl && !logoError ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.nurseryName || 'Nursery Logo'}
                  onError={() => setLogoError(true)}
                  className={`w-auto object-contain bg-white p-1.5 sm:p-2 rounded-xl shadow-md shrink-0 ${
                    settings.logoSize === 'normal'
                      ? 'h-10 sm:h-12 max-w-[180px]'
                      : settings.logoSize === 'large'
                      ? 'h-12 sm:h-16 max-w-[220px]'
                      : settings.logoSize === 'huge'
                      ? 'h-18 sm:h-24 max-w-[320px]'
                      : 'h-12 sm:h-16 max-w-[220px]'
                  }`}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-600/40 flex items-center justify-center text-emerald-300 shadow-md shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="block font-serif text-2xl font-bold text-white tracking-tight">
                  {settings.nurseryName || 'The Ever green Nursery'}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-emerald-300 font-mono">
                  {settings.tagline || 'BOTANICAL NURSERY & LIVING DECOR'}
                </span>
              </div>
            </div>

            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-md whitespace-pre-line">
              {settings.footerDescription || 'The Ever Green Nursery is your trusted online nursery offering healthy indoor plants, succulents, cactus, flowering plants, seeds and premium planters. Carefully packed and safely delivered across India.'}
            </p>

            {/* Address & Directions Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-700/50 space-y-2 max-w-md">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                    Nursery Location
                  </span>
                  <p className="text-xs text-white font-medium truncate">{settings.address}</p>
                  <p className="text-[11px] text-emerald-300/80">{settings.city}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-emerald-800/60">
                <span className="text-[11px] text-emerald-200/90 font-mono">
                  {settings.openingHours ? settings.openingHours.split('|')[0] : 'Mon - Sat: Open'}
                </span>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white transition-colors"
                >
                  <Navigation className="w-3 h-3 text-emerald-400" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              {(settings.deliveryBadge || settings.deliveryBadge === undefined) && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-mono bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-700/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{settings.deliveryBadge || 'Pan India Delivery'}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-mono bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-700/50" title="Registered Business GSTIN">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>GSTIN: {settings.gstNumber || '07AAACG1234M1Z5'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-white font-semibold tracking-wide border-b border-emerald-800/60 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80 font-medium">
              {[
                { id: 'home', label: 'Home' },
                { id: 'plants', label: 'Plant Catalogue' },
                { id: 'bulk-orders', label: 'Bulk & Wholesale Orders' },
                { id: 'categories', label: 'Categories' },
                { id: 'services', label: 'Services' },
                { id: 'projects', label: 'Projects' },
                { id: 'contact', label: 'Contact Us' },
                { id: 'privacy-policy', label: 'Privacy Policy' },
                { id: 'terms', label: 'Terms & Conditions' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-300" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop By Type */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-white font-semibold tracking-wide border-b border-emerald-800/60 pb-2">
              Shop By Type
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80 font-medium">
              {[
                'Indoor Plants',
                'Succulents & Cactus',
                'Flowering Plants & Bulbs',
                'Air Purifying Plants',
                'Pots & Planters',
                'Plant Care Essentials',
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onNavigate('plants', { category: cat })}
                    className="hover:text-white transition-colors"
                  >
                    <span>{cat}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop By Location */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-white font-semibold tracking-wide border-b border-emerald-800/60 pb-2">
              Shop By Room
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80 font-medium">
              {[
                'Living Room Plants',
                'Bedroom Plants',
                'Office & Desk Plants',
                'Balcony & Garden',
                'Shade / Low Light Plants',
              ].map((room) => (
                <li key={room}>
                  <button
                    onClick={() => onNavigate('plants')}
                    className="hover:text-white transition-colors"
                  >
                    <span>{room}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-200/70 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} {settings.nurseryName || 'The Ever green Nursery'}. All Rights Reserved.</p>
            <span className="hidden sm:inline text-emerald-800">•</span>
            <div className="flex items-center gap-3 font-medium">
              <button
                onClick={() => onNavigate('privacy-policy')}
                className="hover:text-white transition-colors underline decoration-emerald-700 underline-offset-4"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigate('terms')}
                className="hover:text-white transition-colors underline decoration-emerald-700 underline-offset-4"
              >
                Terms & Conditions
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Access</span>
            </button>

            <button
              onClick={scrollToTop}
              className="text-white hover:text-emerald-300 flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider"
            >
              <span>Back To Top ↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
