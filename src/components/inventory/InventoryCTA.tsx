import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

const InventoryCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const navigate = useNavigate();

  const benefits = [
    "Free 30-minute demo",
    "See your data in our system",
    "Custom integration plan"
  ];

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900" />
      
      {/* Mesh Gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 30% 40%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
            radial-gradient(at 70% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)
          `
        }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Take Control of Your Inventory
          </h2>
          <p className="text-xl text-purple-200/80 mb-8 max-w-2xl mx-auto">
            Real-time visibility, automated alerts, and seamless multi-channel sync. 
            See how our WMS can transform your operations.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="flex items-center gap-2 text-purple-200"
              >
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button 
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg shadow-[0_0_40px_rgba(6,182,212,0.4)]"
            >
              Schedule a Demo
              <ArrowRight className="w-5 h-5 ml-2" />
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
        </motion.div>
      </div>
    </section>
  );
};

export default InventoryCTA;
