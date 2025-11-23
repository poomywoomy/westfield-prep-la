import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StructuredData from "@/components/StructuredData";
import { generateMetaTags } from "@/utils/seo";
import { Package, Zap, Target, Clock, ShoppingCart, Store } from "lucide-react";
import { MetricCounter } from "@/components/ui/metric-counter";

const OrderFulfillment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Order Fulfillment Services Los Angeles | Same-Day Processing",
    "Lightning-fast order fulfillment in Los Angeles. Same-day processing, 99.8% accuracy, real-time tracking. Shopify, Amazon, TikTok Shop integration.",
    "/order-fulfillment"
  );

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Order Fulfillment Services",
    "description": "Professional order fulfillment with same-day processing and real-time tracking",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    },
    "areaServed": "Los Angeles, CA"
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is your order cutoff time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Orders received by 2 PM PST ship same day. We process orders 6 days per week."
        }
      },
      {
        "@type": "Question",
        "name": "What platforms do you integrate with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We integrate with Shopify, Amazon Seller Central, TikTok Shop, Walmart Marketplace, and custom API solutions."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide order tracking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, real-time tracking is automatically sent to customers via email and synced to your sales platform."
        }
      }
    ]
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
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Order Fulfillment", path: "/order-fulfillment" }]} />

        {/* Hero Section - Frosted Glass with Teal Accent */}
        <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[hsl(180,75%,50%)]/5 via-background to-background">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(180,75%,50%)]/10 to-transparent" />
          
          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto backdrop-blur-xl bg-card/80 rounded-3xl p-8 md:p-12 shadow-2xl border border-[hsl(180,75%,50%)]/20 animate-float">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 relative">
                Lightning-Fast Order Fulfillment
                <span className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-[hsl(180,75%,50%)] to-transparent animate-glow" />
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl">
                Same-day processing, 99.8% accuracy, real-time tracking. Integrated with Shopify, Amazon, and TikTok Shop for seamless fulfillment at scale.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/contact")}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Get Started Today
              </Button>
            </div>

            {/* Unique Stat Cards - 3 Different Shapes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
              {/* Diamond KPI Card */}
              <div className="relative h-64 flex items-center justify-center">
                <div className="absolute inset-0 rotate-45 bg-gradient-to-br from-card to-[hsl(180,75%,50%)]/10 rounded-3xl border-2 border-[hsl(180,75%,50%)] shadow-lg shadow-[hsl(180,75%,50%)]/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" />
                <div className="relative z-10 text-center">
                  <p className="text-4xl md:text-5xl font-bold text-[hsl(180,75%,50%)] animate-count-up">
                    <MetricCounter value={99.8} suffix="%" />
                  </p>
                  <p className="text-sm font-medium text-foreground mt-2">Accuracy Rate</p>
                </div>
              </div>

              {/* Vertical Pill Card */}
              <Card className="h-80 bg-gradient-to-b from-card to-[hsl(180,75%,50%)]/5 border-[hsl(180,75%,50%)]/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <CardContent className="p-8 flex flex-col items-center justify-center h-full">
                  <Clock className="w-12 md:w-16 h-12 md:h-16 text-[hsl(180,75%,50%)] mb-4" />
                  <p className="text-5xl md:text-6xl font-bold text-[hsl(180,75%,50%)] animate-count-up">
                    <MetricCounter value={24} suffix="h" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-4 text-center">Average Processing Time</p>
                </CardContent>
              </Card>

              {/* Split Dual-Stat Card */}
              <Card className="h-64 border-[hsl(180,75%,50%)]/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="flex-1 flex flex-col items-center justify-center border-b-2 border-[hsl(180,75%,50%)]">
                    <p className="text-2xl md:text-3xl font-bold text-foreground">2PM Cutoff</p>
                    <p className="text-sm text-muted-foreground mt-2">PST Daily</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center bg-[hsl(180,75%,50%)]/5">
                    <p className="text-2xl md:text-3xl font-bold text-[hsl(180,75%,50%)]">Same Day</p>
                    <p className="text-sm text-muted-foreground mt-2">Ship Guarantee</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Real-Time Fulfillment Workflow */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Real-Time Fulfillment Workflow</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Automated order processing from click to ship in under 24 hours
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", icon: ShoppingCart, title: "Order Received", desc: "Auto-synced from platform" },
                { step: "2", icon: Package, title: "Pick & Pack", desc: "QC checked & packaged" },
                { step: "3", icon: Target, title: "Label & Ship", desc: "Carrier pickup same day" },
                { step: "4", icon: Zap, title: "Tracking Sent", desc: "Customer notified instantly" }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <Card className="p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[hsl(180,75%,50%)]/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[hsl(180,75%,50%)]" />
                    </div>
                    <div className="w-8 h-8 mx-auto mb-3 rounded-full bg-[hsl(180,75%,50%)] text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-[hsl(180,75%,50%)]/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Speed & Accuracy Metrics */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Speed & Accuracy at Scale</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { metric: "10000", suffix: "+", label: "Orders/Month", bar: 85 },
                { metric: "99.8", suffix: "%", label: "Accuracy Rate", bar: 99 },
                { metric: "4.5", suffix: "h", label: "Avg Processing", bar: 75 }
              ].map((item, idx) => (
                <Card key={idx} className="p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <p className="text-4xl md:text-5xl font-bold text-[hsl(180,75%,50%)] mb-2">
                    <MetricCounter value={parseFloat(item.metric)} suffix={item.suffix} />
                  </p>
                  <p className="text-muted-foreground mb-4">{item.label}</p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[hsl(180,75%,50%)] to-[hsl(180,75%,40%)] transition-all duration-1000"
                      style={{ width: `${item.bar}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Platform Integrations</h2>
            <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              Seamlessly connected to your favorite e-commerce platforms
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { name: "Shopify", icon: Store },
                { name: "Amazon", icon: Package },
                { name: "TikTok Shop", icon: Zap },
                { name: "Walmart", icon: ShoppingCart },
                { name: "Custom API", icon: Target },
                { name: "More...", icon: Package }
              ].map((platform, idx) => (
                <Card key={idx} className="p-6 md:p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[hsl(180,75%,50%)]">
                  <platform.icon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-[hsl(180,75%,50%)]" />
                  <p className="font-semibold">{platform.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
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
        </section>

        {/* Teal CTA Banner */}
        <section className="py-20 bg-gradient-to-r from-[hsl(180,75%,50%)]/10 via-[hsl(180,75%,50%)]/5 to-[hsl(180,75%,50%)]/10">
          <div className="container">
            <Card className="max-w-4xl mx-auto border-2 border-[hsl(180,75%,50%)] shadow-[0_0_40px_rgba(77,208,225,0.3)] animate-glow">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Scale Your Fulfillment?</h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join 500+ brands shipping faster with Westfield Prep Center
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/contact")}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Get Your Custom Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default OrderFulfillment;
