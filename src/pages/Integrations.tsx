import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  ArrowRight,
  Zap,
  Globe,
  Check,
  Shield,
  MessageSquare,
  ChevronRight,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Brand icons from react-icons
import {
  SiShopify,
  SiAmazon,
  SiWalmart,
  SiTiktok,
  SiEtsy,
  SiWoo,
  SiBigcommerce,
  SiMagento,
  SiPrestashop,
  SiWix,
  SiDhl,
  SiFedex,
  SiUps,
  SiUsps,
  SiDeutschepost,
} from "react-icons/si";
import { IconType } from "react-icons";

// Brand colors for platforms - darker, more vibrant
const brandColors: Record<string, string> = {
  shopify: "#5E8E3E",
  shopifyPlus: "#3D6B29",
  amazon: "#FF9900",
  walmart: "#0057A0",
  tiktok: "#000000",
  etsy: "#D5581D",
  woocommerce: "#674399",
  bigcommerce: "#121118",
  faire: "#1A1A1A",
  magento: "#EE672F",
  prestashop: "#DF0067",
  wix: "#0C6EFC",
  mystore: "#1D4ED8",
  salesforce: "#00A1E0",
  lightspeed: "#78BE20",
  shipstation: "#84BD00",
};

const carrierColors: Record<string, string> = {
  dhl: "#D40511",
  fedex: "#4D148C",
  ups: "#351C15",
  usps: "#004B87",
  shipstation: "#5A9A00",
  canadapost: "#E4002B",
  australiapost: "#E4002B",
  deutschepost: "#D40511",
};

// Platform icon mapping
const platformIcons: Record<string, IconType | null> = {
  shopify: SiShopify,
  shopifyPlus: SiShopify,
  amazon: SiAmazon,
  walmart: SiWalmart,
  tiktok: SiTiktok,
  etsy: SiEtsy,
  woocommerce: SiWoo,
  bigcommerce: SiBigcommerce,
  faire: null,
  magento: SiMagento,
  prestashop: SiPrestashop,
  wix: SiWix,
  mystore: null,
};

// Image-based logos for platforms without good react-icons
const logoImages: Record<string, string> = {
  mystore: "/integration-logos/mystore-logo.jpeg",
  faire: "/integration-logos/faire-logo.png",
  salesforce: "/integration-logos/salesforce-logo.jpeg",
  lightspeed: "/integration-logos/lightspeed-logo.svg",
  shipstation: "/integration-logos/shipstation-logo.png",
};

// Image-based carrier logos
const carrierLogoImages: Record<string, string> = {
  uship: "/integration-logos/uship-logo.png",
  ehub: "/integration-logos/ehub-logo.jpeg",
  pitneybowes: "/integration-logos/pitneybowes-logo.svg",
  postnord: "/integration-logos/postnord-logo.svg",
  bring: "/integration-logos/bring-logo.svg",
  canadapost: "/integration-logos/canadapost-logo.png",
  asendia: "/integration-logos/asendia-logo.png?v=2",
  australiapost: "/integration-logos/australiapost-logo.png",
  startrack: "/integration-logos/australiapost-logo.png",
  nzcouriers: "/integration-logos/nzcouriers-logo.jpeg",
  tusk: "/integration-logos/tusk-logo.jpeg",
  passport: "/integration-logos/passport-logo.jpeg",
  stallion: "/integration-logos/stallion-logo.png",
  vesyl: "/integration-logos/vesyl-logo.jpeg",
  flavorcloud: "/integration-logos/flavorcloud-logo.png?v=2",
  buku: "/integration-logos/bukuship-logo.png?v=2",
};

// Size multipliers for logos with extra whitespace
const logoSizeMultiplier: Record<string, number> = {
  salesforce: 1.5,
};

// Carrier icon mapping
const carrierIcons: Record<string, IconType | null> = {
  dhl: SiDhl,
  fedex: SiFedex,
  ups: SiUps,
  usps: SiUsps,
  deutschepost: SiDeutschepost,
};

// Provider group colors
const providerColors: Record<string, string> = {
  native: "#22C55E",
  orderdesk: "#3B82F6",
  pipe17: "#8B5CF6",
  easypost: "#F97316",
  webshipper: "#F59E0B",
};

// Platform type definition
interface Platform {
  name: string;
  key: string;
  syncTypes: string[];
  connectionType: string;
  description: string;
  isHero?: boolean;
  badge?: string;
}

// Platforms grouped by connection provider
const platformGroups: Record<string, { title: string; color: string; platforms: Platform[] }> = {
  native: {
    title: "Native Integrations",
    color: providerColors.native,
    platforms: [
      {
        name: "Shopify",
        key: "shopify",
        syncTypes: ["Orders", "Inventory", "Shipping"],
        connectionType: "Native OAuth",
        description: "Seamlessly sync your Shopify store with real-time order imports, inventory updates, and automatic tracking.",
        isHero: true,
        badge: "Most Popular",
      },
      {
        name: "Shopify Plus",
        key: "shopifyPlus",
        syncTypes: ["Orders", "Inventory", "Shipping", "Scripts"],
        connectionType: "Native OAuth",
        description: "Enterprise-grade integration with advanced features for high-volume merchants.",
        badge: "Enterprise",
      },
    ],
  },
  orderdesk: {
    title: "Connected via OrderDesk",
    color: providerColors.orderdesk,
    platforms: [
      {
        name: "Amazon",
        key: "amazon",
        syncTypes: ["Orders", "Inventory", "FBA Prep"],
        connectionType: "via OrderDesk",
        description: "Full Amazon Seller Central integration with FBA prep and inventory sync capabilities.",
      },
      {
        name: "Walmart",
        key: "walmart",
        syncTypes: ["Orders", "Inventory", "WFS"],
        connectionType: "via OrderDesk",
        description: "Connect your Walmart Marketplace with WFS-ready fulfillment support.",
        badge: "WFS Ready",
      },
      {
        name: "TikTok Shop",
        key: "tiktok",
        syncTypes: ["Orders", "Inventory"],
        connectionType: "via OrderDesk",
        description: "Fulfill TikTok Shop orders with automatic inventory sync and tracking updates.",
      },
      {
        name: "Faire",
        key: "faire",
        syncTypes: ["Orders", "Inventory"],
        connectionType: "via OrderDesk",
        description: "Wholesale marketplace integration for B2B order fulfillment.",
      },
      {
        name: "ShipStation",
        key: "shipstation",
        syncTypes: ["Orders", "Shipping"],
        connectionType: "via OrderDesk",
        description: "Multi-carrier shipping platform integration for label printing and tracking.",
      },
      {
        name: "Salesforce",
        key: "salesforce",
        syncTypes: ["Orders", "CRM"],
        connectionType: "via OrderDesk",
        description: "Enterprise CRM integration for unified customer and order management.",
      },
    ],
  },
  pipe17: {
    title: "Connected via Pipe17",
    color: providerColors.pipe17,
    platforms: [
      {
        name: "Lightspeed",
        key: "lightspeed",
        syncTypes: ["Orders", "Inventory", "POS"],
        connectionType: "via Pipe17",
        description: "Retail POS and e-commerce platform integration for omnichannel selling.",
      },
    ],
  },
  other: {
    title: "Additional Platforms",
    color: "#6B7280",
    platforms: [
      {
        name: "Etsy",
        key: "etsy",
        syncTypes: ["Orders", "Inventory"],
        connectionType: "REST API",
        description: "Sync your Etsy shop orders and manage inventory across all channels.",
      },
      {
        name: "WooCommerce",
        key: "woocommerce",
        syncTypes: ["Orders", "Inventory", "Shipping"],
        connectionType: "REST API",
        description: "WordPress WooCommerce integration with webhook support for real-time updates.",
      },
      {
        name: "BigCommerce",
        key: "bigcommerce",
        syncTypes: ["Orders", "Inventory"],
        connectionType: "REST API",
        description: "Enterprise e-commerce platform integration with full order management.",
      },
      {
        name: "Magento",
        key: "magento",
        syncTypes: ["Orders", "Inventory"],
        connectionType: "REST API",
        description: "Adobe Commerce / Magento integration for enterprise merchants.",
      },
      {
        name: "Prestashop",
        key: "prestashop",
        syncTypes: ["Orders", "Inventory"],
        connectionType: "Web Services",
        description: "European e-commerce platform with multi-language support.",
      },
      {
        name: "Wix",
        key: "wix",
        syncTypes: ["Orders", "Inventory"],
        connectionType: "REST API",
        description: "Wix eCommerce store integration with automatic order sync.",
      },
      {
        name: "MyStore",
        key: "mystore",
        syncTypes: ["Orders", "Inventory"],
        connectionType: "API",
        description: "MyStore platform integration for order and inventory management.",
      },
    ],
  },
};

// Flatten all platforms for lookup
const allPlatforms = Object.values(platformGroups).flatMap(group => group.platforms);

// Shipping carriers grouped by connection provider
const carrierGroups = {
  easypost: {
    title: "Connected via EasyPost & eHub",
    provider: "EasyPost",
    providerColor: "#F97316",
    carriers: [
      { name: "DHL", key: "dhl", color: "#FFCC00" },
      { name: "FedEx", key: "fedex", color: "#4D148C" },
      { name: "UPS", key: "ups", color: "#351C15" },
      { name: "USPS", key: "usps", color: "#004B87" },
      { name: "eHub", key: "ehub", color: "#00B4D8" },
      { name: "Pitney Bowes", key: "pitneybowes", color: "#E4002B" },
    ],
  },
  webshipper: {
    title: "Connected via WebShipper",
    provider: "WebShipper",
    providerColor: "#F59E0B",
    carriers: [
      { name: "Deutsche Post", key: "deutschepost", color: "#FFCC00" },
      { name: "Asendia", key: "asendia", color: "#E4002B" },
      { name: "Postnord", key: "postnord", color: "#00A3E0" },
      { name: "Bring", key: "bring", color: "#7BC144" },
    ],
  },
  regional: {
    title: "Regional Carriers",
    provider: null,
    providerColor: "#6B7280",
    carriers: [
      { name: "Canada Post", key: "canadapost", color: "#E4002B" },
      { name: "Stallion Express", key: "stallion", color: "#2C5234" },
      { name: "Australia Post", key: "australiapost", color: "#E4002B" },
      { name: "StarTrack", key: "startrack", color: "#E4002B" },
      { name: "NZ Couriers", key: "nzcouriers", color: "#00529B" },
    ],
  },
  multiCarrier: {
    title: "Multi-Carrier Tools",
    provider: null,
    providerColor: "#8B5CF6",
    carriers: [
      { name: "Tusk Logistics", key: "tusk", color: "#1E3A5F" },
      { name: "Buku Ship", key: "buku", color: "#FF6B35" },
      { name: "uShip", key: "uship", color: "#00A651" },
      { name: "Vesyl", key: "vesyl", color: "#6366F1" },
      { name: "Passport Shipping", key: "passport", color: "#1E40AF" },
      { name: "FlavorCloud", key: "flavorcloud", color: "#FF4081" },
    ],
  },
};

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4 } 
  },
};

// Render platform icon - natural colors, no opacity backgrounds
const PlatformIcon = ({ 
  platformKey, 
  size = 36, 
  color,
}: { 
  platformKey: string; 
  size?: number; 
  color: string;
}) => {
  // Check for image-based logo first
  const logoImage = logoImages[platformKey];
  if (logoImage) {
    // Apply size multiplier for logos with whitespace
    const multiplier = logoSizeMultiplier[platformKey] || 1;
    const adjustedSize = size * multiplier;
    return (
      <img 
        src={logoImage} 
        alt={platformKey} 
        className="object-contain rounded"
        style={{ width: adjustedSize, height: adjustedSize }}
      />
    );
  }
  
  const Icon = platformIcons[platformKey];
  
  if (Icon) {
    return <Icon size={size} color={color} />;
  }
  
  // Text fallback with solid colored background and white text
  const initials = platformKey.slice(0, 2).toUpperCase();
  return (
    <div 
      className="rounded-lg flex items-center justify-center font-bold text-white"
      style={{ 
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
};

// Render carrier icon - natural colors, no opacity backgrounds
const CarrierIcon = ({ 
  carrierKey, 
  carrierName,
  size = 32, 
  color,
}: { 
  carrierKey: string; 
  carrierName: string;
  size?: number; 
  color: string;
}) => {
  // Check for image-based logo first
  const logoImage = carrierLogoImages[carrierKey];
  if (logoImage) {
    return (
      <img 
        src={logoImage} 
        alt={carrierName} 
        className="object-contain rounded"
        style={{ width: size, height: size }}
      />
    );
  }
  
  const Icon = carrierIcons[carrierKey];
  
  if (Icon) {
    return <Icon size={size} color={color} />;
  }
  
  // Text fallback with solid colored background and white text
  const initials = carrierName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div 
      className="rounded-lg flex items-center justify-center font-bold text-white"
      style={{ 
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
};

// Hero floating brand logos - larger icons
const HeroBrandLogos = () => {
  const brands = [
    { name: "Shopify", key: "shopify", color: brandColors.shopify },
    { name: "Amazon", key: "amazon", color: brandColors.amazon },
    { name: "Walmart", key: "walmart", color: brandColors.walmart },
    { name: "FedEx", key: "fedex", color: carrierColors.fedex },
    { name: "UPS", key: "ups", color: carrierColors.ups },
    { name: "DHL", key: "dhl", color: carrierColors.dhl },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="flex flex-wrap justify-center gap-3 mt-8"
    >
      {brands.map((brand) => {
        const isPlatform = platformIcons[brand.key] !== undefined;
        const Icon = isPlatform ? platformIcons[brand.key] : carrierIcons[brand.key];
        
        return (
          <motion.div
            key={brand.name}
            variants={cardVariants}
            className="px-4 py-2.5 rounded-full bg-white shadow-md border border-gray-100 flex items-center gap-2.5 hover:shadow-lg transition-all"
          >
            {Icon ? (
              <Icon size={24} color={brand.color} />
            ) : (
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" 
                style={{ backgroundColor: brand.color }}
              >
                {brand.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-gray-800 text-sm font-semibold">{brand.name}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// Platform Card Component
const PlatformCard = ({ 
  platform, 
  onClick,
  providerColor,
}: { 
  platform: Platform; 
  onClick: () => void;
  providerColor?: string;
}) => {
  const isHero = platform.isHero;
  const color = brandColors[platform.key] || "#6366F1";
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className={`
        group relative cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden
        ${isHero 
          ? 'col-span-2 row-span-2 bg-gradient-to-br from-white to-gray-50 shadow-2xl' 
          : 'bg-white shadow-md hover:shadow-xl'
        }
      `}
      style={{
        borderWidth: isHero ? 2 : 1,
        borderColor: isHero ? color : 'hsl(var(--border))',
      }}
    >
      {/* Colored glow for hero card */}
      {isHero && (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ 
            background: `radial-gradient(ellipse at top left, ${color}, transparent 60%)` 
          }}
        />
      )}

      {/* Badge */}
      {platform.badge && (
        <div className="absolute top-0 left-4 z-20">
          <div
            className="flex items-center gap-1 text-white text-xs px-3 py-1.5 rounded-b-lg shadow-lg font-medium"
            style={{ backgroundColor: color }}
          >
            {platform.badge === "Most Popular" && <Sparkles className="w-3 h-3" />}
            {platform.badge}
          </div>
        </div>
      )}

      <div className={`relative z-10 ${isHero ? 'p-8' : 'p-5'}`}>
        {/* Logo/Icon Area - clean white background */}
        <div 
          className={`
            rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-white shadow-sm border border-gray-100
            ${isHero ? 'w-24 h-24' : 'w-14 h-14'}
            ${platform.badge ? 'mt-6 mb-4' : 'mb-4'}
          `}
        >
          <PlatformIcon 
            platformKey={platform.key}
            size={isHero ? 56 : 36}
            color={color}
          />
        </div>

        {/* Platform Name */}
        <h3 className={`font-bold text-gray-900 mb-2 ${isHero ? 'text-2xl' : 'text-base'}`}>
          {platform.name}
        </h3>

        {/* Description - only on hero */}
        {isHero && (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {platform.description}
          </p>
        )}

        {/* Sync Type Pills - stronger colors */}
        <div className="flex flex-wrap gap-1.5">
          {platform.syncTypes.slice(0, isHero ? 4 : 2).map((sync) => (
            <span
              key={sync}
              className="text-xs px-2 py-1 rounded-full font-semibold"
              style={{ 
                backgroundColor: `${color}25`,
                color: color
              }}
            >
              {sync}
            </span>
          ))}
          {!isHero && platform.syncTypes.length > 2 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600 font-medium">
              +{platform.syncTypes.length - 2}
            </span>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5" style={{ color }} />
        </div>
      </div>

      {/* Colored bottom border accent */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};

// Carrier Card Component - clean white backgrounds, larger icons
const CarrierCard = ({ carrier }: { carrier: { name: string; key: string; color: string } }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -4 }}
      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
    >
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-white shadow-sm border border-gray-100"
      >
        <CarrierIcon 
          carrierKey={carrier.key}
          carrierName={carrier.name}
          size={36}
          color={carrier.color}
        />
      </div>
      <span className="font-semibold text-gray-800">{carrier.name}</span>
    </motion.div>
  );
};

const Integrations = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show floating CTA after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shopify & Amazon Integrations | Los Angeles 3PL | Westfield</title>
        <meta
          name="description"
          content="Connect Shopify, Amazon, Walmart & TikTok Shop in minutes. Real-time order sync, inventory management & 24+ carrier integrations. No developers needed."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/integrations" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Shopify & Amazon Integrations | Los Angeles 3PL" />
        <meta property="og:description" content="Connect Shopify, Amazon, Walmart & TikTok Shop in minutes. Real-time order sync, inventory management & 24+ carrier integrations." />
        <meta property="og:url" content="https://westfieldprepcenter.com/integrations" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://westfieldprepcenter.com/warehouse-hero-bg.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shopify & Amazon Integrations | Los Angeles 3PL" />
        <meta name="twitter:description" content="Connect Shopify, Amazon, Walmart & TikTok Shop in minutes. Real-time order sync & 24+ carrier integrations." />
        <meta name="twitter:image" content="https://westfieldprepcenter.com/warehouse-hero-bg.jpg" />
        
        {/* Combined JSON-LD Schema: ItemList + FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": "https://westfieldprepcenter.com/integrations",
                "name": "E-Commerce Integrations",
                "description": "Connect Shopify, Amazon, Walmart & TikTok Shop in minutes. Real-time order sync, inventory management & 24+ carrier integrations.",
                "url": "https://westfieldprepcenter.com/integrations",
                "isPartOf": {
                  "@type": "WebSite",
                  "name": "Westfield Prep Center",
                  "url": "https://westfieldprepcenter.com"
                },
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://westfieldprepcenter.com" },
                    { "@type": "ListItem", "position": 2, "name": "Integrations", "item": "https://westfieldprepcenter.com/integrations" }
                  ]
                }
              },
              {
                "@type": "ItemList",
                "name": "E-Commerce & Fulfillment Integrations",
                "description": "Los Angeles 3PL integrations for Shopify fulfillment, Amazon FBA, and multi-channel ecommerce",
                "numberOfItems": 14,
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Shopify", "description": "Real-time order sync, inventory management, and automated fulfillment for Shopify stores" },
                  { "@type": "ListItem", "position": 2, "name": "Amazon", "description": "FBA prep, seller fulfilled, and multi-channel Amazon integration" },
                  { "@type": "ListItem", "position": 3, "name": "Walmart", "description": "Walmart Marketplace and WFS integration with automated order processing" },
                  { "@type": "ListItem", "position": 4, "name": "TikTok Shop", "description": "TikTok Shop fulfillment with real-time inventory sync" },
                  { "@type": "ListItem", "position": 5, "name": "eBay", "description": "eBay marketplace integration for order and inventory management" },
                  { "@type": "ListItem", "position": 6, "name": "Etsy", "description": "Etsy seller integration with automated order fulfillment" },
                  { "@type": "ListItem", "position": 7, "name": "WooCommerce", "description": "WooCommerce plugin for seamless WordPress store fulfillment" },
                  { "@type": "ListItem", "position": 8, "name": "ShipStation", "description": "ShipStation integration for multi-carrier shipping automation" },
                  { "@type": "ListItem", "position": 9, "name": "Shippo", "description": "Shippo API integration for shipping rate comparison" },
                  { "@type": "ListItem", "position": 10, "name": "EasyPost", "description": "EasyPost integration for enterprise shipping solutions" },
                  { "@type": "ListItem", "position": 11, "name": "Packiyo", "description": "Packiyo WMS integration for warehouse management" },
                  { "@type": "ListItem", "position": 12, "name": "CRSTL", "description": "CRSTL integration for EDI and retail compliance" },
                  { "@type": "ListItem", "position": 13, "name": "Lumi", "description": "Lumi integration for custom packaging fulfillment" },
                  { "@type": "ListItem", "position": 14, "name": "Rabot", "description": "Rabot integration for inventory optimization" }
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How do Shopify integrations work with Westfield Prep Center?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Our Shopify integration connects directly to your store via OAuth. Once connected, orders automatically sync in real-time, inventory updates push to Shopify within minutes, and tracking numbers are uploaded automatically when orders ship. Setup takes less than 10 minutes with no coding required."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do you support real-time order syncing?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, all our e-commerce integrations support real-time order syncing via webhooks. When a customer places an order on your store, it appears in our system within seconds. Inventory levels sync bidirectionally, so your store always shows accurate stock counts."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What marketplaces and platforms can connect to Westfield?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We integrate with Shopify, Amazon (FBA and Seller Fulfilled), Walmart, TikTok Shop, eBay, Etsy, WooCommerce, BigCommerce, Magento, and more. We also connect with shipping platforms like ShipStation, Shippo, and EasyPost, plus 24+ carriers including FedEx, UPS, USPS, and DHL."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do I need a developer to set up integrations?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No developer needed. Our integrations are plug-and-play with guided setup. Simply authenticate your store, configure your preferences, and start syncing. Most clients complete setup in under 10 minutes. Our team is available to help if you need assistance."
                    }
                  }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      <Header />
      <Breadcrumbs items={[{ label: "Home", path: "/" }, { label: "Integrations", path: "/integrations" }]} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 pt-20 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeUpVariants}>
              <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Plug & Play Integrations
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeUpVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Connect Your Entire E-Commerce Operation
            </motion.h1>

            <motion.p 
              variants={fadeUpVariants}
              className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Instantly sync orders, inventory, and shipping across all major marketplaces, platforms, and carriers.
            </motion.p>

            <motion.div variants={fadeUpVariants}>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  Talk to an Integration Specialist
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <HeroBrandLogos />
          </motion.div>
        </div>
      </section>

      {/* E-Commerce Integrations - Grouped by Provider */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeUpVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              E-Commerce Integrations
            </motion.h2>
            <motion.p 
              variants={fadeUpVariants}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Connect your online store in minutes. We integrate with major e-commerce platforms 
              through native connections and trusted middleware partners.
            </motion.p>
          </motion.div>

          {/* Platform Groups */}
          <div className="space-y-16">
            {Object.entries(platformGroups).map(([groupKey, group]) => (
              <motion.div
                key={groupKey}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {/* Group Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{group.title}</h3>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500 font-medium">
                    {group.platforms.length} {group.platforms.length === 1 ? 'platform' : 'platforms'}
                  </span>
                </div>

                {/* Platform Grid */}
                <motion.div 
                  variants={staggerContainer}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                >
                  {group.platforms.map((platform) => (
                    <PlatformCard
                      key={platform.name}
                      platform={platform}
                      providerColor={group.color}
                      onClick={() => setSelectedPlatform(platform)}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plug & Play Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 mb-4">
              <span className="text-4xl">🔌</span>
            </motion.div>
            <motion.h2 
              variants={fadeUpVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Plug & Play — No Code, No Waiting
            </motion.h2>
            <motion.p 
              variants={fadeUpVariants}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Connect in minutes using your login credentials. No developer needed.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                step: "1",
                title: "Choose Your Platform",
                description: "Pick from 13+ e-commerce platforms and marketplaces",
                icon: ShoppingCart,
                color: brandColors.shopify,
              },
              {
                step: "2",
                title: "Authenticate Securely",
                description: "OAuth login with just one click — your data stays safe",
                icon: Shield,
                color: brandColors.walmart,
              },
              {
                step: "3",
                title: "Start Syncing",
                description: "Orders and inventory sync automatically in real-time",
                icon: Package,
                color: brandColors.amazon,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                variants={cardVariants}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                )}

                <div 
                  className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg relative"
                  style={{ backgroundColor: `${item.color}30` }}
                >
                  <item.icon className="w-10 h-10" style={{ color: item.color }} />
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.step}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Integration setup takes less than 10 minutes
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Shipping Carriers Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeUpVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Integrated Shipping Carriers
            </motion.h2>
            <motion.p 
              variants={fadeUpVariants}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Ship with confidence using our pre-integrated carrier network. Compare rates, 
              print labels, and track packages across 24+ carriers worldwide.
            </motion.p>
          </motion.div>

          <div className="space-y-12">
            {Object.entries(carrierGroups).map(([key, group]) => (
              <motion.div
                key={key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${group.providerColor}20` }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: group.providerColor }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{group.title}</h3>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">{group.carriers.length} carriers</span>
                </div>

                <motion.div 
                  variants={staggerContainer}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
                >
                  {group.carriers.map((carrier) => (
                    <CarrierCard key={carrier.name} carrier={carrier} />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* And More Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <span className="text-secondary">+</span>
                Many More Integrations Available
              </div>
              <p className="text-sm text-gray-500 max-w-md">
                Don't see your platform or carrier? We support many additional integrations 
                and can build custom connections for enterprise clients.
              </p>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="mt-2 rounded-full">
                  Request an Integration
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="max-w-4xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 border border-gray-100">
              <div className="absolute -top-4 left-8">
                <div className="bg-secondary text-white p-3 rounded-xl shadow-lg">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6 mt-4">
                "Westfield's native Shopify integration saved us hours every week. Orders flow 
                automatically and inventory updates in real-time. It's completely transformed 
                how we handle fulfillment."
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  PT
                </div>
                <div>
                  <div className="font-bold text-gray-900">E-Commerce Manager</div>
                  <div className="text-gray-500">Pacific Threads</div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Trusted by fast-scaling e-commerce brands</p>
                <div className="flex flex-wrap gap-6">
                  {[
                    { name: "Shopify", key: "shopify" },
                    { name: "Amazon", key: "amazon" },
                    { name: "Walmart", key: "walmart" },
                    { name: "TikTok Shop", key: "tiktok" },
                  ].map((brand) => (
                    <div key={brand.name} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                      <PlatformIcon 
                        platformKey={brand.key}
                        size={16}
                        color={brandColors[brand.key]}
                      />
                      <span className="text-sm font-medium">{brand.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Integration FAQs
            </h2>
            <p className="text-muted-foreground text-lg">
              Common questions about connecting your sales channels
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="shopify" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                  How do Shopify integrations work with Westfield?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Our native Shopify integration connects via OAuth in under 2 minutes. Once connected, orders automatically sync in real-time, inventory updates push back to your store, and tracking numbers are added as soon as shipments go out.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="realtime" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                  Do you support real-time order syncing?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes! Orders from Shopify, Amazon, Walmart, and TikTok Shop sync automatically as they come in. No manual imports needed—your orders appear in our system within seconds.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="marketplaces" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                  What marketplaces can connect to Westfield?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  We support Shopify, Shopify Plus, Amazon, Walmart, TikTok Shop, Etsy, WooCommerce, BigCommerce, Faire, and more. Most marketplaces connect through our OrderDesk or Pipe17 integrations for seamless multi-channel fulfillment.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="developer" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                  Do I need a developer to set up integrations?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Not at all! Our integrations are plug-and-play. Shopify connects in under 2 minutes with a few clicks. For other platforms, our team handles the setup at no extra charge.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary to-primary/90">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeUpVariants}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Power Your Fulfillment With Enterprise-Grade Integrations
            </motion.h2>
            <motion.p 
              variants={fadeUpVariants}
              className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Custom integrations available for enterprise clients
            </motion.p>
            <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:-translate-y-1 transition-all"
                >
                  Talk to an Integration Specialist
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg rounded-full"
                >
                  Developer API Access
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating CTA Bar (Desktop Only) */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 hidden md:block"
          >
            <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Zap className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-gray-800 font-medium">
                      Need help choosing integrations?
                    </span>
                  </div>
                  <Link to="/contact">
                    <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6">
                      Talk to a Specialist
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform Detail Modal */}
      <Dialog open={!!selectedPlatform} onOpenChange={() => setSelectedPlatform(null)}>
        <DialogContent className="max-w-md">
          {selectedPlatform && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${brandColors[selectedPlatform.key]}15` }}
                  >
                    <PlatformIcon 
                      platformKey={selectedPlatform.key}
                      size={28}
                      color={brandColors[selectedPlatform.key]}
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedPlatform.name}</DialogTitle>
                    {selectedPlatform.badge && (
                      <Badge 
                        className="text-white text-xs mt-1"
                        style={{ backgroundColor: brandColors[selectedPlatform.key] }}
                      >
                        {selectedPlatform.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <DialogDescription className="text-base text-gray-600">
                {selectedPlatform.description}
              </DialogDescription>

              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Sync Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlatform.syncTypes.map((sync) => (
                      <span
                        key={sync}
                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-green-50 text-green-700"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {sync}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Connection Type</h4>
                  <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">
                    <Shield className="w-3.5 h-3.5" />
                    {selectedPlatform.connectionType}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <Link to="/contact">
                    <Button className="w-full bg-secondary hover:bg-secondary/90">
                      Get Started with {selectedPlatform.name}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Integrations;
