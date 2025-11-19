import { useEffect, useMemo, lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
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
        <title>Los Angeles's Premier E-Commerce Fulfillment & 3PL Partner | Westfield Prep Center</title>
        <meta name="description" content="Professional 3PL services in Los Angeles. Same-day receiving, 24-48hr turnaround, transparent pricing, and no minimums. Trusted by 100+ brands with 2M+ orders fulfilled." />
        <link rel="canonical" href="https://westfieldprepcenter.com/" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Los Angeles, California" />
        <meta name="geo.position" content="34.0522;-118.2437" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Los Angeles's Premier E-Commerce Fulfillment & 3PL Partner" />
        <meta property="og:description" content="Professional 3PL services in Los Angeles. Same-day receiving, 24-48hr turnaround, transparent pricing, and no minimums. Trusted by 100+ brands with 2M+ orders fulfilled." />
        <meta property="og:url" content="https://westfieldprepcenter.com/" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Los Angeles 3PL and Shopify Fulfillment Center" />
        <meta name="twitter:description" content="LA's leading Shopify 3PL for fast e-commerce fulfillment. Same-day receiving, expert order processing, and no minimums. Get your free fulfillment audit." />
        <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="faq" data={faqData} />
      <div className="min-h-screen">
      <Header />
      <div className="pt-32">
        <Hero />
        
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
      </div>
      </div>
        
      <Footer />
    </>
  );
};

export default Index;
