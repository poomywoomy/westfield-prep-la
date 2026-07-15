import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HeroBento from "@/components/shopify-channel/v2/HeroBento";
import TrustMarquee from "@/components/shopify-channel/v2/TrustMarquee";
import ValueBento from "@/components/shopify-channel/v2/ValueBento";
import HowItWorksRail from "@/components/shopify-channel/v2/HowItWorksRail";
import IntegrationDiagram from "@/components/shopify-channel/v2/IntegrationDiagram";
import MetricsBento from "@/components/shopify-channel/v2/MetricsBento";
import CapabilitiesAccordion from "@/components/shopify-channel/v2/CapabilitiesAccordion";
import CaseStudySpotlight from "@/components/shopify-channel/v2/CaseStudySpotlight";
import FaqSection from "@/components/shared/FaqSection";
import FinalCTA from "@/components/shopify-channel/v2/FinalCTA";

const faqData = [
  { question: "What are your same-day cutoff times?", answer: "Orders placed before 2 PM PT ship the same business day. Orders after 2 PM ship the next business day." },
  { question: "Can you handle custom packaging and branded inserts?", answer: "Absolutely. We offer custom kitting, branded tissue paper, thank-you cards, promotional inserts, and gift wrapping services." },
  { question: "Is there a minimum order quantity or monthly volume requirement?", answer: "No hard minimum. Our platform, pricing, and operations are purpose-built for brands shipping 1,000+ orders per month, scaling to 50,000+. Month-to-month, no lock-in." },
  { question: "How does your pricing model work?", answer: "Transparent per-unit pricing for receiving, pick/pack, kitting, storage, and shipping. No hidden fees. Custom quote in 24 hours." },
  { question: "How quickly can I onboard?", answer: "Most Shopify stores are fully operational within 24 hours of signing. Inventory landed and synced inside the first week." },
  { question: "Do you handle returns?", answer: "Full returns processing including receiving, photo inspection, restock decisioning, and damage logging — all visible in your client dashboard." },
];

const ShopifyFulfillment = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const serviceData = {
    serviceType: "FulfillmentService",
    name: "Shopify 3PL Fulfillment Services - Los Angeles",
    description: "LA's trusted Shopify 3PL. Same-day fulfillment, QC photo proof, branded packaging. 400K+ orders fulfilled.",
    features: ["Same-Day Fulfillment", "Photo QC Documentation", "Custom Branded Packaging", "Real-Time Inventory Sync", "Multi-Channel Management"],
  };

  return (
    <>
      <Helmet>
        <title>Shopify 3PL Los Angeles | DTC Fulfillment & Same-Day Shipping - Westfield</title>
        <meta name="description" content="LA's trusted Shopify 3PL. Same-day fulfillment, QC photo proof, branded packaging. 400K+ orders fulfilled. Get a custom quote in 24hrs." />
        <link rel="canonical" href="https://westfieldprepcenter.com/shopify-fulfillment" />
        <meta property="og:url" content="https://westfieldprepcenter.com/shopify-fulfillment" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shopify 3PL Los Angeles | DTC Fulfillment - Westfield" />
        <meta property="og:description" content="Same-day Shopify fulfillment with QC photos and branded packaging. 400K+ orders fulfilled." />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Breadcrumbs items={[{ label: "Shopify Fulfillment", path: "/shopify-fulfillment" }]} />
        <main className="flex-1">
          <HeroBento />
          <TrustMarquee />
          <ValueBento />
          <HowItWorksRail />
          <IntegrationDiagram />
          <MetricsBento />
          <CapabilitiesAccordion />
          <CaseStudySpotlight />
          <FaqSection faqs={faqData} />
          <FinalCTA />
        </main>
        <Footer />
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default ShopifyFulfillment;
