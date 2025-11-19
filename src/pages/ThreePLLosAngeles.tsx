import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { generateMetaTags } from "@/utils/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, Truck, Zap, Check, X, ArrowRight } from "lucide-react";

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
        
        {/* SECTION 1: Premium Editorial Hero */}
        <section className="relative pt-48 md:pt-56 pb-32 md:pb-40 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <div className="space-y-8 text-left">
              <h1 className="text-6xl md:text-7xl lg:text-[72px] font-extralight tracking-tight text-foreground leading-[1.1] mb-6">
                3PL in Los Angeles
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground/80 font-light leading-relaxed max-w-3xl">
                3PL Fulfillment in Los Angeles for Fast-Growing E-Commerce Brands
              </p>
              <div className="pt-6 space-y-6">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  3PL Services in Los Angeles: Modern Logistics for High-Velocity Brands
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Los Angeles is one of the most competitive logistics markets in the country, and growing brands need more than a basic warehouse to scale. A top-tier Los Angeles 3PL gives you the infrastructure, speed, and operational clarity required to keep products moving without bottlenecks, delays, or guesswork. Whether you're fulfilling DTC orders or distributing bulk shipments across multiple channels, partnering with the right LA fulfillment provider positions your business to grow faster and operate with far fewer headaches.
                </p>
              </div>
            </div>
            <div className="mt-12 pt-12 border-t border-border/40 max-w-2xl mx-auto"></div>
          </div>
        </section>

        {/* SECTION 2: LA Advantage Horizontal Feature Row */}
        <section className="py-20 bg-white border-y border-border/10">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-0 divide-x divide-border/10">
              <div className="px-8 md:px-16 py-8 space-y-4 text-center">
                <div className="flex justify-center mb-6">
                  <Package className="w-10 h-10 text-primary stroke-[1]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Port Proximity</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Immediate access to Port of Los Angeles and Port of Long Beach with faster inbound container processing
                </p>
              </div>

              <div className="px-8 md:px-16 py-8 space-y-4 text-center">
                <div className="flex justify-center mb-6">
                  <Truck className="w-10 h-10 text-primary stroke-[1]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Carrier Hub</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Proximity to USPS, UPS, FedEx major hubs with reduced lead time for replenishment
                </p>
              </div>

              <div className="px-8 md:px-16 py-8 space-y-4 text-center">
                <div className="flex justify-center mb-6">
                  <Zap className="w-10 h-10 text-primary stroke-[1]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">West Coast Distribution</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Strategic positioning for 1 to 2 day delivery across California and western states
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto px-6">
          <div className="h-px bg-border/40"></div>
        </div>

        {/* Section 3: Core LA 3PL Benefits - Alternating Editorial Blocks */}
        
        {/* Block A - Secure 3PL Warehouse */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-5xl font-light leading-tight">
                  Secure, Climate-Controlled Storage Designed for West Coast Brands
                </h2>
                <div className="w-20 h-0.5 bg-primary" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A modern 3PL warehouse does far more than hold inventory. It protects your products, organizes your stock intelligently, and maintains the consistency your supply chain depends on. A Los Angeles-based fulfillment center provides climate-controlled storage, dedicated racking zones, and product-specific segregation ensuring your inventory stays in optimal condition from arrival to outbound.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  This creates faster access, safer handling, and a more stable operational flow for brands shipping throughout California and the broader West Coast.
                </p>
              </div>
              <div className="h-96 rounded-lg bg-gradient-to-br from-blue-50 to-gray-50" />
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-border" />

        {/* Block B - Enhanced Inventory Control (REVERSED) */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="h-96 rounded-lg bg-gradient-to-br from-gray-50 to-blue-50 order-2 md:order-1" />
              <div className="space-y-6 order-1 md:order-2">
                <h2 className="text-5xl font-light leading-tight">
                  Streamlined Inventory Management With Real-Time Visibility
                </h2>
                <div className="w-20 h-0.5 bg-primary" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Partnering with a 3PL in Los Angeles brings structure and transparency to your inventory movement. Advanced tracking systems monitor every SKU, update stock levels automatically, and provide location accuracy down to the bin.
                </p>
                <p className="text-lg font-medium">This helps your team:</p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Identify trends in slow-moving and high-velocity SKUs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Prevent costly oversells and stockouts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Maintain accurate counts across all sales channels</span>
                  </li>
                </ul>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With a professional 3PL, you eliminate manual errors and gain a clear, real-time view of your product flow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-border" />

        {/* Block C - Shipping & Distribution */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-5xl font-light leading-tight">
                  Fast, Reliable Distribution Across LA, California, and Nationwide
                </h2>
                <div className="w-20 h-0.5 bg-primary" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A third-party logistics partner ensures your shipments move efficiently across multiple routes whether you're fulfilling DTC orders, sending wholesale replenishments, or distributing bulk shipments.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Los Angeles is one of the strongest shipping hubs in the country, giving brands access to:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Distributed networks for faster regional delivery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Optimized carrier selection (UPS, FedEx, USPS, carriers local to LA)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Multiple outbound strategies to support DTC, retail, and B2B</span>
                  </li>
                </ul>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A professional 3PL coordinates every step so your orders leave accurately, on time, and without operational friction.
                </p>
              </div>
              <div className="h-96 rounded-lg bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary rounded-full" />
                  <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary rounded-lg rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Floating Divider */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="w-3/5 mx-auto h-px bg-border" />
          </div>
        </section>

        {/* Section 5: Multi-Row Capabilities Grid */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
              <div className="space-y-3 border-b border-border pb-8">
                <h4 className="text-xl font-bold">DTC & Lifestyle Brands</h4>
                <p className="text-sm text-muted-foreground">Direct-to-consumer growth</p>
                <p className="text-base leading-relaxed">Brands needing fast order turnaround and clean packaging</p>
              </div>
              <div className="space-y-3 border-b border-border pb-8">
                <h4 className="text-xl font-bold">Beauty, Skincare, Cosmetics</h4>
                <p className="text-sm text-muted-foreground">Temperature-sensitive products</p>
                <p className="text-base leading-relaxed">Climate-controlled storage with product segregation</p>
              </div>
              <div className="space-y-3 border-b border-border pb-8">
                <h4 className="text-xl font-bold">Apparel & Accessories</h4>
                <p className="text-sm text-muted-foreground">Fashion and seasonal goods</p>
                <p className="text-base leading-relaxed">Quick restocking and multi-channel distribution</p>
              </div>
              <div className="space-y-3 border-b border-border pb-8">
                <h4 className="text-xl font-bold">Wellness & Supplement Brands</h4>
                <p className="text-sm text-muted-foreground">Health-focused products</p>
                <p className="text-base leading-relaxed">Compliance-ready handling and lot tracking</p>
              </div>
              <div className="space-y-3 border-b border-border pb-8">
                <h4 className="text-xl font-bold">TikTok Shop Creators</h4>
                <p className="text-sm text-muted-foreground">High-velocity social commerce</p>
                <p className="text-base leading-relaxed">Rapid fulfillment for viral product launches</p>
              </div>
              <div className="space-y-3 border-b border-border pb-8">
                <h4 className="text-xl font-bold">Influencer-Led Launches</h4>
                <p className="text-sm text-muted-foreground">Creator-driven brands</p>
                <p className="text-base leading-relaxed">Flexible fulfillment for launch campaigns</p>
              </div>
              <div className="space-y-3 border-b border-border pb-8">
                <h4 className="text-xl font-bold">West Coast Focused Brands</h4>
                <p className="text-sm text-muted-foreground">Regional distribution priority</p>
                <p className="text-base leading-relaxed">1 to 2 day delivery across California</p>
              </div>
              <div className="space-y-3 border-b border-border pb-8">
                <h4 className="text-xl font-bold">Amazon FBA Prep</h4>
                <p className="text-sm text-muted-foreground">FBA-bound inventory</p>
                <p className="text-base leading-relaxed">Professional prep, labeling, and shipment creation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Blueprint Line Graphic Section */}
        <section className="py-32 bg-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, hsl(var(--border)) 49px, hsl(var(--border)) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, hsl(var(--border)) 49px, hsl(var(--border)) 50px)`
          }} />
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <h2 className="text-5xl font-light text-center mb-12">
              How a 3PL Streamlines Your Logistics in LA
            </h2>
            <div className="space-y-8 text-center">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Los Angeles provides infrastructure that most logistics markets cannot match. LAX air freight terminals handle international shipments daily. The USPS distribution hub in City of Industry processes millions of parcels weekly. A dense courier network ensures same-day and next-day pickup across the metro area.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Warehouse clusters in Commerce, Vernon, Torrance, and Gardena create low-latency restock routes to Amazon fulfillment centers like ONT8, LGB8, and SNA4. For brands shipping West Coast inventory or managing FBA prep, LA provides the operational clarity and speed required to scale without friction.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Horizontal Scrolling Use Cases Strip */}
        <section className="py-24 bg-background overflow-hidden">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
            {[
              {
                title: "Scaling DTC Brands",
                description: "Brands experiencing rapid growth need fulfillment infrastructure that scales without delays. A Los Angeles 3PL provides the capacity, speed, and operational consistency required to handle high order volumes."
              },
              {
                title: "West Coast Distribution",
                description: "Shipping from Los Angeles positions your inventory closer to California, Nevada, Arizona, and Oregon customers with 1 to 2 day transit zones and lower shipping costs."
              },
              {
                title: "Port Proximity Benefits",
                description: "Direct access to LA and Long Beach ports reduces container processing time and accelerates inventory availability. This creates faster restocking cycles and more predictable supply chain flow."
              },
              {
                title: "Influencer & Content Creator Support",
                description: "LA-based creators and influencer-led brands benefit from local fulfillment with same-day handling, flexible packaging, and rapid response to viral product launches."
              }
            ].map((useCase, index) => (
              <div key={index} className="min-w-[400px] px-12 py-16 border-r border-border snap-center">
                <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Big LA Warehouse Visual Section */}
        <section className="relative py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-4">
              Los Angeles vs Non-Los Angeles 3PLs
            </h2>
            <p className="text-lg text-white/60 text-center mb-16">
              Why location matters for e-commerce fulfillment
            </p>
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6">LA 3PL</h3>
                {[
                  "Direct port proximity",
                  "1 to 2 days West Coast delivery",
                  "Short container to shelf time",
                  "Dense carrier network",
                  "Ideal for DTC brands",
                  "Lower shipping costs for CA customers"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-white">
                    <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6">Non-LA 3PL</h3>
                {[
                  "Slower inbound movement",
                  "3 to 5 days delivery",
                  "Long container processing",
                  "Limited carrier access",
                  "Mixed suitability",
                  "Higher costs for West Coast"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-white/60">
                    <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Final Summary Section */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-5xl font-light text-center mb-4">
              Why Brands Choose a 3PL in Los Angeles
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-16" />
            <div className="space-y-0">
              {[
                "Shorter transit zones for California and West Coast customers",
                "High daily order processing capacity with same-day handling",
                "Better access to influencer ecosystem and creator partnerships",
                "Faster restocks for California Amazon fulfillment centers",
                "Ideal for luxury, beauty, and lifestyle brand positioning",
                "Frequent freight schedules from Asia to LA ports"
              ].map((reason, index) => (
                <div key={index} className="py-5 border-b border-border">
                  <p className="text-lg text-center">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 10: Bottom Minimal CTA */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Explore more about fulfillment, logistics, and 3PL operations in Los Angeles.
            </p>
            <Link to="/why-choose-us" className="inline-flex items-center gap-2 text-primary hover:underline">
              Learn more about our services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Premium Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-6">Services</h3>
                <ul className="space-y-3">
                  <li><Link to="/amazon-fba-prep" className="hover:text-primary transition-colors">Amazon FBA Prep</Link></li>
                  <li><Link to="/shopify-fulfillment" className="hover:text-primary transition-colors">Shopify Fulfillment</Link></li>
                  <li><Link to="/storage-warehousing" className="hover:text-primary transition-colors">Storage & Warehousing</Link></li>
                  <li><Link to="/labeling-compliance" className="hover:text-primary transition-colors">Labeling & Compliance</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-6">Company</h3>
                <ul className="space-y-3">
                  <li><Link to="/why-choose-us" className="hover:text-primary transition-colors">Why Choose Us</Link></li>
                  <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                  <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-6">Resources</h3>
                <ul className="space-y-3">
                  <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                  <li><Link to="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>

        <Footer />
      </div>
    </>
  );
};

export default ThreePLLosAngeles;
