import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, Camera, CheckCircle, Package, ArrowRight } from "lucide-react";

const FulfillmentReturns = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const steps = [
    {
      icon: RotateCcw,
      title: "RMA Generation",
      description: "We create return labels and track inbound packages automatically."
    },
    {
      icon: Camera,
      title: "Inspection & Photos",
      description: "Every return is photographed and inspected within 24 hours of receipt."
    },
    {
      icon: CheckCircle,
      title: "Grade & Decide",
      description: "Items are graded as resellable, damaged, or defective. You decide what happens next."
    },
    {
      icon: Package,
      title: "Restock or Dispose",
      description: "Resellable items go back to inventory; others are disposed per your instructions."
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-slate-900">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Returns Processing Included
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Returns are inevitable in e-commerce. We handle them efficiently so they don't become a bottleneck. 
                Fast processing, clear documentation, and inventory reconciliation—all part of the service.
              </p>

              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                      <p className="text-slate-400 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8"
              >
                <Link 
                  to="/returns-processing" 
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Learn more about returns processing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-blue-400 mb-2">24hr</div>
                  <div className="text-slate-400">Average return processing time</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">85%</div>
                    <div className="text-sm text-slate-400">Resellable rate</div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-sm text-slate-400">Photo documented</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FulfillmentReturns;
