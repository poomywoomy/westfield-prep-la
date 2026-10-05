import { useEffect } from "react";
import { Helmet } from "@/lib/helmet-compat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HeroBento from "@/components/amazon/v2/HeroBento";
import ComplianceStrip from "@/components/amazon/v2/ComplianceStrip";
import ServicesBento from "@/components/amazon/v2/ServicesBento";
import ProcessTimeline from "@/components/amazon/v2/ProcessTimeline";
import ComplianceChecklist from "@/components/amazon/v2/ComplianceChecklist";
import MetricsBento from "@/components/amazon/v2/MetricsBento";
import ResultsBento from "@/components/amazon/v2/ResultsBento";
import FaqSection from "@/components/shared/FaqSection";
import FinalCTA from "@/components/amazon/v2/FinalCTA";



import { faqData } from "@/data/pageContent/AmazonFBAPrep";

const AmazonFBAPrep = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);


  return (
    <>
      <Helmet>
        <title>Amazon FBA Prep Center Los Angeles | Westfield Prep Center</title>
        <meta name="description" content="Professional Amazon FBA prep center in Los Angeles offering labeling, packaging, and compliant services with fast turnaround for sellers. Get started today." />
        <link rel="canonical" href="https://westfieldprepcenter.com/amazon-fba-prep" />
        <meta property="og:url" content="https://westfieldprepcenter.com/amazon-fba-prep" />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Breadcrumbs items={[{ label: "Amazon FBA Prep", path: "/amazon-fba-prep" }]} />
        <main className="flex-1">
          <HeroBento />
          <ComplianceStrip />
          <ServicesBento />
          <ProcessTimeline />
          <ComplianceChecklist />
          <MetricsBento />
          <ResultsBento />
          <FaqSection faqs={faqData} />
          <FinalCTA />
        </main>
        <Footer />
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default AmazonFBAPrep;
