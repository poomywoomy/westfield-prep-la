import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, DollarSign, Package } from "lucide-react";
import { motion } from "framer-motion";

const PremiumHero = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  const trustBadges = [
    { icon: Clock, text: "Same-Day Receiving" },
    { icon: CheckCircle, text: "24-48hr Turnaround" },
    { icon: DollarSign, text: "No Minimums" },
    { icon: Package, text: "100% Transparent Pricing" },
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-[85vh] w-full flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
      {/* Warehouse Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/landing/warehouse-exterior.jpg"
          alt="Los Angeles 3PL warehouse exterior with trucks and loading docks — Westfield Prep Center"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,35,0.3)] to-[rgba(10,10,35,0.6)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE - Content */}
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
            className="space-y-8"
          >
            {/* Los Angeles 3PL Badge */}
            <motion.div variants={fadeUpVariants} className="inline-flex">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
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
              LA's Premier E-Commerce Fulfillment & 3PL Partner
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUpVariants}
              className="text-lg md:text-xl text-white/90 leading-relaxed"
            >
              2M+ orders fulfilled for fast-growing eCommerce brands.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={goToContact}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold transition-all hover:scale-[1.02]"
              >
                Get Free Fulfillment Audit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate("/pricing")}
                size="lg"
                variant="outline"
                className="border-white/80 text-white hover:bg-white/10 hover:text-white font-semibold transition-all hover:scale-[1.02]"
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
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg"
                  >
                    <Icon className="w-4 h-4 text-secondary" />
                    <span className="text-xs md:text-sm font-medium text-white">
                      {badge.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Image (visible on desktop only, image is background) */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
