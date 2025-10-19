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
import { Zap, Package, Camera, Truck, Award, CheckCircle, Store, Heart, Clock, BarChart } from "lucide-react";

const ShopifyFulfillment = () => {
  const navigate = useNavigate();

  const faqData = [
    { question: "Do you integrate directly with Shopify?", answer: "Yes, we integrate seamlessly with Shopify via API or third-party apps like ShipStation for automated order import and tracking sync." },
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
        <title>Shopify Fulfillment Services in Los Angeles & Southern California | Westfield Prep Center</title>
        <meta name="description" content="Streamline your Shopify store with fulfillment services from Westfield Prep Center in Los Angeles & Southern California. We manage storage, packing, and shipping for Shopify sellers. Request a Quote." />
        <link rel="canonical" href="https://westfieldprepcenter.com/shopify-fulfillment/" />
        <meta property="og:url" content="https://westfieldprepcenter.com/shopify-fulfillment/" />
        <meta property="og:type" content="article" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Shopify Fulfillment", path: "/shopify-fulfillment/" }]} />
        
        <main className="flex-1">
          {/* Hero Section - Shopify Brand-Focused Theme */}
          <section className="relative py-24 mt-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-green-500/5 to-purple-500/10" />
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-green-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
                  <Store className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Shopify Fulfillment Partner</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
                  Shopify Fulfillment for Modern DTC Brands
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Fast, accurate pick-pack, branded unboxing experiences, and same-day cutoffs that delight your customers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-green-600 hover:opacity-90" onClick={() => navigate("/contact")}>
                    Get a Quote
                  </Button>
                  <Button size="lg" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50" onClick={() => navigate("/contact")}>
                    View Integration
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Value Props - Vibrant Brand Cards */}
          <section className="py-20 bg-gradient-to-b from-background via-purple-50/20 to-green-50/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Why DTC Brands Choose Us</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Elevate your brand with fulfillment that matches your vision
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="border-purple-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Lightning Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Same-day cutoffs and next-day fulfillment for orders placed before 2 PM PST.</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Brand Excellence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Custom kitting, branded inserts, and premium unboxing experiences that wow.</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Quality Proof</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Every shipment documented with photos for complete transparency and peace of mind.</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
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

          {/* Integration Benefits */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Seamless Shopify Integration</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Automated workflows that sync perfectly with your store
                </p>
              </div>
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Store, title: "Auto Order Sync", desc: "Orders automatically imported from your Shopify store in real-time" },
                  { icon: Clock, title: "Live Tracking", desc: "Tracking numbers synced back to Shopify instantly" },
                  { icon: BarChart, title: "Inventory Updates", desc: "Real-time inventory sync across all channels" },
                  { icon: Heart, title: "Custom Branding", desc: "Custom kitting and bundle assembly for your brand" },
                  { icon: Award, title: "Returns Portal", desc: "Returns processing and inspection with customer portal" },
                  { icon: CheckCircle, title: "Quality Reports", desc: "Photo-documented quality reports for every order" },
                ].map((item, idx) => (
                  <Card key={idx} className="border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all">
                    <CardHeader>
                      <item.icon className="h-10 w-10 text-purple-600 mb-2" />
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

          {/* Capabilities */}
          <section className="py-20 bg-gradient-to-b from-purple-50/30 to-green-50/30">
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
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-purple-100/50 hover:border-purple-300/50 transition-all">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
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
                    <AccordionTrigger>Do you integrate directly with Shopify?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we integrate seamlessly with Shopify via API or third-party apps like ShipStation for automated order import and tracking sync.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What are your same-day cutoff times?</AccordionTrigger>
                    <AccordionContent>
                      Orders placed before 2 PM PST ship the same business day. Orders after 2 PM ship the next business day.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can you handle custom packaging and branded inserts?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely. We offer custom kitting, branded tissue paper, thank-you cards, promotional inserts, and gift wrapping services.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Is there a minimum order quantity or monthly volume requirement?</AccordionTrigger>
                    <AccordionContent>
                      We work with brands of all sizes. Contact us to discuss your specific volume and we'll create a custom pricing plan.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How does your pricing model work?</AccordionTrigger>
                    <AccordionContent>
                      We charge per-unit pricing based on your services: receiving, pick/pack, kitting, storage, and shipping. No hidden fees. Get a custom quote today.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          {/* CTA - Shopify Brand Theme */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-green-600 to-purple-600" />
            <div className="absolute inset-0">
              <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="container mx-auto px-4 text-center relative">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                <Heart className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Loved by 1000+ DTC Brands</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Scale Your Shopify Store?</h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">Get a custom fulfillment quote in 24 hours and delight your customers.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90" onClick={() => navigate("/contact")}>
                  Get a Quote
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate("/contact")}>
                  See Integration
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ShopifyFulfillment;