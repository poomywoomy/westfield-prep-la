import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StructuredData from "@/components/StructuredData";
import { Plus, ArrowRight, Package, Gift, CheckCircle } from "lucide-react";
import { MetricCounter } from "@/components/ui/metric-counter";

const KittingBundling = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceData = {
    serviceType: "Service",
    name: "Kitting & Bundling Services - Los Angeles 3PL Prep Center",
    description: "Custom kitting and bundling at our LA 3PL prep center. Multi-SKU kits, gift sets, and promotional bundles with photo-proof QC.",
    features: ["Multi-SKU Kits", "Gift Sets", "Promotional Bundles", "Photo-Proof QC", "3PL Services"]
  };

  const faqData = [
    {
      question: "What types of kitting services do you offer?",
      answer: "We offer multi-SKU kits, gift sets, promotional bundles, subscription box assembly, influencer PR boxes, and custom branded packaging."
    },
    {
      question: "How long does kit assembly take?",
      answer: "Standard kit assembly takes 1-3 business days depending on complexity and volume. Rush assembly is available for urgent needs."
    },
    {
      question: "Do you provide photos of completed kits?",
      answer: "Yes. Every kit is photographed during QC to ensure accuracy. Photos are available in your dashboard for verification."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Kitting & Bundling Services | Los Angeles 3PL Prep Center</title>
        <meta name="description" content="Custom kitting and bundling at our LA prep center. 3PL services for subscription boxes, product sets, and promotional bundles with same-day assembly." />
        <meta name="keywords" content="3pl los angeles, kitting services, bundling, prep center, subscription box assembly, product kitting" />
        <link rel="canonical" href="https://westfieldprepcenter.com/kitting-bundling" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Kitting & Bundling", path: "/kitting-bundling" }]} />

        {/* Hero Section - Organic Shapes with Emerald */}
        <section className="relative py-20 bg-gradient-to-br from-[hsl(160,84%,39%)]/5 via-background to-background overflow-hidden">
          {/* Organic soft shapes background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <circle cx="10%" cy="20%" r="100" fill="url(#emerald-gradient)" />
              <circle cx="80%" cy="60%" r="150" fill="url(#emerald-gradient)" />
              <circle cx="50%" cy="80%" r="120" fill="url(#emerald-gradient)" />
              <defs>
                <radialGradient id="emerald-gradient">
                  <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto">
              {/* Assembly diagram */}
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[hsl(160,84%,39%)]/10 border-2 border-[hsl(160,84%,39%)] flex items-center justify-center">
                  <Package className="w-6 h-6 md:w-8 md:h-8 text-[hsl(160,84%,39%)]" />
                </div>
                <Plus className="w-6 h-6 md:w-8 md:h-8 text-[hsl(160,84%,39%)]" />
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[hsl(160,84%,39%)]/10 border-2 border-[hsl(160,84%,39%)] flex items-center justify-center">
                  <Package className="w-6 h-6 md:w-8 md:h-8 text-[hsl(160,84%,39%)]" />
                </div>
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-[hsl(160,84%,39%)]" />
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[hsl(160,84%,39%)] border-2 border-[hsl(160,84%,39%)] flex items-center justify-center">
                  <Gift className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
                Kitting & Bundling Services
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-center mb-8 max-w-3xl mx-auto">
                Multi-SKU kits, gift sets, and promotional bundles assembled with precision. Photo-proof QC on every kit.
              </p>
              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/contact")}
                  style={{ backgroundColor: 'hsl(160, 84%, 39%)', color: 'white' }}
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Puzzle-Piece Modular Cards */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Kit Assembly Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Puzzle Piece Card 1 */}
              <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                    style={{ 
                      borderColor: 'hsl(160, 84%, 39%)',
                      clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%)'
                    }}>
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
                       style={{ backgroundColor: 'hsl(160, 84%, 39%, 0.1)' }}>
                    <Package className="w-7 h-7 md:w-8 md:h-8" style={{ color: 'hsl(160, 84%, 39%)' }} />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'hsl(160, 84%, 39%)' }}>
                    <MetricCounter value={2} suffix="+" />
                  </p>
                  <p className="font-semibold mb-1">Multi-SKU Kits</p>
                  <p className="text-sm text-muted-foreground">Items per bundle</p>
                </CardContent>
              </Card>

              {/* Puzzle Piece Card 2 - Component Breakdown */}
              <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                    style={{ 
                      borderColor: 'hsl(160, 84%, 39%)',
                      clipPath: 'polygon(30px 0, 100% 0, 100% 100%, 0 100%, 0 30px)'
                    }}>
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded border-2" style={{ borderColor: 'hsl(160, 84%, 39%)' }} />
                    <div className="w-6 h-6 rounded border-2" style={{ borderColor: 'hsl(160, 84%, 39%)' }} />
                    <ArrowRight className="w-6 h-6" style={{ color: 'hsl(160, 84%, 39%)' }} />
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: 'hsl(160, 84%, 39%)' }} />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'hsl(160, 84%, 39%)' }}>
                    <MetricCounter value={5} />
                  </p>
                  <p className="font-semibold mb-1">Min/Kit</p>
                  <p className="text-sm text-muted-foreground">Assembly time</p>
                </CardContent>
              </Card>

              {/* Before/After Efficiency Card */}
              <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                    style={{ 
                      borderColor: 'hsl(160, 84%, 39%)',
                      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)'
                    }}>
                <CardContent className="p-0">
                  <div className="p-6 border-b-2" style={{ borderColor: 'hsl(160, 84%, 39%, 0.3)' }}>
                    <p className="text-sm text-muted-foreground mb-1">Before</p>
                    <p className="text-2xl font-bold text-muted-foreground line-through">30 min</p>
                  </div>
                  <div className="p-6" style={{ backgroundColor: 'hsl(160, 84%, 39%, 0.05)' }}>
                    <p className="text-sm mb-1" style={{ color: 'hsl(160, 70%, 30%)' }}>After</p>
                    <p className="text-3xl md:text-4xl font-bold" style={{ color: 'hsl(160, 84%, 39%)' }}>
                      <MetricCounter value={5} suffix=" min" />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Common Kitting Use Cases</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Subscription box assembly",
                "Holiday gift sets",
                "Product sample kits",
                "Influencer PR boxes",
                "Promotional bundles",
                "New customer welcome kits",
                "Loyalty program rewards",
                "Event swag bags"
              ].map((useCase, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{ color: 'hsl(160, 84%, 39%)' }} />
                  <p className="text-base md:text-lg">{useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
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
        <section className="py-16 md:py-20 bg-gradient-to-r from-[hsl(160,84%,39%)]/10 via-[hsl(160,84%,39%)]/5 to-[hsl(160,84%,39%)]/10">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Custom Kits?</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your kitting needs and create something special
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/contact")}
              style={{ backgroundColor: 'hsl(160, 84%, 39%)', color: 'white' }}
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

export default KittingBundling;
