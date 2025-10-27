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
        <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Nationwide Fulfillment from Los Angeles</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-5">
                  Strategic West Coast location serving all 50 states with LA's port access, infrastructure, and shipping advantages
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/5 rounded-full border border-secondary/10">
                  <span className="text-xl">🇺🇸</span>
                  <span className="text-sm font-medium">Nationwide E-Commerce Fulfillment</span>
                  <span className="text-xs text-muted-foreground">• Duarte, CA</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card/50 backdrop-blur-sm p-5 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-primary">⚡</span>
                    LA Strategic Advantages
                  </h3>
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex items-start gap-2.5">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <div><strong className="text-foreground">Port Proximity:</strong> <span className="text-muted-foreground">Direct LA/Long Beach port access—40% of US imports</span></div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <div><strong className="text-foreground">West Coast Hub:</strong> <span className="text-muted-foreground">1-2 day delivery across Pacific region</span></div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <div><strong className="text-foreground">Central Distribution:</strong> <span className="text-muted-foreground">Efficient nationwide shipping routes</span></div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <div><strong className="text-foreground">Asia-Pacific Gateway:</strong> <span className="text-muted-foreground">Direct global supply chain connections</span></div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <div><strong className="text-foreground">World-Class Infrastructure:</strong> <span className="text-muted-foreground">LA's proven logistics ecosystem</span></div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-card/50 backdrop-blur-sm p-5 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-primary">🌎</span>
                    Coverage & Capabilities
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2.5 bg-secondary/5 rounded-lg border border-secondary/10">
                      <span className="text-2xl">📦</span>
                      <div>
                        <div className="text-sm font-semibold">All 50 States</div>
                        <div className="text-xs text-muted-foreground">No geographic limits</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-secondary/5 rounded-lg border border-secondary/10">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <div className="text-sm font-semibold">Same-Day Processing</div>
                        <div className="text-xs text-muted-foreground">Fast turnaround nationwide</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-secondary/5 rounded-lg border border-secondary/10">
                      <span className="text-2xl">🌐</span>
                      <div>
                        <div className="text-sm font-semibold">International Shipping</div>
                        <div className="text-xs text-muted-foreground">Global reach from LA</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Coast to coast:</strong> NY to Alaska, FL to Hawaii—fulfillment for sellers across America
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Duarte, California</strong> • 1801 Flower Ave Office 2, CA 91010
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
