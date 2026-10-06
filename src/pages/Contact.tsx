import { Fragment,  useEffect } from "react";
import { useNavigate, Link } from "@/lib/router-compat";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { TranslatedText } from "@/components/TranslatedText";

const Contact = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Fragment>
      
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-32">
          <h1 className="sr-only">Contact Westfield Prep Center</h1>
          <ContactForm />
        </main>

        <Footer />
      </div>
    </Fragment>
  );
};

export default Contact;
