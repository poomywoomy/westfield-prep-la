import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { generateMetaTags } from "@/utils/seo";
import InventoryHero from "@/components/inventory/InventoryHero";
import InventoryChallenge from "@/components/inventory/InventoryChallenge";
import InventoryTechnology from "@/components/inventory/InventoryTechnology";
import InventoryFeatures from "@/components/inventory/InventoryFeatures";
import InventorySync from "@/components/inventory/InventorySync";
import InventoryCycleCounts from "@/components/inventory/InventoryCycleCounts";
import InventoryStorage from "@/components/inventory/InventoryStorage";
import InventoryFAQ from "@/components/inventory/InventoryFAQ";
import InventoryCTA from "@/components/inventory/InventoryCTA";

const InventoryManagement = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Inventory Management | Los Angeles 3PL Prep Center Services",
    "Real-time inventory management at our Los Angeles 3PL. Prep center with SKU tracking, low-stock alerts, cycle counts, and multi-channel sync for e-commerce brands.",
    "/inventory-management"
  );

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Inventory Management Services",
    "description": "Real-time inventory tracking and management with advanced analytics and multi-channel sync",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    },
    "areaServed": "Los Angeles, CA"
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How often do you perform cycle counts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We perform daily cycle counts on high-velocity SKUs, weekly counts on medium-velocity items, and monthly counts on slow movers."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see my inventory in real-time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Your client dashboard provides 24/7 real-time visibility into every SKU, location, and transaction."
        }
      },
      {
        "@type": "Question",
        "name": "Do you support multiple warehouse locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, we operate from our Los Angeles facility. Our WMS can track inventory across multiple locations if you have stock elsewhere."
        }
      },
      {
        "@type": "Question",
        "name": "What's your minimum SKU count to work with you?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "There's no minimum SKU requirement. Whether you have 10 SKUs or 10,000, our system handles it the same way."
        }
      },
      {
        "@type": "Question",
        "name": "How do you handle inventory shrinkage or discrepancies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When cycle counts reveal discrepancies, we investigate immediately. Every variance is documented with photos and notes. Our average shrinkage rate is less than 0.1%."
        }
      },
      {
        "@type": "Question",
        "name": "What reports can I access through the dashboard?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You'll have access to inventory levels, transaction history, low stock alerts, aging inventory reports, cycle count variance reports, and demand velocity analytics."
        }
      },
      {
        "@type": "Question",
        "name": "Which platforms does your WMS integrate with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We integrate with Shopify, Amazon Seller Central, TikTok Shop, Walmart Marketplace, eBay, Etsy, WooCommerce, BigCommerce, Magento, and offer a REST API for custom integrations."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content="3pl los angeles, inventory management, prep center, sku tracking, cycle counts, ecommerce inventory, wms, warehouse management" />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:url" content={meta.ogUrl} />
        <meta property="og:image" content={meta.ogImage} />
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Inventory Management", path: "/inventory-management" }]} />
        
        <InventoryHero />
        <InventoryChallenge />
        <InventoryTechnology />
        <InventoryFeatures />
        <InventorySync />
        <InventoryCycleCounts />
        <InventoryStorage />
        <InventoryFAQ />
        <InventoryCTA />

        <Footer />
      </div>
    </>
  );
};

export default InventoryManagement;
