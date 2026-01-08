import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Warehouse, Shield, Thermometer, Lock, Camera, Package } from "lucide-react";
import { useState, useEffect } from "react";

const StorageHero = () => {
  const navigate = useNavigate();
  const [activeRack, setActiveRack] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRack((prev) => (prev + 1) % 9);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Steel Blue Industrial Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900" />
      
      {/* Warehouse Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(6, 182, 212) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(6, 182, 212) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Security Scan Line */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40"
        animate={{ x: [0, 1200, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Visual - Animated Warehouse Rack System */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 lg:order-1"
          >
            <div className="relative bg-slate-900/80 rounded-2xl border border-cyan-400/30 p-6 backdrop-blur-sm">
              {/* Warehouse Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-cyan-300 font-mono">WAREHOUSE LIVE VIEW</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/20 border border-cyan-400/30">
                    <Thermometer className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs text-cyan-300">68°F</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 border border-green-400/30">
                    <Camera className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-300">REC</span>
                  </div>
                </div>
              </div>

              {/* Rack Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[...Array(9)].map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      idx === activeRack 
                        ? "bg-cyan-500/30 border-cyan-400 shadow-lg shadow-cyan-500/30" 
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    }`}
                    animate={{
                      scale: idx === activeRack ? 1.05 : 1,
                    }}
                  >
                    <Package className={`w-8 h-8 ${idx === activeRack ? "text-cyan-400" : "text-slate-500"}`} />
                  </motion.div>
                ))}
              </div>

              {/* Capacity Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-cyan-300">Warehouse Capacity</span>
                  <span className="text-cyan-400 font-medium">72% Utilized</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-400"
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Security Indicators */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-300">Armed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-300">Recording</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-300">24/7 Monitored</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-left order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-6">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-200">Secure Vault</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Inventory.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
                Fort Knox Protection.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-cyan-100/80 mb-8 leading-relaxed">
              50,000+ sq ft of climate-controlled, 24/7 secured storage. Real-time inventory tracking, 
              FIFO rotation, and same-day access. 
              <span className="text-cyan-300 font-medium"> From single pallets to dedicated warehouse bays.</span>
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <Warehouse className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-white">50,000+ Sq Ft</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <Thermometer className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-white">Climate Controlled</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-white">24/7 Security</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-white">Insured Storage</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/contact")}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-6 text-lg"
              >
                Reserve Space Now
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/pricing")}
                className="border-2 border-cyan-400/50 bg-cyan-500/10 text-white hover:bg-cyan-500/20 px-8 py-6 text-lg"
              >
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorageHero;
