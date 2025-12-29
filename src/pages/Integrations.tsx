import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Package,
  Truck,
  ArrowRight,
  Zap,
  Globe,
  Check,
  Shield,
  ShoppingCart,
  Code,
  Users,
  RefreshCcw,
  Route,
  Clock,
  Activity,
  Lock,
  X,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";
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

// Brand colors for platforms
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
  netsuite: "#1A5276",
  skubana: "#2E86AB",
  cin7: "#5B2C6F",
  quickbooks: "#2CA01C",
  hubspot: "#FF7A59",
  zoho: "#C8202B",
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
  netsuite: null,
  skubana: null,
  cin7: null,
  quickbooks: null,
  salesforce: null,
  hubspot: null,
  zoho: null,
};

// Image-based logos
const logoImages: Record<string, string> = {
  mystore: "/integration-logos/mystore-logo.jpeg",
  faire: "/integration-logos/faire-logo.png",
  salesforce: "/integration-logos/salesforce-logo.jpeg",
  lightspeed: "/integration-logos/lightspeed-logo.svg",
  shipstation: "/integration-logos/shipstation-logo.png",
};

// Carrier icon mapping
const carrierIcons: Record<string, IconType | null> = {
  dhl: SiDhl,
  fedex: SiFedex,
  ups: SiUps,
  usps: SiUsps,
  deutschepost: SiDeutschepost,
};

// Image-based carrier logos
const carrierLogoImages: Record<string, string> = {
  uship: "/integration-logos/uship-logo.png",
  ehub: "/integration-logos/ehub-logo.jpeg",
  pitneybowes: "/integration-logos/pitneybowes-logo.svg",
  postnord: "/integration-logos/postnord-logo.svg",
  bring: "/integration-logos/bring-logo.svg",
  canadapost: "/integration-logos/canadapost-logo.png",
  asendia: "/integration-logos/asendia-logo.png",
  australiapost: "/integration-logos/australiapost-logo.png",
  nzcouriers: "/integration-logos/nzcouriers-logo.jpeg",
  tusk: "/integration-logos/tusk-logo.jpeg",
  passport: "/integration-logos/passport-logo.jpeg",
  stallion: "/integration-logos/stallion-logo.png",
  vesyl: "/integration-logos/vesyl-logo.jpeg",
  flavorcloud: "/integration-logos/flavorcloud-logo.png",
  buku: "/integration-logos/bukuship-logo.png",
};

// Filter categories
type FilterCategory = "all" | "ecommerce" | "shipping" | "inventory" | "api" | "erp";

interface FilterOption {
  id: FilterCategory;
  label: string;
  icon: React.ReactNode;
}

const filterOptions: FilterOption[] = [
  { id: "all", label: "All", icon: <Globe className="w-4 h-4" /> },
  { id: "ecommerce", label: "E-Commerce", icon: <ShoppingCart className="w-4 h-4" /> },
  { id: "shipping", label: "Shipping & Returns", icon: <Truck className="w-4 h-4" /> },
  { id: "inventory", label: "Inventory & WMS", icon: <Package className="w-4 h-4" /> },
  { id: "api", label: "Custom API / EDI", icon: <Code className="w-4 h-4" /> },
  { id: "erp", label: "ERPs & CRMs", icon: <Users className="w-4 h-4" /> },
];

// Integration type definition
interface Integration {
  name: string;
  key: string;
  category: FilterCategory;
  description: string;
  setupTime: string;
  features: {
    orderSync: boolean;
    inventorySync: boolean;
    returns: boolean;
    realTime: boolean;
  };
  badge?: string;
}

// All integrations
const integrations: Integration[] = [
  // E-Commerce
  { name: "Shopify", key: "shopify", category: "ecommerce", description: "Seamlessly sync your Shopify store with real-time order imports, inventory updates, and automatic tracking.", setupTime: "< 5 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true }, badge: "Most Popular" },
  { name: "Shopify Plus", key: "shopifyPlus", category: "ecommerce", description: "Enterprise-grade integration with advanced features for high-volume merchants.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true }, badge: "Enterprise" },
  { name: "Amazon", key: "amazon", category: "ecommerce", description: "Full Amazon Seller Central integration with FBA prep and inventory sync capabilities.", setupTime: "< 15 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true } },
  { name: "Walmart", key: "walmart", category: "ecommerce", description: "Connect your Walmart Marketplace with WFS-ready fulfillment support.", setupTime: "< 15 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: true }, badge: "WFS Ready" },
  { name: "TikTok Shop", key: "tiktok", category: "ecommerce", description: "Fulfill TikTok Shop orders with automatic inventory sync and tracking updates.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: true } },
  { name: "Etsy", key: "etsy", category: "ecommerce", description: "Sync your Etsy shop orders and manage inventory across all channels.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: false } },
  { name: "WooCommerce", key: "woocommerce", category: "ecommerce", description: "WordPress WooCommerce integration with webhook support for real-time updates.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true } },
  { name: "BigCommerce", key: "bigcommerce", category: "ecommerce", description: "Enterprise e-commerce platform integration with full order management.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: true } },
  { name: "Faire", key: "faire", category: "ecommerce", description: "Wholesale marketplace integration for B2B order fulfillment.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: false } },
  { name: "Magento", key: "magento", category: "ecommerce", description: "Adobe Commerce / Magento integration for enterprise merchants.", setupTime: "< 15 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true } },
  { name: "Wix", key: "wix", category: "ecommerce", description: "Wix eCommerce store integration with automatic order sync.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: false } },
  
  // Shipping
  { name: "FedEx", key: "fedex", category: "shipping", description: "Domestic and international shipping with real-time rate shopping.", setupTime: "< 5 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "UPS", key: "ups", category: "shipping", description: "Full UPS integration for ground, air, and international shipping.", setupTime: "< 5 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "USPS", key: "usps", category: "shipping", description: "Priority, First Class, and Media Mail shipping options.", setupTime: "< 5 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "DHL", key: "dhl", category: "shipping", description: "Express international shipping with customs handling.", setupTime: "< 5 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "ShipStation", key: "shipstation", category: "shipping", description: "Multi-carrier shipping platform integration for label printing and tracking.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: false, returns: false, realTime: true } },
  { name: "Canada Post", key: "canadapost", category: "shipping", description: "Canadian domestic and international shipping integration.", setupTime: "< 5 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "Australia Post", key: "australiapost", category: "shipping", description: "Australian domestic and international shipping services.", setupTime: "< 5 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  
  // Inventory & WMS
  { name: "NetSuite", key: "netsuite", category: "inventory", description: "Enterprise ERP integration for inventory and order management.", setupTime: "< 30 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true } },
  { name: "Skubana", key: "skubana", category: "inventory", description: "Unified commerce operations platform integration.", setupTime: "< 20 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: true } },
  { name: "Cin7", key: "cin7", category: "inventory", description: "Point of sale and inventory management integration.", setupTime: "< 20 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: true } },
  { name: "QuickBooks", key: "quickbooks", category: "inventory", description: "Accounting and inventory management integration.", setupTime: "< 15 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: false } },
  
  // Custom API / EDI
  { name: "REST API", key: "restapi", category: "api", description: "Developer-friendly RESTful API for custom integrations.", setupTime: "Custom", features: { orderSync: true, inventorySync: true, returns: true, realTime: true } },
  { name: "EDI", key: "edi", category: "api", description: "Electronic Data Interchange for retail compliance.", setupTime: "Custom", features: { orderSync: true, inventorySync: true, returns: true, realTime: false } },
  { name: "Webhooks", key: "webhooks", category: "api", description: "Real-time event notifications for custom workflows.", setupTime: "< 30 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true } },
  
  // ERPs & CRMs
  { name: "Salesforce", key: "salesforce", category: "erp", description: "Enterprise CRM integration for unified customer and order management.", setupTime: "< 30 minutes", features: { orderSync: true, inventorySync: false, returns: false, realTime: true } },
  { name: "HubSpot", key: "hubspot", category: "erp", description: "CRM and marketing automation platform integration.", setupTime: "< 20 minutes", features: { orderSync: true, inventorySync: false, returns: false, realTime: true } },
  { name: "Zoho", key: "zoho", category: "erp", description: "Zoho CRM and inventory management integration.", setupTime: "< 20 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: false } },
];

// Feature highlights for carousel
const featureHighlights = [
  { icon: RefreshCcw, title: "Sync in Real Time", description: "Inventory and order data flows in both directions — no manual updates needed." },
  { icon: Zap, title: "Zero Setup Required", description: "Pre-built integrations for Shopify, Amazon, Walmart, Faire & more." },
  { icon: Code, title: "Custom API Access", description: "Need something unique? Use our developer-friendly REST API or EDI." },
  { icon: Route, title: "Automated Order Routing", description: "Set rules by channel, SKU, or customer segment." },
  { icon: Shield, title: "Enterprise Security", description: "SOC2-compliant infrastructure with role-based access." },
];

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
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

// Orbiting logo component
const OrbitingLogos = () => {
  const orbitLogos = [
    { key: "shopify", name: "Shopify", Icon: SiShopify, color: brandColors.shopify },
    { key: "amazon", name: "Amazon", Icon: SiAmazon, color: brandColors.amazon },
    { key: "walmart", name: "Walmart", Icon: SiWalmart, color: brandColors.walmart },
    { key: "tiktok", name: "TikTok", Icon: SiTiktok, color: brandColors.tiktok },
    { key: "etsy", name: "Etsy", Icon: SiEtsy, color: brandColors.etsy },
    { key: "fedex", name: "FedEx", Icon: SiFedex, color: carrierColors.fedex },
    { key: "ups", name: "UPS", Icon: SiUps, color: carrierColors.ups },
    { key: "dhl", name: "DHL", Icon: SiDhl, color: carrierColors.dhl },
  ];

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
      {/* Central Westfield Logo */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-secondary/30">
          <img 
            src="/westfield-logo.png" 
            alt="Westfield Prep Center" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </div>
      </motion.div>

      {/* Orbiting Logos */}
      {orbitLogos.map((logo, index) => {
        const angle = (index * 360) / orbitLogos.length;
        const radius = 130;
        
        return (
          <motion.div
            key={logo.key}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: [0, 360],
            }}
            transition={{ 
              opacity: { delay: 0.2 + index * 0.1 },
              scale: { delay: 0.2 + index * 0.1, type: "spring" },
              rotate: { 
                duration: 40 + index * 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            className="absolute top-1/2 left-1/2 w-12 h-12 md:w-14 md:h-14"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
            }}
          >
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ 
                duration: 40 + index * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              whileHover={{ scale: 1.2 }}
              className="w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer group relative border border-border/50 hover:border-secondary/50 transition-colors"
            >
              <logo.Icon size={24} color={logo.color} className="md:w-7 md:h-7" />
              
              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-xs font-semibold text-white bg-foreground px-2 py-1 rounded whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Orbit Ring */}
      <div className="absolute inset-8 border-2 border-dashed border-white/20 rounded-full" />
    </div>
  );
};

// Integration Icon renderer
const IntegrationIcon = ({ 
  integrationKey, 
  size = 36, 
}: { 
  integrationKey: string; 
  size?: number; 
}) => {
  const color = brandColors[integrationKey] || carrierColors[integrationKey] || "#6366F1";
  
  // Check for image-based logo first
  const logoImage = logoImages[integrationKey] || carrierLogoImages[integrationKey];
  if (logoImage) {
    return (
      <img 
        src={logoImage} 
        alt={integrationKey} 
        className="object-contain rounded"
        style={{ width: size, height: size }}
      />
    );
  }
  
  const Icon = platformIcons[integrationKey] || carrierIcons[integrationKey];
  
  if (Icon) {
    return <Icon size={size} color={color} />;
  }
  
  // Text fallback
  const initials = integrationKey.slice(0, 2).toUpperCase();
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

// Integration Card Component
const IntegrationCard = ({ 
  integration, 
  onClick,
}: { 
  integration: Integration; 
  onClick: () => void;
}) => {
  const color = brandColors[integration.key] || carrierColors[integration.key] || "#6366F1";
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl border bg-card hover:bg-card/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Badge */}
      {integration.badge && (
        <div className="absolute top-0 right-4 z-20">
          <div
            className="flex items-center gap-1 text-white text-xs px-3 py-1.5 rounded-b-lg shadow-lg font-medium"
            style={{ backgroundColor: color }}
          >
            {integration.badge === "Most Popular" && <Sparkles className="w-3 h-3" />}
            {integration.badge}
          </div>
        </div>
      )}

      <div className="p-5 relative z-10">
        {/* Logo Container */}
        <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-background shadow-sm border mb-4">
          <IntegrationIcon integrationKey={integration.key} size={32} />
        </div>

        {/* Name */}
        <h3 className="font-bold text-foreground mb-2">{integration.name}</h3>

        {/* Feature indicators */}
        <div className="flex gap-1">
          {integration.features.orderSync && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Orders</span>
          )}
          {integration.features.inventorySync && (
            <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground font-medium">Inventory</span>
          )}
        </div>

        {/* Arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Bottom accent */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};

// Security Banner Component
const SecurityBanner = () => {
  const securityFeatures = [
    { icon: Clock, label: "99.99% Uptime SLA" },
    { icon: Shield, label: "SOC2-Compliant" },
    { icon: Activity, label: "Real-Time Monitoring" },
    { icon: Lock, label: "Role-Based Access" },
  ];

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {securityFeatures.map((feature) => (
            <motion.div
              key={feature.label}
              variants={cardVariants}
              className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-semibold text-foreground text-sm md:text-base">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Integrations = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter integrations
  const filteredIntegrations = useMemo(() => {
    if (selectedFilter === "all") return integrations;
    return integrations.filter(i => i.category === selectedFilter);
  }, [selectedFilter]);

  const copyCodeSnippet = () => {
    const code = `POST /api/v1/orders
{
  "orderId": "ORD-12345",
  "channel": "shopify",
  "items": [
    { "sku": "WIDGET-001", "qty": 2 }
  ],
  "warehouse": "westfield-la"
}`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Integrations | Westfield Prep Center</title>
        <meta
          name="description"
          content="Connect Shopify, Amazon, Walmart & 20+ platforms in minutes. Real-time order sync, inventory management & 24+ carrier integrations. No developers needed."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/integrations" />
        
        <meta property="og:title" content="Integrations | Westfield Prep Center" />
        <meta property="og:description" content="Connect Shopify, Amazon, Walmart & 20+ platforms in minutes. Real-time order sync, inventory management & 24+ carrier integrations." />
        <meta property="og:url" content="https://westfieldprepcenter.com/integrations" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://westfieldprepcenter.com/warehouse-hero-bg.jpg" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Integrations | Westfield Prep Center" />
        <meta name="twitter:description" content="Connect Shopify, Amazon, Walmart & 20+ platforms in minutes. Real-time order sync & 24+ carrier integrations." />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "Westfield Integration Platform",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "description": "Connect your e-commerce platforms, marketplaces, and carriers in minutes",
                "featureList": integrations.map(i => i.name),
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How do integrations work with Westfield Prep Center?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Our integrations connect directly to your platforms via OAuth or API. Once connected, orders automatically sync in real-time, inventory updates push within minutes, and tracking numbers upload automatically when orders ship."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do you support real-time order syncing?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, all our e-commerce integrations support real-time order syncing via webhooks. When a customer places an order, it appears in our system within seconds."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do I need a developer to set up integrations?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No developer needed. Our integrations are plug-and-play with guided setup. Most clients complete setup in under 10 minutes."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What if I need a custom integration?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We offer a developer-friendly REST API and EDI support for custom integrations. Our team can also build custom connectors for unique requirements."
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

      {/* ========== SECTION 1: ANIMATED HERO ========== */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-secondary/20 pt-16 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeUpVariants}>
                <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  20+ Integrations
                </Badge>
              </motion.div>

              <motion.h1 
                variants={fadeUpVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Seamless Integrations with the Tools You Already Use
              </motion.h1>

              <motion.p 
                variants={fadeUpVariants}
                className="text-xl text-white/80 mb-8 max-w-xl"
              >
                From Shopify to Amazon, our 3PL platform connects your entire stack — effortlessly.
              </motion.p>

              <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                  >
                    Request Custom Integration
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Orbiting Logos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <OrbitingLogos />
            </motion.div>
          </div>

          {/* Mobile: Static logo grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:hidden flex flex-wrap justify-center gap-3 mt-10"
          >
            {[
              { key: "shopify", Icon: SiShopify, color: brandColors.shopify },
              { key: "amazon", Icon: SiAmazon, color: brandColors.amazon },
              { key: "walmart", Icon: SiWalmart, color: brandColors.walmart },
              { key: "fedex", Icon: SiFedex, color: carrierColors.fedex },
              { key: "ups", Icon: SiUps, color: carrierColors.ups },
            ].map((logo) => (
              <motion.div
                key={logo.key}
                variants={cardVariants}
                className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center"
              >
                <logo.Icon size={24} color={logo.color} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== SECTION 2: INTERACTIVE FILTER SYSTEM ========== */}
      <section className="py-20 bg-background">
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
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Browse All Integrations
            </motion.h2>
            <motion.p 
              variants={fadeUpVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Filter by category to find the perfect connections for your business.
            </motion.p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12"
          >
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all
                  ${selectedFilter === filter.id 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {filter.icon}
                {filter.label}
                {selectedFilter === filter.id && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {filteredIntegrations.length}
                  </Badge>
                )}
              </button>
            ))}
          </motion.div>

          {/* Integration Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFilter}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {filteredIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.key}
                  integration={integration}
                  onClick={() => setSelectedIntegration(integration)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ========== SECTION 3: FEATURE HIGHLIGHTS CAROUSEL ========== */}
      <section className="py-20 bg-muted/30">
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
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Why Integrations Matter
            </motion.h2>
            <motion.p 
              variants={fadeUpVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Connect once, automate forever. Here's what our integrations unlock for your business.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {featureHighlights.map((feature, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="h-full bg-card rounded-2xl border shadow-lg p-6 flex flex-col"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                        <feature.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm flex-grow">{feature.description}</p>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* ========== SECTION 4: PLUG & PLAY SECTION ========== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 
              variants={fadeUpVariants}
              className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
            >
              Plug & Play in 3 Simple Steps
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Connect Your Store", description: "Authenticate with OAuth in one click. No API keys or developers needed." },
                { step: "2", title: "Configure Settings", description: "Set your sync preferences, inventory rules, and order routing logic." },
                { step: "3", title: "Start Shipping", description: "Orders flow in automatically. Inventory syncs. Tracking uploads." },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== SECTION 5: DEVELOPER BLOCK ========== */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUpVariants}>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4">
                  <Code className="w-4 h-4 mr-2" />
                  For Developers
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Build Custom Integrations
                </h2>
                <p className="text-background/70 mb-6">
                  Need something unique? Our developer-friendly REST API and webhook system lets you build exactly what you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" size="lg" className="rounded-full">
                    View API Docs
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                  <Link to="/contact">
                    <Button variant="outline" size="lg" className="rounded-full border-background/30 text-background hover:bg-background/10">
                      Request Sandbox Access
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div variants={fadeUpVariants}>
                <div className="relative">
                  <div className="bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm overflow-hidden border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="ml-2 text-white/50 text-xs">api-request.json</span>
                    </div>
                    <pre className="text-green-400 overflow-x-auto">
{`POST /api/v1/orders
{
  "orderId": "ORD-12345",
  "channel": "shopify",
  "items": [
    { "sku": "WIDGET-001", "qty": 2 }
  ],
  "warehouse": "westfield-la"
}`}
                    </pre>
                  </div>
                  <button
                    onClick={copyCodeSnippet}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/70" />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== SECTION 6: SECURITY BANNER ========== */}
      <SecurityBanner />

      {/* ========== SECTION 7: FAQ SECTION ========== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.h2 
              variants={fadeUpVariants}
              className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
            >
              Frequently Asked Questions
            </motion.h2>

            <motion.div variants={fadeUpVariants}>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border rounded-xl px-6 bg-card">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    How do integrations work with Westfield?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our integrations connect directly to your platforms via OAuth. Once connected, orders automatically sync in real-time, inventory updates push to your stores within minutes, and tracking numbers are uploaded automatically when orders ship. Setup takes less than 10 minutes with no coding required.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border rounded-xl px-6 bg-card">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Do you support real-time order syncing?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, all our e-commerce integrations support real-time order syncing via webhooks. When a customer places an order on your store, it appears in our system within seconds. Inventory levels sync bidirectionally, so your store always shows accurate stock counts.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border rounded-xl px-6 bg-card">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Do I need a developer to set up integrations?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    No developer needed. Our integrations are plug-and-play with guided setup. Simply authenticate your store, configure your preferences, and start syncing. Most clients complete setup in under 10 minutes. Our team is available to help if you need assistance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border rounded-xl px-6 bg-card">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    What if I need a custom integration?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We offer a developer-friendly REST API and EDI support for custom integrations. Our team can also build custom connectors for unique requirements. Contact us to discuss your specific needs.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== SECTION 8: FINAL CTA ========== */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 
              variants={fadeUpVariants}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Need a Unique Integration or Tech Stack?
            </motion.h2>
            
            <motion.p 
              variants={fadeUpVariants}
              className="text-xl mb-10 opacity-90 leading-relaxed"
            >
              Let's build it — or connect what you're already using. Our team has integrated with 100+ platforms and can handle any custom requirement.
            </motion.p>

            <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link to="/contact">
                <Button 
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-7 text-lg font-bold rounded-full"
                >
                  Schedule a Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full"
              >
                Developer API Access
                <Code className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            {/* Contact Options */}
            <motion.div 
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
            >
              <a 
                href="tel:+18189355478" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Phone className="w-5 h-5" />
                <span>1.818.935.5478</span>
              </a>
              <a 
                href="mailto:info@westfieldprepcenter.com"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Mail className="w-5 h-5" />
                <span>info@westfieldprepcenter.com</span>
              </a>
            </motion.div>

            <motion.p 
              variants={fadeUpVariants}
              className="text-sm opacity-75"
            >
              Trusted by 100+ e-commerce brands | 2M+ orders shipped | Same-day turnaround
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Integration Detail Modal */}
      <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent className="max-w-lg">
          {selectedIntegration && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                    <IntegrationIcon integrationKey={selectedIntegration.key} size={40} />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedIntegration.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Setup time: {selectedIntegration.setupTime}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              
              <DialogDescription className="text-base text-foreground">
                {selectedIntegration.description}
              </DialogDescription>

              <div className="space-y-4 mt-4">
                <h4 className="font-semibold text-foreground">Supported Features</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Order Sync", enabled: selectedIntegration.features.orderSync },
                    { label: "Inventory Sync", enabled: selectedIntegration.features.inventorySync },
                    { label: "Returns", enabled: selectedIntegration.features.returns },
                    { label: "Real-Time", enabled: selectedIntegration.features.realTime },
                  ].map((feature) => (
                    <div 
                      key={feature.label}
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        feature.enabled ? 'bg-green-500/10' : 'bg-muted'
                      }`}
                    >
                      {feature.enabled ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span className={feature.enabled ? 'text-foreground' : 'text-muted-foreground'}>
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Link to="/contact" className="flex-1">
                  <Button className="w-full" size="lg">
                    Connect Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setSelectedIntegration(null)}
                >
                  Close
                </Button>
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
