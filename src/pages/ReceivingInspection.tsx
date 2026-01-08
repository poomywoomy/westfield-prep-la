import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { generateMetaTags } from "@/utils/seo";
import ReceivingHero from "@/components/receiving/ReceivingHero";
import ReceivingProcess from "@/components/receiving/ReceivingProcess";
import ReceivingChecklist from "@/components/receiving/ReceivingChecklist";
import ReceivingMetrics from "@/components/receiving/ReceivingMetrics";
import ReceivingDocumentation from "@/components/receiving/ReceivingDocumentation";
import ReceivingFAQ from "@/components/receiving/ReceivingFAQ";
import ReceivingCTA from "@/components/receiving/ReceivingCTA";

const ReceivingInspection = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Receiving & QC Inspection | Los Angeles 3PL Prep Center",
    "Professional receiving and inspection at our LA prep center. 3PL services with photo documentation, damage detection, and same-day inventory updates.",
    "/receiving-inspection"
  );

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Receiving & Inspection Services",
    "description": "Quality control and receiving inspection with photo documentation",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    }
  };

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What's included in receiving service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Full receiving includes shipment verification, unit counting, condition inspection, photography, and immediate inventory updates."
        }
      },
      {
        "@type": "Question",
        "name": "How fast are shipments processed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most shipments are processed within 4 hours of arrival. Same-day inventory updates are standard for all receiving."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide photos of all items?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we photograph 100% of received units. Photos are available in your dashboard for 30 days."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if there's a discrepancy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Discrepancies are documented with photos and reported immediately. You'll receive alerts for damaged or missing items."
        }
      },
      {
        "@type": "Question",
        "name": "Can I specify special handling instructions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Custom receiving instructions can be added per SKU or per shipment via your dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "How are damaged items handled?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Damaged items are photographed, quarantined, and you're notified to decide: discard, return to sender, or attempt repair."
        }
      },
      {
        "@type": "Question",
        "name": "Do you inspect all items or just samples?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We inspect 100% of units by default. Sample inspection is available for high-volume, low-risk products at reduced rates."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content="3pl los angeles, receiving inspection, prep center, quality control, qc inspection, amazon fba prep" />
        <link rel="canonical" href={meta.canonical} />
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqSchemaData} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Receiving & Inspection", path: "/receiving-inspection" }]} />
        <ReceivingHero />
        <ReceivingProcess />
        <ReceivingChecklist />
        <ReceivingMetrics />
        <ReceivingDocumentation />
        <ReceivingFAQ />
        <ReceivingCTA />
        <Footer />
      </div>
    </>
  );
};

export default ReceivingInspection;
