import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Warehouse, Shield, Thermometer, Clock } from "lucide-react";

const StorageHero = () => {
  const navigate = useNavigate();
  const trustBadges = [
    { icon: Warehouse, text: "50,000+ Sq Ft" },
    { icon: Thermometer, text: "Climate Controlled" },
    { icon: Shield, text: "24/7 Security" },
  ];

  return (
    <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-900" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-4 mb-8">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <badge.icon className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-white/90">{badge.text}</span>
            </div>
          ))}
        </motion.div>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Storage & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">Warehousing</span></h1>
            <p className="text-xl md:text-2xl mb-6 text-cyan-400">Secure. Scalable. Climate-Controlled.</p>
            <p className="text-lg md:text-xl text-cyan-100/80 mb-10 max-w-3xl mx-auto leading-relaxed">Industrial-grade storage with 24/7 security, climate control, and flexible terms. From single pallets to dedicated warehouse space, we scale with your business. Real-time inventory tracking, FIFO rotation, and same-day access to your goods.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/contact")} className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg">Get Storage Quote</Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/pricing")} className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg">View Pricing</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorageHero;
