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
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Westfield Prep Center",
        legalName: "Sathatham LLC",
        alternateName: "Westfield Prep",
        url: baseUrl,
        logo: `${baseUrl}/westfield-logo.png`,
        description: "Leading Los Angeles prep center for Amazon FBA, Shopify fulfillment, and e-commerce services. Same-day turnaround, photo-proof QC, and branded packaging.",
        telephone: "+18189355478",
        email: "info@westfieldprepcenter.com",
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
        priceRange: "$$",
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            addressLocality: "Los Angeles",
            addressRegion: "CA",
            addressCountry: "US"
          }
        },
        serviceArea: [
          {
            "@type": "Place",
            name: "Los Angeles, California"
          },
          {
            "@type": "Place",
            name: "Southern California"
          },
          {
            "@type": "Place",
            name: "United States"
          }
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-818-935-5478",
          contactType: "Customer Service",
          areaServed: "US",
          availableLanguage: "English",
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "09:00",
            closes: "20:00"
          }
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "4",
          bestRating: "5",
          worstRating: "1"
        }
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
            name: "Southern California"
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
        mainEntity: data.map((faq: { question: string; answer: string }) => ({
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
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/#localbusiness`,
        name: "Westfield Prep Center",
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
            reviewRating: { "@type": "Rating", ratingValue: "5" },
            reviewBody: "Excellent service and very professional. They handle our inventory with care and always meet our deadlines."
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Nima Baniasadi" },
            datePublished: "2024-11-15",
            reviewRating: { "@type": "Rating", ratingValue: "5" },
            reviewBody: "Great communication and fast turnaround. Highly recommend for anyone looking for reliable fulfillment services."
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Amir Kohan Far" },
            datePublished: "2024-10-20",
            reviewRating: { "@type": "Rating", ratingValue: "5" },
            reviewBody: "They've been handling our e-commerce fulfillment for months now and we couldn't be happier. Photo proof of every shipment is a game changer."
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Joshua Meier" },
            datePublished: "2024-09-05",
            reviewRating: { "@type": "Rating", ratingValue: "5" },
            reviewBody: "Professional team that really cares about getting things right. Our Amazon FBA prep has never been smoother."
          }
        ]
      };
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
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/#localbusiness-service`,
        name: "Westfield Prep Center",
        description: "Los Angeles prep center providing nationwide Amazon FBA prep and Shopify fulfillment services to all 50 states",
        url: baseUrl,
        telephone: "+18189355478",
        email: "info@westfieldprepcenter.com",
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
        areaServed: [
          { "@type": "Country", name: "United States" },
          { "@type": "State", name: "California" },
          { "@type": "State", name: "New York" },
          { "@type": "State", name: "Texas" },
          { "@type": "State", name: "Florida" },
          { "@type": "State", name: "Illinois" },
          { "@type": "State", name: "Pennsylvania" },
          { "@type": "State", name: "Ohio" },
          { "@type": "State", name: "Georgia" },
          { "@type": "State", name: "North Carolina" },
          { "@type": "State", name: "Michigan" }
        ],
        makesOffer: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Amazon FBA Prep Services",
              description: "Professional Amazon FBA preparation including inspection, labeling, poly-bagging, and shipping to Amazon fulfillment centers",
              provider: {
                "@type": "LocalBusiness",
                name: "Westfield Prep Center"
              },
              areaServed: { "@type": "Country", name: "United States" }
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Shopify Fulfillment Services",
              description: "Complete Shopify order fulfillment with same-day processing, photo-proof QC, and branded packaging",
              provider: {
                "@type": "LocalBusiness",
                name: "Westfield Prep Center"
              },
              areaServed: { "@type": "Country", name: "United States" }
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Nationwide E-commerce Fulfillment",
              description: "Full-service e-commerce fulfillment with 2-day shipping to major US markets from our Los Angeles location",
              provider: {
                "@type": "LocalBusiness",
                name: "Westfield Prep Center"
              },
              areaServed: { "@type": "Country", name: "United States" }
            }
          }
        ]
      };
    }

    return {};
  };

  const schema = getSchema();

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
