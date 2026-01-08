import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowRight, TrendingUp } from "lucide-react";

const ReturnsCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-rose-950 via-red-900 to-slate-900 text-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center">
            <RotateCcw className="w-10 h-10 text-rose-300" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Streamline Your Returns Today
          </h2>
          <p className="text-lg md:text-xl text-rose-100/80 mb-8 max-w-2xl mx-auto">
            Stop losing money on mishandled returns. Our optimized reverse logistics 
            process recovers maximum value from every returned item.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-rose-200">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              <span>85%+ Recovery Rate</span>
            </div>
            <div className="flex items-center gap-2 text-rose-200">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              <span>5hr Avg Processing</span>
            </div>
            <div className="flex items-center gap-2 text-rose-200">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              <span>Same-Day Restocking</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-white text-rose-900 hover:bg-rose-100 px-8 py-6 text-lg group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg"
            >
              View Pricing
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReturnsCTA;
