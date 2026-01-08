import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Shield, Clock } from "lucide-react";

const TikTokChannelHero = () => {
  // Floating geometric shapes
  const floatingShapes = [
    { size: 16, left: "10%", top: "20%", color: "bg-pink-400/30", delay: 0 },
    { size: 12, left: "85%", top: "15%", color: "bg-purple-400/30", delay: 0.5 },
    { size: 20, left: "75%", top: "60%", color: "bg-fuchsia-400/25", delay: 1 },
    { size: 14, left: "5%", top: "70%", color: "bg-pink-500/20", delay: 1.5 },
    { size: 10, left: "90%", top: "80%", color: "bg-purple-500/25", delay: 2 },
    { size: 18, left: "20%", top: "85%", color: "bg-fuchsia-500/20", delay: 0.8 },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient Mesh Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(217, 70, 239, 0.12) 0%, transparent 50%),
            linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #fdf4ff 100%)
          `
        }}
      />

      {/* Floating Geometric Shapes */}
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.color} rounded-full blur-sm`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}

      {/* Decorative Rounded Squares */}
      <motion.div
        className="absolute w-8 h-8 bg-pink-300/20 rounded-lg rotate-12"
        style={{ left: "15%", top: "30%" }}
        animate={{ rotate: [12, -12, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-6 h-6 bg-purple-300/25 rounded-lg -rotate-12"
        style={{ right: "12%", top: "40%" }}
        animate={{ rotate: [-12, 12, -12] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 container mx-auto px-4 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge className="bg-pink-500 text-white border-pink-600 px-5 py-2 text-sm font-semibold shadow-lg shadow-pink-500/25">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Built for Viral Demand
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              TikTok Shop
            </span>
            <br />
            <span className="text-slate-900">Fulfillment That Scales</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            When your video goes viral, your fulfillment needs to keep up. We handle 
            surge demand, rapid turnaround, and{" "}
            <Link to="/kitting-bundling" className="text-pink-600 hover:text-pink-700 underline underline-offset-2 font-medium transition-colors">
              creator-friendly packaging
            </Link>{" "}
            so you never miss a sale.
          </motion.p>

          {/* Trust points */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[
              { icon: Clock, text: "6hr Processing" },
              { icon: Shield, text: "<1% Error Rate" },
              { icon: TrendingUp, text: "Surge-Ready" },
              { icon: Zap, text: "LA Fulfillment" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-pink-100/80 backdrop-blur-sm rounded-full border border-pink-200/50"
              >
                <item.icon className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-medium text-pink-800">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="px-8 py-6 text-base font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-xl shadow-pink-500/25 hover:scale-105 transition-all duration-300"
            >
              <Link to="/contact">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base font-bold border-2 border-pink-400 text-pink-700 hover:bg-pink-50"
            >
              <Link to="/pricing">See Pricing</Link>
            </Button>
          </motion.div>

          {/* Inline Stats */}
          <motion.div
            className="flex items-center justify-center gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {[
              { value: "100K+", label: "Viral Orders" },
              { value: "6hr", label: "Processing" },
              { value: "95%+", label: "Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default TikTokChannelHero;
