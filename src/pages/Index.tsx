import { Fragment,  useEffect, lazy, Suspense } from "react";
import { Helmet } from "@/lib/helmet-compat";
import { useNavigate } from "@/lib/router-compat";
import Header from "@/components/Header";
import PremiumHero from "@/components/PremiumHero";
import { Button } from "@/components/ui/button";
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
const BuiltForScale = lazy(() => import("@/components/BuiltForScale"));

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


  return (
    <Fragment>
      <Helmet>
<link rel="preload" as="image" href="/hero-warehouse-optimized.webp" />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <div className="pt-20">
          <PremiumHero />

          {/* Stats Strip */}
          <Suspense fallback={<div className="min-h-[280px]" aria-hidden="true" />}>
            <StatsStrip />
          </Suspense>

          {/* Built for Scale */}
          <Suspense fallback={<div className="min-h-[500px]" aria-hidden="true" />}>
            <BuiltForScale />
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
    </Fragment>
  );
};

export default Index;
