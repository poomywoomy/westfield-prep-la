import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, DollarSign, Package, Plug } from "lucide-react";
import { motion } from "framer-motion";

const PremiumHero = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  const trustBadges = [
    { icon: Clock, text: "Same-Day Receiving (Really)" },
    { icon: CheckCircle, text: "Same-Day Turnaround" },
    { icon: DollarSign, text: "No Minimums Ever" },
    { icon: Package, text: "Zero Hidden Fees" },
    { icon: Plug, text: "Plug & Play Integrations" },
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden">
      {/* Background Warehouse Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/warehouse-hero-bg.jpg"
          alt="Los Angeles 3PL warehouse exterior with trucks — Westfield Prep Center"
          width="1920"
          height="1080"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(10, 10, 35, 0.6), rgba(10, 10, 35, 0.9))'
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 py-16 lg:py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
              },
            },
          }}
          className="max-w-2xl space-y-8"
        >
          {/* Los Angeles 3PL Badge */}
          <motion.div variants={fadeUpVariants} className="inline-flex">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <div className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
              <span className="text-sm text-white font-medium">
                Los Angeles 3PL
              </span>
            </div>
          </motion.div>

          {/* H1 Headline */}
          <motion.h1
            variants={fadeUpVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
          >
            Stop Losing Orders to Slow Fulfillment. Start Scaling Faster.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUpVariants}
            className="text-lg md:text-xl text-white/90 leading-relaxed"
          >
            Join 100+ e-commerce brands who've shipped 2M+ orders through LA's most responsive fulfillment team. Same-day receiving, same-day turnaround, and a team that actually picks up the phone.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={goToContact}
              size="lg"
              className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold transition-all hover:scale-[1.02]"
            >
              Get Free Fulfillment Audit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate("/pricing")}
              size="lg"
              variant="outline"
              className="border-2 border-[#0A0A23] text-[#0A0A23] hover:bg-[#0A0A23]/10 font-semibold transition-all hover:scale-[1.02]"
            >
              View Pricing
            </Button>
          </motion.div>

          {/* Trust Badges Row */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap gap-3"
          >
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg"
                >
                  <Icon className="w-4 h-4 text-[#FF7A00]" />
                  <span className="text-xs md:text-sm font-medium text-white">
                    {badge.text}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumHero;
