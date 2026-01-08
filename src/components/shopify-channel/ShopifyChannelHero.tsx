import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Package, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const ShopifyChannelHero = () => {
  const trustPoints = [
    { icon: Zap, text: "Same-Day Shipping" },
    { icon: Package, text: "Branded Packaging" },
    { icon: BarChart3, text: "Real-Time Sync" },
    { icon: CheckCircle, text: "99.6% Accuracy" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-white via-lime-50/50 to-emerald-50">
      {/* Dot Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #059669 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Animated Organic Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-lime-300/30 to-emerald-300/30 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-2xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -left-32 w-64 h-64 bg-gradient-to-br from-emerald-200/40 to-lime-200/40 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-2xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-1/4 w-48 h-48 bg-gradient-to-br from-lime-200/30 to-green-200/30 rounded-full blur-2xl"
        />
      </div>

      {/* Glowing Orb Behind Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-emerald-200/20 via-lime-100/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-4xl lg:max-w-5xl mx-auto lg:mx-0 lg:text-left text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 lg:mb-8"
          >
            <Badge className="bg-emerald-500 text-white border-emerald-600 px-5 py-2 text-sm font-semibold shadow-lg shadow-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
              Shopify-Certified 3PL Partner
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight"
          >
            Shopify Fulfillment That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-500">
              Grows With You
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-600 mb-6 max-w-3xl lg:max-w-2xl leading-relaxed"
          >
            Real-time inventory sync, branded unboxing experiences, and same-day shipping from Los Angeles. Scale your DTC brand without the operational headaches. Learn more about our{" "}
            <Link to="/why-choose-us" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2 font-medium transition-colors">dedicated approach</Link> and{" "}
            <Link to="/pricing" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2 font-medium transition-colors">transparent pricing</Link>.
          </motion.p>

          {/* Trust Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
          >
            {trustPoints.map((point, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-lime-100/80 backdrop-blur-sm rounded-full border border-lime-200/50"
              >
                <point.icon className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-800 font-medium">{point.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons + Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10"
          >
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white px-8 py-6 text-base font-bold shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all duration-300 group"
              >
                <Link to="/contact">
                  Get Your Custom Quote
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-base font-bold"
              >
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>

            {/* Inline Stats */}
            <div className="flex items-center gap-6 lg:gap-8 justify-center lg:justify-start lg:border-l lg:border-slate-200 lg:pl-10">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600">500K+</div>
                <div className="text-xs text-slate-500">Orders Shipped</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600">12hr</div>
                <div className="text-xs text-slate-500">Avg Lead Time</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600">150+</div>
                <div className="text-xs text-slate-500">Shopify Brands</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ShopifyChannelHero;
