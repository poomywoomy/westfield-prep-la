import { Helmet } from "react-helmet";

interface StructuredDataProps {
  type: "organization" | "service" | "faq" | "reviews";
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
        description: "Shopify, Amazon, and e-commerce fulfillment services in Los Angeles. Same-day turnaround, photo-proof QC, and branded packaging.",
        telephone: "+18189355478",
        email: "info@westfieldprepcenter.com",
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
        provider: {
          "@type": "Organization",
          name: "Westfield Prep Center",
          telephone: "+18189355478"
        },
        areaServed: {
          "@type": "Place",
          name: "Los Angeles, California, United States"
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
