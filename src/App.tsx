import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageLoader } from './components/common/PageLoader';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { EnquiryModal } from './components/common/EnquiryModal';
import { Lightbox } from './components/common/Lightbox';
import { SearchModal } from './components/common/SearchModal';
import { useSmoothScroll } from './hooks/useSmoothScroll';

import { HomeView } from './components/views/HomeView';
import { PlantsCatalogueView } from './components/views/PlantsCatalogueView';
import { PlantDetailView } from './components/views/PlantDetailView';
import { CategoriesView } from './components/views/CategoriesView';
import { AboutView } from './components/views/AboutView';
import { ServicesView } from './components/views/ServicesView';
import { ProjectsView } from './components/views/ProjectsView';
import { GalleryView } from './components/views/GalleryView';
import { ContactView } from './components/views/ContactView';
import { BulkOrderView } from './components/views/BulkOrderView';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';
import { TermsView } from './components/views/TermsView';
import { AdminView } from './components/views/AdminView';
import { NotFoundView } from './components/views/NotFoundView';

import { StorageService } from './services/storage';
import { Plant, Category, Service, Project, GalleryItem, Testimonial, SiteSettings } from './types';
import { getPageSEO } from './utils/seoData';

// Helper to parse route from URL (pathname, hash, or query params)
function parseUrlRoute(): { view: string; params: Record<string, string> } {
  try {
    let rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      params[key] = val;
    });

    // If pathname is empty, check hash routing fallback (e.g., #plants, #/about, #/plants/123)
    if (!rawPath && window.location.hash) {
      const hashStr = window.location.hash.replace(/^#\/?/, '').trim();
      const hashParts = hashStr.split('?');
      rawPath = hashParts[0] || '';
      if (hashParts[1]) {
        const hashParams = new URLSearchParams(hashParts[1]);
        hashParams.forEach((val, key) => {
          params[key] = val;
        });
      }
    }

    // Query parameter fallback (e.g. ?view=plants or ?page=about)
    if ((!rawPath || rawPath === '') && params.view) {
      rawPath = params.view;
    } else if ((!rawPath || rawPath === '') && params.page) {
      rawPath = params.page;
    }

    if (!rawPath || rawPath === '') {
      return { view: 'home', params };
    }

    const decodedPath = decodeURIComponent(rawPath);
    const normalized = decodedPath.toLowerCase();

    // SEO-friendly Aliases & Special Routes
    if (normalized === 'wholesale-plants') {
      return { view: 'plants', params };
    }
    if (normalized === 'indoor-plants') {
      return { view: 'plants', params: { ...params, category: 'Indoor Plants' } };
    }
    if (normalized === 'outdoor-plants') {
      return { view: 'plants', params: { ...params, category: 'Outdoor & Landscape' } };
    }
    if (normalized === 'landscaping-plants') {
      return { view: 'plants', params: { ...params, category: 'Architectural Palms' } };
    }
    if (normalized === 'pots') {
      return { view: 'plants', params: { ...params, category: 'Pots' } };
    }

    // Direct /plants/:id routes
    if (normalized.startsWith('plants/')) {
      const id = decodedPath.slice(7).trim();
      return { view: 'plant-detail', params: { ...params, id } };
    }

    const validViews = [
      'home',
      'plants',
      'plant-detail',
      'categories',
      'about',
      'services',
      'projects',
      'gallery',
      'contact',
      'bulk-orders',
      'privacy-policy',
      'terms',
      'admin',
    ];

    if (validViews.includes(normalized)) {
      return { view: normalized, params };
    }

    // Unknown route fallback to themed 404 page
    return { view: 'not-found', params };
  } catch {
    // fallback
  }
  return { view: 'home', params: {} };
}

export default function App() {
  useSmoothScroll();
  const initialRoute = parseUrlRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [viewParams, setViewParams] = useState<Record<string, string>>(initialRoute.params);

  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Data States
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [categories, setCategories] = useState<Category[]>(StorageService.getCategories());
  const [plants, setPlants] = useState<Plant[]>(StorageService.getPlants());
  const [services, setServices] = useState<Service[]>(StorageService.getServices());
  const [projects, setProjects] = useState<Project[]>(StorageService.getProjects());
  const [gallery, setGallery] = useState<GalleryItem[]>(StorageService.getGallery());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(StorageService.getTestimonials());

  // Modal States
  const [searchOpen, setSearchOpen] = useState(false);
  const [enquiryModal, setEnquiryModal] = useState<{
    isOpen: boolean;
    plant?: Plant | null;
    service?: Service | null;
  }>({ isOpen: false });

  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    title?: string;
    caption?: string;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  const refreshData = useCallback(() => {
    setSettings(StorageService.getSettings());
    setCategories(StorageService.getCategories());
    setPlants(StorageService.getPlants());
    setServices(StorageService.getServices());
    setProjects(StorageService.getProjects());
    setGallery(StorageService.getGallery());
    setTestimonials(StorageService.getTestimonials());
  }, []);

  useEffect(() => {
    StorageService.initFirebaseSync(refreshData);

    const handleRouteSync = () => {
      const parsed = parseUrlRoute();
      setCurrentView(parsed.view);
      setViewParams(parsed.params);
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, [refreshData]);

  // Synchronize Canonical Tag, Title, Keywords, OpenGraph & Breadcrumbs with Canonical Live Domain
  useEffect(() => {
    try {
      const canonicalBase = 'https://theevergreennursary.com';
      const currentPlant = currentView === 'plant-detail' && viewParams.id 
        ? plants.find((p) => p.id === viewParams.id) 
        : undefined;

      const pageSeo = getPageSEO(
        currentView,
        viewParams,
        currentPlant?.name,
        currentPlant?.shortDescription
      );

      const currentTitle = pageSeo.title;
      const currentDescription = pageSeo.description;
      const currentKeywords = pageSeo.keywords;
      const canonicalPath = pageSeo.canonicalPath;

      document.title = currentTitle;
      const fullCanonicalUrl = `${canonicalBase}${canonicalPath}`;

      // Update Canonical Link
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', fullCanonicalUrl);

      // Update OpenGraph & Twitter & Meta Tags
      const updateMeta = (selector: string, attr: string, value: string) => {
        let el = document.querySelector(selector) as HTMLMetaElement | null;
        if (el) {
          el.setAttribute(attr, value);
        } else {
          el = document.createElement('meta');
          const [keyName, keyValue] = selector.replace('meta[', '').replace(']', '').split('=');
          el.setAttribute(keyName, keyValue.replace(/"/g, ''));
          el.setAttribute(attr, value);
          document.head.appendChild(el);
        }
      };

      updateMeta('meta[property="og:url"]', 'content', fullCanonicalUrl);
      updateMeta('meta[property="og:title"]', 'content', currentTitle);
      updateMeta('meta[property="og:description"]', 'content', currentDescription);
      updateMeta('meta[property="og:site_name"]', 'content', 'The Ever Green Nursery');
      updateMeta('meta[name="description"]', 'content', currentDescription);
      updateMeta('meta[name="keywords"]', 'content', currentKeywords);
      updateMeta('meta[name="twitter:title"]', 'content', currentTitle);
      updateMeta('meta[name="twitter:description"]', 'content', currentDescription);

      // Dynamic Breadcrumbs Schema.org
      const breadcrumbItems = [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: canonicalBase,
        },
      ];

      if (currentView === 'plants') {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: viewParams.category ? `Wholesale ${viewParams.category}` : 'Wholesale Plants Catalogue',
          item: fullCanonicalUrl,
        });
      } else if (currentView === 'plant-detail' && currentPlant) {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: 'Wholesale Plants',
          item: `${canonicalBase}/plants`,
        });
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 3,
          name: currentPlant.name,
          item: fullCanonicalUrl,
        });
      } else if (currentView !== 'home') {
        const name = currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ');
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: name,
          item: fullCanonicalUrl,
        });
      }

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      };

      let breadcrumbScript = document.getElementById('schema-breadcrumbs') as HTMLScriptElement | null;
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script');
        breadcrumbScript.id = 'schema-breadcrumbs';
        breadcrumbScript.type = 'application/ld+json';
        document.head.appendChild(breadcrumbScript);
      }
      breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
    } catch {
      // ignore
    }
  }, [currentView, viewParams, settings, plants]);

  const navigateTo = (view: string, params: Record<string, string> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      let targetPath = '/';
      if (view !== 'home') {
        if (view === 'plant-detail' && params.id) {
          targetPath = `/plants/${params.id}`;
        } else {
          targetPath = `/${view}`;
          if (params.category) {
            targetPath += `?category=${encodeURIComponent(params.category)}`;
          }
        }
      }
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view, params }, '', targetPath);
      }
    } catch {
      // ignore
    }
  };

  const handleOpenEnquiry = (plant?: Plant, service?: Service) => {
    setEnquiryModal({
      isOpen: true,
      plant: plant || null,
      service: service || null,
    });
  };

  const handleOpenLightbox = (
    images: string[],
    index: number,
    title?: string,
    caption?: string
  ) => {
    setLightbox({
      isOpen: true,
      images,
      currentIndex: index,
      title,
      caption,
    });
  };

  const selectedPlantDetail =
    currentView === 'plant-detail' && viewParams.id
      ? plants.find((p) => p.id === viewParams.id || p.id.toLowerCase() === viewParams.id.toLowerCase())
      : null;

  const relatedPlants = selectedPlantDetail
    ? plants.filter((p) => p.category === selectedPlantDetail.category && p.id !== selectedPlantDetail.id).slice(0, 3)
    : [];

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-[#1a2e26] selection:bg-[#155e43] selection:text-white">
      {/* Seed Growth Page Loader */}
      {isLoading && <PageLoader nurseryName={settings.nurseryName} onComplete={handleLoaderComplete} />}

      {/* Main Navigation Header */}
      <Header
        currentView={currentView}
        viewParams={viewParams}
        onNavigate={navigateTo}
        settings={settings}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Main View Router with Smooth Fade + Slide Page Transition */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen"
        >
          {currentView === 'home' && (
            <HomeView
              settings={settings}
              categories={categories}
              featuredPlants={plants.filter((p) => p.published !== false)}
              services={services}
              projects={projects}
              gallery={gallery}
              testimonials={testimonials}
              onNavigate={navigateTo}
              onOpenEnquiry={handleOpenEnquiry}
              onOpenLightbox={handleOpenLightbox}
            />
          )}

          {currentView === 'plants' && (
            <PlantsCatalogueView
              plants={plants.filter((p) => p.published !== false)}
              categories={categories}
              initialCategory={viewParams.category}
              onNavigate={navigateTo}
              onOpenEnquiry={handleOpenEnquiry}
            />
          )}

          {currentView === 'plant-detail' && (
            selectedPlantDetail ? (
              <PlantDetailView
                plant={selectedPlantDetail}
                relatedPlants={relatedPlants}
                onNavigate={navigateTo}
                onOpenEnquiry={handleOpenEnquiry}
                onOpenLightbox={handleOpenLightbox}
              />
            ) : (
              <NotFoundView onNavigate={navigateTo} />
            )
          )}

          {currentView === 'categories' && (
            <CategoriesView categories={categories} onNavigate={navigateTo} />
          )}

          {currentView === 'about' && (
            <AboutView settings={settings} onNavigate={navigateTo} />
          )}

          {currentView === 'services' && (
            <ServicesView services={services} onOpenEnquiry={handleOpenEnquiry} />
          )}

          {currentView === 'projects' && (
            <ProjectsView projects={projects} onOpenEnquiry={() => handleOpenEnquiry()} />
          )}

          {currentView === 'gallery' && (
            <GalleryView
              gallery={gallery}
              plants={plants.filter((p) => p.published !== false)}
              onOpenLightbox={handleOpenLightbox}
            />
          )}

          {currentView === 'contact' && (
            <ContactView settings={settings} onOpenEnquiry={() => handleOpenEnquiry()} />
          )}

          {currentView === 'bulk-orders' && (
            <BulkOrderView settings={settings} onNavigate={navigateTo} />
          )}

          {currentView === 'privacy-policy' && (
            <PrivacyPolicyView settings={settings} onNavigate={navigateTo} />
          )}

          {currentView === 'terms' && (
            <TermsView settings={settings} onNavigate={navigateTo} />
          )}

          {currentView === 'admin' && (
            <AdminView
              settings={settings}
              categories={categories}
              plants={plants}
              services={services}
              projects={projects}
              gallery={gallery}
              testimonials={testimonials}
              onRefreshData={refreshData}
              onNavigate={navigateTo}
            />
          )}

          {![
            'home',
            'plants',
            'plant-detail',
            'categories',
            'about',
            'services',
            'projects',
            'gallery',
            'contact',
            'bulk-orders',
            'privacy-policy',
            'terms',
            'admin',
          ].includes(currentView) && <NotFoundView onNavigate={navigateTo} />}
        </motion.main>
      </AnimatePresence>

      {/* Nursery Footer */}
      <Footer
        settings={settings}
        onNavigate={navigateTo}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppButton
        settings={settings}
        whatsAppNumber={settings.whatsAppNumber}
        onOpenEnquiryModal={() => handleOpenEnquiry()}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        plants={plants.filter((p) => p.published !== false)}
        onSelectPlant={(id) => navigateTo('plant-detail', { id })}
      />

      {/* Global Contact & Plant Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModal.isOpen}
        onClose={() => setEnquiryModal({ ...enquiryModal, isOpen: false })}
        selectedPlant={enquiryModal.plant}
        selectedService={enquiryModal.service}
        whatsAppNumber={settings.whatsAppNumber}
      />

      {/* Fullscreen Photo Lightbox */}
      <Lightbox
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        onClose={() => setLightbox({ ...lightbox, isOpen: false })}
        onNavigate={(idx) => setLightbox({ ...lightbox, currentIndex: idx })}
        title={lightbox.title}
        caption={lightbox.caption}
      />
    </div>
  );
}
