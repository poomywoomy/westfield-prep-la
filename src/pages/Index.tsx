import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Compliance from "@/components/Compliance";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import TrustBadges from "@/components/TrustBadges";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shopify, Amazon, & E-commerce Fulfillment in Los Angeles | Westfield Prep Center</title>
        <meta name="description" content="Shopify-first fulfillment with photo-proof QC, branded packaging, and same-day cutoffs. Also supporting Amazon FBA and TikTok Shop. Scale your DTC brand with a premium LA partner." />
        <link rel="canonical" href="https://westfieldprepcenter.com/" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="reviews" />
      <div className="min-h-screen">
        <Header />
        <Hero />
        <TrustBadges />
        <HowItWorks />
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
