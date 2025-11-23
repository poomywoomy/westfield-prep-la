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
import { CheckCircle, Camera, FileCheck, AlertTriangle, Package } from "lucide-react";
import { MetricCounter } from "@/components/ui/metric-counter";

const ReceivingInspection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Receiving & QC Inspection Services Los Angeles | Quality Control",
    "Professional receiving and quality control inspection in Los Angeles. 100% photo documentation, barcode verification, defect tracking.",
    "/receiving-inspection"
  );

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Receiving & Inspection Services",
    "description": "Quality control and receiving inspection with photo documentation",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What's included in receiving service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Full receiving includes shipment verification, unit counting, condition inspection, photography, and immediate inventory updates."
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
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Receiving & Inspection", path: "/receiving-inspection" }]} />

        {/* Hero Section - DARK MODE with Purple Accent */}
        <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 md:py-24">
          {/* Micro-grid precision background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(265, 51%, 51%) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(265, 51%, 51%) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Professional Receiving & <span className="font-serif" style={{ color: 'hsl(265, 51%, 51%)' }}>QC</span> Inspection
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl">
                Precision quality control with 100% photo documentation, barcode verification, and defect tracking. Every unit inspected before storage.
              </p>

              {/* Checklist and barcode illustrations */}
              <div className="flex flex-col md:flex-row items-center gap-6 mt-8">
                <div className="w-20 h-20 border-2 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" 
                     style={{ borderColor: 'hsl(265, 51%, 51%)' }}>
                  <CheckCircle className="w-10 h-10" style={{ color: 'hsl(265, 51%, 51%)' }} />
                </div>
                <div className="text-xs md:text-sm font-mono tracking-widest" style={{ color: 'hsl(265, 51%, 51%)' }}>
                  |||| |||| |||| |||| |||| ||||
                </div>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/contact")}
                  className="md:ml-auto"
                  style={{ backgroundColor: 'hsl(265, 51%, 51%)', color: 'white' }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Unique Stat Cards - Checklist, Barcode, Pass/Fail */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Checklist Card */}
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2" 
                    style={{ borderColor: 'hsl(265, 51%, 51%)' }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0" 
                         style={{ backgroundColor: 'hsl(265, 51%, 51%, 0.1)' }}>
                      <CheckCircle className="w-8 h-8" style={{ color: 'hsl(265, 51%, 51%)' }} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 flex items-center justify-center" style={{ borderColor: 'hsl(265, 51%, 51%)', backgroundColor: 'hsl(265, 51%, 51%)' }}>
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm">Quantity verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 flex items-center justify-center" style={{ borderColor: 'hsl(265, 51%, 51%)', backgroundColor: 'hsl(265, 51%, 51%)' }}>
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm">Condition checked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 flex items-center justify-center" style={{ borderColor: 'hsl(265, 51%, 51%)', backgroundColor: 'hsl(265, 51%, 51%)' }}>
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm">Photos taken</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-4xl font-bold" style={{ color: 'hsl(265, 51%, 51%)' }}>
                    <MetricCounter value={100} suffix="%" />
                  </p>
                  <p className="text-muted-foreground mt-2">Units Inspected</p>
                </CardContent>
              </Card>

              {/* Barcode Metric Card */}
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, hsl(265, 51%, 51%) 0px, hsl(265, 51%, 51%) 2px, transparent 2px, transparent 6px)'
                  }}
                />
                <CardContent className="p-8 relative z-10">
                  <div className="font-mono text-xs mb-4" style={{ color: 'hsl(265, 51%, 51%)' }}>
                    |||| |||| |||| ||||
                  </div>
                  <p className="text-4xl font-bold" style={{ color: 'hsl(265, 51%, 51%)' }}>
                    <MetricCounter value={99.8} suffix="%" />
                  </p>
                  <p className="text-muted-foreground mt-2">Barcode Accuracy</p>
                  <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'hsl(265, 51%, 51%, 0.1)' }}>
                    <p className="text-sm font-medium">Verified with:</p>
                    <p className="text-xs text-muted-foreground mt-1">Industrial barcode scanners</p>
                  </div>
                </CardContent>
              </Card>

              {/* Pass/Fail Segmented Bar */}
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <CardContent className="p-8">
                  <Camera className="w-10 h-10 md:w-12 md:h-12 mb-4" style={{ color: 'hsl(265, 51%, 51%)' }} />
                  <p className="text-4xl font-bold" style={{ color: 'hsl(265, 51%, 51%)' }}>
                    <MetricCounter value={98} suffix="%" />
                  </p>
                  <p className="text-muted-foreground mb-4">Pass Rate</p>
                  
                  {/* Horizontal segmented bar */}
                  <div className="space-y-2">
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                      <div className="flex-1" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }} />
                      <div style={{ width: '2%', backgroundColor: 'hsl(0, 84%, 60%)' }} />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600 font-medium">Pass (98%)</span>
                      <span className="text-red-600 font-medium">Fail (2%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 5-Step Inspection Workflow */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">5-Step Inspection Workflow</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                { num: 1, icon: Package, title: "Shipment Arrival", desc: "Receive and log incoming shipment" },
                { num: 2, icon: FileCheck, title: "Count Verification", desc: "Verify quantity against packing list" },
                { num: 3, icon: Camera, title: "Photo Documentation", desc: "Take photos of all units and packaging" },
                { num: 4, icon: CheckCircle, title: "Quality Check", desc: "Inspect for damage, defects, compliance" },
                { num: 5, icon: AlertTriangle, title: "Discrepancy Report", desc: "Document and notify of any issues" }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl border-4 flex-shrink-0" 
                           style={{ borderColor: 'hsl(265, 51%, 51%)', color: 'hsl(265, 51%, 51%)' }}>
                        {step.num}
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0" 
                           style={{ backgroundColor: 'hsl(265, 51%, 51%, 0.1)' }}>
                        <step.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'hsl(265, 51%, 51%)' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold mb-1">{step.title}</h3>
                        <p className="text-muted-foreground text-sm md:text-base">{step.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {idx < 4 && (
                    <div className="hidden md:block absolute left-8 top-full w-0.5 h-6" style={{ backgroundColor: 'hsl(265, 51%, 51%)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Standards */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What We Inspect</h2>
            <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              Comprehensive quality control on every shipment
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { title: "Quantity Accuracy", desc: "Unit count verification" },
                { title: "Damage Assessment", desc: "Packaging & product condition" },
                { title: "Compliance Review", desc: "Labels, barcodes, expiration" },
                { title: "Photo Evidence", desc: "Visual documentation" }
              ].map((item, idx) => (
                <Card key={idx} className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-6 md:p-8">
                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: 'hsl(265, 51%, 51%, 0.1)' }}>
                      <CheckCircle className="w-7 h-7 md:w-8 md:h-8" style={{ color: 'hsl(265, 51%, 51%)' }} />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
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

        {/* Purple CTA Block */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <Card className="max-w-4xl mx-auto border-2 shadow-lg transition-all duration-300 hover:shadow-2xl" 
                  style={{ 
                    borderColor: 'hsl(265, 51%, 51%)',
                    boxShadow: '0 0 40px rgba(147, 51, 234, 0.2)'
                  }}>
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Professional QC?</h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Protect your inventory with meticulous inspection and documentation
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/contact")}
                  style={{ backgroundColor: 'hsl(265, 51%, 51%)', color: 'white' }}
                >
                  Start Inspection Service
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

export default ReceivingInspection;
