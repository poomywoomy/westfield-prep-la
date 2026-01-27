import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { generateMetaTags } from "@/utils/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Truck, Zap, Check, X, ArrowRight } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const ThreePLLosAngeles = () => {
  const meta = generateMetaTags(
    "3PL Fulfillment Services at West Coast 3PL Warehouse",
    "3PL fulfillment services at our West Coast 3PL warehouse help your e-commerce business grow. Fast, accurate, and reliable shipping. Get started with us today!",
    "/3pl-los-angeles",
    "/la-port-logistics.jpg"
  );

  const serviceData = {
    serviceType: "LogisticsService",
    name: "Los Angeles 3PL Fulfillment Services",
    description: "Premium third-party logistics (3PL) services in Los Angeles including Shopify fulfillment, Amazon FBA prep, same-day receiving, inventory management, and multi-channel order processing for e-commerce brands.",
    features: [
      "Shopify Fulfillment",
      "Same-Day Receiving",
      "Inventory Management",
      "Multi-Channel Order Processing",
      "Amazon FBA Prep",
      "West Coast Distribution",
      "Real-Time Inventory Tracking",
      "Custom Packaging & Kitting"
    ]
  };

  const faqData = [
    { 
      question: "What makes a Los Angeles 3PL better than other locations?", 
      answer: "Los Angeles 3PL centers offer strategic port proximity (15 minutes from LA/Long Beach ports), access to major carrier hubs, and optimal West Coast distribution. This means faster receiving, lower shipping costs to California customers, and 2-day ground delivery across the western United States." 
    },
    { 
      question: "How quickly can you receive inventory at your LA facility?", 
      answer: "We offer same-day container processing for shipments received before 2PM PST. Most domestic freight is processed and inventoried within 24 hours of arrival at our Los Angeles warehouse." 
    },
    { 
      question: "Do you integrate with Shopify stores?", 
      answer: "Yes, we offer seamless Shopify integration with real-time inventory syncing, automatic order imports, and instant tracking number updates. Our system supports multi-location inventory and custom fulfillment rules." 
    },
    { 
      question: "What's your coverage area from Los Angeles?", 
      answer: "From our LA location, we provide 2-day ground shipping to all West Coast states, 3-day to Mountain states, and 4-5 day coast-to-coast. We also offer expedited air shipping for time-sensitive orders." 
    },
    { 
      question: "Can you handle Amazon FBA prep from your LA warehouse?", 
      answer: "Yes, we provide full Amazon FBA prep services including FNSKU labeling, polybagging, bubble wrap, carton prep, and direct shipment to Amazon fulfillment centers. We're experienced with all Amazon compliance requirements." 
    },
    { 
      question: "What types of businesses do you work with?", 
      answer: "We serve DTC brands, Shopify merchants, Amazon FBA sellers, multi-channel retailers, and subscription box companies. Our clients range from startups to established brands shipping 1,000+ orders per month." 
    },
    { 
      question: "How does pricing work for 3PL services in LA?", 
      answer: "Our pricing is customized based on your volume, storage needs, and service requirements. We offer transparent per-unit receiving fees, monthly storage fees, and per-order fulfillment fees. Contact us for a detailed quote." 
    },
    { 
      question: "Do you offer real-time inventory visibility?", 
      answer: "Yes, our client portal provides 24/7 access to real-time inventory levels, order status, shipment tracking, and detailed analytics. You can manage your inventory from anywhere with full transparency." 
    }
  ];

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
      <StructuredData type="organization" />
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen bg-background">
        <Header />
        <Breadcrumbs items={[{ label: "3PL Los Angeles", path: "/3pl-los-angeles" }]} />
        
        {/* Hero Section */}
        <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8 text-center">
              {/* Icon + H1 */}
              <div className="flex items-center justify-center gap-4">
                <MapPin className="w-12 h-12 text-primary flex-shrink-0" />
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-foreground leading-[1.1] border-l-4 border-primary pl-6 shadow-sm">
                  <TranslatedText>3PL in Los Angeles</TranslatedText>
                </h1>
              </div>
              
              {/* Subtitle/Value Prop */}
              <p className="text-xl md:text-2xl text-muted-foreground/90 font-light leading-relaxed max-w-3xl mx-auto">
                <TranslatedText>Los Angeles's trusted 3PL partner for growing online brands. Expert order fulfillment, real-time inventory tracking, and strategic West Coast distribution.</TranslatedText>
              </p>
              
              {/* CTA Button */}
              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => window.location.href = '/contact'}
                >
                  <TranslatedText>Get Your Quote</TranslatedText>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Transitional Context Paragraph */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <p className="text-lg md:text-xl text-center text-muted-foreground leading-relaxed">
              <TranslatedText>A Los Angeles 3PL brings speed, structure, and proximity to one of the world's busiest logistics ecosystems. From same-day container receiving to 2-day West Coast delivery, our fulfillment center positions your brand where it needs to be.</TranslatedText>
            </p>
          </div>
        </section>

        {/* SECTION 2: LA Advantage Horizontal Feature Row */}
        <section className="py-16 bg-white border-y border-border/10">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-0 divide-x divide-border/10">
              <div className="px-8 md:px-16 py-8 space-y-4 text-center">
                <div className="flex justify-center mb-6">
                  <Package className="w-10 h-10 text-primary stroke-[1]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  <TranslatedText>Port Proximity</TranslatedText>
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  <TranslatedText>Immediate access to Port of Los Angeles and Port of Long Beach with faster inbound container processing</TranslatedText>
                </p>
              </div>

              <div className="px-8 md:px-16 py-8 space-y-4 text-center">
                <div className="flex justify-center mb-6">
                  <Truck className="w-10 h-10 text-primary stroke-[1]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  <TranslatedText>Carrier Hub</TranslatedText>
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  <TranslatedText>Proximity to USPS, UPS, FedEx major hubs with reduced lead time for replenishment</TranslatedText>
                </p>
              </div>

              <div className="px-8 md:px-16 py-8 space-y-4 text-center">
                <div className="flex justify-center mb-6">
                  <Zap className="w-10 h-10 text-primary stroke-[1]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  <TranslatedText>West Coast Distribution</TranslatedText>
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  <TranslatedText>Strategic positioning for 1 to 2 day delivery across California and western states</TranslatedText>
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
                  <TranslatedText>Secure, Climate-Controlled Storage Designed for West Coast Brands</TranslatedText>
                </h2>
                <div className="w-20 h-0.5 bg-primary" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <TranslatedText>A modern 3PL warehouse does far more than hold inventory. It protects your products, organizes your stock intelligently, and maintains the consistency your supply chain depends on. A Los Angeles-based fulfillment center provides climate-controlled storage, dedicated racking zones, and product-specific segregation ensuring your inventory stays in optimal condition from arrival to outbound.</TranslatedText>
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <TranslatedText>This creates faster access, safer handling, and a more stable operational flow for brands shipping throughout California and the broader West Coast.</TranslatedText>
                </p>
              </div>
                <div className="h-96 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="/blog-images/3pl-warehouse-storage-la.jpg"
                    alt="Modern climate-controlled 3PL warehouse in Los Angeles with organized pallet racking and secure storage for e-commerce inventory"
                    className="w-full h-full object-cover"
                  />
                </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-border" />

        {/* Block B - Enhanced Inventory Control (REVERSED) */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="h-96 rounded-lg overflow-hidden shadow-lg order-2 md:order-1">
                  <img 
                    src="/blog-images/inventory-management-barcode-scanning.jpg"
                    alt="Warehouse worker using barcode scanner for real-time inventory management and SKU tracking in Los Angeles 3PL facility"
                    className="w-full h-full object-cover"
                  />
                </div>
              <div className="space-y-6 order-1 md:order-2">
                <h2 className="text-5xl font-light leading-tight">
                  <TranslatedText>Streamlined Inventory Management With Real-Time Visibility</TranslatedText>
                </h2>
                <div className="w-20 h-0.5 bg-primary" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <TranslatedText>Partnering with a 3PL in Los Angeles brings structure and transparency to your inventory movement. Advanced tracking systems monitor every SKU, update stock levels automatically, and provide location accuracy down to the bin.</TranslatedText>
                </p>
                <p className="text-lg font-medium">
                  <TranslatedText>This helps your team:</TranslatedText>
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span><TranslatedText>Identify trends in slow-moving and high-velocity SKUs</TranslatedText></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span><TranslatedText>Prevent costly oversells and stockouts</TranslatedText></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span><TranslatedText>Maintain accurate counts across all sales channels</TranslatedText></span>
                  </li>
                </ul>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <TranslatedText>With a professional 3PL, you eliminate manual errors and gain a clear, real-time view of your product flow.</TranslatedText>
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
                  <TranslatedText>Fast, Reliable Distribution Across LA, California, and Nationwide</TranslatedText>
                </h2>
                <div className="w-20 h-0.5 bg-primary" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <TranslatedText>A third-party logistics partner ensures your shipments move efficiently across multiple routes whether you're fulfilling DTC orders, sending wholesale replenishments, or distributing bulk shipments.</TranslatedText>
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <TranslatedText>Los Angeles is one of the strongest shipping hubs in the country, giving brands access to:</TranslatedText>
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span><TranslatedText>Distributed networks for faster regional delivery</TranslatedText></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span><TranslatedText>Optimized carrier selection (UPS, FedEx, USPS, carriers local to LA)</TranslatedText></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span><TranslatedText>Multiple outbound strategies to support DTC, retail, and B2B</TranslatedText></span>
                  </li>
                </ul>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <TranslatedText>A professional 3PL coordinates every step so your orders leave accurately, on time, and without operational friction.</TranslatedText>
                </p>
              </div>
              <div className="h-96 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/blog-images/shipping-distribution-loading-dock.jpg"
                  alt="Aerial view of Los Angeles 3PL loading dock with trucks for fast distribution across California and nationwide shipping"
                  className="w-full h-full object-cover"
                />
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
        <section className="py-40 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-20">
              <div className="space-y-4 border-b border-border pb-10">
                <h4 className="text-xl font-bold"><TranslatedText>DTC & Lifestyle Brands</TranslatedText></h4>
                <p className="text-sm text-muted-foreground"><TranslatedText>Direct-to-consumer growth</TranslatedText></p>
                <p className="text-base leading-relaxed"><TranslatedText>Brands needing fast order turnaround and clean packaging</TranslatedText></p>
              </div>
              <div className="space-y-4 border-b border-border pb-10">
                <h4 className="text-xl font-bold"><TranslatedText>Beauty, Skincare, Cosmetics</TranslatedText></h4>
                <p className="text-sm text-muted-foreground"><TranslatedText>Temperature-sensitive products</TranslatedText></p>
                <p className="text-base leading-relaxed"><TranslatedText>Climate-controlled storage with product segregation</TranslatedText></p>
              </div>
              <div className="space-y-4 border-b border-border pb-10">
                <h4 className="text-xl font-bold"><TranslatedText>Apparel & Accessories</TranslatedText></h4>
                <p className="text-sm text-muted-foreground"><TranslatedText>Fashion and seasonal goods</TranslatedText></p>
                <p className="text-base leading-relaxed"><TranslatedText>Quick restocking and multi-channel distribution</TranslatedText></p>
              </div>
              <div className="space-y-4 border-b border-border pb-10">
                <h4 className="text-xl font-bold"><TranslatedText>Wellness & Supplement Brands</TranslatedText></h4>
                <p className="text-sm text-muted-foreground"><TranslatedText>Health-focused products</TranslatedText></p>
                <p className="text-base leading-relaxed"><TranslatedText>Compliance-ready handling and lot tracking</TranslatedText></p>
              </div>
              <div className="space-y-4 border-b border-border pb-10">
                <h4 className="text-xl font-bold"><TranslatedText>TikTok Shop Creators</TranslatedText></h4>
                <p className="text-sm text-muted-foreground"><TranslatedText>High-velocity social commerce</TranslatedText></p>
                <p className="text-base leading-relaxed"><TranslatedText>Rapid fulfillment for viral product launches</TranslatedText></p>
              </div>
              <div className="space-y-4 border-b border-border pb-10">
                <h4 className="text-xl font-bold"><TranslatedText>Influencer-Led Launches</TranslatedText></h4>
                <p className="text-sm text-muted-foreground"><TranslatedText>Creator-driven brands</TranslatedText></p>
                <p className="text-base leading-relaxed"><TranslatedText>Flexible fulfillment for launch campaigns</TranslatedText></p>
              </div>
              <div className="space-y-4 border-b border-border pb-10">
                <h4 className="text-xl font-bold"><TranslatedText>West Coast Focused Brands</TranslatedText></h4>
                <p className="text-sm text-muted-foreground"><TranslatedText>Regional distribution priority</TranslatedText></p>
                <p className="text-base leading-relaxed"><TranslatedText>1 to 2 day delivery across California</TranslatedText></p>
              </div>
              <div className="space-y-4 border-b border-border pb-10">
                <h4 className="text-xl font-bold"><TranslatedText>Amazon FBA Prep</TranslatedText></h4>
                <p className="text-sm text-muted-foreground"><TranslatedText>FBA-bound inventory</TranslatedText></p>
                <p className="text-base leading-relaxed"><TranslatedText>Professional prep, labeling, and shipment creation</TranslatedText></p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Blueprint Line Graphic Section */}
        <section className="pt-40 pb-32 bg-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, hsl(var(--border)) 49px, hsl(var(--border)) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, hsl(var(--border)) 49px, hsl(var(--border)) 50px)`
          }} />
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <h2 className="text-5xl font-light text-center mb-12">
              <TranslatedText>How a 3PL Streamlines Your Logistics in LA</TranslatedText>
            </h2>
            <div className="space-y-8 text-center">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                <TranslatedText>Los Angeles provides infrastructure that most logistics markets cannot match. LAX air freight terminals handle international shipments daily. The USPS distribution hub in City of Industry processes millions of parcels weekly. A dense courier network ensures same-day and next-day pickup across the metro area.</TranslatedText>
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                <TranslatedText>Warehouse clusters in Commerce, Vernon, Torrance, and Gardena create low-latency restock routes to Amazon fulfillment centers like ONT8, LGB8, and SNA4. For brands shipping West Coast inventory or managing FBA prep, LA provides the operational clarity and speed required to scale without friction.</TranslatedText>
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
                <h3 className="text-2xl font-bold mb-4"><TranslatedText>{useCase.title}</TranslatedText></h3>
                <p className="text-muted-foreground leading-relaxed"><TranslatedText>{useCase.description}</TranslatedText></p>
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
              <TranslatedText>Los Angeles vs Non-Los Angeles 3PLs</TranslatedText>
            </h2>
            <p className="text-lg text-white/60 text-center mb-16">
              <TranslatedText>Why location matters for e-commerce fulfillment</TranslatedText>
            </p>
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6"><TranslatedText>LA 3PL</TranslatedText></h3>
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
                    <span><TranslatedText>{item}</TranslatedText></span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6"><TranslatedText>Non-LA 3PL</TranslatedText></h3>
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
                    <span><TranslatedText>{item}</TranslatedText></span>
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
              <TranslatedText>Why Brands Choose a 3PL in Los Angeles</TranslatedText>
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
                  <p className="text-lg text-center"><TranslatedText>{reason}</TranslatedText></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 10: Bottom Minimal CTA */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <p className="text-lg text-muted-foreground mb-4">
              <TranslatedText>Explore more about fulfillment, logistics, and 3PL operations in Los Angeles.</TranslatedText>
            </p>
            <Link to="/why-choose-us" className="inline-flex items-center gap-2 text-primary hover:underline">
              <TranslatedText>Learn more about our services</TranslatedText>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ThreePLLosAngeles;
