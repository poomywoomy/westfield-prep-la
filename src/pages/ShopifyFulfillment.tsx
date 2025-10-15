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
import { Zap, Package, Camera, Truck, Award, CheckCircle } from "lucide-react";

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
        <title>Shopify Fulfillment in Los Angeles | Westfield Prep Center</title>
        <meta name="description" content="Shopify-first fulfillment with photo-proof QC, branded packaging, and same-day cutoffs. Scale DTC with a premium LA partner." />
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
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20 mt-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Shopify Fulfillment for Modern DTC Brands
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Fast, accurate pick-pack, branded unboxing, same-day cutoffs.
                </p>
                <Button size="lg" onClick={() => navigate("/contact")}>
                  Get a Quote
                </Button>
              </div>
            </div>
          </section>

          {/* Value Props */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Zap className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Speed & SLAs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Same-day cutoffs and next-day fulfillment for orders placed before 2 PM PST.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Package className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Brand-Safe Packaging</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Custom kitting, branded inserts, and premium unboxing experiences.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Camera className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Photo-Proof QC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Every shipment documented with photos for quality assurance and transparency.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Truck className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Nationwide Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Strategic LA location for fast shipping to all US markets with major carriers.</p>
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

          {/* Capabilities */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Additional Capabilities</h2>
              <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
                {[
                  "Custom kitting and bundle assembly",
                  "Lot and batch tracking for compliance",
                  "Returns processing and inspection",
                  "Gift wrapping and special packaging",
                  "Seasonal promotional inserts",
                  "Inventory cycle counts",
                ].map((capability, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
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

          {/* CTA */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Shopify Store?</h2>
              <p className="text-xl mb-8 opacity-90">Get a custom fulfillment quote in 24 hours.</p>
              <Button size="lg" variant="secondary" onClick={() => navigate("/contact")}>
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