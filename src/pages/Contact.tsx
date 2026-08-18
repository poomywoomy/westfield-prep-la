import { useEffect } from "react";
import { useNavigate, Link } from "@/lib/router-compat";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { TranslatedText } from "@/components/TranslatedText";

const Contact = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
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
