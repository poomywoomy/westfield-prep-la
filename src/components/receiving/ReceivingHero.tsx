import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle, Scan, Package, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

const ReceivingHero = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const inspectionSteps = [
    { icon: Package, label: "Shipment Arrives", status: "complete" },
    { icon: Scan, label: "Barcode Scanned", status: "complete" },
    { icon: Camera, label: "Photos Captured", status: "active" },
    { icon: CheckCircle, label: "QC Verified", status: "pending" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Deep Purple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-violet-900 to-slate-950" />
      
      {/* Scanner Line Animation */}
      <motion.div 
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60"
        initial={{ top: "20%" }}
        animate={{ top: ["20%", "80%", "20%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Content - 60% */}
          <div className="lg:col-span-3 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-purple-200">Quality Checkpoint Active</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Every Unit Inspected.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">
                  Every Problem Caught.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-purple-100/80 mb-8 leading-relaxed max-w-2xl">
                We photograph 100% of incoming inventory. When suppliers make mistakes, 
                you'll have proof. When units arrive damaged, you'll see it before it hits shelves.
                <span className="text-purple-300 font-medium"> 99.8% accuracy. Same-day updates.</span>
              </p>

              {/* Horror Stat Callout */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-400/20 mb-8 max-w-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-medium">Without proper QC:</p>
                  <p className="text-red-200/80 text-sm">E-commerce sellers lose an average of $4,700/month to receiving errors they never catch.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate("/contact")}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-6 text-lg"
                >
                  Start Inspecting
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/pricing")}
                  className="border-2 border-purple-400/50 bg-purple-500/10 text-white hover:bg-purple-500/20 px-8 py-6 text-lg"
                >
                  View Pricing
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Visual - 40% - Live Inspection Demo */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative bg-slate-900/80 rounded-2xl border border-purple-400/30 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-purple-300 font-mono">LIVE INSPECTION</span>
              </div>

              {/* Animated Checklist */}
              <div className="space-y-4">
                {inspectionSteps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                      idx <= activeStep 
                        ? "bg-purple-500/20 border border-purple-400/40" 
                        : "bg-slate-800/50 border border-slate-700/50"
                    }`}
                    animate={{
                      scale: idx === activeStep ? 1.02 : 1,
                    }}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      idx <= activeStep ? "bg-purple-500" : "bg-slate-700"
                    }`}>
                      <step.icon className={`w-5 h-5 ${idx <= activeStep ? "text-white" : "text-slate-400"}`} />
                    </div>
                    <span className={`font-medium ${idx <= activeStep ? "text-white" : "text-slate-400"}`}>
                      {step.label}
                    </span>
                    {idx < activeStep && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                    {idx === activeStep && (
                      <motion.div 
                        className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full ml-auto"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Photo Capture Flash Effect */}
              {activeStep === 2 && (
                <motion.div
                  className="absolute inset-0 bg-white rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.7 }}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReceivingHero;
