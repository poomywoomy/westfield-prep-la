import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";

const Contact = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Westfield Prep Center | Shopify & Amazon 3PL</title>
        <meta name="description" content="Contact Westfield Prep Center to discuss Shopify fulfillment, Amazon FBA prep, or custom 3PL solutions. Nationwide service with fast onboarding and dedicated support." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://westfieldprepcenter.com/contact" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://westfieldprepcenter.com/contact" />
        <meta property="og:title" content="Contact Westfield 3PL | Get a Quote" />
        <meta property="og:description" content="Get a custom 3PL quote for Shopify fulfillment & Amazon FBA prep." />
        <meta property="og:image" content="https://westfieldprepcenter.com/hero-warehouse-optimized.webp" />
        <meta property="og:site_name" content="Westfield Prep Center" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Westfield3PL" />
        <meta name="twitter:title" content="Contact Westfield 3PL | Get a Quote" />
        <meta name="twitter:description" content="Contact us for Shopify fulfillment & Amazon FBA prep quotes." />
        <meta name="twitter:image" content="https://westfieldprepcenter.com/hero-warehouse-optimized.webp" />
      </Helmet>
      <StructuredData type="contact" />
      <StructuredData type="organization" />
      <StructuredData type="breadcrumb" data={{ items: [{ label: "Home", path: "/" }, { label: "Contact", path: "/contact" }] }} />
      
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-32">
          <ContactForm />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
