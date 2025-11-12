import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reviews from "@/components/Reviews";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LiveMetrics from "@/components/LiveMetrics";
import ResultsSnapshot from "@/components/ResultsSnapshot";
import { Zap, Package, Camera, Truck, Award, CheckCircle, Store, Heart, Clock, BarChart } from "lucide-react";

const ShopifyFulfillment = () => {
  const navigate = useNavigate();

  const faqData = [
    { question: "What are your same-day cutoff times?", answer: "Orders placed before 2 PM PST ship the same business day. Orders after 2 PM ship the next business day." },
    { question: "Can you handle custom packaging and branded inserts?", answer: "Absolutely. We offer custom kitting, branded tissue paper, thank-you cards, promotional inserts, and gift wrapping services." },
    { question: "Is there a minimum order quantity or monthly volume requirement?", answer: "We work with brands of all sizes. Contact us to discuss your specific volume and we'll create a custom pricing plan." },
    { question: "How does your pricing model work?", answer: "We charge per-unit pricing based on your services: receiving, pick/pack, kitting, storage, and shipping. No hidden fees. Get a custom quote today." }
  ];

  const serviceData = {
    serviceType: "FulfillmentService",
    name: "Shopify Fulfillment Services",
    description: "Fast, accurate pick-pack, branded unboxing, same-day cutoffs for Shopify stores.",
    features: ["Photo-Proof QC", "Same-Day Shipping", "Custom Kitting", "Branded Packaging", "Inventory Management"]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shopify Prep Center in Los Angeles | DTC Fulfillment & Order Processing - Westfield</title>
        <meta name="description" content="Los Angeles Shopify prep center offering same-day order fulfillment, branded packaging, and inventory management. Trusted Shopify prep center serving LA and Southern California sellers." />
        <link rel="canonical" href="https://westfieldprepcenter.com/shopify-fulfillment" />
        <meta property="og:url" content="https://westfieldprepcenter.com/shopify-fulfillment" />
        <meta property="og:type" content="article" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Shopify Fulfillment", path: "/shopify-fulfillment" }]} />
        
        <main className="flex-1">
          {/* Hero Section - Shopify Brand-Focused Theme */}
          <section className="relative py-24 mt-16 overflow-hidden">
            <div className="absolute inset-0 bg-[hsl(var(--shopify-accent))]" />
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--shopify-blue))]/15 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--shopify-teal))]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[hsl(var(--shopify-border))] rounded-full px-4 py-2 mb-6 shadow-sm">
                  <Store className="h-4 w-4 text-[hsl(var(--shopify-blue))]" />
                  <span className="text-sm font-medium text-[hsl(var(--shopify-blue-dark))]">Shopify Fulfillment Partner</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--shopify-blue))] via-[hsl(var(--shopify-teal))] to-[hsl(var(--shopify-blue-dark))] bg-clip-text text-transparent">
                  Los Angeles Shopify Prep Center for DTC Brands
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Our <a href="/why-choose-us" className="text-primary hover:underline">Los Angeles Shopify prep center</a> specializes in fast, accurate pick-pack, branded unboxing experiences, and same-day cutoffs. As a dedicated Shopify prep center, we help DTC brands scale with confidence. <a href="/faq" className="text-primary hover:underline">See our prep center services FAQ</a>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--shopify-blue))] to-[hsl(var(--shopify-teal))] hover:opacity-90 text-white shadow-lg" onClick={() => navigate("/contact")}>
                    Get a Quote
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Value Props - Professional Brand Cards */}
          <section className="py-20 bg-gradient-to-b from-background via-[hsl(var(--shopify-accent))]/50 to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Why DTC Brands Choose Our Shopify Prep Center in Los Angeles</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Elevate your brand with prep center capabilities that match your vision
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="border-[hsl(var(--shopify-border))] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group bg-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--shopify-blue))]/10 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-[hsl(var(--shopify-blue))] to-[hsl(var(--shopify-blue-dark))] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Lightning Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Same-day cutoffs and next-day fulfillment for orders placed before 2 PM PST.</p>
                  </CardContent>
                </Card>

                <Card className="border-[hsl(var(--shopify-border))] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group bg-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--shopify-teal))]/10 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-[hsl(var(--shopify-teal))] to-[hsl(var(--shopify-teal-dark))] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Brand Excellence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Custom kitting, branded inserts, and premium unboxing experiences that wow.</p>
                  </CardContent>
                </Card>

                <Card className="border-[hsl(var(--shopify-border))] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group bg-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--shopify-blue))]/10 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-[hsl(var(--shopify-blue-dark))] to-[hsl(var(--shopify-blue))] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Quality Proof</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Every shipment documented with photos for complete transparency and peace of mind.</p>
                  </CardContent>
                </Card>

                <Card className="border-[hsl(var(--shopify-border))] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group bg-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--shopify-teal))]/10 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-[hsl(var(--shopify-teal-dark))] to-[hsl(var(--shopify-teal))] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Truck className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Fast Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Strategic LA location for lightning-fast shipping to all US markets.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our Fulfillment Process</h2>
              <div className="max-w-4xl mx-auto space-y-6">
                {[
                  { step: 1, title: "Receiving", desc: "Inbound shipments received and checked in with ASN verification" },
                  { step: 2, title: "ASN Check-in", desc: "Advanced shipping notice cross-referenced with physical inventory" },
                  { step: 3, title: "QC with Photos", desc: "Quality inspection documented with timestamped photos" },
                  { step: 4, title: "Pick/Pack", desc: "Accurate order picking and custom packaging per your specifications" },
                  { step: 5, title: "Inserts/Branding", desc: "Branded materials, thank-you cards, and promotional inserts included" },
                  { step: 6, title: "Ship Same Day", desc: "Orders placed before 2 PM PST ship the same business day" },
                ].map((item) => (
                  <Card key={item.step}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                          {item.step}
                        </div>
                        <CardTitle>{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Core Capabilities */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Complete Fulfillment Solutions</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Everything you need to deliver exceptional customer experiences
                </p>
              </div>
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Package, title: "Order Fulfillment", desc: "Fast, accurate pick and pack services with same-day shipping cutoffs" },
                  { icon: BarChart, title: "Inventory Management", desc: "Real-time tracking and updates across all your sales channels" },
                  { icon: Heart, title: "Custom Branding", desc: "Custom kitting and bundle assembly that reflects your brand identity" },
                  { icon: CheckCircle, title: "Quality Control", desc: "Photo-documented inspections and quality reports for every order" },
                  { icon: Truck, title: "Fast Shipping", desc: "Strategic location ensures quick delivery to all US markets" },
                  { icon: Award, title: "Premium Packaging", desc: "Branded inserts, gift wrapping, and premium unboxing experiences" },
                ].map((item, idx) => (
                  <Card key={idx} className="border-[hsl(var(--shopify-border))] hover:border-[hsl(var(--shopify-blue))]/40 hover:shadow-lg transition-all bg-white">
                    <CardHeader>
                      <item.icon className="h-10 w-10 text-[hsl(var(--shopify-blue))] mb-2" />
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Live Metrics */}
          <LiveMetrics 
            metrics={[
              { label: "Orders Fulfilled This Year", value: 400000, type: "counter" },
              { label: "Same-Day Ship Rate", value: 99.2, type: "percentage" },
              { label: "Average Order Accuracy", value: 99.8, type: "percentage" }
            ]}
            platformTheme="shopify"
          />

          {/* Results Snapshot */}
          <ResultsSnapshot 
            results={[
              {
                industry: "Beauty & Skincare",
                challenge: "High-volume DTC brand needed same-day fulfillment for flash sales",
                solution: "Implemented rapid pick-pack workflow with custom branded packaging",
                results: "50% faster order processing, 99.9% accuracy maintained during peak"
              },
              {
                industry: "Fashion & Apparel",
                challenge: "Subscription box company required custom kitting and branded inserts",
                solution: "Dedicated kitting station with photo QC for every box assembly",
                results: "Zero assembly errors, 100% positive unboxing feedback"
              },
              {
                industry: "Home Goods",
                challenge: "Multi-channel seller needed real-time inventory sync across platforms",
                solution: "Integrated inventory management with automated stock updates",
                results: "Eliminated overselling, 24hr inventory accuracy guarantee"
              }
            ]}
            platformTheme="shopify"
          />

          {/* Capabilities */}
          <section className="py-20 bg-gradient-to-b from-[hsl(var(--shopify-accent))]/40 to-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Additional Capabilities</h2>
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                {[
                  "Lot and batch tracking for compliance",
                  "Gift wrapping and special packaging",
                  "Seasonal promotional inserts",
                  "Inventory cycle counts and audits",
                  "Multi-channel inventory management",
                  "Custom SKU configuration",
                ].map((capability, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-white backdrop-blur-sm border border-[hsl(var(--shopify-border))] hover:border-[hsl(var(--shopify-blue))]/40 hover:shadow-md transition-all">
                    <CheckCircle className="h-6 w-6 text-[hsl(var(--shopify-teal))] mt-1 flex-shrink-0" />
                    <p className="text-lg">{capability}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Reviews />

          {/* FAQ */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What are your same-day cutoff times?</AccordionTrigger>
                    <AccordionContent>
                      Orders placed before 2 PM PST ship the same business day. Orders after 2 PM ship the next business day.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can you handle custom packaging and branded inserts?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely. We offer custom kitting, branded tissue paper, thank-you cards, promotional inserts, and gift wrapping services.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is there a minimum order quantity or monthly volume requirement?</AccordionTrigger>
                    <AccordionContent>
                      We work with brands of all sizes. Contact us to discuss your specific volume and we'll create a custom pricing plan.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How does your pricing model work?</AccordionTrigger>
                    <AccordionContent>
                      We charge per-unit pricing based on your services: receiving, pick/pack, kitting, storage, and shipping. No hidden fees. Get a custom quote today.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Do you integrate with Shopify apps like Klaviyo and Recharge?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we integrate with major Shopify apps for email marketing, subscriptions, and more. Our system syncs seamlessly with your tech stack.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>Can you handle subscription box fulfillment for Shopify?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely. We specialize in subscription box kitting with custom inserts, branded packaging, and recurring order management.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-7">
                    <AccordionTrigger>What shipping carriers do you use for Shopify orders?</AccordionTrigger>
                    <AccordionContent>
                      We use USPS, UPS, FedEx, and DHL for domestic and international shipping, with carrier selection based on speed and cost optimization.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-8">
                    <AccordionTrigger>Do you offer international Shopify fulfillment?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we ship worldwide with customs documentation, duty calculations, and international carrier partnerships for smooth global delivery.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-9">
                    <AccordionTrigger>Can you handle pre-orders and backorders?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we can hold pre-orders and ship when inventory arrives, with automated notifications to keep your customers informed.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-10">
                    <AccordionTrigger>What's your accuracy rate for Shopify order fulfillment?</AccordionTrigger>
                    <AccordionContent>
                      We maintain 99.8% order accuracy with photo proof QC on every shipment. Every order is documented before leaving our facility.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-11">
                    <AccordionTrigger>Do you support split shipments and partial fulfillment?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we can split orders across multiple shipments or partially fulfill based on available stock, with automatic customer notifications.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-12">
                    <AccordionTrigger>Can you handle gift messages and gift wrapping?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer gift wrapping, custom messages, premium packaging, and special occasion inserts for a personalized experience.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-13">
                    <AccordionTrigger>How do you manage inventory across multiple Shopify stores?</AccordionTrigger>
                    <AccordionContent>
                      Our system syncs inventory in real-time across all your Shopify stores automatically, preventing overselling and maintaining accurate stock levels.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-14">
                    <AccordionTrigger>Do you offer same-day Shopify order processing?</AccordionTrigger>
                    <AccordionContent>
                      Yes, orders received before 2PM PST are processed and shipped the same business day for maximum customer satisfaction.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-15">
                    <AccordionTrigger>Can you handle fragile or oversized Shopify products?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we specialize in custom packaging solutions for delicate and bulky items, including bubble wrap, foam inserts, and reinforced boxes.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          {/* CTA - Professional Theme */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--shopify-blue))] via-[hsl(var(--shopify-teal))] to-[hsl(var(--shopify-blue-dark))]" />
            <div className="absolute inset-0">
              <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="container mx-auto px-4 text-center relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Scale Your Shopify Store?</h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">Get a custom fulfillment quote in 24 hours and delight your customers.</p>
              <Button size="lg" className="bg-white text-[hsl(var(--shopify-blue-dark))] hover:bg-white/90 shadow-xl" onClick={() => navigate("/contact")}>
                Get a Quote
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ShopifyFulfillment;