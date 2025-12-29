import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, CheckCircle, Clock, Package, Plug, Shield, Star, Truck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import CalendlyModal from "./CalendlyModal";

const PremiumHero = () => {
  const navigate = useNavigate();
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const goToContact = () => {
    navigate("/contact");
  };

  const handleScheduleCall = () => {
    trackEvent('schedule_call_clicked', { location: 'hero' });
    setCalendlyOpen(true);
  };

  const featureTags = [
    { icon: Clock, text: "24hr Turnaround", emoji: "⚡", tooltip: "Orders ship same day" },
    { icon: Truck, text: "No Minimums", emoji: "📦", tooltip: "Start with any volume" },
    { icon: Plug, text: "Plug & Play", emoji: "🔌", tooltip: "Connect in minutes" },
    { icon: Shield, text: "99.8% Accuracy", emoji: "✅", tooltip: "Industry-leading quality" },
  ];

  // Trust badges with icons
  const trustBadges = [
    { icon: Shield, text: "SOC2 Ready" },
    { icon: Zap, text: "WMS-Integrated" },
    { icon: Star, text: "4.9★ Rating" },
    { icon: CheckCircle, text: "99.99% Uptime" },
  ];

  const platformLogos = [
    { name: "Shopify", color: "bg-[#96BF48]" },
    { name: "Amazon", color: "bg-[#FF9900]" },
    { name: "Walmart", color: "bg-[#0071DC]" },
    { name: "WooCommerce", color: "bg-[#7F54B3]" },
    { name: "NetSuite", color: "bg-[#125580]" },
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <section className="relative min-h-[90vh] w-full overflow-hidden">
        {/* Background Warehouse Image */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source srcSet="/hero-warehouse-optimized.webp" type="image/webp" />
            <img
              src="/warehouse-hero-bg.jpg"
              alt="Modern Los Angeles 3PL warehouse facility with loading docks, semi-trucks, palm trees, and mountain views - Westfield Prep Center"
              width="1920"
              height="1080"
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>

        {/* Multi-layer Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: `
              linear-gradient(to bottom, rgba(10, 10, 35, 0.85) 0%, rgba(10, 10, 35, 0.6) 40%, rgba(10, 10, 35, 0.75) 100%),
              radial-gradient(ellipse at 30% 50%, rgba(255, 122, 0, 0.08) 0%, transparent 60%)
            `
          }}
        />

        {/* Content Container */}
        <div className="relative z-20 container mx-auto px-4 py-20 lg:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.2,
                },
              },
            }}
            className="max-w-3xl"
          >
            {/* Frosted Glass Content Panel */}
            <div className="relative">
              {/* Subtle glow behind content */}
              <div className="absolute -inset-8 bg-gradient-to-r from-[#FF7A00]/10 via-transparent to-transparent rounded-3xl blur-3xl" />
              
              <div className="relative space-y-6">
                {/* Los Angeles 3PL Badge */}
                <motion.div variants={fadeUpVariants}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                    <div className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                    <span className="text-sm text-white/90 font-medium tracking-wide">
                      Los Angeles 3PL
                    </span>
                  </div>
                </motion.div>

                {/* H1 Headline - Updated CRO Copy */}
                <motion.h1
                  variants={fadeUpVariants}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white tracking-tight"
                >
                  Ship 3x Faster with a{" "}
                  <span className="text-[#FF7A00]">Shopify + Amazon-Ready 3PL</span>
                </motion.h1>

                {/* Subheadline - Updated CRO Copy */}
                <motion.p
                  variants={fadeUpVariants}
                  className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl"
                >
                  Full-service fulfillment & FBA prep in 24 hours. Transparent pricing. No monthly minimums.
                </motion.p>

                {/* Trust Badges Row */}
                <motion.div 
                  variants={fadeUpVariants}
                  className="flex flex-wrap items-center gap-3"
                >
                  {trustBadges.map((badge, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
                    >
                      <badge.icon className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span className="text-xs font-medium text-white/80">{badge.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons - Updated Layout */}
                <motion.div
                  variants={fadeUpVariants}
                  className="flex flex-col sm:flex-row gap-4 pt-2"
                >
                  <Button
                    onClick={goToContact}
                    size="lg"
                    className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold shadow-lg shadow-[#FF7A00]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF7A00]/30 hover:-translate-y-0.5 group"
                  >
                    Get a Quote
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    onClick={() => navigate("/pricing")}
                    size="lg"
                    className="border-2 border-white bg-white text-[#0A0A23] hover:bg-white/90 font-semibold transition-all duration-300 shadow-lg"
                  >
                    See Pricing
                  </Button>
                </motion.div>

                {/* Schedule a Call Link */}
                <motion.div variants={fadeUpVariants}>
                  <button
                    onClick={handleScheduleCall}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium underline-offset-4 group-hover:underline">
                      Or schedule a call with our team
                    </span>
                  </button>
                </motion.div>

                {/* Feature Tags - 2x2 Frosted Glass Grid */}
                <motion.div
                  variants={fadeUpVariants}
                  className="grid grid-cols-2 gap-3 pt-4 max-w-lg"
                >
                  {featureTags.map((tag, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group relative flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-xl cursor-default"
                    >
                      <span className="text-lg">{tag.emoji}</span>
                      <span className="text-sm font-medium text-white/90">
                        {tag.text}
                      </span>
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#0A0A23] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
                        {tag.tooltip}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Platform Integration Logos */}
                <motion.div
                  variants={fadeUpVariants}
                  className="pt-8 border-t border-white/10 mt-8"
                >
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-4 font-medium">
                    Integrated with
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {platformLogos.map((platform, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/8 backdrop-blur-md border border-white/15 rounded-xl hover:bg-white/12 hover:border-white/25 transition-all duration-300 cursor-default shadow-lg"
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${platform.color}`} />
                        <span className="text-sm text-white/80 font-medium tracking-wide">{platform.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <CalendlyModal open={calendlyOpen} onOpenChange={setCalendlyOpen} />
    </>
  );
};

export default PremiumHero;
