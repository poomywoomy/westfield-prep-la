import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import PlatformInfoDialog from "@/components/PlatformInfoDialog";
import { platformsData } from "@/data/platformsData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Video, ShoppingCart, Globe, Building2, Boxes } from "lucide-react";

const SalesChannels = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const channels = [
    {
      category: "Major Marketplaces",
      icon: ShoppingCart,
      platforms: [
        { name: "Amazon FBA", path: "/amazon-fba-prep", featured: true },
        { name: "Walmart Marketplace", description: "Available upon request" },
        { name: "eBay", description: "Multi-channel fulfillment" },
        { name: "Etsy", description: "Handmade & craft fulfillment" },
        { name: "Target Plus", description: "Enterprise fulfillment" },
      ],
    },
    {
      category: "Social Commerce",
      icon: Video,
      platforms: [
        { name: "TikTok Shop", path: "/tiktok-shop-fulfillment", featured: true },
        { name: "Instagram Shopping", description: "Direct commerce integration" },
        { name: "Facebook Shops", description: "Social selling fulfillment" },
        { name: "Whatnot", description: "Live selling platform" },
        { name: "Pinterest Shopping", description: "Visual commerce" },
      ],
    },
    {
      category: "E-commerce Platforms",
      icon: Store,
      platforms: [
        { name: "Shopify", path: "/shopify-fulfillment", featured: true },
        { name: "WooCommerce", description: "WordPress fulfillment" },
        { name: "BigCommerce", description: "Enterprise e-commerce" },
        { name: "Magento", description: "Custom platform integration" },
        { name: "Wix", description: "Website builder integration" },
        { name: "Squarespace", description: "Design-focused commerce" },
      ],
    },
    {
      category: "B2B & Wholesale",
      icon: Building2,
      platforms: [
        { name: "Faire", description: "Wholesale marketplace" },
        { name: "Alibaba", description: "Global wholesale" },
      ],
    },
    {
      category: "International",
      icon: Globe,
      platforms: [
        { name: "Mercado Libre", description: "Latin America marketplace" },
        { name: "Rakuten", description: "Japan e-commerce" },
      ],
    },
  ];

  // Flatten all platforms for schema
  const allPlatforms = channels.flatMap(channel => 
    channel.platforms.map(platform => ({
      name: platform.name,
      description: platform.description,
      path: platform.path
    }))
  );

  return (
    <>
      <Helmet>
        <title>Supported Sales Channels | Multi-Channel Fulfillment - Westfield Prep Center</title>
        <meta name="description" content="We support all major e-commerce platforms including Shopify, Amazon, TikTok Shop, Walmart, eBay, and more. Multi-channel fulfillment from our Los Angeles warehouse." />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels/" />
      </Helmet>
      <StructuredData type="itemList" data={{ platforms: allPlatforms }} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Sales Channels", path: "/sales-channels/" }]} />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-24 mt-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10" />
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                  <Boxes className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Multi-Channel Support</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  We Support All Major Sales Channels
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  One 3PL partner for all your selling platforms. Seamless multi-channel fulfillment from our Los Angeles warehouse.
                </p>
                <Button size="lg" className="bg-secondary hover:bg-secondary/90" onClick={() => navigate("/contact")}>
                  Get Started
                </Button>
              </div>
            </div>
          </section>

          {/* Channels Grid */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto space-y-12">
                {channels.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <div key={idx}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">{category.category}</h2>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.platforms.map((platform, pIdx) => (
                          <Card
                            key={pIdx}
                            className={`hover:shadow-lg transition-all cursor-pointer ${
                              platform.featured
                                ? "border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5"
                                : "border-border hover:border-primary/30"
                            }`}
                            onClick={() => platform.path ? navigate(platform.path) : setSelectedPlatform(platform.name)}
                          >
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <span className="text-lg font-semibold">{platform.name}</span>
                                {platform.featured && (
                                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                    Featured
                                  </span>
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground text-sm mb-3">
                                {platform.description || "Full fulfillment integration available"}
                              </p>
                              <span className="text-sm font-medium text-primary hover:underline">
                                Learn More →
                              </span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-gradient-to-br from-primary to-secondary">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Don't See Your Platform?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                We integrate with custom platforms and APIs. Contact us to discuss your specific needs.
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <PlatformInfoDialog
        platform={selectedPlatform ? platformsData[selectedPlatform as keyof typeof platformsData] : null}
        open={!!selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
      />
    </>
  );
};

export default SalesChannels;
