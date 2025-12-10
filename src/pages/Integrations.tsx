import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Package,
  Truck,
  Star,
  ArrowRight,
  Zap,
  Globe,
  RefreshCw,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Sales Channels Data
const salesChannels = [
  { 
    name: "Shopify", 
    badge: "Most Popular",
    syncTypes: ["Orders", "Inventory", "Shipping"],
    connectionType: "Native",
    description: "Full bi-directional sync with Shopify stores. Orders flow in automatically, inventory updates push in real-time.",
    featured: true
  },
  { 
    name: "Shopify Plus", 
    badge: "Enterprise",
    syncTypes: ["Orders", "Inventory", "Shipping", "Scripts"],
    connectionType: "Native",
    description: "Enterprise-grade integration with advanced features, custom scripts, and dedicated support."
  },
  { 
    name: "Amazon", 
    syncTypes: ["Orders", "Inventory", "FBA Prep"],
    connectionType: "Native",
    description: "Connect your Amazon Seller Central for seamless FBA prep and merchant fulfilled orders."
  },
  { 
    name: "BigCommerce", 
    syncTypes: ["Orders", "Inventory"],
    connectionType: "Native",
    description: "Sync your BigCommerce store for automated order fulfillment and inventory management."
  },
  { 
    name: "Etsy", 
    syncTypes: ["Orders", "Inventory"],
    connectionType: "Native",
    description: "Perfect for handmade and vintage sellers. Sync orders and track inventory across your Etsy shop."
  },
  { 
    name: "Faire", 
    syncTypes: ["Orders", "Inventory"],
    connectionType: "Native",
    description: "Wholesale marketplace integration for B2B order fulfillment and inventory sync."
  },
  { 
    name: "Magento", 
    syncTypes: ["Orders", "Inventory"],
    connectionType: "Connector",
    description: "Enterprise e-commerce integration supporting both Magento 1 and Magento 2 platforms."
  },
  { 
    name: "MyStore", 
    syncTypes: ["Orders", "Inventory"],
    connectionType: "Connector",
    description: "Connect your MyStore shop for streamlined order processing and fulfillment."
  },
  { 
    name: "Prestashop", 
    syncTypes: ["Orders", "Inventory"],
    connectionType: "Connector",
    description: "Open-source e-commerce platform integration with full order and inventory sync."
  },
  { 
    name: "TikTok Shop", 
    syncTypes: ["Orders", "Inventory"],
    connectionType: "Native",
    description: "Tap into social commerce with TikTok Shop fulfillment. Fast shipping for viral products."
  },
  { 
    name: "Walmart", 
    syncTypes: ["Orders", "Inventory", "WFS"],
    connectionType: "Native",
    description: "Walmart Marketplace and WFS integration for America's largest retailer."
  },
  { 
    name: "Wix", 
    syncTypes: ["Orders", "Inventory"],
    connectionType: "Connector",
    description: "Connect your Wix e-commerce store for automated fulfillment services."
  },
  { 
    name: "WooCommerce", 
    syncTypes: ["Orders", "Inventory"],
    connectionType: "Native",
    description: "WordPress-based e-commerce integration with real-time order and inventory sync."
  },
];

// Shipping Carriers Data
const shippingCarriers = [
  { name: "Asendia", region: "International" },
  { name: "Australia Post", region: "APAC" },
  { name: "Bring", region: "Nordic" },
  { name: "Buku Ship", region: "US" },
  { name: "Canada Post", region: "Canada" },
  { name: "Deutsche Post", region: "Europe" },
  { name: "DHL", region: "Global" },
  { name: "Easypost", region: "Multi-carrier" },
  { name: "eHub", region: "US" },
  { name: "FedEx", region: "Global" },
  { name: "FlavorCloud", region: "Cross-border" },
  { name: "NZ Couriers", region: "APAC" },
  { name: "Passport Shipping", region: "International" },
  { name: "Pitney Bowes", region: "US" },
  { name: "Postnord", region: "Nordic" },
  { name: "ShipStation", region: "Multi-carrier" },
  { name: "Stallion Express", region: "Canada" },
  { name: "StarTrack", region: "APAC" },
  { name: "Tusk Logistics", region: "US" },
  { name: "UPS", region: "Global" },
  { name: "uShip", region: "US" },
  { name: "USPS", region: "US" },
  { name: "Vesyl", region: "US" },
  { name: "Webshipper", region: "Europe" },
];

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3 }
  },
};

// Floating Icon Component for Hero Background
const FloatingIcon = ({ icon: Icon, delay, x, y }: { icon: React.ElementType; delay: number; x: string; y: string }) => (
  <motion.div
    className="absolute text-primary/10"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -15, 0],
      opacity: [0.1, 0.2, 0.1],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Icon className="w-12 h-12 md:w-16 md:h-16" />
  </motion.div>
);

// Integration Card Component
const IntegrationCard = ({ 
  platform, 
  onClick 
}: { 
  platform: typeof salesChannels[0]; 
  onClick: () => void;
}) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -8, scale: 1.02 }}
    onClick={onClick}
    className={`group relative bg-card border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-primary/30 ${
      platform.featured ? 'ring-2 ring-primary/20 border-primary/30' : 'border-border'
    }`}
  >
    {/* Featured Badge */}
    {platform.badge && (
      <Badge 
        className={`absolute -top-3 left-4 ${
          platform.badge === "Most Popular" 
            ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground" 
            : "bg-secondary/20 text-secondary border-secondary/30"
        }`}
      >
        {platform.badge === "Most Popular" && <Star className="w-3 h-3 mr-1 fill-current" />}
        {platform.badge}
      </Badge>
    )}
    
    {/* Icon */}
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
      platform.featured 
        ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground' 
        : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
    }`}>
      <ShoppingCart className="w-7 h-7" />
    </div>
    
    {/* Name */}
    <h3 className="font-bold text-lg text-card-foreground mb-2">{platform.name}</h3>
    
    {/* Sync Types Preview */}
    <div className="flex flex-wrap gap-1.5 mb-3">
      {platform.syncTypes.slice(0, 3).map((sync) => (
        <span key={sync} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
          {sync}
        </span>
      ))}
    </div>
    
    {/* Connection Type */}
    <div className="flex items-center text-sm text-muted-foreground">
      <Zap className="w-3.5 h-3.5 mr-1.5 text-primary" />
      {platform.connectionType} Integration
    </div>
    
    {/* Hover Arrow */}
    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowRight className="w-5 h-5 text-primary" />
    </div>
  </motion.div>
);

// Carrier Card Component
const CarrierCard = ({ carrier }: { carrier: typeof shippingCarriers[0] }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -4, scale: 1.02 }}
    className="group bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
      <Truck className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
    </div>
    <h4 className="font-semibold text-sm text-card-foreground mb-1">{carrier.name}</h4>
    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
      {carrier.region}
    </span>
  </motion.div>
);

// Integration Modal Component
const IntegrationModal = ({ 
  platform, 
  open, 
  onClose 
}: { 
  platform: typeof salesChannels[0] | null; 
  open: boolean; 
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  
  if (!platform) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              platform.featured 
                ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground' 
                : 'bg-primary/10 text-primary'
            }`}>
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div>
              <DialogTitle className="text-xl">{platform.name}</DialogTitle>
              {platform.badge && (
                <Badge variant="secondary" className="mt-1">
                  {platform.badge}
                </Badge>
              )}
            </div>
          </div>
          <DialogDescription className="text-base pt-2">
            {platform.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Sync Types */}
          <div>
            <h4 className="text-sm font-semibold text-card-foreground mb-2">Sync Capabilities</h4>
            <div className="flex flex-wrap gap-2">
              {platform.syncTypes.map((sync) => (
                <div key={sync} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-lg text-sm">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="text-card-foreground">{sync}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Connection Type */}
          <div>
            <h4 className="text-sm font-semibold text-card-foreground mb-2">Connection Type</h4>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm">{platform.connectionType} Integration</span>
            </div>
          </div>
          
          {/* CTA */}
          <Button className="w-full mt-4" onClick={() => navigate('/contact')}>
            Connect {platform.name}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Integrations = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"sales" | "shipping">("sales");
  const [selectedPlatform, setSelectedPlatform] = useState<typeof salesChannels[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePlatformClick = (platform: typeof salesChannels[0]) => {
    setSelectedPlatform(platform);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>E-Commerce Integrations | Shopify, Amazon, Walmart & More | Westfield Prep</title>
        <meta 
          name="description" 
          content="Connect your entire e-commerce operation with 30+ native integrations. Shopify, Amazon, Walmart, TikTok Shop, plus 24 shipping carriers including UPS, FedEx, DHL, and USPS." 
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/integrations" />
      </Helmet>

      <Header />
      <Breadcrumbs items={[{ label: "Home", path: "/" }, { label: "Integrations", path: "/integrations" }]} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Floating Background Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingIcon icon={ShoppingCart} delay={0} x="10%" y="20%" />
          <FloatingIcon icon={Package} delay={0.5} x="85%" y="15%" />
          <FloatingIcon icon={Truck} delay={1} x="75%" y="70%" />
          <FloatingIcon icon={Globe} delay={1.5} x="15%" y="75%" />
          <FloatingIcon icon={RefreshCw} delay={2} x="50%" y="10%" />
          <FloatingIcon icon={Zap} delay={2.5} x="90%" y="50%" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">30+ Native Integrations</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Connect Your Entire E-Commerce Operation
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Instantly sync orders, inventory, and shipping across all major marketplaces, platforms, and carriers.
            </p>

            {/* Platform Logo Row */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-10 opacity-60">
              {["Shopify", "Amazon", "Walmart", "UPS", "FedEx", "DHL"].map((name) => (
                <div key={name} className="flex items-center gap-2 text-muted-foreground">
                  <Package className="w-5 h-5" />
                  <span className="font-medium text-sm">{name}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              onClick={() => navigate("/contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Talk to an Integration Specialist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="py-8 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-40">
        <div className="container">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setActiveFilter("sales")}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeFilter === "sales"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <ShoppingCart className="w-4 h-4 inline-block mr-2" />
              Sales Channels
            </button>
            <button
              onClick={() => setActiveFilter("shipping")}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeFilter === "shipping"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Truck className="w-4 h-4 inline-block mr-2" />
              Shipping Carriers
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeFilter === "sales" ? (
          <motion.section
            key="sales"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="py-16 md:py-20"
          >
            <div className="container">
              {/* Section Header */}
              <div className="max-w-3xl mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  E-Commerce Platforms & Marketplaces
                </h2>
                <p className="text-lg text-muted-foreground">
                  Connect your online store in minutes. We natively integrate with all major e-commerce platforms and marketplaces to sync orders, inventory, and fulfillment status in real-time.
                </p>
              </div>

              {/* Sales Channels Grid */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {salesChannels.map((platform) => (
                  <IntegrationCard
                    key={platform.name}
                    platform={platform}
                    onClick={() => handlePlatformClick(platform)}
                  />
                ))}
              </motion.div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="shipping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="py-16 md:py-20"
          >
            <div className="container">
              {/* Section Header */}
              <div className="max-w-3xl mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Integrated Shipping Carriers
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ship with confidence using our pre-integrated carrier network. Compare rates, print labels, and track packages across 24+ carriers worldwide.
                </p>
              </div>

              {/* Carriers Grid */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              >
                {shippingCarriers.map((carrier) => (
                  <CarrierCard key={carrier.name} carrier={carrier} />
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Developer API Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Developer API
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Build Custom Integrations
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Need something custom? Our REST API gives you full programmatic access to orders, inventory, shipments, and more. Perfect for enterprise clients with unique requirements.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "RESTful API with comprehensive documentation",
                  "Real-time webhook notifications",
                  "OAuth 2.0 authentication",
                  "Rate limiting and sandbox environment",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => navigate("/contact")}>
                Request API Access
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">api.westfieldprep.com</span>
              </div>
              <pre className="text-sm text-muted-foreground font-mono overflow-x-auto">
                <code>{`// Get inventory levels
GET /api/v1/inventory

{
  "sku": "WIDGET-001",
  "available": 1250,
  "reserved": 45,
  "incoming": 500,
  "location": "LA-MAIN"
}`}</code>
              </pre>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-primary via-primary to-primary/90">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Power Your Fulfillment With Enterprise-Grade Integrations
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Custom integrations available for enterprise clients. Our team can connect any system to your fulfillment workflow.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/contact")}
              className="bg-white text-primary hover:bg-white/90 px-8"
            >
              Talk to an Integration Specialist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Integration Modal */}
      <IntegrationModal
        platform={selectedPlatform}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default Integrations;
