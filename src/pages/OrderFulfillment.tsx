import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { generateMetaTags } from "@/utils/seo";
import FulfillmentHero from "@/components/fulfillment/FulfillmentHero";
import FulfillmentWhyOutsource from "@/components/fulfillment/FulfillmentWhyOutsource";
import FulfillmentProcess from "@/components/fulfillment/FulfillmentProcess";
import FulfillmentChannels from "@/components/fulfillment/FulfillmentChannels";
import FulfillmentMetrics from "@/components/fulfillment/FulfillmentMetrics";
import FulfillmentCarriers from "@/components/fulfillment/FulfillmentCarriers";
import FulfillmentReturns from "@/components/fulfillment/FulfillmentReturns";
import FulfillmentFAQ from "@/components/fulfillment/FulfillmentFAQ";
import FulfillmentCTA from "@/components/fulfillment/FulfillmentCTA";

const OrderFulfillment = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Order Fulfillment Services | Los Angeles 3PL & E-commerce Prep Center",
    "Fast order fulfillment from our LA 3PL prep center. Same-day processing, 99.8% accuracy, multi-channel support for Shopify, Amazon, and TikTok Shop.",
    "/order-fulfillment"
  );

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Order Fulfillment Services",
    "description": "Professional order fulfillment with same-day processing and real-time tracking",
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
        "name": "What is your order cutoff time for same-day shipping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Orders received by 2 PM PST ship the same day, Monday through Saturday. Orders after 2 PM ship the next business day."
        }
      },
      {
        "@type": "Question",
        "name": "What e-commerce platforms do you integrate with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We integrate with Shopify, Amazon Seller Central, TikTok Shop, Walmart Marketplace, eBay, Etsy, WooCommerce, BigCommerce, and Magento. We also offer a REST API for custom platforms."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide real-time tracking to customers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Tracking information syncs automatically to your sales platform and triggers customer notification emails."
        }
      },
      {
        "@type": "Question",
        "name": "Can you handle branded or custom packaging?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We can use your branded boxes, tissue paper, stickers, and inserts. Just ship us your materials and we'll store them alongside your inventory."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if there's a shipping error?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We take full responsibility for errors caused by our team. If we ship the wrong item, we'll reship the correct order at no charge and cover return shipping."
        }
      },
      {
        "@type": "Question",
        "name": "Do you have minimum order requirements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We work best with brands shipping at least 100 orders per month, but we're flexible for growing businesses. There's no maximum."
        }
      },
      {
        "@type": "Question",
        "name": "Can you handle rush or expedited orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Rush orders received by 12 PM PST can ship same-day via expedited carriers. Additional fees apply for rush handling."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content="3pl los angeles, order fulfillment, prep center, ecommerce fulfillment, shopify fulfillment, same day shipping, pick and pack" />
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
        <Breadcrumbs items={[{ label: "Order Fulfillment", path: "/order-fulfillment" }]} />
        
        <FulfillmentHero />
        <FulfillmentWhyOutsource />
        <FulfillmentProcess />
        <FulfillmentChannels />
        <FulfillmentMetrics />
        <FulfillmentCarriers />
        <FulfillmentReturns />
        <FulfillmentFAQ />
        <FulfillmentCTA />

        <Footer />
      </div>
    </>
  );
};

export default OrderFulfillment;
