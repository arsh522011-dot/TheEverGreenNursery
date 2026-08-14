import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FeedbackModal } from '../common/FeedbackModal';
import {
  ArrowRight,
  Sun,
  Droplets,
  Award,
  Compass,
  MapPin,
  MessageSquare,
  MessageSquarePlus,
  ChevronRight,
  Sprout,
  ShieldCheck,
  TreeDeciduous,
  Truck,
  Shield,
  Star,
  PackageCheck,
  RefreshCw,
} from 'lucide-react';
import { Plant, Category, Service, Project, GalleryItem, Testimonial, SiteSettings } from '../../types';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';

interface HomeViewProps {
  settings: SiteSettings;
  categories: Category[];
  featuredPlants: Plant[];
  services: Service[];
  projects: Project[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenEnquiry: (plant?: Plant, service?: Service) => void;
  onOpenLightbox: (images: string[], index: number, title?: string, caption?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  categories,
  featuredPlants,
  services,
  projects,
  gallery,
  testimonials,
  onNavigate,
  onOpenEnquiry,
  onOpenLightbox,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const homeTestimonials = testimonials.filter(
    (t) => t.showOnHome !== false && (t.status === undefined || t.status === 'approved')
  );

  const filteredPlants = featuredPlants.filter((p) => {
    if (activeTab === 'indoor') return p.category.includes('Indoor') || p.category.includes('Bonsai') || p.category.includes('Succulent');
    if (activeTab === 'outdoor') return p.category.includes('Outdoor') || p.category.includes('Exotic') || p.category.includes('Flowering');
    return true;
  });

  const featuredProject =
    (settings.featuredProjectId && projects.find((p) => p.id === settings.featuredProjectId)) ||
    projects.find((p) => p.featured) ||
    projects[0] ||
    null;

  // Quick Circular Category Items (Match Screenshot 1)
  const quickCategories = [
    {
      name: 'Daily Deals',
      icon: 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785870554/Gemini_Generated_Image_qkg50xqkg50xqkg5_xl9eot.png',
      category: 'Indoor'
    },
    {
      name: 'New Arrivals',
      icon: 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785871172/Gemini_Generated_Image_ioxfbsioxfbsioxf_tghpyk.png',
      category: 'Flowering'
    },
    {
      name: 'Best Selling',
      icon: 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785872448/Gemini_Generated_Image_ioxfbsioxfbsioxf_vvparu.png',
      category: 'Succulent'
    },
    {
      name: 'Indoor Plants',
      icon: 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785873245/Gemini_Generated_Image_xcliqrxcliqrxcli_gsfefh.png',
      category: 'Indoor'
    },
    {
      name: 'Succulents',
      icon: 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785874412/Gemini_Generated_Image_9ekymg9ekymg9eky_atzpyk.png',
      category: 'Succulent'
    },
    {
      name: 'Flowering',
      icon: 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785873676/Gemini_Generated_Image_xcliqrxcliqrxcli_dqocxm.png',
      category: 'Flowering'
    },
    {
      name: 'Bonsai',
      icon: 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785872796/Gemini_Generated_Image_14j02214j02214j0_bt59vh.png',
      category: 'Bonsai'
    },
    {
      name: 'Plant Care',
      icon: 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785874090/Gemini_Generated_Image_g53lbrg53lbrg53l_ggjnrn.png',
      category: 'Outdoor'
    },
  ];

  const heroVideo = settings.heroVideoUrl || "https://res.cloudinary.com/dpxoxrnrd/video/upload/v1785786984/WhatsApp_Video_2026-08-03_at_23.47.28_orrgw5.mp4";

  return (
    <div className="text-[#132e1f] bg-[#f8faf8] overflow-x-hidden pt-[60px] sm:pt-[70px]">
      {/* SECTION 1: HERO BOTANICAL VIDEO BANNER */}
      <section className="relative min-h-[460px] sm:min-h-[580px] lg:min-h-[680px] flex items-center bg-black overflow-hidden group">
        {/* Background Hero Video */}
        <div className="absolute inset-0 z-0 bg-black">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Subtle Dark Gradient Overlay for Maximum Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        {/* Hero Content Overlay with Professional Slide-Left Animation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 sm:py-20">
          <div className="max-w-3xl">
            {/* Tagline Badge & Decorative Animated Line - Slide in from Left */}
            <div className="flex flex-col items-start gap-2 mb-4">
              <motion.div
                initial={{ x: -60, opacity: 0, filter: 'blur(8px)' }}
                animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg"
              >
                <Sprout className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{settings.tagline || 'BOTANICAL NURSERY & LIVING DECOR'}</span>
              </motion.div>

              {/* Optimistic Decorative Accent Line - Slide & Expand from Left */}
              <motion.div
                initial={{ scaleX: 0, x: -50, opacity: 0 }}
                animate={{ scaleX: 1, x: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-1 sm:h-1.5 w-24 sm:w-36 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500/20 shadow-md shadow-emerald-500/50 origin-left mt-1"
              />
            </div>

            {/* Headline - Slide in from Left */}
            <motion.h1
              initial={{ x: -80, opacity: 0, filter: 'blur(10px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-xl mb-4 tracking-tight"
            >
              {settings.heroHeadline || 'Cultivating Living Art for Exceptional Spaces'}
            </motion.h1>

            {/* Subheadline Line - Slide in from Left */}
            <motion.p
              initial={{ x: -70, opacity: 0, filter: 'blur(6px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-lg text-emerald-100/90 font-light leading-relaxed mb-6 sm:mb-8 drop-shadow max-w-2xl border-l-2 border-emerald-400/60 pl-3.5 sm:pl-4"
            >
              {settings.heroSubheadline || 'Explore our hand-reared collection of exotic indoor specimens, architectural landscape flora, and mature botanical treasures.'}
            </motion.p>

            {/* CTA Buttons - Hidden on Mobile, Slide in from Left on Desktop */}
            <motion.div
              initial={{ x: -60, opacity: 0, filter: 'blur(4px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:flex flex-wrap items-center gap-3 sm:gap-4 mt-2"
            >
              <button
                onClick={() => onNavigate('plants')}
                className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/60 hover:shadow-emerald-600/40 flex items-center gap-2 transition-all group cursor-pointer active:scale-95"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button
                onClick={() => onOpenEnquiry()}
                className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white font-semibold text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Bulk & Landscape Enquiry
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SLEEK TRUST HIGHLIGHTS BAR BELOW HERO */}
      <section className="bg-emerald-950 text-emerald-100 border-b border-emerald-900 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-emerald-800/60">
            <div className="flex items-center justify-center gap-2.5 px-2">
              <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">Pan India Delivery</p>
                <p className="text-[10px] text-emerald-300/80 hidden sm:block">Safe & Secure Transit</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">100% Healthy Plants</p>
                <p className="text-[10px] text-emerald-300/80 hidden sm:block">Nursery Fresh Guarantee</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-2">
              <Sprout className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">Direct Nursery Rates</p>
                <p className="text-[10px] text-emerald-300/80 hidden sm:block">No Middlemen Markup</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-2">
              <Award className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">Expert Care Advice</p>
                <p className="text-[10px] text-emerald-300/80 hidden sm:block">Free Guidance On Orders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DUAL PROMO BANNERS GRID (Match Screenshot 4) */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Banner 1 */}
          <div className="relative h-60 sm:h-72 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group cursor-pointer" onClick={() => onNavigate('plants')}>
            <img
              src="https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785836869/82001171-1747-41d1-afa7-5563e749c1ba_ieesdw.png"
              alt="Healthy Plants Nursery Fresh"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15 sm:from-black/75 sm:via-black/35 sm:to-transparent p-5 sm:p-8 flex flex-col justify-center text-white">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold mb-1 sm:mb-1.5">
                Nursery Special
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold max-w-[260px] sm:max-w-xs leading-tight mb-3 sm:mb-4 drop-shadow-md">
                Healthy Plants. Nursery Fresh.
              </h3>
              <div>
                <button className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white text-[#132e1f] font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 transition-colors shadow-md active:scale-95">
                  Explore Collection
                </button>
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative h-60 sm:h-72 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group cursor-pointer" onClick={() => onNavigate('plants', { category: 'Indoor' })}>
            <img
              src="https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785837651/08d74e52-6be6-4c1f-9484-1006638d874c_hopcsz.png"
              alt="Turn Every Corner Green"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15 sm:from-black/75 sm:via-black/35 sm:to-transparent p-5 sm:p-8 flex flex-col justify-center text-white">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold mb-1 sm:mb-1.5">
                Living Decor
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold max-w-[260px] sm:max-w-xs leading-tight mb-3 sm:mb-4 drop-shadow-md">
                Turn Every Corner Green.
              </h3>
              <div>
                <button className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white text-[#132e1f] font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 transition-colors shadow-md active:scale-95">
                  Explore Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY SEARCH SECTION */}
      <section className="py-8 bg-[#f2f7f4] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 block mb-1">
              QUICK SELECTION
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#132e1f]">
              Shop By Popular Categories
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-2 pt-1 justify-start md:justify-center">
            {quickCategories.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('plants', { category: item.category })}
                className="flex flex-col items-center gap-2 group shrink-0"
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white border-2 border-[#76e3b3] flex items-center justify-center text-2xl sm:text-3xl shadow-sm group-hover:scale-105 group-hover:border-emerald-600 transition-all overflow-hidden p-1">
                  {item.icon.startsWith('http') ? (
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{item.icon}</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#0f3822] group-hover:text-emerald-700 whitespace-nowrap">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PLANT CATALOGUE GRID ("Flowering Bulbs & Nursery Best Sellers") */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 block mb-1">
                CURATED FOR YOU
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#132e1f] font-bold">
                Flowering Bulbs & Nursery Best Sellers
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full border border-gray-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                  activeTab === 'all' ? 'bg-[#183925] text-white shadow' : 'text-gray-700 hover:text-emerald-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('indoor')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                  activeTab === 'indoor' ? 'bg-[#183925] text-white shadow' : 'text-gray-700 hover:text-emerald-800'
                }`}
              >
                Indoor
              </button>
              <button
                onClick={() => setActiveTab('outdoor')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                  activeTab === 'outdoor' ? 'bg-[#183925] text-white shadow' : 'text-gray-700 hover:text-emerald-800'
                }`}
              >
                Outdoor
              </button>
            </div>
          </div>

          {/* Clean Plant Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlants.slice(0, 8).map((plant) => (
              <div
                key={plant.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="relative h-60 overflow-hidden cursor-pointer bg-gray-50"
                    onClick={() => onNavigate('plant-detail', { id: plant.id })}
                  >
                    <img
                      src={plant.images[0]}
                      alt={plant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold font-mono uppercase tracking-wider shadow">
                      {plant.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => onNavigate('plant-detail', { id: plant.id })}
                    >
                      <h3 className="font-serif text-lg font-bold text-[#132e1f] group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {plant.name}
                      </h3>
                      <p className="text-xs italic text-gray-500 font-mono mt-0.5">
                        {plant.scientificName}
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {plant.shortDescription}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-gray-500 border-t border-gray-100">
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
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <button
                    onClick={() => onNavigate('plant-detail', { id: plant.id })}
                    className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onOpenEnquiry(plant)}
                    className="py-2 px-4 rounded-xl bg-[#183925] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('plants')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#183925] text-white hover:bg-emerald-800 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <span>Explore Entire Catalogue (650+ Varieties)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: BULK & WHOLESALE ORDER BANNER */}
      <section className="relative overflow-hidden bg-[#0d2818] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner my-6">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785822331/640f18b0-1294-4e19-9f77-0790c7ede2dc_xeyimt.png"
            alt="Botanical Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2818]/92 via-[#0d2818]/80 to-[#0d2818]/88 backdrop-brightness-90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest border border-emerald-500/30 backdrop-blur-sm shadow-sm">
              Bulk & Wholesale Inquiries
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
              Planning Corporate Gifting, Events, or Wholesale Orders?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed drop-shadow-xs">
              Request nursery-direct bulk pricing for 50 to 10,000+ plants. Zero payment required upfront — receive custom quotes, pan-India logistics, and bespoke branding options.
            </p>
          </div>

          <button
            onClick={() => onNavigate('bulk-orders')}
            className="shrink-0 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <span>Submit Bulk Inquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 5: CATEGORIES GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 block mb-1">
              EXPLORE BY FAMILY
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#132e1f] font-bold">
              Plant Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-600 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('plants', { category: cat.name })}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-gray-200"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#132e1f] via-[#132e1f]/30 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10 space-y-2">
                <span className="self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-mono tracking-wider text-white uppercase">
                  {cat.plantCount ? `${cat.plantCount} Varieties` : 'Specimens'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: COMPLETED WORK SHOWCASE */}
      {settings.featuredProjectShowOnHome !== false && featuredProject && (
        <section className="py-16 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 block">
                {settings.featuredProjectSectionSubtitle || 'LANDSCAPE ARCHITECTURE'}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#132e1f] font-bold">
                {settings.featuredProjectSectionTitle || 'Featured Completed Project'}
              </h2>
            </div>

            <BeforeAfterSlider
              afterImage={featuredProject.afterImage}
              afterLabel={settings.featuredProjectBadgeLabel || 'THE EVERGREEN NURSERY LANDSCAPE'}
            />
          </div>
        </section>
      )}

      {/* SECTION 7: TESTIMONIALS & CUSTOMER REVIEWS */}
      <section className="py-16 bg-[#f0f5f1] text-[#132e1f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <Award className="w-10 h-10 text-emerald-700 mx-auto" />
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-4xl font-bold">
              {settings.testimonialTitle || 'Trusted by 50,000+ Plant Enthusiasts'}
            </h2>
            <p className="text-xs text-emerald-800/80 max-w-xl mx-auto">
              Real reviews and feedback from verified plant parents, landscape architecture clients, and botanical collectors.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Submit Your Feedback & Review</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-4">
            {homeTestimonials.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-emerald-600/30 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#062319] text-emerald-100 flex items-center justify-center font-bold font-serif text-sm border border-emerald-600/30 shadow-sm shrink-0">
                          {t.name ? t.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#132e1f]">{t.name}</h4>
                        <p className="text-[10px] text-emerald-700 font-mono uppercase">{t.role}</p>
                        {t.location && <p className="text-[10px] text-gray-400">{t.location}</p>}
                      </div>
                    </div>
                    {/* Stars */}
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{t.content}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEEDBACK MODAL */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};
