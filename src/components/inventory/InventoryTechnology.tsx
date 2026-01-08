import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Scan, Smartphone, Cloud, Zap } from "lucide-react";

const InventoryTechnology = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const features = [
    {
      icon: Scan,
      title: "Barcode Scanning at Every Touchpoint",
      description: "From receiving to shipping, every unit is scanned. No guesswork, no manual entry errors, no missing inventory."
    },
    {
      icon: Cloud,
      title: "Real-Time Cloud Sync",
      description: "Inventory levels update instantly across all your sales channels. When we ship an order, your Shopify, Amazon, and TikTok Shop stock adjust within seconds."
    },
    {
      icon: Smartphone,
      title: "Mobile Dashboard Access",
      description: "Check your inventory from anywhere. Our responsive dashboard works on any device—phone, tablet, or desktop."
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Low stock alerts, reorder notifications, and cycle count scheduling happen automatically. You focus on selling; we handle the logistics."
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
            Our WMS Technology
          </h2>
          <p className="text-lg text-purple-200/70 max-w-3xl mx-auto mb-4">
            Enterprise-grade warehouse management that grows with your business
          </p>
          <p className="text-purple-200/50 max-w-3xl mx-auto">
            Built on years of 3PL experience, our Warehouse Management System was designed specifically for 
            e-commerce sellers—not retrofitted from legacy systems built for traditional retail. Every feature 
            exists because a real brand needed it. From lot tracking for consumables to bundle management for 
            kits, we've solved the problems you're dealing with right now.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-purple-200/70 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InventoryTechnology;
