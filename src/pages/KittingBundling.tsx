import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import KittingHero from "@/components/kitting/KittingHero";
import KittingContent from "@/components/kitting/KittingContent";
import KittingCTA from "@/components/kitting/KittingCTA";

const KittingBundling = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceData = {
    serviceType: "Service",
    name: "Kitting & Bundling Services - Los Angeles 3PL Prep Center",
    description: "Custom kitting and bundling at our LA 3PL prep center. Multi-SKU kits, gift sets, and promotional bundles with photo-proof QC.",
    features: ["Multi-SKU Kits", "Gift Sets", "Promotional Bundles", "Photo-Proof QC", "3PL Services"]
  };

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of kitting services do you offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer multi-SKU kits, gift sets, promotional bundles, subscription box assembly, influencer PR boxes, and custom branded packaging."
        }
      },
      {
        "@type": "Question",
        "name": "How long does kit assembly take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard kit assembly takes 1-3 business days depending on complexity and volume. Rush assembly is available for urgent needs."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide photos of completed kits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every kit is photographed during QC to ensure accuracy. Photos are available in your dashboard for verification."
        }
      },
      {
        "@type": "Question",
        "name": "Can I provide custom packaging materials?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Send us your branded boxes, tissue paper, inserts, and we'll assemble kits to your exact specifications."
        }
      },
      {
        "@type": "Question",
        "name": "What's the minimum order for kitting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No minimum order required. We handle everything from 10-kit test runs to 10,000+ unit production runs."
        }
      },
      {
        "@type": "Question",
        "name": "How do you handle kit component shortages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We alert you immediately when any component runs low. You can set reorder thresholds per SKU in your dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "Can you store kit components separately?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Components are stored individually and only assembled when you trigger a kitting order or when inventory thresholds are met."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Educational Kitting &amp; Bundling Services in Los Angeles CA</title>
        <meta name="description" content="Get the best educational kitting and bundling services in Los Angeles, CA. Accurate assembly, careful packaging, and reliable fulfillment. Contact us today." />
        <meta name="keywords" content="3pl los angeles, kitting services, bundling, prep center, subscription box assembly, product kitting" />
        <link rel="canonical" href="https://westfieldprepcenter.com/kitting-bundling" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqSchemaData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Kitting & Bundling", path: "/kitting-bundling" }]} />
        <KittingHero />
        <KittingContent />
        <KittingCTA />
        <Footer />
      </div>
    </>
  );
};

export default KittingBundling;
