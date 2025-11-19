import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Search, PackageX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";

const ReturnsProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Returns Processing Services Los Angeles",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    },
    "description": "Professional returns processing and management in Los Angeles. Fast inspection, restocking, and disposition of returned items with full reporting.",
    "areaServed": "Los Angeles, CA"
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do you handle customer returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We receive, inspect, and categorize each return within 24 hours. Items are either restocked as sellable, set aside for rework, or marked as unsellable based on condition."
        }
      },
      {
        "@type": "Question",
        "name": "Can you process Amazon FBA returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we specialize in processing Amazon FBA returns. We inspect returned items and can prep them for re-shipment to Amazon or handle disposal."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide returns analytics?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. You get detailed reporting on return rates, reasons, and product conditions to help identify quality issues or problem SKUs."
        }
      },
      {
        "@type": "Question",
        "name": "What happens to damaged returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Damaged items are photographed, documented, and segregated. We can dispose of them, return them to you, or attempt rework based on your instructions."
        }
      },
      {
        "@type": "Question",
        "name": "How fast do you process returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most returns are inspected and processed within 24-48 hours of arrival. You receive immediate notifications with photos and disposition decisions."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Returns Processing Services Los Angeles | Returns Management</title>
        <meta name="description" content="Professional returns processing in LA. Fast inspection, restocking, and reporting. Handle Amazon FBA returns, customer returns, and reverse logistics efficiently." />
        <link rel="canonical" href="https://westfieldprepcenter.com/returns-processing" />
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <Header />
      <Breadcrumbs items={[{ label: "Returns Processing", path: "/returns-processing" }]} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-6">
                <RotateCcw className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Efficient Returns Processing
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Turn returns from a headache into an opportunity. We inspect, restock, and report on every 
                returned item so you can recover value and improve your operations.
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
              <h2 className="text-3xl font-bold text-center mb-12">Complete Returns Management</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <RotateCcw className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Returns Receiving</h3>
                    <p className="text-sm text-muted-foreground">
                      Accept returns directly at our facility from customers or marketplaces
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Condition Inspection</h3>
                    <p className="text-sm text-muted-foreground">
                      Thorough inspection with photo documentation of returned items
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <RefreshCw className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Restocking</h3>
                    <p className="text-sm text-muted-foreground">
                      Quick reintegration of sellable items back into your inventory
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <PackageX className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Disposition</h3>
                    <p className="text-sm text-muted-foreground">
                      Proper handling of unsellable items including disposal or return
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
              <h2 className="text-3xl font-bold text-center mb-12">How We Process Returns</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Receive</h3>
                  <p className="text-sm text-muted-foreground">
                    Returns arrive at our warehouse and are logged immediately
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Inspect</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed condition check with photos and notes
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Sort</h3>
                  <p className="text-sm text-muted-foreground">
                    Categorize as sellable, rework, or unsellable
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Process</h3>
                  <p className="text-sm text-muted-foreground">
                    Restock sellable items or handle per your instructions
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
              <h2 className="text-3xl font-bold text-center mb-12">Returns Solutions We Handle</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Customer Returns</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Direct-to-consumer returns from your website or marketplace sales
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <RotateCcw className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Shopify returns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <RotateCcw className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Website returns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <RotateCcw className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Multi-channel returns</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Amazon FBA Returns</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Inspection and reprocessing of items returned from Amazon warehouses
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Search className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>FBA removal orders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Search className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Customer return inspections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Search className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Re-prep for FBA</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Warranty Returns</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Special handling for defective or warranty-covered merchandise
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <PackageX className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Defect documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <PackageX className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Manufacturer returns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <PackageX className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>RMA processing</span>
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
                Streamline Your Returns Today
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Stop losing money on mishandled returns. Let us recover maximum value from every returned item.
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

export default ReturnsProcessing;
