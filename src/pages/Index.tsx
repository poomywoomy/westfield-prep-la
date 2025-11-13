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
const WhyChooseUs = lazy(() => import("@/components/WhyChooseUs"));
const LocationShowcase = lazy(() => import("@/components/LocationShowcase"));
const Services = lazy(() => import("@/components/Services"));
const Reviews = lazy(() => import("@/components/Reviews"));
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
        <title>Los Angeles 3PL | Multi-Channel Fulfillment for Shopify, Amazon & TikTok</title>
        <meta name="description" content="Professional Los Angeles 3PL offering same-day shipping, B2B fulfillment, and storage for Shopify, Amazon FBA, TikTok Shop, and all sales channels. Fast turnaround nationwide." />
        <link rel="canonical" href="https://westfieldprepcenter.com/" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Los Angeles, California" />
        <meta name="geo.position" content="34.0522;-118.2437" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Los Angeles 3PL | Multi-Channel Fulfillment for Shopify, Amazon & TikTok" />
        <meta property="og:description" content="Professional Los Angeles 3PL offering same-day shipping, B2B fulfillment, and storage for Shopify, Amazon FBA, TikTok Shop, and all sales channels. Fast turnaround nationwide." />
        <meta property="og:url" content="https://westfieldprepcenter.com/" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Los Angeles 3PL | Multi-Channel Fulfillment for Shopify, Amazon & TikTok" />
        <meta name="twitter:description" content="Professional Los Angeles 3PL offering same-day shipping, B2B fulfillment, and storage for Shopify, Amazon FBA, TikTok Shop, and all sales channels." />
        <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="faq" data={faqData} />
      <div className="min-h-screen">
        <Header />
        <Hero />
        
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <WhyChooseUs />
        </Suspense>
        
        {/* Location-Specific Content Section */}
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <LocationShowcase />
        </Suspense>
        
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <Services />
        </Suspense>
        
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-96 w-full" /></div>}>
          <Reviews />
        </Suspense>
      
        {/* Pricing CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Scale Your Fulfillment?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get a custom quote tailored to your business needs
            </p>
            <Button size="lg" onClick={() => navigate("/contact")}>
              Get Your Free Quote
            </Button>
          </div>
        </section>
      
        <Suspense fallback={<div className="container py-16"><Skeleton className="h-64 w-full" /></div>}>
          <Compliance />
        </Suspense>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
