import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import TrustStrip from "@/components/sales-channels/TrustStrip";
import StickyCTA from "@/components/sales-channels/StickyCTA";
import AmazonChannelHero from "@/components/amazon/AmazonChannelHero";
import AmazonChannelValueGrid from "@/components/amazon/AmazonChannelValueGrid";
import AmazonChannelServices from "@/components/amazon/AmazonChannelServices";
import AmazonChannelMetrics from "@/components/amazon/AmazonChannelMetrics";
import AmazonChannelTimeline from "@/components/amazon/AmazonChannelTimeline";
import AmazonChannelCaseStudy from "@/components/amazon/AmazonChannelCaseStudy";
import AmazonChannelFAQ from "@/components/amazon/AmazonChannelFAQ";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Zap, BarChart3, CheckCircle, DollarSign } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const faqs = [
  {
    question: "What Amazon FBA prep services do you offer?",
    answer:
      "We provide comprehensive FBA prep services including FNSKU labeling, polybagging, bubble wrap, carton prep, pallet building, and QC documentation.",
  },
  {
    question: "How quickly can you turn around my FBA shipments?",
    answer:
      "Most shipments are prepped within 24-48 hours of receiving. We offer same-day receiving and expedited options for rush orders.",
  },
  {
    question: "What are your FBA prep pricing and fees?",
    answer:
      "Our pricing is transparent and per-unit based. Contact us for a custom quote tailored to your catalog and volume.",
  },
];

const Amazon = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Amazon FBA Prep Center Los Angeles | Westfield Prep Center</title>
        <meta
          name="description"
          content="Professional Amazon FBA prep center in Los Angeles offering labeling,
packaging, and compliant services with fast turnaround for sellers. Get started today."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels/amazon" />
        <meta property="og:title" content="Amazon FBA Prep Center Los Angeles | Westfield 3PL" />
        <meta
          property="og:description"
          content="Expert FBA prep with 24hr turnaround, 99.7% accuracy, and full Amazon compliance. Trusted by 500+ sellers."
        />
        <meta property="og:url" content="https://westfieldprepcenter.com/sales-channels/amazon" />
        <meta property="og:type" content="website" />
      </Helmet>

      <StructuredData
        type="service"
        data={{
          name: "Amazon FBA Prep Services",
          description:
            "Professional Amazon FBA prep and fulfillment services including FNSKU labeling, poly bagging, bundling, and compliant shipment building in Los Angeles.",
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
          {/* Premium Hero Section */}
          <AmazonChannelHero />

          {/* Trust Strip */}
          <TrustStrip />

          {/* Why Amazon Sellers Need a 3PL */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>Why Amazon Sellers Choose a</TranslatedText>{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    <TranslatedText>Dedicated 3PL</TranslatedText>
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
                  <TranslatedText>
                    Amazon's marketplace is one of the most competitive sales channels in the world. Winning Buy Box
                    placement, fast delivery windows, and flawless inventory management can make the difference between
                    plateauing and scaling 10x. But managing FBA prep in-house comes with significant challenges that
                    drain your time and resources.
                  </TranslatedText>
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    "Constantly changing FBA prep requirements",
                    "FNSKU labeling standards and compliance",
                    "Storage restrictions and rising fees",
                    "Shipment creation and routing complexity",
                    "IPI score management",
                    "Stranded inventory prevention",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100"
                    >
                      <Shield className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <span className="font-medium text-foreground">
                        <TranslatedText>{item}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-center">
                  <TranslatedText>
                    For many brands, trying to juggle these tasks in-house leads to errors, delays, and lost buy-boxes.
                    That's where a specialized
                  </TranslatedText>{" "}
                  <Link to="/amazon-fba-prep" className="text-orange-600 hover:underline font-medium">
                    <TranslatedText>Amazon Prep Center</TranslatedText>
                  </Link>{" "}
                  <TranslatedText>becomes essential for sustainable growth.</TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* What Is Amazon FBA Prep? */}
          <section className="py-20 bg-gradient-to-b from-orange-50/50 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>What Is</TranslatedText>{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    <TranslatedText>Amazon FBA Prep?</TranslatedText>
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    Amazon FBA prep refers to the services required to get your inventory ready to be accepted into an
                    Amazon Fulfillment Network (FBA) distribution center. Every product category has specific
                    requirements, and failing to meet them results in rejected shipments, chargebacks, and potential
                    account suspensions.
                  </TranslatedText>
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {[
                    "FNSKU barcode labeling",
                    "Polybagging with suffocation warnings",
                    "Bubble wrap for fragile items",
                    "Bundling and kit creation",
                    "Box reinforcement and prep",
                    "Compliance with category guides",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-orange-200 transition-colors"
                    >
                      <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        <TranslatedText>{item}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-muted-foreground">
                  <TranslatedText>
                    Our team stays current with Amazon's ever-evolving prep guidelines across all product categories.
                    Learn more about our
                  </TranslatedText>{" "}
                  <Link to="/labeling-compliance" className="text-orange-600 hover:underline font-medium">
                    <TranslatedText>labeling and compliance services</TranslatedText>
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Value Grid */}
          <AmazonChannelValueGrid />

          {/* How Westfield Helps You Win */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                  <TranslatedText>How Westfield Helps You</TranslatedText>{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    <TranslatedText>Win on Amazon</TranslatedText>
                  </span>
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 bg-card rounded-2xl border border-border hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-6">
                      <Shield className="h-7 w-7 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      <TranslatedText>Error-Free FBA Prep & Compliance</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      <TranslatedText>
                        Amazon is constantly updating its requirements, and one misprinted label or missing prep
                        instruction can trigger chargebacks. Our team stays current with all FBA inbound shipment
                        requirements, unique prep instructions per category, and ASIN-specific compliance rules. We
                        validate every unit before it ships.
                      </TranslatedText>
                    </p>
                    <p className="text-sm font-medium text-orange-600">
                      <TranslatedText>Result: Near-zero chargeback rate across all client shipments.</TranslatedText>
                    </p>
                  </div>
                  <div className="p-8 bg-card rounded-2xl border border-border hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-6">
                      <Zap className="h-7 w-7 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      <TranslatedText>Fast Turnaround + Same-Day Receiving</TranslatedText>
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      <TranslatedText>
                        Speed matters on Amazon. Our warehouse processes inbound pallets and cartons quickly with
                        24-hour receiving turn times (often faster), real-time inventory syncing to your Seller Central
                        dashboard, and notifications as soon as inventory is available for shipment to FBA.
                      </TranslatedText>
                    </p>
                    <p className="text-sm font-medium text-orange-600">
                      <TranslatedText>
                        Result: Keep your Buy Box presence strong with faster inventory velocity.
                      </TranslatedText>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <AmazonChannelServices />

          {/* Metrics Section (Dark) */}
          <AmazonChannelMetrics />

          {/* Timeline */}
          <AmazonChannelTimeline />

          {/* Real-Time Reporting */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>Real-Time Reporting &</TranslatedText>{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    <TranslatedText>Inventory Sync</TranslatedText>
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    Your Amazon inventory is dynamic. We offer two-way API integration with Seller Central, live updates
                    on received inventory, real-time photo proof and scan records, and automatic exception handling for
                    damaged or mismatched SKUs. No more guessing stock on hand—we sync with your backend so Amazon
                    supply never goes dark.
                  </TranslatedText>
                </p>
                <div className="flex justify-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Link to="/integrations">
                      <TranslatedText>See Our Integrations</TranslatedText>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Efficiency */}
          <section className="py-20 bg-gradient-to-b from-orange-50/50 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <TranslatedText>Cost-Efficiency</TranslatedText>{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    <TranslatedText>Built for Growth</TranslatedText>
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  <TranslatedText>
                    With a specialized Amazon 3PL, you only pay for what you use. No overhead for labor or warehouse
                    equipment, fewer chargebacks due to compliance errors, and reduced risk of stranded inventory eating
                    into your margins.
                  </TranslatedText>
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                  {[
                    "Pay only for services you use",
                    "Zero equipment or labor overhead",
                    "Fewer compliance chargebacks",
                    "Reduced stranded inventory risk",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                      <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-left">
                        <TranslatedText>{item}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  <TranslatedText>
                    All of this translates to better profit margins, fewer operational headaches, and freedom to sell
                    more and worry less. Check our
                  </TranslatedText>{" "}
                  <Link to="/pricing" className="text-orange-600 hover:underline font-medium">
                    <TranslatedText>transparent pricing</TranslatedText>
                  </Link>{" "}
                  <TranslatedText>for details.</TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* Case Study */}
          <AmazonChannelCaseStudy />

          {/* FAQ */}
          <AmazonChannelFAQ />

          {/* Final CTA */}
          <section className="py-24 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <TranslatedText>Ready to Scale Your Amazon Business?</TranslatedText>
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                <TranslatedText>
                  Join 500+ Amazon sellers who trust Westfield for compliant, fast, and reliable FBA prep services.
                </TranslatedText>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="px-10 py-7 text-lg font-bold bg-white text-orange-600 hover:bg-white/90 shadow-lg"
                >
                  <Link to="/contact">
                    <TranslatedText>Get Your Free Quote</TranslatedText>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-10 py-7 text-lg font-bold border-2 border-white text-white bg-transparent hover:bg-white/10"
                >
                  <Link to="/pricing">
                    <TranslatedText>View Pricing</TranslatedText>
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <StickyCTA />
      </div>
    </>
  );
};

export default Amazon;
