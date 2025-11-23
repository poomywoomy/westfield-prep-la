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
    <section className="relative min-h-[85vh] w-full bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE - Content (White Background with Navy Text) */}
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F5F7] border border-[#0A0A23]/20">
                <div className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                <span className="text-sm text-[#0A0A23] font-medium">
                  Los Angeles 3PL
                </span>
              </div>
            </motion.div>

            {/* H1 Headline */}
            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#0A0A23]"
            >
              LA's Premier E-Commerce Fulfillment & 3PL Partner
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUpVariants}
              className="text-lg md:text-xl text-[#4D4D4D] leading-relaxed"
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
                    className="flex items-center gap-2 px-3 py-2 bg-[#F5F5F7] border border-[#0A0A23]/20 rounded-lg"
                  >
                    <Icon className="w-4 h-4 text-[#FF7A00]" />
                    <span className="text-xs md:text-sm font-medium text-[#0A0A23]">
                      {badge.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Warehouse Image (No Text Overlay) */}
          <div className="relative h-[400px] lg:h-[600px] w-full">
            <picture>
              <source srcSet="/hero-warehouse-optimized.webp" type="image/webp" />
              <img
                src="/warehouse-exterior-la.jpg"
                alt="Los Angeles 3PL warehouse exterior with trucks and loading docks — Westfield Prep Center"
                className="w-full h-full object-cover object-center rounded-lg shadow-2xl"
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
