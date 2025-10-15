import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Gift, Camera, CheckCircle } from "lucide-react";

const KittingBundling = () => {
  const navigate = useNavigate();

  const serviceData = {
    serviceType: "Service",
    name: "Kitting & Bundling Services",
    description: "Multi-SKU kits, gift sets, and promotional bundles with photo-proof QC for e-commerce brands.",
    features: ["Multi-SKU Kits", "Gift Sets", "Promotional Bundles", "Photo-Proof QC"]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Kitting & Bundling Services | Westfield Prep Center</title>
        <meta name="description" content="Multi-SKU kits, gift sets, and promotional bundles with photo-proof QC for e-commerce brands." />
        <link rel="canonical" href="https://westfieldprepcenter.com/kitting-bundling/" />
        <meta property="og:url" content="https://westfieldprepcenter.com/kitting-bundling/" />
        <meta property="og:type" content="article" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Kitting & Bundling", path: "/kitting-bundling/" }]} />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20 mt-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Kitting & Bundling Services
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Multi-SKU kits, gift sets, and promotional bundles with photo-proof QC.
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
              <h2 className="text-3xl font-bold text-center mb-12">Kitting Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Package className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Multi-SKU Kits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Combine multiple products into single SKUs for streamlined fulfillment.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Gift className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Gift Sets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Premium gift packaging with ribbons, tissue paper, and branded materials.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Package className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Promotional Bundles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Seasonal bundles and promotional sets for marketing campaigns.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Camera className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Photo-Proof QC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Every kit documented with photos to ensure accuracy and quality.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our Kitting Process</h2>
              <div className="max-w-4xl mx-auto space-y-6">
                {[
                  { step: 1, title: "Receive Components", desc: "All kit components received, inspected, and verified" },
                  { step: 2, title: "Assemble Kits", desc: "Products assembled per your specifications with branded materials" },
                  { step: 3, title: "Quality Check", desc: "Each kit inspected and photographed for accuracy" },
                  { step: 4, title: "Package & Label", desc: "Kits packaged with new SKU labels for your inventory system" },
                  { step: 5, title: "Store & Ship", desc: "Ready-to-ship kits stored and fulfilled on-demand" },
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

          {/* Use Cases */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Common Kitting Use Cases</h2>
              <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
                {[
                  "Subscription box assembly",
                  "Holiday gift sets",
                  "Product sample kits",
                  "Influencer PR boxes",
                  "Promotional bundles",
                  "New customer welcome kits",
                  "Loyalty program rewards",
                  "Event swag bags",
                ].map((useCase, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <p className="text-lg">{useCase}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Create Custom Kits?</h2>
              <p className="text-xl mb-8 opacity-90">Let's discuss your kitting needs.</p>
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

export default KittingBundling;