import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Award, TrendingUp, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { ElegantShape } from "@/components/ui/shape-landing-hero";

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
    <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f8f8f9] to-[#f0f0f2]">
      {/* Soft gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03] blur-3xl" />

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-primary/[0.10]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-secondary/[0.10]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-primary/[0.12]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-secondary/[0.08]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-primary/[0.08]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Top Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 mb-8 md:mb-10"
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 md:mb-8 tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
                Los Angeles's Premier
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-secondary">
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
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 leading-relaxed font-light tracking-wide max-w-4xl mx-auto">
              Fast order processing, transparent pricing, and reliable logistics for growing online brands.
            </p>
          </motion.div>

          {/* Trust Badges - Horizontal Row */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-10"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-4 py-3 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg hover:border-primary/50 transition-colors shadow-sm"
              >
                <badge.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs - Side by Side */}
          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={goToContact}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-10 py-7 font-bold shadow-lg group"
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
                className="border-2 border-primary/30 hover:bg-primary/10 text-foreground text-lg px-10 py-7 font-semibold"
              >
                View Pricing
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            custom={5}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-center p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </section>
  );
};

export default PremiumHero;
