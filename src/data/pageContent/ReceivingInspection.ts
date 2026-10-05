// Page content data shared between the page component and its route fact sheet.

export const serviceData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Receiving & Inspection Services",
  "description": "Quality control and receiving inspection with photo documentation",
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
    }
  ]
};
