import {
  ShoppingBag,
  Store,
  FileImage,
  Box as BoxIcon,
  Camera,
  PenTool,
  Palette,
  type LucideIcon,
} from "lucide-react";

export type CardVariant =
  | "shopify"
  | "amazon"
  | "aplus"
  | "storefront"
  | "imaging"
  | "photo"
  | "listing";

export type ModalVariant =
  | "side-sheet"
  | "dark-checklist"
  | "gallery"
  | "magazine"
  | "render-queue"
  | "contact-sheet"
  | "notebook";

export type LaunchpadTheme = {
  accent: string;
  accentSoft: string;
  ink: string;
  cardVariant: CardVariant;
  modalVariant: ModalVariant;
};

export type LaunchpadService = {
  slug: string;
  number: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  tagline: string;
  summary: string;
  description: string;
  includes: string[];
  deliverables: { title: string; desc: string }[];
  steps: { title: string; desc: string }[];
  theme: LaunchpadTheme;
};

const THEMES: Record<string, LaunchpadTheme> = {
  "shopify-website-creation": {
    accent: "#5E8E3E",
    accentSoft: "#E6EFDC",
    ink: "#0E2A12",
    cardVariant: "shopify",
    modalVariant: "side-sheet",
  },
  "amazon-seller-central-setup": {
    accent: "#FF9900",
    accentSoft: "#FFE6BF",
    ink: "#131A22",
    cardVariant: "amazon",
    modalVariant: "dark-checklist",
  },
  "aplus-content-storefront": {
    accent: "#6B2E8C",
    accentSoft: "#EFE3F5",
    ink: "#2A0F3A",
    cardVariant: "aplus",
    modalVariant: "gallery",
  },
  "storefront-design": {
    accent: "#1C1C1C",
    accentSoft: "#E8DFD0",
    ink: "#1C1C1C",
    cardVariant: "storefront",
    modalVariant: "magazine",
  },
  "3d-product-imaging": {
    accent: "#2B6CFF",
    accentSoft: "#D7E3FF",
    ink: "#08111F",
    cardVariant: "imaging",
    modalVariant: "render-queue",
  },
  "studio-photography": {
    accent: "#C2654A",
    accentSoft: "#F1DDD2",
    ink: "#2A140C",
    cardVariant: "photo",
    modalVariant: "contact-sheet",
  },
  "listing-optimization-copy": {
    accent: "#0E0E0E",
    accentSoft: "#FFF59A",
    ink: "#0E0E0E",
    cardVariant: "listing",
    modalVariant: "notebook",
  },
};

export const LAUNCHPAD_SERVICES: LaunchpadService[] = [
  {
    slug: "shopify-website-creation",
    number: "01",
    name: "Shopify Website Creation",
    shortName: "Shopify Build",
    icon: ShoppingBag,
    tagline: "A Shopify store that actually sells.",
    summary: "Theme setup, app stack, payments, and a clean admin you actually understand.",
    description:
      "We build Shopify storefronts that are tuned for conversion from day one. Theme, payments, taxes, shipping zones, and a curated app stack picked for your category — not a Frankenstein of plugins.",
    includes: [
      "Custom theme build or premium theme configuration",
      "Payments, shipping zones, and tax setup end to end",
      "App stack curated for your category (reviews, upsell, subs)",
      "Collections, navigation, and cart UX tuned for AOV",
      "Speed and Core Web Vitals optimization",
      "Admin training so your team can run it",
    ],
    deliverables: [
      { title: "Live Storefront", desc: "Production-ready store on your domain." },
      { title: "App Stack", desc: "Reviews, upsell, subscriptions, analytics." },
      { title: "Admin Handoff", desc: "Walkthrough video and docs for your team." },
    ],
    steps: [
      { title: "Discovery", desc: "Brand, catalog, and conversion goals." },
      { title: "Build", desc: "Theme, apps, payments, shipping, and content." },
      { title: "Launch", desc: "QA, soft launch, and admin handoff." },
    ],
  },
  {
    slug: "amazon-seller-central-setup",
    number: "02",
    name: "Amazon Seller Central Setup",
    shortName: "Amazon Setup",
    icon: Store,
    tagline: "Seller Central, done right.",
    summary: "Account registration, Brand Registry, category approvals, and listing infrastructure.",
    description:
      "We set up Seller Central the right way the first time so you don't get suspended in week three. Brand Registry, ungating, parent/child variations, and account health baked in.",
    includes: [
      "Seller Central registration & verification (US + global marketplaces)",
      "Brand Registry application and trademark guidance",
      "Restricted category ungating (beauty, grocery, supplements, more)",
      "Parent/child variation trees set up cleanly from day one",
      "Account health baseline and compliance review",
      "Tax setup and remittance configuration",
    ],
    deliverables: [
      { title: "Brand Registry", desc: "Trademark + IP protected." },
      { title: "Category Approvals", desc: "Ungating done for you." },
      { title: "Listing Infrastructure", desc: "Variations, parents, GTINs." },
      { title: "Account Health", desc: "Compliance from day one." },
    ],
    steps: [
      { title: "Audit", desc: "Trademark, tax, and category review." },
      { title: "Setup", desc: "Registration, Brand Registry, ungating." },
      { title: "Handoff", desc: "Account walkthrough and credentials." },
    ],
  },
  {
    slug: "aplus-content-storefront",
    number: "03",
    name: "A+ Content & Storefront",
    shortName: "A+ Content",
    icon: FileImage,
    tagline: "A+ modules that lift conversion.",
    summary: "Premium A+ content, comparison charts, and Amazon Storefronts.",
    description:
      "Premium A+ content, comparison charts, and Amazon Storefronts designed like a brand site, not an afterthought. Built to lift conversion and AOV.",
    includes: [
      "Premium A+ modules with brand story and lifestyle imagery",
      "Comparison charts that push shoppers up your catalog",
      "Multi-page Amazon Storefront design and build",
      "Mobile-optimized layouts that look right on every device",
      "SEO-aligned alt text and module copy",
      "Revisions until approved by Amazon",
    ],
    deliverables: [
      { title: "Hero Module", desc: "Brand story banner with lifestyle imagery." },
      { title: "Comparison Chart", desc: "Visual matrix that drives upsell." },
      { title: "Lifestyle Band", desc: "Editorial-grade imagery that builds trust." },
      { title: "Storefront Pages", desc: "Multi-page brand experience." },
    ],
    steps: [
      { title: "Concept", desc: "Brand story, modules, and storefront map." },
      { title: "Design", desc: "Modules, comparison chart, storefront pages." },
      { title: "Publish", desc: "Submit, revise, and go live on Amazon." },
    ],
  },
  {
    slug: "storefront-design",
    number: "04",
    name: "Storefront Design",
    shortName: "Storefront Design",
    icon: Palette,
    tagline: "Pixel perfect on every device.",
    summary: "Custom storefront design for Shopify themes and Amazon Storefronts.",
    description:
      "Custom storefront design across Shopify and Amazon. Designed once, looks right on desktop, tablet, and mobile. Built around how your shoppers actually scroll.",
    includes: [
      "Brand-aligned theme customization (Shopify + Amazon)",
      "Mobile-first responsive design tuned for thumb scroll",
      "Custom hero, PDP, and collection page layouts",
      "Conversion-rate audit and rebuild roadmap included",
      "Component library so future pages stay on-brand",
      "Accessibility and performance tuned in",
    ],
    deliverables: [
      { title: "Design System", desc: "Reusable components and tokens." },
      { title: "Page Layouts", desc: "Hero, PDP, collection, cart." },
      { title: "Responsive Build", desc: "Desktop, tablet, mobile." },
    ],
    steps: [
      { title: "Audit", desc: "Current store, conversion blockers, brand fit." },
      { title: "Design", desc: "Layouts, components, responsive variants." },
      { title: "Build", desc: "Implement in Shopify or Amazon Storefront." },
    ],
  },
  {
    slug: "3d-product-imaging",
    number: "05",
    name: "Product 3D Imaging",
    shortName: "3D Imaging",
    icon: BoxIcon,
    tagline: "Renders that look like studio shots.",
    summary: "Photoreal renders. No samples to ship, infinite angles, every colorway.",
    description:
      "Photoreal product renders that look like real studio shots. No samples to ship, no studio days to book. Perfect for SKUs not yet in production or large variant catalogs.",
    includes: [
      "No physical sample required to start",
      "Unlimited angles, colorways, and variants",
      "360° spins, exploded views, and packaging mockups",
      "Delivered Amazon-ready and web-optimized",
      "Source files and re-render rights included",
      "Lifestyle scenes and white-background shots",
    ],
    deliverables: [
      { title: "Hero Renders", desc: "Marketplace-ready primary images." },
      { title: "360° Spins", desc: "Interactive product views." },
      { title: "Variant Library", desc: "Every colorway, every angle." },
    ],
    steps: [
      { title: "CAD or Reference", desc: "We start from CAD, photos, or sketches." },
      { title: "Modeling", desc: "Build the 3D model and approve geometry." },
      { title: "Render", desc: "Final renders in every needed angle and variant." },
    ],
  },
  {
    slug: "studio-photography",
    number: "06",
    name: "Studio Photography",
    shortName: "Studio Photo",
    icon: Camera,
    tagline: "LA studio. Real models.",
    summary: "Coordinated sessions with models, props, and lifestyle sets in our LA studio.",
    description:
      "Coordinated sessions with models, props, and lifestyle sets shot in our Los Angeles studio. Ready for Amazon, Shopify, and ad creative.",
    includes: [
      "Model casting, styling, and on-set art direction",
      "Lifestyle, flat lay, ghost mannequin, and on-figure",
      "Props, sets, and scene design for editorial PDPs",
      "Same-day pulls if you store inventory with us",
      "Amazon-spec sizing and Shopify hero crops",
      "Color-corrected and retouched final files",
    ],
    deliverables: [
      { title: "Hero Shots", desc: "Marketplace primary images." },
      { title: "Lifestyle Set", desc: "Editorial PDP and ad creative." },
      { title: "Variant Coverage", desc: "Every SKU and colorway shot." },
    ],
    steps: [
      { title: "Pre-Pro", desc: "Casting, styling, shot list, set design." },
      { title: "Shoot Day", desc: "Coordinated session in our LA studio." },
      { title: "Delivery", desc: "Retouched, color-corrected, sized for every channel." },
    ],
  },
  {
    slug: "listing-optimization-copy",
    number: "07",
    name: "Listing Optimization & Copy",
    shortName: "Listing Copy",
    icon: PenTool,
    tagline: "Words that close the sale.",
    summary: "Titles, bullets, descriptions, and backend keywords by people who actually sell.",
    description:
      "Titles, bullets, descriptions, and backend keywords written by operators who actually sell on these platforms. Built to rank and convert, not just fill space.",
    includes: [
      "SEO-tuned titles for Amazon, Shopify, and Walmart",
      "Bullet copy that converts, not just describes",
      "Backend search terms and keyword research",
      "Brand voice consistency across channels",
      "Long-form product descriptions and FAQs",
      "A/B-ready copy variants for testing",
    ],
    deliverables: [
      { title: "Listing Copy", desc: "Titles, bullets, descriptions." },
      { title: "Keyword Map", desc: "Front-end and backend search terms." },
      { title: "Brand Voice Guide", desc: "Consistency across channels." },
    ],
    steps: [
      { title: "Research", desc: "Category, competitors, search terms." },
      { title: "Write", desc: "Titles, bullets, descriptions, backend." },
      { title: "Deploy", desc: "Upload to Seller Central or Shopify." },
    ],
  },
];

export const getServiceBySlug = (slug: string | null | undefined) =>
  LAUNCHPAD_SERVICES.find((s) => s.slug === slug);
