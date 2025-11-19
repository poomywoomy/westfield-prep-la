import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Eye, Camera, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";

const ReceivingInspection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Receiving & Inspection Services Los Angeles",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    },
    "description": "Professional receiving and quality inspection services in Los Angeles. Every shipment inspected, photographed, and documented for quality assurance.",
    "areaServed": "Los Angeles, CA"
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What's included in your receiving service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide full receiving including shipment verification, unit counting, condition inspection, photography documentation, and immediate inventory updates in our system."
        }
      },
      {
        "@type": "Question",
        "name": "How do you handle damaged goods?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We photograph all damage, document it with carrier information, and notify you immediately. We can help file claims and segregate damaged items from sellable inventory."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide receiving reports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you receive detailed receiving reports with photos, discrepancy notes, and confirmed quantities within 24 hours of shipment arrival."
        }
      },
      {
        "@type": "Question",
        "name": "Can you receive from international shipments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Our LA location near major ports is perfect for receiving international containers and managing customs documentation."
        }
      },
      {
        "@type": "Question",
        "name": "How long does receiving take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most shipments are processed within 24-48 hours of arrival. Large containers may take 2-3 business days depending on volume."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Receiving & Inspection Services Los Angeles | Quality Control</title>
        <meta name="description" content="Professional receiving & QC inspection in LA. Every shipment verified, photographed, and documented. Protect your inventory with our thorough inspection process." />
        <link rel="canonical" href="https://westfieldprepcenter.com/receiving-inspection" />
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <Header />
      <Breadcrumbs items={[{ label: "Receiving & Inspection", path: "/receiving-inspection" }]} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-6">
                <ClipboardCheck className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Professional Receiving & QC Inspection
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Every shipment inspected, counted, and photographed. We catch issues before they become 
                problems so you can trust your inventory is accurate from day one.
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
              <h2 className="text-3xl font-bold text-center mb-12">Complete Receiving Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <ClipboardCheck className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Shipment Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Count and verify every unit against your packing list or PO
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Quality Inspection</h3>
                    <p className="text-sm text-muted-foreground">
                      Visual inspection for damage, defects, and quality issues
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Photo Documentation</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed photos of shipment condition, packaging, and any issues
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <FileCheck className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Discrepancy Reporting</h3>
                    <p className="text-sm text-muted-foreground">
                      Immediate notification of any shortages, overages, or damage
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
              <h2 className="text-3xl font-bold text-center mb-12">Our Inspection Process</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Arrival</h3>
                  <p className="text-sm text-muted-foreground">
                    Shipment arrives and is immediately logged into our system
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Unload & Count</h3>
                  <p className="text-sm text-muted-foreground">
                    Careful unloading with piece-by-piece count verification
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Inspect & Photo</h3>
                  <p className="text-sm text-muted-foreground">
                    Quality check with photo documentation of condition
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Report & Store</h3>
                  <p className="text-sm text-muted-foreground">
                    Send receiving report and move to storage location
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
              <h2 className="text-3xl font-bold text-center mb-12">What We Inspect For</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Quantity Accuracy</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ensure every unit you paid for actually arrives at our warehouse
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ClipboardCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Carton count verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ClipboardCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Unit-level counting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ClipboardCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>SKU verification</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Damage Assessment</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Catch shipping damage before it reaches your customers
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Box condition check</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Product damage inspection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Packaging integrity</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Compliance Review</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Verify your products meet marketplace requirements
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <FileCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Label verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Packaging standards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Documentation check</span>
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
                Protect Your Inventory from Day One
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Don't risk inventory discrepancies. Let our receiving team ensure every shipment is perfect.
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

export default ReceivingInspection;
