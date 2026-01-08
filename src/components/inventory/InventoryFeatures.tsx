import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { BarChart3, Bell, TrendingUp, RotateCcw, Layers, Calendar } from "lucide-react";

const InventoryFeatures = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const features = [
    {
      icon: BarChart3,
      title: "Real-Time Dashboard",
      description: "Live inventory levels across all locations, updated with every scan and shipment."
    },
    {
      icon: Bell,
      title: "Low Stock Alerts",
      description: "Custom thresholds per SKU. Get notified before you run out, not after."
    },
    {
      icon: TrendingUp,
      title: "Demand Forecasting",
      description: "AI-powered predictions help you reorder at the right time based on sales velocity."
    },
    {
      icon: RotateCcw,
      title: "Cycle Count Automation",
      description: "Scheduled counts on high-velocity SKUs to catch discrepancies early."
    },
    {
      icon: Layers,
      title: "Lot & Batch Tracking",
      description: "Track inventory by lot number for recalls, FIFO, or compliance requirements."
    },
    {
      icon: Calendar,
      title: "Expiration Management",
      description: "Automatic alerts for products approaching expiry dates. Perfect for consumables."
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-slate-950">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Inventory Tracking Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to maintain perfect inventory accuracy
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient accent on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InventoryFeatures;
