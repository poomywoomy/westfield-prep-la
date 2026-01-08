import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Package, Gift, Layers, Sparkles, Clock, Users, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const KittingHero = () => {
  const navigate = useNavigate();
  const [assemblyStage, setAssemblyStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssemblyStage((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: "500+", label: "Kits/Day Capacity", icon: Layers },
    { value: "2hr", label: "Avg Assembly Time", icon: Clock },
    { value: "150+", label: "Active Kit Clients", icon: Users },
  ];

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Emerald Industrial Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950" />
      
      {/* Blueprint Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(16, 185, 129) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(16, 185, 129) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Conveyor Belt Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 100%" }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Industrial Style */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-200">Assembly Workshop</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              We Assemble.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                You Sell.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-emerald-100/80 mb-8 leading-relaxed">
              Multi-SKU kits, subscription boxes, gift sets, promotional bundles assembled with precision. 
              Every kit photographed. Every component verified.
              <span className="text-emerald-300 font-medium"> From 2-item bundles to 50+ component kits.</span>
            </p>

            {/* Stats Bar - Industrial Style */}
            <div className="flex flex-wrap gap-6 mb-8 p-4 rounded-xl bg-slate-900/60 border border-emerald-400/20">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-emerald-300">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/contact")}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-6 text-lg"
              >
                Get Assembly Quote
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/pricing")}
                className="border-2 border-emerald-400/50 bg-emerald-500/10 text-white hover:bg-emerald-500/20 px-8 py-6 text-lg"
              >
                View Pricing
              </Button>
            </div>
          </motion.div>

          {/* Right Visual - Animated Assembly Line */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-slate-900/80 rounded-2xl border border-emerald-400/30 p-8 backdrop-blur-sm overflow-hidden">
              {/* Assembly Animation */}
              <div className="relative h-64 flex items-center justify-center">
                {/* Component Items */}
                <motion.div
                  className="absolute left-0 flex flex-col gap-4"
                  animate={{ x: assemblyStage >= 1 ? 80 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-500/30 border border-blue-400 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/30 border border-purple-400 flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-amber-500/30 border border-amber-400 flex items-center justify-center">
                    <Package className="w-6 h-6 text-amber-400" />
                  </div>
                </motion.div>

                {/* Assembly Zone */}
                <motion.div
                  className="relative z-10"
                  animate={{ 
                    scale: assemblyStage === 2 ? [1, 1.1, 1] : 1,
                    rotate: assemblyStage === 2 ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {assemblyStage < 3 ? (
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/30 border-2 border-dashed border-emerald-400 flex items-center justify-center">
                      <Zap className="w-10 h-10 text-emerald-400" />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-24 h-24 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40"
                    >
                      <Gift className="w-12 h-12 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* QC Stamp */}
                {assemblyStage === 3 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute right-0 top-0 px-3 py-1 rounded bg-green-500 text-white text-xs font-bold transform rotate-12"
                  >
                    QC APPROVED
                  </motion.div>
                )}
              </div>

              {/* Stage Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {["Components", "Merge", "Assembly", "Complete"].map((label, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full transition-colors ${idx <= assemblyStage ? "bg-emerald-400" : "bg-slate-600"}`} />
                    <span className={`text-xs mt-1 ${idx <= assemblyStage ? "text-emerald-300" : "text-slate-500"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default KittingHero;
