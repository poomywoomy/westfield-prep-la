import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import ChannelHero from "@/components/sales-channels/ChannelHero";
import TrustStrip from "@/components/sales-channels/TrustStrip";
import ChannelFeatures from "@/components/sales-channels/ChannelFeatures";
import CaseStudyCard from "@/components/sales-channels/CaseStudyCard";
import ChannelFAQ from "@/components/sales-channels/ChannelFAQ";
import ChannelCTA from "@/components/sales-channels/ChannelCTA";
import StickyCTA from "@/components/sales-channels/StickyCTA";
import { TranslatedText } from "@/components/TranslatedText";
import { 
  RefreshCw, 
  Package, 
  Truck, 
  Clock, 
  ArrowRight,
  Palette,
  CheckCircle,
  Zap,
  Globe
} from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Shopify Order Sync",
    description: "No manual uploads — orders flow instantly to our fulfillment system.",
  },
  {
    icon: Package,
    title: "Live Inventory Updates",
    description: "Reduces oversell risk with real-time stock level synchronization.",
  },
  {
    icon: Palette,
    title: "Branded Packaging",
    description: "Custom packing slips, labels, and inserts for better customer experience.",
  },
  {
    icon: ArrowRight,
    title: "Returns Management",
    description: "Seamless & trackable returns processing synced back to Shopify.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Same or next business day fulfillment for most orders.",
  },
  {
    icon: Globe,
    title: "API Integration",
    description: "Open for custom workflows and advanced integrations.",
  },
];

const faqs = [
  {
    question: "Can you handle multiple Shopify stores?",
    answer: "Yes — we manage multiple channels under one account. Whether you have separate stores for different brands or regions, we consolidate fulfillment seamlessly.",
  },
  {
    question: "How do returns work?",
    answer: "Returns sync back into Shopify with built-in management tools. We process incoming returns, inspect items, and update inventory levels automatically.",
  },
  {
    question: "What if I have custom packaging needs?",
    answer: "We support custom packs, inserts, labels, and messaging. Your brand experience extends all the way through unboxing.",
  },
];

const caseStudyMetrics = [
  { label: "Lead Time", value: "12hrs" },
  { label: "Accuracy", value: "99.6%" },
  { label: "Revenue Growth", value: "2.9x" },
];

const Shopify = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shopify 3PL Fulfillment Services | Westfield Prep Center</title>
        <meta
          name="description"
          content="Scale your Shopify brand with fast DTC fulfillment, real-time sync, branded packaging & 24hr turnaround. Los Angeles-based 3PL partner."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels/shopify" />
        <meta property="og:title" content="Shopify 3PL Fulfillment Services | Westfield" />
        <meta property="og:description" content="Scale your Shopify brand with fast DTC fulfillment, real-time sync, and branded packaging." />
        <meta property="og:url" content="https://westfieldprepcenter.com/sales-channels/shopify" />
        <meta property="og:type" content="website" />
      </Helmet>

      <StructuredData
        type="service"
        data={{
          name: "Shopify 3PL Fulfillment",
          description: "Professional Shopify fulfillment services including real-time order sync, branded packaging, carrier optimization, and returns management.",
        }}
      />
      <StructuredData type="faq" data={{ faqs }} />
      <StructuredData type="software" />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs
          items={[
            { label: "Sales Channels", path: "/sales-channels" },
            { label: "Shopify", path: "/sales-channels/shopify" },
          ]}
        />

        <main className="flex-1">
          <ChannelHero
            title="Shopify 3PL Fulfillment for Fast, Reliable, Growth-Focused Brands"
            subtitle="Seamless Shipping, Real-Time Sync, & Exceptional Delivery"
            channelType="shopify"
            backgroundImage="/blog-images/shopify-3pl-la-hero.jpg"
          />

          <TrustStrip />

          {/* Why Shopify Brands Need a Dedicated 3PL */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>Why Shopify Brands Need a Dedicated 3PL</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    Shopify merchants know that customer experience begins after checkout. Fast delivery times improve repeat purchase rates, accurate fulfillment boosts online reviews, and transparency reduces support tickets.
                  </TranslatedText>
                </p>
                <p className="text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    But managing fulfillment in-house as you scale gets costly and chaotic:
                  </TranslatedText>
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    "Labor overhead spikes",
                    "Inventory errors increase",
                    "Returns become manual drains",
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-destructive/10 rounded-lg text-center">
                      <span className="font-medium text-destructive"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-8 text-center">
                  <TranslatedText>
                    A dedicated Shopify 3PL gives you the infrastructure and expertise to stay lean, fast, and customer-focused.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* True Shopify + 3PL Sync */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>True Shopify + 3PL Sync</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    Shopify 3PL isn't just about packing boxes — it's about real-time integration:
                  </TranslatedText>
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    "Auto order import",
                    "Instant stock updates",
                    "Shipment tracking back to Shopify",
                    "Returns automation if needed",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="font-medium"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-center mt-8 font-medium text-secondary">
                  <TranslatedText>No CSV uploads. No delays. No human error.</TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* What We Provide for Shopify Brands */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                  <TranslatedText>What We Provide for Shopify Brands</TranslatedText>
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                      <RefreshCw className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">
                      <TranslatedText>Real-Time Order Sync</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      <TranslatedText>
                        As soon as a customer places an order on Shopify, orders flow instantly to our system. We validate SKU, shipping method, and delivery window, then pick, pack, and ship within SLA.
                      </TranslatedText>
                    </p>
                  </div>
                  <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                      <Palette className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">
                      <TranslatedText>Custom Packaging & Branding</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      <TranslatedText>
                        First impressions matter. We offer branded packing slips, custom label integration, gift messaging support, and UPS/USPS Priority, 2-Day, Overnight options.
                      </TranslatedText>
                    </p>
                  </div>
                  <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">
                      <TranslatedText>Carrier Optimization</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      <TranslatedText>
                        We automatically route orders to USPS, UPS, FedEx, or regional carriers as applicable. This ensures best delivery speeds at competitive rates.
                      </TranslatedText>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ChannelFeatures features={features} title="Shopify Fulfillment Features" />

          {/* Fast & Predictable Turnaround */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Zap className="h-7 w-7 text-secondary" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>Fast & Predictable Turnaround</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    Consumer expectations are higher than ever. We offer same or next-day fulfillment, cut SLA windows for VIP customers, and scheduled delivery options.
                  </TranslatedText>
                </p>
                <p className="text-center font-medium text-foreground">
                  <TranslatedText>
                    We measure fulfillment time as a key KPI, not as an afterthought.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </section>

          <CaseStudyCard
            title="Shopify Brand Scales 3x"
            description="A growing DTC apparel brand struggled to keep up with order surges during sale events. After switching to Westfield:"
            metrics={caseStudyMetrics}
          />

          <ChannelFAQ faqs={faqs} title="FAQ — Shopify 3PL" />

          <ChannelCTA
            title="Scale Faster with Shopify 3PL Fulfillment"
            subtitle="Get reliable, growth-focused fulfillment for your Shopify store."
          />
        </main>

        <Footer />
        <StickyCTA />
      </div>
    </>
  );
};

export default Shopify;
