import { useEffect } from "react";
import { Helmet } from "@/lib/helmet-compat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
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



import { faqData } from "@/data/pageContent/ShopifyFulfillment";

const ShopifyFulfillment = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);


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
