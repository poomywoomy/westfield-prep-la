import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StructuredData from "@/components/StructuredData";
import { Warehouse, Shield, Thermometer, BarChart3, CheckCircle } from "lucide-react";
import { MetricCounter } from "@/components/ui/metric-counter";

const StorageWarehousing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceData = {
    serviceType: "WarehouseService",
    name: "3PL Warehouse Storage & Prep Center Services",
    description: "Secure 3PL warehouse storage in Los Angeles. Climate-controlled prep center with pallet storage, lot control, and cycle counts for e-commerce inventory management.",
    features: ["Secure Racking", "Pallet Storage", "Lot Control", "Cycle Counts", "3PL Services"]
  };

  const faqData = [
    {
      question: "What types of storage options do you offer?",
      answer: "We offer pallet storage, bin storage, and custom shelving solutions in a climate-controlled, 24/7 monitored facility."
    },
    {
      question: "How is storage pricing calculated?",
      answer: "Storage is priced per pallet per month or per cubic foot for bin storage with flexible terms and no long-term commitments."
    },
    {
      question: "What security measures protect my inventory?",
      answer: "24/7 video surveillance, restricted access controls, insurance coverage, and regular security audits protect your inventory."
    }
  ];

  return (
    <>
      <Helmet>
        <title>3PL Warehouse Storage Los Angeles | Prep Center Inventory Solutions</title>
        <meta name="description" content="Secure 3PL warehouse storage in Los Angeles. Climate-controlled prep center with 24/7 security, pallet storage, and real-time inventory tracking for e-commerce brands." />
        <meta name="keywords" content="3pl los angeles, los angeles 3pl, prep center, warehouse storage, pallet storage, climate controlled warehouse, ecommerce fulfillment" />
        <link rel="canonical" href="https://westfieldprepcenter.com/storage-warehousing" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Storage & Warehousing", path: "/storage-warehousing" }]} />

        {/* Hero Section - DARK MODE with Cyan Glow */}
        <section className="relative py-20 md:py-24 bg-gray-900 text-white overflow-hidden">
          {/* Dark warehouse photo overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-95" />
          
          {/* Cyan glow line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(192,60%,55%)] to-transparent animate-glow" />

          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Storage & Warehousing
              </h1>
              <p className="text-xl md:text-2xl mb-8" style={{ color: 'hsl(192, 60%, 55%)' }}>
                Secure. Scalable. Climate-Controlled.
              </p>
              <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl">
                Industrial-grade storage with 24/7 security, climate control, and flexible terms. From single pallets to dedicated space.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/contact")}
                style={{ backgroundColor: 'hsl(192, 60%, 55%)', color: 'white' }}
              >
                Get Storage Quote
              </Button>
            </div>
          </div>
        </section>

        {/* Large Metric Tiles (3D Depth) */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* 3D Shadow Tile 1 */}
              <Card className="relative transition-all duration-300 hover:-translate-y-2"
                    style={{
                      boxShadow: `
                        0 1px 3px rgba(0,0,0,0.12),
                        0 4px 6px rgba(0,0,0,0.1),
                        0 8px 12px rgba(73, 169, 191, 0.15)
                      `
                    }}>
                <CardContent className="p-8 text-center">
                  <Warehouse className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" style={{ color: 'hsl(192, 60%, 55%)' }} />
                  <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'hsl(192, 60%, 55%)' }}>
                    <MetricCounter value={50000} suffix="+" />
                  </p>
                  <p className="text-muted-foreground">Sq Ft Facility</p>
                </CardContent>
              </Card>

              {/* Temperature/Humidity Sensor Card */}
              <Card className="relative transition-all duration-300 hover:-translate-y-2"
                    style={{
                      boxShadow: `
                        0 1px 3px rgba(0,0,0,0.12),
                        0 4px 6px rgba(0,0,0,0.1),
                        0 8px 12px rgba(73, 169, 191, 0.15)
                      `
                    }}>
                <CardContent className="p-8 text-center">
                  <Thermometer className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" style={{ color: 'hsl(192, 60%, 55%)' }} />
                  <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'hsl(192, 60%, 55%)' }}>
                    <MetricCounter value={72} suffix="°F" />
                  </p>
                  <p className="text-muted-foreground">Climate Controlled</p>
                  <div className="mt-4 flex justify-center">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="35%" fill="none" stroke="hsl(210, 20%, 90%)" strokeWidth="4" />
                        <circle cx="50%" cy="50%" r="35%" fill="none" stroke="hsl(192, 60%, 55%)" strokeWidth="4"
                                strokeDasharray="126" strokeDashoffset="31" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-sm font-bold" style={{ color: 'hsl(192, 60%, 55%)' }}>75%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Storage Capacity Card */}
              <Card className="relative transition-all duration-300 hover:-translate-y-2"
                    style={{
                      boxShadow: `
                        0 1px 3px rgba(0,0,0,0.12),
                        0 4px 6px rgba(0,0,0,0.1),
                        0 8px 12px rgba(73, 169, 191, 0.15)
                      `
                    }}>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" style={{ color: 'hsl(192, 60%, 55%)' }} />
                  <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'hsl(192, 60%, 55%)' }}>
                    <MetricCounter value={75} suffix="%" />
                  </p>
                  <p className="text-muted-foreground mb-4">Utilized</p>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" 
                         style={{ width: '75%', backgroundColor: 'hsl(192, 60%, 55%)' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Security Infrastructure */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Security Infrastructure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Shield, label: "24/7 CCTV" },
                { icon: Shield, label: "Access Control" },
                { icon: Shield, label: "Insurance Coverage" },
                { icon: Shield, label: "Security Audits" }
              ].map((item, idx) => (
                <Card key={idx} className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-6 md:p-8">
                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: 'hsl(192, 60%, 55%, 0.1)' }}>
                      <item.icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: 'hsl(192, 60%, 55%)' }} />
                    </div>
                    <p className="font-semibold">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Warehouse Features */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Warehouse Features</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
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
                "Same-day access to inventory"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{ color: 'hsl(192, 60%, 55%)' }} />
                  <p className="text-base md:text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqData.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-[hsl(192,60%,55%)]/10 via-[hsl(192,60%,55%)]/5 to-[hsl(192,60%,55%)]/10">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Secure Storage?</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get a custom storage quote tailored to your needs
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/contact")}
              style={{ backgroundColor: 'hsl(192, 60%, 55%)', color: 'white' }}
            >
              Get a Quote
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default StorageWarehousing;
