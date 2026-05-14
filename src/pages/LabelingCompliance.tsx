import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Shield, FileCheck, CheckCircle } from "lucide-react";

const LabelingCompliance = () => {
  const navigate = useNavigate();

  const serviceData = {
    serviceType: "Service",
    name: "Labeling & Compliance Services - Los Angeles 3PL Prep Center",
    description: "Expert 3PL labeling and compliance services at our LA prep center. FNSKU/barcodes, warning labels, and audit-ready documentation.",
    features: ["FNSKU Labels", "Warning Labels", "Carton Labeling", "Documentation", "Compliance Standards", "3PL Services"]
  };

  const faqData = [
    {
      question: "What labeling services do you provide for Amazon FBA?",
      answer: "We apply FNSKU labels, suffocation warnings, box labels, shipment IDs, and destination FC labels. All labels meet Amazon's requirements and include audit documentation."
    },
    {
      question: "Can you handle California Prop 65 warnings?",
      answer: "Yes. We apply compliant Prop 65 warning labels for products sold in California, including custom text for specific chemical disclosures."
    },
    {
      question: "Do you support FDA-required labeling?",
      answer: "Yes. We handle FDA labeling for food products, cosmetics, and supplements including ingredient lists, nutrition facts, and lot tracking."
    },
    {
      question: "How do you ensure label placement accuracy?",
      answer: "Every labeled item goes through a QC inspection process. We verify label placement, readability, and barcode scannability before shipping."
    },
    {
      question: "Can you track lot numbers and expiration dates?",
      answer: "Absolutely. We maintain detailed lot tracking records and apply expiration date labels per your specifications for full traceability."
    },
    {
      question: "What's your turnaround time for labeling services?",
      answer: "Standard labeling takes 1-2 business days. High-volume or complex labeling projects may require 2-3 days depending on quantity."
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Labeling & Compliance | Los Angeles 3PL Prep Center</title>
        <meta name="description" content="Expert labeling and compliance services at our LA prep center. 3PL FNSKU labeling, warning labels, and Amazon FBA compliance for e-commerce sellers." />
        <meta name="keywords" content="3pl los angeles, labeling services, prep center, fnsku labels, amazon fba compliance, ecommerce labeling" />
        <link rel="canonical" href="https://westfieldprepcenter.com/labeling-fnsku" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Labeling & Compliance | Los Angeles 3PL Prep Center" />
        <meta property="og:description" content="Expert labeling and compliance services at our LA prep center. 3PL FNSKU labeling, warning labels, and Amazon FBA compliance." />
        <meta property="og:url" content="https://westfieldprepcenter.com/labeling-fnsku" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Labeling & Compliance Services | Westfield Prep Center" />
        <meta name="twitter:description" content="FNSKU/barcodes, warning labels, carton labeling, and audit-ready documentation for e-commerce compliance." />
        <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Labeling & Compliance", path: "/labeling-fnsku" }]} />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20 mt-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Labeling & Compliance
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  FNSKU/barcodes, warning labels, carton labeling, and audit-ready documentation.
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
              <h2 className="text-3xl font-bold text-center mb-12">Labeling Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Tag className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>FNSKU Labels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Amazon FNSKU labels printed and applied per FBA requirements.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Shield className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Warning Labels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Suffocation warnings, Prop 65, and safety compliance labels.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Tag className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Carton Labeling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">FBA box labels, shipment IDs, and destination labels for LTL.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <FileCheck className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Audit-ready records for compliance, lot tracking, and traceability.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Compliance Types */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Compliance Standards We Support</h2>
              <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
                {[
                  "Amazon FBA labeling requirements",
                  "Walmart WFS compliance",
                  "Shopify product labeling",
                  "TikTok Shop standards",
                  "California Prop 65 warnings",
                  "FDA labeling (food & cosmetics)",
                  "Suffocation warning labels",
                  "Expiration date labeling",
                  "Lot and batch tracking",
                  "Hazmat documentation",
                  "Country of origin labels",
                  "UPC/EAN barcode application",
                ].map((standard, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <p className="text-lg">{standard}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our Labeling Process</h2>
              <div className="max-w-4xl mx-auto space-y-6">
                {[
                  { step: 1, title: "Receive Inventory", desc: "Products received and inspected for existing labels" },
                  { step: 2, title: "Print Labels", desc: "High-quality labels printed per your specifications" },
                  { step: 3, title: "Apply Labels", desc: "Labels accurately applied to units or cartons" },
                  { step: 4, title: "Quality Check", desc: "Each labeled item inspected for placement and readability" },
                  { step: 5, title: "Document & Store", desc: "Records maintained for audit trails and traceability" },
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
              <h2 className="text-3xl font-bold mb-4">Stay Compliant with Expert Labeling</h2>
              <p className="text-xl mb-8 opacity-90">Get a custom labeling quote today.</p>
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

export default LabelingCompliance;