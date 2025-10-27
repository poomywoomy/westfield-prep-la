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

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Los Angeles Prep Center | Amazon FBA, Shopify & E-Commerce Fulfillment - Westfield</title>
        <meta name="description" content="Leading Los Angeles prep center specializing in Amazon FBA, Shopify fulfillment, and e-commerce services. Same-day prep center processing, photo-proof QC, and fast shipping in Southern California." />
        <link rel="canonical" href="https://westfieldprepcenter.com/" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="reviews" />
      <div className="min-h-screen">
        <Header />
        <Hero />
        <WhyChooseUs />
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
