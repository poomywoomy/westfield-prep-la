import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reviews from "@/components/Reviews";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Tag, Shield } from "lucide-react";

const AmazonFBAPrep = () => {
  const navigate = useNavigate();

  const serviceData = {
    serviceType: "FulfillmentService",
    name: "Amazon FBA Prep Services",
    description: "FNSKU labeling, polybagging, bubble wrap, carton prep, pallet forwarding with Amazon compliance.",
    features: ["FNSKU Labeling", "Polybagging", "Bubble Wrap", "Carton Prep", "Pallet Forwarding", "Photo-Proof QC"]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Amazon FBA Prep Center in Los Angeles & Southern California | Westfield Prep Center</title>
        <meta name="description" content="Westfield Prep Center specializes in Amazon FBA prep for sellers in Los Angeles and Southern California. Inspection, labeling, bundling, and compliant shipping — all handled with care." />
        <link rel="canonical" href="https://westfieldprepcenter.com/amazon-fba-prep/" />
        <meta property="og:url" content="https://westfieldprepcenter.com/amazon-fba-prep/" />
        <meta property="og:type" content="article" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Amazon FBA Prep", path: "/amazon-fba-prep/" }]} />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20 mt-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Amazon FBA Prep & Compliance
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  FNSKU labeling, polybagging, bubble wrap, carton prep, pallet forwarding.
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
              <h2 className="text-3xl font-bold text-center mb-12">Amazon FBA Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card>
                  <CardHeader>
                    <Tag className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>FNSKU Labeling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Amazon-compliant FNSKU labels printed and applied to every unit.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Package className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Polybagging</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Suffocation warning labels and transparent poly bags per Amazon standards.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Shield className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Bubble Wrap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Fragile item protection with bubble wrap and reinforced packaging.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Package className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Carton Prep</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Case packing with FBA box labels and shipment plan adherence.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Shield className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Pallet Forwarding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">LTL shipments palletized and forwarded directly to Amazon FCs.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CheckCircle className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Photo-Proof QC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Every prep step documented with photos for compliance verification.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our FBA Prep Process</h2>
              <div className="max-w-4xl mx-auto space-y-6">
                {[
                  { step: 1, title: "Receive Inventory", desc: "Inbound shipments checked against your ASN and inspected for damage" },
                  { step: 2, title: "Prep & Label", desc: "FNSKU labels, polybagging, bubble wrap, and compliance prep applied" },
                  { step: 3, title: "Carton & Pallet", desc: "Units case-packed per your shipment plan and palletized for LTL" },
                  { step: 4, title: "QC Photos", desc: "Photo documentation of prep steps for quality assurance" },
                  { step: 5, title: "Ship to Amazon", desc: "Forwarded to Amazon FBA warehouses with tracking and BOL" },
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

          {/* Walmart Note */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <Card className="border-2 border-muted">
                  <CardHeader>
                    <CardTitle>Also Support Walmart Marketplace (upon request)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      We primarily focus on Shopify and Amazon. Limited Walmart prep is available on request for select partners. Contact us for scope and SLAs.
                    </p>
                    <Button variant="outline" onClick={() => navigate("/contact")}>
                      Contact Us About Walmart
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Compliance Checklist */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Amazon Compliance Checklist</h2>
              <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
                {[
                  "FNSKU labels on every unit",
                  "Suffocation warning on poly bags",
                  "Carton content labels",
                  "Expiration date labeling",
                  "Set creation and bundling",
                  "Hazmat documentation",
                  "LTL pallet standards",
                  "Amazon box size requirements",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <p className="text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Reviews />

          {/* CTA */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your FBA Prep?</h2>
              <p className="text-xl mb-8 opacity-90">Get a custom prep quote in 24 hours.</p>
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

export default AmazonFBAPrep;