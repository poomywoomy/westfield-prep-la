import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import SalesChannelsHero from "@/components/sales-channels/SalesChannelsHero";
import PlatformCard, { PlatformData } from "@/components/sales-channels/PlatformCard";
import PlatformDetailModal from "@/components/sales-channels/PlatformDetailModal";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "@/components/TranslatedText";
import { Plus, ArrowRight, Sparkles } from "lucide-react";
import { supportedPlatforms, featuredPlatforms, regularPlatforms } from "@/data/supportedPlatforms";

const SalesChannels = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // For structured data
  const allPlatforms = supportedPlatforms.map((platform) => ({
    name: platform.name,
    description: platform.tagline,
    path: platform.path,
  }));

  return (
    <>
      <Helmet>
        <title>Supported Sales Channels | Multi-Channel Fulfillment - Westfield Prep Center</title>
        <meta
          name="description"
          content="We support all major e-commerce platforms including Shopify, Amazon, TikTok Shop, Walmart, eBay, and more. Multi-channel fulfillment from our Los Angeles warehouse."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels" />
      </Helmet>
      <StructuredData type="itemList" data={{ platforms: allPlatforms }} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Sales Channels", path: "/sales-channels" }]} />

        <main className="flex-1">
          {/* Hero Section */}
          <SalesChannelsHero />

          {/* Featured Platforms */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-2 mb-4">
                    <Sparkles className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium text-secondary">
                      <TranslatedText>Featured Integrations</TranslatedText>
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    <TranslatedText>Our Most Popular Platforms</TranslatedText>
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    <TranslatedText>
                      Deep integrations with the platforms that power e-commerce. Real-time sync, automatic order import, and seamless fulfillment.
                    </TranslatedText>
                  </p>
                </motion.div>

                {/* Featured Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                  {featuredPlatforms.map((platform, idx) => (
                    <PlatformCard
                      key={platform.key}
                      platform={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      index={idx}
                    />
                  ))}
                </div>

                {/* Regular Platforms Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-8"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    <TranslatedText>More Supported Platforms</TranslatedText>
                  </h2>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    <TranslatedText>
                      Full integration support for all major e-commerce and wholesale platforms.
                    </TranslatedText>
                  </p>
                </motion.div>

                {/* Regular Platforms Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {regularPlatforms.map((platform, idx) => (
                    <PlatformCard
                      key={platform.key}
                      platform={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      index={idx + featuredPlatforms.length}
                    />
                  ))}
                  
                  {/* And More Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * (regularPlatforms.length + featuredPlatforms.length) }}
                    className="group relative bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      <TranslatedText>And More</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      <TranslatedText>Custom integrations available</TranslatedText>
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-gradient-to-br from-primary to-secondary">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                  <TranslatedText>Ready to Simplify Your Fulfillment?</TranslatedText>
                </h2>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                  <TranslatedText>
                    Connect your store today and start shipping from Los Angeles. No setup fees, no long-term contracts.
                  </TranslatedText>
                </p>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
                  onClick={() => navigate("/contact")}
                >
                  <TranslatedText>Get Started Free</TranslatedText>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Platform Detail Modal */}
      <PlatformDetailModal
        platform={selectedPlatform}
        open={!!selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
      />
    </>
  );
};

export default SalesChannels;
