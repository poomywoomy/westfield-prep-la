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
  TrendingUp, 
  Truck, 
  Clock, 
  Zap,
  Package,
  AlertTriangle,
  CheckCircle,
  Boxes
} from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Real-Time Order Sync",
    description: "Orders move fast, always — direct API connection to TikTok Shop.",
  },
  {
    icon: TrendingUp,
    title: "Scalability for Campaign Peaks",
    description: "Stay stocked during viral surges with elastic fulfillment capacity.",
  },
  {
    icon: Zap,
    title: "Rapid Pick/Pack",
    description: "Short delivery windows met with prioritized processing.",
  },
  {
    icon: Truck,
    title: "Carrier Selection",
    description: "Best transit time & cost optimization across multiple carriers.",
  },
  {
    icon: Boxes,
    title: "Buffer Inventory",
    description: "Prevent sell-outs with strategic safety stock staging.",
  },
];

const faqs = [
  {
    question: "How fast is your turnaround?",
    answer: "Typically same or next business day fulfillment depending on volume. During viral surges, we prioritize your orders to meet TikTok Shop's delivery expectations.",
  },
  {
    question: "Do you handle returns from TikTok Shop?",
    answer: "Yes — returns and exchanges get routed back into our system and synced to your account. We process, inspect, and restock eligible items automatically.",
  },
  {
    question: "Can you handle surprise spikes?",
    answer: "Yes — our workflows scale automatically with demand surges. We've handled viral drops with thousands of orders in hours without missing SLAs.",
  },
];

const caseStudyMetrics = [
  { label: "Processing Time", value: "6hrs" },
  { label: "Error Rate", value: "<0.8%" },
  { label: "Satisfaction", value: "95%+" },
];

const TikTokShop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>TikTok Shop Fulfillment & 3PL for Viral Brands | Westfield Prep Center</title>
        <meta
          name="description"
          content="Fulfill viral TikTok Shop drops with lightning-fast turnaround. Real-time order sync, surge support, and carrier optimization from Los Angeles."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels/tiktok-shop" />
        <meta property="og:title" content="TikTok Shop Fulfillment & 3PL for Viral Brands | Westfield" />
        <meta property="og:description" content="Fulfill viral TikTok Shop drops with lightning-fast turnaround and real-time order sync." />
        <meta property="og:url" content="https://westfieldprepcenter.com/sales-channels/tiktok-shop" />
        <meta property="og:type" content="website" />
      </Helmet>

      <StructuredData
        type="service"
        data={{
          name: "TikTok Shop Fulfillment",
          description: "Professional TikTok Shop fulfillment services with real-time order sync, surge capacity, and rapid pick/pack for viral demand.",
        }}
      />
      <StructuredData type="faq" data={{ faqs }} />
      <StructuredData type="software" />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs
          items={[
            { label: "Sales Channels", path: "/sales-channels" },
            { label: "TikTok Shop", path: "/sales-channels/tiktok-shop" },
          ]}
        />

        <main className="flex-1">
          <ChannelHero
            title="TikTok Shop Logistics & 3PL Fulfillment"
            subtitle="Fulfill Viral Demand with Speed, Accuracy, and Seamless Sync"
            channelType="tiktok"
            backgroundImage="/blog-images/shopify-3pl-warehouse-operations.jpg"
          />

          <TrustStrip />

          {/* The Power of TikTok Shopping */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>The Power of TikTok Shopping</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    TikTok Shop has flipped the ecommerce funnel:
                  </TranslatedText>
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    "Viral content generates instant demand",
                    "Live selling drives impulse purchases",
                    "Limited production drops can sell out in minutes",
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl text-center border border-pink-500/20">
                      <span className="font-medium"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-8 text-center">
                  <TranslatedText>
                    But that explosive demand requires fulfillment workflows that won't break when traffic spikes.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* Why TikTok Shop Needs a 3PL Partner */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-14 w-14 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-7 w-7 text-destructive" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>Why TikTok Shop Needs a 3PL Partner</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    One viral video can lead to thousands of orders in hours. Without scalable fulfillment your brand risks:
                  </TranslatedText>
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    "Fulfillment delays",
                    "Missing delivery expectations",
                    "Higher support costs",
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-destructive/10 rounded-lg text-center">
                      <span className="font-medium text-destructive"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-8 text-center">
                  <TranslatedText>
                    A 3PL with experience in rapid surges gives you the operational backbone to support peak moments.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* TikTok Shop Integration */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>TikTok Shop Integration for Order Sync</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>We provide:</TranslatedText>
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    "Real-time order import (via API or middleware)",
                    "SKU mapping to fulfillment SKUs",
                    "Instant status sync to TikTok platform",
                    "Tracking updates pushed back to buyer",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="font-medium text-sm"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-center mt-8 font-medium text-secondary">
                  <TranslatedText>Orders placed on TikTok Shop flow directly into our warehouse dashboard — no CSVs, no bottlenecks.</TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* TikTok Shop Fulfillment Capabilities */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                  <TranslatedText>TikTok Shop Fulfillment Capabilities</TranslatedText>
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">
                      <TranslatedText>Fast Turnaround</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      <TranslatedText>
                        Prioritized pick/pack based on demand windows. Same-day handling for viral events.
                      </TranslatedText>
                    </p>
                  </div>
                  <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                      <Package className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">
                      <TranslatedText>Scalable Inventory Management</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      <TranslatedText>
                        Buffer stock staging for promotions, safety stock levels, and instant alerts on low inventory.
                      </TranslatedText>
                    </p>
                  </div>
                  <div className="p-6 bg-card rounded-2xl border border-border">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">
                      <TranslatedText>Order Routing & Carrier Optimization</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      <TranslatedText>
                        Automatic routing to faster delivery carriers, economy options, and international channels where supported.
                      </TranslatedText>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ChannelFeatures features={features} title="TikTok Shop Fulfillment Features" />

          <CaseStudyCard
            title="Viral Drop Fulfilled in Hours"
            description="A TikTok creator brand experienced a 48hr demand surge after their video hit 3M views. Without a 3PL partner, they would have lost sales and reviews:"
            metrics={caseStudyMetrics}
          />

          <ChannelFAQ faqs={faqs} title="FAQ — TikTok Shop Fulfillment" />

          <ChannelCTA
            title="Dominate TikTok Shop with a 3PL Built for Viral Demand"
            subtitle="Get lightning-fast fulfillment that scales with your content."
          />
        </main>

        <Footer />
        <StickyCTA />
      </div>
    </>
  );
};

export default TikTokShop;
