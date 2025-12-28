import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Check, Zap, Clock, Shield, DollarSign, 
  ShieldCheck, BarChart3, Users, Calendar, 
  ArrowRight, Sparkles, Package, Truck
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const EnhancedROICalculator = lazy(() => import("@/components/EnhancedROICalculator"));

const Pricing = () => {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [savedCalculation, setSavedCalculation] = useState<{
    monthlyUnits?: number;
    estimatedSavings?: number;
    roiPercent?: number;
  } | null>(null);

  const serviceData = {
    serviceType: "Service",
    name: "3PL Fulfillment & Prep Center Services",
    description: "Custom 3PL pricing for receiving, FBA prep, DTC fulfillment, storage, and multi-channel integration. Transparent, volume-based rates in Los Angeles.",
    features: ["Receiving & Inspection", "FBA Prep & Labeling", "DTC Fulfillment", "Storage Solutions", "Returns Processing", "Photo Documentation", "Inventory Tracking", "Multi-Channel Support"]
  };

  const faqData = [
    { 
      question: "How is 3PL pricing calculated?", 
      answer: "We use volume-based pricing that scales with your business. Pricing is based on services needed (receiving, prep, storage, fulfillment), monthly volume, and product complexity. The more you ship, the better your per-unit rates." 
    },
    { 
      question: "Are there any setup fees or minimums?", 
      answer: "No setup fees or long-term contracts required. We work with businesses of all sizes. While we don't have strict minimums, pricing is optimized for businesses shipping at least 100 units per month." 
    },
    { 
      question: "What's included in your fulfillment pricing?", 
      answer: "Our fulfillment pricing includes pick, pack, quality control, shipping label generation, and photo documentation. Storage, receiving, and additional prep services are priced separately based on your needs." 
    },
    { 
      question: "Do you charge for receiving inventory?", 
      answer: "Yes, we charge a per-carton or per-pallet fee for receiving and inspection. This includes check-in, inventory counting, photo documentation, and system updates. Exact rates depend on shipment size and frequency." 
    },
    { 
      question: "How does storage pricing work?", 
      answer: "Storage is billed monthly based on space used (pallet or cubic feet). Rates vary by volume—higher volume clients receive preferred pricing. We also offer overflow and seasonal storage options." 
    },
    { 
      question: "Can I get a custom quote for my business?", 
      answer: "Absolutely! Every business is unique. Contact us with your monthly volume, services needed, and product details. We'll provide a detailed pricing breakdown within 24 hours with no commitment required." 
    }
  ];

  const highlights = [
    { icon: Zap, title: "48-Hour Turnaround", description: "Fast processing for your orders" },
    { icon: ShieldCheck, title: "FBA Compliance", description: "Amazon/Walmart prep to spec" },
    { icon: BarChart3, title: "Real-Time Inventory", description: "Full visibility into stock" },
    { icon: Users, title: "Dedicated Support", description: "Hands-on fulfillment specialists" },
  ];

  const serviceCards = [
    { icon: Package, service: "Receiving", description: "Per carton or pallet inspection and check-in" },
    { icon: ShieldCheck, service: "FBA Prep", description: "FNSKU labeling, polybagging, bubble wrap, bundling" },
    { icon: Truck, service: "DTC Fulfillment", description: "Pick, pack, and ship direct to your customers" },
    { icon: BarChart3, service: "Storage", description: "Secure, climate-controlled warehouse space" },
    { icon: Clock, service: "Returns Processing", description: "Inspection, restocking, and customer updates" },
    { icon: Shield, service: "Photo Documentation", description: "Quality control and proof of service" },
    { icon: Check, service: "Inventory Tracking", description: "Real-time dashboard access to your stock" },
    { icon: Zap, service: "Multi-Channel Support", description: "Shopify, Amazon, TikTok Shop integration" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load saved calculation from localStorage
    const saved = localStorage.getItem('roiCalculatorData');
    if (saved) {
      try {
        setSavedCalculation(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved calculation');
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>3PL Pricing Los Angeles | Custom Fulfillment Rates | Westfield Prep Center</title>
        <meta 
          name="description" 
          content="Los Angeles 3PL pricing for fulfillment, prep, and storage. Transparent rates, no hidden fees. Request your custom quote from our LA fulfillment center today." 
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/pricing" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />

      {/* Scroll-Persistent Sticky CTA (Desktop Only) */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0A66C2] shadow-lg py-3 hidden md:block"
          >
            <div className="container mx-auto px-4 flex items-center justify-between">
              <p className="text-white font-semibold">Ready to save on fulfillment?</p>
              <Button 
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold"
                asChild
              >
                <a href="https://calendly.com/westfieldprepcenter/30min" target="_blank" rel="noopener noreferrer">
                  Schedule a Call <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Breadcrumbs */}
          <section className="py-4 bg-muted/30">
            <div className="container mx-auto px-4">
              <Breadcrumbs
                items={[
                  { label: "Home", path: "/" },
                  { label: "Pricing", path: "/pricing" },
                ]}
              />
            </div>
          </section>

          {/* Enhanced ROI Calculator - UNTOUCHED */}
          <Suspense fallback={<div className="container py-16"><Skeleton className="h-[600px] w-full" /></div>}>
            <EnhancedROICalculator variant="pricing" />
          </Suspense>

          {/* Hero Confirmation Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="py-20 md:py-24 bg-gradient-to-br from-[#0A66C2]/5 via-background to-[#F97316]/5"
          >
            <div className="container mx-auto px-4 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Custom Pricing Built for Your Business
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
              >
                Every business is unique. Tell us your needs and we'll create a pricing model that scales with you. 
                No hidden fees, no surprises—just transparent pricing tailored to your volume.
              </motion.p>

              {/* Dynamic Stats Grid */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
              >
                <motion.div variants={itemVariants} className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F97316]">
                    {savedCalculation?.monthlyUnits?.toLocaleString() || "2M+"}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {savedCalculation?.monthlyUnits ? "Your Monthly Units" : "Units Processed"}
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">
                    ${savedCalculation?.estimatedSavings?.toLocaleString() || "50K+"}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {savedCalculation?.estimatedSavings ? "Your Est. Savings" : "Client Savings"}
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A66C2]">48hr</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Avg. Turnaround</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F97316]">99.8%</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Accuracy Rate</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* Highlights Section (Value Props Grid) */}
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto"
              >
                {highlights.map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-card rounded-2xl p-5 md:p-6 text-center shadow-lg border hover:shadow-xl transition-shadow"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 md:w-7 md:h-7 text-[#F97316]" />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-1">{item.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* How We Price Section */}
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 md:mb-16"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4">How We Determine Your Pricing</h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  We believe in transparent, fair pricing based on your actual needs
                </p>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12"
              >
                <motion.div variants={itemVariants} className="bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center mb-4">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">Volume-Based Pricing</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    The more you ship, the better your rates. Our pricing scales with your business, 
                    ensuring you always get competitive rates that improve as you grow.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center mb-4">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">No Hidden Fees</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    What we quote is what you pay. No surprise charges, no hidden costs. 
                    We provide detailed breakdowns so you know exactly where your money goes.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">Custom Quotes Within 24 Hours</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Fill out our form below and receive a detailed pricing breakdown within 24 hours. 
                    Fast, accurate, and tailored specifically to your business needs.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">Flexible & Scalable</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Our pricing adapts to your business. Whether you're shipping 100 units or 10,000, 
                    we have a solution that works for your current size and future growth.
                  </p>
                </motion.div>
              </motion.div>

              {/* What Affects Your Price */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card p-6 md:p-8 rounded-2xl border shadow-lg"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">What Affects Your Price</h3>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { title: "Monthly Unit Volume", desc: "Higher volumes unlock better per-unit rates and additional benefits" },
                    { title: "Service Complexity", desc: "Simple FBA prep costs less than custom kitting and branded packaging" },
                    { title: "Storage Requirements", desc: "Short-term vs. long-term storage, pallet count, and special handling needs" },
                    { title: "Special Handling", desc: "Custom branding, gift wrapping, expiration date tracking, and fragile items" },
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-sm md:text-base">{item.title}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* What We Offer Section - Card Grid */}
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 md:mb-12"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4">What We Offer</h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  Professional services included in your custom quote
                </p>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {serviceCards.map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="bg-card rounded-xl p-4 border shadow-md hover:shadow-lg transition-all text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{item.service}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              <p className="text-center text-xs md:text-sm text-muted-foreground mt-6">
                All services are customized based on your specific needs and volume. Contact us for detailed pricing.
              </p>
            </div>
          </section>

          {/* Trusted By Brands Section */}
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4 text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-base md:text-lg font-semibold text-muted-foreground mb-8"
              >
                Trusted by Growing Brands
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-6 md:gap-8"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className="w-20 md:w-24 h-10 md:h-12 bg-muted/60 rounded-lg opacity-50 hover:opacity-80 transition-opacity flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">Logo {i}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-4xl font-bold mb-10 md:mb-12 text-center"
              >
                Why Our Clients Choose Us
              </motion.h2>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-6 md:gap-8"
              >
                {[
                  { icon: Zap, title: "24-Hour Turnaround Guaranteed", desc: "Orders received before 2 PM PST ship the same day. Fast processing means happy customers and better reviews for your business." },
                  { icon: Shield, title: "Dedicated Account Management", desc: "Direct access to your account manager via phone and email. No ticket systems, no automated responses—just real support when you need it." },
                  { icon: DollarSign, title: "Los Angeles Port Proximity", desc: "Located minutes from LA/Long Beach ports. Faster inbound receiving, lower drayage costs, and quicker time to market for imported goods." },
                  { icon: Check, title: "Flexible & Scalable Solutions", desc: "We adapt to your business, not the other way around. Custom workflows, special handling, and solutions that grow with your success." },
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="flex gap-4 bg-card p-5 md:p-6 rounded-2xl border shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316]/20 to-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-[#F97316]" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 md:mb-12"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Pricing FAQs</h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  Common questions about our pricing structure
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {faqData.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="bg-card border rounded-2xl px-4 md:px-6 shadow-sm"
                    >
                      <AccordionTrigger className="text-left text-sm md:text-base hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm md:text-base text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </section>

          {/* Sticky CTA Panel */}
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/90 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl"
              >
                {/* Bold promotional line ABOVE the heading */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                >
                  <Sparkles className="w-5 h-5 text-[#F97316]" />
                  <span className="font-bold text-sm md:text-base">
                    You're Likely Eligible for Additional Per-Unit Discounts
                  </span>
                </motion.div>

                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Talk Numbers?</h2>
                <p className="text-white/80 mb-8 max-w-md mx-auto text-sm md:text-base">
                  Let's explore a custom quote tailored to your volume and needs.
                </p>
                <Button 
                  size="lg" 
                  className="w-full md:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 md:px-10 py-5 md:py-6 text-base md:text-lg rounded-xl shadow-lg min-h-[48px]"
                  asChild
                >
                  <a href="https://calendly.com/westfieldprepcenter/30min" target="_blank" rel="noopener noreferrer">
                    Schedule a Call <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16 md:py-20 bg-gradient-to-br from-[#F97316]/5 via-background to-[#0A66C2]/5">
            <div className="container mx-auto px-4 max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 md:mb-12"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Tell us about your business and receive a detailed pricing breakdown within 24 hours. 
                  No pressure, no commitment—just honest answers to help you make the right decision.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card p-6 md:p-8 rounded-3xl border shadow-xl"
              >
                <ContactForm />
              </motion.div>
            </div>
          </section>

          {/* Footer Navigation Links */}
          <section className="py-8 bg-muted/50 border-t">
            <div className="container mx-auto px-4">
              <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Pricing;
