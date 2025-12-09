import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plug, 
  Zap, 
  Code, 
  RefreshCw, 
  ShoppingBag, 
  ShoppingCart, 
  Store, 
  Music,
  Package,
  Building2,
  Palette,
  Hammer,
  Database,
  ArrowRight,
  CheckCircle,
  Globe,
  Webhook
} from "lucide-react";
import { motion } from "framer-motion";

const Integrations = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ecommercePlatforms = [
    { name: "Shopify", icon: ShoppingBag, description: "Native integration with real-time sync" },
    { name: "WooCommerce", icon: ShoppingCart, description: "WordPress-powered store support" },
    { name: "BigCommerce", icon: Store, description: "Enterprise-grade connectivity" },
    { name: "Magento", icon: Globe, description: "Adobe Commerce integration" },
  ];

  const marketplaces = [
    { name: "Amazon FBA", icon: Package, description: "FBA prep & fulfillment specialist" },
    { name: "Walmart WFS", icon: Building2, description: "Walmart Fulfillment Services" },
    { name: "eBay", icon: Hammer, description: "Multi-channel marketplace" },
    { name: "Etsy", icon: Palette, description: "Handmade & vintage focus" },
  ];

  const erpSystems = [
    { name: "NetSuite", icon: Database, description: "Oracle ERP integration" },
    { name: "QuickBooks", icon: Building2, description: "Accounting & inventory sync" },
    { name: "SAP", icon: Database, description: "Enterprise resource planning" },
    { name: "Odoo", icon: Globe, description: "Open-source ERP platform" },
  ];

  const apiFeatures = [
    { title: "REST API", description: "Full RESTful API access for custom integrations" },
    { title: "Webhooks", description: "Real-time event notifications to your systems" },
    { title: "Bulk Operations", description: "Batch processing for high-volume operations" },
    { title: "SDK Support", description: "Developer libraries for faster implementation" },
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const PlatformCard = ({ platform }: { platform: { name: string; icon: any; description: string } }) => {
    const Icon = platform.icon;
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/30">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{platform.name}</h3>
          <p className="text-sm text-muted-foreground">{platform.description}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>Platform Integrations & API | Westfield Prep Center</title>
        <meta 
          name="description" 
          content="Seamlessly connect your e-commerce platforms, marketplaces, and ERPs with our 3PL fulfillment system. Shopify, Amazon, WooCommerce, NetSuite & more." 
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/integrations" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Breadcrumbs */}
          <section className="py-4 bg-muted/30">
            <div className="container mx-auto px-4">
              <Breadcrumbs
                items={[
                  { label: "Home", path: "/" },
                  { label: "Integrations", path: "/integrations" },
                ]}
              />
            </div>
          </section>

          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
                className="max-w-4xl mx-auto"
              >
                <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Plug className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">API-First Platform</span>
                </motion.div>

                <motion.h1 variants={fadeUpVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Powerful Integrations to Streamline Your Fulfillment
                </motion.h1>

                <motion.p variants={fadeUpVariants} className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Connect with your existing tech stack in minutes. Our platform adapts to your operations, not the other way around.
                </motion.p>

                <motion.div variants={fadeUpVariants} className="flex flex-wrap justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/contact")}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate("/contact")}
                  >
                    Request API Access
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* E-commerce Platforms */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">E-Commerce Platforms</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Native integrations with leading e-commerce platforms for seamless order sync
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {ecommercePlatforms.map((platform, index) => (
                  <PlatformCard key={index} platform={platform} />
                ))}
              </div>
            </div>
          </section>

          {/* Marketplaces */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Marketplaces</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Multi-channel marketplace support for maximum reach
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {marketplaces.map((platform, index) => (
                  <PlatformCard key={index} platform={platform} />
                ))}
              </div>
            </div>
          </section>

          {/* ERP Systems */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">ERP & Accounting Systems</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Enterprise-grade connections to your back-office systems
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {erpSystems.map((platform, index) => (
                  <PlatformCard key={index} platform={platform} />
                ))}
              </div>
            </div>
          </section>

          {/* Developer API Section */}
          <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
                      <Code className="w-4 h-4" />
                      <span className="text-sm font-mono">Developer API</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Custom Integrations Made Simple
                    </h2>
                    <p className="text-lg opacity-90 mb-6">
                      Don't see your platform? Our developer-friendly API lets you build custom integrations 
                      that fit your exact workflow requirements.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {apiFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold">{feature.title}</span>
                            <span className="opacity-80"> — {feature.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      onClick={() => navigate("/contact")}
                    >
                      Request API Documentation
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>

                  {/* Code Preview */}
                  <div className="bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="ml-2 text-gray-400 text-xs">api-example.js</span>
                    </div>
                    <pre className="text-gray-300 overflow-x-auto">
                      <code>{`// Real-time inventory sync
const response = await fetch(
  'https://api.westfieldprep.com/v1/inventory',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sku: 'WIDGET-001',
      quantity: 150,
      location: 'MAIN'
    })
  }
);

// Webhook-enabled, real-time sync`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Integration Benefits */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Our Integrations Stand Out</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Built for reliability, speed, and developer experience
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Real-Time Sync</h3>
                    <p className="text-muted-foreground">
                      Inventory and orders sync in real-time. No delays, no manual updates needed.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Webhook className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Webhook-Enabled</h3>
                    <p className="text-muted-foreground">
                      Instant event notifications keep your systems in perfect sync at all times.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <RefreshCw className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Tech Stack-Friendly</h3>
                    <p className="text-muted-foreground">
                      Works with your existing tools. Our system adapts to your operations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-secondary/10">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Don't See Your Platform?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Let's build a custom integration tailored to your specific needs. Our team can connect virtually any system.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/contact")}
                className="bg-secondary hover:bg-secondary/90"
              >
                Contact Our Integration Team
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Integrations;
