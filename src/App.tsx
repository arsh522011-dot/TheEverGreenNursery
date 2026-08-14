import React, { useState, useEffect } from 'react';
import { PageLoader } from './components/common/PageLoader';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { EnquiryModal } from './components/common/EnquiryModal';
import { Lightbox } from './components/common/Lightbox';
import { SearchModal } from './components/common/SearchModal';

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

// Helper to parse route from URL
function parseUrlRoute(): { view: string; params: Record<string, string> } {
  try {
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      params[key] = val;
    });

    if (!pathname || pathname === '') {
      return { view: 'home', params };
    }

    if (pathname.startsWith('plants/')) {
      const id = pathname.replace('plants/', '');
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

    if (validViews.includes(pathname)) {
      return { view: pathname, params };
    }
  } catch {
    // fallback
  }
  return { view: 'home', params: {} };
}

export default function App() {
  const initialRoute = parseUrlRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [viewParams, setViewParams] = useState<Record<string, string>>(initialRoute.params);

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

  const refreshData = () => {
    setSettings(StorageService.getSettings());
    setCategories(StorageService.getCategories());
    setPlants(StorageService.getPlants());
    setServices(StorageService.getServices());
    setProjects(StorageService.getProjects());
    setGallery(StorageService.getGallery());
    setTestimonials(StorageService.getTestimonials());
  };

  useEffect(() => {
    StorageService.initFirebaseSync(refreshData);

    const handlePopState = () => {
      const parsed = parseUrlRoute();
      setCurrentView(parsed.view);
      setViewParams(parsed.params);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      ? plants.find((p) => p.id === viewParams.id)
      : null;

  const relatedPlants = selectedPlantDetail
    ? plants.filter((p) => p.category === selectedPlantDetail.category && p.id !== selectedPlantDetail.id).slice(0, 3)
    : [];

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-[#1a2e26] selection:bg-[#155e43] selection:text-white">
      {/* Seed Growth Page Loader */}
      {isLoading && <PageLoader nurseryName={settings.nurseryName} onComplete={() => setIsLoading(false)} />}

      {/* Main Navigation Header */}
      <Header
        currentView={currentView}
        viewParams={viewParams}
        onNavigate={navigateTo}
        settings={settings}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Main View Router */}
      <main className="min-h-screen">
        {currentView === 'home' && (
          <HomeView
            settings={settings}
            categories={categories}
            featuredPlants={plants.filter((p) => p.isFeatured && p.published)}
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
            plants={plants.filter((p) => p.published)}
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
          <GalleryView gallery={gallery} onOpenLightbox={handleOpenLightbox} />
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
      </main>

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
        plants={plants.filter((p) => p.published)}
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
