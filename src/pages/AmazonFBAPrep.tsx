import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
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

const faqData = [
  { question: "What Amazon compliance standards do you follow?", answer: "All FBA prep requirements: FNSKU labeling, case pack guidelines, polybagging standards, and hazmat regulations." },
  { question: "Can you handle hazmat and lithium battery products?", answer: "Yes, certified to handle hazmat items and lithium batteries with proper documentation, labeling, and compliance procedures." },
  { question: "Do you support Amazon Vendor Central shipments?", answer: "Yes, we handle both Seller Central (FBA) and Vendor Central routing, with experience in PO fulfillment and compliance." },
  { question: "What's your experience with FBA shipment plans?", answer: "We process 1000+ FBA shipments monthly and understand all Amazon placement, routing, and box content requirements." },
  { question: "Can you handle Seller Fulfilled Prime (SFP)?", answer: "Yes — same-day processing, weekend shipping, and 2-day delivery capabilities nationwide." },
  { question: "Do you offer expiration date labeling for consumables?", answer: "Yes, we apply expiration date labels and maintain lot tracking for all consumable products per Amazon requirements." },
  { question: "How do you handle Amazon inventory discrepancies?", answer: "Photo proof of all shipments, plus we work with Amazon to resolve receiving discrepancies with complete documentation." },
  { question: "What's your turnaround time for urgent prep?", answer: "Same-day processing for orders received before 2 PM PT. Rush service available for tight deadlines." },
];

const AmazonFBAPrep = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const serviceData = {
    serviceType: "FulfillmentService",
    name: "Amazon FBA Prep Services - Los Angeles",
    description: "FNSKU labeling, polybagging, bubble wrap, carton prep, pallet forwarding with full Amazon compliance.",
    features: ["FNSKU Labeling", "Polybagging", "Bubble Wrap", "Carton Prep", "Pallet Forwarding", "Photo-Proof QC"],
  };

  return (
    <>
      <Helmet>
        <title>Amazon FBA Prep Center Los Angeles | Westfield Prep Center</title>
        <meta name="description" content="Professional Amazon FBA prep center in Los Angeles offering labeling, packaging, and compliant services with fast turnaround for sellers. Get started today." />
        <link rel="canonical" href="https://westfieldprepcenter.com/amazon-fba-prep" />
        <meta property="og:url" content="https://westfieldprepcenter.com/amazon-fba-prep" />
        <meta property="og:type" content="article" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

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
