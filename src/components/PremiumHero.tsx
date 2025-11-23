import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Award, TrendingUp, Circle } from "lucide-react";
import { motion } from "framer-motion";

const PremiumHero = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  const stats = [
    { value: "2M+", label: "Orders Fulfilled" },
    { value: "100+", label: "Active Clients" },
    { value: "99.8%", label: "Accuracy Rate" },
    { value: "15+", label: "Years in Business" },
  ];

  const trustBadges = [
    { icon: Shield, text: "Same-Day Receiving" },
    { icon: Clock, text: "24-48hr Turnaround" },
    { icon: Award, text: "No Minimums" },
    { icon: TrendingUp, text: "100% Transparent Pricing" },
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section className="relative min-h-[85vh] w-full flex items-center overflow-hidden bg-white">
      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* LEFT SIDE - Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Top Badge */}
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20"
            >
              <Circle className="h-2 w-2 fill-primary" />
              <span className="text-sm text-muted-foreground tracking-wide font-medium">
                Los Angeles 3PL
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Los Angeles's Premier</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  E-Commerce Fulfillment & 3PL Partner
                </span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Fast order processing, transparent pricing, and reliable logistics for growing online brands.
              </p>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <badge.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              custom={4}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={goToContact}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-10 py-7 font-bold shadow-lg group w-full sm:w-auto"
                >
                  Get Free Fulfillment Audit
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate("/pricing")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary/30 hover:bg-primary/10 text-foreground text-lg px-10 py-7 font-semibold w-full sm:w-auto"
                >
                  View Pricing
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Grid - Desktop shows on mobile too */}
            <motion.div
              custom={5}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 pt-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-center p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT SIDE - Warehouse Image */}
          <motion.div
            custom={6}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
              <img
                src="/warehouse-exterior-la.jpg"
                alt="Los Angeles 3PL warehouse exterior with trucks — Westfield Prep Center"
                className="w-full h-auto object-cover"
                loading="eager"
                fetchPriority="high"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
