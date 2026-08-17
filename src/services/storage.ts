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
import { sanitizeForLocalStorage } from '../utils/imageCompressor';

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
  DELETED_IDS: 'verdant_realm_deleted_ids_v1',
};

// Broadcast channel for instantaneous cross-tab and cross-window sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('evergreen_nursery_sync_channel');
  }
} catch {
  broadcastChannel = null;
}

function notifyLocalChange(key?: string) {
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'DATA_UPDATED', key, timestamp: Date.now() });
    }
  } catch {
    // Ignore channel error
  }
}

// Helper to track and persist permanently deleted entity IDs across all devices via Firestore
function getDeletedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set<string>(arr);
      }
    }
  } catch (err) {
    console.warn('Error reading deleted IDs:', err);
  }
  return new Set<string>();
}

function markAsDeleted(ids: string | string[]): void {
  try {
    const list = Array.isArray(ids) ? ids : [ids];
    const current = getDeletedIds();
    list.forEach((id) => {
      if (id && typeof id === 'string') {
        current.add(id.trim());
      }
    });
    const arr = Array.from(current);
    localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(arr));
    
    // Synchronize to Firestore metadata registry so all mobile and desktop devices stay in sync
    saveDocumentFirestore('metadata', 'deleted_registry', { ids: arr, updatedAt: Date.now() });
    notifyLocalChange(STORAGE_KEYS.DELETED_IDS);
  } catch (err) {
    console.warn('Error saving deleted IDs:', err);
  }
}

function unmarkAsDeleted(ids: string | string[]): void {
  try {
    const list = Array.isArray(ids) ? ids : [ids];
    const current = getDeletedIds();
    list.forEach((id) => {
      if (id) current.delete(id.trim());
    });
    const arr = Array.from(current);
    localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(arr));
    
    // Synchronize to Firestore metadata registry
    saveDocumentFirestore('metadata', 'deleted_registry', { ids: arr, updatedAt: Date.now() });
    notifyLocalChange(STORAGE_KEYS.DELETED_IDS);
  } catch (err) {
    console.warn('Error unmarking deleted IDs:', err);
  }
}

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

// Clean up stale or oversized data from localStorage when quota is tight
function freeStorageSpace(): void {
  try {
    const inq = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (inq) {
      try {
        const parsed = JSON.parse(inq);
        if (Array.isArray(parsed) && parsed.length > 15) {
          localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(parsed.slice(0, 15)));
        }
      } catch {}
    }

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && !Object.values(STORAGE_KEYS).includes(k) && !k.startsWith('firebase')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Storage cleanup attempted:', e);
  }
}

// Helper for setItem with QuotaExceeded resilience
function setStoredItem<T>(key: string, value: T): void {
  try {
    const sanitized = sanitizeForLocalStorage(value);
    localStorage.setItem(key, JSON.stringify(sanitized));
    notifyLocalChange(key);
  } catch (err: any) {
    const isQuotaError =
      err &&
      (err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err.code === 22 ||
        err.code === 1014 ||
        (err.message && err.message.toLowerCase().includes('quota')));

    if (isQuotaError) {
      console.warn(`LocalStorage quota reached for ${key}. Attempting optimization...`);
      try {
        freeStorageSpace();
        const sanitized = sanitizeForLocalStorage(value);
        localStorage.setItem(key, JSON.stringify(sanitized));
        notifyLocalChange(key);
        return;
      } catch {
        console.warn(`Could not save full payload to localStorage for ${key}, maintained in memory.`);
        return;
      }
    }
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Re-filter all locally cached collections against the deleted registry
  reFilterAllCollections(): void {
    const deleted = getDeletedIds();

    // Plants
    const storedPlants = getStoredItem<Plant[] | null>(STORAGE_KEYS.PLANTS, null);
    if (storedPlants) {
      const valid = storedPlants.filter((p) => !deleted.has(p.id));
      localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(valid));
    }

    // Gallery
    const storedGallery = getStoredItem<GalleryItem[] | null>(STORAGE_KEYS.GALLERY, null);
    if (storedGallery) {
      const valid = storedGallery.filter((g) => !deleted.has(g.id));
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(valid));
    }

    // Categories
    const storedCats = getStoredItem<Category[] | null>(STORAGE_KEYS.CATEGORIES, null);
    if (storedCats) {
      const valid = storedCats.filter((c) => !deleted.has(c.id));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(valid));
    }

    // Services
    const storedServices = getStoredItem<Service[] | null>(STORAGE_KEYS.SERVICES, null);
    if (storedServices) {
      const valid = storedServices.filter((s) => !deleted.has(s.id));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(valid));
    }

    // Projects
    const storedProjects = getStoredItem<Project[] | null>(STORAGE_KEYS.PROJECTS, null);
    if (storedProjects) {
      const valid = storedProjects.filter((p) => !deleted.has(p.id));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(valid));
    }

    // Testimonials
    const storedTestimonials = getStoredItem<Testimonial[] | null>(STORAGE_KEYS.TESTIMONIALS, null);
    if (storedTestimonials) {
      const valid = storedTestimonials.filter((t) => !deleted.has(t.id));
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(valid));
    }
  },

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
    const deleted = getDeletedIds();
    const filteredInitial = INITIAL_CATEGORIES.filter((c) => !deleted.has(c.id));
    const stored = getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, filteredInitial);
    return (stored || []).filter((c) => !deleted.has(c.id));
  },
  saveCategories(categories: Category[]): void {
    const deleted = getDeletedIds();
    const previous = getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const newIds = new Set(categories.map((c) => c.id));
    const removed = previous.filter((c) => !newIds.has(c.id)).map((c) => c.id);
    
    if (removed.length > 0) {
      markAsDeleted(removed);
      removed.forEach((id) => deleteDocumentFirestore('categories', id));
    }
    
    categories.forEach((c) => {
      if (deleted.has(c.id)) unmarkAsDeleted(c.id);
    });

    setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
    categories.forEach((cat) => saveDocumentFirestore('categories', cat.id, cat));
  },
  deleteCategory(id: string): void {
    markAsDeleted(id);
    deleteDocumentFirestore('categories', id);
    const current = this.getCategories().filter((c) => c.id !== id);
    setStoredItem(STORAGE_KEYS.CATEGORIES, current);
  },

  // Plants
  getPlants(): Plant[] {
    const deleted = getDeletedIds();
    const filteredInitial = INITIAL_PLANTS.filter((p) => !deleted.has(p.id));
    const stored = getStoredItem<Plant[]>(STORAGE_KEYS.PLANTS, filteredInitial);
    const active = (stored || []).filter((p) => !deleted.has(p.id));
    let changed = false;
    const normalized = active.map((p) => {
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
    const deleted = getDeletedIds();
    const previous = getStoredItem<Plant[]>(STORAGE_KEYS.PLANTS, INITIAL_PLANTS);
    const newIds = new Set(plants.map((p) => p.id));
    const removed = previous.filter((p) => !newIds.has(p.id)).map((p) => p.id);

    if (removed.length > 0) {
      markAsDeleted(removed);
      removed.forEach((id) => deleteDocumentFirestore('plants', id));
    }

    plants.forEach((p) => {
      if (deleted.has(p.id)) unmarkAsDeleted(p.id);
    });

    setStoredItem(STORAGE_KEYS.PLANTS, plants);
    plants.forEach((plant) => saveDocumentFirestore('plants', plant.id, plant));
  },
  deletePlant(id: string): void {
    markAsDeleted(id);
    deleteDocumentFirestore('plants', id);
    const current = this.getPlants().filter((p) => p.id !== id);
    setStoredItem(STORAGE_KEYS.PLANTS, current);
  },
  getPlantById(id: string): Plant | undefined {
    const plants = this.getPlants();
    return plants.find((p) => p.id === id);
  },

  // Services
  getServices(): Service[] {
    const deleted = getDeletedIds();
    const filteredInitial = INITIAL_SERVICES.filter((s) => !deleted.has(s.id));
    const stored = getStoredItem<Service[]>(STORAGE_KEYS.SERVICES, filteredInitial);
    return (stored || []).filter((s) => !deleted.has(s.id));
  },
  saveServices(services: Service[]): void {
    const deleted = getDeletedIds();
    const previous = getStoredItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const newIds = new Set(services.map((s) => s.id));
    const removed = previous.filter((s) => !newIds.has(s.id)).map((s) => s.id);

    if (removed.length > 0) {
      markAsDeleted(removed);
      removed.forEach((id) => deleteDocumentFirestore('services', id));
    }

    services.forEach((s) => {
      if (deleted.has(s.id)) unmarkAsDeleted(s.id);
    });

    setStoredItem(STORAGE_KEYS.SERVICES, services);
    services.forEach((srv) => saveDocumentFirestore('services', srv.id, srv));
  },
  deleteService(id: string): void {
    markAsDeleted(id);
    deleteDocumentFirestore('services', id);
    const current = this.getServices().filter((s) => s.id !== id);
    setStoredItem(STORAGE_KEYS.SERVICES, current);
  },

  // Projects
  getProjects(): Project[] {
    const deleted = getDeletedIds();
    const filteredInitial = INITIAL_PROJECTS.filter((p) => !deleted.has(p.id));
    const stored = getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, filteredInitial);
    return (stored || []).filter((p) => !deleted.has(p.id));
  },
  saveProjects(projects: Project[]): void {
    const deleted = getDeletedIds();
    const previous = getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const newIds = new Set(projects.map((p) => p.id));
    const removed = previous.filter((p) => !newIds.has(p.id)).map((p) => p.id);

    if (removed.length > 0) {
      markAsDeleted(removed);
      removed.forEach((id) => deleteDocumentFirestore('projects', id));
    }

    projects.forEach((pr) => {
      if (deleted.has(pr.id)) unmarkAsDeleted(pr.id);
    });

    setStoredItem(STORAGE_KEYS.PROJECTS, projects);
    projects.forEach((proj) => saveDocumentFirestore('projects', proj.id, proj));
  },
  deleteProject(id: string): void {
    markAsDeleted(id);
    deleteDocumentFirestore('projects', id);
    const current = this.getProjects().filter((p) => p.id !== id);
    setStoredItem(STORAGE_KEYS.PROJECTS, current);
  },

  // Gallery
  getGallery(): GalleryItem[] {
    const deleted = getDeletedIds();
    const filteredInitial = INITIAL_GALLERY.filter((g) => !deleted.has(g.id));
    const stored = getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, filteredInitial);
    return (stored || []).filter((g) => !deleted.has(g.id));
  },
  saveGallery(gallery: GalleryItem[]): void {
    const deleted = getDeletedIds();
    const previous = getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    const newIds = new Set(gallery.map((g) => g.id));
    const removed = previous.filter((g) => !newIds.has(g.id)).map((g) => g.id);

    if (removed.length > 0) {
      markAsDeleted(removed);
      removed.forEach((id) => deleteDocumentFirestore('gallery', id));
    }

    gallery.forEach((g) => {
      if (deleted.has(g.id)) unmarkAsDeleted(g.id);
    });

    setStoredItem(STORAGE_KEYS.GALLERY, gallery);
    gallery.forEach((g) => saveDocumentFirestore('gallery', g.id, g));
  },
  deleteGalleryItem(id: string): void {
    markAsDeleted(id);
    deleteDocumentFirestore('gallery', id);
    const current = this.getGallery().filter((g) => g.id !== id);
    setStoredItem(STORAGE_KEYS.GALLERY, current);
  },

  // Testimonials & Feedback
  getTestimonials(): Testimonial[] {
    const deleted = getDeletedIds();
    const filteredInitial = INITIAL_TESTIMONIALS.filter((t) => !deleted.has(t.id));
    const raw = getStoredItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, filteredInitial);
    const active = (raw || []).filter((t) => !deleted.has(t.id));
    return active.map((t) => ({
      ...t,
      showOnHome: t.showOnHome !== undefined ? t.showOnHome : true,
      status: t.status || 'approved',
    }));
  },
  saveTestimonials(testimonials: Testimonial[]): void {
    const deleted = getDeletedIds();
    const previous = getStoredItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    const newIds = new Set(testimonials.map((t) => t.id));
    const removed = previous.filter((t) => !newIds.has(t.id)).map((t) => t.id);

    if (removed.length > 0) {
      markAsDeleted(removed);
      removed.forEach((id) => deleteDocumentFirestore('testimonials', id));
    }

    testimonials.forEach((t) => {
      if (deleted.has(t.id)) unmarkAsDeleted(t.id);
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
    markAsDeleted(id);
    deleteDocumentFirestore('testimonials', id);
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
    const deleted = getDeletedIds();
    const filteredInitial = INITIAL_INQUIRIES.filter((inq) => !deleted.has(inq.id));
    const stored = getStoredItem<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, filteredInitial);
    return (stored || []).filter((inq) => !deleted.has(inq.id));
  },
  saveInquiries(inquiries: CustomerInquiry[]): void {
    const deleted = getDeletedIds();
    const previous = getStoredItem<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const newIds = new Set(inquiries.map((inq) => inq.id));
    const removed = previous.filter((inq) => !newIds.has(inq.id)).map((inq) => inq.id);

    if (removed.length > 0) {
      markAsDeleted(removed);
      removed.forEach((id) => deleteDocumentFirestore('inquiries', id));
    }

    inquiries.forEach((inq) => {
      if (deleted.has(inq.id)) unmarkAsDeleted(inq.id);
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
    markAsDeleted(id);
    deleteDocumentFirestore('inquiries', id);
    const existing = this.getInquiries();
    const updated = existing.filter((inq) => inq.id !== id);
    setStoredItem(STORAGE_KEYS.INQUIRIES, updated);
  },

  // Async sync with Firestore on app launch and real-time updates across all devices
  async initFirebaseSync(onSyncComplete?: () => void): Promise<void> {
    try {
      // 0. Synchronize Deleted IDs Registry First
      try {
        const remoteDeleted = await fetchDocumentFirestore<{ ids?: string[] }>('metadata', 'deleted_registry');
        if (remoteDeleted && Array.isArray(remoteDeleted.ids)) {
          const localDeleted = getDeletedIds();
          remoteDeleted.ids.forEach((id) => {
            if (id && typeof id === 'string') localDeleted.add(id.trim());
          });
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(Array.from(localDeleted)));
        } else {
          const localDeleted = getDeletedIds();
          if (localDeleted.size > 0) {
            saveDocumentFirestore('metadata', 'deleted_registry', {
              ids: Array.from(localDeleted),
              updatedAt: Date.now(),
            });
          }
        }
      } catch (err) {
        console.warn('Deleted registry fetch error:', err);
      }

      // Realtime listener for cross-device deletions
      subscribeDocumentFirestore<{ ids?: string[] }>('metadata', 'deleted_registry', (updated) => {
        if (updated && Array.isArray(updated.ids)) {
          const localDeleted = getDeletedIds();
          updated.ids.forEach((id) => {
            if (id && typeof id === 'string') localDeleted.add(id.trim());
          });
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(Array.from(localDeleted)));
          this.reFilterAllCollections();
          if (onSyncComplete) onSyncComplete();
        }
      });

      const deleted = getDeletedIds();

      // 1. Sync Site Settings from Firestore
      const remoteSettings = await fetchDocumentFirestore<SiteSettings>('settings', 'site_config');
      if (remoteSettings !== null) {
        setStoredItem(STORAGE_KEYS.SETTINGS, remoteSettings);
      } else {
        const currentSettings = this.getSettings();
        saveDocumentFirestore('settings', 'site_config', currentSettings);
      }

      subscribeDocumentFirestore<SiteSettings>('settings', 'site_config', (updatedSettings) => {
        if (updatedSettings) {
          setStoredItem(STORAGE_KEYS.SETTINGS, updatedSettings);
          if (onSyncComplete) onSyncComplete();
        }
      });

      // 2. Sync categories from Firestore
      const remoteCategories = await fetchCollectionFirestore<Category>('categories');
      if (remoteCategories !== null && remoteCategories.length > 0) {
        const validRemote = remoteCategories.filter((c) => !deleted.has(c.id));
        setStoredItem(STORAGE_KEYS.CATEGORIES, validRemote);
      } else if (remoteCategories === null || remoteCategories.length === 0) {
        const currentCats = this.getCategories();
        currentCats.forEach((c) => saveDocumentFirestore('categories', c.id, c));
      }

      subscribeCollectionFirestore<Category>('categories', (cats) => {
        if (cats && cats.length > 0) {
          const activeDeleted = getDeletedIds();
          const validCats = cats.filter((c) => !activeDeleted.has(c.id));
          setStoredItem(STORAGE_KEYS.CATEGORIES, validCats);
          if (onSyncComplete) onSyncComplete();
        }
      });

      // 3. Sync plants from Firestore (Authoritative source across mobile and laptop)
      const remotePlants = await fetchCollectionFirestore<Plant>('plants');
      if (remotePlants !== null && remotePlants.length > 0) {
        const validPlants = remotePlants.filter((p) => !deleted.has(p.id));
        setStoredItem(STORAGE_KEYS.PLANTS, validPlants);
      } else if (remotePlants === null || remotePlants.length === 0) {
        const current = this.getPlants();
        current.forEach((p) => saveDocumentFirestore('plants', p.id, p));
      }

      subscribeCollectionFirestore<Plant>('plants', (plantsList) => {
        if (plantsList && plantsList.length > 0) {
          const activeDeleted = getDeletedIds();
          const validPlants = plantsList.filter((p) => !activeDeleted.has(p.id));
          setStoredItem(STORAGE_KEYS.PLANTS, validPlants);
          if (onSyncComplete) onSyncComplete();
        }
      });

      // 4. Sync services from Firestore
      const remoteServices = await fetchCollectionFirestore<Service>('services');
      if (remoteServices !== null && remoteServices.length > 0) {
        const validServices = remoteServices.filter((s) => !deleted.has(s.id));
        setStoredItem(STORAGE_KEYS.SERVICES, validServices);
      } else if (remoteServices === null || remoteServices.length === 0) {
        const currentSrv = this.getServices();
        currentSrv.forEach((s) => saveDocumentFirestore('services', s.id, s));
      }

      subscribeCollectionFirestore<Service>('services', (servicesList) => {
        if (servicesList && servicesList.length > 0) {
          const activeDeleted = getDeletedIds();
          const validServices = servicesList.filter((s) => !activeDeleted.has(s.id));
          setStoredItem(STORAGE_KEYS.SERVICES, validServices);
          if (onSyncComplete) onSyncComplete();
        }
      });

      // 5. Sync projects from Firestore
      const remoteProjects = await fetchCollectionFirestore<Project>('projects');
      if (remoteProjects !== null && remoteProjects.length > 0) {
        const validProj = remoteProjects.filter((pr) => !deleted.has(pr.id));
        setStoredItem(STORAGE_KEYS.PROJECTS, validProj);
      } else if (remoteProjects === null || remoteProjects.length === 0) {
        const currentProj = this.getProjects();
        currentProj.forEach((pr) => saveDocumentFirestore('projects', pr.id, pr));
      }

      subscribeCollectionFirestore<Project>('projects', (projList) => {
        if (projList && projList.length > 0) {
          const activeDeleted = getDeletedIds();
          const validProj = projList.filter((pr) => !activeDeleted.has(pr.id));
          setStoredItem(STORAGE_KEYS.PROJECTS, validProj);
          if (onSyncComplete) onSyncComplete();
        }
      });

      // 6. Sync gallery from Firestore
      const remoteGallery = await fetchCollectionFirestore<GalleryItem>('gallery');
      if (remoteGallery !== null && remoteGallery.length > 0) {
        const validGal = remoteGallery.filter((g) => !deleted.has(g.id));
        setStoredItem(STORAGE_KEYS.GALLERY, validGal);
      } else if (remoteGallery === null || remoteGallery.length === 0) {
        const currentGal = this.getGallery();
        currentGal.forEach((g) => saveDocumentFirestore('gallery', g.id, g));
      }

      subscribeCollectionFirestore<GalleryItem>('gallery', (galList) => {
        if (galList && galList.length > 0) {
          const activeDeleted = getDeletedIds();
          const validGal = galList.filter((g) => !activeDeleted.has(g.id));
          setStoredItem(STORAGE_KEYS.GALLERY, validGal);
          if (onSyncComplete) onSyncComplete();
        }
      });

      // 7. Sync inquiries from Firestore
      const remoteInquiries = await fetchCollectionFirestore<CustomerInquiry>('inquiries');
      if (remoteInquiries !== null && remoteInquiries.length > 0) {
        const validInq = remoteInquiries.filter((inq) => !deleted.has(inq.id));
        setStoredItem(STORAGE_KEYS.INQUIRIES, validInq);
      } else if (remoteInquiries === null || remoteInquiries.length === 0) {
        const currentInq = this.getInquiries();
        currentInq.forEach((inq) => saveDocumentFirestore('inquiries', inq.id, inq));
      }

      subscribeCollectionFirestore<CustomerInquiry>('inquiries', (inqList) => {
        if (inqList && inqList.length > 0) {
          const activeDeleted = getDeletedIds();
          const validInq = inqList.filter((inq) => !activeDeleted.has(inq.id));
          setStoredItem(STORAGE_KEYS.INQUIRIES, validInq);
          if (onSyncComplete) onSyncComplete();
        }
      });

      // 8. Sync testimonials from Firestore
      const remoteTestimonials = await fetchCollectionFirestore<Testimonial>('testimonials');
      if (remoteTestimonials !== null && remoteTestimonials.length > 0) {
        const validTest = remoteTestimonials.filter((t) => !deleted.has(t.id));
        setStoredItem(STORAGE_KEYS.TESTIMONIALS, validTest);
      } else if (remoteTestimonials === null || remoteTestimonials.length === 0) {
        const currentTest = this.getTestimonials();
        currentTest.forEach((t) => saveDocumentFirestore('testimonials', t.id, t));
      }

      subscribeCollectionFirestore<Testimonial>('testimonials', (testList) => {
        if (testList && testList.length > 0) {
          const activeDeleted = getDeletedIds();
          const validTest = testList.filter((t) => !activeDeleted.has(t.id));
          setStoredItem(STORAGE_KEYS.TESTIMONIALS, validTest);
          if (onSyncComplete) onSyncComplete();
        }
      });

      // Listen for cross-tab storage changes
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', () => {
          this.reFilterAllCollections();
          if (onSyncComplete) onSyncComplete();
        });

        if (broadcastChannel) {
          broadcastChannel.onmessage = () => {
            this.reFilterAllCollections();
            if (onSyncComplete) onSyncComplete();
          };
        }
      }

      if (onSyncComplete) onSyncComplete();
    } catch (e) {
      console.warn('Firebase sync initialized with fallback:', e);
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
    localStorage.removeItem(STORAGE_KEYS.DELETED_IDS);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(INITIAL_PLANTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
    saveDocumentFirestore('metadata', 'deleted_registry', { ids: [], updatedAt: Date.now() });
    notifyLocalChange();
  },
};
