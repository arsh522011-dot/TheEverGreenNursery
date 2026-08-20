import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <header className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-md'
        : 'bg-white border-b border-gray-200 shadow-xs'
    }`}>
      {/* MAIN HEADER ROW */}
      <div className={`w-full transition-all duration-300 ${isScrolled ? 'py-1.5 sm:py-2.5' : 'py-2 sm:py-3.5'}`}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* LEFT SECTION: Nursery Logo & Site Name */}
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-8 min-w-0 flex-1">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-2 sm:gap-3 group text-left focus:outline-none min-w-0 shrink cursor-pointer"
              aria-label={`${settings.nurseryName || 'The Ever green Nursery'} Homepage`}
            >
              {/* Logo Image & Nursery Name Header Display */}
              {settings.logoUrl && !logoError ? (
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <img
                    src={settings.logoUrl}
                    alt={settings.nurseryName || 'Nursery Logo'}
                    onError={() => setLogoError(true)}
                    className={`w-auto object-contain shadow-xs group-hover:scale-102 transition-transform duration-300 shrink-0 ${getLogoSizeClass()}`}
                  />
                  {!settings.hideLogoText && (
                    <div className="flex flex-col min-w-0">
                      <span className="block font-serif text-sm sm:text-xl xl:text-2xl font-bold tracking-tight leading-tight truncate text-[#095c37] group-hover:text-emerald-800 transition-colors">
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
                    <span className="block font-serif text-sm sm:text-xl xl:text-2xl font-bold tracking-tight leading-tight truncate text-[#095c37] group-hover:text-emerald-800 transition-colors">
                      {settings.nurseryName || 'The Ever green Nursery'}
                    </span>
                  </div>
                </div>
              )}
            </motion.button>

            {/* DESKTOP NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs font-semibold tracking-wide text-gray-800 ml-6 xl:ml-12">
              {navItems.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleLinkClick(item.id, item.category)}
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer relative ${
                      isActive
                        ? 'text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 shadow-xs'
                        : 'hover:text-emerald-700 hover:bg-emerald-50/60'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* RIGHT DESKTOP QUICK ACTIONS */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={onOpenSearch}
              className="p-2 rounded-full hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 transition-colors cursor-pointer"
              title="Search Catalogue"
              aria-label="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={onOpenEnquiry}
              className="relative p-2 rounded-full hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 transition-colors cursor-pointer"
              title="Quick Enquiry"
              aria-label="Quick Enquiry"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                !
              </span>
            </motion.button>
          </div>

          {/* RIGHT MOBILE CONTROLS */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onOpenSearch}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 transition-all flex items-center justify-center cursor-pointer shadow-xs"
              title="Search Catalogue"
              aria-label="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800 transition-all shadow-md flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU WITH ANIMATEPRESENCE */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 z-[105] bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Navigation Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -10, scaleY: 0.98 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden absolute top-full left-0 right-0 z-[110] bg-white border-t border-emerald-100 flex flex-col justify-between p-4 sm:p-6 pb-6 max-h-[calc(100vh-70px)] overflow-y-auto overscroll-contain shadow-2xl origin-top"
            >
              <div className="space-y-1.5 py-1">
                {navItems.map((item, idx) => {
                  const isActive = isItemActive(item);
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLinkClick(item.id, item.category)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-base font-serif transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
                          : 'text-gray-800 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2.5 mt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenEnquiry();
                  }}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Quick Enquiry</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

