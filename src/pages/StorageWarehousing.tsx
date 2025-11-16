import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse, Shield, Package, CheckCircle } from "lucide-react";

const StorageWarehousing = () => {
  const navigate = useNavigate();

  const serviceData = {
    serviceType: "WarehouseService",
    name: "Storage & Warehousing Services",
    description: "Secure racking, pallet storage, lot control, and cycle counts for e-commerce inventory management.",
    features: ["Secure Racking", "Pallet Storage", "Lot Control", "Cycle Counts"]
  };

  const faqData = [
    {
      question: "What types of storage options do you offer?",
      answer: "We offer pallet storage, bin storage, and custom shelving solutions. All storage is in a climate-controlled, 24/7 monitored facility with insurance coverage included."
    },
    {
      question: "How is storage pricing calculated?",
      answer: "Storage is priced per pallet per month or per cubic foot for bin storage. We offer flexible terms with no long-term commitments required."
    },
    {
      question: "Can I access my inventory anytime?",
      answer: "Yes. We offer same-day access to your inventory during business hours (8am-5pm PT, 7 days a week). Advance notice is appreciated for large retrievals."
    },
    {
      question: "Do you offer cycle counting services?",
      answer: "Yes. We perform regular cycle counts to ensure inventory accuracy and provide detailed reports for your accounting and forecasting."
    },
    {
      question: "Can you store hazmat products?",
      answer: "Yes, we are certified to store hazmat products. Additional documentation and fees may apply depending on the hazard class."
    },
    {
      question: "What security measures protect my inventory?",
      answer: "Our facility features 24/7 video surveillance, restricted access controls, insurance coverage, and regular security audits to protect your inventory."
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Storage & Warehousing | Westfield Prep Center</title>
        <meta name="description" content="Secure racking, pallet storage, lot control, and cycle counts for e-commerce inventory management." />
        <link rel="canonical" href="https://westfieldprepcenter.com/storage-warehousing" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Storage & Warehousing | Westfield Prep Center" />
        <meta property="og:description" content="Secure racking, pallet storage, lot control, and cycle counts for e-commerce inventory management." />
        <meta property="og:url" content="https://westfieldprepcenter.com/storage-warehousing" />
        <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Storage & Warehousing | Westfield Prep Center" />
        <meta name="twitter:description" content="Secure racking, pallet storage, lot control, and cycle counts for e-commerce inventory management." />
        <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Storage & Warehousing", path: "/storage-warehousing" }]} />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20 mt-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Storage & Warehousing
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Secure racking, pallet storage, lot control, and cycle counts.
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
              <h2 className="text-3xl font-bold text-center mb-12">Storage Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Warehouse className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Secure Racking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Climate-controlled warehouse with organized racking systems.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Package className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Pallet Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Long-term and short-term pallet storage with easy access.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Shield className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Lot Control</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Batch and lot tracking for compliance and traceability.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CheckCircle className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Cycle Counts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Regular inventory audits to ensure accuracy and accountability.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Warehouse Features</h2>
              <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
                {[
                  "24/7 security monitoring",
                  "Climate-controlled environment",
                  "Insurance coverage included",
                  "Real-time inventory tracking",
                  "Flexible storage terms",
                  "Dedicated account management",
                  "Photo documentation",
                  "Forklift and pallet jack access",
                  "FIFO/FEFO inventory rotation",
                  "Hazmat storage certified",
                  "Receiving and inspection",
                  "Same-day access to inventory",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <p className="text-lg">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Flexible Storage Pricing</h2>
              <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pallet Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold mb-2">Custom</p>
                    <p className="text-muted-foreground mb-4">Per pallet per month</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Standard pallet size</li>
                      <li>• Climate-controlled</li>
                      <li>• Insurance included</li>
                      <li>• Monthly billing</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bin Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold mb-2">Custom</p>
                    <p className="text-muted-foreground mb-4">Per bin per month</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Small item storage</li>
                      <li>• Organized racking</li>
                      <li>• Quick access</li>
                      <li>• Scalable capacity</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle>Custom Solutions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold mb-2">Let's Talk</p>
                    <p className="text-muted-foreground mb-4">Volume discounts available</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• High-volume storage</li>
                      <li>• Dedicated space</li>
                      <li>• Custom configurations</li>
                      <li>• Negotiated rates</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Need Secure Storage?</h2>
              <p className="text-xl mb-8 opacity-90">Get a custom storage quote today.</p>
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

export default StorageWarehousing;