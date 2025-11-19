import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CheckCircle2, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";

const OrderFulfillment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Order Fulfillment Services Los Angeles",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    },
    "description": "Professional order fulfillment services in Los Angeles. Fast, accurate pick and pack with same-day shipping capabilities.",
    "areaServed": "Los Angeles, CA"
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is order fulfillment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Order fulfillment is the complete process of receiving, processing, and delivering orders to customers. This includes inventory storage, picking, packing, shipping, and returns management."
        }
      },
      {
        "@type": "Question",
        "name": "How fast can you fulfill orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We process orders received by 2 PM PT the same day. Orders ship within 24 hours of receipt, with tracking information provided immediately."
        }
      },
      {
        "@type": "Question",
        "name": "Do you integrate with my e-commerce platform?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we integrate seamlessly with Shopify, Amazon, TikTok Shop, and other major e-commerce platforms for automated order processing."
        }
      },
      {
        "@type": "Question",
        "name": "What are your fulfillment accuracy rates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We maintain a 99.8% order accuracy rate through our quality control processes and barcode scanning technology."
        }
      },
      {
        "@type": "Question",
        "name": "Can you handle custom packaging?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer custom packaging solutions including branded boxes, inserts, and special handling requirements for your orders."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Order Fulfillment Services Los Angeles | Westfield Prep Center</title>
        <meta name="description" content="Professional order fulfillment in LA. Same-day processing, 99.8% accuracy, multi-channel integration. Scale your e-commerce with our pick & pack services." />
        <link rel="canonical" href="https://westfieldprepcenter.com/order-fulfillment" />
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <Header />
      <Breadcrumbs items={[{ label: "Order Fulfillment", path: "/order-fulfillment" }]} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-6">
                <Package className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Lightning-Fast Order Fulfillment
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Get your orders out the door faster with our same-day processing and 99.8% accuracy rate. 
                We handle everything from pick & pack to shipping so you can focus on growing your business.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/contact")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Get a Free Quote
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Complete Fulfillment Solutions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Pick & Pack</h3>
                    <p className="text-sm text-muted-foreground">
                      Efficient order picking with barcode scanning and multi-item order accuracy
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Same-Day Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Orders by 2 PM PT ship same day. No delays, no excuses
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Quality Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Double-check verification process ensures 99.8% accuracy on every order
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Real-Time Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Live inventory updates and shipping notifications for complete visibility
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our Fulfillment Process</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Order Received</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic order import from your platform into our system
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Pick Items</h3>
                  <p className="text-sm text-muted-foreground">
                    Barcode scanning ensures the right items every time
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Pack & Label</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional packaging with shipping labels printed and applied
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Ship Out</h3>
                  <p className="text-sm text-muted-foreground">
                    Carrier pickup and tracking number sent to customer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">E-Commerce Brands</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scale your Shopify, WooCommerce, or custom store without hiring a warehouse team
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Multi-channel order sync</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Custom packaging options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Returns processing</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Amazon Sellers</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Fulfill Merchant Fulfilled Network orders faster than FBA
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>2-day shipping capabilities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Lower fulfillment fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Buy Box advantages</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Growing Startups</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Professional fulfillment from day one without massive upfront costs
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>No order minimums</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Pay only for what you use</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Scale as you grow</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqData.mainEntity.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{faq.name}</h3>
                      <p className="text-sm text-muted-foreground">{faq.acceptedAnswer.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Speed Up Your Fulfillment?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Let's discuss how our order fulfillment services can help you ship faster and grow bigger.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/contact")}
                className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default OrderFulfillment;
