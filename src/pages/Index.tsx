import { useEffect, useMemo, lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PremiumHero from "@/components/PremiumHero";
import { Button } from "@/components/ui/button";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load below-the-fold components
const PlatformCompatibility = lazy(() => import("@/components/PlatformCompatibility"));
const ValueProposition = lazy(() => import("@/components/ValueProposition"));
const Services = lazy(() => import("@/components/Services"));
const HowItWorksProcess = lazy(() => import("@/components/HowItWorksProcess"));
const Reviews = lazy(() => import("@/components/Reviews"));
const LocationShowcase = lazy(() => import("@/components/LocationShowcase"));
const LeadMagnet = lazy(() => import("@/components/LeadMagnet"));
const FAQAccordion = lazy(() => import("@/components/FAQAccordion"));
const FinalCTA = lazy(() => import("@/components/FinalCTA"));
const Compliance = lazy(() => import("@/components/Compliance"));
const StatsStrip = lazy(() => import("@/components/StatsStrip"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const StickyMobileCTA = lazy(() => import("@/components/StickyMobileCTA"));

const Index = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Redirect logged-in users to their dashboard
    if (!loading && user && role) {
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'client') {
        navigate('/client/dashboard', { replace: true });
      }
    }
  }, [user, role, loading, navigate]);

  // Memoize FAQ data to prevent regeneration
  const faqData = useMemo(() => ({
    questions: [
      {
        question: "Do you offer Shopify fulfillment services?",
        answer: "Yes! We specialize in Shopify fulfillment with custom branding, same-day processing, and direct integration. Whether you're selling on Shopify, Amazon FBA, TikTok Shop, or other channels, we handle everything from receiving to shipping with full photo documentation."
      },
      {
        question: "What areas do you serve?",
        answer: "We're based in Los Angeles and provide fulfillment services to e-commerce businesses in all 50 states. We handle shipments to Amazon FBA warehouses, direct-to-consumer Shopify orders, TikTok Shop fulfillment, and multi-channel distribution nationwide."
      },
      {
        question: "Do you offer same-day processing?",
        answer: "Yes! Orders received before 2 PM PST ship the same day. We pride ourselves on fast turnaround times to keep your customers happy and your inventory moving."
      }
    ]
  }), []);

  return (
    <>
      <Helmet>
        <title>3PL Los Angeles • Shopify Fulfillment Partner • Westfield Prep</title>
        <meta name="description" content="Fast, reliable 3PL in Los Angeles specializing in Shopify fulfillment, same-day receiving, 24-48h turnaround, no minimums, and transparent pricing. Perfect for D2C & scaling ecommerce brands." />
        <link rel="canonical" href="https://westfieldprepcenter.com/" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Duarte, California" />
        <meta name="geo.position" content="34.2147;-117.9773" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://westfieldprepcenter.com/" />
        <meta property="og:site_name" content="Westfield Prep Center" />
        <meta property="og:title" content="Los Angeles 3PL & Shopify Fulfillment Partner" />
        <meta property="og:description" content="Trusted LA 3PL for D2C brands. Same-day receiving, fast turnaround, and transparent pricing." />
        <meta property="og:image" content="https://westfieldprepcenter.com/landing/warehouse-exterior.jpg" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@westfieldprep" />
        <meta name="twitter:creator" content="@westfieldprep" />
        <meta name="twitter:title" content="LA 3PL for Shopify & D2C Brands" />
        <meta name="twitter:description" content="Fast Shopify fulfillment in Los Angeles. Same-day receiving, 24-48h turnaround, no minimums." />
        <meta name="twitter:image" content="https://westfieldprepcenter.com/landing/warehouse-exterior.jpg" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="faq" data={faqData} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Westfield Prep Center",
          "image": "https://westfieldprepcenter.com/landing/warehouse-exterior.jpg",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "1801 Flower Ave Office 2",
            "addressLocality": "Duarte",
            "addressRegion": "CA",
            "postalCode": "91010",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "34.2147",
            "longitude": "-117.9773"
          },
          "url": "https://westfieldprepcenter.com",
          "telephone": "+1-818-935-5478",
          "priceRange": "$$",
          "openingHours": "Mo-Su 08:00-17:00",
          "sameAs": [
            "https://www.instagram.com/westfieldprepcenter",
            "https://www.linkedin.com/company/westfield-prep-center"
          ],
          "areaServed": "Los Angeles",
          "description": "Los Angeles 3PL specializing in Shopify fulfillment, ecommerce logistics, same-day receiving, and 24-48h turnaround."
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LogisticsService",
          "name": "Westfield Prep Center 3PL Services",
          "provider": {
            "@type": "Organization",
            "name": "Westfield Prep Center"
          },
          "areaServed": {
            "@type": "City",
            "name": "Los Angeles"
          },
          "serviceType": [
            "3PL Services",
            "Order Fulfillment",
            "Shopify Fulfillment",
            "Amazon FBA Prep",
            "Inventory Management",
            "E-commerce Logistics"
          ]
        })}
      </script>
      <div className="min-h-screen">
      <Header />
      <div className="pt-32">
        <PremiumHero />
        
        {/* Stats Strip - NEW */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-64 w-full" /></div>}>
          <StatsStrip />
        </Suspense>
        
        {/* Phase 3: Value Proposition */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <ValueProposition />
        </Suspense>
        
        {/* Phase 4: Services Overview */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <Services />
        </Suspense>
        
        {/* Phase 5: How It Works */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <HowItWorksProcess />
        </Suspense>
        
        {/* Phase 6: Platform Compatibility */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <PlatformCompatibility />
        </Suspense>
        
        {/* Phase 7: Testimonials */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <Reviews />
        </Suspense>
        
        {/* Phase 8: LA Location */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <LocationShowcase />
        </Suspense>
        
        {/* Blog Preview - NEW */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <BlogPreview />
        </Suspense>
        
        {/* Phase 9: Lead Magnet */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <LeadMagnet />
        </Suspense>
        
        {/* Phase 10: FAQ */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <FAQAccordion />
        </Suspense>
        
        {/* Phase 11: Final CTA */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <FinalCTA />
        </Suspense>
        
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-64 w-full" /></div>}>
          <Compliance />
        </Suspense>
        
        {/* Sticky Mobile CTA - NEW */}
        <Suspense fallback={null}>
          <StickyMobileCTA />
        </Suspense>
      </div>
      </div>
        
      <Footer />
    </>
  );
};

export default Index;
