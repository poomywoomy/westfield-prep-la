import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { generateMetaTags } from "@/utils/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, MapPin, Truck, Zap, Users, TrendingUp } from "lucide-react";

const ThreePLLosAngeles = () => {
  const meta = generateMetaTags(
    "3PL Los Angeles | Premium Fulfillment Center in Los Angeles",
    "Strategic Los Angeles 3PL fulfillment center for fast-growing e-commerce brands. Port proximity, same-day handling, West Coast distribution excellence.",
    "/3pl-los-angeles",
    "/la-port-logistics.jpg"
  );

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:url" content={meta.ogUrl} />
        <meta property="og:image" content={meta.ogImage} />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        <meta name="twitter:image" content={meta.twitterImage} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground leading-[1.1]">
                  3PL Fulfillment in Los Angeles for Fast-Growing E-Commerce Brands
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                  A strategically located Los Angeles fulfillment center designed for speed, accuracy, and modern DTC operations.
                </p>
              </div>
              <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl"></div>
                <MapPin className="w-32 h-32 md:w-40 md:h-40 text-primary/20 stroke-[0.5]" />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto px-6">
          <div className="h-px bg-border/40"></div>
        </div>

        {/* Why LA Strategic Hub */}
        <section className="py-32 md:py-40">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <h2 className="text-5xl md:text-6xl font-light text-center mb-20 text-foreground">
              Why Los Angeles Is One of the Most Important 3PL Hubs in the U.S.
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 md:gap-16">
              <div className="space-y-6 text-center group">
                <div className="flex justify-center mb-8">
                  <Package className="w-12 h-12 text-primary stroke-[1]" />
                </div>
                <h3 className="text-2xl font-light text-foreground">Port Proximity</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Immediate access to Port of Los Angeles and Port of Long Beach with faster inbound container processing
                </p>
              </div>

              <div className="space-y-6 text-center group">
                <div className="flex justify-center mb-8">
                  <Truck className="w-12 h-12 text-primary stroke-[1]" />
                </div>
                <h3 className="text-2xl font-light text-foreground">Carrier Hub</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Proximity to USPS, UPS, FedEx major hubs with reduced lead time for replenishment and cross-docking
                </p>
              </div>

              <div className="space-y-6 text-center group">
                <div className="flex justify-center mb-8">
                  <TrendingUp className="w-12 h-12 text-primary stroke-[1]" />
                </div>
                <h3 className="text-2xl font-light text-foreground">West Coast Distribution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Optimized for West Coast distribution with faster delivery speed ideal for brands manufacturing overseas
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto px-6">
          <div className="h-px bg-border/40"></div>
        </div>

        {/* Benefits Section */}
        <section className="py-32 md:py-40">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <h2 className="text-5xl md:text-6xl font-light mb-24 text-foreground">
              The Benefits of Choosing a 3PL in Los Angeles
            </h2>

            <div className="space-y-20">
              <div className="flex gap-12 items-start group">
                <div className="text-7xl md:text-8xl font-light text-primary/20 min-w-[120px]">01</div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-3xl font-light text-foreground">Faster West Coast Delivery Speed</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Reduce delivery times to California, Oregon, Washington, Nevada, and Arizona.
                  </p>
                </div>
              </div>

              <div className="flex gap-12 items-start group">
                <div className="text-7xl md:text-8xl font-light text-primary/20 min-w-[120px]">02</div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-3xl font-light text-foreground">Same-Day Handling for LA-Based Brands</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Local brands get true same-day inbound processing and rapid order turnaround.
                  </p>
                </div>
              </div>

              <div className="flex gap-12 items-start group">
                <div className="text-7xl md:text-8xl font-light text-primary/20 min-w-[120px]">03</div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-3xl font-light text-foreground">Reduced Shipping Costs</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Shorter zones mean lower rates for West Coast DTC customers.
                  </p>
                </div>
              </div>

              <div className="flex gap-12 items-start group">
                <div className="text-7xl md:text-8xl font-light text-primary/20 min-w-[120px]">04</div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-3xl font-light text-foreground">Access to Major Carriers & Freight Lanes</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    LA provides one of the densest freight ecosystems in the country.
                  </p>
                </div>
              </div>

              <div className="flex gap-12 items-start group">
                <div className="text-7xl md:text-8xl font-light text-primary/20 min-w-[120px]">05</div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-3xl font-light text-foreground">Ideal for TikTok Shop, Shopify & Influencer Fulfillment</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Brands doing content production in LA get quicker logistics support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider - 60% width */}
        <div className="container mx-auto px-6 flex justify-center py-20">
          <div className="h-px bg-border/40 w-3/5"></div>
        </div>

        {/* Who It's For Section */}
        <section className="py-32 md:py-40 bg-muted/30">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <h2 className="text-5xl md:text-6xl font-light mb-24 text-foreground">
              Who a Los Angeles 3PL Is Ideal For
            </h2>

            <div className="grid md:grid-cols-2 gap-20">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-light text-foreground">DTC & lifestyle brands</h3>
                  <h3 className="text-2xl font-light text-foreground">Beauty, skincare & cosmetics</h3>
                  <h3 className="text-2xl font-light text-foreground">Apparel & accessories</h3>
                  <h3 className="text-2xl font-light text-foreground">Wellness & supplement brands</h3>
                  <h3 className="text-2xl font-light text-foreground">TikTok Shop creators</h3>
                  <h3 className="text-2xl font-light text-foreground">Influencer-led product launches</h3>
                  <h3 className="text-2xl font-light text-foreground">Brands with West Coast majority customers</h3>
                </div>
              </div>

              <div className="space-y-6 flex flex-col justify-center">
                <p className="text-xl text-muted-foreground leading-relaxed">Reduces lead time</p>
                <p className="text-xl text-muted-foreground leading-relaxed">Improves customer satisfaction</p>
                <p className="text-xl text-muted-foreground leading-relaxed">Strengthens brand logistics reliability</p>
                <p className="text-xl text-muted-foreground leading-relaxed">Improves margins through zone optimization</p>
                <p className="text-xl text-muted-foreground leading-relaxed">Supports higher order volume with regional advantage</p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto px-6">
          <div className="h-px bg-border/40"></div>
        </div>

        {/* LA Logistics Advantages */}
        <section className="py-32 md:py-40">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <h2 className="text-5xl md:text-6xl font-light mb-24 text-foreground">
              Understanding Los Angeles Logistics Advantages
            </h2>

            <div className="space-y-12">
              <div className="flex items-start gap-8 group">
                <Zap className="w-8 h-8 text-primary stroke-[1] mt-2 flex-shrink-0" />
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Proximity to LAX air freight terminals
                </p>
              </div>

              <div className="flex items-start gap-8 group">
                <Zap className="w-8 h-8 text-primary stroke-[1] mt-2 flex-shrink-0" />
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Near the largest USPS distribution hub on the West Coast
                </p>
              </div>

              <div className="flex items-start gap-8 group">
                <Zap className="w-8 h-8 text-primary stroke-[1] mt-2 flex-shrink-0" />
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Dense courier network for same-day LA/OC/SFV delivery
                </p>
              </div>

              <div className="flex items-start gap-8 group">
                <Zap className="w-8 h-8 text-primary stroke-[1] mt-2 flex-shrink-0" />
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Warehouse cluster in Commerce, Vernon, Torrance, Gardena
                </p>
              </div>

              <div className="flex items-start gap-8 group">
                <Zap className="w-8 h-8 text-primary stroke-[1] mt-2 flex-shrink-0" />
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Low-latency restock routes to Amazon FCs like ONT8, LGB8, SNA4
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider - 40% width left aligned */}
        <div className="container mx-auto px-6 py-20">
          <div className="h-px bg-border/40 w-2/5"></div>
        </div>

        {/* LA vs Non-LA Comparison */}
        <section className="py-32 md:py-40 bg-muted/30">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <h2 className="text-5xl md:text-6xl font-light mb-24 text-foreground">
              Los Angeles vs Non-Los Angeles 3PLs
            </h2>

            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-3 gap-8 pb-8 border-b-2 border-border">
                <div className="text-xl font-light text-muted-foreground">Feature</div>
                <div className="text-xl font-light text-foreground">LA 3PL</div>
                <div className="text-xl font-light text-muted-foreground">Non-LA 3PL</div>
              </div>

              {/* Rows */}
              <div className="grid grid-cols-3 gap-8 py-8 border-b border-border/40">
                <div className="text-lg text-muted-foreground">Access to Ports</div>
                <div className="text-lg text-foreground">Direct proximity</div>
                <div className="text-lg text-muted-foreground">Slower inbound movement</div>
              </div>

              <div className="grid grid-cols-3 gap-8 py-8 border-b border-border/40">
                <div className="text-lg text-muted-foreground">West Coast Delivery Speed</div>
                <div className="text-lg text-foreground">1–2 days</div>
                <div className="text-lg text-muted-foreground">3–5 days</div>
              </div>

              <div className="grid grid-cols-3 gap-8 py-8 border-b border-border/40">
                <div className="text-lg text-muted-foreground">Container to Shelf Time</div>
                <div className="text-lg text-foreground">Short</div>
                <div className="text-lg text-muted-foreground">Long</div>
              </div>

              <div className="grid grid-cols-3 gap-8 py-8 border-b border-border/40">
                <div className="text-lg text-muted-foreground">Carrier Access</div>
                <div className="text-lg text-foreground">Dense network</div>
                <div className="text-lg text-muted-foreground">Limited</div>
              </div>

              <div className="grid grid-cols-3 gap-8 py-8">
                <div className="text-lg text-muted-foreground">Ideal for DTC Brands</div>
                <div className="text-lg text-foreground">Yes</div>
                <div className="text-lg text-muted-foreground">Mixed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto px-6">
          <div className="h-px bg-border/40"></div>
        </div>

        {/* Why Brands Choose LA */}
        <section className="py-32 md:py-40">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <h2 className="text-5xl md:text-6xl font-light mb-24 text-foreground">
              Why Brands Choose Los Angeles for Fulfillment
            </h2>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Shorter transit zones
                </p>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  High daily order processing capacity
                </p>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Better access to influencer ecosystem (LA content creators)
                </p>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Faster restocks for California Amazon FCs
                </p>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Ideal for luxury, beauty & lifestyle brands
                </p>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-2xl text-muted-foreground font-light leading-relaxed">
                  Frequent freight schedules from Asia → LA ports
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider - 20% opacity darker */}
        <div className="container mx-auto px-6 py-20">
          <div className="h-px bg-border/60"></div>
        </div>

        {/* Final SEO Footer Content Block */}
        <section className="py-32 md:py-40 bg-background">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <h3 className="text-3xl md:text-4xl font-light mb-12 text-foreground leading-relaxed">
              3PL Services for Los Angeles, Santa Monica, Beverly Hills, Culver City, Pasadena, Glendale, Burbank, and the Greater Los Angeles Area
            </h3>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Our Los Angeles County fulfillment center provides comprehensive LA fulfillment services for modern DTC operations. Strategically positioned in the heart of West Coast logistics, we deliver same-day handling and e-commerce distribution excellence for brands across the Greater Los Angeles Area. With direct access to major freight routes and local warehouse support, we enable fast-growing brands to optimize their supply chain and accelerate delivery times throughout Southern California.
            </p>
          </div>
        </section>

        {/* Premium Footer Section - Dark */}
        <section className="bg-foreground text-background py-20">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-sm font-light mb-6 opacity-60">Services</h4>
                <div className="space-y-3">
                  <Link to="/amazon-fba-prep" className="block text-sm hover:opacity-70 transition-opacity">
                    Amazon FBA Prep
                  </Link>
                  <Link to="/shopify-fulfillment" className="block text-sm hover:opacity-70 transition-opacity">
                    Shopify Fulfillment
                  </Link>
                  <Link to="/storage-warehousing" className="block text-sm hover:opacity-70 transition-opacity">
                    Storage & Warehousing
                  </Link>
                  <Link to="/kitting-bundling" className="block text-sm hover:opacity-70 transition-opacity">
                    Kitting & Bundling
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-light mb-6 opacity-60">Company</h4>
                <div className="space-y-3">
                  <Link to="/why-choose-us" className="block text-sm hover:opacity-70 transition-opacity">
                    Why Choose Us
                  </Link>
                  <Link to="/testimonials" className="block text-sm hover:opacity-70 transition-opacity">
                    Testimonials
                  </Link>
                  <Link to="/pricing" className="block text-sm hover:opacity-70 transition-opacity">
                    Pricing
                  </Link>
                  <Link to="/contact" className="block text-sm hover:opacity-70 transition-opacity">
                    Contact
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-light mb-6 opacity-60">Resources</h4>
                <div className="space-y-3">
                  <Link to="/blog" className="block text-sm hover:opacity-70 transition-opacity">
                    Blog
                  </Link>
                  <Link to="/faq" className="block text-sm hover:opacity-70 transition-opacity">
                    FAQ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ThreePLLosAngeles;
