import { useEffect } from "react";
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
import ServicesDeepDive from "@/components/amazon/v2/ServicesDeepDive";
import WhyLAForFBA from "@/components/amazon/v2/WhyLAForFBA";



import { faqData } from "@/data/pageContent/Amazon";

const Amazon = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);


  return (
    <>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Breadcrumbs items={[{ label: "Sales Channels", path: "/sales-channels" }, { label: "Amazon FBA", path: "/sales-channels/amazon" }]} />
        <main className="flex-1">
          <HeroBento />
          <ComplianceStrip />
          <ServicesBento />
          <ServicesDeepDive />
          <ProcessTimeline />
          <ComplianceChecklist />
          <MetricsBento />
          <WhyLAForFBA />
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

export default Amazon;
