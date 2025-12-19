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

  // Memoize FAQ data to prevent regeneration - SAB-compliant questions
  const faqData = useMemo(() => ({
    questions: [
      {
        question: "Do you operate as a Los Angeles 3PL?",
        answer: "Yes, Westfield Prep Center is a service-area-based 3PL operating from Los Angeles, California. We serve e-commerce businesses nationwide, handling their inventory, fulfillment, and prep services from our LA facility. Our strategic location near major ports provides shipping advantages for West Coast distribution."
      },
      {
        question: "Do clients visit your warehouse?",
        answer: "Our facility is not open for public visits. As a service-area business, we handle all client inventory remotely. Clients manage their accounts through our secure online portal and communicate with their dedicated account manager for any needs."
      },
      {
        question: "What areas do you serve from Los Angeles?",
        answer: "While strategically located in Los Angeles for port proximity and West Coast shipping advantages, we serve e-commerce businesses across all 50 states. Clients ship their inventory to us, and we handle fulfillment to their customers nationwide."
      },
      {
        question: "Do you offer Amazon FBA prep in Los Angeles?",
        answer: "Yes! We provide complete Amazon FBA prep services including labeling, poly-bagging, bubble wrapping, inspection, and shipping to Amazon fulfillment centers. Our LA location offers fast transit times to West Coast Amazon warehouses."
      },
      {
        question: "Do you support Shopify fulfillment?",
        answer: "Absolutely! We specialize in Shopify fulfillment with native integration, same-day processing, custom branding options, and full photo documentation. Orders sync automatically and ship with real-time tracking updates."
      }
    ]
  }), []);

  return (
    <>
      <Helmet>
        <title>Los Angeles 3PL Fulfillment | Shopify Fulfillment Center | Westfield Prep Center</title>
        <meta name="description" content="LA's top-rated 3PL and Shopify fulfillment center offering same-day receiving, transparent pricing, and 2M+ orders fulfilled. Located in Los Angeles, CA." />
        <meta name="keywords" content="3pl los angeles, los angeles 3pl, shopify 3pl, 3pl fulfillment los angeles, ecommerce fulfillment los angeles, 3pl warehouse la, california 3pl, shopify fulfillment center los angeles" />
        <link rel="canonical" href="https://westfieldprepcenter.com/" />
        <link rel="preload" as="image" href="/hero-warehouse-optimized.webp" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.position" content="34.0522;-118.2437" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://westfieldprepcenter.com/" />
        <meta property="og:site_name" content="Westfield Prep Center" />
        <meta property="og:title" content="Los Angeles 3PL Fulfillment | Shopify Fulfillment Center | Westfield Prep Center" />
        <meta property="og:description" content="LA's top-rated 3PL and Shopify fulfillment center offering same-day receiving, transparent pricing, and 2M+ orders fulfilled. Located in Los Angeles, CA." />
        <meta property="og:image" content="https://westfieldprepcenter.com/warehouse-exterior-la.jpg" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@westfieldprep" />
        <meta name="twitter:creator" content="@westfieldprep" />
        <meta name="twitter:title" content="Los Angeles 3PL Fulfillment | Shopify Fulfillment Center | Westfield Prep Center" />
        <meta name="twitter:description" content="LA's top-rated 3PL and Shopify fulfillment center offering same-day receiving, transparent pricing, and 2M+ orders fulfilled." />
        <meta name="twitter:image" content="https://westfieldprepcenter.com/warehouse-exterior-la.jpg" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="faq" data={faqData} />
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
