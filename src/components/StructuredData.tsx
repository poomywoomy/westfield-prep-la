import { Helmet } from "react-helmet";

interface StructuredDataProps {
  type: "organization" | "service" | "faq" | "reviews" | "breadcrumb" | "website" | "localBusinessWithService" | "contact" | "collectionPage" | "itemList" | "localBusiness";
  data?: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const getSchema = () => {
    const baseUrl = "https://westfieldprepcenter.com";
    
    if (type === "contact") {
      return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Westfield Prep Center",
        description: "Contact Westfield Prep Center for Shopify fulfillment, Amazon FBA prep, and e-commerce logistics services in Los Angeles.",
        mainEntity: {
          "@type": "Organization",
          name: "Westfield Prep Center",
          telephone: "+1-818-935-5478",
          email: "info@westfieldprepcenter.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "6320 Canoga Ave, Suite 1500",
            addressLocality: "Woodland Hills",
            addressRegion: "CA",
            postalCode: "91367",
            addressCountry: "US"
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "08:00",
            closes: "17:00"
          }
        }
      };
    }
    
    if (type === "organization") {
      return {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Warehouse", "Service"],
        "@id": `${baseUrl}/#organization`,
        name: "Westfield Prep Center",
        legalName: "Sathatham LLC",
        alternateName: "Westfield Prep",
        description: "Professional Los Angeles Shopify prep center specializing in DTC fulfillment, custom branding, Amazon FBA prep, and multi-channel order processing. Serving e-commerce businesses nationwide.",
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
          latitude: "34.0522",
          longitude: "-118.2437"
        },
        hasMap: "https://www.google.com/maps/place/1801+Flower+Ave,+Duarte,+CA+91010",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "08:00",
            closes: "17:00",
            timeZone: "America/Los_Angeles"
          }
        ],
        areaServed: [
          {
            "@type": "State",
            name: "California",
            containedIn: "United States"
          },
          {
            "@type": "AdministrativeArea",
            name: "Los Angeles County",
            containedIn: "California"
          },
          {
            "@type": "AdministrativeArea",
            name: "Orange County",
            containedIn: "California"
          },
          {
            "@type": "AdministrativeArea",
            name: "San Diego County",
            containedIn: "California"
          },
          {
            "@type": "AdministrativeArea",
            name: "San Francisco Bay Area",
            containedIn: "California"
          },
          {
            "@type": "AdministrativeArea",
            name: "Sacramento County",
            containedIn: "California"
          },
          {
            "@type": "Country",
            name: "United States"
          }
        ],
        sameAs: [
          "https://www.linkedin.com/company/westfield-prep-center/?viewAsMember=true",
          "https://www.instagram.com/westfieldprepcenter/",
          "https://x.com/Westfield3PL"
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
            name: "California"
          },
          {
            "@type": "Place",
            name: "United States"
          }
        ],
        offers: {
          "@type": "AggregateOffer",
          price: "Custom",
          priceCurrency: "USD",
          description: "Custom pricing based on your business needs and volume"
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
      const faqArray = Array.isArray(data) ? data : data.questions || [];
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqArray.map((faq: { question: string; answer: string }) => ({
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

    // CollectionPage schema for blog listing
    if (type === "collectionPage" && data) {
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Westfield Prep Center Blog",
        description: "Expert insights on Amazon FBA prep, Shopify fulfillment, and e-commerce logistics from our Los Angeles fulfillment center.",
        url: `${baseUrl}/blog`,
        publisher: {
          "@type": "Organization",
          name: "Westfield Prep Center",
          logo: `${baseUrl}/westfield-logo.png`
        },
        mainEntity: {
          "@type": "Blog",
          name: "Westfield Prep Center Blog",
          blogPost: data.posts?.map((post: any) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: `${baseUrl}/blog/${post.slug}`,
            datePublished: post.published_at,
            image: post.cover_image_url ? `${baseUrl}${post.cover_image_url}` : `${baseUrl}/hero-warehouse-optimized.webp`,
            author: {
              "@type": "Person",
              name: post.author_name || "Westfield Prep Team"
            }
          }))
        }
      };
    }

    // ItemList schema for sales channels directory
    if (type === "itemList" && data) {
      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Supported E-commerce Platforms",
        description: "Multi-channel fulfillment support for major e-commerce platforms and marketplaces.",
        numberOfItems: data.platforms?.length || 0,
        itemListElement: data.platforms?.map((platform: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: platform.name,
            description: platform.description || `${platform.name} fulfillment services`,
            url: platform.path ? `${baseUrl}${platform.path}` : baseUrl,
            provider: {
              "@type": "Organization",
              name: "Westfield Prep Center"
            }
          }
        }))
      };
    }

    // LocalBusiness schema (global)
    if (type === "localBusiness") {
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Westfield Prep Center",
        "image": `${baseUrl}/images/warehouse-exterior.jpg`,
        "description": "Westfield Prep Center is a Shopify-native 3PL in Los Angeles providing same-day receiving, real-time syncing, and 24 to 48 hour fulfillment for DTC and Shopify brands.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1801 Flower Ave Office 2",
          "addressLocality": "Duarte",
          "addressRegion": "CA",
          "postalCode": "91010",
          "addressCountry": "US"
        },
        "url": baseUrl,
        "telephone": "+1-818-935-5478",
        "openingHours": "Mo-Fr 08:00-17:00",
        "priceRange": "$$",
        "areaServed": ["United States"],
        "sameAs": [
          "https://www.linkedin.com/company/westfield-prep-center/?viewAsMember=true",
          "https://www.instagram.com/westfieldprepcenter/",
          "https://x.com/Westfield3PL"
        ]
      };
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
