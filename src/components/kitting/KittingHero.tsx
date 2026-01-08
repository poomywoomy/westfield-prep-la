import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Package, Plus, ArrowRight, Gift, Clock, Camera, CheckCircle } from "lucide-react";

const KittingHero = () => {
  const navigate = useNavigate();
  const trustBadges = [
    { icon: Clock, text: "Same-Day Assembly" },
    { icon: Camera, text: "Photo QC" },
    { icon: CheckCircle, text: "Custom Packaging" },
  ];

  return (
    <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900" />
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full"><circle cx="30%" cy="40%" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-300" /><circle cx="70%" cy="60%" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-300" /></svg>
      </div>
      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-4 mb-8">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <badge.icon className="w-4 h-4 text-emerald-300" />
              <span className="text-sm text-white/90">{badge.text}</span>
            </div>
          ))}
        </motion.div>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center"><Package className="w-8 h-8 text-emerald-300" /></div>
            <Plus className="w-6 h-6 text-emerald-400" />
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center"><Package className="w-8 h-8 text-emerald-300" /></div>
            <ArrowRight className="w-6 h-6 text-emerald-400" />
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-emerald-500 flex items-center justify-center"><Gift className="w-10 h-10 text-white" /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Kitting & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Bundling</span> Services</h1>
            <p className="text-lg md:text-xl text-emerald-100/80 mb-10 max-w-3xl mx-auto leading-relaxed">Multi-SKU kits, gift sets, subscription boxes, and promotional bundles assembled with precision. Every kit photographed for quality assurance. From simple 2-item bundles to complex 20+ component kits, we handle assembly so you can focus on selling.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/contact")} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg">Get a Quote</Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/pricing")} className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg">View Pricing</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default KittingHero;
