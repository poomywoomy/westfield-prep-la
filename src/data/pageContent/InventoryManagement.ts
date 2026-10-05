// Page content data shared between the page component and its route fact sheet.

export const serviceData = {
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

export const faqData = {
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
        "text": "No hard minimum SKU requirement, but our platform is built for scaling catalogs. Whether you have 50 SKUs or 10,000, our system handles it — and our sweet spot is brands doing 1,000+ orders per month."
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
