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
        <title>Contact Us - Westfield Prep Center | Get a Quote</title>
        <meta name="description" content="Contact Westfield Prep Center for e-commerce fulfillment services. Call +1 (818) 935-5478 or email info@westfieldprepcenter.com. Open 7 days, 9am-8pm PST." />
        <link rel="canonical" href="https://westfieldprepcenter.com/contact/" />
      </Helmet>
      <StructuredData type="organization" />
      
      <div className="min-h-screen bg-background">
        <Header />

        <main>
          <ContactForm />
          
          {/* Google Maps Embed */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6">Visit Our Duarte Location</h2>
                <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3299.8!2d-117.9773!3d34.1395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA4JzIyLjIiTiAxMTfCsDU4JzM4LjMiVw!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Westfield Prep Center Location - 1801 Flower Ave, Duarte, CA 91010"
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  1801 Flower Ave Office 2, Duarte, CA 91010 • San Gabriel Valley, Los Angeles County
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
