import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Video, Package, Truck } from "lucide-react";

const TikTokShopFulfillment = () => {
  const navigate = useNavigate();

  const serviceData = {
    serviceType: "FulfillmentService",
    name: "TikTok Shop Fulfillment",
    description: "Fast FBT workflows, creator-friendly packaging, and reliable shipping for TikTok Shop sellers.",
    features: ["Rapid Turnaround", "Creator-Ready Packaging", "Flexible Kitting", "Fast Shipping"]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>TikTok Shop Fulfillment in Los Angeles | TikTok 3PL LA | Westfield Prep Center</title>
        <meta name="description" content="Scale your TikTok Shop with professional fulfillment from WestfieldPrepCenter.com. Based in Los Angeles, we handle order processing, packing, and shipping for sellers across Southern California." />
        <link rel="canonical" href="https://westfieldprepcenter.com/tiktok-shop-fulfillment/" />
        <meta property="og:url" content="https://westfieldprepcenter.com/tiktok-shop-fulfillment/" />
        <meta property="og:type" content="article" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "TikTok Shop Fulfillment", path: "/tiktok-shop-fulfillment/" }]} />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20 mt-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  TikTok Shop Fulfillment
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Fast FBT workflows, creator-friendly packaging, and reliable shipping.
                </p>
                <Button size="lg" onClick={() => navigate("/contact")}>
                  Get a Quote
                </Button>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us for TikTok Shop</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Zap className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Rapid Turnaround</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Same-day fulfillment for trending products during viral moments.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Video className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Creator-Ready</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Custom packaging and branding optimized for unboxing videos.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Package className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Flexible Kitting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Bundle assembly for promotional sets and limited-edition drops.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Truck className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Fast Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">2-3 day shipping to major markets from our LA location.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our TikTok Shop Process</h2>
              <div className="max-w-4xl mx-auto space-y-6">
                {[
                  { step: 1, title: "Receive Inventory", desc: "Inbound shipments checked in and ready for rapid order fulfillment" },
                  { step: 2, title: "Order Import", desc: "Automated order sync from TikTok Shop to our fulfillment system" },
                  { step: 3, title: "Pick & Pack", desc: "Fast picking and creator-friendly packaging with branded materials" },
                  { step: 4, title: "Ship Same Day", desc: "Orders shipped same-day for maximum customer satisfaction" },
                  { step: 5, title: "Track & Update", desc: "Real-time tracking updates synced back to TikTok Shop" },
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

          {/* CTA */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Scale Your TikTok Shop?</h2>
              <p className="text-xl mb-8 opacity-90">Let's discuss your fulfillment needs.</p>
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

export default TikTokShopFulfillment;