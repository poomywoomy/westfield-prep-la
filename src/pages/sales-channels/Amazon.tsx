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
import ServicesDeepDive from "@/components/amazon/v2/ServicesDeepDive";
import WhyLAForFBA from "@/components/amazon/v2/WhyLAForFBA";

const faqData = [
  {
    question: "What Amazon FBA prep services do you offer?",
    answer:
      "FNSKU labeling, polybagging with suffocation warnings, bubble wrap and fragile prep, bundling and kitting, carton prep, LTL pallet building, hazmat and lithium-battery handling, expiration and lot labeling, and photo-proof QC documentation on every shipment.",
  },
  {
    question: "How quickly can you turn around my FBA shipments?",
    answer:
      "Most shipments are prepped within 24 hours of receiving. Same-day processing is available for inventory received before 2 PM PT, and we routinely turn rush shipments inside 12 hours when sellers need to chase a Buy Box or replenish a fast mover.",
  },
  {
    question: "Can you handle hazmat and lithium battery products?",
    answer:
      "Yes. We're certified to handle hazmat items and lithium batteries with proper documentation, labeling, and compliance procedures. We follow Amazon's Dangerous Goods program requirements end-to-end so your inventory checks in cleanly at the FC.",
  },
  {
    question: "Do you support Amazon Vendor Central shipments?",
    answer:
      "Yes. We handle both Seller Central (FBA) and Vendor Central routing, with experience in PO fulfillment, ASN/EDI compliance, ARN routing, and chargeback prevention. We can ship to Amazon FCs or directly to retail DCs depending on the PO.",
  },
  {
    question: "Can you handle Seller Fulfilled Prime (SFP)?",
    answer:
      "Yes. Same-day processing, weekend shipping, and 2-day delivery capabilities nationwide via discounted carrier rates. We help SFP sellers maintain on-time shipment and delivery metrics so you keep the Prime badge.",
  },
  {
    question: "Do you offer expiration date labeling for consumables?",
    answer:
      "Yes. We apply expiration date labels and maintain lot tracking for all consumable products per Amazon's requirements, with FIFO storage and removal of near-expiry inventory before it can be flagged or destroyed at the FC.",
  },
  {
    question: "How do you handle Amazon receiving discrepancies?",
    answer:
      "Every shipment is photographed before it leaves our dock — units, cartons, pallet, and BOL. When Amazon receives short, we use that documentation to file the reconciliation case on your behalf and chase recovery, instead of leaving you to fight it alone.",
  },
  {
    question: "What are your FBA prep pricing and fees?",
    answer:
      "Transparent per-unit pricing with no hidden fees. We publish service rates on our pricing page and provide a custom quote within 24 hours based on your catalog, prep needs, and monthly volume — no minimums, no long-term contract.",
  },
];

const Amazon = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const serviceData = {
    serviceType: "FulfillmentService",
    name: "Amazon FBA Prep Services - Los Angeles",
    description: "Professional Amazon FBA prep and fulfillment services including FNSKU labeling, poly bagging, bundling, and compliant shipment building in Los Angeles.",
    features: ["FNSKU Labeling", "Polybagging", "Bubble Wrap", "Carton Prep", "Pallet Forwarding", "Photo-Proof QC"],
  };

  return (
    <>
      <Helmet>
        <title>Amazon FBA Prep Center Los Angeles | Westfield Prep Center</title>
        <meta name="description" content="Professional Amazon FBA prep center in Los Angeles offering labeling, packaging, and compliant services with fast turnaround for sellers. Get started today." />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels/amazon" />
        <meta property="og:title" content="Amazon FBA Prep Center Los Angeles | Westfield 3PL" />
        <meta property="og:description" content="Expert FBA prep with 24hr turnaround, 99.8% compliance, and 1M+ units prepped. Trusted by Amazon sellers nationwide." />
        <meta property="og:url" content="https://westfieldprepcenter.com/sales-channels/amazon" />
        <meta property="og:type" content="website" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

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
