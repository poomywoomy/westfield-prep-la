import { useEffect, useMemo, lazy, Suspense } from "react";
import { Helmet } from "@/lib/helmet-compat";
import { useNavigate } from "@/lib/router-compat";
import Header from "@/components/Header";
import PremiumHero from "@/components/PremiumHero";
import { Button } from "@/components/ui/button";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
// Lazy load below-the-fold components
// Lazy load below-the-fold components
const PlatformCompatibility = lazy(() => import("@/components/PlatformCompatibility"));
const ValueProposition = lazy(() => import("@/components/ValueProposition"));
const Services = lazy(() => import("@/components/Services"));
const HowItWorksProcess = lazy(() => import("@/components/HowItWorksProcess"));
const Reviews = lazy(() => import("@/components/Reviews"));
const LocationShowcase = lazy(() => import("@/components/LocationShowcase"));
const UseCaseSection = lazy(() => import("@/components/UseCaseSection"));

const FAQAccordion = lazy(() => import("@/components/FAQAccordion"));
const FinalCTA = lazy(() => import("@/components/FinalCTA"));
const Compliance = lazy(() => import("@/components/Compliance"));
const StatsStrip = lazy(() => import("@/components/StatsStrip"));

const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const LaunchpadCallout = lazy(() => import("@/components/LaunchpadCallout"));
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
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "client") {
        navigate("/client/dashboard", { replace: true });
      }
    }
  }, [user, role, loading, navigate]);

  // Memoize FAQ data to prevent regeneration - SAB-compliant questions
  const faqData = useMemo(
    () => ({
      questions: [
        {
          question: "Do you operate as a Los Angeles 3PL?",
          answer:
            "Yes, Westfield Prep Center is a service-area-based 3PL operating from Los Angeles, California. We serve e-commerce businesses nationwide, handling their inventory, fulfillment, and prep services from our LA facility. Our strategic location near major ports provides shipping advantages for West Coast distribution.",
        },
        {
          question: "Do clients visit your warehouse?",
          answer:
            "Our facility is not open for public visits. As a service-area business, we handle all client inventory remotely. Clients manage their accounts through our secure online portal and communicate with their dedicated account manager for any needs.",
        },
        {
          question: "What areas do you serve from Los Angeles?",
          answer:
            "While strategically located in Los Angeles for port proximity and West Coast shipping advantages, we serve e-commerce businesses across all 50 states. Clients ship their inventory to us, and we handle fulfillment to their customers nationwide.",
        },
        {
          question: "Do you offer Amazon FBA prep in Los Angeles?",
          answer:
            "Yes! We provide complete Amazon FBA prep services including labeling, poly-bagging, bubble wrapping, inspection, and shipping to Amazon fulfillment centers. Our LA location offers fast transit times to West Coast Amazon warehouses.",
        },
        {
          question: "Do you support Shopify fulfillment?",
          answer:
            "Absolutely! We specialize in Shopify fulfillment with native integration, same-day processing, custom branding options, and full photo documentation. Orders sync automatically and ship with real-time tracking updates.",
        },
      ],
    }),
    [],
  );

  return (
    <>
      <Helmet>
<link rel="preload" as="image" href="/hero-warehouse-optimized.webp" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="localBusiness" />
      <StructuredData type="faq" data={faqData} />
      <div className="min-h-screen">
        <Header />
        <div className="pt-20">
          <PremiumHero />

          {/* Stats Strip */}
          <Suspense fallback={<div className="min-h-[280px]" aria-hidden="true" />}>
            <StatsStrip />
          </Suspense>

          {/* Use Case Section - NEW CRO Component */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <UseCaseSection />
          </Suspense>

          {/* Phase 3: Value Proposition */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <ValueProposition />
          </Suspense>

          {/* Phase 4: Services Overview */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <Services />
          </Suspense>

          {/* Phase 5: How It Works */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <HowItWorksProcess />
          </Suspense>

          {/* Phase 6: Platform Compatibility */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <PlatformCompatibility />
          </Suspense>

          {/* Phase 7: Testimonials */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <Reviews />
          </Suspense>

          {/* Phase 8: LA Location */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <LocationShowcase />
          </Suspense>

          {/* Launchpad Callout */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <LaunchpadCallout />
          </Suspense>

          {/* Blog Preview - NEW */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <BlogPreview />
          </Suspense>

          {/* Phase 10: FAQ */}
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <FAQAccordion />
          </Suspense>

          {/* Phase 11: Final CTA */}
          <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
            <FinalCTA />
          </Suspense>

          <Suspense fallback={<div className="min-h-[200px]" aria-hidden="true" />}>
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
