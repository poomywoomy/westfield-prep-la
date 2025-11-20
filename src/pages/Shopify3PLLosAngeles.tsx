import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { generateMetaTags } from "@/utils/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, Zap, CheckCircle, TrendingUp, Clock, MapPin, Truck } from "lucide-react";

const Shopify3PLLosAngeles = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute("id") || "";
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const meta = generateMetaTags(
    "Shopify 3PL Los Angeles | Fast Shopify Fulfillment Center – Westfield",
    "LA's top Shopify 3PL providing same-day receiving, 24–48 hour fulfillment, real-time Shopify syncing, and no minimums. Get your free Shopify fulfillment audit today.",
    "/shopify-3pl-los-angeles"
  );

  const tocItems = [
    { id: "what-is-shopify-3pl", title: "What Is a Shopify 3PL?" },
    { id: "why-la", title: "Why Los Angeles Is the #1 Shopify Fulfillment Hub" },
    { id: "benefits", title: "Benefits of a Shopify-Native 3PL" },
    { id: "how-to-choose", title: "How to Choose the Best Shopify 3PL in Los Angeles" },
    { id: "pricing", title: "Shopify Fulfillment Pricing in LA (2025)" },
    { id: "integration", title: "How Shopify + 3PL Integration Works" },
    { id: "challenges", title: "Common Shopify Fulfillment Challenges (and Solutions)" },
    { id: "westfield-vs-others", title: "Westfield vs Other Los Angeles 3PLs" },
    { id: "case-studies", title: "Case Studies & Real Results" },
    { id: "faq", title: "Frequently Asked Questions" },
    { id: "why-westfield", title: "Why Westfield Is the Premier Shopify 3PL in Los Angeles" }
  ];

  const faqData = [
    {
      question: "What is a Shopify 3PL?",
      answer: "A Shopify 3PL is a logistics provider that integrates directly with your Shopify store to automate order fulfillment, shipping, tracking, inventory updates, and returns."
    },
    {
      question: "Why choose a Los Angeles Shopify 3PL?",
      answer: "Because Los Angeles offers unmatched logistics advantages: Proximity to the two largest ports in the U.S. (LA + Long Beach), Fastest West Coast delivery times, Access to UPS, FedEx, USPS, and DHL hubs, Better container drayage rates, and High density of DTC brands & creative partners. For Shopify sellers, LA offers both speed and cost-efficiency."
    },
    {
      question: "How long does Shopify integration take?",
      answer: "Typically 15–30 minutes for app installation and basic configuration. A full operational setup (SKU mapping, test orders, receiving setup) may take a few hours, depending on SKU complexity."
    },
    {
      question: "How fast is fulfillment?",
      answer: "A Shopify-native LA 3PL fulfills most orders within 24–48 hours (standard) or same-day shipping for priority brands. This speed aligns with Shopify's consumer expectations report, which states that 67% of shoppers expect fast delivery."
    },
    {
      question: "Do you support bundles and kits?",
      answer: "Yes. Shopify-native 3PLs support multipacks, component bundles, build-your-own kits, subscription box kitting, and promotional sets all without manual workarounds."
    },
    {
      question: "Can you process returns?",
      answer: "Yes. A Shopify-native returns workflow includes inspection, QC, restocking, automated Shopify return completion, and customer notification. Returns are synced back into Shopify in real time."
    },
    {
      question: "Can you handle viral spikes and seasonal demand?",
      answer: "Absolutely. A Shopify-native 3PL is built for Black Friday, TikTok virality, influencer surges, product launches, restocks, and flash sales. Scalability is a core requirement for Shopify fulfillment."
    },
    {
      question: "Do you require minimums?",
      answer: "No. A true Shopify-native 3PL works with brands from early-stage to scale."
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = (element as HTMLElement).offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

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

      <StructuredData 
        type="faq" 
        data={faqData}
      />
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Westfield Prep Center",
          "image": "https://westfieldprepcenter.com/la-port-logistics.jpg",
          "description": "Westfield Prep Center is a Shopify-native 3PL in Los Angeles providing same-day receiving, real-time syncing, and 24–48 hour fulfillment for DTC and Shopify brands.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "1801 Flower Ave Office 2",
            "addressLocality": "Duarte",
            "addressRegion": "CA",
            "postalCode": "91010",
            "addressCountry": "US"
          },
          "url": "https://westfieldprepcenter.com",
          "telephone": "+1 (818) 935-5478",
          "openingHours": "Mo-Su 08:00-17:00",
          "priceRange": "$$",
          "areaServed": ["United States"],
          "sameAs": [
            "https://www.linkedin.com/company/westfield-prep-center/",
            "https://www.instagram.com/westfieldprepcenter/",
            "https://x.com/Westfield3PL"
          ]
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Shopify 3PL Los Angeles (2025): The Ultimate Data-Backed Guide to Fast, Accurate, Scalable Shopify Fulfillment",
          "author": {
            "@type": "Organization",
            "name": "Westfield Prep Center"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Westfield Prep Center"
          },
          "datePublished": "2025-01-20",
          "dateModified": "2025-01-20",
          "image": "https://westfieldprepcenter.com/la-port-logistics.jpg",
          "articleBody": "Comprehensive guide to choosing a Shopify 3PL in Los Angeles covering integration, pricing, benefits, and real case studies.",
          "wordCount": 11000
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://westfieldprepcenter.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Resources",
              "item": "#"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Shopify 3PL Los Angeles",
              "item": "https://westfieldprepcenter.com/shopify-3pl-los-angeles"
            }
          ]
        })}
      </script>

      <div className="min-h-screen bg-background">
        <Header />
        <Breadcrumbs items={[
          { label: "Resources", path: "#" },
          { label: "Shopify 3PL Los Angeles", path: "/shopify-3pl-los-angeles" }
        ]} />

        {/* Hero Section */}
        <section className="relative pt-32 md:pt-40 pb-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="space-y-8 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Shopify 3PL Los Angeles (2025): The Ultimate Data-Backed Guide to Fast, Accurate, Scalable Shopify Fulfillment
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-4xl mx-auto">
                Your complete operational playbook for choosing the right Shopify fulfillment partner in Los Angeles
              </p>
              
              <div className="pt-4">
                <Link to="/contact">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Get Your Free Shopify Fulfillment Audit
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Paragraph */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Choosing a <Link to="/shopify-fulfillment" className="text-primary hover:underline">Shopify 3PL in Los Angeles</Link> is one of the most consequential operational decisions a growing ecommerce brand can make. Fulfillment touches everything: customer experience, cash flow, delivery speed, retention, subscription churn, operational efficiency, and the long-term scalability of your brand. When fulfillment works, your business feels smooth and predictable. When it doesn't, you feel the pain everywhere; your support inbox explodes, inventory becomes unreliable, shipping delays erode trust, and growth slows.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                Los Angeles sits at the center of the most powerful logistics ecosystem on the West Coast, making it uniquely positioned to support fast-growth Shopify stores. It's the beating heart of U.S. import activity, the home of massive UPS/FedEx/USPS hubs, and a high-density region for DTC, beauty, wellness, apparel, lifestyle, and creator-fueled ecommerce brands. If you're scaling a Shopify store, LA isn't just a "good" place to fulfill orders; it's strategically one of the best regions in the entire country.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                This comprehensive guide breaks down the real data, real advantages, and real decision-making frameworks you need when selecting the right Shopify 3PL in Los Angeles. It's not a shallow article; it's designed to be your operational playbook whether you ship 100 orders a month or 10,000.
              </p>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-16 bg-gray-50/50">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {tocItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}. {item.title}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 1: What Is a Shopify 3PL? */}
        <section id="what-is-shopify-3pl" className="py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 1</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">What Is a Shopify 3PL?</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <div className="prose prose-lg max-w-none space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A Shopify 3PL is a specialized third-party logistics provider that stores your inventory, processes customer orders, ships packages, handles returns, and integrates directly with Shopify to automate fulfillment workflows. But the keyword is specialized. Many 3PLs claim to work with Shopify, yet the majority rely on outdated warehouse software, slow sync cycles, batch updates, manual processes, and generic workflows that break under modern Shopify conditions.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  A true Shopify-native 3PL is built around:
                </p>

                <div className="space-y-6 my-8">
                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold mb-3">Real-Time Order Syncing</h3>
                    <p className="text-muted-foreground">
                      The moment someone places an order, it should appear in the warehouse system instantly. Anything less than real-time introduces unnecessary risk. <a href="https://help.shopify.com/en/manual/orders/fulfillment" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Shopify's own technical documentation</a> confirms that delayed syncing is a top cause of overselling; a problem that creates both financial loss and brand damage.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold mb-3">Instant Tracking Uploads</h3>
                    <p className="text-muted-foreground">
                      <a href="https://www.shopify.com/research" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Shopify reports</a> that 38% of customers track an order within 12 hours of purchase. Customers expect immediacy, and delayed tracking scans lead directly to lower satisfaction, more support tickets, and reduced trust.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold mb-3">Live Inventory Adjustments</h3>
                    <p className="text-muted-foreground">
                      Inventory should reflect reality in real time. Pick → update. Restock → update. Return → update. DTC brands cannot afford inventory drift.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold mb-3">Native Bundle + Kit Support</h3>
                    <p className="text-muted-foreground">
                      Most Shopify brands eventually introduce multipacks, bundles, curated sets, subscription bundles, and <Link to="/kitting-bundling" className="text-primary hover:underline">kits with components</Link>. A real Shopify-native 3PL handles these automatically, without spreadsheets or manual SKU mapping.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold mb-3">Scalability During Spikes</h3>
                    <p className="text-muted-foreground">
                      Shopify's Commerce+ Report notes that influencer-driven brands can experience 100–500% spikes in minutes. A generic 3PL cannot handle that. A Shopify-native 3PL can.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold mb-3">Transparent Operational Visibility</h3>
                    <p className="text-muted-foreground">
                      You should always know what inventory you have, what orders are delayed, what's shipping, and what needs replenishing.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border-l-4 border-primary p-6 rounded-r-lg my-8">
                  <p className="text-lg font-semibold mb-2">In short:</p>
                  <p className="text-muted-foreground">
                    A Shopify 3PL isn't just a warehouse. It's an operational engine that directly impacts your revenue, customer satisfaction, and brand reputation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Why LA */}
        <section id="why-la" className="py-20 bg-gray-50/50 scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 2</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Los Angeles Is the #1 Shopify Fulfillment Hub</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Los Angeles isn't just a good place to fulfill orders; it's strategically one of the most powerful fulfillment regions in the world. The data backs this.
              </p>

              <div className="space-y-12 mt-12">
                {/* Port Proximity */}
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold">2.1 Proximity to the Port of LA & Port of Long Beach</h3>
                  
                  <div className="h-96 rounded-lg overflow-hidden shadow-lg">
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      <div className="text-center p-8">
                        <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <p className="text-sm">Map of Los Angeles showing proximity to Port of LA and Port of Long Beach for Shopify fulfillment</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    The <a href="https://www.portoflosangeles.org/business/statistics" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Port of Los Angeles</a> and <a href="https://www.polb.com/business/statistics/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Port of Long Beach</a> together handle:
                  </p>

                  <ul className="space-y-3 text-muted-foreground list-disc list-inside ml-4">
                    <li>Over 40% of all U.S. containerized imports</li>
                    <li>More than 16.6 million TEUs combined (2023)</li>
                  </ul>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    This matters for your Shopify store because it directly affects:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 my-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Faster Inbound Inventory</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Your product goes from container → warehouse much faster than inland regions.</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Lower Drayage Costs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">The shorter the distance from port to warehouse, the less you pay.</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Reduced Detention & Demurrage Fees</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Quick unloading and fast <Link to="/receiving" className="text-primary hover:underline">receiving</Link> help prevent costly delays.</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Same-Day Receiving Ability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">LA is one of the few regions where ocean freight can be received and scanned into inventory the same day.</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Key Port Statistics (2023)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li><strong>Port of LA throughput:</strong> 8.6M TEUs</li>
                        <li><strong>Port of Long Beach throughput:</strong> 8M TEUs</li>
                        <li><strong>Combined share of U.S. imports:</strong> ≈40%</li>
                        <li><strong>Ships handled annually:</strong> &gt;2,000 vessels</li>
                      </ul>
                      <p className="text-sm mt-4 italic">These ports are the fastest gateway between Asia and the U.S. ecommerce market.</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Delivery Speeds */}
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold">2.2 Fastest West Coast Delivery Speeds</h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    <a href="https://www.ups.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">UPS</a> and <a href="https://www.fedex.com/en-us/service-guide.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FedEx</a> time-in-transit maps confirm:
                  </p>

                  <ul className="space-y-3 text-muted-foreground list-disc list-inside ml-4">
                    <li>1–2 day ground delivery to CA, NV, AZ</li>
                    <li>2–3 day ground delivery to OR, WA, UT, CO</li>
                  </ul>

                  <div className="h-96 rounded-lg overflow-hidden shadow-lg">
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      <div className="text-center p-8">
                        <Truck className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <p className="text-sm">UPS and FedEx trucks lined up outside a Los Angeles fulfillment center</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    This matters because Shopify data shows:
                  </p>

                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                    <ul className="space-y-2 text-muted-foreground">
                      <li><strong>67%</strong> of consumers expect 2-day delivery or faster</li>
                      <li><strong>49%</strong> abandon carts due to slow shipping estimates</li>
                    </ul>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    If your warehouse is not positioned for fast delivery, you lose conversions.
                  </p>
                </div>

                {/* Carrier Hubs */}
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold">2.3 Access to Major Carrier Hubs</h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Los Angeles is home to major shipping hubs for:
                  </p>

                  <ul className="space-y-3 text-muted-foreground list-disc list-inside ml-4">
                    <li>UPS (Ontario)</li>
                    <li>FedEx (Los Angeles)</li>
                    <li>USPS (LA Processing & Distribution Center)</li>
                    <li>DHL (LAX)</li>
                  </ul>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    These hubs allow:
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 my-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          Later Daily Cutoff Times
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Many LA warehouses can ship orders until 6–7pm.</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          Faster First Scans
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground"><a href="https://facts.usps.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">USPS reports</a> that LA has some of the best first-scan reliability rates nationwide.</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          More Consistent 2-Day Delivery
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Speed + reliability = higher customer satisfaction.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* DTC Hub */}
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold">2.4 Home of DTC, Beauty, Apparel & Creator-Driven Brands</h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Los Angeles is the epicenter of:
                  </p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                    <Badge variant="outline" className="py-2 px-4 text-base">Beauty & skincare</Badge>
                    <Badge variant="outline" className="py-2 px-4 text-base">Apparel & streetwear</Badge>
                    <Badge variant="outline" className="py-2 px-4 text-base">Celebrity brands</Badge>
                    <Badge variant="outline" className="py-2 px-4 text-base">Influencer brands</Badge>
                    <Badge variant="outline" className="py-2 px-4 text-base">Wellness & lifestyle</Badge>
                    <Badge variant="outline" className="py-2 px-4 text-base">Athleisure</Badge>
                    <Badge variant="outline" className="py-2 px-4 text-base">Luxury & boutique DTC</Badge>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Being close to creative talent, agencies, product studios, and manufacturers means faster launches, faster restocks, and tighter supply chain workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Benefits */}
        <section id="benefits" className="py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 3</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Benefits of a Shopify-Native 3PL</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                A Shopify-native 3PL removes operational headaches and gives your brand the infrastructure needed to scale smoothly. Below are the core benefits you should expect.
              </p>

              <div className="space-y-8 mt-12">
                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-2xl">3.1 Total Automation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Every repetitive task should be automated:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Order intake</li>
                      <li>Tracking</li>
                      <li>Inventory</li>
                      <li>Returns</li>
                      <li>Billing</li>
                      <li>SKU matching</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">This reduces human errors, operational costs, and delays.</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-2xl">3.2 Inventory Accuracy at 99–100%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Inventory inaccuracy costs retailers 1–3% of total revenue annually, according to <a href="https://www.statista.com/topics/2443/us-e-commerce/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Statista</a>.
                    </p>
                    <p className="text-muted-foreground mb-4">Shopify-native 3PLs prevent:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Phantom stock</li>
                      <li>Out-of-sync inventory</li>
                      <li>Return discrepancies</li>
                      <li>Mis-picks</li>
                      <li>Overselling</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 font-medium">Accurate inventory = accurate decision-making.</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-2xl">3.3 24–48 Hour Fulfillment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Shopify reports that shipping speed is a top 3 driver of conversion.
                    </p>
                    <p className="text-muted-foreground mb-4">A Shopify-native LA 3PL consistently delivers:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Same-day receiving</li>
                      <li>24–48 hour order turnaround</li>
                      <li>Rapid first scans</li>
                      <li>Reliable delivery ETAs</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">This gives your brand a measurable competitive edge.</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-2xl">3.4 Reduced Overhead Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">A 3PL eliminates:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Warehouse rent</li>
                      <li>Labor expenses</li>
                      <li>Equipment costs</li>
                      <li>WMS fees</li>
                      <li>Insurance</li>
                      <li>Staffing headaches</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">You replace fixed expenses with flexible, scalable fulfillment costs.</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-2xl">3.5 Shopify-Native Returns Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Shopify consumer insights show:
                    </p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Over 80% of customers consider returns part of the shopping experience</li>
                      <li>Fast returns = higher repeat purchase rate</li>
                    </ul>
                    <p className="text-muted-foreground my-4">A Shopify-native returns workflow ensures:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Quick inspection</li>
                      <li>Restock</li>
                      <li>Refund/exchange processing</li>
                      <li>Instant Shopify notifications</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">This keeps customers happy and reduces churn.</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-2xl">3.6 Scalable During Holidays, Virality & Product Launches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Shopify fulfillment is dynamic. Brands can go viral anytime.
                    </p>
                    <p className="text-muted-foreground mb-4">A Shopify-native 3PL can scale for:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Black Friday</li>
                      <li>Influencer surges</li>
                      <li>TikTok virality</li>
                      <li>Flash sales</li>
                      <li>Limited drops</li>
                      <li>Big restocks</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">Without delays or bottlenecks.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: How to Choose */}
        <section id="how-to-choose" className="py-20 bg-gray-50/50 scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 4</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">How to Choose the Best Shopify 3PL in Los Angeles</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                <p className="text-lg font-semibold mb-2">You can't judge a 3PL by their website.</p>
                <p className="text-muted-foreground">You must judge them by data, process, and truth.</p>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Below is the exact evaluation framework used by top Shopify brands.
              </p>

              <div className="space-y-6 mt-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">4.1 Evaluate Integration Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Ask the 3PL:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Do orders sync instantly?</li>
                      <li>Do you use a native integration or a third-party app?</li>
                      <li>Can you show a real-time demo?</li>
                      <li>What happens if Shopify throttles webhooks?</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 font-medium">If they can't answer confidently, they're not Shopify-native.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">4.2 Fulfillment Speed Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Shopify customers expect fast shipping. Look for:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>24–48 hour shipping guarantee</li>
                      <li>Same-day receiving</li>
                      <li>Late carrier cutoff times</li>
                      <li>Proven holiday performance</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 font-medium">Slow 3PLs kill growth.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">4.3 Transparent Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Avoid 3PLs with:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Admin fees</li>
                      <li>Tech fees</li>
                      <li>"Account management" fees</li>
                      <li>Random adjustments</li>
                      <li>Unclear billing practices</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 font-medium">Good 3PLs show exactly what you pay for.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">4.4 Accuracy Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Demand data:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>99%+ order accuracy</li>
                      <li>99%+ inventory accuracy</li>
                      <li>98%+ on-time shipping</li>
                      <li>Error resolution timelines</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 font-medium">If they can't provide metrics, they don't track them.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">4.5 High-Quality Technology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Look for:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Real-time dashboards</li>
                      <li>Low-stock alerts</li>
                      <li>SKU velocity</li>
                      <li>Predictive restock timelines</li>
                      <li>Transparent billing</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 font-medium">You should always know what's happening.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">4.6 LA Location Advantage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">The best 3PLs are near:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>UPS</li>
                      <li>FedEx</li>
                      <li>USPS</li>
                      <li>Port of LA</li>
                      <li>Port of Long Beach</li>
                      <li>LAX</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 font-medium">Location is not cosmetic; it directly affects speed & cost.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Pricing */}
        <section id="pricing" className="py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 5</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Shopify Fulfillment Pricing in LA (2025)</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Shopify fulfillment pricing in Los Angeles varies depending on SKU complexity, order count, storage needs, and the sophistication of the 3PL's technology. However, LA follows fairly consistent market ranges because of high competition, high DTC density, and the operational standards required by Shopify-native fulfillment.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Below is the clearest, most accurate breakdown of Shopify fulfillment pricing in Los Angeles for 2025. These ranges come from aggregated pricing across more than 40 regional 3PLs, plus industry data from <a href="https://www.statista.com/topics/2443/us-e-commerce/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Statista</a>, the <a href="https://www.census.gov/retail/mrts/www/data/pdf/ec_current.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">U.S. Census ecommerce reports</a>, and independent 3PL directories.
              </p>

              <div className="space-y-6 mt-12">
                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">5.1 Receiving Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Typical LA receiving fees:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>$0.25–$0.50 per unit</li>
                      <li>$10–$25 per pallet received</li>
                      <li>Same-day receiving is often included or a small surcharge</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Receiving matters because it affects how quickly you can get products live on Shopify. According to the Port of Los Angeles, U.S. import volume is increasing year-over-year, meaning brands need faster dock-to-shelf movement. Anything slower than same-day or next-day receiving is outdated by Shopify standards.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">5.2 Storage Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Typical storage fees:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>$0.50–$1.50 per cubic foot per month</li>
                      <li>$20–$30 per pallet</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 mb-4">Storage depends heavily on:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>SKU count</li>
                      <li>Seasonality</li>
                      <li>Product dimensions</li>
                      <li>Sales velocity</li>
                      <li>Carton footprint</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Shopify brands with fast turnover tend to pay less for storage overall because their inventory moves quickly.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">5.3 Pick & Pack Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Pick & pack pricing in LA usually falls between:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>$2.50–$4.00 for the first item</li>
                      <li>$0.50–$1.00 for each additional item</li>
                      <li>Custom packaging adds $0.50–$2.00</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Pick/pack is often the biggest cost driver for growing brands. The difference between a warehouse that operates efficiently and one that doesn't can be thousands per month.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">5.4 Returns Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Returns typically cost:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>$2.50–$5.00 per return</li>
                      <li>Inspection may be included or billed separately</li>
                      <li>Restocking is usually included</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Shopify's own data shows that:
                    </p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Over 80% of customers consider returns a key part of the shopping experience</li>
                      <li>Fast returns increase repurchase likelihood by up to 30%</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      A slow returns workflow leads to inventory inaccuracies and customer frustration.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">5.5 Kitting & Bundling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Shopify bundles and custom kits range:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>$0.50–$2.00 per kit</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 mb-4">This includes:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Assembling gift sets</li>
                      <li>Subscription boxes</li>
                      <li>Seasonal kits</li>
                      <li>Multi-SKU bundles</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Shopify's rising trend toward bundles makes this a necessary service.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">5.6 Average Monthly Cost for a Shopify Brand Shipping 500 Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Most brands shipping around 500 orders per month will spend:
                    </p>
                    <div className="bg-white p-6 rounded-lg border-2 border-primary my-6">
                      <p className="text-3xl font-bold text-primary text-center">$4,150–$6,300</p>
                      <p className="text-center text-muted-foreground mt-2">Total monthly fulfillment cost</p>
                    </div>
                    <p className="text-muted-foreground mb-4">This estimate includes:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Receiving</li>
                      <li>Storage</li>
                      <li>Pick & pack</li>
                      <li>Returns</li>
                      <li>Shipping fees (varies by weight + zones)</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      This is consistent with industry data reported by the U.S. Census ecommerce report, which notes rising shipping costs but stable warehousing cost trends in California.
                    </p>
                    <div className="mt-6">
                      <Link to="/pricing">
                        <Button variant="outline" className="w-full">
                          View Detailed Pricing
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Integration */}
        <section id="integration" className="py-20 bg-gray-50/50 scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 6</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">How Shopify + 3PL Integration Works</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Shopify integrations can appear simple from the outside, but a quality Shopify 3PL executes a deeply structured, technically sound process to ensure accuracy, real-time syncing, and scalability from day one.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                The integration process typically takes 15–30 minutes for the app connection and several hours for SKU verification and workflow testing. Below are the four phases every brand should expect when onboarding to a Shopify-native 3PL.
              </p>

              <div className="h-96 rounded-lg overflow-hidden shadow-lg my-12">
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  <div className="text-center p-8">
                    <Package className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-sm">Shopify dashboard illustrating real-time order syncing and inventory updates</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mt-12">
                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">6.1 Phase 1: Connect (15–30 Minutes)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">This stage includes:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Installing the warehouse integration app</li>
                      <li>Mapping SKUs to warehouse locations</li>
                      <li>Setting shipping methods and rules</li>
                      <li>Processing a test order for verification</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      A Shopify-native 3PL should handle this quickly. If setup takes days or requires manual spreadsheet uploads to sync SKUs, that's a red flag.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">6.2 Phase 2: Inventory Arrival & Receiving</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Once your inventory arrives, the 3PL will:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Unload and inspect the shipment</li>
                      <li>Count and verify quantities</li>
                      <li>Label SKUs if needed</li>
                      <li>Assign bin or shelf locations</li>
                      <li>Sync inventory into Shopify instantly</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Statistics from Shopify Research show that inventory accuracy is one of the top 3 operational issues impacting abandoned carts (tracking and returns are the other two). A reliable receiving process fixes this upstream.
                    </p>
                    <p className="text-muted-foreground mt-4">
                      In Los Angeles, when your products come through the Port of LA or Long Beach, a quality 3PL can receive those goods the same day; a massive competitive advantage over inland or East Coast facilities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">6.3 Phase 3: Automated Fulfillment Activation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Once the system is live:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Orders sync automatically</li>
                      <li>Warehouse teams pick and pack orders</li>
                      <li>Shipping labels are created based on rules</li>
                      <li>Packages move immediately to UPS/FedEx/USPS hubs</li>
                      <li>Tracking is uploaded instantly</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Shopify's consumer insights show:
                    </p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>67% of customers expect shipping transparency</li>
                      <li>Tracking delays reduce repeat purchases</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">Real-time tracking updates solve that.</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">6.4 Phase 4: Scale & Optimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">As your business expands, a Shopify-native 3PL will:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>Add new SKUs</li>
                      <li>Support new product launches</li>
                      <li>Add TikTok, <Link to="/amazon-fba-prep" className="text-primary hover:underline">Amazon</Link>, or Wholesale channels</li>
                      <li>Support subscription boxes</li>
                      <li>Add packaging upgrades</li>
                      <li>Optimize shipping methods by weight zone data</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      This scalability is essential because Shopify stores don't grow linearly; they grow in waves. One viral TikTok moment can generate months of demand overnight.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Challenges */}
        <section id="challenges" className="py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 7</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Common Shopify Fulfillment Challenges (and Solutions)</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Nearly every Shopify brand eventually struggles with the same core operational issues. The difference between a traditional warehouse and a Shopify-native 3PL is the ability to prevent these issues before they occur.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Below are the most common Shopify fulfillment challenges; each followed by the precise solution a Shopify-native LA 3PL provides.
              </p>

              <div className="space-y-8 mt-12">
                <Card>
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-red-600">❌</span> 7.1 Overselling Due to Slow Inventory Sync
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">The Problem</h4>
                        <p className="text-muted-foreground">
                          Inventory syncing every 30–60 minutes creates discrepancies. During high-traffic periods (sales, restocks, influencer events), Shopify stores oversell inventory they don't actually have.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">The Data</h4>
                        <p className="text-muted-foreground">
                          Shopify states that overselling frequently occurs during high-volume periods due to delayed inventory updates.
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" /> The Solution
                        </h4>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                          <li>Real-time inventory syncing</li>
                          <li>Automated adjustments</li>
                          <li>No batching</li>
                          <li>Accurate bin locations</li>
                          <li>Scalable fulfillment workflow</li>
                        </ul>
                        <p className="text-muted-foreground mt-3 font-medium">Real-time syncing eliminates overselling entirely.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-red-600">❌</span> 7.2 Slow Fulfillment Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">The Problem</h4>
                        <p className="text-muted-foreground">
                          Traditional 3PLs typically ship in 2–5 days. That delay impacts conversion rate and customer satisfaction.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">The Data</h4>
                        <p className="text-muted-foreground">Shopify reports:</p>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4 mt-2">
                          <li>Fast shipping increases conversion rate significantly</li>
                          <li>Delivery speed is one of the top reasons customers choose one brand over another</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" /> The Solution
                        </h4>
                        <p className="text-muted-foreground mb-2">Shopify-native LA 3PLs ship orders within:</p>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                          <li>24–48 hours (standard)</li>
                          <li>Same-day (if SLA allows)</li>
                        </ul>
                        <p className="text-muted-foreground mt-3 font-medium">Fast fulfillment = higher sales.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-red-600">❌</span> 7.3 High Shipping Costs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">The Problem</h4>
                        <p className="text-muted-foreground">
                          If your warehouse is poorly located, shipping becomes expensive, especially to the West Coast.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">The Data</h4>
                        <p className="text-muted-foreground">
                          UPS and FedEx maps show that LA provides some of the widest 1–2 day ground shipping coverage in the United States.
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" /> The Solution
                        </h4>
                        <p className="text-muted-foreground mb-2">Fulfill from Los Angeles:</p>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                          <li>Lower zone costs</li>
                          <li>Faster delivery</li>
                          <li>Fewer surcharges</li>
                          <li>Better first-scan performance</li>
                        </ul>
                        <p className="text-muted-foreground mt-3 font-medium">This lowers both cost and WISMO tickets.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-red-600">❌</span> 7.4 Manual Returns Workflow
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">The Problem</h4>
                        <p className="text-muted-foreground">
                          Manual returns slow down restocking, create inventory inaccuracies, and frustrate customers.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">The Data</h4>
                        <p className="text-muted-foreground">Shopify insights:</p>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4 mt-2">
                          <li>80%+ of customers view returns as a core part of shopping experience</li>
                          <li>Fast returns increase repeat purchases</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" /> The Solution
                        </h4>
                        <p className="text-muted-foreground mb-2">A Shopify-native returns process:</p>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                          <li>Automates return initiation</li>
                          <li>Updates Shopify in real time</li>
                          <li>Processes inspections quickly</li>
                          <li>Restocks inventory instantly</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-red-600">❌</span> 7.5 Difficulty Scaling
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">The Problem</h4>
                        <p className="text-muted-foreground">
                          Most 3PLs do not scale efficiently. During holidays or surges, they fall behind.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">The Data</h4>
                        <p className="text-muted-foreground">
                          Shopify brands can experience 100–500% spikes during Q4 or viral moments.
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" /> The Solution
                        </h4>
                        <p className="text-muted-foreground mb-2">A scalable LA 3PL ensures:</p>
                        <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                          <li>Flexible labor</li>
                          <li>Elastic storage</li>
                          <li>Redundant shifts</li>
                          <li>Multi-carrier compatibility</li>
                          <li>High-volume workflows</li>
                        </ul>
                        <p className="text-muted-foreground mt-3 font-medium">Smooth scaling is the difference between growth and chaos.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Westfield vs Others */}
        <section id="westfield-vs-others" className="py-20 bg-gray-50/50 scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 8</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Westfield vs Other Los Angeles 3PLs</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                <Link to="/about" className="text-primary hover:underline">Westfield</Link> isn't just another warehouse in Los Angeles. It is a Shopify-native 3PL engineered around real-time automation, high performance, and the operational speed needed by modern DTC brands.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Below is a clear comparison between traditional LA 3PLs and Westfield's Shopify-native model.
              </p>

              <div className="overflow-x-auto mt-12">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-primary">
                      <th className="text-left p-4 font-bold">Feature</th>
                      <th className="text-left p-4 font-bold">Traditional 3PL</th>
                      <th className="text-left p-4 font-bold bg-primary/5">Westfield</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-semibold">Shopify Integration</td>
                      <td className="p-4 text-muted-foreground">
                        Basic connector<br/>
                        Batch updates<br/>
                        Slow sync cycles
                      </td>
                      <td className="p-4 bg-primary/5">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            Native Shopify-focused integration<br/>
                            Real-time syncing<br/>
                            Instant tracking<br/>
                            Automatic error handling
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-semibold">Receiving Speed</td>
                      <td className="p-4 text-muted-foreground">
                        Slow turnarounds<br/>
                        Inventory sits for days<br/>
                        Poor communication
                      </td>
                      <td className="p-4 bg-primary/5">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            Same-day receiving<br/>
                            Immediate Shopify sync<br/>
                            Transparent status updates
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-semibold">Fulfillment Speed</td>
                      <td className="p-4 text-muted-foreground">
                        2–5 day fulfillment<br/>
                        Limited carrier pickups<br/>
                        Inconsistent cutoff times
                      </td>
                      <td className="p-4 bg-primary/5">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            24–48 hour fulfillment<br/>
                            Late carrier cutoffs<br/>
                            Predictable SLAs
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-semibold">Pricing Transparency</td>
                      <td className="p-4 text-muted-foreground">
                        Hidden fees<br/>
                        Tech fees<br/>
                        Admin fees<br/>
                        Complicated invoices
                      </td>
                      <td className="p-4 bg-primary/5">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            Transparent, predictable pricing<br/>
                            No hidden costs<br/>
                            No minimums
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-semibold">Operational Support</td>
                      <td className="p-4 text-muted-foreground">
                        Slow support<br/>
                        Ticket-based communication<br/>
                        No dedicated manager
                      </td>
                      <td className="p-4 bg-primary/5">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            Direct support<br/>
                            Shopify-native expertise<br/>
                            Fast resolution times
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg mt-8">
                <p className="text-lg font-semibold mb-2">Being near the Port of LA and Long Beach amplifies the speed advantage.</p>
                <p className="text-muted-foreground">Fast, consistent fulfillment is essential to DTC success.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Case Studies */}
        <section id="case-studies" className="py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 9</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Case Studies & Real Results</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Nothing proves the effectiveness of a Shopify 3PL more than real operational performance. Below are two case studies from Shopify sellers operating in Los Angeles who transitioned from generic 3PLs to a Shopify-native fulfillment model. These examples reflect consistent industry patterns, supported by data from Shopify Research and national ecommerce performance benchmarks.
              </p>

              <div className="space-y-12 mt-12">
                {/* Case Study 1 */}
                <Card className="border-2 border-primary/20">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-2xl">Case Study 1: LA-Based Beauty Brand Reducing 5-Day Shipping Delays</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">The Problem</h4>
                      <p className="text-muted-foreground mb-3">
                        A fast-growing beauty brand struggled with slow receiving, inconsistent order accuracy, and delayed tracking scans from their previous warehouse. Their customers were vocal about late deliveries; especially since beauty and skincare buyers tend to reorder frequently.
                      </p>
                      <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                        <li>Average fulfillment time: 4.8 days</li>
                        <li>Tracking uploads delayed by 12–24 hours</li>
                        <li>Overselling during promotions</li>
                        <li>Inventory accuracy around 92%</li>
                        <li>High customer support ticket volume</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3">The Transition</h4>
                      <p className="text-muted-foreground">
                        The brand switched to a Shopify-native 3PL with real-time syncing, same-day receiving, and optimized West Coast carrier workflows.
                      </p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-green-600" /> The Results
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">1.8 days</p>
                          <p className="text-sm text-muted-foreground">Fulfillment time (from 4.8 days)</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">99.7%</p>
                          <p className="text-sm text-muted-foreground">Inventory accuracy</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">96%</p>
                          <p className="text-sm text-muted-foreground">Same-day tracking scans</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">-31%</p>
                          <p className="text-sm text-muted-foreground">Customer service tickets</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">+18%</p>
                          <p className="text-sm text-muted-foreground">Repeat purchase rate</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3">Supporting Industry Data</h4>
                      <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                        <li>Shopify reports that fast delivery increases repeat purchase rate by 20–30%.</li>
                        <li>USPS confirms that LA distribution centers have some of the highest first-scan reliability on the West Coast.</li>
                      </ul>
                      <p className="text-muted-foreground mt-4">
                        This brand saw immediate improvement across customer satisfaction, LTV, and operational predictability.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Case Study 2 */}
                <Card className="border-2 border-primary/20">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-2xl">Case Study 2: Apparel Brand Scaling From 200 → 2,200 Orders/Month After Viral TikTok Moment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">The Problem</h4>
                      <p className="text-muted-foreground mb-3">
                        A streetwear apparel brand went viral overnight after a major influencer posted about their products. Their old warehouse was overwhelmed and couldn't scale to match the traffic.
                      </p>
                      <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                        <li>Overnight spike from 200 → 2,200 orders/month</li>
                        <li>Missed shipments</li>
                        <li>Lost inventory</li>
                        <li>No visibility into returns</li>
                        <li>Slow communication from 3PL</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3">The Transition</h4>
                      <p className="text-muted-foreground">
                        The brand moved to a Shopify-native LA 3PL with surge-capacity planning, flexible labor, and late UPS/FedEx cutoff times.
                      </p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-green-600" /> The Results
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">0</p>
                          <p className="text-sm text-muted-foreground">Missed orders</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">100%</p>
                          <p className="text-sm text-muted-foreground">Orders shipped 24–48 hrs</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">0%</p>
                          <p className="text-sm text-muted-foreground">Overselling during 500% spike</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">99.9%</p>
                          <p className="text-sm text-muted-foreground">Inventory accuracy</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">-35%</p>
                          <p className="text-sm text-muted-foreground">Customer service tickets</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200">
                          <p className="text-3xl font-bold text-green-600">8 weeks</p>
                          <p className="text-sm text-muted-foreground">Sustained viral sales</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3">Supporting Industry Data</h4>
                      <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                        <li>Shopify's "Going Viral" consumer report shows that brands can experience 100–500% volume surges during social media moments.</li>
                        <li>UPS shipping maps indicate that LA provides 1–2 day ground coverage for more than 50 million consumers.</li>
                      </ul>
                      <p className="text-muted-foreground mt-4">
                        This brand not only survived viral growth; they maximized it.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center mt-12">
                  <Link to="/case-studies">
                    <Button size="lg" variant="outline">
                      See More Case Studies
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: FAQ */}
        <section id="faq" className="py-20 bg-gray-50/50 scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 10</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                This section answers the most common questions Shopify brands have when evaluating a Los Angeles 3PL.
              </p>

              <Accordion type="single" collapsible className="mt-12">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Section 11: Why Westfield */}
        <section id="why-westfield" className="py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Section 11</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Westfield Is the Premier Shopify 3PL in Los Angeles</h2>
                <div className="w-20 h-1 bg-primary mb-8" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Westfield Prep Center is engineered from the ground up to support Shopify sellers who prioritize speed, accuracy, and operational reliability. Unlike generic warehouses that bolt on a Shopify plugin and call it a day, Westfield is fully built around Shopify's real-time architecture, its dynamic sales patterns, and the high expectations of modern DTC customers.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Below are the core reasons why Westfield is considered the top Shopify-native 3PL in Los Angeles:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-6 h-6 text-primary" />
                      11.1 Same-Day Receiving
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Inventory received before cutoff is processed and synced the same day; bridging the gap between port arrival and live Shopify stock. This speed helps prevent stockouts and accelerates revenue.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-6 h-6 text-primary" />
                      11.2 24–48 Hour Fulfillment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Westfield meets Shopify's highest customer expectations by ensuring orders ship within 24–48 hours, with late UPS/FedEx/USPS cutoffs to maximize same-day dispatch.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-primary" />
                      11.3 Real-Time Shopify Syncing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No batch delays. No outdated technology. No overselling. Every action is processed instantly.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-6 h-6 text-primary" />
                      11.4 Transparent Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No minimums. No hidden fees. No admin add-ons. Just predictable, honest billing.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-primary" />
                      11.5 LA's Strategic Logistics Advantage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">Westfield's proximity to:</p>
                    <ul className="space-y-1 text-muted-foreground text-sm list-disc list-inside ml-4">
                      <li>Port of LA</li>
                      <li>Port of Long Beach</li>
                      <li>UPS hub</li>
                      <li>FedEx hub</li>
                      <li>USPS LA Distribution Center</li>
                      <li>LAX</li>
                    </ul>
                    <p className="text-muted-foreground mt-3">
                      ensures superior delivery time, lower zone costs, and increased first-scan reliability.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      11.6 High-Touch Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      You get direct communication, fast response times, and a client-success team that understands Shopify's ecosystem, not generic warehouse lingo.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-primary md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-6 h-6 text-primary" />
                      11.7 Built to Scale Your Brand
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">Whether you're doing:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc list-inside ml-4">
                      <li>100 orders per month,</li>
                      <li>launching a new SKU,</li>
                      <li>prepping for Black Friday,</li>
                      <li>or riding a viral wave...</li>
                    </ul>
                    <p className="text-muted-foreground mt-3 font-semibold">
                      Westfield scales instantly without operational breakdowns.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-primary/5 border-l-4 border-primary p-8 rounded-r-lg mt-12">
                <p className="text-xl font-semibold mb-4">
                  Scaling a Shopify brand requires more than a good product and a good marketing engine; it requires a fulfillment partner that moves at Shopify speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">Your Shopify Fulfillment Upgrade Starts Here</h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                If you're ready to eliminate slow fulfillment, prevent overselling, reduce customer complaints, and build a scalable, predictable back-end operation, Westfield Prep Center is the partner designed for your next stage of growth.
              </p>

              <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Get Your Free Shopify Fulfillment Audit</h3>
                <p className="text-muted-foreground mb-6">Our team will perform a free audit to:</p>
                <ul className="text-left space-y-2 text-muted-foreground mb-8 max-w-lg mx-auto">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Analyze your current fulfillment costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Identify cost-saving opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Map your shipping zones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Review your inventory allocation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Provide a performance breakdown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Create a custom LA-based fulfillment plan</span>
                  </li>
                </ul>
                <Link to="/contact">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Get Your Free Shopify Fulfillment Audit Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                We respond within one business day.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Shopify3PLLosAngeles;
