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
import { BarChart3, TrendingUp, Package, AlertCircle, CheckCircle } from "lucide-react";
import { MetricCounter } from "@/components/ui/metric-counter";

const InventoryManagement = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Inventory Management | Los Angeles 3PL Prep Center Services",
    "Real-time inventory management at our Los Angeles 3PL. Prep center with SKU tracking, low-stock alerts, and cycle counts for e-commerce brands.",
    "/inventory-management"
  );

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Inventory Management Services",
    "description": "Real-time inventory tracking and management with advanced analytics",
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
        "name": "How often do you perform cycle counts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We perform daily cycle counts on high-velocity SKUs and monthly counts on all inventory."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see my inventory in real-time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our WMS provides real-time inventory visibility 24/7 through your client dashboard."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content="3pl los angeles, inventory management, prep center, sku tracking, cycle counts, ecommerce inventory" />
        <link rel="canonical" href={meta.canonical} />
      </Helmet>

      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Inventory Management", path: "/inventory-management" }]} />

        {/* Hero Section - Warehouse Grid Pattern with Amber */}
        <section className="relative py-20">
          {/* Grid Pattern Background */}
          <div className="absolute inset-0 opacity-5 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 h-full">
              {[...Array(120)].map((_, i) => (
                <div key={i} className="border border-[hsl(43,96%,56%)]" />
              ))}
            </div>
          </div>

          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 relative">
                Real-Time Inventory Control
                <span className="block h-1 w-24 bg-[hsl(43,96%,56%)] mt-4" />
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl">
                Data-driven inventory management with cycle counts, analytics, and automated reorder alerts. Never run out of stock again.
              </p>

              {/* Hero Stat Card */}
              <div className="mt-12 bg-gradient-to-br from-[hsl(43,96%,56%)]/10 to-[hsl(43,96%,56%)]/5 p-6 md:p-8 rounded-2xl border border-[hsl(43,96%,56%)]/20 animate-slide-up">
                <p className="text-sm font-medium mb-2" style={{ color: 'hsl(43, 80%, 40%)' }}>Real-Time Inventory Value</p>
                <p className="text-5xl md:text-7xl font-bold animate-count-up" style={{ color: 'hsl(43, 96%, 56%)' }}>
                  <MetricCounter value={2.4} prefix="$" suffix="M+" />
                </p>
                <p className="text-muted-foreground mt-2">Across 500+ client SKUs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Angular Geometric Stat Cards */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Angular Card 1 - Clipped Corners */}
              <Card 
                className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
                  borderColor: 'hsl(43, 96%, 56%)'
                }}
              >
                <CardContent className="p-8">
                  <Package className="w-10 h-10 md:w-12 md:h-12 mb-4" style={{ color: 'hsl(43, 96%, 56%)' }} />
                  <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'hsl(43, 96%, 56%)' }}>
                    <MetricCounter value={10000} suffix="+" />
                  </p>
                  <p className="text-muted-foreground">SKUs Tracked</p>
                  {/* Mini bar chart built-in */}
                  <div className="mt-4 space-y-2">
                    {[85, 65, 92].map((width, i) => (
                      <div key={i} className="h-1.5 rounded-full transition-all duration-1000" style={{ width: `${width}%`, backgroundColor: 'hsl(43, 96%, 56%)' }} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Angular Card 2 - Clipped Corners with Mini Bar Chart */}
              <Card 
                className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{ 
                  clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)',
                  borderColor: 'hsl(43, 96%, 56%)'
                }}
              >
                <CardContent className="p-8">
                  <CheckCircle className="w-10 h-10 md:w-12 md:h-12 mb-4" style={{ color: 'hsl(43, 96%, 56%)' }} />
                  <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'hsl(43, 96%, 56%)' }}>
                    <MetricCounter value={99.9} suffix="%" />
                  </p>
                  <p className="text-muted-foreground">Accuracy Rate</p>
                  {/* Horizontal bar showing accuracy */}
                  <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: '99.9%', backgroundColor: 'hsl(43, 96%, 56%)' }} />
                  </div>
                </CardContent>
              </Card>

              {/* Angular Card 3 - Heavy Numeric Focus */}
              <Card 
                className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{ 
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
                  borderColor: 'hsl(43, 96%, 56%)'
                }}
              >
                <CardContent className="p-8">
                  <TrendingUp className="w-10 h-10 md:w-12 md:h-12 mb-4" style={{ color: 'hsl(43, 96%, 56%)' }} />
                  <p className="text-3xl md:text-4xl font-bold mb-2 relative">
                    Real-Time
                    <span className="absolute -bottom-1 left-0 w-16 h-0.5" style={{ backgroundColor: 'hsl(43, 96%, 56%)' }} />
                  </p>
                  <p className="text-muted-foreground">Sync Updates</p>
                  <p className="text-sm mt-4 font-mono" style={{ color: 'hsl(43, 80%, 40%)' }}>
                    Updated every 60 seconds
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Smart Inventory Tracking - Stacked Cards */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Smart Inventory Tracking</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                { icon: BarChart3, title: "Real-Time Dashboard", desc: "Live inventory levels across all locations" },
                { icon: AlertCircle, title: "Low Stock Alerts", desc: "Automated notifications before you run out" },
                { icon: TrendingUp, title: "Demand Forecasting", desc: "Predictive analytics for optimal stock levels" },
                { icon: CheckCircle, title: "Cycle Count Automation", desc: "Daily counts on high-velocity SKUs" }
              ].map((item, idx) => (
                <Card key={idx} className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: 'hsl(43, 96%, 56%)' }} />
                  <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'hsl(43, 96%, 56%, 0.1)' }}>
                      <item.icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: 'hsl(43, 96%, 56%)' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cycle Count Automation - Numbered Steps */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Cycle Count Automation</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { num: "1", label: "Schedule" },
                { num: "2", label: "Scan" },
                { num: "3", label: "Verify" },
                { num: "4", label: "Adjust" },
                { num: "5", label: "Report" }
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full flex items-center justify-center border-4 font-bold text-xl md:text-2xl transition-all duration-300 hover:scale-110" 
                       style={{ borderColor: 'hsl(43, 96%, 56%)', color: 'hsl(43, 96%, 56%)' }}>
                    {step.num}
                  </div>
                  <p className="font-semibold text-sm md:text-base">{step.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKU Leaderboard - Table Style */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Top Performing SKUs</h2>
            <Card className="max-w-5xl mx-auto overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: 'hsl(43, 96%, 56%, 0.1)' }}>
                      <tr>
                        <th className="px-4 md:px-6 py-4 text-left font-semibold">Rank</th>
                        <th className="px-4 md:px-6 py-4 text-left font-semibold">SKU</th>
                        <th className="px-4 md:px-6 py-4 text-left font-semibold">Velocity</th>
                        <th className="px-4 md:px-6 py-4 text-left font-semibold">Stock Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { rank: "🥇", sku: "SKU-1234", velocity: "150/day", stock: "High" },
                        { rank: "🥈", sku: "SKU-5678", velocity: "120/day", stock: "Medium" },
                        { rank: "🥉", sku: "SKU-9012", velocity: "95/day", stock: "High" }
                      ].map((row, idx) => (
                        <tr key={idx} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="px-4 md:px-6 py-4 text-xl md:text-2xl">{row.rank}</td>
                          <td className="px-4 md:px-6 py-4 font-mono font-semibold text-sm md:text-base">{row.sku}</td>
                          <td className="px-4 md:px-6 py-4 text-sm md:text-base" style={{ color: 'hsl(43, 96%, 56%)' }}>{row.velocity}</td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium" 
                                  style={{ backgroundColor: 'hsl(43, 96%, 56%, 0.2)', color: 'hsl(43, 80%, 40%)' }}>
                              {row.stock}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
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
        <section className="py-20 bg-gradient-to-r from-[hsl(43,96%,56%)]/10 via-[hsl(43,96%,56%)]/5 to-[hsl(43,96%,56%)]/10">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Take Control of Your Inventory</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Real-time visibility, automated counts, and predictive analytics
            </p>
            <Button size="lg" onClick={() => navigate("/contact")}>
              Schedule a Demo
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default InventoryManagement;
