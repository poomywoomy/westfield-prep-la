import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Clock, Camera } from "lucide-react";

const ReceivingHero = () => {
  const navigate = useNavigate();

  const trustBadges = [
    { icon: Camera, text: "100% Photo Documentation" },
    { icon: CheckCircle, text: "99.8% Accuracy Rate" },
    { icon: Clock, text: "Same-Day Updates" },
  ];

  return (
    <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
      {/* Deep Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-violet-900 to-slate-900" />
      
      {/* Inspection Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(265, 51%, 51%) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(265, 51%, 51%) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Barcode Elements */}
      <div className="absolute top-20 right-10 opacity-20 font-mono text-purple-300 text-xs hidden lg:block">
        |||| |||| |||| |||| |||| ||||
      </div>
      <div className="absolute bottom-32 left-10 opacity-20 font-mono text-purple-300 text-xs hidden lg:block rotate-90">
        |||| |||| |||| ||||
      </div>

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
              <badge.icon className="w-4 h-4 text-purple-300" />
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
              Professional Receiving &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">
                QC Inspection
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-purple-100/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Every shipment is meticulously verified, photographed, and inspected before entering your inventory. 
              Our 5-step quality control process catches discrepancies, documents condition, and protects your investment 
              from receiving errors that cost e-commerce sellers thousands annually.
            </p>
          </motion.div>

          {/* Visual Inspection Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-10"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-purple-400/50 bg-purple-500/10 flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-purple-300" />
            </div>
            <div className="font-mono text-purple-400 text-sm md:text-base tracking-wider">
              |||| |||| |||| |||| |||| ||||
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-purple-400/50 bg-purple-500/10 flex items-center justify-center backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-purple-300" />
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
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 text-lg"
            >
              Get Started
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

export default ReceivingHero;
