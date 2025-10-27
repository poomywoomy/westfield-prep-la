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
        <title>Duarte Prep Center | Amazon FBA & Shopify Fulfillment Los Angeles County</title>
        <meta name="description" content="Professional prep center in Duarte serving Los Angeles County & San Gabriel Valley. Amazon FBA prep, Shopify fulfillment, multi-channel services. Fast 24-48hr turnaround. Serving Monrovia, Arcadia, Pasadena & all 50 states." />
        <link rel="canonical" href="https://westfieldprepcenter.com/" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Duarte, Los Angeles County" />
        <meta name="geo.position" content="34.1395;-117.9773" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Duarte Prep Center | Amazon FBA & Shopify Fulfillment Los Angeles County" />
        <meta property="og:description" content="Professional prep center in Duarte serving Los Angeles County & San Gabriel Valley. Amazon FBA prep, Shopify fulfillment, multi-channel services. Fast 24-48hr turnaround nationwide." />
        <meta property="og:url" content="https://westfieldprepcenter.com/" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Duarte Prep Center | Amazon FBA & Shopify Fulfillment Los Angeles" />
        <meta name="twitter:description" content="Professional prep center in Duarte serving Los Angeles County. Amazon FBA prep, Shopify fulfillment, multi-channel services. Fast turnaround nationwide." />
        <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData 
        type="faq" 
        data={{
          questions: [
            {
              question: "Do you serve the San Gabriel Valley?",
              answer: "Yes! Our prep center is located in Duarte, in the heart of the San Gabriel Valley. We serve Monrovia, Arcadia, Pasadena, and all surrounding cities in Los Angeles County."
            },
            {
              question: "Where is your prep center located?",
              answer: "We're located at 1801 Flower Ave Office 2, Duarte, CA 91010, in Los Angeles County. We're centrally positioned to serve the entire San Gabriel Valley and greater Los Angeles area."
            },
            {
              question: "Do you ship nationwide?",
              answer: "Yes! While we're based in Duarte, California, we provide fulfillment services to businesses in all 50 states. We ship directly to Amazon FBA warehouses and customers nationwide."
            },
            {
              question: "What areas do you cover in Los Angeles?",
              answer: "We serve all of Los Angeles County, with a focus on the San Gabriel Valley including Duarte, Monrovia, Arcadia, Pasadena, and surrounding communities. However, we handle shipments for clients across the United States."
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
