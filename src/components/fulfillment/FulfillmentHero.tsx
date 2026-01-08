import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, Zap, Shield, Clock } from "lucide-react";

const FulfillmentHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Dark Command Center Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Blueprint Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #3B82F6 1px, transparent 1px),
              linear-gradient(to bottom, #3B82F6 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Animated Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative z-10">
        <div className="max-w-4xl">
          {/* Trust Badges Inline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            {[
              { icon: Shield, text: "99.8% Accuracy" },
              { icon: Clock, text: "2PM Same-Day Cutoff" },
              { icon: Zap, text: "4.5hr Avg Processing" }
            ].map((badge, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium"
              >
                <badge.icon className="w-4 h-4" />
                {badge.text}
              </div>
            ))}
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Your E-Commerce{" "}
            <span className="relative">
              Command Center
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400" />
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed"
          >
            From order received to doorstep delivered, we handle your entire fulfillment operation. 
            Real-time tracking, multi-channel integration, and obsessive attention to accuracy—all from our Los Angeles facility.
          </motion.p>

          {/* Dual CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button 
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            >
              Get Your Quote
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="border-slate-600 text-slate-200 hover:bg-slate-800 px-8 py-6 text-lg"
            >
              See Pricing
            </Button>
          </motion.div>
        </div>

        {/* Live Order Ticker */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80"
        >
          <div className="bg-slate-800/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-[0_0_60px_rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-400 font-medium">Live Order Feed</span>
            </div>
            
            <div className="space-y-3">
              {[
                { id: "#WF-7842", status: "Shipped", time: "2m ago", color: "text-green-400" },
                { id: "#WF-7841", status: "Packing", time: "5m ago", color: "text-blue-400" },
                { id: "#WF-7840", status: "Picking", time: "8m ago", color: "text-yellow-400" },
                { id: "#WF-7839", status: "Received", time: "12m ago", color: "text-slate-400" }
              ].map((order, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0"
                >
                  <span className="font-mono text-sm text-white">{order.id}</span>
                  <span className={`text-sm font-medium ${order.color}`}>{order.status}</span>
                  <span className="text-xs text-slate-500">{order.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FulfillmentHero;
