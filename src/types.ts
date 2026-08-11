export type SunlightRequirement = 'Full Sun' | 'Partial Sun' | 'Indirect Light' | 'Shade';
export type WaterRequirement = 'Low' | 'Moderate' | 'Frequent';
export type DifficultyLevel = 'Easy Care' | 'Intermediate' | 'Expert';
export type PlantSize = 'Compact (1-2 ft)' | 'Medium (2-4 ft)' | 'Large (4-6 ft)' | 'Feature Tree (6+ ft)';

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  shortDescription: string;
  description: string;
  story?: string;
  images: string[];
  sunlight: SunlightRequirement;
  water: WaterRequirement;
  difficulty: DifficultyLevel;
  size: PlantSize;
  soil: string;
  temperature: string;
  maintenance: string;
  placement: string;
  benefits: string[];
  careGuide: { step: string; title: string; detail: string }[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  published: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  plantCount?: number;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  features: string[];
  badge?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  beforeImage?: string;
  afterImage: string;
  galleryImages: string[];
  plantsUsed: string[];
  results: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Nursery' | 'Indoor Plants' | 'Outdoor Garden' | 'Landscaping' | 'Rare Flora';
  image: string;
  caption: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  rating: number;
  location: string;
  showOnHome?: boolean;
  status?: 'approved' | 'pending' | 'archived';
  email?: string;
  phone?: string;
  createdAt?: string;
}

export interface CustomerInquiry {
  id: string;
  type: 'contact' | 'bulk_order' | 'plant_enquiry' | 'feedback' | 'general';
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  companyGst?: string;
  plantName?: string;
  subject?: string;
  message: string;
  rating?: number;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface SiteSettings {
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
  cloudinaryApiKey?: string;
  nurseryName: string;
  tagline: string;
  logoUrl?: string;
  logoSize?: 'normal' | 'large' | 'xlarge' | 'huge';
  hideLogoText?: boolean;
  footerDescription?: string;
  deliveryBadge?: string;
  phone: string;
  whatsAppNumber: string;
  whatsAppEnabled?: boolean;
  whatsAppDefaultMessage?: string;
  whatsAppPosition?: 'bottom-right' | 'bottom-left';
  whatsAppButtonLabel?: string;
  whatsAppSubLabel?: string;
  whatsAppTooltipText?: string;
  whatsAppProductMessageTemplate?: string;
  whatsAppCartMessageTemplate?: string;
  whatsAppBulkMessageTemplate?: string;
  email: string;
  gstNumber?: string;
  address: string;
  city: string;
  openingHours: string;
  mapEmbedUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBgImage: string;
  heroVideoUrl?: string;
  testimonialTitle?: string;
  featuredProjectSectionTitle?: string;
  featuredProjectSectionSubtitle?: string;
  featuredProjectBadgeLabel?: string;
  featuredProjectShowOnHome?: boolean;
  featuredProjectId?: string;
  seoTitle: string;
  seoDescription: string;
  aboutStory: string;
  aboutEyebrow?: string;
  aboutTitle?: string;
  aboutBgImage?: string;
  aboutMissionTitle?: string;
  aboutMissionDesc?: string;
  aboutVisionTitle?: string;
  aboutVisionDesc?: string;
  aboutCtaTitle?: string;
  aboutCtaDesc?: string;
  aboutCtaButtonText?: string;
  experienceYears: number;
  statsLabel1?: string;
  plantVarietiesCount: number;
  statsLabel2?: string;
  happyClientsCount: number;
  statsLabel3?: string;
  projectsCompletedCount: number;
  statsLabel4?: string;
  philosophySubtitle?: string;
  philosophyTitle?: string;
  pillar1Title?: string;
  pillar1Desc?: string;
  pillar2Title?: string;
  pillar2Desc?: string;
  pillar3Title?: string;
  pillar3Desc?: string;
  pillar4Title?: string;
  pillar4Desc?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  sunlight: string;
  water: string;
  difficulty: string;
  size: string;
  isFeaturedOnly: boolean;
}
