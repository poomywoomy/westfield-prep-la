import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, CheckCircle, XCircle, DollarSign, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

const ReturnsHero = () => {
  const navigate = useNavigate();
  const [flowStage, setFlowStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowStage((prev) => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Ruby Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-red-900 to-slate-950" />

      {/* Animated Recovery Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-green-400/20"
            initial={{ 
              x: `${20 + i * 15}%`,
              y: "100%",
              opacity: 0 
            }}
            animate={{ 
              y: "-10%",
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Centered Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 mb-6">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-200">$87K Avg. Monthly Value Recovered</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Returns Are Revenue
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-green-400">
                Waiting to Be Recovered
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-rose-100/80 mb-8 max-w-3xl mx-auto">
              Stop treating returns as a write-off. Our 5-hour processing workflow turns 85% of returns 
              back into sellable inventory. Photo documentation, smart sorting, and seamless marketplace integration.
            </p>
          </motion.div>

          {/* Animated Circular Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-3xl mx-auto mb-12"
          >
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
              {/* Return Received */}
              <motion.div
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                  flowStage >= 0 ? "bg-rose-500/20 border-2 border-rose-400" : "bg-slate-800/50 border-2 border-slate-700"
                }`}
                animate={{ scale: flowStage === 0 ? 1.05 : 1 }}
              >
                <Package className={`w-8 h-8 ${flowStage >= 0 ? "text-rose-400" : "text-slate-500"}`} />
                <span className="text-xs mt-2 text-white font-medium">Received</span>
              </motion.div>

              <ArrowRight className={`w-6 h-6 transition-colors ${flowStage >= 1 ? "text-white" : "text-slate-600"}`} />

              {/* Inspection */}
              <motion.div
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                  flowStage >= 1 ? "bg-amber-500/20 border-2 border-amber-400" : "bg-slate-800/50 border-2 border-slate-700"
                }`}
                animate={{ scale: flowStage === 1 ? 1.05 : 1 }}
              >
                <RotateCcw className={`w-8 h-8 ${flowStage >= 1 ? "text-amber-400" : "text-slate-500"}`} />
                <span className="text-xs mt-2 text-white font-medium">Inspected</span>
              </motion.div>

              <ArrowRight className={`w-6 h-6 transition-colors ${flowStage >= 2 ? "text-white" : "text-slate-600"}`} />

              {/* Split Path Container */}
              <div className="flex flex-col gap-3">
                {/* Resellable Path */}
                <motion.div
                  className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                    flowStage >= 2 && flowStage !== 4 ? "bg-green-500/20 border-2 border-green-400" : "bg-slate-800/50 border-2 border-slate-700"
                  }`}
                  animate={{ scale: flowStage === 2 ? 1.05 : 1 }}
                >
                  <CheckCircle className={`w-6 h-6 ${flowStage >= 2 ? "text-green-400" : "text-slate-500"}`} />
                  <span className="text-xs text-white font-medium">85% Resellable</span>
                </motion.div>

                {/* Damaged Path */}
                <motion.div
                  className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                    flowStage >= 4 ? "bg-red-500/20 border-2 border-red-400" : "bg-slate-800/50 border-2 border-slate-700"
                  }`}
                  animate={{ scale: flowStage === 4 ? 1.05 : 1 }}
                >
                  <XCircle className={`w-6 h-6 ${flowStage >= 4 ? "text-red-400" : "text-slate-500"}`} />
                  <span className="text-xs text-white font-medium">15% Damaged</span>
                </motion.div>
              </div>

              <ArrowRight className={`w-6 h-6 transition-colors ${flowStage >= 3 ? "text-green-400" : "text-slate-600"}`} />

              {/* Revenue Recovered */}
              <motion.div
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                  flowStage >= 3 ? "bg-green-500/30 border-2 border-green-400 shadow-lg shadow-green-500/20" : "bg-slate-800/50 border-2 border-slate-700"
                }`}
                animate={{ scale: flowStage === 3 ? 1.1 : 1 }}
              >
                <DollarSign className={`w-8 h-8 ${flowStage >= 3 ? "text-green-400" : "text-slate-500"}`} />
                <span className="text-xs mt-2 text-white font-medium">Recovered</span>
              </motion.div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-6 text-lg"
            >
              Calculate Your Recovery
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="border-2 border-rose-400/50 bg-rose-500/10 text-white hover:bg-rose-500/20 px-8 py-6 text-lg"
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
