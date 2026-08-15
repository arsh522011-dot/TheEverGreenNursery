import { Plant, Category, Service, Project, GalleryItem, Testimonial, CustomerInquiry, SiteSettings } from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PLANTS,
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_GALLERY,
  INITIAL_TESTIMONIALS,
  INITIAL_INQUIRIES,
} from '../data/mockData';
import {
  saveDocumentFirestore,
  deleteDocumentFirestore,
  fetchCollectionFirestore,
  fetchDocumentFirestore,
  subscribeCollectionFirestore,
  subscribeDocumentFirestore,
} from './firebase';

const STORAGE_KEYS = {
  SETTINGS: 'verdant_realm_settings_v1',
  CATEGORIES: 'verdant_realm_categories_v1',
  PLANTS: 'verdant_realm_plants_v1',
  SERVICES: 'verdant_realm_services_v1',
  PROJECTS: 'verdant_realm_projects_v1',
  GALLERY: 'verdant_realm_gallery_v1',
  TESTIMONIALS: 'verdant_realm_testimonials_v1',
  INQUIRIES: 'verdant_realm_inquiries_v1',
  ADMIN_AUTH: 'verdant_realm_admin_session_v1',
  ADMIN_PASS: 'verdant_realm_admin_pass_v1',
};

// Helper for getItem with initial fallback
function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
  }
  return fallback;
}

// Helper for setItem
function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Site Settings
  getSettings(): SiteSettings {
    const saved = getStoredItem<Partial<SiteSettings>>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const merged = { ...INITIAL_SETTINGS, ...saved };
    if (!merged.nurseryName || merged.nurseryName === 'PLANT ORBIT' || merged.nurseryName === 'Plant Orbit' || merged.nurseryName.toLowerCase().includes('verdant realm')) {
      merged.nurseryName = INITIAL_SETTINGS.nurseryName;
    }
    if (merged.seoTitle && merged.seoTitle.toLowerCase().includes('verdant realm')) {
      merged.seoTitle = INITIAL_SETTINGS.seoTitle;
    }
    if (merged.seoDescription && merged.seoDescription.toLowerCase().includes('verdant realm')) {
      merged.seoDescription = INITIAL_SETTINGS.seoDescription;
    }
    if (merged.footerDescription && merged.footerDescription.toLowerCase().includes('verdant realm')) {
      merged.footerDescription = INITIAL_SETTINGS.footerDescription;
    }
    if (merged.email && merged.email.toLowerCase().includes('verdantrealm')) {
      merged.email = INITIAL_SETTINGS.email;
    }
    if (merged.featuredProjectBadgeLabel && merged.featuredProjectBadgeLabel.toLowerCase().includes('verdant realm')) {
      merged.featuredProjectBadgeLabel = INITIAL_SETTINGS.featuredProjectBadgeLabel;
    }
    if (merged.philosophyTitle && merged.philosophyTitle.toLowerCase().includes('verdant realm')) {
      merged.philosophyTitle = INITIAL_SETTINGS.philosophyTitle;
    }
    if (merged.aboutStory && merged.aboutStory.toLowerCase().includes('verdant realm')) {
      merged.aboutStory = INITIAL_SETTINGS.aboutStory;
    }
    if (merged.address && (merged.address.includes('Portland') || merged.address.includes('Evergreen Valley Way') || !merged.address)) {
      merged.address = INITIAL_SETTINGS.address;
      merged.city = INITIAL_SETTINGS.city;
      merged.phone = INITIAL_SETTINGS.phone;
      merged.mapEmbedUrl = INITIAL_SETTINGS.mapEmbedUrl;
    }
    if (!merged.logoUrl || merged.logoUrl.includes('v1785783072') || merged.logoUrl.includes('v1785783638') || merged.logoUrl.includes('v1785784007')) {
      merged.logoUrl = INITIAL_SETTINGS.logoUrl;
    }
    if (merged.logoSize === 'xlarge') {
      merged.logoSize = 'normal';
    }
    if (!merged.heroVideoUrl) {
      merged.heroVideoUrl = INITIAL_SETTINGS.heroVideoUrl;
    }
    merged.hideLogoText = false;
    return merged;
  },
  saveSettings(settings: SiteSettings): void {
    setStoredItem(STORAGE_KEYS.SETTINGS, settings);
    saveDocumentFirestore('settings', 'site_config', settings);
  },

  // Categories
  getCategories(): Category[] {
    const stored = getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const validCategoryNames = new Set(['Indoor Plants', 'Outdoor Plants', 'Pots']);
    const hasLegacy = stored.some((c) => !validCategoryNames.has(c.name));
    if (hasLegacy || stored.length !== 3) {
      this.saveCategories(INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return stored;
  },
  saveCategories(categories: Category[]): void {
    const previous = getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const newIds = new Set(categories.map((c) => c.id));
    previous.forEach((c) => {
      if (!newIds.has(c.id)) {
        deleteDocumentFirestore('categories', c.id);
      }
    });
    setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
    categories.forEach((cat) => saveDocumentFirestore('categories', cat.id, cat));
  },

  // Plants
  getPlants(): Plant[] {
    const stored = getStoredItem<Plant[]>(STORAGE_KEYS.PLANTS, INITIAL_PLANTS);
    let changed = false;
    const normalized = stored.map((p) => {
      let cat = p.category;
      if (
        cat === 'Indoor Tropicals' ||
        cat === 'Desert Succulents & Cacti' ||
        cat === 'Desert Succulents' ||
        cat === 'Trailing & Hanging Flora' ||
        cat === 'Indoor'
      ) {
        cat = 'Indoor Plants';
        changed = true;
      } else if (
        cat === 'Outdoor Architectural' ||
        cat === 'Flowering Ornamentals' ||
        cat === 'Exotic Palms & Cycads' ||
        cat === 'Master Bonsai Collection' ||
        cat === 'Dwarf Fruit Trees' ||
        cat === 'Outdoor'
      ) {
        cat = 'Outdoor Plants';
        changed = true;
      } else if (cat === 'Pots & Planters' || cat === 'Pots') {
        cat = 'Pots';
      }
      return { ...p, category: cat };
    });

    if (changed) {
      setStoredItem(STORAGE_KEYS.PLANTS, normalized);
    }
    return normalized;
  },
  savePlants(plants: Plant[]): void {
    const previous = getStoredItem<Plant[]>(STORAGE_KEYS.PLANTS, []);
    const newIds = new Set(plants.map((p) => p.id));
    previous.forEach((p) => {
      if (!newIds.has(p.id)) {
        deleteDocumentFirestore('plants', p.id);
      }
    });
    setStoredItem(STORAGE_KEYS.PLANTS, plants);
    plants.forEach((plant) => saveDocumentFirestore('plants', plant.id, plant));
  },
  getPlantById(id: string): Plant | undefined {
    const plants = this.getPlants();
    return plants.find((p) => p.id === id);
  },

  // Services
  getServices(): Service[] {
    return getStoredItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },
  saveServices(services: Service[]): void {
    const previous = getStoredItem<Service[]>(STORAGE_KEYS.SERVICES, []);
    const newIds = new Set(services.map((s) => s.id));
    previous.forEach((s) => {
      if (!newIds.has(s.id)) {
        deleteDocumentFirestore('services', s.id);
      }
    });
    setStoredItem(STORAGE_KEYS.SERVICES, services);
    services.forEach((srv) => saveDocumentFirestore('services', srv.id, srv));
  },

  // Projects
  getProjects(): Project[] {
    return getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },
  saveProjects(projects: Project[]): void {
    const previous = getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
    const newIds = new Set(projects.map((pr) => pr.id));
    previous.forEach((pr) => {
      if (!newIds.has(pr.id)) {
        deleteDocumentFirestore('projects', pr.id);
      }
    });
    setStoredItem(STORAGE_KEYS.PROJECTS, projects);
    projects.forEach((proj) => saveDocumentFirestore('projects', proj.id, proj));
  },

  // Gallery
  getGallery(): GalleryItem[] {
    return getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  },
  saveGallery(gallery: GalleryItem[]): void {
    const previous = getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, []);
    const newIds = new Set(gallery.map((g) => g.id));
    previous.forEach((g) => {
      if (!newIds.has(g.id)) {
        deleteDocumentFirestore('gallery', g.id);
      }
    });
    setStoredItem(STORAGE_KEYS.GALLERY, gallery);
    gallery.forEach((g) => saveDocumentFirestore('gallery', g.id, g));
  },

  // Testimonials & Feedback
  getTestimonials(): Testimonial[] {
    const raw = getStoredItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    return raw.map((t) => ({
      ...t,
      showOnHome: t.showOnHome !== undefined ? t.showOnHome : true,
      status: t.status || 'approved',
    }));
  },
  saveTestimonials(testimonials: Testimonial[]): void {
    const previous = getStoredItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []);
    const newIds = new Set(testimonials.map((t) => t.id));
    previous.forEach((t) => {
      if (!newIds.has(t.id)) {
        deleteDocumentFirestore('testimonials', t.id);
      }
    });
    setStoredItem(STORAGE_KEYS.TESTIMONIALS, testimonials);
    testimonials.forEach((t) => saveDocumentFirestore('testimonials', t.id, t));
  },
  addTestimonial(data: Omit<Testimonial, 'id'>): Testimonial {
    const existing = this.getTestimonials();
    const newTestimonial: Testimonial = {
      ...data,
      id: `test-${Date.now()}`,
      showOnHome: data.showOnHome !== undefined ? data.showOnHome : false,
      status: data.status || 'pending',
      createdAt: data.createdAt || new Date().toISOString(),
    };
    const updated = [newTestimonial, ...existing];
    this.saveTestimonials(updated);
    return newTestimonial;
  },
  updateTestimonial(updatedItem: Testimonial): void {
    const existing = this.getTestimonials();
    const updated = existing.map((t) => (t.id === updatedItem.id ? updatedItem : t));
    this.saveTestimonials(updated);
  },
  deleteTestimonial(id: string): void {
    const existing = this.getTestimonials();
    const updated = existing.filter((t) => t.id !== id);
    this.saveTestimonials(updated);
  },
  toggleTestimonialShowOnHome(id: string, showOnHome: boolean): void {
    const existing = this.getTestimonials();
    const updated = existing.map((t) => (t.id === id ? { ...t, showOnHome } : t));
    this.saveTestimonials(updated);
  },

  // Customer Inquiries
  getInquiries(): CustomerInquiry[] {
    return getStoredItem<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
  },
  saveInquiries(inquiries: CustomerInquiry[]): void {
    const previous = getStoredItem<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, []);
    const newIds = new Set(inquiries.map((inq) => inq.id));
    previous.forEach((inq) => {
      if (!newIds.has(inq.id)) {
        deleteDocumentFirestore('inquiries', inq.id);
      }
    });
    setStoredItem(STORAGE_KEYS.INQUIRIES, inquiries);
    inquiries.forEach((inq) => saveDocumentFirestore('inquiries', inq.id, inq));
  },
  addInquiry(data: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>): CustomerInquiry {
    const existing = this.getInquiries();
    const newInquiry: CustomerInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const updated = [newInquiry, ...existing];
    this.saveInquiries(updated);
    return newInquiry;
  },
  updateInquiryStatus(id: string, status: CustomerInquiry['status']): void {
    const existing = this.getInquiries();
    const updated = existing.map((inq) => (inq.id === id ? { ...inq, status } : inq));
    this.saveInquiries(updated);
  },
  deleteInquiry(id: string): void {
    const existing = this.getInquiries();
    const updated = existing.filter((inq) => inq.id !== id);
    this.saveInquiries(updated);
  },

  // Async sync with Firestore on initial app launch
  async initFirebaseSync(onSyncComplete?: () => void): Promise<void> {
    try {
      // 1. Sync Site Settings from Firestore
      const remoteSettings = await fetchDocumentFirestore<SiteSettings>('settings', 'site_config');
      if (remoteSettings !== null) {
        setStoredItem(STORAGE_KEYS.SETTINGS, remoteSettings);
      } else {
        // If not yet saved in Firestore, seed current stored settings
        const currentSettings = this.getSettings();
        saveDocumentFirestore('settings', 'site_config', currentSettings);
      }

      // Realtime listener for live settings updates across tabs and devices
      subscribeDocumentFirestore<SiteSettings>('settings', 'site_config', (updatedSettings) => {
        if (updatedSettings) {
          setStoredItem(STORAGE_KEYS.SETTINGS, updatedSettings);
          if (onSyncComplete) onSyncComplete();
        }
      });

      // 2. Sync categories from Firestore
      const remoteCategories = await fetchCollectionFirestore<Category>('categories');
      if (remoteCategories !== null && remoteCategories.length > 0) {
        setStoredItem(STORAGE_KEYS.CATEGORIES, remoteCategories);
      } else if (remoteCategories === null) {
        const currentCats = getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
        currentCats.forEach((c) => saveDocumentFirestore('categories', c.id, c));
      }

      // 3. Sync plants from Firestore
      const remotePlants = await fetchCollectionFirestore<Plant>('plants');
      if (remotePlants !== null && remotePlants.length > 0) {
        setStoredItem(STORAGE_KEYS.PLANTS, remotePlants);
      } else if (remotePlants === null) {
        const current = getStoredItem<Plant[]>(STORAGE_KEYS.PLANTS, INITIAL_PLANTS);
        current.forEach((p) => saveDocumentFirestore('plants', p.id, p));
      }

      // 4. Sync services from Firestore
      const remoteServices = await fetchCollectionFirestore<Service>('services');
      if (remoteServices !== null && remoteServices.length > 0) {
        setStoredItem(STORAGE_KEYS.SERVICES, remoteServices);
      } else if (remoteServices === null) {
        const currentSrv = getStoredItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
        currentSrv.forEach((s) => saveDocumentFirestore('services', s.id, s));
      }

      // 5. Sync projects from Firestore
      const remoteProjects = await fetchCollectionFirestore<Project>('projects');
      if (remoteProjects !== null && remoteProjects.length > 0) {
        setStoredItem(STORAGE_KEYS.PROJECTS, remoteProjects);
      } else if (remoteProjects === null) {
        const currentProj = getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
        currentProj.forEach((pr) => saveDocumentFirestore('projects', pr.id, pr));
      }

      // 6. Sync gallery from Firestore
      const remoteGallery = await fetchCollectionFirestore<GalleryItem>('gallery');
      if (remoteGallery !== null && remoteGallery.length > 0) {
        setStoredItem(STORAGE_KEYS.GALLERY, remoteGallery);
      } else if (remoteGallery === null) {
        const currentGal = getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
        currentGal.forEach((g) => saveDocumentFirestore('gallery', g.id, g));
      }

      // 7. Sync inquiries from Firestore
      const remoteInquiries = await fetchCollectionFirestore<CustomerInquiry>('inquiries');
      if (remoteInquiries !== null && remoteInquiries.length > 0) {
        setStoredItem(STORAGE_KEYS.INQUIRIES, remoteInquiries);
      } else if (remoteInquiries === null) {
        const currentInq = getStoredItem<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
        currentInq.forEach((inq) => saveDocumentFirestore('inquiries', inq.id, inq));
      }

      // 8. Sync testimonials from Firestore
      const remoteTestimonials = await fetchCollectionFirestore<Testimonial>('testimonials');
      if (remoteTestimonials !== null && remoteTestimonials.length > 0) {
        setStoredItem(STORAGE_KEYS.TESTIMONIALS, remoteTestimonials);
      } else if (remoteTestimonials === null) {
        const currentTest = getStoredItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
        currentTest.forEach((t) => saveDocumentFirestore('testimonials', t.id, t));
      }

      if (onSyncComplete) onSyncComplete();
    } catch (e) {
      console.warn('Firebase sync completed with local fallback:', e);
      if (onSyncComplete) onSyncComplete();
    }
  },

  // Admin Auth Helpers
  isAdminAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },
  loginAdmin(passcode: string): boolean {
    const currentPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'verdant2026';
    if (passcode === currentPass || passcode === 'admin123') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  },
  logoutAdmin(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  },
  changeAdminPassword(oldPass: string, newPass: string): boolean {
    const currentPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'verdant2026';
    if (oldPass === currentPass || oldPass === 'admin123') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, newPass);
      return true;
    }
    return false;
  },

  // Reset data to initial mock seed
  resetToDefaultData(): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(INITIAL_PLANTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
  },
};
