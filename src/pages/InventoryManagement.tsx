import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Database, TrendingUp, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { generateMetaTags } from "@/utils/seo";

const InventoryManagement = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Inventory Management Services | Real-Time Tracking | Westfield Prep Center",
    "Professional inventory management in Los Angeles. Real-time sync, smart alerts, detailed analytics, and secure storage. Never stock out again.",
    "/inventory-management"
  );

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Inventory Management Services Los Angeles",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    },
    "description": "Real-time inventory tracking and management in Los Angeles. Advanced WMS with live updates, low-stock alerts, and multi-location support.",
    "areaServed": "Los Angeles, CA"
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do you track my inventory?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use a cloud-based Warehouse Management System (WMS) with barcode scanning for real-time tracking. You can view your inventory levels 24/7 through our online portal."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide low-stock alerts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our system automatically sends notifications when inventory reaches your custom threshold levels, helping you avoid stockouts."
        }
      },
      {
        "@type": "Question",
        "name": "Can you manage inventory for multiple SKUs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We manage thousands of SKUs for clients across multiple product categories with full traceability and lot tracking."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is your inventory tracking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We maintain 99.9% inventory accuracy through regular cycle counts, barcode verification, and automated reconciliation processes."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer inventory reporting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you get access to detailed inventory reports including stock levels, movement history, velocity analysis, and aging reports."
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
        <meta property="og:type" content={meta.ogType} />
        <meta name="twitter:card" content={meta.twitterCard} />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        <meta name="twitter:image" content={meta.twitterImage} />
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <Header />
      <Breadcrumbs items={[{ label: "Inventory Management", path: "/inventory-management" }]} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-6">
                <Database className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Real-Time Inventory Control
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Know exactly what you have, where it is, and when to reorder. Our advanced WMS gives you 
                complete visibility and control over your inventory 24/7.
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

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Advanced Inventory Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Database className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Real-Time Sync</h3>
                    <p className="text-sm text-muted-foreground">
                      Instant inventory updates across all your sales channels automatically
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Bell className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Smart Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Automated notifications for low stock, reorder points, and anomalies
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Velocity reports, aging analysis, and demand forecasting tools
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Security</h3>
                    <p className="text-sm text-muted-foreground">
                      24/7 monitored facility with insurance coverage and access controls
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
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Receive</h3>
                  <p className="text-sm text-muted-foreground">
                    Every unit scanned and logged into our WMS upon arrival
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Store</h3>
                  <p className="text-sm text-muted-foreground">
                    Organized in our LA warehouse with location tracking
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Monitor</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time tracking with automated reorder alerts
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Access detailed analytics and inventory insights anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Inventory Management</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Never Stock Out</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Automated low-stock alerts and reorder recommendations keep you ahead of demand
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Demand forecasting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Reorder point alerts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Safety stock calculations</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Total Visibility</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      See your entire inventory in real-time from anywhere in the world
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Database className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Live stock levels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Database className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Movement history</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Database className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Location tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Reduce Costs</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Optimize your inventory levels and reduce carrying costs significantly
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Minimize dead stock</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Reduce overstock</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Better cash flow</span>
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
                Take Control of Your Inventory Today
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Stop worrying about stock levels. Let our advanced system handle the tracking while you focus on sales.
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

export default InventoryManagement;
