import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Tag, Shield, Boxes, TrendingUp } from "lucide-react";

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
          {/* Hero Section - Amazon Professional Theme */}
          <section className="relative py-24 mt-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-orange-500/10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                  <Boxes className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Amazon FBA Certified</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  Amazon FBA Prep & Compliance
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  FNSKU labeling, polybagging, bubble wrap, carton prep, pallet forwarding with full Amazon compliance. <a href="/why-choose-us" className="text-primary hover:underline">Learn why sellers choose our LA prep center</a> and review our <a href="/faq" className="text-primary hover:underline">Amazon FBA prep questions</a>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/contact")}>
                    Get a Quote
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
                    View Pricing
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <HowItWorks />

          {/* Services Grid - Professional Card Design */}
          <section className="py-20 bg-gradient-to-b from-background to-blue-50/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Amazon FBA Services</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Comprehensive prep services designed for Amazon seller success
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="border-blue-200/50 hover:border-blue-400/50 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Tag className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">FNSKU Labeling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Amazon-compliant FNSKU labels printed and applied to every unit with precision.</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 hover:border-orange-400/50 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Package className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Polybagging</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Suffocation warning labels and transparent poly bags per Amazon standards.</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 hover:border-blue-400/50 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Bubble Wrap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Fragile item protection with bubble wrap and reinforced packaging.</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 hover:border-orange-400/50 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Package className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Carton Prep</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Case packing with FBA box labels and shipment plan adherence.</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 hover:border-blue-400/50 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Pallet Forwarding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">LTL shipments palletized and forwarded directly to Amazon FCs.</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 hover:border-orange-400/50 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-700 to-orange-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">Photo-Proof QC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Every prep step documented with photos for compliance verification.</p>
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

          {/* CTA - Amazon Professional Theme */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="container mx-auto px-4 text-center relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Streamline Your FBA Prep?</h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">Get a custom prep quote in 24 hours and start scaling your Amazon business.</p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90" onClick={() => navigate("/contact")}>
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