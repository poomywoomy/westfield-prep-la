import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Package, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const ShopifyChannelHero = () => {
  const navigate = useNavigate();

  const trustPoints = [
    { icon: Zap, text: "Same-Day Shipping" },
    { icon: Package, text: "Branded Packaging" },
    { icon: BarChart3, text: "Real-Time Sync" },
    { icon: CheckCircle, text: "99.6% Accuracy" },
  ];

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-gradient-to-br from-[hsl(var(--shopify-page-primary))] via-[hsl(var(--shopify-page-primary))]/95 to-[hsl(var(--shopify-page-accent))]/80">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[hsl(var(--shopify-page-accent))]/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(var(--shopify-page-accent))]/10 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-6 py-2 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--shopify-page-accent))] mr-2 animate-pulse" />
              Shopify-Certified 3PL Partner
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Shopify Fulfillment That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--shopify-page-accent))] to-white">
              Grows With You
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/85 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Real-time inventory sync, branded unboxing experiences, and same-day shipping from Los Angeles. Scale your DTC brand without the operational headaches. Learn more about our{" "}
            <a href="/why-choose-us" className="underline hover:text-white transition-colors">dedicated approach</a> and{" "}
            <a href="/pricing" className="underline hover:text-white transition-colors">transparent pricing</a>.
          </motion.p>

          {/* Trust Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {trustPoints.map((point, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              >
                <point.icon className="w-4 h-4 text-[hsl(var(--shopify-page-accent))]" />
                <span className="text-sm text-white/90 font-medium">{point.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-white text-[hsl(var(--shopify-page-primary))] hover:bg-white/90 px-10 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              Get Your Custom Quote
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-lg font-bold"
            >
              View Pricing
            </Button>
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 pt-8 border-t border-white/20"
          >
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">500K+</div>
                <div className="text-sm text-white/70">Orders Shipped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">12hr</div>
                <div className="text-sm text-white/70">Avg Lead Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">150+</div>
                <div className="text-sm text-white/70">Shopify Brands</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ShopifyChannelHero;
