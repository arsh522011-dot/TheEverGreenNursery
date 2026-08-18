export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  h1: string;
}

export const SEO_PAGE_CONFIGS: Record<string, PageSEO> = {
  home: {
    title: 'The Ever Green Nursery | Plant Nursery for Exotic & Native Plants, Palms, Avenue Trees & Indoor Plants',
    description: 'Discover high quality plants, exotic plants, native plants, indoor plants, palms, avenue trees, groundcover plants, shrubs, cactus, succulents, and unique greenery for gardens at The Ever Green Nursery in Gajraula on NH-24 Delhi Road.',
    keywords: 'Plant Nursery, Exotic Plants, Native Plants, Indoor Plants, Palms, Avenue Trees, Groundcover Plants, Shrubs, Cactus, Succulents, High Quality Plants, Unique Greenery for Gardens, The Ever Green Nursery',
    canonicalPath: '/',
    h1: 'Plant Nursery for Exotic Plants, Native Plants & Unique Greenery for Gardens',
  },
  plants: {
    title: 'Exotic Plants, Native Plants, Palms, Avenue Trees & Succulents | The Ever Green Nursery',
    description: 'Explore high quality plants from our exotic plants nursery and indoor plants nursery. Featuring palms and avenue trees, shrubs, groundcover plants, cactus and succulent plants at The Ever Green Nursery.',
    keywords: 'Exotic Plants, Native Plants, Indoor Plants, Palms, Avenue Trees, Groundcover Plants, Shrubs, Cactus, Succulents, Exotic Plants Nursery, Indoor Plants Nursery, Palms and Avenue Trees, Cactus and Succulent Plants, High Quality Plants, The Ever Green Nursery',
    canonicalPath: '/plants',
    h1: 'Exotic Plants, Native Plants, Palms, Avenue Trees & Succulent Plants',
  },
  categories: {
    title: 'Plant Categories • Exotic Plants, Indoor Plants Nursery & Succulents | The Ever Green Nursery',
    description: 'Browse curated botanical categories including Indoor Plants Nursery, Outdoor Landscape Trees, Palms and Avenue Trees, Shrubs, Cactus and Succulent Plants, and Pots at The Ever Green Nursery.',
    keywords: 'Indoor Plants Nursery, Exotic Plants Nursery, Palms and Avenue Trees, Groundcover Plants, Shrubs, Cactus and Succulent Plants, High Quality Plants, The Ever Green Nursery',
    canonicalPath: '/categories',
    h1: 'Plant Categories • Exotic Plants, Palms & Indoor Plants Nursery',
  },
  'bulk-orders': {
    title: 'Bulk & Commercial Plant Supplier | High Quality Plants | The Ever Green Nursery',
    description: 'Order high quality plants, exotic plants, native plants, avenue trees, palms, and shrubs in bulk for commercial landscaping, builders, hotels, and institutional projects from The Ever Green Nursery.',
    keywords: 'High Quality Plants, Plant Nursery and Landscape, Bulk Plants, Palms and Avenue Trees, Landscaping Solutions, The Ever Green Nursery',
    canonicalPath: '/bulk-orders',
    h1: 'Bulk Orders & Commercial Supply of High Quality Plants',
  },
  services: {
    title: 'Landscaping Services & Landscaping Solutions | Plant Nursery and Landscape | The Ever Green Nursery',
    description: 'Professional landscaping solutions, landscaping services, estate master planning, and plant nursery and landscape contracting featuring high quality plants and unique greenery for gardens.',
    keywords: 'Landscaping Solutions, Landscaping Services, Plant Nursery and Landscape, High Quality Plants, Unique Greenery for Gardens, The Ever Green Nursery',
    canonicalPath: '/services',
    h1: 'Landscaping Services & Tailored Landscaping Solutions',
  },
  projects: {
    title: 'Plant Nursery and Landscape Projects Portfolio | The Ever Green Nursery',
    description: 'Explore our completed estate landscaping projects, residential gardens, and commercial landscaping solutions featuring high quality plants and unique greenery for gardens.',
    keywords: 'Plant Nursery and Landscape, Landscaping Solutions, High Quality Plants, Unique Greenery for Gardens, Landscaping Services, The Ever Green Nursery',
    canonicalPath: '/projects',
    h1: 'Completed Plant Nursery and Landscape Projects',
  },
  gallery: {
    title: '15-Acre Plant Nursery Farm & Greenhouses Gallery | The Ever Green Nursery',
    description: 'Tour 15 acres of climate-controlled shade houses, mother beds, and specimen groves showcasing exotic plants, palms, avenue trees, cactus and succulents at The Ever Green Nursery.',
    keywords: 'Plant Nursery, Exotic Plants Nursery, Palms and Avenue Trees, Cactus and Succulent Plants, High Quality Plants, The Ever Green Nursery',
    canonicalPath: '/gallery',
    h1: '15-Acre Plant Nursery Farm & Greenhouse Gallery',
  },
  about: {
    title: 'About The Ever Green Nursery | Plant Nursery and Landscape Solutions',
    description: 'Learn about The Ever Green Nursery, a trusted plant nursery and landscape partner growing high quality plants, native and exotic plants, palms, and delivering turnkey landscaping solutions since 2012.',
    keywords: 'The Ever Green Nursery, Evergreen Nursery, Plant Nursery, Native and Exotic Plants, High Quality Plants, Plant Nursery and Landscape, Landscaping Solutions',
    canonicalPath: '/about',
    h1: 'About The Ever Green Nursery - Plant Nursery and Landscape Solutions',
  },
  contact: {
    title: 'Visit Our Plant Nursery on NH-24 Delhi Road, Gajraula | The Ever Green Nursery',
    description: 'Get in touch with The Ever Green Nursery on NH-24 Delhi Road, Gajraula (District Amroha). Visit our plant nursery for high quality plants, exotic plants, palms, and custom landscaping solutions.',
    keywords: 'The Ever Green Nursery, Plant Nursery, Plant Nursery in Gajraula, High Quality Plants, Landscaping Solutions',
    canonicalPath: '/contact',
    h1: 'Visit The Ever Green Nursery on NH-24 Delhi Road, Gajraula',
  },
  'privacy-policy': {
    title: 'Privacy Policy | The Ever Green Nursery',
    description: 'Privacy policy and customer data protection practices for The Ever Green Nursery plant portal and inquiries.',
    keywords: 'Privacy Policy, The Ever Green Nursery',
    canonicalPath: '/privacy-policy',
    h1: 'Privacy Policy',
  },
  terms: {
    title: 'Terms & Conditions | The Ever Green Nursery',
    description: 'Terms and conditions governing plant nursery sales, commercial shipments, and landscaping services with The Ever Green Nursery.',
    keywords: 'Terms and Conditions, The Ever Green Nursery, Plant Nursery',
    canonicalPath: '/terms',
    h1: 'Terms & Conditions',
  },
};

export function getPageSEO(view: string, params?: Record<string, string>, plantName?: string, plantDescription?: string): PageSEO {
  if (view === 'plant-detail' && params?.id) {
    const name = plantName || 'High Quality Specimen Plant';
    return {
      title: `${name} | Exotic Plants & High Quality Nursery Flora | The Ever Green Nursery`,
      description: plantDescription 
        ? `${name} from The Ever Green Nursery. High quality plants and unique greenery for gardens. ${plantDescription.slice(0, 120)}`
        : `Discover high quality ${name} from The Ever Green Nursery on NH-24 Delhi Road, Gajraula. Available for retail, bulk orders, and landscaping solutions.`,
      keywords: `${name}, Exotic Plants, High Quality Plants, Unique Greenery for Gardens, Plant Nursery, The Ever Green Nursery`,
      canonicalPath: `/plants/${params.id}`,
      h1: `${name} - High Quality Plants & Living Decor`,
    };
  }

  if (view === 'plants' && params?.category) {
    const cat = params.category;
    return {
      title: `${cat} • High Quality Plants & Unique Greenery | The Ever Green Nursery`,
      description: `Explore our collection of ${cat} at The Ever Green Nursery. High quality plants, native and exotic plants, palms, shrubs, and succulents curated for gardens and landscapes.`,
      keywords: `${cat}, High Quality Plants, Exotic Plants, Native Plants, Plant Nursery, Unique Greenery for Gardens, The Ever Green Nursery`,
      canonicalPath: `/plants?category=${encodeURIComponent(cat)}`,
      h1: `${cat} - High Quality Plants & Nursery Collection`,
    };
  }

  return SEO_PAGE_CONFIGS[view] || SEO_PAGE_CONFIGS.home;
}
