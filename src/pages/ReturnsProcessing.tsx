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
import { RotateCcw, ArrowRight, DollarSign, TrendingUp, PackageCheck, Camera, ClipboardCheck, GitBranch, CheckCircle2, XCircle } from "lucide-react";
import { MetricCounter } from "@/components/ui/metric-counter";

const ReturnsProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Returns Processing Services | Reverse Logistics Los Angeles",
    "Efficient returns processing in Los Angeles. 5h inspection, restocking, value recovery. Amazon FBA returns, customer returns, warranty claims.",
    "/returns-processing"
  );

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Returns Processing Services",
    "description": "Professional returns processing and reverse logistics",
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
        "name": "How fast do you process returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most returns are inspected and processed within 5 hours of arrival with immediate photo documentation and reporting."
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
        <Breadcrumbs items={[{ label: "Returns Processing", path: "/returns-processing" }]} />

        {/* Hero Section - DARK MODE with Ruby Accent Beam */}
        <section className="relative bg-gray-900 text-white py-20 md:py-24">
          {/* Red accent beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[hsl(350,89%,60%)] to-transparent opacity-50" />
          
          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Efficient Returns Processing
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Turn returns from cost center to revenue recovery. Fast inspection, smart sorting, and maximum value recovery on every returned item.
              </p>

              {/* Circular KPI ring showing processing time */}
              <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="35%" fill="none" 
                          stroke="rgba(239, 68, 68, 0.2)" strokeWidth="8" />
                  <circle cx="50%" cy="50%" r="35%" fill="none" 
                          stroke="rgb(239, 68, 68)" strokeWidth="8"
                          strokeDasharray="553" strokeDashoffset="138"
                          className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl md:text-5xl font-bold text-[hsl(350,89%,60%)]">
                    <MetricCounter value={5} suffix="h" />
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">Avg Processing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unique Stat Cards - Circular Rings, Timeline Arrows */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Circular Ring Card 1 */}
              <Card className="p-8 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="hsl(0, 0%, 90%)" strokeWidth="6" />
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="hsl(350, 89%, 60%)" strokeWidth="6"
                            strokeDasharray="251" strokeDashoffset="63" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl md:text-3xl font-bold text-[hsl(350,89%,60%)]">
                      <MetricCounter value={85} suffix="%" />
                    </p>
                  </div>
                </div>
                <p className="font-semibold">Recovery Rate</p>
                <p className="text-sm text-muted-foreground mt-2">Value recovered from returns</p>
              </Card>

              {/* Timeline Arrow Card */}
              <Card className="p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  {["Receive", "Inspect", "Sort", "Restock"].map((step, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" 
                           style={{ backgroundColor: 'hsl(350, 89%, 60%, 0.2)', color: 'hsl(350, 89%, 60%)' }}>
                        {idx + 1}
                      </div>
                      {idx < 3 && <ArrowRight className="w-4 h-4 mx-1 text-[hsl(350,89%,60%)]" />}
                    </div>
                  ))}
                </div>
                <p className="text-3xl md:text-4xl font-bold text-[hsl(350,89%,60%)] mb-2">
                  <MetricCounter value={4} />
                </p>
                <p className="font-semibold">Step Process</p>
                <p className="text-sm text-muted-foreground mt-2">Streamlined reverse logistics</p>
              </Card>

              {/* Reverse-Flow Process Card */}
              <Card className="p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <RotateCcw className="w-10 h-10 md:w-12 md:h-12 mb-4 mx-auto text-[hsl(350,89%,60%)]" />
                <p className="text-3xl md:text-4xl font-bold text-[hsl(350,89%,60%)] mb-2">
                  <MetricCounter value={24} suffix="h" />
                </p>
                <p className="font-semibold">Max Turnaround</p>
                <p className="text-sm text-muted-foreground mt-2">From arrival to restocked</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Returns Processing Workflow */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Returns Processing Workflow
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Every return follows our proven 5-step process for maximum value recovery
            </p>

            {/* Return Types */}
            <div className="flex flex-wrap gap-3 justify-center mb-16">
              {["Customer Returns", "FBA Returns", "Damaged in Transit", "Quality Issues"].map((type, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 bg-[hsl(350,89%,60%)]/10 text-[hsl(350,89%,60%)] rounded-full text-sm font-medium border border-[hsl(350,89%,60%)]/20"
                >
                  {type}
                </span>
              ))}
            </div>

            {/* 5-Step Workflow Cards */}
            <div className="max-w-6xl mx-auto relative">
              {/* Connection Lines (hidden on mobile) */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(350,89%,60%)]/20 via-[hsl(350,89%,60%)]/50 to-[hsl(350,89%,60%)]/20 -translate-y-1/2 pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {[
                  {
                    step: 1,
                    icon: PackageCheck,
                    title: "Return Received",
                    desc: "Items logged, quantities verified, added to receiving location"
                  },
                  {
                    step: 2,
                    icon: Camera,
                    title: "QC Photo Documentation",
                    desc: "Mandatory photos uploaded for transparency (30-day retention)",
                    highlight: true
                  },
                  {
                    step: 3,
                    icon: ClipboardCheck,
                    title: "Quality Inspection",
                    desc: "Physical inspection, damage assessment, functionality testing"
                  },
                  {
                    step: 4,
                    icon: GitBranch,
                    title: "Condition Decision",
                    desc: "Resellable → Available | Damaged → Damaged location",
                    split: true
                  },
                  {
                    step: 5,
                    icon: CheckCircle2,
                    title: "Final Disposition",
                    desc: "Resellable items restocked, damaged items flagged"
                  }
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Card 
                      key={item.step}
                      className={`p-6 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                        item.highlight ? 'border-2 border-[hsl(350,89%,60%)]/50 bg-[hsl(350,89%,60%)]/5' : ''
                      }`}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(350,89%,60%)]/10 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-[hsl(350,89%,60%)]" />
                      </div>
                      <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[hsl(350,89%,60%)] text-white flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </Card>
                  );
                })}
              </div>

              {/* Two-Path Visualization at Step 4 */}
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Green Path - Resellable */}
                  <Card className="p-6 border-2 border-green-500/50 bg-green-50">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                      <h3 className="font-bold text-green-800">Resellable Items</h3>
                    </div>
                    <p className="text-sm text-green-700 mb-4">
                      Items pass QC inspection and are restocked to available inventory for resale
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">qc_pass</span>
                      <ArrowRight className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Available Inventory</span>
                    </div>
                  </Card>

                  {/* Red Path - Damaged */}
                  <Card className="p-6 border-2 border-red-500/50 bg-red-50">
                    <div className="flex items-center gap-3 mb-3">
                      <XCircle className="w-8 h-8 text-red-600" />
                      <h3 className="font-bold text-red-800">Damaged Items</h3>
                    </div>
                    <p className="text-sm text-red-700 mb-4">
                      Items fail QC inspection and are moved to damaged inventory for disposal or repair
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-medium">qc_fail</span>
                      <ArrowRight className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Damaged Inventory</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Cards */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Value Recovery Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <DollarSign className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-[hsl(350,89%,60%)]" />
                <p className="text-5xl md:text-6xl font-bold text-[hsl(350,89%,60%)]">
                  <MetricCounter value={87} prefix="$" suffix="K" />
                </p>
                <p className="text-muted-foreground mt-2">Avg Monthly Value Recovery</p>
              </Card>

              <Card className="p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <TrendingUp className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-[hsl(350,89%,60%)]" />
                <p className="text-5xl md:text-6xl font-bold text-[hsl(350,89%,60%)]">
                  <MetricCounter value={92} suffix="%" />
                </p>
                <p className="text-muted-foreground mt-2">Resellable Rate</p>
              </Card>
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

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-[hsl(350,89%,60%)]/10 via-[hsl(350,89%,60%)]/5 to-[hsl(350,89%,60%)]/10">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Streamline Your Returns Today</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop losing money on mishandled returns. Recover maximum value from every item.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/contact")}
              style={{ backgroundColor: 'hsl(350, 89%, 60%)', color: 'white' }}
            >
              Get Started
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ReturnsProcessing;
