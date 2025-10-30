import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Compliance from "@/components/Compliance";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import LocationShowcase from "@/components/LocationShowcase";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Los Angeles Shopify Prep Center | DTC Fulfillment & Amazon FBA Services</title>
        <meta name="description" content="Professional Los Angeles Shopify prep center specializing in DTC fulfillment, custom branding, and Amazon FBA prep. Fast 24-48hr turnaround. Serving e-commerce businesses nationwide." />
        <link rel="canonical" href="https://westfieldprepcenter.com/" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Los Angeles, California" />
        <meta name="geo.position" content="34.0522;-118.2437" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Los Angeles Shopify Prep Center | DTC Fulfillment & Amazon FBA Services" />
        <meta property="og:description" content="Professional Los Angeles Shopify prep center specializing in DTC fulfillment, custom branding, and Amazon FBA prep. Fast 24-48hr turnaround. Serving e-commerce businesses nationwide." />
        <meta property="og:url" content="https://westfieldprepcenter.com/" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Los Angeles Shopify Prep Center | DTC Fulfillment & Amazon FBA Services" />
        <meta name="twitter:description" content="Professional Los Angeles Shopify prep center specializing in DTC fulfillment, custom branding, and Amazon FBA prep. Fast turnaround nationwide." />
        <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData 
        type="faq" 
        data={{
          questions: [
            {
              question: "Do you offer Shopify fulfillment services?",
              answer: "Yes! We specialize in Shopify fulfillment with custom branding, same-day processing, and direct integration with your Shopify store. We handle everything from receiving to shipping with full photo documentation."
            },
            {
              question: "What areas do you serve?",
              answer: "We're based in Los Angeles and provide fulfillment services to e-commerce businesses in all 50 states. We handle shipments to Amazon FBA warehouses, direct-to-consumer orders, and multi-channel fulfillment nationwide."
            },
            {
              question: "Do you offer same-day processing?",
              answer: "Yes! Orders received before our daily cutoff are processed and shipped the same business day. We pride ourselves on fast turnaround times for both Shopify orders and Amazon FBA prep."
            },
            {
              question: "What makes your prep center different?",
              answer: "As a boutique Los Angeles prep center, we offer personalized service, same-day processing, custom branding for Shopify stores, and full photo documentation. You get dedicated support instead of ticket-based systems."
            }
          ]
        }}
      />
      <div className="min-h-screen">
        <Header />
        <Hero />
        <WhyChooseUs />
        
        {/* Location-Specific Content Section */}
        <LocationShowcase />
        
        <Services />
        <Reviews />
        <Pricing />
        <Compliance />
        <Footer />
      </div>
    </>
  );
};

export default Index;
