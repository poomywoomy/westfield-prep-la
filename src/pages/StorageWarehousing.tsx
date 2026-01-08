import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import StorageHero from "@/components/storage/StorageHero";
import StorageContent from "@/components/storage/StorageContent";
import StorageCTA from "@/components/storage/StorageCTA";

const StorageWarehousing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceData = {
    serviceType: "WarehouseService",
    name: "3PL Warehouse Storage & Prep Center Services",
    description: "Secure 3PL warehouse storage in Los Angeles. Climate-controlled prep center with pallet storage, lot control, and cycle counts for e-commerce inventory management.",
    features: ["Secure Racking", "Pallet Storage", "Lot Control", "Cycle Counts", "3PL Services"]
  };

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of storage options do you offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer pallet storage, bin storage, and custom shelving solutions in a climate-controlled, 24/7 monitored facility."
        }
      },
      {
        "@type": "Question",
        "name": "How is storage pricing calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Storage is priced per pallet per month or per cubic foot for bin storage with flexible terms and no long-term commitments."
        }
      },
      {
        "@type": "Question",
        "name": "What security measures protect my inventory?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "24/7 video surveillance, restricted access controls, insurance coverage, and regular security audits protect your inventory."
        }
      },
      {
        "@type": "Question",
        "name": "Is the facility climate controlled?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our facility maintains 72°F with humidity control year-round. Temperature logs are available for compliance needs."
        }
      },
      {
        "@type": "Question",
        "name": "Can I access my inventory same-day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Schedule a pickup or inspection visit through your dashboard. Same-day access is available during business hours."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer hazmat storage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We can store certain hazmat categories with proper documentation. Contact us to verify your product classification."
        }
      },
      {
        "@type": "Question",
        "name": "What's included in storage fees?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Storage includes 24/7 security, climate control, insurance, inventory tracking, and access to your dashboard. Receiving and outbound are billed separately."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>3PL Warehouse Storage Los Angeles | Prep Center Inventory Solutions</title>
        <meta name="description" content="Secure 3PL warehouse storage in Los Angeles. Climate-controlled prep center with 24/7 security, pallet storage, and real-time inventory tracking for e-commerce brands." />
        <meta name="keywords" content="3pl los angeles, los angeles 3pl, prep center, warehouse storage, pallet storage, climate controlled warehouse, ecommerce fulfillment" />
        <link rel="canonical" href="https://westfieldprepcenter.com/storage-warehousing" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqSchemaData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Storage & Warehousing", path: "/storage-warehousing" }]} />
        <StorageHero />
        <StorageContent />
        <StorageCTA />
        <Footer />
      </div>
    </>
  );
};

export default StorageWarehousing;
