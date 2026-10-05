import { useEffect } from "react";
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
import ServicesDeepDive from "@/components/shopify-channel/v2/ServicesDeepDive";
import WhyLAEdge from "@/components/shopify-channel/v2/WhyLAEdge";



import { faqData } from "@/data/pageContent/Shopify";

const Shopify = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);


  return (
    <>

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
