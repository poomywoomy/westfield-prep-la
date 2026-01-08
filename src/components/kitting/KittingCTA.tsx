import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gift, ArrowRight } from "lucide-react";

const KittingCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center"><Gift className="w-10 h-10 text-emerald-300" /></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Custom Kits?</h2>
          <p className="text-lg md:text-xl text-emerald-100/80 mb-8 max-w-2xl mx-auto">Let's discuss your kitting needs. From subscription boxes to promotional bundles, we'll handle assembly so you can focus on growing your brand.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/contact")} className="bg-white text-emerald-900 hover:bg-emerald-100 px-8 py-6 text-lg group">Get a Quote<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/pricing")} className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg">View Pricing</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KittingCTA;
