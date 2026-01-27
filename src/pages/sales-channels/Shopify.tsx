import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import ShopifyChannelHero from "@/components/shopify-channel/ShopifyChannelHero";
import ShopifyChannelValueGrid from "@/components/shopify-channel/ShopifyChannelValueGrid";
import ShopifyChannelIntegration from "@/components/shopify-channel/ShopifyChannelIntegration";
import ShopifyChannelServices from "@/components/shopify-channel/ShopifyChannelServices";
import ShopifyChannelMetrics from "@/components/shopify-channel/ShopifyChannelMetrics";
import ShopifyChannelTimeline from "@/components/shopify-channel/ShopifyChannelTimeline";
import ShopifyChannelCaseStudy from "@/components/shopify-channel/ShopifyChannelCaseStudy";
import ShopifyChannelFAQ from "@/components/shopify-channel/ShopifyChannelFAQ";
import ShopifyChannelCTA from "@/components/shopify-channel/ShopifyChannelCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const faqData = [
  {
    question: "How quickly can I get started with Shopify fulfillment?",
    answer: "Most Shopify stores are fully operational within 48 hours of connecting.",
  },
  {
    question: "What happens when I get a sudden surge in orders?",
    answer: "We're built for scale. We've processed 10x normal volume during Black Friday without delays.",
  },
  {
    question: "Can you match my current branded packaging?",
    answer: "Absolutely. We work with custom mailer boxes, branded tissue paper, thank-you cards, and gift wrapping.",
  },
  {
    question: "How does inventory sync work?",
    answer: "Our integration syncs in real-time. When we receive inventory, your Shopify stock updates automatically.",
  },
  {
    question: "What are your shipping carrier options?",
    answer: "We offer discounted rates across USPS, UPS, FedEx, and regional carriers with automatic selection.",
  },
  {
    question: "How do you handle returns?",
    answer: "Full returns processing including receiving, inspection, photography, and automatic restocking.",
  },
  {
    question: "Is there a minimum order volume?",
    answer: "No minimums and no long-term contracts. We work with brands doing 50 to 50,000+ orders monthly.",
  },
];

const Shopify = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shopify Fulfillment Center with Expert Order Management</title>
        <meta
          name="description"
          content="Westfield Prep Center is a Los Angeles fulfillment center offering Shopify
Amazon fulfillment, FBA prep, storage, &amp; fast ecommerce shipping. Get started today."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels/shopify" />
        <meta property="og:title" content="Shopify Fulfillment Services | Westfield Prep Center" />
        <meta
          property="og:description"
          content="Professional Shopify 3PL fulfillment with real-time sync, branded packaging, and same-day shipping from Los Angeles."
        />
        <meta property="og:url" content="https://westfieldprepcenter.com/sales-channels/shopify" />
      </Helmet>

      <StructuredData
        type="service"
        data={{
          name: "Shopify Fulfillment Services",
          description:
            "Professional Shopify order fulfillment with real-time inventory sync, branded packaging, and same-day shipping from Los Angeles.",
        }}
      />
      <StructuredData type="faq" data={faqData} />

      <Header />
      <Breadcrumbs
        items={[
          { label: "Sales Channels", path: "/sales-channels" },
          { label: "Shopify", path: "/sales-channels/shopify" },
        ]}
      />

      <main>
        <ShopifyChannelHero />
        <ShopifyChannelValueGrid />
        <ShopifyChannelIntegration />
        <ShopifyChannelServices />
        <ShopifyChannelMetrics />
        <ShopifyChannelTimeline />
        <ShopifyChannelCaseStudy />
        <ShopifyChannelFAQ />
        <ShopifyChannelCTA />
      </main>

      <Footer />
      <StickyMobileCTA />
    </>
  );
};

export default Shopify;
