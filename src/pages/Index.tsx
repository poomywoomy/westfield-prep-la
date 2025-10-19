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
        <title>Prep Center & E-Commerce Fulfillment in Los Angeles & Southern California | Westfield Prep Center</title>
        <meta name="description" content="Westfield Prep Center offers fast, reliable Amazon FBA prep and e-commerce fulfillment in Los Angeles and Southern California. Quality control, labeling, and same-day shipping for online sellers." />
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
