import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, RefreshCw, Shield, Database } from "lucide-react";

const InventoryHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Deep Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900" />
      
      {/* Mesh Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
            radial-gradient(at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
            radial-gradient(at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 70%)
          `
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="container relative z-10">
        <div className="max-w-4xl">
          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            {[
              { icon: Shield, text: "99.9% Accuracy" },
              { icon: RefreshCw, text: "Real-Time Sync" },
              { icon: Database, text: "10,000+ SKUs" }
            ].map((badge, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium"
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
            Real-Time{" "}
            <span className="relative">
              Inventory Intelligence
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-purple-200/80 mb-10 max-w-2xl leading-relaxed"
          >
            Know exactly what you have, where it is, and when you'll need more. 
            Our WMS syncs with every sales channel to prevent stockouts, eliminate overselling, and give you complete visibility—24/7.
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
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              Schedule a Demo
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="border-purple-400/50 text-white hover:bg-purple-500/10 px-8 py-6 text-lg"
            >
              View Pricing
            </Button>
          </motion.div>
        </div>

        {/* Animated Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-96"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_60px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-purple-300 font-medium">Inventory Dashboard</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-400">Live</span>
              </div>
            </div>
            
            {/* Animated Inventory Bars */}
            <div className="space-y-4">
              {[
                { sku: "SKU-1234", level: 85, color: "bg-cyan-500" },
                { sku: "SKU-5678", level: 45, color: "bg-yellow-500" },
                { sku: "SKU-9012", level: 92, color: "bg-green-500" },
                { sku: "SKU-3456", level: 23, color: "bg-red-500" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono text-slate-400">{item.sku}</span>
                    <span className="text-white">{item.level}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.level}%` }}
                      transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Low Stock Alert */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <BarChart3 className="w-4 h-4" />
                <span>1 SKU below threshold</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InventoryHero;
