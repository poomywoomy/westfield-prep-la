import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reviews from "@/components/Reviews";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LiveMetrics from "@/components/LiveMetrics";
import ResultsSnapshot from "@/components/ResultsSnapshot";
import { Zap, Video, Package, Truck, Sparkles, TrendingUp, Camera, CheckCircle, Users, Clock, Award, Boxes } from "lucide-react";

const TikTokShopFulfillment = () => {
  const navigate = useNavigate();

  const faqData = [
    { question: "Can you handle viral spikes in orders?", answer: "Absolutely. We're built for TikTok's rapid pace and can scale quickly to handle sudden surges from viral content." },
    { question: "What about creator-friendly unboxing?", answer: "We specialize in packaging that looks amazing on camera with custom branding, tissue paper, stickers, and thank-you notes." },
    { question: "How fast can you fulfill trending products?", answer: "Orders placed before 2 PM PST ship same-day. We prioritize speed to capitalize on viral moments." },
    { question: "Do you offer photo documentation?", answer: "Yes, every order includes photo-proof QC documentation so you can verify quality before shipping." }
  ];

  const serviceData = {
    serviceType: "FulfillmentService",
    name: "TikTok Shop Fulfillment",
    description: "Fast FBT workflows, creator-friendly packaging, and reliable shipping for TikTok Shop sellers.",
    features: ["Rapid Turnaround", "Creator-Ready Packaging", "Flexible Kitting", "Fast Shipping", "Viral-Ready Scaling"]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>TikTok Shop Fulfillment in Los Angeles | TikTok 3PL LA | Westfield Prep Center</title>
        <meta name="description" content="Scale your TikTok Shop with professional fulfillment from WestfieldPrepCenter.com. Based in Los Angeles, we handle order processing, packing, and shipping for sellers across Southern California." />
        <link rel="canonical" href="https://westfieldprepcenter.com/tiktok-shop-fulfillment/" />
        <meta property="og:url" content="https://westfieldprepcenter.com/tiktok-shop-fulfillment/" />
        <meta property="og:type" content="article" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "TikTok Shop Fulfillment", path: "/tiktok-shop-fulfillment/" }]} />
        
        <main className="flex-1">
          {/* Hero Section - TikTok Dynamic Theme */}
          <section className="relative py-24 mt-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-cyan-500/10 to-yellow-500/10" />
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 via-cyan-500/10 to-yellow-500/10 border border-pink-500/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
                  <Sparkles className="h-4 w-4 text-pink-600 animate-pulse" />
                  <span className="text-sm font-medium bg-gradient-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent">Viral-Ready Fulfillment</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-cyan-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in">
                  TikTok Shop Fulfillment
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  Lightning-fast fulfillment, creator-optimized packaging, and viral-moment scaling for TikTok sellers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <Button size="lg" className="bg-gradient-to-r from-pink-600 via-pink-500 to-cyan-500 hover:opacity-90 shadow-lg hover:shadow-pink-500/50 transition-all" onClick={() => navigate("/contact")}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get a Quote
                  </Button>
                  <Button size="lg" variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400" onClick={() => navigate("/contact")}>
                    See Our Work
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Services Grid - Bold Energetic Cards */}
          <section className="py-20 bg-gradient-to-b from-background via-pink-50/20 to-cyan-50/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent">
                  Built for TikTok's Lightning Pace
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Fulfillment that keeps up with viral moments and creator demands
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="relative overflow-hidden border-2 border-pink-200/60 hover:border-pink-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-gradient-to-br from-white to-pink-50/30">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-xl">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Viral-Speed Fulfillment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Same-day fulfillment to capitalize on trending moments before they fade.</p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-cyan-200/60 hover:border-cyan-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-gradient-to-br from-white to-cyan-50/30">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-xl">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Creator-Optimized</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Packaging designed to look stunning in unboxing videos and content.</p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-yellow-200/60 hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-gradient-to-br from-white to-yellow-50/30">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-xl">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Viral Bundle Kitting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Rapid bundle assembly for limited drops and promotional campaigns.</p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-pink-200/60 hover:border-pink-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-gradient-to-br from-white to-pink-50/30">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500" />
                  <CardHeader className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-pink-600 via-pink-700 to-pink-800 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-xl">
                      <Truck className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Express Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">2-3 day nationwide shipping from our strategic LA hub.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* TikTok-Specific Features */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Built for TikTok Creators & Sellers</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Features designed specifically for the TikTok ecosystem
                </p>
              </div>
              <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: Camera, title: "Unboxing-Ready Packaging", desc: "Premium packaging materials designed to look amazing on camera with custom branding and inserts", color: "from-pink-500 to-pink-600" },
                  { icon: TrendingUp, title: "Viral Surge Scaling", desc: "Rapid capacity scaling to handle sudden order spikes from viral videos and trending products", color: "from-cyan-500 to-cyan-600" },
                  { icon: Clock, title: "Same-Day Processing", desc: "Orders before 2 PM PST ship same-day to capitalize on trending moments", color: "from-yellow-500 to-yellow-600" },
                  { icon: Users, title: "Influencer Partnerships", desc: "Special handling for influencer collaborations and limited-edition creator drops", color: "from-pink-600 to-pink-700" },
                  { icon: Award, title: "Quality Photo Proof", desc: "Documented QC photos for every order so you can share quality with customers", color: "from-cyan-600 to-cyan-700" },
                  { icon: Boxes, title: "Flash Drop Support", desc: "Rapid kitting and fulfillment for surprise drops and limited-time offers", color: "from-yellow-600 to-yellow-700" },
                ].map((item, idx) => (
                  <Card key={idx} className="border-2 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-400/20 via-cyan-400/20 to-yellow-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                    <CardHeader className="relative">
                      <div className={`h-12 w-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-20 bg-gradient-to-b from-pink-50/30 via-cyan-50/20 to-yellow-50/30">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12">Our Lightning-Fast Process</h2>
              <div className="max-w-4xl mx-auto space-y-6">
                {[
                  { step: 1, title: "Receive Inventory", desc: "Inbound shipments checked in and QC'd, ready for instant fulfillment", icon: Package },
                  { step: 2, title: "Auto Order Sync", desc: "Orders automatically imported from TikTok Shop in real-time", icon: Zap },
                  { step: 3, title: "Creator-Ready Pick & Pack", desc: "Fast picking with camera-friendly packaging, branded inserts, and custom materials", icon: Video },
                  { step: 4, title: "Photo Documentation", desc: "Quality control photos captured for every order before shipping", icon: Camera },
                  { step: 5, title: "Same-Day Shipping", desc: "Orders placed before 2 PM PST ship same business day", icon: Truck },
                  { step: 6, title: "Live Tracking Updates", desc: "Real-time tracking synced back to TikTok Shop and customer notifications", icon: TrendingUp },
                ].map((item) => (
                  <Card key={item.step} className="border-l-4 border-l-pink-500 hover:border-l-cyan-500 hover:shadow-lg transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-500 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <item.icon className="h-6 w-6 text-pink-600" />
                            {item.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pl-[4.5rem]">
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Success Metrics */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Creator Success Stories</h2>
                <p className="text-muted-foreground text-lg">Real results from TikTok sellers we've powered</p>
              </div>
              <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                {[
                  { metric: "99.8%", label: "On-Time Ship Rate", desc: "Same-day fulfillment during viral moments" },
                  { metric: "2-3 Days", label: "Avg Delivery Time", desc: "Fast nationwide shipping from LA" },
                  { metric: "5000+", label: "Orders/Day Capacity", desc: "Ready to scale with your viral growth" },
                ].map((item, idx) => (
                  <Card key={idx} className="text-center border-2 border-pink-200/50 hover:border-pink-400 hover:shadow-2xl transition-all">
                    <CardHeader>
                      <CardTitle className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-cyan-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                        {item.metric}
                      </CardTitle>
                      <p className="text-xl font-semibold text-foreground">{item.label}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Live Metrics */}
          <LiveMetrics 
            metrics={[
              { label: "Orders Fulfilled This Year", value: 400000, type: "counter" },
              { label: "Same-Day Ship Rate", value: 99.2, type: "percentage" },
              { label: "Average Order Accuracy", value: 99.8, type: "percentage" }
            ]}
            platformTheme="tiktok"
          />

          {/* Results Snapshot */}
          <ResultsSnapshot 
            results={[
              {
                industry: "Beauty & Cosmetics",
                challenge: "Creator-owned brand experienced viral spike with 10x normal order volume overnight",
                solution: "Scaled fulfillment team and extended hours to handle surge within 48 hours",
                results: "Maintained 99.8% same-day ship rate during viral moment"
              },
              {
                industry: "Fashion Accessories",
                challenge: "Jewelry brand needed creator-optimized packaging for influencer unboxing videos",
                solution: "Custom branded boxes with tissue paper, stickers, and thank-you cards",
                results: "Featured in 50+ creator unboxing videos, 200% sales increase"
              },
              {
                industry: "Wellness Products",
                challenge: "Flash drop required assembly of 5,000 promotional bundles in 72 hours",
                solution: "Dedicated kitting team worked around the clock with quality control",
                results: "All bundles assembled on time, zero assembly errors reported"
              }
            ]}
            platformTheme="tiktok"
          />

          <Reviews />

          {/* FAQ */}
          <section className="py-20 bg-gradient-to-b from-pink-50/30 to-cyan-50/30">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Can you handle viral spikes in orders?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely. We're built for TikTok's rapid pace and can scale quickly to handle sudden surges from viral content.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What about creator-friendly unboxing?</AccordionTrigger>
                    <AccordionContent>
                      We specialize in packaging that looks amazing on camera with custom branding, tissue paper, stickers, and thank-you notes.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How fast can you fulfill trending products?</AccordionTrigger>
                    <AccordionContent>
                      Orders placed before 2 PM PST ship same-day. We prioritize speed to capitalize on viral moments.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Do you offer photo documentation?</AccordionTrigger>
                    <AccordionContent>
                      Yes, every order includes photo-proof QC documentation so you can verify quality before shipping.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Do you integrate with TikTok Shop API?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we can integrate with TikTok Shop for automated order import, inventory sync, and real-time tracking updates.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>Can you handle influencer collaboration orders?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely. We specialize in creator-friendly packaging and fast turnaround for influencer collabs with special handling options.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-7">
                    <AccordionTrigger>How fast can you scale for viral products?</AccordionTrigger>
                    <AccordionContent>
                      We can scale to 10x volume within 48 hours by adding team members, extending hours, and prioritizing viral products.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-8">
                    <AccordionTrigger>Do you offer rush processing for trending items?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer same-day rush service for viral products that need immediate fulfillment to capitalize on trending moments.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-9">
                    <AccordionTrigger>Can you create custom bundles for TikTok promotions?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we excel at rapid bundle assembly for flash sales, limited drops, and promotional campaigns with quick turnaround.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-10">
                    <AccordionTrigger>Do you support TikTok Shop returns and exchanges?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we handle returns inspection, restocking, exchange processing, and refurbishment with full documentation.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-11">
                    <AccordionTrigger>How do you handle flash sale fulfillment?</AccordionTrigger>
                    <AccordionContent>
                      Priority queue for flash sales with dedicated team members assigned during peak periods to ensure rapid fulfillment.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-12">
                    <AccordionTrigger>Can you ship internationally for TikTok Shop?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we ship worldwide with customs forms, duty calculations, and international carrier partnerships for global reach.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-13">
                    <AccordionTrigger>Do you offer branded packaging for TikTok creators?</AccordionTrigger>
                    <AccordionContent>
                      Yes, custom branded boxes, tissue paper, stickers, and inserts specifically designed for unboxing content and social media.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-14">
                    <AccordionTrigger>What's your capacity for high-volume TikTok orders?</AccordionTrigger>
                    <AccordionContent>
                      We process up to 5,000 orders per day with ability to scale for viral spikes through flexible staffing and extended hours.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-15">
                    <AccordionTrigger>Can you handle live shopping event fulfillment?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer real-time fulfillment support during TikTok live shopping events with dedicated team members on standby.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          {/* CTA - TikTok Dynamic Theme */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-cyan-600 to-yellow-600" />
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
            <div className="container mx-auto px-4 text-center relative">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Ready to Go Viral?
              </h2>
              <p className="text-xl mb-8 text-white/95 max-w-2xl mx-auto drop-shadow">
                Get fulfillment that scales with your TikTok success. Quote in 24 hours.
              </p>
              <Button size="lg" className="bg-white text-pink-600 hover:bg-white/90 shadow-2xl hover:shadow-white/50 transition-all" onClick={() => navigate("/contact")}>
                <Sparkles className="mr-2 h-4 w-4" />
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

export default TikTokShopFulfillment;