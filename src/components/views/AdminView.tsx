import React, { useState, useEffect } from 'react';
import { CloudinaryUploader } from '../common/CloudinaryUploader';
import {
  Plant,
  Category,
  Service,
  Project,
  GalleryItem,
  Testimonial,
  CustomerInquiry,
  SiteSettings,
} from '../../types';
import { StorageService } from '../../services/storage';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  LogOut,
  Save,
  Key,
  Layers,
  Sprout,
  Briefcase,
  Image,
  Award,
  Settings,
  X,
  Eye,
  EyeOff,
  Package,
  Compass,
  MapPin,
  Star,
  Sparkles,
  CheckCircle2,
  Cloud,
  Upload,
  AlertCircle,
  ExternalLink,
  Inbox,
  MessageSquare,
  Filter,
  Search,
  Mail,
  Phone,
  Building,
  Calendar,
  ArrowUpRight,
  MessageSquarePlus,
  ThumbsUp,
} from 'lucide-react';

interface AdminViewProps {
  settings: SiteSettings;
  categories: Category[];
  plants: Plant[];
  services: Service[];
  projects: Project[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  onRefreshData: () => void;
  onNavigate: (view: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  settings,
  categories,
  plants,
  services,
  projects,
  gallery,
  testimonials,
  onRefreshData,
  onNavigate,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(StorageService.isAdminAuthenticated());
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'plants' | 'pots' | 'categories' | 'projects' | 'services' | 'gallery' | 'testimonials' | 'inquiries' | 'settings' | 'about' | 'cloudinary' | 'whatsapp'
  >('plants');

  const plantItems = plants.filter((p) => !p.category.toLowerCase().includes('pot'));
  const potItems = plants.filter((p) => p.category.toLowerCase().includes('pot'));

  // Inquiries State
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => StorageService.getInquiries());
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<'all' | 'contact' | 'bulk_order' | 'plant_enquiry' | 'feedback'>('all');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);

  const refreshInquiries = () => {
    setInquiries(StorageService.getInquiries());
  };

  const newInquiriesCount = inquiries.filter((inq) => inq.status === 'new').length;

  // Modals / Editing States
  const [editingPlant, setEditingPlant] = useState<Partial<Plant> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Lock background body scroll whenever any admin modal popup is active
  useBodyScrollLock(
    Boolean(
      editingPlant ||
        editingCategory ||
        editingProject ||
        editingService ||
        editingGallery ||
        editingTestimonial ||
        selectedInquiry ||
        deleteConfirmation.isOpen
    )
  );

  // Settings State
  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState('');

  useEffect(() => {
    setSiteForm(settings);
  }, [settings]);

  // Password Change State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // Authentication Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (StorageService.loginAdmin(passcode)) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passcode. (Default is "verdant2026" or "admin123")');
    }
  };

  const handleLogout = () => {
    StorageService.logoutAdmin();
    setIsAuthenticated(false);
  };

  // Plant CRUD
  const handleSavePlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlant || !editingPlant.name) return;

    const current = StorageService.getPlants();
    if (editingPlant.id) {
      // Update
      const updated = current.map((p) => (p.id === editingPlant.id ? ({ ...p, ...editingPlant } as Plant) : p));
      StorageService.savePlants(updated);
    } else {
      // Create
      const newP: Plant = {
        id: `plant-${Date.now()}`,
        name: editingPlant.name || 'New Plant',
        scientificName: editingPlant.scientificName || 'Botanical Name',
        category: editingPlant.category || categories[0]?.name || 'Indoor Tropicals',
        shortDescription: editingPlant.shortDescription || 'Short description',
        description: editingPlant.description || 'Full description',
        images: editingPlant.images && editingPlant.images.length ? editingPlant.images : ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80'],
        sunlight: editingPlant.sunlight || 'Indirect Light',
        water: editingPlant.water || 'Moderate',
        difficulty: editingPlant.difficulty || 'Easy Care',
        size: editingPlant.size || 'Medium (2-4 ft)',
        soil: editingPlant.soil || 'Well draining peat mix',
        temperature: editingPlant.temperature || '65°F - 85°F',
        maintenance: editingPlant.maintenance || 'Wipe leaves bi-weekly',
        placement: editingPlant.placement || 'Bright indirect light',
        benefits: editingPlant.benefits || ['Air purifying', 'Resilient'],
        careGuide: editingPlant.careGuide || [{ step: '01', title: 'Watering', detail: 'Check top soil dry' }],
        isFeatured: editingPlant.isFeatured || false,
        published: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      StorageService.savePlants([newP, ...current]);
    }

    setEditingPlant(null);
    onRefreshData();
  };

  const handleDeletePlant = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: 'Delete Plant',
      message: 'Are you sure you want to delete this plant from the catalogue?',
      onConfirm: () => {
        const updated = StorageService.getPlants().filter((p) => p.id !== id);
        StorageService.savePlants(updated);
        onRefreshData();
      },
    });
  };

  const handleTogglePlantPublish = (plant: Plant) => {
    const updated = StorageService.getPlants().map((p) => (p.id === plant.id ? { ...p, published: !p.published } : p));
    StorageService.savePlants(updated);
    onRefreshData();
  };

  // Category CRUD
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    const current = StorageService.getCategories();
    if (editingCategory.id) {
      const updated = current.map((c) => (c.id === editingCategory.id ? ({ ...c, ...editingCategory } as Category) : c));
      StorageService.saveCategories(updated);
    } else {
      const newC: Category = {
        id: `cat-${Date.now()}`,
        name: editingCategory.name,
        slug: editingCategory.name.toLowerCase().replace(/\s+/g, '-'),
        description: editingCategory.description || '',
        image: editingCategory.image || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80',
        plantCount: 0,
      };
      StorageService.saveCategories([...current, newC]);
    }
    setEditingCategory(null);
    onRefreshData();
  };

  const handleDeleteCategory = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category?',
      onConfirm: () => {
        const updated = StorageService.getCategories().filter((c) => c.id !== id);
        StorageService.saveCategories(updated);
        onRefreshData();
      },
    });
  };

  // Service CRUD
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    const current = StorageService.getServices();
    if (editingService.id) {
      const updated = current.map((s) => (s.id === editingService.id ? ({ ...s, ...editingService } as Service) : s));
      StorageService.saveServices(updated);
    } else {
      const newS: Service = {
        id: `srv-${Date.now()}`,
        title: editingService.title || 'New Service',
        shortDesc: editingService.shortDesc || '',
        fullDesc: editingService.fullDesc || '',
        image: editingService.image || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
        features: editingService.features && editingService.features.length ? editingService.features : ['Professional Execution', 'Quality Guarantee'],
        badge: editingService.badge || '',
      };
      StorageService.saveServices([...current, newS]);
    }
    setEditingService(null);
    onRefreshData();
  };

  const handleDeleteService = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: 'Delete Service',
      message: 'Are you sure you want to delete this service?',
      onConfirm: () => {
        const updated = StorageService.getServices().filter((s) => s.id !== id);
        StorageService.saveServices(updated);
        onRefreshData();
      },
    });
  };

  // Project CRUD
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    const current = StorageService.getProjects();
    const finalAfter = editingProject.afterImage || editingProject.beforeImage || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80';

    if (editingProject.id) {
      const updated = current.map((p) =>
        p.id === editingProject.id
          ? ({ ...p, ...editingProject, afterImage: finalAfter } as Project)
          : p
      );
      StorageService.saveProjects(updated);
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: editingProject.title || 'New Project',
        category: editingProject.category || 'Landscape Design',
        location: editingProject.location || 'Delhi NCR',
        description: editingProject.description || '',
        beforeImage: editingProject.beforeImage || '',
        afterImage: finalAfter,
        galleryImages: editingProject.galleryImages && editingProject.galleryImages.length ? editingProject.galleryImages : [finalAfter],
        plantsUsed: editingProject.plantsUsed && editingProject.plantsUsed.length ? editingProject.plantsUsed : ['Custom Plant Selection'],
        results: editingProject.results || 'Transformational green space achieved.',
        featured: editingProject.featured ?? true,
      };
      StorageService.saveProjects([newProj, ...current]);
    }
    setEditingProject(null);
    onRefreshData();
  };

  const handleDeleteProject = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project?',
      onConfirm: () => {
        const updated = StorageService.getProjects().filter((p) => p.id !== id);
        StorageService.saveProjects(updated);
        onRefreshData();
      },
    });
  };

  const handleToggleProjectFeatured = (proj: Project) => {
    const updated = StorageService.getProjects().map((p) => (p.id === proj.id ? { ...p, featured: !p.featured } : p));
    StorageService.saveProjects(updated);
    if (!proj.featured) {
      const updatedSettings = { ...siteForm, featuredProjectId: proj.id };
      setSiteForm(updatedSettings);
      StorageService.saveSettings(updatedSettings);
    }
    onRefreshData();
  };

  // Gallery CRUD
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery || !editingGallery.title) return;

    const current = StorageService.getGallery();
    if (editingGallery.id) {
      const updated = current.map((g) => (g.id === editingGallery.id ? ({ ...g, ...editingGallery } as GalleryItem) : g));
      StorageService.saveGallery(updated);
    } else {
      const newGal: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: editingGallery.title || 'New Photo',
        category: (editingGallery.category as any) || 'Nursery',
        image: editingGallery.image || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
        caption: editingGallery.caption || '',
      };
      StorageService.saveGallery([newGal, ...current]);
    }
    setEditingGallery(null);
    onRefreshData();
  };

  const handleDeleteGallery = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: 'Delete Photo',
      message: 'Are you sure you want to delete this photo from the gallery?',
      onConfirm: () => {
        const updated = StorageService.getGallery().filter((g) => g.id !== id);
        StorageService.saveGallery(updated);
        onRefreshData();
      },
    });
  };

  // Inquiry Action Handlers
  const handleUpdateInquiryStatus = (id: string, status: CustomerInquiry['status']) => {
    StorageService.updateInquiryStatus(id, status);
    refreshInquiries();
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
  };

  const handleDeleteInquiry = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: 'Delete Customer Inquiry',
      message: 'Are you sure you want to delete this customer inquiry?',
      onConfirm: () => {
        StorageService.deleteInquiry(id);
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
        refreshInquiries();
      },
    });
  };

  const handleConvertFeedbackToTestimonial = (inq: CustomerInquiry) => {
    StorageService.addTestimonial({
      name: inq.name,
      email: inq.email,
      phone: inq.phone,
      role: 'Verified Customer',
      location: 'Website Review',
      content: inq.message,
      rating: inq.rating || 5,
      showOnHome: true,
      status: 'approved',
    });
    StorageService.updateInquiryStatus(inq.id, 'replied');
    refreshInquiries();
    onRefreshData();
    alert(`Feedback from "${inq.name}" approved and featured on Homepage!`);
  };

  const handleToggleTestimonialHome = (id: string, currentShow: boolean) => {
    StorageService.toggleTestimonialShowOnHome(id, !currentShow);
    onRefreshData();
  };

  const handleApproveTestimonial = (id: string) => {
    const current = StorageService.getTestimonials();
    const updated = current.map((t) => (t.id === id ? { ...t, status: 'approved' as const, showOnHome: true } : t));
    StorageService.saveTestimonials(updated);
    onRefreshData();
  };

  // Testimonial CRUD
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.name) return;

    const current = StorageService.getTestimonials();
    if (editingTestimonial.id) {
      const updated = current.map((t) => (t.id === editingTestimonial.id ? ({ ...t, ...editingTestimonial } as Testimonial) : t));
      StorageService.saveTestimonials(updated);
    } else {
      const newTestimonial: Testimonial = {
        id: `test-${Date.now()}`,
        name: editingTestimonial.name || 'Client Name',
        role: editingTestimonial.role || 'Plant Enthusiast',
        content: editingTestimonial.content || '',
        rating: editingTestimonial.rating || 5,
        location: editingTestimonial.location || 'Local Client',
        showOnHome: editingTestimonial.showOnHome !== undefined ? editingTestimonial.showOnHome : true,
        status: editingTestimonial.status || 'approved',
        createdAt: new Date().toISOString(),
      };
      StorageService.saveTestimonials([newTestimonial, ...current]);
    }
    setEditingTestimonial(null);
    onRefreshData();
  };

  const handleDeleteTestimonial = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: 'Delete Testimonial',
      message: 'Are you sure you want to delete this testimonial?',
      onConfirm: () => {
        const updated = StorageService.getTestimonials().filter((t) => t.id !== id);
        StorageService.saveTestimonials(updated);
        onRefreshData();
      },
    });
  };

  // Save Site Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(siteForm);
    setSavedSuccess('Nursery Settings Saved Successfully!');
    setTimeout(() => setSavedSuccess(''), 3000);
    onRefreshData();
  };

  // Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (StorageService.changeAdminPassword(oldPass, newPass)) {
      setPassMsg('Passcode Updated Successfully!');
      setOldPass('');
      setNewPass('');
      setTimeout(() => setPassMsg(''), 3000);
    } else {
      setPassMsg('Current Passcode Incorret.');
    }
  };

  // Reset Data
  const handleResetData = () => {
    setDeleteConfirmation({
      isOpen: true,
      title: 'Reset Nursery Data',
      message: 'WARNING: Reset all nursery plants, categories, gallery items, testimonials, and settings back to default seed state?',
      onConfirm: () => {
        StorageService.resetToDefaultData();
        onRefreshData();
        refreshInquiries();
      },
    });
  };

  // Unauthenticated Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="bg-[#062319] text-white min-h-screen flex items-center justify-center p-4 pt-28">
        <div className="w-full max-w-md bg-[#0b3829] border border-emerald-500/30 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-900 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl text-emerald-100">Nursery Admin Login</h1>
            <p className="text-xs text-emerald-300/80">Authorized Access for Catalogue Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-emerald-300 mb-1">Admin Passcode</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (default: verdant2026)"
                className="w-full bg-[#062319] border border-emerald-800 rounded-xl p-3 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {authError && <p className="text-xs text-red-400 bg-red-950/80 p-2.5 rounded-xl border border-red-800">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#062319] font-bold text-xs uppercase tracking-wider shadow-lg transition-colors"
            >
              Unlock Admin Panel
            </button>
          </form>

          <p className="text-center text-[10px] font-mono text-emerald-400/60">
            Default passcode: <span className="text-emerald-300">verdant2026</span> or <span className="text-emerald-300">admin123</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Admin Bar */}
        <div className="bg-[#062319] text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl text-emerald-100">Nursery Admin Control Panel</h1>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                Logged in • Catalogue Management Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-red-500/30 text-red-300 hover:bg-red-950 text-xs font-mono uppercase flex items-center gap-1.5"
              title="Reset data back to initial seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock Panel</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-emerald-900/10 shadow-sm scrollbar-none">
          {[
            { id: 'inquiries', label: 'Inquiries & Feedback', icon: Inbox, count: newInquiriesCount, isNewBadge: newInquiriesCount > 0 },
            { id: 'plants', label: 'Plants', icon: Sprout, count: plantItems.length },
            { id: 'pots', label: 'Pots', icon: Package, count: potItems.length },
            { id: 'categories', label: 'Categories', icon: Layers, count: categories.length },
            { id: 'services', label: 'Services', icon: Briefcase, count: services.length },
            { id: 'projects', label: 'Projects', icon: Image, count: projects.length },
            { id: 'gallery', label: 'Gallery', icon: Image, count: gallery.length },
            { id: 'testimonials', label: 'Testimonials & Reviews', icon: Award, count: testimonials.length },
            { id: 'about', label: 'About Our Nursery', icon: Building },
            { id: 'whatsapp', label: 'WhatsApp Control', icon: MessageSquare },
            { id: 'settings', label: 'Site Settings & SEO', icon: Settings },
            { id: 'cloudinary', label: 'Cloudinary CDN', icon: Cloud },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#062319] text-emerald-300 shadow-md'
                    : 'text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors ${
                      tab.isNewBadge
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : isActive
                        ? 'bg-emerald-900 text-emerald-200'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PLANTS MANAGER */}
        {activeTab === 'plants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#062319]">Plant Catalogue Specimens ({plantItems.length})</h2>
              <button
                onClick={() =>
                  setEditingPlant({
                    name: '',
                    scientificName: '',
                    category: categories.find((c) => c.name !== 'Pots')?.name || 'Indoor Tropicals',
                    shortDescription: '',
                    description: '',
                    images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80'],
                    sunlight: 'Indirect Light',
                    water: 'Moderate',
                    difficulty: 'Easy Care',
                    size: 'Medium (2-4 ft)',
                    soil: 'Rich potting blend',
                    temperature: '65°F - 85°F',
                    placement: 'Bright indirect light',
                    benefits: ['Air purifying'],
                    careGuide: [{ step: '01', title: 'Watering', detail: 'Check top soil' }],
                    isFeatured: false,
                    published: true,
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Plant</span>
              </button>
            </div>

            {/* Plants Table */}
            <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#062319] text-emerald-200 font-mono uppercase text-[10px] tracking-wider border-b border-emerald-800">
                  <tr>
                    <th className="p-4">Specimen</th>
                    <th className="p-4">Taxonomy</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Sun / Water</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/10">
                  {plantItems.map((plant) => (
                    <tr key={plant.id} className="hover:bg-emerald-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={plant.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div>
                          <span className="font-serif font-medium text-sm text-[#062319] block">{plant.name}</span>
                          {plant.isFeatured && (
                            <span className="inline-block text-[9px] font-mono text-amber-600 font-bold uppercase">★ Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 italic font-mono text-emerald-800">{plant.scientificName}</td>
                      <td className="p-4 font-mono">{plant.category}</td>
                      <td className="p-4 font-mono">{plant.sunlight} / {plant.water}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleTogglePlantPublish(plant)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase flex items-center gap-1 ${
                            plant.published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {plant.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{plant.published ? 'Published' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingPlant(plant)}
                          className="p-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          title="Edit Plant"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlant(plant.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                          title="Delete Plant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 1.5: POTS MANAGER */}
        {activeTab === 'pots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#062319]">Pots Inventory ({potItems.length})</h2>
              <button
                onClick={() =>
                  setEditingPlant({
                    name: '',
                    scientificName: 'Ceramic / Terracotta Container',
                    category: 'Pots',
                    shortDescription: '',
                    description: '',
                    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80'],
                    sunlight: 'Indirect Light',
                    water: 'Moderate',
                    difficulty: 'Easy Care',
                    size: 'Medium (2-4 ft)',
                    soil: 'Durable Glazed Pottery',
                    temperature: 'All Seasons',
                    placement: 'Indoor / Outdoor',
                    benefits: ['Breathable Clay', 'Drainage Hole'],
                    careGuide: [{ step: '01', title: 'Cleaning', detail: 'Wipe clean with a damp cloth' }],
                    isFeatured: false,
                    published: true,
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Pot</span>
              </button>
            </div>

            {/* Pots Table */}
            <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#062319] text-emerald-200 font-mono uppercase text-[10px] tracking-wider border-b border-emerald-800">
                  <tr>
                    <th className="p-4">Pot Specimen</th>
                    <th className="p-4">Type / Material</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/10">
                  {potItems.map((pot) => (
                    <tr key={pot.id} className="hover:bg-emerald-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={pot.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div>
                          <span className="font-serif font-medium text-sm text-[#062319] block">{pot.name}</span>
                          {pot.isFeatured && (
                            <span className="inline-block text-[9px] font-mono text-amber-600 font-bold uppercase">★ Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 italic font-mono text-emerald-800">{pot.scientificName}</td>
                      <td className="p-4 font-mono">{pot.category}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleTogglePlantPublish(pot)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase flex items-center gap-1 ${
                            pot.published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {pot.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{pot.published ? 'Published' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingPlant(pot)}
                          className="p-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          title="Edit Pot"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlant(pot.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                          title="Delete Pot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES MANAGER */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#062319]">Plant Categories ({categories.length})</h2>
              <button
                onClick={() => setEditingCategory({ name: '', description: '', image: '' })}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white p-5 rounded-3xl border border-emerald-900/10 shadow-sm space-y-3">
                  <img src={cat.image} alt="" className="w-full h-40 object-cover rounded-2xl" />
                  <h3 className="font-serif text-lg text-[#062319]">{cat.name}</h3>
                  <p className="text-xs text-emerald-900/70 line-clamp-2">{cat.description}</p>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="p-2 rounded-lg bg-emerald-100 text-emerald-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES MANAGER */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#062319]">Services Portfolio ({services.length})</h2>
                <p className="text-xs text-emerald-800">Manage landscaping, maintenance, and green consultancy services</p>
              </div>
              <button
                onClick={() =>
                  setEditingService({
                    title: '',
                    badge: 'Popular',
                    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
                    shortDesc: '',
                    fullDesc: '',
                    features: ['Professional Execution', 'Quality Guarantee', 'On-time Delivery'],
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-3xl border border-emerald-900/10 shadow-sm overflow-hidden flex flex-col justify-between p-5 space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <img src={service.image} alt={service.title} className="w-full h-44 object-cover rounded-2xl" />
                      {service.badge && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#062319] text-emerald-300 text-[10px] font-mono uppercase tracking-wider font-bold shadow-md">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-[#062319]">{service.title}</h3>
                    <p className="text-xs text-emerald-900/80 font-medium">{service.shortDesc}</p>
                    <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed">{service.fullDesc}</p>
                    {service.features && service.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {service.features.map((feat, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-emerald-900/10 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingService(service)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold hover:bg-emerald-200 flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#062319]">Landscape Portfolio Projects ({projects.length})</h2>
                <p className="text-xs text-emerald-800">Showcase before/after transformations, commercial, & residential greenery builds</p>
              </div>
              <button
                onClick={() =>
                  setEditingProject({
                    title: '',
                    category: 'Landscape Design',
                    location: 'Delhi NCR',
                    description: '',
                    beforeImage: '',
                    afterImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
                    galleryImages: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80'],
                    plantsUsed: ['Monstera', 'Snake Plant', 'Areca Palm'],
                    results: 'Turnkey green oasis created with 100% client satisfaction.',
                    featured: true,
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* FEATURED COMPLETED PROJECT CONTROL PANEL */}
            <div className="bg-[#062319] p-6 sm:p-8 rounded-3xl text-white space-y-6 shadow-xl border border-emerald-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-700/50 rounded-2xl border border-emerald-500/30 text-emerald-300">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-700/50 font-bold">
                        Homepage Showcase Section
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-emerald-100 mt-1">
                      Featured Completed Project Section Control
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer bg-emerald-950 p-1.5 rounded-full border border-emerald-700/50 shrink-0">
                    <input
                      type="checkbox"
                      checked={siteForm.featuredProjectShowOnHome !== false}
                      onChange={(e) => {
                        const updated = { ...siteForm, featuredProjectShowOnHome: e.target.checked };
                        setSiteForm(updated);
                        StorageService.saveSettings(updated);
                        setSavedSuccess('Featured Section Visibility Updated!');
                        onRefreshData();
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[8px] after:left-[8px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    <span className="ml-3 text-xs font-mono font-bold text-emerald-200 pr-2">
                      {siteForm.featuredProjectShowOnHome !== false ? 'SECTION ENABLED' : 'SECTION HIDDEN'}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={(e) => handleSaveSettings(e)}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Controls</span>
                  </button>
                </div>
              </div>

              {/* Grid of Inputs: Section Title, Eyebrow, Badge, & Active Project Picker */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                    Section Eyebrow Subtitle
                  </label>
                  <input
                    type="text"
                    value={siteForm.featuredProjectSectionSubtitle || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, featuredProjectSectionSubtitle: e.target.value })}
                    placeholder="LANDSCAPE ARCHITECTURE"
                    className="w-full bg-[#083023] border border-emerald-700/50 rounded-xl p-2.5 text-xs text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                    Section Heading Title
                  </label>
                  <input
                    type="text"
                    value={siteForm.featuredProjectSectionTitle || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, featuredProjectSectionTitle: e.target.value })}
                    placeholder="Featured Completed Project"
                    className="w-full bg-[#083023] border border-emerald-700/50 rounded-xl p-2.5 text-xs text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                    Top Badge Label Text
                  </label>
                  <input
                    type="text"
                    value={siteForm.featuredProjectBadgeLabel || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, featuredProjectBadgeLabel: e.target.value })}
                    placeholder="THE EVERGREEN NURSERY LANDSCAPE"
                    className="w-full bg-[#083023] border border-emerald-700/50 rounded-xl p-2.5 text-xs text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                    Select Active Featured Project
                  </label>
                  <select
                    value={siteForm.featuredProjectId || projects[0]?.id || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const updatedSettings = { ...siteForm, featuredProjectId: selectedId };
                      setSiteForm(updatedSettings);
                      StorageService.saveSettings(updatedSettings);

                      // Also mark this project as featured in projects list
                      const updatedProjects = StorageService.getProjects().map((p) => ({
                        ...p,
                        featured: p.id === selectedId,
                      }));
                      StorageService.saveProjects(updatedProjects);
                      setSavedSuccess('Featured Project Changed!');
                      onRefreshData();
                    }}
                    className="w-full bg-[#083023] border border-emerald-700/50 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-400"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#062319] text-white">
                        {p.title} ({p.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Direct Quick Image Editor for Current Active Featured Project */}
              {(() => {
                const currentFeatured =
                  projects.find((p) => p.id === siteForm.featuredProjectId) ||
                  projects.find((p) => p.featured) ||
                  projects[0];
                if (!currentFeatured) return null;

                return (
                  <div className="p-4 bg-[#083023] rounded-2xl border border-emerald-700/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentFeatured.afterImage}
                          alt={currentFeatured.title}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-400/50 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                              CURRENTLY DISPLAYED ON HOMEPAGE
                            </span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-white mt-1">
                            {currentFeatured.title}
                          </h4>
                          <p className="text-[11px] font-mono text-emerald-300">
                            Location: {currentFeatured.location} • Category: {currentFeatured.category}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingProject(currentFeatured)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Full Project Details</span>
                      </button>
                    </div>

                    <div className="bg-[#062319] p-3 rounded-xl border border-emerald-800">
                      <CloudinaryUploader
                        value={currentFeatured.afterImage || ''}
                        onChange={(url) => {
                          const updatedProjects = StorageService.getProjects().map((p) =>
                            p.id === currentFeatured.id ? { ...p, afterImage: url } : p
                          );
                          StorageService.saveProjects(updatedProjects);
                          setSavedSuccess('Featured Project Photo Updated!');
                          onRefreshData();
                        }}
                        label="Change Featured Completed Project Image (Cloudinary or Direct URL)"
                        placeholder="Paste image link or upload via Cloudinary..."
                        siteSettings={siteForm}
                        helpText="Updates the photo shown in the 'Featured Completed Project' section on your homepage immediately."
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white rounded-3xl border border-emerald-900/10 shadow-sm overflow-hidden p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="relative h-44 rounded-2xl overflow-hidden group">
                      <img src={proj.afterImage || proj.beforeImage} alt={proj.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#062319]/90 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                        Completed Work Image
                      </span>
                      {proj.beforeImage && proj.beforeImage !== proj.afterImage && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-900/80 text-amber-200 text-[9px] font-mono uppercase tracking-wider backdrop-blur-md">
                          Before/After Available
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg text-[#062319]">{proj.title}</h3>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-800 mt-0.5">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-600" />{proj.location}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border text-[10px]">{proj.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleProjectFeatured(proj)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase flex items-center gap-1 shrink-0 ${
                          proj.featured ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${proj.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{proj.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{proj.description}</p>
                    
                    {proj.results && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-900/10 text-xs text-emerald-900 font-serif italic">
                        " Key Outcome: {proj.results} "
                      </div>
                    )}

                    {proj.plantsUsed && proj.plantsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {proj.plantsUsed.map((pName, pIdx) => (
                          <span key={pIdx} className="px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-900 text-[10px] font-mono">
                            🌱 {pName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-emerald-900/10 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingProject(proj)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold hover:bg-emerald-200 flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Project</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#062319]">Gallery Photography Showcase ({gallery.length})</h2>
                <p className="text-xs text-emerald-800">Upload and organize nursery photos, rare specimens, & garden installations</p>
              </div>
              <button
                onClick={() =>
                  setEditingGallery({
                    title: '',
                    category: 'Nursery',
                    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
                    caption: '',
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gallery Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-emerald-900/10 shadow-sm overflow-hidden flex flex-col justify-between p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#062319]/90 text-emerald-300 text-[10px] font-mono uppercase tracking-wider shadow-md">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-[#062319] leading-tight">{item.title}</h3>
                    {item.caption && <p className="text-xs text-emerald-900/70 italic line-clamp-2">{item.caption}</p>}
                  </div>

                  <div className="pt-2 border-t border-emerald-900/10 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingGallery(item)}
                      className="p-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      title="Edit Photo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: INQUIRIES & WEBSITE FEEDBACK MANAGER */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            {/* Header & Stats Cards */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[#062319] flex items-center gap-2">
                  <Inbox className="w-6 h-6 text-emerald-700" />
                  <span>Inquiries & Customer Feedback</span>
                  {newInquiriesCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono text-xs font-bold animate-pulse">
                      {newInquiriesCount} New
                    </span>
                  )}
                </h2>
                <p className="text-xs text-emerald-800">
                  Manage contact form messages, bulk order requests, plant availability inquiries, and public feedback
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => refreshInquiries()}
                  className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-900 hover:bg-emerald-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refresh List</span>
                </button>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-sm space-y-1">
                <p className="text-[10px] font-mono uppercase text-emerald-800 font-semibold">Total Submissions</p>
                <p className="text-2xl font-serif font-bold text-[#062319]">{inquiries.length}</p>
              </div>
              <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 shadow-sm space-y-1">
                <p className="text-[10px] font-mono uppercase text-amber-800 font-semibold">Unread / New</p>
                <p className="text-2xl font-serif font-bold text-amber-900">{newInquiriesCount}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-900/10 shadow-sm space-y-1">
                <p className="text-[10px] font-mono uppercase text-emerald-800 font-semibold">Bulk Orders</p>
                <p className="text-2xl font-serif font-bold text-[#062319]">
                  {inquiries.filter((i) => i.type === 'bulk_order').length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-sm space-y-1">
                <p className="text-[10px] font-mono uppercase text-purple-800 font-semibold">Reviews / Feedback</p>
                <p className="text-2xl font-serif font-bold text-purple-950">
                  {inquiries.filter((i) => i.type === 'feedback').length}
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Type Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Submissions' },
                  { id: 'contact', label: 'Contact Msgs' },
                  { id: 'bulk_order', label: 'Bulk Orders' },
                  { id: 'plant_enquiry', label: 'Plant Availability' },
                  { id: 'feedback', label: 'User Feedback & Reviews' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setInquiryTypeFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                      inquiryTypeFilter === tab.id
                        ? 'bg-[#062319] text-emerald-300 shadow-xs'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Status Pills + Search */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value as any)}
                  className="w-full sm:w-auto text-xs bg-emerald-50 border border-emerald-900/10 rounded-xl px-3 py-2 font-medium text-emerald-900 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New / Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>

                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search name, msg..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#faf8f5] border border-emerald-900/10 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Inquiries Cards Grid / List */}
            {(() => {
              const filtered = inquiries.filter((inq) => {
                if (inquiryTypeFilter !== 'all' && inq.type !== inquiryTypeFilter) return false;
                if (inquiryStatusFilter !== 'all' && inq.status !== inquiryStatusFilter) return false;
                if (inquirySearch) {
                  const q = inquirySearch.toLowerCase();
                  const matchName = inq.name?.toLowerCase().includes(q);
                  const matchEmail = inq.email?.toLowerCase().includes(q);
                  const matchSubject = inq.subject?.toLowerCase().includes(q);
                  const matchMsg = inq.message?.toLowerCase().includes(q);
                  const matchCompany = inq.companyName?.toLowerCase().includes(q);
                  const matchGst = inq.companyGst?.toLowerCase().includes(q);
                  return matchName || matchEmail || matchSubject || matchMsg || matchCompany || matchGst;
                }
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white rounded-3xl p-12 text-center border border-emerald-900/10 space-y-3">
                    <Inbox className="w-12 h-12 text-gray-300 mx-auto" />
                    <h3 className="font-serif text-lg text-emerald-950">No Inquiries Found</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      There are no submissions matching your current filters or search criteria.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filtered.map((inq) => {
                    const isNew = inq.status === 'new';

                    return (
                      <div
                        key={inq.id}
                        className={`bg-white rounded-2xl p-5 border shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          isNew
                            ? 'border-amber-400 bg-amber-50/20 shadow-md ring-1 ring-amber-400/30'
                            : 'border-emerald-900/10 hover:border-emerald-900/20'
                        }`}
                      >
                        {/* Main Info */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Type Badge */}
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                inq.type === 'bulk_order'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : inq.type === 'feedback'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : inq.type === 'plant_enquiry'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}
                            >
                              {inq.type.replace('_', ' ')}
                            </span>

                            {/* Status Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                                inq.status === 'new'
                                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                                  : inq.status === 'replied'
                                  ? 'bg-emerald-600 text-white'
                                  : inq.status === 'read'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {inq.status.toUpperCase()}
                            </span>

                            {/* Star Rating if feedback */}
                            {inq.type === 'feedback' && inq.rating && (
                              <div className="flex items-center text-amber-400 gap-0.5 ml-2">
                                {Array.from({ length: inq.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                                ))}
                                <span className="text-[10px] font-mono text-gray-500 ml-1">({inq.rating}/5 Stars)</span>
                              </div>
                            )}

                            <span className="text-[10px] font-mono text-gray-400 ml-auto">
                              {new Date(inq.createdAt).toLocaleString([], {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>

                          {/* Customer Details */}
                          <div>
                            <h4 className="font-serif font-bold text-base text-[#062319] flex items-center gap-2">
                              <span>{inq.name}</span>
                              {inq.companyName && (
                                <span className="text-xs text-emerald-800 font-mono font-normal">
                                  • {inq.companyName}
                                </span>
                              )}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-1">
                              {inq.email && (
                                <a href={`mailto:${inq.email}`} className="hover:text-emerald-700 flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-emerald-700" />
                                  <span>{inq.email}</span>
                                </a>
                              )}
                              {inq.phone && (
                                <a href={`tel:${inq.phone}`} className="hover:text-emerald-700 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-emerald-700" />
                                  <span>{inq.phone}</span>
                                </a>
                              )}
                              {inq.companyGst && (
                                <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200 font-semibold">
                                  GST: {inq.companyGst}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Subject & Message snippet */}
                          <div className="bg-[#faf8f5] p-3 rounded-xl border border-emerald-900/5 text-xs text-gray-700 space-y-1">
                            {inq.subject && <p className="font-semibold text-emerald-950">{inq.subject}</p>}
                            <p className="italic line-clamp-2">"{inq.message}"</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-900/10">
                          <button
                            onClick={() => {
                              if (inq.status === 'new') handleUpdateInquiryStatus(inq.id, 'read');
                              setSelectedInquiry(inq);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-800 text-emerald-100 hover:bg-emerald-900 text-xs font-semibold flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Full Details</span>
                          </button>

                          {/* Reply WhatsApp */}
                          {inq.phone && (
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${inq.name}, thank you for contacting The Ever Green Nursery regarding: "${inq.subject || 'your inquiry'}".`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => handleUpdateInquiryStatus(inq.id, 'replied')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp Reply</span>
                            </a>
                          )}

                          {/* Convert Feedback to Testimonial */}
                          {inq.type === 'feedback' && (
                            <button
                              onClick={() => handleConvertFeedbackToTestimonial(inq)}
                              className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                              title="Approve and feature this customer feedback as a Testimonial on the homepage"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Show on Home</span>
                            </button>
                          )}

                          <div className="flex items-center gap-1 mt-1">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                              className="text-[10px] bg-slate-100 border border-slate-300 rounded px-1.5 py-1 font-mono text-slate-800"
                            >
                              <option value="new">Mark New</option>
                              <option value="read">Mark Read</option>
                              <option value="replied">Mark Replied</option>
                              <option value="archived">Mark Archived</option>
                            </select>

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB: TESTIMONIALS MANAGER */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[#062319]">Client Testimonials & Home Reviews ({testimonials.length})</h2>
                <p className="text-xs text-emerald-800">Manage customer reviews and select which feedback is published on the home screen</p>
              </div>
              <button
                onClick={() =>
                  setEditingTestimonial({
                    name: '',
                    role: 'Verified Customer',
                    content: '',
                    rating: 5,
                    location: '',
                    showOnHome: true,
                    status: 'approved',
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item) => {
                const isShownOnHome = item.showOnHome !== false;

                return (
                  <div key={item.id} className="bg-white rounded-3xl border border-emerald-900/10 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.avatar ? (
                            <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-emerald-600/30 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#062319] text-emerald-100 flex items-center justify-center font-bold font-serif text-sm border border-emerald-600/30 shadow-sm shrink-0">
                              {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div>
                            <h3 className="font-serif font-bold text-sm text-[#062319]">{item.name}</h3>
                            <p className="text-[10px] text-emerald-700 font-mono uppercase">{item.role}</p>
                            {item.location && <p className="text-[10px] text-gray-400">{item.location}</p>}
                          </div>
                        </div>

                        <div className="flex items-center text-amber-400 gap-0.5">
                          {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Content quote */}
                      <p className="text-xs text-gray-600 italic bg-[#faf8f5] p-3 rounded-xl border border-emerald-900/5 line-clamp-4">
                        "{item.content}"
                      </p>

                      {/* Homepage Visibility Toggle Banner */}
                      <div className="pt-2 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-mono font-semibold text-slate-700 flex items-center gap-1.5">
                          <Eye className={`w-3.5 h-3.5 ${isShownOnHome ? 'text-emerald-600' : 'text-gray-400'}`} />
                          <span>Show on Home Screen</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleTestimonialHome(item.id, isShownOnHome)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isShownOnHome ? 'bg-emerald-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isShownOnHome ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-900/10 flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isShownOnHome ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isShownOnHome ? 'Visible on Home' : 'Hidden from Home'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTestimonial(item)}
                          className="p-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs flex items-center gap-1 font-medium"
                          title="Edit Testimonial"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(item.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs flex items-center gap-1 font-medium"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: ABOUT OUR NURSERY PAGE CONTENT MANAGER */}
        {activeTab === 'about' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#062319] text-emerald-300 flex items-center justify-center shadow-md">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-[#062319]">About Our Nursery Page Manager</h2>
                  <p className="text-xs text-emerald-800">
                    Manually customize all text, hero banner, story narrative, mission & vision, stats metrics, and philosophy pillars on your About page
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                  <span>View Public About Page</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* SECTION 1: HERO HEADER & BANNER */}
              <div className="p-6 bg-[#062319] text-white rounded-2xl space-y-5 shadow-sm border border-emerald-500/20">
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                  <h3 className="font-serif text-lg font-bold text-emerald-200 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    About Page Hero Banner & Header Title
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-900/80 px-2.5 py-1 rounded-full">
                    Top Screen Section
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-emerald-300 mb-1">
                      Header Subtitle / Eyebrow Text
                    </label>
                    <input
                      type="text"
                      value={siteForm.aboutEyebrow || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutEyebrow: e.target.value })}
                      placeholder="e.g. OUR BOTANICAL HERITAGE"
                      className="w-full bg-[#0b3829] border border-emerald-700/60 rounded-xl p-3 text-sm font-mono text-white placeholder-emerald-600/70"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-emerald-300 mb-1">
                      Main Banner Headline Title
                    </label>
                    <input
                      type="text"
                      value={siteForm.aboutTitle || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutTitle: e.target.value })}
                      placeholder="e.g. Cultivating Life, Beauty & Architectural Flora Since 2012"
                      className="w-full bg-[#0b3829] border border-emerald-700/60 rounded-xl p-3 text-sm font-serif font-bold text-white placeholder-emerald-600/70"
                    />
                  </div>
                </div>

                <div>
                  <CloudinaryUploader
                    value={siteForm.aboutBgImage || ''}
                    onChange={(url) => setSiteForm({ ...siteForm, aboutBgImage: url })}
                    label="Hero Banner Background Cover Image"
                    placeholder="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=2000&q=85"
                    siteSettings={siteForm}
                    helpText="Upload a high-resolution nursery landscape photo to Cloudinary or paste image URL."
                  />
                </div>
              </div>

              {/* SECTION 2: MAIN NURSERY STORY NARRATIVE */}
              <div className="p-6 bg-emerald-50/50 border border-emerald-900/10 rounded-2xl space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#062319] flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-700" />
                    Nursery Heritage & Story Narrative
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Provide a detailed history of your nursery, acres under cultivation, botanical passion, and client promise
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-emerald-900 mb-1">
                    About Nursery Main Story / Narrative Paragraph *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={siteForm.aboutStory}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutStory: e.target.value })}
                    placeholder="Founded in 2012 nestled in the misty river valleys, The Ever Green Nursery began as a passion project for rare tropical taxonomy..."
                    className="w-full bg-white border border-emerald-900/15 rounded-xl p-3.5 text-sm text-emerald-950 leading-relaxed font-sans shadow-2xs"
                  />
                  <p className="text-[11px] font-mono text-gray-500 mt-1 text-right">
                    Character Count: {siteForm.aboutStory ? siteForm.aboutStory.length : 0} chars
                  </p>
                </div>
              </div>

              {/* SECTION 3: MISSION & VISION STATEMENTS */}
              <div className="p-6 bg-[#faf8f5] border border-emerald-900/10 rounded-2xl space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#062319]">Mission & Vision Statements</h3>
                  <p className="text-xs text-emerald-800">Customize the dual highlight cards displayed on the About page</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mission Card */}
                  <div className="bg-white p-4.5 rounded-xl border border-emerald-900/10 space-y-3">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Mission Statement Card</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.aboutMissionTitle || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, aboutMissionTitle: e.target.value })}
                        placeholder="Botanical Biodiversity & Preservation"
                        className="w-full border border-emerald-900/15 rounded-lg p-2 text-xs font-bold text-emerald-950 bg-[#faf8f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={3}
                        value={siteForm.aboutMissionDesc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, aboutMissionDesc: e.target.value })}
                        placeholder="Bringing standard botanical biodiversity to urban living..."
                        className="w-full border border-emerald-900/15 rounded-lg p-2 text-xs text-emerald-950 leading-relaxed bg-[#faf8f5]"
                      />
                    </div>
                  </div>

                  {/* Vision Card */}
                  <div className="bg-white p-4.5 rounded-xl border border-emerald-900/10 space-y-3">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Vision Statement Card</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.aboutVisionTitle || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, aboutVisionTitle: e.target.value })}
                        placeholder="Gold Standard Landscape Architecture"
                        className="w-full border border-emerald-900/15 rounded-lg p-2 text-xs font-bold text-emerald-950 bg-[#faf8f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={3}
                        value={siteForm.aboutVisionDesc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, aboutVisionDesc: e.target.value })}
                        placeholder="Setting the gold standard in sustainable landscape architecture..."
                        className="w-full border border-emerald-900/15 rounded-lg p-2 text-xs text-emerald-950 leading-relaxed bg-[#faf8f5]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: STATS METRICS GRID */}
              <div className="p-6 bg-emerald-50/50 border border-emerald-900/10 rounded-2xl space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#062319]">Nursery Key Achievements & Counter Stats</h3>
                  <p className="text-xs text-emerald-800">Control numbers and labels displayed in the stats row</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Stat 1 */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-900 block">Stat Card #1</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Value (e.g. 12)</label>
                      <input
                        type="number"
                        value={siteForm.experienceYears}
                        onChange={(e) => setSiteForm({ ...siteForm, experienceYears: Number(e.target.value) })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs font-bold text-emerald-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Label</label>
                      <input
                        type="text"
                        value={siteForm.statsLabel1 || 'Years Growing'}
                        onChange={(e) => setSiteForm({ ...siteForm, statsLabel1: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-900 block">Stat Card #2</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Value (e.g. 650)</label>
                      <input
                        type="number"
                        value={siteForm.plantVarietiesCount}
                        onChange={(e) => setSiteForm({ ...siteForm, plantVarietiesCount: Number(e.target.value) })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs font-bold text-emerald-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Label</label>
                      <input
                        type="text"
                        value={siteForm.statsLabel2 || 'Flora Species'}
                        onChange={(e) => setSiteForm({ ...siteForm, statsLabel2: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-900 block">Stat Card #3</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Value (e.g. 18500 for 18.5k)</label>
                      <input
                        type="number"
                        value={siteForm.happyClientsCount}
                        onChange={(e) => setSiteForm({ ...siteForm, happyClientsCount: Number(e.target.value) })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs font-bold text-emerald-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Label</label>
                      <input
                        type="text"
                        value={siteForm.statsLabel3 || 'Green Spaces'}
                        onChange={(e) => setSiteForm({ ...siteForm, statsLabel3: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-900 block">Stat Card #4</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Value (e.g. 140)</label>
                      <input
                        type="number"
                        value={siteForm.projectsCompletedCount}
                        onChange={(e) => setSiteForm({ ...siteForm, projectsCompletedCount: Number(e.target.value) })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs font-bold text-emerald-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Label</label>
                      <input
                        type="text"
                        value={siteForm.statsLabel4 || 'Estates Designed'}
                        onChange={(e) => setSiteForm({ ...siteForm, statsLabel4: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: PHILOSOPHY & FOUR PILLARS */}
              <div className="p-6 bg-[#faf8f5] border border-emerald-900/10 rounded-2xl space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#062319]">Our Philosophy & Four Pillars</h3>
                  <p className="text-xs text-emerald-800">Customize the core principles of your nursery</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-emerald-900 mb-1">Philosophy Subtitle Label</label>
                    <input
                      type="text"
                      value={siteForm.philosophySubtitle || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, philosophySubtitle: e.target.value })}
                      placeholder="OUR PHILOSOPHY"
                      className="w-full bg-white border border-emerald-900/10 rounded-xl p-3 text-sm font-bold text-emerald-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-900 mb-1">Main Heading Title</label>
                    <input
                      type="text"
                      value={siteForm.philosophyTitle || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, philosophyTitle: e.target.value })}
                      placeholder="The Four Pillars of The Ever Green Nursery"
                      className="w-full bg-white border border-emerald-900/10 rounded-xl p-3 text-sm font-bold text-emerald-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Pillar 1 */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Pillar 1</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.pillar1Title || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar1Title: e.target.value })}
                        placeholder="Pesticide-Free Growing"
                        className="w-full border border-emerald-900/10 rounded-lg p-2 text-xs font-semibold bg-[#faf8f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={2}
                        value={siteForm.pillar1Desc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar1Desc: e.target.value })}
                        placeholder="We utilize beneficial predatory insects..."
                        className="w-full border border-emerald-900/10 rounded-lg p-2 text-xs leading-relaxed bg-[#faf8f5]"
                      />
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Pillar 2</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.pillar2Title || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar2Title: e.target.value })}
                        placeholder="Acclimatized Root Systems"
                        className="w-full border border-emerald-900/10 rounded-lg p-2 text-xs font-semibold bg-[#faf8f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={2}
                        value={siteForm.pillar2Desc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar2Desc: e.target.value })}
                        placeholder="Every specimen undergoes mandatory root training..."
                        className="w-full border border-emerald-900/10 rounded-lg p-2 text-xs leading-relaxed bg-[#faf8f5]"
                      />
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Pillar 3</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.pillar3Title || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar3Title: e.target.value })}
                        placeholder="Specimen Sourcing"
                        className="w-full border border-emerald-900/10 rounded-lg p-2 text-xs font-semibold bg-[#faf8f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={2}
                        value={siteForm.pillar3Desc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar3Desc: e.target.value })}
                        placeholder="Our horticulturists search globally..."
                        className="w-full border border-emerald-900/10 rounded-lg p-2 text-xs leading-relaxed bg-[#faf8f5]"
                      />
                    </div>
                  </div>

                  {/* Pillar 4 */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Pillar 4</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.pillar4Title || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar4Title: e.target.value })}
                        placeholder="Lifetime Plant Support"
                        className="w-full border border-emerald-900/10 rounded-lg p-2 text-xs font-semibold bg-[#faf8f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={2}
                        value={siteForm.pillar4Desc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar4Desc: e.target.value })}
                        placeholder="Clients receive ongoing care consultation..."
                        className="w-full border border-emerald-900/10 rounded-lg p-2 text-xs leading-relaxed bg-[#faf8f5]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: CALL TO ACTION BANNER */}
              <div className="p-6 bg-emerald-900 text-[#faf8f5] rounded-2xl space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-emerald-200">Bottom Call-To-Action Banner</h3>
                  <p className="text-xs text-emerald-300/80">Customize the visit prompt at the bottom of the About page</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-emerald-300 mb-1">CTA Headline Title</label>
                    <input
                      type="text"
                      value={siteForm.aboutCtaTitle || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutCtaTitle: e.target.value })}
                      placeholder="Ready to Visit Our Nursery in Person?"
                      className="w-full bg-emerald-950 border border-emerald-700/60 rounded-xl p-3 text-xs font-semibold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-300 mb-1">CTA Subtitle / Description</label>
                    <input
                      type="text"
                      value={siteForm.aboutCtaDesc || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutCtaDesc: e.target.value })}
                      placeholder="Explore 15 acres of climate-controlled glasshouses..."
                      className="w-full bg-emerald-950 border border-emerald-700/60 rounded-xl p-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-300 mb-1">CTA Button Label</label>
                    <input
                      type="text"
                      value={siteForm.aboutCtaButtonText || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutCtaButtonText: e.target.value })}
                      placeholder="Get Nursery Directions"
                      className="w-full bg-emerald-950 border border-emerald-700/60 rounded-xl p-3 text-xs font-bold text-emerald-300"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON BAR */}
              <div className="pt-4 flex items-center justify-between border-t border-emerald-900/10">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#062319] text-emerald-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-950 transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About Page Changes</span>
                </button>

                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-full animate-bounce">
                    {savedSuccess}
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* TAB: SETTINGS & SEO */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h2 className="font-serif text-2xl text-[#062319]">Nursery Business Settings & SEO</h2>
                <p className="text-xs text-emerald-800">Update contact info, address, phone, GST number, map embed, and hero content</p>
              </div>
              <div className="flex items-center gap-3">
                {savedSuccess && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full shadow-xs animate-bounce">{savedSuccess}</span>}
                <button
                  type="button"
                  onClick={(e) => handleSaveSettings(e as any)}
                  className="px-5 py-2.5 rounded-xl bg-[#062319] hover:bg-[#093527] text-emerald-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* WhatsApp Integration Quick Card */}
              <div className="p-4 bg-[#062319] text-white rounded-2xl space-y-3 shadow-md border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-[#25D366] text-white rounded-lg">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-emerald-100">WhatsApp Defaults & Chat Manager</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('whatsapp')}
                    className="text-xs font-mono font-bold text-[#25D366] hover:text-white underline transition-colors"
                  >
                    Open WhatsApp Control Panel &rarr;
                  </button>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Manage official WhatsApp numbers, default floating button greetings, custom messages, and automated order templates.
                </p>
              </div>

              {/* Cloudinary Integration Quick Card */}
              <div className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-serif text-base font-bold text-emerald-200">Cloudinary CDN Configuration</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cloudinary')}
                    className="text-xs font-mono font-semibold text-emerald-300 underline hover:text-white"
                  >
                    Open Cloudinary Panel &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-[11px] text-emerald-300 mb-1">Cloud Name</label>
                    <input
                      type="text"
                      value={siteForm.cloudinaryCloudName || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, cloudinaryCloudName: e.target.value.trim() })}
                      placeholder="e.g. dxy123abc"
                      className="w-full bg-emerald-950 border border-emerald-700/60 rounded-xl p-2.5 text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-emerald-300 mb-1">Unsigned Upload Preset</label>
                    <input
                      type="text"
                      value={siteForm.cloudinaryUploadPreset || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, cloudinaryUploadPreset: e.target.value.trim() })}
                      placeholder="e.g. nursery_preset or ml_default"
                      className="w-full bg-emerald-950 border border-emerald-700/60 rounded-xl p-2.5 text-white font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Logo Upload Section */}
              <div className="p-4 bg-[#faf8f5] border border-emerald-900/10 rounded-2xl space-y-3">
                <CloudinaryUploader
                  value={siteForm.logoUrl || ''}
                  onChange={(url) => setSiteForm({ ...siteForm, logoUrl: url })}
                  label="Nursery Custom Logo Image"
                  placeholder="Paste URL or upload logo image to Cloudinary"
                  siteSettings={siteForm}
                  helpText="Displayed in the header navbar and footer. Upload a logo image to display your custom brand logo."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-900/10">
                    <label className="block text-xs font-mono font-semibold text-emerald-900 mb-1">
                      Logo Display Size
                    </label>
                    <select
                      value={siteForm.logoSize || 'xlarge'}
                      onChange={(e) => setSiteForm({ ...siteForm, logoSize: e.target.value as any })}
                      className="w-full bg-[#faf8f5] border border-emerald-900/15 rounded-lg p-2 text-xs font-mono font-semibold text-emerald-950"
                    >
                      <option value="normal">Compact (Normal)</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large (Recommended for detailed logos)</option>
                      <option value="huge">Huge (Maximum prominence)</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer bg-white p-2.5 rounded-xl border border-emerald-900/10">
                    <input
                      type="checkbox"
                      checked={Boolean(siteForm.hideLogoText)}
                      onChange={(e) => setSiteForm({ ...siteForm, hideLogoText: e.target.checked })}
                      className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                    />
                    <span className="text-xs font-mono font-semibold text-emerald-950">
                      Hide Nursery Text Name (Display Logo Only in Navbar)
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">Nursery Name</label>
                  <input
                    type="text"
                    value={siteForm.nurseryName}
                    onChange={(e) => setSiteForm({ ...siteForm, nurseryName: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm font-semibold text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">Tagline (Sub-heading under Logo)</label>
                  <input
                    type="text"
                    value={siteForm.tagline}
                    onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                    placeholder="BOTANICAL NURSERY & LIVING DECOR"
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm font-semibold text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">Delivery Badge Text</label>
                  <input
                    type="text"
                    value={siteForm.deliveryBadge || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, deliveryBadge: e.target.value })}
                    placeholder="Pan India Delivery"
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">Telephone Phone</label>
                  <input
                    type="text"
                    value={siteForm.phone}
                    onChange={(e) => setSiteForm({ ...siteForm, phone: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">WhatsApp Number (digits only)</label>
                  <input
                    type="text"
                    value={siteForm.whatsAppNumber}
                    onChange={(e) => setSiteForm({ ...siteForm, whatsAppNumber: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">Email</label>
                  <input
                    type="email"
                    value={siteForm.email}
                    onChange={(e) => setSiteForm({ ...siteForm, email: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">Nursery GSTIN / GST Number</label>
                  <input
                    type="text"
                    value={siteForm.gstNumber || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, gstNumber: e.target.value })}
                    placeholder="e.g. 07AAACG1234M1Z5"
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">Physical Nursery Address</label>
                  <input
                    type="text"
                    value={siteForm.address}
                    onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                    placeholder="e.g. 742 Evergreen Valley Way, Botanical Ridge"
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">City / Region & Postal Code</label>
                  <input
                    type="text"
                    value={siteForm.city}
                    onChange={(e) => setSiteForm({ ...siteForm, city: e.target.value })}
                    placeholder="e.g. Portland, OR 97201"
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-emerald-900 mb-1">
                    Google Maps Embed URL <span className="text-gray-400 font-sans text-[11px]">(Live Interactive Map iframe URL)</span>
                  </label>
                  <input
                    type="text"
                    value={siteForm.mapEmbedUrl || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, mapEmbedUrl: e.target.value.trim() })}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-xs font-mono text-emerald-950"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Tip: Search your location on Google Maps &gt; Share &gt; Embed a map &gt; copy the <code className="bg-gray-100 px-1 py-0.5 rounded text-emerald-800">src="..."</code> URL.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-emerald-900 mb-1">Footer About / Nursery Description</label>
                <textarea
                  rows={3}
                  value={siteForm.footerDescription || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, footerDescription: e.target.value })}
                  placeholder="The Ever Green Nursery is your trusted online nursery offering healthy indoor plants..."
                  className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-emerald-900 mb-1">Hero Headline Text</label>
                <input
                  type="text"
                  value={siteForm.heroHeadline}
                  onChange={(e) => setSiteForm({ ...siteForm, heroHeadline: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-emerald-900 mb-1">Testimonials Section Title</label>
                <input
                  type="text"
                  value={siteForm.testimonialTitle || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, testimonialTitle: e.target.value })}
                  placeholder="e.g. Trusted by 50,000+ Plant Enthusiasts"
                  className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-emerald-900 mb-1">Hero Subheadline</label>
                <textarea
                  rows={2}
                  value={siteForm.heroSubheadline}
                  onChange={(e) => setSiteForm({ ...siteForm, heroSubheadline: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm"
                />
              </div>

              {/* STATS COUNTER GRID SECTION */}
              <div className="p-5 bg-emerald-50/50 border border-emerald-900/10 rounded-2xl space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#062319]">Stats Counter Grid</h3>
                  <p className="text-xs text-emerald-800">Control numbers and labels displayed on the About & Stats cards</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Stat 1 */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-900 block">Stat Card #1</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Value (e.g. 12)</label>
                      <input
                        type="number"
                        value={siteForm.experienceYears}
                        onChange={(e) => setSiteForm({ ...siteForm, experienceYears: Number(e.target.value) })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs font-bold text-emerald-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Label</label>
                      <input
                        type="text"
                        value={siteForm.statsLabel1 || 'Years Growing'}
                        onChange={(e) => setSiteForm({ ...siteForm, statsLabel1: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-900 block">Stat Card #2</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Value (e.g. 650)</label>
                      <input
                        type="number"
                        value={siteForm.plantVarietiesCount}
                        onChange={(e) => setSiteForm({ ...siteForm, plantVarietiesCount: Number(e.target.value) })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs font-bold text-emerald-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Label</label>
                      <input
                        type="text"
                        value={siteForm.statsLabel2 || 'Flora Species'}
                        onChange={(e) => setSiteForm({ ...siteForm, statsLabel2: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-900 block">Stat Card #3</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Value (e.g. 18500 for 18.5k)</label>
                      <input
                        type="number"
                        value={siteForm.happyClientsCount}
                        onChange={(e) => setSiteForm({ ...siteForm, happyClientsCount: Number(e.target.value) })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs font-bold text-emerald-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Label</label>
                      <input
                        type="text"
                        value={siteForm.statsLabel3 || 'Green Spaces'}
                        onChange={(e) => setSiteForm({ ...siteForm, statsLabel3: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-900 block">Stat Card #4</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Value (e.g. 140)</label>
                      <input
                        type="number"
                        value={siteForm.projectsCompletedCount}
                        onChange={(e) => setSiteForm({ ...siteForm, projectsCompletedCount: Number(e.target.value) })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs font-bold text-emerald-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Label</label>
                      <input
                        type="text"
                        value={siteForm.statsLabel4 || 'Estates Designed'}
                        onChange={(e) => setSiteForm({ ...siteForm, statsLabel4: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* OUR PHILOSOPHY & FOUR PILLARS SECTION */}
              <div className="p-5 bg-[#faf8f5] border border-emerald-900/10 rounded-2xl space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#062319]">Our Philosophy & Four Pillars</h3>
                  <p className="text-xs text-emerald-800">Customize the philosophy sub-heading, main title, and the four core pillars cards</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-emerald-900 mb-1">Philosophy Subtitle Label</label>
                    <input
                      type="text"
                      value={siteForm.philosophySubtitle || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, philosophySubtitle: e.target.value })}
                      placeholder="OUR PHILOSOPHY"
                      className="w-full bg-white border border-emerald-900/10 rounded-xl p-3 text-sm font-bold text-emerald-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-900 mb-1">Main Heading Title</label>
                    <input
                      type="text"
                      value={siteForm.philosophyTitle || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, philosophyTitle: e.target.value })}
                      placeholder="The Four Pillars of The Ever Green Nursery"
                      className="w-full bg-white border border-emerald-900/10 rounded-xl p-3 text-sm font-bold text-emerald-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Pillar 1 */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Pillar 1</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.pillar1Title || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar1Title: e.target.value })}
                        placeholder="Pesticide-Free Growing"
                        className="w-full border rounded-lg p-2 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={2}
                        value={siteForm.pillar1Desc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar1Desc: e.target.value })}
                        placeholder="We utilize beneficial predatory insects..."
                        className="w-full border rounded-lg p-2 text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Pillar 2</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.pillar2Title || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar2Title: e.target.value })}
                        placeholder="Acclimatized Root Systems"
                        className="w-full border rounded-lg p-2 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={2}
                        value={siteForm.pillar2Desc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar2Desc: e.target.value })}
                        placeholder="Every specimen undergoes mandatory root training..."
                        className="w-full border rounded-lg p-2 text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Pillar 3</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.pillar3Title || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar3Title: e.target.value })}
                        placeholder="Specimen Sourcing"
                        className="w-full border rounded-lg p-2 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={2}
                        value={siteForm.pillar3Desc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar3Desc: e.target.value })}
                        placeholder="Our horticulturists search globally..."
                        className="w-full border rounded-lg p-2 text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Pillar 4 */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-900 block">Pillar 4</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Title</label>
                      <input
                        type="text"
                        value={siteForm.pillar4Title || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar4Title: e.target.value })}
                        placeholder="Lifetime Plant Support"
                        className="w-full border rounded-lg p-2 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5 font-mono">Description</label>
                      <textarea
                        rows={2}
                        value={siteForm.pillar4Desc || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, pillar4Desc: e.target.value })}
                        placeholder="Clients receive ongoing care consultation..."
                        className="w-full border rounded-lg p-2 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-[#062319] text-emerald-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </button>
            </form>

            {/* Change Admin Password Section */}
            <div className="pt-8 border-t border-emerald-900/10 space-y-4">
              <h3 className="font-serif text-xl text-[#062319] flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-700" />
                <span>Change Admin Passcode</span>
              </h3>

              <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">Current Passcode</label>
                  <input
                    type="password"
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-900 mb-1">New Passcode</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider"
                >
                  Update Passcode
                </button>
              </form>
              {passMsg && <p className="text-xs font-mono text-emerald-700">{passMsg}</p>}
            </div>
          </div>
        )}

        {/* TAB: WHATSAPP CONTROL & DEFAULTS MANAGER */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/10 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-[#25D366]/15 rounded-xl text-[#20ba59]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif text-2xl text-[#062319] font-bold">
                    WhatsApp Default Controls & Integration
                  </h2>
                </div>
                <p className="text-xs text-emerald-800">
                  Manage WhatsApp numbers, default floating button greetings, widget display labels, and pre-filled inquiry templates for your store.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full animate-bounce">
                    {savedSuccess}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const cleanNum = (siteForm.whatsAppNumber || '').replace(/[^0-9]/g, '');
                    const text = encodeURIComponent(siteForm.whatsAppDefaultMessage || '');
                    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
                  }}
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-emerald-500/30 transition-all active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test WhatsApp Open</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* Master Enable/Disable & Status Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#062319] via-[#0d3b2a] to-[#062319] text-white space-y-4 shadow-lg border border-emerald-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3.5 w-3.5">
                      {siteForm.whatsAppEnabled !== false && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${siteForm.whatsAppEnabled !== false ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                    </span>
                    <div>
                      <h3 className="font-serif text-base font-semibold text-emerald-100">
                        Website Floating WhatsApp Action Widget
                      </h3>
                      <p className="text-xs text-emerald-300/80">
                        {siteForm.whatsAppEnabled !== false 
                          ? 'Widget is currently ACTIVE and visible to all website visitors' 
                          : 'Widget is currently DISABLED and hidden from the website'}
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer bg-emerald-950/80 p-1.5 rounded-full border border-emerald-700/50 shrink-0">
                    <input
                      type="checkbox"
                      checked={siteForm.whatsAppEnabled !== false}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsAppEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[8px] after:left-[8px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#25D366]"></div>
                    <span className="ml-3 text-xs font-mono font-bold text-emerald-200 pr-2">
                      {siteForm.whatsAppEnabled !== false ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Grid Section 1: Phone Number & Screen Placement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Official Phone Number */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-emerald-900/10 space-y-3">
                  <label className="block text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
                    Official WhatsApp Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={siteForm.whatsAppNumber || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsAppNumber: e.target.value })}
                      placeholder="e.g. 919876543210 or 18004587336"
                      className="w-full bg-white border border-emerald-900/15 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-emerald-950 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-800/80 leading-normal font-sans">
                    Include country code (e.g. 91 for India, 1 for USA). Customer inquiries will route to this WhatsApp account.
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-emerald-900 flex items-center gap-1.5 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span className="font-bold">Target URL:</span>
                    <span className="truncate underline">
                      https://wa.me/{(siteForm.whatsAppNumber || '').replace(/[^0-9]/g, '')}
                    </span>
                  </div>
                </div>

                {/* Floating Placement Position */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-emerald-900/10 space-y-3">
                  <label className="block text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
                    Floating Widget Screen Anchor Position
                  </label>
                  <select
                    value={siteForm.whatsAppPosition || 'bottom-right'}
                    onChange={(e) => setSiteForm({ ...siteForm, whatsAppPosition: e.target.value as any })}
                    className="w-full bg-white border border-emerald-900/15 rounded-xl p-3 text-xs font-mono font-semibold text-emerald-950 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="bottom-right">Bottom Right Corner (Standard & Recommended)</option>
                    <option value="bottom-left">Bottom Left Corner</option>
                  </select>
                  <p className="text-[11px] text-emerald-800/80 leading-normal">
                    Determines where the floating WhatsApp badge appears on visitors&apos; screens.
                  </p>
                </div>
              </div>

              {/* Display Labels & Tooltips */}
              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-emerald-900/10 space-y-4">
                <h3 className="text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
                  Button Labels & Hover Tooltips
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-emerald-900 mb-1">
                      Main Button Label
                    </label>
                    <input
                      type="text"
                      value={siteForm.whatsAppButtonLabel || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsAppButtonLabel: e.target.value })}
                      placeholder="Chat on WhatsApp"
                      className="w-full bg-white border border-emerald-900/15 rounded-xl p-2.5 text-xs font-semibold text-emerald-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-emerald-900 mb-1">
                      Sub-Label / Status
                    </label>
                    <input
                      type="text"
                      value={siteForm.whatsAppSubLabel || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsAppSubLabel: e.target.value })}
                      placeholder="Instant Response"
                      className="w-full bg-white border border-emerald-900/15 rounded-xl p-2.5 text-xs font-semibold text-emerald-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-emerald-900 mb-1">
                      Desktop Hover Tooltip Text
                    </label>
                    <input
                      type="text"
                      value={siteForm.whatsAppTooltipText || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsAppTooltipText: e.target.value })}
                      placeholder="Chat directly on WhatsApp"
                      className="w-full bg-white border border-emerald-900/15 rounded-xl p-2.5 text-xs font-semibold text-emerald-950"
                    />
                  </div>
                </div>
              </div>

              {/* Default Welcome Message */}
              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-emerald-900/10 space-y-3">
                <label className="block text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
                  Default Website Floating Button Greeting Message
                </label>
                <textarea
                  rows={3}
                  value={siteForm.whatsAppDefaultMessage || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, whatsAppDefaultMessage: e.target.value })}
                  placeholder="Hello! I am visiting your nursery website and would like to inquire about your plant collection and services."
                  className="w-full bg-white border border-emerald-900/15 rounded-xl p-3 text-xs leading-relaxed text-emerald-950 font-medium focus:outline-none focus:border-emerald-600"
                />
                <p className="text-[11px] text-gray-500">
                  This text pre-fills the user&apos;s WhatsApp input box when they tap the floating action button.
                </p>
              </div>

              {/* Contextual Pre-filled Templates */}
              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-emerald-900/10 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
                    Contextual Message Templates
                  </h3>
                  <p className="text-[11px] text-emerald-800">
                    Customize messages sent when customers inquire about specific items or place orders.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-emerald-900 mb-1">
                      Product Detail Page Template
                    </label>
                    <textarea
                      rows={3}
                      value={siteForm.whatsAppProductMessageTemplate || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsAppProductMessageTemplate: e.target.value })}
                      placeholder="Hello! I would like to inquire about *{plant_name}* (Price: {price}). Please confirm availability & delivery options."
                      className="w-full bg-white border border-emerald-900/15 rounded-xl p-3 text-xs text-emerald-950 font-medium"
                    />
                    <span className="text-[10px] font-mono text-emerald-700">
                      Placeholders: <code className="bg-emerald-100 px-1 rounded">{'{plant_name}'}</code>, <code className="bg-emerald-100 px-1 rounded">{'{price}'}</code>
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-emerald-900 mb-1">
                      Cart & Checkout Order Template
                    </label>
                    <textarea
                      rows={3}
                      value={siteForm.whatsAppCartMessageTemplate || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsAppCartMessageTemplate: e.target.value })}
                      placeholder="Hello! I would like to place an order for the following items:\n{cart_items}\nTotal Amount: {total_price}"
                      className="w-full bg-white border border-emerald-900/15 rounded-xl p-3 text-xs text-emerald-950 font-medium"
                    />
                    <span className="text-[10px] font-mono text-emerald-700">
                      Placeholders: <code className="bg-emerald-100 px-1 rounded">{'{cart_items}'}</code>, <code className="bg-emerald-100 px-1 rounded">{'{total_price}'}</code>
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-emerald-900 mb-1">
                      Bulk Order Inquiry Template
                    </label>
                    <textarea
                      rows={3}
                      value={siteForm.whatsAppBulkMessageTemplate || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsAppBulkMessageTemplate: e.target.value })}
                      placeholder="Hello! I am interested in placing a bulk order for plants with your nursery."
                      className="w-full bg-white border border-emerald-900/15 rounded-xl p-3 text-xs text-emerald-950 font-medium"
                    />
                    <span className="text-[10px] font-mono text-emerald-700">
                      Used on Bulk Order Inquiry pages
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Preview Widget */}
              <div className="bg-[#062319] p-6 rounded-2xl border border-emerald-500/30 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-widest">
                    Live Button Appearance Preview
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/80">
                    Position: {siteForm.whatsAppPosition || 'bottom-right'}
                  </span>
                </div>

                <div className="p-4 bg-[#083023] rounded-xl flex items-center justify-center">
                  <div className="relative flex items-center gap-3 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-xl border-2 border-white/40">
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-white" />
                    <MessageSquare className="w-5 h-5 text-white" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold font-sans">
                        {siteForm.whatsAppButtonLabel || 'Chat on WhatsApp'}
                      </span>
                      <span className="text-[9px] text-emerald-100 font-mono tracking-wider uppercase">
                        {siteForm.whatsAppSubLabel || 'Instant Response'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-4 border-t border-emerald-900/10">
                <span className="text-xs text-emerald-800 font-mono">
                  All updates take effect immediately on your live store.
                </span>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#062319] hover:bg-[#0a3828] text-white rounded-xl text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>Save WhatsApp Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: CLOUDINARY CONFIGURATION & MEDIA MANAGEMENT */}
        {activeTab === 'cloudinary' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#062319] text-emerald-300 flex items-center justify-center shadow-md">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-[#062319]">Cloudinary Media CDN Integration</h2>
                  <p className="text-xs text-emerald-800">Connect your Cloudinary account to enable direct image uploads across your nursery store</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {siteForm.cloudinaryCloudName && siteForm.cloudinaryUploadPreset ? (
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Cloudinary Active ({siteForm.cloudinaryCloudName})
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Unconnected (Manual URL Mode)
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="p-5 bg-emerald-50/60 border border-emerald-900/10 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#062319] flex items-center gap-2">
                    <Key className="w-5 h-5 text-emerald-700" />
                    Cloudinary Credentials
                  </h3>
                  <a
                    href="https://cloudinary.com/console"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-emerald-700 underline hover:text-emerald-900 flex items-center gap-1"
                  >
                    Open Cloudinary Console <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-emerald-900 mb-1">
                      Cloud Name *
                    </label>
                    <input
                      type="text"
                      value={siteForm.cloudinaryCloudName || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, cloudinaryCloudName: e.target.value.trim() })}
                      placeholder="e.g. dxy123abc or your-cloud-name"
                      className="w-full bg-white border border-emerald-900/15 rounded-xl p-3 text-sm font-mono text-emerald-950 font-semibold shadow-xs"
                    />
                    <p className="text-[10px] text-gray-500 font-mono mt-1">Found on your main Cloudinary Dashboard</p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-emerald-900 mb-1">
                      Unsigned Upload Preset *
                    </label>
                    <input
                      type="text"
                      value={siteForm.cloudinaryUploadPreset || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, cloudinaryUploadPreset: e.target.value.trim() })}
                      placeholder="e.g. nursery_preset or ml_default"
                      className="w-full bg-white border border-emerald-900/15 rounded-xl p-3 text-sm font-mono text-emerald-950 font-semibold shadow-xs"
                    />
                    <p className="text-[10px] text-gray-500 font-mono mt-1">Created in Cloudinary Settings &gt; Upload &gt; Upload Presets (Unsigned)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-emerald-900 mb-1">
                    API Key (Optional)
                  </label>
                  <input
                    type="text"
                    value={siteForm.cloudinaryApiKey || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, cloudinaryApiKey: e.target.value.trim() })}
                    placeholder="e.g. 123456789012345"
                    className="w-full bg-white border border-emerald-900/15 rounded-xl p-3 text-sm font-mono text-emerald-950 shadow-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#062319] text-emerald-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-950 transition-all shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    Save Cloudinary Settings
                  </button>

                  {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-bounce">
                      {savedSuccess}
                    </span>
                  )}
                </div>
              </div>
            </form>

            {/* Test Uploader Box */}
            <div className="p-5 bg-[#faf8f5] border border-emerald-900/10 rounded-2xl space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#062319] flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-700" />
                Interactive Cloudinary Test Upload Tool
              </h3>
              <p className="text-xs text-emerald-800">
                Test your Cloud Name and Upload Preset below. Any image uploaded here will generate an active Cloudinary CDN URL:
              </p>
              <CloudinaryUploader
                value={siteForm.heroBgImage || ''}
                onChange={(url) => setSiteForm({ ...siteForm, heroBgImage: url })}
                label="Sample Cloudinary Upload Test"
                siteSettings={siteForm}
                helpText="If configured properly, the image will upload instantly to Cloudinary and update your site hero background URL."
              />
            </div>

            {/* Manual Step-by-step instructions */}
            <div className="p-6 bg-[#062319] text-emerald-100 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Manual Cloudinary Setup Guide (3 Easy Steps)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-emerald-200/90 font-sans">
                <div className="space-y-2 bg-emerald-950/60 p-4 rounded-xl border border-emerald-800/40">
                  <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider block">1. Get Cloud Name</span>
                  <p>Open <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer" className="underline text-emerald-300 font-bold">Cloudinary Console</a>. Copy your <strong>Cloud Name</strong> from the top left of your dashboard.</p>
                </div>

                <div className="space-y-2 bg-emerald-950/60 p-4 rounded-xl border border-emerald-800/40">
                  <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider block">2. Add Unsigned Preset</span>
                  <p>In Cloudinary, go to <strong>Settings (gear icon) &gt; Upload &gt; Upload Presets</strong>. Click <strong>Add upload preset</strong>, set <strong>Signing Mode</strong> to <strong>Unsigned</strong>, and save.</p>
                </div>

                <div className="space-y-2 bg-emerald-950/60 p-4 rounded-xl border border-emerald-800/40">
                  <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider block">3. Save Credentials</span>
                  <p>Paste your Cloud Name and Preset name in the form above and click <strong>Save Cloudinary Settings</strong>. You are ready to upload images!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FOR ADDING/EDITING PLANT */}
        {editingPlant && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto modal-backdrop-overlay overscroll-contain">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto overscroll-contain modal-scroll-content">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-serif text-2xl text-[#062319]">
                  {editingPlant.id ? 'Edit Plant Specimen' : 'Add New Plant Specimen'}
                </h3>
                <button onClick={() => setEditingPlant(null)}>
                  <X className="w-6 h-6 text-emerald-900" />
                </button>
              </div>

              <form onSubmit={handleSavePlant} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-emerald-900 mb-1 font-semibold">Common Name *</label>
                    <input
                      type="text"
                      required
                      value={editingPlant.name || ''}
                      onChange={(e) => setEditingPlant({ ...editingPlant, name: e.target.value })}
                      placeholder="e.g. Swiss Cheese Plant"
                      className="w-full bg-[#faf8f5] border rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-emerald-900 mb-1 font-semibold">Scientific Taxonomy *</label>
                    <input
                      type="text"
                      required
                      value={editingPlant.scientificName || ''}
                      onChange={(e) => setEditingPlant({ ...editingPlant, scientificName: e.target.value })}
                      placeholder="e.g. Monstera deliciosa"
                      className="w-full bg-[#faf8f5] border rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-emerald-900 mb-1 font-semibold">Category</label>
                    <select
                      value={editingPlant.category || categories[0]?.name}
                      onChange={(e) => setEditingPlant({ ...editingPlant, category: e.target.value })}
                      className="w-full bg-[#faf8f5] border rounded-xl p-2.5"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <CloudinaryUploader
                      value={editingPlant.images ? editingPlant.images[0] : ''}
                      onChange={(url) => setEditingPlant({ ...editingPlant, images: [url] })}
                      label="Plant Photo (Cloudinary or Image URL)"
                      placeholder="https://images.unsplash.com/..."
                      siteSettings={siteForm}
                      helpText="Upload plant photo file directly to Cloudinary or paste a direct image URL."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-mono text-emerald-900 mb-1 font-semibold">Sunlight</label>
                    <select
                      value={editingPlant.sunlight || 'Indirect Light'}
                      onChange={(e) => setEditingPlant({ ...editingPlant, sunlight: e.target.value as any })}
                      className="w-full bg-[#faf8f5] border rounded-xl p-2"
                    >
                      <option value="Full Sun">Full Sun</option>
                      <option value="Partial Sun">Partial Sun</option>
                      <option value="Indirect Light">Indirect Light</option>
                      <option value="Shade">Shade</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-emerald-900 mb-1 font-semibold">Water</label>
                    <select
                      value={editingPlant.water || 'Moderate'}
                      onChange={(e) => setEditingPlant({ ...editingPlant, water: e.target.value as any })}
                      className="w-full bg-[#faf8f5] border rounded-xl p-2"
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Frequent">Frequent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-emerald-900 mb-1 font-semibold">Difficulty</label>
                    <select
                      value={editingPlant.difficulty || 'Easy Care'}
                      onChange={(e) => setEditingPlant({ ...editingPlant, difficulty: e.target.value as any })}
                      className="w-full bg-[#faf8f5] border rounded-xl p-2"
                    >
                      <option value="Easy Care">Easy Care</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-emerald-900 mb-1 font-semibold">Scale / Size</label>
                    <select
                      value={editingPlant.size || 'Medium (2-4 ft)'}
                      onChange={(e) => setEditingPlant({ ...editingPlant, size: e.target.value as any })}
                      className="w-full bg-[#faf8f5] border rounded-xl p-2"
                    >
                      <option value="Compact (1-2 ft)">Compact (1-2 ft)</option>
                      <option value="Medium (2-4 ft)">Medium (2-4 ft)</option>
                      <option value="Large (4-6 ft)">Large (4-6 ft)</option>
                      <option value="Feature Tree (6+ ft)">Feature Tree (6+ ft)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-emerald-900 mb-1 font-semibold">Short Summary</label>
                  <input
                    type="text"
                    value={editingPlant.shortDescription || ''}
                    onChange={(e) => setEditingPlant({ ...editingPlant, shortDescription: e.target.value })}
                    className="w-full bg-[#faf8f5] border rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-mono text-emerald-900 mb-1 font-semibold">Full Description</label>
                  <textarea
                    rows={3}
                    value={editingPlant.description || ''}
                    onChange={(e) => setEditingPlant({ ...editingPlant, description: e.target.value })}
                    className="w-full bg-[#faf8f5] border rounded-xl p-2.5"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={editingPlant.isFeatured || false}
                    onChange={(e) => setEditingPlant({ ...editingPlant, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="isFeatured" className="font-mono text-xs text-emerald-900">
                    Feature on Homepage Showcase
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPlant(null)}
                    className="px-5 py-2.5 rounded-xl border text-emerald-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#062319] text-emerald-300 font-semibold"
                  >
                    Save Plant
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FOR CATEGORY */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 modal-backdrop-overlay overscroll-contain">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto overscroll-contain modal-scroll-content">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-serif text-xl text-[#062319]">
                  {editingCategory.id ? 'Edit Category' : 'New Category'}
                </h3>
                <button onClick={() => setEditingCategory(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full border p-2.5 rounded-xl"
                  />
                </div>

                <div>
                  <CloudinaryUploader
                    value={editingCategory.image || ''}
                    onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                    label="Category Cover Image"
                    siteSettings={siteForm}
                  />
                </div>

                <div>
                  <label className="block font-mono mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full border p-2.5 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingCategory(null)} className="px-4 py-2 border rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#062319] text-emerald-300 rounded-xl">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FOR SERVICE */}
        {editingService && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto modal-backdrop-overlay overscroll-contain">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto overscroll-contain modal-scroll-content">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif text-xl text-[#062319]">
                  {editingService.id ? 'Edit Service Details' : 'Add New Nursery Service'}
                </h3>
                <button onClick={() => setEditingService(null)}>
                  <X className="w-5 h-5 text-emerald-900" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    placeholder="e.g. Turnkey Terrace Gardening"
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono mb-1 font-semibold text-emerald-900">Badge Label</label>
                    <input
                      type="text"
                      value={editingService.badge || ''}
                      onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                      placeholder="e.g. Popular, Commercial"
                      className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                    />
                  </div>

                <div>
                  <CloudinaryUploader
                    value={editingService.image || ''}
                    onChange={(url) => setEditingService({ ...editingService, image: url })}
                    label="Service Photo"
                    siteSettings={siteForm}
                  />
                </div>
                </div>

                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Short Summary</label>
                  <input
                    type="text"
                    value={editingService.shortDesc || ''}
                    onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                    placeholder="Brief 1-line headline description"
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Full Service Description</label>
                  <textarea
                    rows={3}
                    value={editingService.fullDesc || ''}
                    onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                    placeholder="Detailed explanation of what is provided..."
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Key Features (comma separated)</label>
                  <input
                    type="text"
                    value={editingService.features ? editingService.features.join(', ') : ''}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. Soil Preparation, Drip Irrigation, Maintenance"
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 border rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#062319] text-emerald-300 rounded-xl font-semibold">
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FOR PROJECT */}
        {editingProject && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto modal-backdrop-overlay overscroll-contain">
            <div className="w-full max-w-xl bg-white rounded-3xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto overscroll-contain modal-scroll-content">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif text-xl text-[#062319]">
                  {editingProject.id ? 'Edit Landscape Project' : 'Add New Portfolio Project'}
                </h3>
                <button onClick={() => setEditingProject(null)}>
                  <X className="w-5 h-5 text-emerald-900" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono mb-1 font-semibold text-emerald-900">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. Luxury Penthouse Terrace"
                      className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono mb-1 font-semibold text-emerald-900">Category</label>
                    <input
                      type="text"
                      value={editingProject.category || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      placeholder="e.g. Commercial, Residential"
                      className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono mb-1 font-semibold text-emerald-900">City / Location</label>
                    <input
                      type="text"
                      value={editingProject.location || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      placeholder="e.g. Gurugram, Sector 42"
                      className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProject.featured ?? true}
                        onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                        className="rounded border-emerald-800 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="font-mono text-emerald-900 font-semibold">Feature on Home Showcase</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <CloudinaryUploader
                      value={editingProject.afterImage || editingProject.beforeImage || ''}
                      onChange={(url) => setEditingProject({ ...editingProject, afterImage: url })}
                      label="Completed Work Photo (Finished Project)"
                      placeholder="https://images.unsplash.com/photo-..."
                      siteSettings={siteForm}
                      helpText="High-resolution photo of the finished project / garden installation."
                    />
                  </div>

                  <div>
                    <CloudinaryUploader
                      value={editingProject.beforeImage || ''}
                      onChange={(url) => setEditingProject({ ...editingProject, beforeImage: url })}
                      label="Before Image (Optional for comparison slider)"
                      placeholder="Optional raw site condition image URL"
                      siteSettings={siteForm}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Project Description</label>
                  <textarea
                    rows={2}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Details about client requirements, design philosophy, implementation..."
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Key Results / Outcome</label>
                  <input
                    type="text"
                    value={editingProject.results || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, results: e.target.value })}
                    placeholder="e.g. 100% automated drip irrigation, zero maintenance hassle"
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Plants Installed (comma separated)</label>
                  <input
                    type="text"
                    value={editingProject.plantsUsed ? editingProject.plantsUsed.join(', ') : ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        plantsUsed: e.target.value.split(',').map((p) => p.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. Ficus Lyrata, Areca Palms, Bougainvillea"
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 border rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#062319] text-emerald-300 rounded-xl font-semibold">
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FOR GALLERY ITEM */}
        {editingGallery && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 modal-backdrop-overlay overscroll-contain">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto overscroll-contain modal-scroll-content">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif text-xl text-[#062319]">
                  {editingGallery.id ? 'Edit Gallery Photo' : 'Add Gallery Photo'}
                </h3>
                <button onClick={() => setEditingGallery(null)}>
                  <X className="w-5 h-5 text-emerald-900" />
                </button>
              </div>

              <form onSubmit={handleSaveGallery} className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={editingGallery.title || ''}
                    onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                    placeholder="e.g. Exotic Fern Canopy"
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono mb-1 font-semibold text-emerald-900">Category Tag</label>
                    <select
                      value={editingGallery.category || 'Nursery'}
                      onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value as any })}
                      className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                    >
                      <option value="Nursery">Nursery</option>
                      <option value="Indoor Plants">Indoor Plants</option>
                      <option value="Outdoor Garden">Outdoor Garden</option>
                      <option value="Landscaping">Landscaping</option>
                      <option value="Rare Flora">Rare Flora</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <CloudinaryUploader
                      value={editingGallery.image || ''}
                      onChange={(url) => setEditingGallery({ ...editingGallery, image: url })}
                      label="Gallery Image Photo"
                      siteSettings={siteForm}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Caption / Note</label>
                  <textarea
                    rows={2}
                    value={editingGallery.caption || ''}
                    onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                    placeholder="Optional details or botanical notes..."
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setEditingGallery(null)} className="px-4 py-2 border rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#062319] text-emerald-300 rounded-xl font-semibold">
                    Save Photo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FOR TESTIMONIAL */}
        {editingTestimonial && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 modal-backdrop-overlay overscroll-contain">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto overscroll-contain modal-scroll-content">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif text-xl text-[#062319]">
                  {editingTestimonial.id ? 'Edit Testimonial' : 'Add New Client Testimonial'}
                </h3>
                <button onClick={() => setEditingTestimonial(null)}>
                  <X className="w-5 h-5 text-emerald-900" />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono mb-1 font-semibold text-emerald-900">Role / Title *</label>
                    <input
                      type="text"
                      required
                      value={editingTestimonial.role || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                      placeholder="e.g. Principal Interior Architect"
                      className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono mb-1 font-semibold text-emerald-900">Location / City</label>
                    <input
                      type="text"
                      value={editingTestimonial.location || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                      placeholder="e.g. Portland, OR"
                      className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Star Rating (1-5)</label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                    <option value={2}>2 Stars (★★☆☆☆)</option>
                    <option value={1}>1 Star (★☆☆☆☆)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono mb-1 font-semibold text-emerald-900">Review / Testimonial Quote *</label>
                  <textarea
                    rows={4}
                    required
                    value={editingTestimonial.content || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                    placeholder="Enter customer review text..."
                    className="w-full border rounded-xl p-2.5 bg-[#faf8f5]"
                  />
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-900/10 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showOnHomeCheckbox"
                    checked={editingTestimonial.showOnHome !== false}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, showOnHome: e.target.checked })}
                    className="rounded border-emerald-800 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="showOnHomeCheckbox" className="font-mono text-emerald-900 font-semibold cursor-pointer">
                    Show this Review on Homepage
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setEditingTestimonial(null)} className="px-4 py-2 border rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#062319] text-emerald-300 rounded-xl font-semibold">
                    Save Testimonial
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FOR INQUIRY DETAILS */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 modal-backdrop-overlay overscroll-contain">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain modal-scroll-content shadow-2xl border border-emerald-900/20">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {selectedInquiry.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      ID: {selectedInquiry.id}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#062319] mt-2 font-bold">
                    {selectedInquiry.subject || 'Customer Submission'}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Received on {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Customer Info Card */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-emerald-900/10 space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#062319]">Customer & Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-gray-400 block">Name</span>
                    <span className="font-bold text-gray-900 text-sm">{selectedInquiry.name}</span>
                  </div>
                  {selectedInquiry.companyName && (
                    <div>
                      <span className="font-mono text-[10px] uppercase text-gray-400 block">Company Name</span>
                      <span className="font-medium text-emerald-900">{selectedInquiry.companyName}</span>
                    </div>
                  )}
                  {selectedInquiry.email && (
                    <div>
                      <span className="font-mono text-[10px] uppercase text-gray-400 block">Email Address</span>
                      <a href={`mailto:${selectedInquiry.email}`} className="text-emerald-700 hover:underline font-medium">
                        {selectedInquiry.email}
                      </a>
                    </div>
                  )}
                  {selectedInquiry.phone && (
                    <div>
                      <span className="font-mono text-[10px] uppercase text-gray-400 block">Phone Number</span>
                      <a href={`tel:${selectedInquiry.phone}`} className="text-emerald-700 hover:underline font-medium">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                  {selectedInquiry.companyGst && (
                    <div>
                      <span className="font-mono text-[10px] uppercase text-gray-400 block">GSTIN / Tax ID</span>
                      <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-900 font-semibold text-xs border border-slate-300">
                        {selectedInquiry.companyGst}
                      </span>
                    </div>
                  )}
                  {selectedInquiry.plantName && (
                    <div>
                      <span className="font-mono text-[10px] uppercase text-gray-400 block">Requested Plant Specimen</span>
                      <span className="font-semibold text-emerald-900">{selectedInquiry.plantName}</span>
                    </div>
                  )}
                  {selectedInquiry.rating && (
                    <div>
                      <span className="font-mono text-[10px] uppercase text-gray-400 block">User Star Rating</span>
                      <div className="flex items-center text-amber-400 gap-0.5 mt-0.5">
                        {Array.from({ length: selectedInquiry.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-1">{selectedInquiry.rating}/5</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#062319]">Message Content</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-gray-500">Status:</span>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value as any)}
                    className="text-xs bg-emerald-50 border border-emerald-900/20 rounded-xl px-3 py-1.5 font-semibold text-emerald-900"
                  >
                    <option value="new">New / Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {selectedInquiry.phone && (
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedInquiry.name}, thank you for contacting The Ever Green Nursery regarding: "${selectedInquiry.subject || 'your inquiry'}"!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'replied')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Reply</span>
                    </a>
                  )}

                  {selectedInquiry.type === 'feedback' && (
                    <button
                      type="button"
                      onClick={() => handleConvertFeedbackToTestimonial(selectedInquiry)}
                      className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Approve for Home</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                    className="px-3 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 font-bold text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-full text-red-600 shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{deleteConfirmation.title}</h3>
                  <p className="text-xs text-slate-500 font-sans">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{deleteConfirmation.message}</p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteConfirmation.onConfirm();
                    setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
