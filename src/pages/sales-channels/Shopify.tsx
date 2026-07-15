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
import ServicesDeepDive from "@/components/shopify-channel/v2/ServicesDeepDive";
import WhyLAEdge from "@/components/shopify-channel/v2/WhyLAEdge";

const faqData = [
  {
    question: "How quickly can I get started with Shopify fulfillment?",
    answer:
      "Most Shopify stores are fully operational within 24 hours of signing. We integrate with your store via the Shopify app, configure SKUs and packaging preferences, and have your first inventory landed and synced inside the first week. From there, every new order flows into our pick queue automatically.",
  },
  {
    question: "What happens when I get a sudden surge in orders?",
    answer:
      "We're built for scale. We've processed 10x normal volume for clients during Black Friday and product launches without delays. Our staffing scales with your forecast, and our pick floor is sized to absorb peak-week surges without missing the same-day cutoff.",
  },
  {
    question: "Can you match my current branded packaging?",
    answer:
      "Absolutely. We work with custom mailer boxes, branded tissue paper, thank-you cards, promotional inserts, stickers, and gift wrapping. If you can ship it to us with instructions, we can pack it consistently — every order, every time.",
  },
  {
    question: "How does inventory sync work?",
    answer:
      "Real-time, two-way sync with Shopify. When we receive inventory, your Shopify stock updates automatically. When an order ships, fulfillment status, tracking number, and carrier push back to Shopify within seconds — so the customer notification fires the moment the box leaves the dock.",
  },
  {
    question: "What are your shipping carrier options?",
    answer:
      "Discounted rates across USPS, UPS, FedEx, and regional carriers, with automatic carrier selection by zone, weight, and service level. We rate-shop every order so you get the cheapest compliant rate without having to think about it.",
  },
  {
    question: "How do you handle returns?",
    answer:
      "Full returns processing including receiving, photo inspection, restock decisioning, damage logging, and inventory updates. Resellable items move back to available stock automatically; damaged items are flagged in your dashboard with photos so you can decide on next steps.",
  },
  {
    question: "Is there a minimum order volume?",
    answer:
      "No hard minimums and no long-term contracts, but we're built for Shopify brands doing 1,000+ orders per month, scaling to 50,000+. Pricing is per unit and month-to-month — you only pay for what you actually use.",
  },
];

const Shopify = () => {
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
        <title>Shopify Fulfillment Center with Expert Order Management</title>
        <meta name="description" content="Westfield Prep Center is a Shopify fulfillment center that offers efficient Shopify order management, inventory control, and scalable fulfillment solutions." />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels/shopify" />
        <meta property="og:url" content="https://westfieldprepcenter.com/sales-channels/shopify" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shopify Fulfillment Services | Westfield Prep Center" />
        <meta property="og:description" content="Same-day Shopify fulfillment with QC photos and branded packaging. 400K+ orders fulfilled from Los Angeles." />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Breadcrumbs items={[{ label: "Sales Channels", path: "/sales-channels" }, { label: "Shopify", path: "/sales-channels/shopify" }]} />
        <main className="flex-1">
          <HeroBento />
          <TrustMarquee />
          <ValueBento />
          <ServicesDeepDive />
          <HowItWorksRail />
          <IntegrationDiagram />
          <MetricsBento />
          <CapabilitiesAccordion />
          <WhyLAEdge />
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

export default Shopify;
