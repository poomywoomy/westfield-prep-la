import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Compliance from "@/components/Compliance";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shopify & E-commerce Fulfillment in Los Angeles | Westfield Prep Center</title>
        <meta name="description" content="Shopify-first fulfillment with photo-proof QC, branded packaging, and same-day cutoffs. Also supporting Amazon FBA and TikTok Shop. Scale your DTC brand with a premium LA partner." />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <Hero />
        <HowItWorks />
        <WhyChooseUs />
        <Services />
        <Pricing />
        <Compliance />
        <Footer />
      </div>
    </>
  );
};

export default Index;
