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
        <title>Contact Los Angeles Shopify Prep Center | DTC Fulfillment & FBA Quote</title>
        <meta name="description" content="Contact Westfield Prep Center in Los Angeles for Shopify fulfillment and e-commerce services. Call +1 (818) 935-5478 or email info@westfieldprepcenter.com. Serving businesses nationwide. Open 7 days, 9am-8pm PST." />
        <link rel="canonical" href="https://westfieldprepcenter.com/contact/" />
      </Helmet>
      <StructuredData type="organization" />
      
      <div className="min-h-screen bg-background">
        <Header />

        <main>
          <ContactForm />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
