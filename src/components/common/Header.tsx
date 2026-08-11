import React, { useState, useEffect } from 'react';
import { Leaf, Search, PhoneCall, Menu, X, ChevronLeft, ChevronRight, User, ShoppingBag } from 'lucide-react';
import { SiteSettings } from '../../types';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface HeaderProps {
  currentView: string;
  viewParams?: Record<string, string>;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  settings: SiteSettings;
  onOpenSearch: () => void;
  onOpenEnquiry: () => void;
}

// STICKY / FIXED TOP HEADER COMPONENT
// Always displayed on mobile (320px - 768px) and desktop (768px+)
// Mobile Layout: Nursery Logo & Name on Left | Search & 44x44px Hamburger Menu Button on Right
// Desktop Layout: Logo & Name on Left | Navigation Links in Center | Quick Action Buttons on Right
export const Header: React.FC<HeaderProps> = ({
  currentView,
  viewParams,
  onNavigate,
  settings,
  onOpenSearch,
  onOpenEnquiry,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Lock background body scrolling when mobile menu drawer is open
  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'plants', label: 'Plants' },
    { id: 'pots', label: 'Pots', category: 'Pots' },
    { id: 'bulk-orders', label: 'Bulk Orders' },
    { id: 'categories', label: 'Categories' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string, category?: string) => {
    if (category) {
      onNavigate('plants', { category });
    } else if (id === 'pots') {
      onNavigate('plants', { category: 'Pots' });
    } else {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
  };

  const isItemActive = (item: { id: string; category?: string }) => {
    if (item.id === 'pots') {
      return (
        currentView === 'plants' &&
        (viewParams?.category?.toLowerCase() === 'pots' || viewParams?.category?.toLowerCase() === 'pots & planters')
      );
    }
    if (item.id === 'plants') {
      return (
        currentView === 'plants' &&
        (!viewParams?.category ||
          (viewParams.category.toLowerCase() !== 'pots' && viewParams.category.toLowerCase() !== 'pots & planters'))
      );
    }
    return currentView === item.id;
  };

  const getLogoSizeClass = () => {
    switch (settings.logoSize) {
      case 'normal':
        return 'h-9 sm:h-11 md:h-12 max-w-[140px] sm:max-w-[180px]';
      case 'large':
        return 'h-11 sm:h-13 md:h-15 max-w-[170px] sm:max-w-[220px]';
      case 'huge':
        return 'h-14 sm:h-16 md:h-20 max-w-[200px] sm:max-w-[320px]';
      case 'xlarge':
      default:
        return 'h-9 sm:h-11 md:h-13 max-w-[150px] sm:max-w-[200px]';
    }
  };

  return (
    /* FIXED TOP HEADER CONTAINER: 
       - Always visible on mobile & desktop (block opacity-100 visible)
       - Fixed position pinned to top (fixed top-0 left-0 right-0)
       - High z-index (z-[100]) ensures it stays above all page sections
    */
    <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-white border-b border-gray-200 shadow-md transition-all duration-300 block opacity-100 visible">
      {/* MAIN HEADER ROW */}
      <div className={`w-full transition-all duration-300 ${isScrolled ? 'py-1.5 sm:py-2.5 shadow-md' : 'py-2 sm:py-3.5'}`}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* LEFT SECTION: Nursery Logo & Site Name (Always visible on mobile & desktop) */}
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-8 min-w-0 flex-1">
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-2 sm:gap-3 group text-left focus:outline-none min-w-0 shrink"
              aria-label={`${settings.nurseryName || 'The Ever green Nursery'} Homepage`}
            >
              {/* Logo Image & Nursery Name Header Display */}
              {settings.logoUrl && !logoError ? (
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <img
                    src={settings.logoUrl}
                    alt={settings.nurseryName || 'Nursery Logo'}
                    onError={() => setLogoError(true)}
                    className={`w-auto object-contain shadow-xs group-hover:opacity-90 transition-all shrink-0 ${getLogoSizeClass()}`}
                  />
                  {!settings.hideLogoText && (
                    <div className="flex flex-col min-w-0">
                      <span className="block font-serif text-sm sm:text-xl xl:text-2xl font-bold tracking-tight leading-tight truncate text-[#095c37]">
                        {settings.nurseryName || 'The Ever green Nursery'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md group-hover:bg-emerald-800 transition-all shrink-0">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="block font-serif text-sm sm:text-xl xl:text-2xl font-bold tracking-tight leading-tight truncate text-[#095c37]">
                      {settings.nurseryName || 'The Ever green Nursery'}
                    </span>
                  </div>
                </div>
              )}
            </button>

            {/* DESKTOP NAVIGATION LINKS (Hidden on mobile <1024px, visible on desktop lg screens) */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs font-semibold tracking-wide text-gray-800 ml-6 xl:ml-12">
              {navItems.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id, item.category)}
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-emerald-800 font-bold bg-emerald-50 border border-emerald-200'
                        : 'hover:text-emerald-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* RIGHT DESKTOP QUICK ACTIONS (Hidden on mobile <1024px, shown on desktop lg screens) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-full hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 transition-all"
              title="Search Catalogue"
              aria-label="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenEnquiry}
              className="relative p-2 rounded-full hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 transition-all"
              title="Quick Enquiry"
              aria-label="Quick Enquiry"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-mono font-bold flex items-center justify-center">
                !
              </span>
            </button>
          </div>

          {/* RIGHT MOBILE CONTROLS (Always visible on mobile 320px–768px & tablets up to 1024px) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            {/* Search Icon Button - Minimum 44x44px accessible touch target */}
            <button
              onClick={onOpenSearch}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 transition-all flex items-center justify-center active:scale-95 cursor-pointer"
              title="Search Catalogue"
              aria-label="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger Menu Toggle Button - Minimum 44x44px accessible touch target */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800 transition-all active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[105] bg-black/40 backdrop-blur-2xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE NAVIGATION DRAWER (Slide/Fade Overlay directly pinned under header bar) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-[110] bg-white border-t border-emerald-100 flex flex-col justify-between p-4 sm:p-6 pb-6 max-h-[calc(100vh-70px)] overflow-y-auto overscroll-contain animate-fadeIn shadow-2xl">
          <div className="space-y-1.5 py-1">
            {navItems.map((item) => {
              const isActive = isItemActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id, item.category)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-serif transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-gray-800 hover:bg-emerald-50/50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2.5 mt-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Quick Enquiry</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
