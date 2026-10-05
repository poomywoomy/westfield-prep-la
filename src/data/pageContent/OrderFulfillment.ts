// Page content data shared between the page component and its route fact sheet.

export const serviceData = {
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

export const faqData = {
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
