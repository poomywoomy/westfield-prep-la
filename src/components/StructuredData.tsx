import { Helmet } from "react-helmet";

interface StructuredDataProps {
  type: "organization" | "service" | "faq" | "reviews" | "breadcrumb" | "website" | "localBusinessWithService";
  data?: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const getSchema = () => {
    const baseUrl = "https://westfieldprepcenter.com";
    
    if (type === "organization") {
      return {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Warehouse", "Service"],
        "@id": `${baseUrl}/#organization`,
        name: "Westfield Prep Center",
        legalName: "Sathatham LLC",
        alternateName: "Westfield Prep",
        description: "Professional e-commerce fulfillment center in Duarte specializing in Amazon FBA prep, Shopify fulfillment, and multi-channel order processing. Serving Los Angeles County and all 50 states.",
        additionalType: "https://www.productontology.org/id/Fulfillment_center",
        url: baseUrl,
        logo: `${baseUrl}/westfield-logo.png`,
        image: `${baseUrl}/westfield-logo.png`,
        telephone: "+18189355478",
        email: "info@westfieldprepcenter.com",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1801 Flower Ave Office 2",
          addressLocality: "Duarte",
          addressRegion: "CA",
          postalCode: "91010",
          addressCountry: "US"
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "34.1395",
          longitude: "-117.9773"
        },
        hasMap: "https://www.google.com/maps/place/1801+Flower+Ave,+Duarte,+CA+91010",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "09:00",
            closes: "20:00",
            timeZone: "America/Los_Angeles"
          }
        ],
        areaServed: [
          {
            "@type": "City",
            name: "Duarte",
            containedIn: "Los Angeles County, California"
          },
          {
            "@type": "City",
            name: "Los Angeles"
          },
          {
            "@type": "State",
            name: "California"
          },
          {
            "@type": "State",
            name: "New York"
          },
          {
            "@type": "State",
            name: "Texas"
          },
          {
            "@type": "State",
            name: "Florida"
          },
          {
            "@type": "Country",
            name: "United States"
          }
        ],
        sameAs: [
          "https://www.facebook.com/westfieldprepcenter",
          "https://www.linkedin.com/company/westfield-prep-center",
          "https://g.page/westfield-prep-center"
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "E-commerce Fulfillment Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Amazon FBA Prep Services",
                description: "Professional Amazon FBA preparation including labeling, poly-bagging, bubble wrapping, inspection, and shipping to Amazon fulfillment centers"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Shopify Fulfillment",
                description: "Complete Shopify order fulfillment with same-day processing, photo-proof QC, and inventory management"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Multi-Channel Fulfillment",
                description: "Order processing for multiple sales channels including TikTok Shop, Amazon, and direct-to-consumer"
              }
            }
          ]
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "4",
          bestRating: "5",
          worstRating: "1"
        },
        review: [
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Drew" },
            datePublished: "2024-12-01",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            reviewBody: "Excellent service and very professional. They handle our inventory with care and always meet our deadlines."
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Nima Baniasadi" },
            datePublished: "2024-11-15",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            reviewBody: "Great communication and fast turnaround. Highly recommend for anyone looking for reliable fulfillment services."
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Amir Kohan Far" },
            datePublished: "2024-10-20",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            reviewBody: "They've been handling our e-commerce fulfillment for months now and we couldn't be happier. Photo proof of every shipment is a game changer."
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Joshua Meier" },
            datePublished: "2024-09-05",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            reviewBody: "Professional team that really cares about getting things right. Our Amazon FBA prep has never been smoother."
          }
        ]
      };
    }

    if (type === "service" && data) {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: data.serviceType,
        name: data.name,
        description: data.description,
        category: "Prep Center Services",
        provider: {
          "@type": "Organization",
          name: "Westfield Prep Center",
          telephone: "+18189355478"
        },
        areaServed: [
          {
            "@type": "Place",
            name: "Los Angeles County, CA"
          },
          {
            "@type": "Place",
            name: "Duarte, CA"
          },
          {
            "@type": "Place",
            name: "Los Angeles County, CA"
          }
        ],
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          description: "Custom pricing based on volume and services"
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: data.name,
          itemListElement: data.features?.map((feature: string, index: number) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: feature
            }
          }))
        }
      };
    }

    if (type === "faq" && data) {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.questions?.map((faq: { question: string; answer: string }) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      };
    }

    if (type === "reviews") {
      // Reviews are now consolidated into the organization schema
      return null;
    }

    // Breadcrumb schema
    if (type === "breadcrumb" && data) {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.items?.map((item: { label: string; path: string }, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: `${baseUrl}${item.path}`
        }))
      };
    }

    // Website schema with search action
    if (type === "website") {
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: "Westfield Prep Center",
        url: baseUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/blog?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
    }

    // LocalBusiness with Service schema for nationwide coverage
    if (type === "localBusinessWithService") {
      // This is now consolidated into the organization schema
      return null;
    }

    return {};
  };

  const schema = getSchema();
  
  // Don't render if schema is null (consolidated types)
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
