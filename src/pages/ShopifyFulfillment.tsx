import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import ShopifyTrustBar from "@/components/ShopifyTrustBar";
import ShopifyValueGrid from "@/components/ShopifyValueGrid";
import ShopifyTimeline from "@/components/ShopifyTimeline";
import ShopifyMetrics from "@/components/ShopifyMetrics";
import ShopifyCapabilities from "@/components/ShopifyCapabilities";
import ShopifyCaseStudies from "@/components/ShopifyCaseStudies";
import ShopifyAddOns from "@/components/ShopifyAddOns";
import ShopifyTestimonials from "@/components/ShopifyTestimonials";
import ShopifyFinalCTA from "@/components/ShopifyFinalCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const ShopifyFulfillment = () => {
  const navigate = useNavigate();

  const faqData = [
    {
      question: "What are your same-day cutoff times?",
      answer: "Orders placed before 2 PM PST ship the same business day. Orders after 2 PM ship the next business day.",
    },
    {
      question: "Can you handle custom packaging and branded inserts?",
      answer: "Absolutely. We offer custom kitting, branded tissue paper, thank-you cards, promotional inserts, and gift wrapping services.",
    },
    {
      question: "Is there a minimum order quantity or monthly volume requirement?",
      answer: "We work with brands of all sizes. Contact us to discuss your specific volume and we'll create a custom pricing plan.",
    },
    {
      question: "How does your pricing model work?",
      answer: "We charge per-unit pricing based on your services: receiving, pick/pack, kitting, storage, and shipping. No hidden fees. Get a custom quote today.",
    },
  ];

  const serviceData = {
    serviceType: "FulfillmentService",
    name: "Shopify 3PL Fulfillment Services - Los Angeles",
    description: "LA's trusted Shopify 3PL. Same-day fulfillment, QC photo proof, branded packaging. 400K+ orders fulfilled.",
    features: [
      "Same-Day Fulfillment",
      "Photo QC Documentation",
      "Custom Branded Packaging",
      "Real-Time Inventory Sync",
      "Multi-Channel Management",
    ],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shopify 3PL Los Angeles | DTC Fulfillment & Same-Day Shipping - Westfield</title>
        <meta
          name="description"
          content="LA's trusted Shopify 3PL. Same-day fulfillment, QC photo proof, branded packaging. 400K+ orders fulfilled. Get a custom quote in 24hrs."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/shopify-fulfillment" />
        <meta property="og:url" content="https://westfieldprepcenter.com/shopify-fulfillment" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Shopify 3PL Los Angeles | DTC Fulfillment - Westfield"
        />
        <meta
          property="og:description"
          content="Same-day Shopify fulfillment with QC photos and branded packaging. 400K+ orders fulfilled."
        />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Shopify Fulfillment", path: "/shopify-fulfillment" }]} />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-24 md:py-32 mt-16 overflow-hidden bg-gradient-to-br from-[hsl(var(--shopify-page-light))] via-white to-[hsl(var(--shopify-page-light))]">
            {/* Background abstract shapes */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--shopify-page-accent))] rounded-full blur-3xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.08, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[hsl(var(--shopify-page-accent))] rounded-full blur-3xl"
              />
            </div>

            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge className="mb-6 px-4 py-2 text-sm font-semibold bg-white border-2 border-[hsl(var(--shopify-page-accent))]/30 text-[hsl(var(--shopify-page-accent))] hover:bg-[hsl(var(--shopify-page-accent))]/5">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <TranslatedText>Shopify Fulfillment Partner</TranslatedText>
                  </Badge>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))] leading-tight"
                >
                  <TranslatedText>LA's Trusted Shopify 3PL for DTC Brands</TranslatedText>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto"
                >
                  <TranslatedText>Same-day fulfillment. Real-time QC photos. Branded unboxing.</TranslatedText>
                  <br />
                  <TranslatedText>We make your brand unforgettable — and your shipping invisible.</TranslatedText>
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Button
                    size="lg"
                    onClick={() => navigate("/contact")}
                    className="bg-[hsl(var(--shopify-page-accent))] hover:bg-[hsl(var(--shopify-page-accent))]/90 text-white px-10 py-7 text-lg font-bold shadow-xl hover:scale-105 transition-transform"
                  >
                    <TranslatedText>Get a Custom Quote</TranslatedText>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>

                {/* Internal links for SEO */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8 text-sm text-muted-foreground"
                >
                  <TranslatedText>Learn more about our</TranslatedText>{" "}
                  <Link to="/why-choose-us" className="text-[hsl(var(--shopify-page-accent))] hover:underline font-medium">
                    <TranslatedText>fulfillment approach</TranslatedText>
                  </Link>
                  ,{" "}
                  <Link to="/pricing" className="text-[hsl(var(--shopify-page-accent))] hover:underline font-medium">
                    <TranslatedText>transparent pricing</TranslatedText>
                  </Link>
                  , <TranslatedText>and</TranslatedText>{" "}
                  <Link to="/kitting-bundling" className="text-[hsl(var(--shopify-page-accent))] hover:underline font-medium">
                    <TranslatedText>custom kitting services</TranslatedText>
                  </Link>
                  .
                </motion.div>
              </div>
            </div>
          </section>

          {/* Trust Bar */}
          <ShopifyTrustBar />

          {/* Value Grid */}
          <ShopifyValueGrid />

          {/* Timeline */}
          <ShopifyTimeline />

          {/* Performance Metrics */}
          <ShopifyMetrics />

          {/* Capabilities */}
          <ShopifyCapabilities />

          {/* Case Studies */}
          <ShopifyCaseStudies />

          {/* Add-Ons */}
          <ShopifyAddOns />

          {/* Testimonials */}
          <ShopifyTestimonials />

          {/* Final CTA */}
          <ShopifyFinalCTA />
        </main>

        <Footer />
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default ShopifyFulfillment;
