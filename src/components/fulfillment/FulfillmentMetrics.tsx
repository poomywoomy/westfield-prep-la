import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { MetricCounter } from "@/components/ui/metric-counter";
import { Target, Clock, Package, Gauge } from "lucide-react";

const FulfillmentMetrics = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const metrics = [
    {
      icon: Target,
      value: 99.8,
      suffix: "%",
      label: "Order Accuracy",
      description: "Verified through double-scan QC at every station"
    },
    {
      icon: Clock,
      value: 4.5,
      suffix: "hrs",
      label: "Avg Processing Time",
      description: "From order received to carrier pickup"
    },
    {
      icon: Package,
      value: 10000,
      suffix: "+",
      label: "Monthly Capacity",
      description: "Orders per month with room to scale"
    },
    {
      icon: Gauge,
      value: 2,
      suffix: "PM",
      label: "Same-Day Cutoff",
      description: "PST, Monday through Saturday"
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Speed & Accuracy by the Numbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We obsess over metrics so you can obsess over growth. Here's how we perform.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 text-center h-full">
                {/* Neon glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <metric.icon className="w-7 h-7 text-blue-500" />
                  </div>
                  
                  <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">
                    <MetricCounter value={metric.value} suffix={metric.suffix} />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{metric.label}</h3>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FulfillmentMetrics;
