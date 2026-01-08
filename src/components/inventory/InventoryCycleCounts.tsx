import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { ClipboardList, Scan, CheckCircle, FileText, AlertCircle } from "lucide-react";

const InventoryCycleCounts = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const steps = [
    {
      icon: ClipboardList,
      step: "01",
      title: "Schedule",
      description: "Daily counts on high-velocity SKUs, weekly on medium, monthly on slow movers."
    },
    {
      icon: Scan,
      step: "02",
      title: "Scan",
      description: "Our team scans every unit in the designated zone using mobile barcode readers."
    },
    {
      icon: CheckCircle,
      step: "03",
      title: "Verify",
      description: "System compares scanned counts to expected inventory. Matches are confirmed instantly."
    },
    {
      icon: AlertCircle,
      step: "04",
      title: "Flag Variances",
      description: "Any discrepancies are flagged for investigation. Nothing slips through the cracks."
    },
    {
      icon: FileText,
      step: "05",
      title: "Report",
      description: "You receive detailed variance reports with photos and resolution notes."
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cycle Count Process
          </h2>
          <p className="text-lg text-purple-200/70 max-w-2xl mx-auto">
            Continuous counting means continuous accuracy. Here's how we maintain 99.9% precision.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center h-full hover:border-cyan-500/30 transition-colors">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  
                  <div className="text-sm font-mono text-cyan-400 mb-2">{step.step}</div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-purple-200/60">{step.description}</p>
                </div>

                {/* Connector Arrow */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-purple-500/50 to-cyan-500/50" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 grid sm:grid-cols-3 gap-8"
          >
            {[
              { value: "Daily", label: "High-velocity SKU counts" },
              { value: "< 0.1%", label: "Average variance rate" },
              { value: "24hr", label: "Resolution time for discrepancies" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-sm text-purple-200/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InventoryCycleCounts;
