// Page content data shared between the page component and its route fact sheet.

export const serviceData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Returns Processing Services",
  "description": "Professional returns processing and reverse logistics",
  "provider": {
    "@type": "Organization",
    "name": "Westfield Prep Center"
  }
};

export const faqSchemaData = {
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
