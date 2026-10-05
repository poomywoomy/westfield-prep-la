// Page-level JSON-LD builders.
//
// These are ported verbatim from src/components/StructuredData.tsx, which
// injected them through react-helmet-async. Helmet does not run during
// TanStack Start server rendering, so the markup never reached the HTML that
// crawlers and AI assistants read. Every builder here is emitted from a
// route's head() -> scripts array, which is server-rendered into view-source.
//
// Single source of truth: pages import the same data these builders consume.

export const SITE = "https://westfieldprepcenter.com";

type LdScript = { type: "application/ld+json"; children: string };
type Schema = Record<string, unknown>;

/** Resolves a site-relative asset path; absolute URLs pass through untouched. */
const absolute = (path: string) => (/^https?:\/\//i.test(path) ? path : `${SITE}${path}`);


/** Wraps a schema object as a server-rendered JSON-LD script tag entry. */
export const ldScript = (schema: Schema): LdScript => ({
  type: "application/ld+json",
  children: JSON.stringify(schema),
});

/** Builds several JSON-LD script entries from schema objects. */
export const ldScripts = (schemas: Array<Schema | null | undefined>): LdScript[] =>
  schemas.filter((s): s is Schema => s != null && Object.keys(s).length > 0).map(ldScript);

const PHONE = "+18189355478";
const EMAIL = "info@westfieldprepcenter.com";
const SOCIALS = [
  "https://www.linkedin.com/company/westfield-prep-center/?viewAsMember=true",
  "https://www.instagram.com/westfieldprepcenter/",
  "https://x.com/Westfield3PL",
];

// SAB-compliant: city/region only, no street address.
const SERVICE_AREA = [
  {
    "@type": "City",
    name: "Los Angeles",
    containedInPlace: { "@type": "State", name: "California" },
  },
  { "@type": "Country", name: "United States" },
];

const OPENING_HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "08:00",
  closes: "17:00",
  timeZone: "America/Los_Angeles",
};

export interface ServiceSchemaData {
  serviceType?: string;
  name: string;
  description: string;
  features?: string[];
}

export const organizationSchema = (): Schema => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Warehouse", "LogisticsService", "Service"],
  "@id": `${SITE}/#organization`,
  name: "Westfield Prep Center",
  legalName: "Sathatham LLC",
  alternateName: "Westfield Prep",
  description:
    "Professional Los Angeles Shopify prep center specializing in DTC fulfillment, custom branding, Amazon FBA prep, and multi-channel order processing. Serving e-commerce businesses nationwide.",
  additionalType: "https://www.productontology.org/id/Fulfillment_center",
  url: SITE,
  logo: `${SITE}/westfield-logo.png`,
  image: `${SITE}/westfield-logo.png`,
  telephone: PHONE,
  email: EMAIL,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: "34.0522", longitude: "-118.2437" },
  openingHoursSpecification: [OPENING_HOURS],
  serviceArea: SERVICE_AREA,
  areaServed: SERVICE_AREA,
  sameAs: SOCIALS,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "E-commerce Fulfillment Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Amazon FBA Prep Services",
          description:
            "Professional Amazon FBA preparation including labeling, poly-bagging, bubble wrapping, inspection, and shipping to Amazon fulfillment centers",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Shopify Fulfillment",
          description:
            "Complete Shopify order fulfillment with same-day processing, photo-proof QC, and inventory management",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Multi-Channel Fulfillment",
          description:
            "Order processing for multiple sales channels including TikTok Shop, Amazon, and direct-to-consumer",
        },
      },
    ],
  },
});

export const websiteSchema = (): Schema => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "Westfield Prep Center",
  url: SITE,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE}/blog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const localBusinessSchema = (): Schema => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Westfield Prep Center",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    postalCode: "91010",
    addressCountry: "US",
  },
  telephone: "818-935-5478",
  email: EMAIL,
  url: SITE,
});

export const contactSchema = (): Schema => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Westfield Prep Center",
  description:
    "Contact Westfield Prep Center for Shopify fulfillment, Amazon FBA prep, and e-commerce logistics services in Los Angeles.",
  mainEntity: {
    "@type": "Organization",
    name: "Westfield Prep Center",
    telephone: "+1-818-935-5478",
    email: EMAIL,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "17:00",
    },
  },
});

export const productSchema = (): Schema => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: "3PL Fulfillment Pricing",
  description:
    "Shopify, Amazon, and DTC 3PL pricing starting at $1.00/unit with 24-hour turnaround.",
  brand: { "@type": "Organization", name: "Westfield Prep Center" },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "1.00",
    highPrice: "2.50",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE}/pricing`,
  },
});

export const softwareSchema = (): Schema => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Westfield 3PL Integration Platform",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  featureList: [
    "Shopify fulfillment integration",
    "Amazon prep center sync",
    "Order routing and tracking",
    "Real-time inventory sync",
  ],
  url: `${SITE}/integrations`,
});

export const serviceSchema = (data: ServiceSchemaData): Schema => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE}/#service-${(data.serviceType || "default").toLowerCase().replace(/\s+/g, "-")}`,
  serviceType: data.serviceType,
  name: data.name,
  description: data.description,
  category: "Prep Center Services",
  provider: {
    "@type": "LocalBusiness",
    "@id": `${SITE}/#organization`,
    name: "Westfield Prep Center",
    telephone: PHONE,
  },
  areaServed: SERVICE_AREA,
  offers: {
    "@type": "AggregateOffer",
    price: "Custom",
    priceCurrency: "USD",
    description: "Custom pricing based on your business needs and volume",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: data.name,
    itemListElement: data.features?.map((feature) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: feature },
    })),
  },
});

export interface FaqItem {
  question: string;
  answer: string;
}

/** Accepts a plain array or the `{ questions }` / `{ faqs }` wrapper shapes. */
type FaqInput =
  | FaqItem[]
  | { questions?: FaqItem[]; faqs?: FaqItem[] }
  | { "@context"?: string; "@type"?: string; mainEntity?: unknown[] };

/**
 * Builds an FAQPage schema from a Q&A list, a wrapper object, or an already
 * formed FAQPage object (the shape several pages keep in their content module).
 */
export const faqSchema = (data: FaqInput): Schema | null => {
  if (!Array.isArray(data) && "mainEntity" in data && Array.isArray(data.mainEntity)) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.mainEntity,
    };
  }
  const faqArray: FaqItem[] = Array.isArray(data)
    ? data
    : (data as { questions?: FaqItem[]; faqs?: FaqItem[] }).questions ||
      (data as { questions?: FaqItem[]; faqs?: FaqItem[] }).faqs ||
      [];
  if (!faqArray.length || !faqArray.every((faq) => faq.question && faq.answer)) {
    return null;
  }
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqArray.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
};

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export const breadcrumbSchema = (items: BreadcrumbItem[]): Schema | null => {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE}${item.path}`,
    })),
  };
};

export interface CollectionPost {
  title: string;
  slug: string;
  published_at?: string;
  cover_image_url?: string | null;
  author_name?: string | null;
}

export const collectionPageSchema = (posts: CollectionPost[]): Schema => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Westfield Prep Center Blog",
  description:
    "Expert insights on Amazon FBA prep, Shopify fulfillment, and e-commerce logistics from our Los Angeles fulfillment center.",
  url: `${SITE}/blog`,
  publisher: {
    "@type": "Organization",
    name: "Westfield Prep Center",
    logo: `${SITE}/westfield-logo.png`,
  },
  mainEntity: {
    "@type": "Blog",
    name: "Westfield Prep Center Blog",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE}/blog/${post.slug}`,
      datePublished: post.published_at,
      image: post.cover_image_url
        ? absolute(post.cover_image_url)
        : `${SITE}/hero-warehouse-optimized.webp`,
      author: {
        "@type": "Person",
        name: post.author_name || "Westfield Prep Team",
      },
    })),
  },
});

export interface PlatformItem {
  name: string;
  description?: string;
  path?: string;
}

export const itemListSchema = (platforms: PlatformItem[]): Schema => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Supported E-commerce Platforms",
  description:
    "Multi-channel fulfillment support for major e-commerce platforms and marketplaces.",
  numberOfItems: platforms.length,
  itemListElement: platforms.map((platform, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: platform.name,
      description: platform.description || `${platform.name} fulfillment services`,
      url: platform.path ? `${SITE}${platform.path}` : SITE,
      provider: { "@type": "Organization", name: "Westfield Prep Center" },
    },
  })),
});

/**
 * Company profile page schema. Deliberately excludes aggregateRating: Google
 * treats ratings a business publishes about itself as self-serving. The
 * existing reviews markup stays where it already lives on /testimonials.
 */
export const aboutPageSchema = (): Schema => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE}/about`,
  name: "About Westfield Prep Center",
  description:
    "Westfield Prep Center is a Los Angeles fulfillment center and prep center for e-commerce brands shipping 1,000 or more orders per month, covering Shopify, Amazon FBA, and TikTok Shop.",
  url: `${SITE}/about`,
  mainEntity: {
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "Westfield Prep Center",
    legalName: "Sathatham LLC",
    url: SITE,
    telephone: PHONE,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
    sameAs: SOCIALS,
  },
});
