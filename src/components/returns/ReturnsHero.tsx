import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Clock, TrendingUp, Camera } from "lucide-react";
import { MetricCounter } from "@/components/ui/metric-counter";

const ReturnsHero = () => {
  const navigate = useNavigate();

  const trustBadges = [
    { icon: Clock, text: "5hr Avg Processing" },
    { icon: TrendingUp, text: "85% Recovery Rate" },
    { icon: Camera, text: "Full QC Photos" },
  ];

  return (
    <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
      {/* Ruby Red Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-red-900 to-slate-900" />
      
      {/* Circular Flow Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="20" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-rose-300" />
          <circle cx="80" cy="70" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-rose-300" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-rose-300" />
        </svg>
      </div>

      {/* Red Accent Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-rose-500 to-transparent opacity-30" />

      <div className="container relative z-10">
        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {trustBadges.map((badge, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <badge.icon className="w-4 h-4 text-rose-300" />
              <span className="text-sm text-white/90">{badge.text}</span>
            </div>
          ))}
        </motion.div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Efficient{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-300">
                Returns Processing
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-rose-100/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform returns from a cost center into recovered revenue. Our streamlined reverse logistics 
              workflow processes returns in under 5 hours, with photo documentation, quality inspection, 
              and smart sorting that maximizes your resellable inventory.
            </p>
          </motion.div>

          {/* Circular KPI Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-10"
          >
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="35%" fill="none" 
                      stroke="rgba(244, 63, 94, 0.2)" strokeWidth="8" />
              <circle cx="50%" cy="50%" r="35%" fill="none" 
                      stroke="rgb(244, 63, 94)" strokeWidth="8"
                      strokeDasharray="553" strokeDashoffset="138"
                      className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl md:text-5xl font-bold text-rose-400">
                <MetricCounter value={5} suffix="hr" />
              </p>
              <p className="text-xs md:text-sm text-rose-200 mt-1">Avg Processing</p>
            </div>
          </motion.div>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 text-lg"
            >
              Get Returns Quote
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg"
            >
              View Pricing
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReturnsHero;
