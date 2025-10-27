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
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Los Angeles Prep Center | Amazon FBA & Shopify Fulfillment - Westfield" />
        <meta property="og:description" content="LA prep center with same-day Amazon FBA & Shopify fulfillment. Every order documented, every brand protected. Trusted by e-commerce sellers in Southern California." />
        <meta property="og:url" content="https://westfieldprepcenter.com/" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Los Angeles Prep Center | Amazon FBA & Shopify Fulfillment - Westfield" />
        <meta name="twitter:description" content="LA prep center with same-day Amazon FBA & Shopify fulfillment. Every order documented, every brand protected." />
        <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
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
                <h2 className="text-4xl font-bold mb-4">Nationwide Fulfillment from Our Strategic Los Angeles Location</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Serving e-commerce businesses in all 50 states with the strategic advantages of LA's ports, infrastructure, and West Coast shipping speeds
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 rounded-full border border-secondary/20">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="font-semibold">Serving E-Commerce Sellers Nationwide</span>
                  <span className="text-sm text-muted-foreground">• Based in Duarte, CA</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold mb-4">Why Our LA Location Benefits Your Business</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-primary">Port Proximity:</strong>
                        <span className="text-muted-foreground"> Direct access to LA/Long Beach ports handling 40% of US imports - faster receiving from international suppliers</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-primary">West Coast Hub:</strong>
                        <span className="text-muted-foreground"> 1-2 day shipping to entire West Coast, fastest possible delivery for Pacific region customers</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-primary">Central Distribution:</strong>
                        <span className="text-muted-foreground"> Efficient shipping routes to all US markets from our strategic California location</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-primary">International Gateway:</strong>
                        <span className="text-muted-foreground"> Direct connections to Asia-Pacific supply chains for global e-commerce operations</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-primary">World-Class Infrastructure:</strong>
                        <span className="text-muted-foreground"> LA's proven logistics ecosystem supporting your business growth</span>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold mb-4">Nationwide Coverage</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                      <span className="text-3xl">📦</span>
                      <div>
                        <div className="font-semibold">All 50 States</div>
                        <div className="text-sm text-muted-foreground">No geographic restrictions</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                      <span className="text-3xl">🚚</span>
                      <div>
                        <div className="font-semibold">Same-Day Processing</div>
                        <div className="text-sm text-muted-foreground">Fast fulfillment wherever you are</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                      <span className="text-3xl">🌐</span>
                      <div>
                        <div className="font-semibold">International Shipping</div>
                        <div className="text-sm text-muted-foreground">Global reach from our LA hub</div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Serving clients nationwide:</strong> From New York to Alaska, Florida to Hawaii - we handle fulfillment for e-commerce sellers across America.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-2">
                  <strong>Based in Duarte, California</strong> • 1801 Flower Ave Office 2, Duarte, CA 91010
                </p>
                <p className="text-sm text-muted-foreground">
                  Nationwide fulfillment with California's world-class logistics infrastructure
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
