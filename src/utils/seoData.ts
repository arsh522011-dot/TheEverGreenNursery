export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  h1: string;
}

export const SEO_PAGE_CONFIGS: Record<string, PageSEO> = {
  home: {
    title: 'The Ever Green Nursery | Wholesale Plant Nursery in Gajraula & Delhi Road (NH-24)',
    description: 'The Ever Green Nursery is a premier wholesale plant nursery located on NH-24 Delhi Road in Gajraula (Amroha). We supply wholesale indoor plants, landscape trees, ornamental shrubs & bulk nursery plants for landscapers, builders, hotels, institutions & contractors.',
    keywords: 'wholesale plant nursery, wholesale plants, wholesale nursery, plants wholesale supplier, wholesale plants in Gajraula, wholesale plant nursery in Amroha, plant nursery near Hasanpur, wholesale plants near Sambhal, wholesale nursery near NH-24, plant nursery near Delhi Road, commercial plant supplier, bulk plants supplier, plants for landscaping, landscaping plants supplier, indoor plants wholesale, outdoor plants wholesale',
    canonicalPath: '/',
    h1: 'Wholesale Plant Nursery in Gajraula & Commercial Plant Supplier',
  },
  plants: {
    title: 'Wholesale Plants & Bulk Nursery Supplies in Gajraula, Amroha | The Ever Green Nursery',
    description: 'Explore wholesale indoor plants, outdoor landscape trees, flowering ornamentals, palms & shrubs at direct nursery rates from The Ever Green Nursery in Gajraula, Amroha, Hasanpur & Sambhal.',
    keywords: 'wholesale plants, wholesale nursery plants, landscaping plants supplier, bulk plants Gajraula Amroha, commercial plant supplier, indoor plants wholesale, outdoor plants wholesale',
    canonicalPath: '/plants',
    h1: 'Wholesale Nursery Plants & Bulk Commercial Flora',
  },
  categories: {
    title: 'Wholesale Plant Categories | Indoor, Outdoor & Pots | The Ever Green Nursery',
    description: 'Browse wholesale plant categories including Indoor Plants, Outdoor Plants, and Pots at The Ever Green Nursery in Gajraula on NH-24 Delhi Road.',
    keywords: 'indoor plants wholesale, outdoor plants wholesale, pots wholesale, nursery pots, wholesale plant nursery in Gajraula, nursery categories',
    canonicalPath: '/categories',
    h1: 'Wholesale Plant Categories & Varieties',
  },
  'bulk-orders': {
    title: 'Bulk & Commercial Plant Supplier | Landscaping & Contractors | The Ever Green Nursery',
    description: 'Order bulk plants for commercial projects, corporate campuses, builders, hotels & landscaping contracts near Gajraula, Amroha, Hasanpur, Sambhal & Delhi NCR with verified quality.',
    keywords: 'commercial plant supplier, bulk plants supplier, plants for landscaping, bulk plants for commercial projects, wholesale nursery near NH-24, B2B plant orders',
    canonicalPath: '/bulk-orders',
    h1: 'Bulk Plant Orders & Wholesale Commercial Supply',
  },
  services: {
    title: 'Commercial Landscaping & Nursery Services near Amroha, Sambhal | The Ever Green Nursery',
    description: 'Professional landscape architecture, farm plantation, corporate plant maintenance & wholesale nursery supply across Gajraula, Amroha, Hasanpur, Sambhal and NH-24 Delhi Road.',
    keywords: 'commercial plant supplier, landscaping plants supplier, nursery plants supplier, Delhi Road, landscape contractors Gajraula, estate plantation Amroha',
    canonicalPath: '/services',
    h1: 'Commercial Landscaping & Horticultural Contracting Services',
  },
  projects: {
    title: 'Commercial Landscaping & Plantation Projects | The Ever Green Nursery',
    description: 'View our completed commercial plantation, estate landscaping, and wholesale nursery supply projects in Gajraula, Amroha, Sambhal, and surrounding regions.',
    keywords: 'landscaping plants supplier near Delhi Road, commercial plant projects, estate landscaping Gajraula, institutional plantation Amroha',
    canonicalPath: '/projects',
    h1: 'Completed Commercial & Estate Landscaping Projects',
  },
  gallery: {
    title: 'Wholesale Plant Nursery Farm & Greenhouse Gallery | Gajraula, NH-24',
    description: 'Tour our 15-acre wholesale plant nursery greenhouses, mother beds, and specimen groves located on NH-24 Delhi Road near Gajraula and Amroha.',
    keywords: 'plant nursery near Gajraula, wholesale nursery near NH-24, plant nursery near Delhi Road, nursery greenhouse gallery Gajraula',
    canonicalPath: '/gallery',
    h1: '15-Acre Wholesale Nursery Farm & Greenhouse Gallery',
  },
  about: {
    title: 'About The Ever Green Nursery | Wholesale Plant Grower & Supplier in Gajraula',
    description: 'Learn about The Ever Green Nursery, a trusted wholesale plant nursery growing over 650+ varieties of indoor, outdoor, and landscaping plants on NH-24 Delhi Road, Amroha.',
    keywords: 'wholesale plant nursery in Gajraula, wholesale nursery near Amroha, plant nursery near Hasanpur, nursery history Gajraula',
    canonicalPath: '/about',
    h1: 'About The Ever Green Nursery - Botanical Heritage & Wholesale Cultivation',
  },
  contact: {
    title: 'Contact Wholesale Nursery in Gajraula, Amroha | The Ever Green Nursery',
    description: 'Get in touch with The Ever Green Nursery on NH-24 Delhi Road, Gajraula, District Amroha (UP). Visit our wholesale farm or contact us for instant B2B quotes and nursery visits.',
    keywords: 'plant nursery near Gajraula, plants supplier in Amroha, Hasanpur, Sambhal, wholesale nursery contact NH-24 Delhi Road',
    canonicalPath: '/contact',
    h1: 'Visit Our Wholesale Nursery on NH-24 Delhi Road, Gajraula',
  },
  'privacy-policy': {
    title: 'Privacy Policy | The Ever Green Nursery',
    description: 'Privacy policy and client data protection practices for The Ever Green Nursery wholesale plant portal and inquiries.',
    keywords: 'privacy policy, The Ever Green Nursery',
    canonicalPath: '/privacy-policy',
    h1: 'Privacy Policy',
  },
  terms: {
    title: 'Terms & Conditions | Wholesale Plant Supply | The Ever Green Nursery',
    description: 'Terms and conditions governing wholesale plant orders, commercial shipments, and horticultural contracts with The Ever Green Nursery.',
    keywords: 'terms and conditions, wholesale nursery terms',
    canonicalPath: '/terms',
    h1: 'Terms & Conditions',
  },
};

export function getPageSEO(view: string, params?: Record<string, string>, plantName?: string, plantDescription?: string): PageSEO {
  if (view === 'plant-detail' && params?.id) {
    const name = plantName || 'Wholesale Specimen Plant';
    return {
      title: `${name} Wholesale & Bulk Supply | The Ever Green Nursery Gajraula`,
      description: plantDescription 
        ? `Wholesale ${name} available in bulk for landscapers, nurseries & commercial projects from The Ever Green Nursery in Gajraula (Amroha). ${plantDescription.slice(0, 120)}`
        : `Wholesale ${name} available in commercial bulk quantities with direct nursery rates from The Ever Green Nursery on NH-24 Delhi Road, Gajraula.`,
      keywords: `wholesale ${name}, buy ${name} in bulk, ${name} price wholesale, commercial plant supplier Gajraula, landscaping plants supplier Amroha`,
      canonicalPath: `/plants/${params.id}`,
      h1: `${name} - Wholesale Commercial Supply`,
    };
  }

  if (view === 'plants' && params?.category) {
    const cat = params.category;
    return {
      title: `Wholesale ${cat} Plants in Gajraula, Amroha | The Ever Green Nursery`,
      description: `Wholesale ${cat} plants available in commercial bulk volumes. Direct nursery prices for contractors, landscapers and builders across Gajraula, Amroha, Hasanpur & Sambhal.`,
      keywords: `wholesale ${cat} plants, ${cat} plants bulk supplier, wholesale nursery Gajraula, commercial ${cat} plants Amroha`,
      canonicalPath: `/plants?category=${encodeURIComponent(cat)}`,
      h1: `Wholesale ${cat} Plants & Commercial Supply`,
    };
  }

  return SEO_PAGE_CONFIGS[view] || SEO_PAGE_CONFIGS.home;
}
