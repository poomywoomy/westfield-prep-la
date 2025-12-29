import { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import Lottie from "lottie-react";
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
  ArrowRight, Sparkles, Package, Truck,
  X, CheckCircle, Quote, Star, Mail
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const EnhancedROICalculator = lazy(() => import("@/components/EnhancedROICalculator"));

// Simple shipping box animation data (inline to avoid external file)
const shippingAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Box",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { 
          a: 1, 
          k: [
            { i: { x: 0.5, y: 1 }, o: { x: 0.5, y: 0 }, t: 0, s: [100, 110, 0] },
            { i: { x: 0.5, y: 1 }, o: { x: 0.5, y: 0 }, t: 30, s: [100, 90, 0] },
            { t: 60, s: [100, 110, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [80, 60] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 8 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.976, 0.451, 0.086, 1] },
          o: { a: 0, k: 100 }
        }
      ]
    }
  ]
};

const Pricing = () => {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [savedCalculation, setSavedCalculation] = useState<{
    monthlyUnits?: number;
    estimatedSavings?: number;
    roiPercent?: number;
  } | null>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const serviceData = {
    serviceType: "Service",
    name: "3PL Fulfillment & Prep Center Services",
    description: "Custom 3PL pricing for receiving, FBA prep, DTC fulfillment, storage, and multi-channel integration. Transparent, volume-based rates in Los Angeles.",
    features: ["Receiving & Inspection", "FBA Prep & Labeling", "DTC Fulfillment", "Storage Solutions", "Returns Processing", "Photo Documentation", "Inventory Tracking", "Multi-Channel Support"]
  };

  const faqData = [
    { 
      question: "What's included in Westfield 3PL pricing?", 
      answer: "All-in pricing includes receiving, storage, labeling, pick & pack, and compliance for Amazon FBA, WFS, and DTC. Our transparent pricing means no hidden fees—what we quote is what you pay." 
    },
    { 
      question: "Do you support Shopify integrations?", 
      answer: "Yes, we offer native Shopify integration for real-time inventory and order sync, with no additional charge. Orders sync automatically and ship same-day when received before 2 PM PST." 
    },
    { 
      question: "What are your Amazon FBA prep rates?", 
      answer: "Our Amazon FBA prep services range from $1.20–$1.70 per unit depending on volume and complexity. This includes FNSKU labeling, polybagging, bubble wrap, and compliance with all Amazon requirements." 
    },
    { 
      question: "How does your DTC fulfillment pricing compare to big-box 3PLs?", 
      answer: "Unlike big-box 3PLs with $3K+ minimums and tiered fees, we offer flexible pricing starting at $1.20/unit with no monthly minimums. You get dedicated support and 24-hour turnaround at a fraction of the cost." 
    },
    { 
      question: "Are there any setup fees or minimums?", 
      answer: "No setup fees or long-term contracts required. We work with businesses of all sizes. While we don't have strict minimums, pricing is optimized for businesses shipping at least 100 units per month." 
    },
    { 
      question: "How does storage pricing work?", 
      answer: "Storage is billed monthly based on space used (pallet or cubic feet). Rates vary by volume—higher volume clients receive preferred pricing. We also offer overflow and seasonal storage options." 
    },
    { 
      question: "Do you charge for receiving inventory?", 
      answer: "Yes, we charge a per-carton or per-pallet fee for receiving and inspection. This includes check-in, inventory counting, photo documentation, and system updates. Exact rates depend on shipment size and frequency." 
    },
    { 
      question: "Can I get a custom quote for my business?", 
      answer: "Absolutely! Every business is unique. Contact us with your monthly volume, services needed, and product details. We'll provide a detailed pricing breakdown within 24 hours with no commitment required." 
    }
  ];

  const highlights = [
    { icon: Zap, title: "24-Hour Turnaround", description: "Lightning-fast prep and fulfillment" },
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

  const testimonials = [
    {
      quote: "Switching to Westfield cut our fulfillment costs in half and improved turnaround overnight.",
      company: "DTC Beauty Brand",
      role: "Founder, Beauty Sector"
    },
    {
      quote: "Their 24-hour turnaround has been a game-changer for our Amazon business. Inventory is received and prepped quickly, communication is clear, and everything is handled to Amazon standards. We've stayed in stock more consistently since working with them.",
      company: "Product's for you",
      role: "Operations Manager"
    },
    {
      quote: "Real-time inventory tracking finally gave us the visibility we needed to scale.",
      company: "Multi-Channel Brand",
      role: "E-commerce Director"
    }
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

  // Refined animation variants with accessibility support
  const easeOut: Easing = [0.0, 0.0, 0.2, 1];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: easeOut
      } 
    }
  };

  // Section divider component
  const SectionDivider = ({ icon: Icon }: { icon?: React.ComponentType<{ className?: string }> }) => (
    <div className="flex items-center justify-center py-6">
      {Icon ? (
        <div className="flex items-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-muted-foreground/20" />
          <Icon className="w-5 h-5 text-muted-foreground/30" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-muted-foreground/20" />
        </div>
      ) : (
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent" />
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>3PL Fulfillment Pricing | Shopify & Amazon Sellers | Westfield</title>
        <meta 
          name="description" 
          content="Transparent 3PL pricing for Shopify fulfillment & Amazon FBA prep. $1.20–$1.70/unit. 24-hour turnaround. Calculate your ROI savings instantly." 
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/pricing" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Westfield Prep Center" />
        <meta name="keywords" content="3PL pricing, Shopify fulfillment, Amazon FBA prep, DTC fulfillment, Los Angeles 3PL, fulfillment center pricing, pick and pack rates" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://westfieldprepcenter.com/pricing" />
        <meta property="og:title" content="3PL Fulfillment Pricing | Shopify & Amazon Sellers" />
        <meta property="og:description" content="Transparent 3PL pricing for Shopify fulfillment & Amazon FBA prep. $1.20–$1.70/unit. 24-hour turnaround." />
        <meta property="og:image" content="https://westfieldprepcenter.com/hero-warehouse-optimized.webp" />
        <meta property="og:site_name" content="Westfield Prep Center" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Westfield3PL" />
        <meta name="twitter:title" content="3PL Fulfillment Pricing | Shopify & Amazon Sellers" />
        <meta name="twitter:description" content="Transparent 3PL pricing for Shopify fulfillment & Amazon FBA prep. $1.20–$1.70/unit. 24-hour turnaround." />
        <meta name="twitter:image" content="https://westfieldprepcenter.com/hero-warehouse-optimized.webp" />
      </Helmet>
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      <StructuredData type="product" />
      <StructuredData type="breadcrumb" data={{ items: [{ label: "Home", path: "/" }, { label: "3PL Pricing", path: "/pricing" }] }} />

      {/* Scroll-Persistent Sticky CTA (Desktop Only) */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0A66C2] shadow-lg py-3 hidden md:block"
          >
            <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-white font-semibold">Ready to save on fulfillment?</p>
                {savedCalculation?.estimatedSavings && (
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[#F97316] font-bold"
                  >
                    Save ${savedCalculation.estimatedSavings.toLocaleString()}/mo
                  </motion.span>
                )}
              </div>
              <Button 
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold transition-transform hover:scale-105"
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

          {/* Hero Confirmation Section with Mesh Gradient & Lottie */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.6 }}
            className="py-20 md:py-24 relative overflow-hidden"
          >
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0A66C2]/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
            </div>

            {/* Lottie Animation Behind Stats */}
            <div 
              className="absolute inset-0 flex items-center justify-center opacity-20 blur-sm pointer-events-none overflow-hidden"
              role="img"
              aria-label="3PL shipping and fulfillment animation for Shopify and Amazon sellers"
            >
              <Lottie 
                animationData={shippingAnimationData} 
                loop={true}
                className="w-[400px] h-[400px]"
              />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
              <motion.h1 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0.1 : 0.5 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                3PL Fulfillment Pricing for Shopify, Amazon & DTC Brands
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0.1 : 0.5 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4"
              >
                Real ROI, Real Savings
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: prefersReducedMotion ? 0.1 : 0.5 }}
                className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-12"
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
                <motion.div 
                  variants={itemVariants} 
                  whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -4 }}
                  className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-all"
                >
                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F97316]">
                    {savedCalculation?.monthlyUnits?.toLocaleString() || "2M+"}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {savedCalculation?.monthlyUnits ? "Your Monthly Units" : "Units Processed"}
                  </p>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -4 }}
                  className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-all"
                >
                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">
                    ${savedCalculation?.estimatedSavings?.toLocaleString() || "50K+"}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {savedCalculation?.estimatedSavings ? "Your Est. Savings" : "Client Savings"}
                  </p>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -4 }}
                  className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-all"
                >
                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A66C2]">24hr</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Avg. Turnaround</p>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -4 }}
                  className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-all"
                >
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
                    whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -6 }}
                    className="bg-card rounded-2xl p-5 md:p-6 text-center shadow-lg border hover:shadow-xl hover:border-[#F97316]/30 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-xl bg-[#F97316]/10 flex items-center justify-center group-hover:bg-[#F97316]/20 transition-colors">
                      <item.icon className="w-6 h-6 md:w-7 md:h-7 text-[#F97316] group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-1">{item.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Section Divider */}
          <SectionDivider icon={Package} />

          {/* 3-Way Comparison Grid */}
          <section className="py-16 md:py-20 relative overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-background to-green-500/5 pointer-events-none" />
            
            <div className="container mx-auto px-4 max-w-6xl relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-4xl font-bold text-center mb-10 md:mb-14"
              >
                Why Westfield Beats In-House and Big-Box 3PLs
              </motion.h2>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-6 md:gap-8"
              >
                {/* Card 1 – In-House Fulfillment (Red) */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                  className="bg-card border-2 border-red-200 dark:border-red-900/50 rounded-3xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Package className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400">In-House Fulfillment</h3>
                  </div>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-2">
                      <span>❌</span>
                      <span className="text-muted-foreground">$3.10+/unit (labor + materials)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>❌</span>
                      <span className="text-muted-foreground">Slow 2–5 day turnaround</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>❌</span>
                      <span className="text-muted-foreground">No live inventory visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>❌</span>
                      <span className="text-muted-foreground">Risk of non-compliance (FBA/WFS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>❌</span>
                      <span className="text-muted-foreground">No shipping integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>❌</span>
                      <span className="text-muted-foreground">Manual spreadsheets & tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>⚠️</span>
                      <span className="text-muted-foreground">Full-time labor cost & liability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>⚠️</span>
                      <span className="text-muted-foreground">Limited DTC flexibility</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Card 2 – Big-Box 3PLs (Gray) */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                  className="bg-card border-2 border-gray-300 dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Big-Box 3PLs</h3>
                  </div>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-2">
                      <span>💸</span>
                      <span className="text-muted-foreground">$2.50–$3.50/unit (tiered fees)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>⚠️</span>
                      <span className="text-muted-foreground">48–72 hour turnaround</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>⚠️</span>
                      <span className="text-muted-foreground">Delayed inventory syncs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✅</span>
                      <span className="text-muted-foreground">FBA-compliant (not always WFS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✅</span>
                      <span className="text-muted-foreground">Shopify & Amazon integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>⚠️</span>
                      <span className="text-muted-foreground">Tiered support response</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>❌</span>
                      <span className="text-muted-foreground">High monthly minimums ($3K+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>⚠️</span>
                      <span className="text-muted-foreground">Less flexibility for hybrid sellers</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Card 3 – Westfield Prep Center (Green) */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  className="bg-card border-2 border-green-300 dark:border-green-700 rounded-3xl p-6 md:p-8 shadow-xl ring-2 ring-green-200/50 dark:ring-green-800/50 hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Westfield Prep Center</h3>
                  </div>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-2">
                      <span>✅</span>
                      <span className="text-foreground font-medium">$1.20–$1.70/unit (FBA & DTC)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>⚡</span>
                      <span className="text-foreground font-medium">Avg. 24-hour turnaround</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>📊</span>
                      <span className="text-foreground font-medium">Real-time inventory visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✅</span>
                      <span className="text-foreground font-medium">FBA & WFS compliance included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>🔗</span>
                      <span className="text-foreground font-medium">Shopify, Amazon, Walmart + more</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>💬</span>
                      <span className="text-foreground font-medium">Dedicated human support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>🙌</span>
                      <span className="text-foreground font-medium">Low minimums & volume discounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>🧠</span>
                      <span className="text-foreground font-medium">Built for hybrid DTC + marketplace</span>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Section Divider */}
          <SectionDivider icon={Sparkles} />

          {/* Testimonials Section */}
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-5xl">
              <motion.h2 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-4xl font-bold text-center mb-10 md:mb-12"
              >
                What Our Clients Are Saying
              </motion.h2>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-6"
              >
                {testimonials.map((testimonial, i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -6 }}
                    className="bg-card rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all group"
                  >
                    <Quote className="w-8 h-8 text-[#F97316]/30 mb-4 group-hover:text-[#F97316]/50 transition-colors" />
                    <p className="text-muted-foreground italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{testimonial.company[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.company}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Section Divider */}
          <SectionDivider />

          {/* How We Price Section */}
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.5 }}
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
                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -4 }}
                  className="bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">Volume-Based Pricing</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    The more you ship, the better your rates. Our pricing scales with your business, 
                    ensuring you always get competitive rates that improve as you grow.
                  </p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -4 }}
                  className="bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">No Hidden Fees</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    What we quote is what you pay. No surprise charges, no hidden costs. 
                    We provide detailed breakdowns so you know exactly where your money goes.
                  </p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -4 }}
                  className="bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">Custom Quotes Within 24 Hours</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Fill out our form below and receive a detailed pricing breakdown within 24 hours. 
                    Fast, accurate, and tailored specifically to your business needs.
                  </p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -4 }}
                  className="bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
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
                      initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
                      whileHover={prefersReducedMotion ? {} : { x: 4 }}
                      className="flex gap-3 group cursor-default"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-500/30 transition-colors">
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
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 md:mb-12"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Pricing Built Around Your Shopify Volume</h2>
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
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -4 }}
                    className="bg-card rounded-xl p-4 border shadow-md hover:shadow-lg hover:border-[#F97316]/30 transition-all text-center group cursor-pointer"
                  >
                    <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center group-hover:bg-[#F97316]/10 transition-colors">
                      <item.icon className="w-5 h-5 text-[#F97316] group-hover:scale-110 transition-transform" />
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
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4 text-center">
              <motion.h2 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
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
                transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
                className="flex flex-wrap justify-center gap-6 md:gap-8"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div 
                    key={i}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.1, opacity: 1 }}
                    className="w-20 md:w-24 h-10 md:h-12 bg-muted/60 rounded-lg opacity-50 hover:opacity-80 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-xs text-muted-foreground">Logo {i}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Section Divider */}
          <SectionDivider icon={Star} />

          {/* Why Choose Us Section */}
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-5xl">
              <motion.h2 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
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
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -4 }}
                    className="flex gap-4 bg-card p-5 md:p-6 rounded-2xl border shadow-md hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316]/20 to-[#F97316]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#F97316]/30 group-hover:to-[#F97316]/20 transition-colors">
                      <item.icon className="w-6 h-6 text-[#F97316] group-hover:scale-110 transition-transform" />
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
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 md:mb-12"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Frequently Asked Questions About Our 3PL Pricing</h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  Common questions about our pricing structure
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
              >
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {faqData.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="bg-card border rounded-2xl px-4 md:px-6 shadow-sm hover:shadow-md transition-shadow"
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

          {/* Sticky CTA Panel with Animated Savings */}
          <section className="py-16 md:py-20 bg-muted/30 relative overflow-hidden">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#0A66C2]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl" />
            </div>
            
            <div className="container mx-auto px-4 max-w-3xl relative z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/90 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl"
              >
                {/* Animated Savings Counter */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.1, type: "spring", stiffness: 200 }}
                  className="text-3xl md:text-5xl font-extrabold mb-4"
                >
                  Save up to <span className="text-[#F97316]">
                    ${savedCalculation?.estimatedSavings?.toLocaleString() || "2,500+"}
                  </span>/month
                </motion.div>

                {/* Bold promotional line */}
                <motion.div 
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
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
                  className="w-full md:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 md:px-10 py-5 md:py-6 text-base md:text-lg rounded-xl shadow-lg min-h-[48px] transition-transform hover:scale-105"
                  asChild
                >
                  <a href="https://calendly.com/westfieldprepcenter/30min" target="_blank" rel="noopener noreferrer">
                    Schedule a Call <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Contact Form Section with Mesh Gradient */}
          <section className="py-16 md:py-20 relative overflow-hidden">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#0A66C2]/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl" />
            </div>
            
            <div className="container mx-auto px-4 max-w-4xl relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 md:mb-12"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Get Your Custom 3PL Quote Today</h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Tell us about your business and receive a detailed pricing breakdown within 24 hours. 
                  No pressure, no commitment—just honest answers to help you make the right decision.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
                className="bg-card p-6 md:p-8 rounded-3xl border shadow-xl"
              >
                <ContactForm />
              </motion.div>
            </div>
          </section>

          {/* Icon-Based Footer Navigation */}
          <section className="py-8 bg-muted/50 border-t">
            <div className="container mx-auto px-4">
              <nav className="flex flex-wrap justify-center gap-6 md:gap-10">
                <Link 
                  to="/pricing" 
                  className="flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <DollarSign className="w-4 h-4" /> Pricing
                </Link>
                <Link 
                  to="/why-choose-us" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Star className="w-4 h-4 group-hover:scale-110 transition-transform" /> Features
                </Link>
                <Link 
                  to="/contact" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" /> Contact
                </Link>
                <Link 
                  to="/faq" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Users className="w-4 h-4 group-hover:scale-110 transition-transform" /> FAQ
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
