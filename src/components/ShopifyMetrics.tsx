import { Rocket, Package, CheckCircle, Eye } from "lucide-react";
import { MetricCounter } from "@/components/ui/metric-counter";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

const ShopifyMetrics = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.3 });
  const isVisible = !!entry?.isIntersecting;

  const metrics = [
    { icon: Rocket, value: 400000, suffix: "+", label: "Orders Fulfilled" },
    { icon: Package, value: 99.2, suffix: "%", label: "Same-Day Ship Rate" },
    { icon: CheckCircle, value: 99.8, suffix: "%", label: "Order Accuracy" },
    { icon: Eye, value: 100, suffix: "%", label: "QC Photo Coverage" },
  ];

  return (
    <section ref={ref} className="py-20 bg-[hsl(var(--shopify-page-primary))] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[hsl(var(--shopify-page-accent))] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[hsl(var(--shopify-page-accent))] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Proven Performance You Can See
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Real metrics from real fulfillment operations
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <metric.icon className="h-12 w-12 text-[hsl(var(--shopify-page-accent))] mx-auto mb-4" />
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {isVisible ? (
                  <MetricCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    duration={2000}
                  />
                ) : (
                  "0"
                )}
              </div>
              <div className="text-white/70 text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopifyMetrics;
