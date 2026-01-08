import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { generateMetaTags } from "@/utils/seo";
import ReturnsHero from "@/components/returns/ReturnsHero";
import ReturnsWorkflow from "@/components/returns/ReturnsWorkflow";
import ReturnsPathways from "@/components/returns/ReturnsPathways";
import ReturnsMetrics from "@/components/returns/ReturnsMetrics";
import ReturnsIntegrations from "@/components/returns/ReturnsIntegrations";
import ReturnsFAQ from "@/components/returns/ReturnsFAQ";
import ReturnsCTA from "@/components/returns/ReturnsCTA";

const ReturnsProcessing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Returns Processing | Los Angeles 3PL & Prep Center Services",
    "Fast returns processing at our LA prep center. 5-hour inspection, restocking, and value recovery. Expert 3PL reverse logistics for Amazon FBA and e-commerce returns.",
    "/returns-processing"
  );

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Returns Processing Services",
    "description": "Professional returns processing and reverse logistics",
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
        "name": "How fast do you process returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most returns are inspected and processed within 5 hours of arrival with immediate photo documentation and reporting."
        }
      },
      {
        "@type": "Question",
        "name": "What information do I get about each return?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You receive QC photos, condition assessment, reason codes, and disposition recommendations for every returned item."
        }
      },
      {
        "@type": "Question",
        "name": "How do you determine resellable vs damaged?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our trained QC team inspects each item against your criteria. Resellable items must pass packaging, functionality, and appearance checks."
        }
      },
      {
        "@type": "Question",
        "name": "Can I set custom inspection criteria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can define custom pass/fail criteria per SKU or product category through your dashboard settings."
        }
      },
      {
        "@type": "Question",
        "name": "Do you integrate with my Shopify store?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we sync with Shopify returns automatically. Return webhooks update inventory in real-time as items are processed."
        }
      },
      {
        "@type": "Question",
        "name": "What happens to damaged items?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Damaged items are moved to a separate location. You choose: discard, return to sender, liquidate, or attempt repair."
        }
      },
      {
        "@type": "Question",
        "name": "How are discrepancies tracked?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Expected vs actual quantities are compared. Any variance triggers an alert with photos and notes for your review."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content="3pl los angeles, prep center, returns processing, reverse logistics, amazon fba returns, ecommerce fulfillment" />
        <link rel="canonical" href={meta.canonical} />
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqSchemaData} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Returns Processing", path: "/returns-processing" }]} />
        <ReturnsHero />
        <ReturnsWorkflow />
        <ReturnsPathways />
        <ReturnsMetrics />
        <ReturnsIntegrations />
        <ReturnsFAQ />
        <ReturnsCTA />
        <Footer />
      </div>
    </>
  );
};

export default ReturnsProcessing;
