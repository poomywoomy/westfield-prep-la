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
  Tag, 
  Package, 
  ClipboardCheck, 
  Truck, 
  Warehouse, 
  Layers,
  Shield,
  Zap,
  BarChart3,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: Tag,
    title: "FNSKU Labeling",
    description: "Print & apply Amazon-specific barcodes with 100% accuracy for FBA compliance.",
  },
  {
    icon: Package,
    title: "Prep Work",
    description: "Poly bags, bubble wrap, bundles, and kits prepared to Amazon's exact standards.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspection & QC",
    description: "Quality checking & exception reporting before items ship to FBA warehouses.",
  },
  {
    icon: Truck,
    title: "Shipment Building",
    description: "Create compliant ASN and pallet builds ready for Amazon fulfillment centers.",
  },
  {
    icon: Warehouse,
    title: "Pre-FBA Storage",
    description: "Strategic inventory storage and staging before sending to Amazon.",
  },
  {
    icon: Layers,
    title: "Multi-channel Fulfillment",
    description: "Amazon + DTC + third-party marketplace support from one warehouse.",
  },
];

const faqs = [
  {
    question: "Do you integrate with Seller Central?",
    answer: "Yes — we support real-time inventory sync and reporting to keep your Amazon listings accurate. Our system connects directly with your Seller Central account for seamless data flow.",
  },
  {
    question: "Will you ship direct to Amazon?",
    answer: "Absolutely. We build compliant shipments and can upload ASNs on your behalf. Your products arrive at Amazon fulfillment centers ready to sell.",
  },
  {
    question: "What if my ASIN has special prep requirements?",
    answer: "We capture and enforce any ASIN-specific instructions during receiving. Our team stays current with Amazon's evolving prep guidelines across all product categories.",
  },
];

const caseStudyMetrics = [
  { label: "Receiving Time", value: "<24hrs" },
  { label: "Inventory Accuracy", value: "99.7%" },
  { label: "Revenue Growth", value: "+28%" },
];

const Amazon = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Amazon FBA Prep Center & 3PL Fulfillment | Westfield Prep Center</title>
        <meta
          name="description"
          content="Get compliant, fast Amazon FBA prep with 24hr turnaround. Real-time Seller Central sync, FNSKU labeling, custom bundles, and nationwide service from Los Angeles."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels/amazon" />
        <meta property="og:title" content="Amazon FBA Prep Center & 3PL Fulfillment | Westfield" />
        <meta property="og:description" content="Get compliant, fast Amazon FBA prep with 24hr turnaround. Real-time Seller Central sync and FNSKU labeling." />
        <meta property="og:url" content="https://westfieldprepcenter.com/sales-channels/amazon" />
        <meta property="og:type" content="website" />
      </Helmet>

      <StructuredData
        type="service"
        data={{
          name: "Amazon FBA Prep Services",
          description: "Professional Amazon FBA prep and fulfillment services including FNSKU labeling, poly bagging, bundling, and compliant shipment building.",
        }}
      />
      <StructuredData type="faq" data={{ faqs }} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs
          items={[
            { label: "Sales Channels", path: "/sales-channels" },
            { label: "Amazon FBA", path: "/sales-channels/amazon" },
          ]}
        />

        <main className="flex-1">
          <ChannelHero
            title="Amazon Prep Center & 3PL Fulfillment Services"
            subtitle="Helping Amazon Sellers Scale Faster with Compliant, Fast, and Reliable Prep Services"
            channelType="amazon"
            backgroundImage="/blog-images/fba-labeling-process.jpg"
          />

          <TrustStrip />

          {/* Why Amazon Sellers Choose a Dedicated 3PL */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>Why Amazon Sellers Choose a Dedicated 3PL</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    Amazon's marketplace is one of the most competitive sales channels in the world. Winning Buy Box placement, fast delivery windows, and flawless inventory management can make the difference between plateauing and scaling 10x.
                  </TranslatedText>
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "FBA prep requirements",
                    "Labeling standards (FNSKU)",
                    "Storage restrictions & costs",
                    "Shipment creation and routing",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <Shield className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="font-medium"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-6 text-center">
                  <TranslatedText>
                    For many brands, trying to juggle these tasks in-house leads to errors, delays, and lost buy-boxes — and that's where a specialized Amazon Prep Center & 3PL partner becomes essential.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* What Is Amazon FBA Prep? */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>What Is Amazon FBA Prep?</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    Amazon FBA prep refers to the services required to get your inventory ready to be accepted into an Amazon Fulfillment Network (FBA) distribution center.
                  </TranslatedText>
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    "FNSKU labeling",
                    "Poly bagging",
                    "Bubble wrapping",
                    "Bundling/kit creation",
                    "Box reinforcement",
                    "Compliance with Amazon style guides",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-sm font-medium"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* How Westfield Helps You Win on Amazon */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                  <TranslatedText>How Westfield Helps You Win on Amazon</TranslatedText>
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 bg-card rounded-2xl border border-border">
                    <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                      <Shield className="h-7 w-7 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      <TranslatedText>Error-Free FBA Prep & Compliance</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      <TranslatedText>
                        Amazon is constantly updating its requirements, and one misprinted label or missing prep instruction can trigger chargebacks. Our team stays current with all FBA inbound shipment requirements, unique prep instructions per category, and ASIN-specific compliance rules.
                      </TranslatedText>
                    </p>
                    <p className="text-sm font-medium text-secondary">
                      <TranslatedText>We validate every unit before it ships.</TranslatedText>
                    </p>
                  </div>
                  <div className="p-8 bg-card rounded-2xl border border-border">
                    <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                      <Zap className="h-7 w-7 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      <TranslatedText>Fast Turnaround + Same-Day Receiving</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      <TranslatedText>
                        Speed matters on Amazon. Our warehouse processes inbound pallets and cartons quickly with 24-hour receiving turn times (often faster), real-time inventory syncing to your Seller Central dashboard, and notifications as soon as inventory is available.
                      </TranslatedText>
                    </p>
                    <p className="text-sm font-medium text-secondary">
                      <TranslatedText>Keep your Buy Box presence strong.</TranslatedText>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ChannelFeatures features={features} title="Amazon Services We Support" />

          {/* Real-Time Reporting */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <BarChart3 className="h-7 w-7 text-secondary" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>Real-Time Reporting & Inventory Sync</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    Your Amazon inventory is dynamic. We offer two-way API integration, live updates on received inventory, real-time photo proof & scan records, and auto exceptions for damaged or mismatched SKUs.
                  </TranslatedText>
                </p>
                <p className="text-center font-medium text-foreground">
                  <TranslatedText>
                    No more guessing stock on hand — we sync with your backend so Amazon supply never goes dark.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* Cost Efficiency */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <TranslatedText>Cost-Efficiency Built for Growth</TranslatedText>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  <TranslatedText>With a specialized Amazon 3PL:</TranslatedText>
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    "You only pay for what you use",
                    "No overhead for labor or warehouse equipment",
                    "Fewer chargebacks due to compliance errors",
                    "Reduced risk of stranded inventory",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-sm font-medium text-left"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-8">
                  <TranslatedText>
                    All of this translates to better profit margins, fewer operational headaches, and freedom to sell more and worry less.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </section>

          <CaseStudyCard
            title="From 2 Shipments/Week to Daily Inventory Turns"
            description="A mid-tier Amazon seller was losing Buy Box share because inventory would sit in inspection queues an average of 3–4 days. After switching to our FBA prep service:"
            metrics={caseStudyMetrics}
          />

          <ChannelFAQ faqs={faqs} title="FAQ — Amazon 3PL Prep" />

          <ChannelCTA
            title="Ready to Boost Your Amazon Sales?"
            subtitle="Let us be your certified Amazon Prep Center and 3PL partner."
          />
        </main>

        <Footer />
        <StickyCTA />
      </div>
    </>
  );
};

export default Amazon;
