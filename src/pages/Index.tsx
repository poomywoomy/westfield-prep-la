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
        <title>Los Angeles Prep Center | Amazon FBA & Shopify Fulfillment - Westfield</title>
        <meta name="description" content="LA prep center with same-day Amazon FBA & Shopify fulfillment. Every order documented, every brand protected. Trusted by e-commerce sellers in Southern California." />
        <link rel="canonical" href="https://westfieldprepcenter.com/" />
      </Helmet>
      <StructuredData type="organization" />
      <StructuredData type="reviews" />
      <StructuredData type="website" />
      <div className="min-h-screen">
        <Header />
        <Hero />
        <WhyChooseUs />
        
        {/* Location-Specific Content Section */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Your Trusted Los Angeles Prep Center</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Strategically located in Duarte, California, serving e-commerce sellers across Southern California and beyond
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold mb-4">Service Areas</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span>Los Angeles County</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span>San Gabriel Valley</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span>Orange County</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span>Inland Empire (Riverside, San Bernardino)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span>Ventura County</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold mb-4">Location Advantages</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-secondary rounded-full mt-2"></div>
                      <span><strong>Port Proximity:</strong> Close to LA/Long Beach ports for fast international receiving</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-secondary rounded-full mt-2"></div>
                      <span><strong>West Coast Shipping:</strong> 1-2 day delivery across California and the West Coast</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-secondary rounded-full mt-2"></div>
                      <span><strong>Local Support:</strong> Duarte-based team that understands LA e-commerce sellers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-secondary rounded-full mt-2"></div>
                      <span><strong>Fast Transit:</strong> Central location for efficient shipping to all US markets</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-6">
                  Located at 1801 Flower Ave Office 2, Duarte, CA 91010 — serving sellers nationwide with LA's strategic advantages
                </p>
              </div>
            </div>
          </div>
        </section>
        
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
