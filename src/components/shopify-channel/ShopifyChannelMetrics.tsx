import { Rocket, Package, CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import { MetricCounter } from "@/components/ui/metric-counter";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

const ShopifyChannelMetrics = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.3 });
  const isVisible = !!entry?.isIntersecting;

  const metrics = [
    { icon: Rocket, value: 500000, suffix: "+", label: "Orders Fulfilled Annually" },
    { icon: Clock, value: 12, suffix: "hr", label: "Average Lead Time" },
    { icon: CheckCircle, value: 99.6, suffix: "%", label: "Order Accuracy Rate" },
    { icon: Package, value: 99.2, suffix: "%", label: "Same-Day Ship Rate" },
    { icon: TrendingUp, value: 2.9, suffix: "x", label: "Avg Revenue Growth" },
    { icon: Users, value: 150, suffix: "+", label: "Active Shopify Brands" },
  ];

  return (
    <section ref={ref} className="py-24 bg-[hsl(var(--shopify-page-primary))] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-15">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-96 h-96 bg-[hsl(var(--shopify-page-accent))] rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[hsl(var(--shopify-page-accent))] rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Proven Performance for Shopify Brands
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            These aren't projections. These are real metrics from real Shopify stores we fulfill daily. Our success is measured by your growth, your customer satisfaction, and your operational efficiency.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/25 hover:-translate-y-1 transition-all duration-300 group"
            >
              <metric.icon className="h-10 w-10 text-[hsl(var(--shopify-page-accent))] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl md:text-5xl font-bold mb-3">
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
              <div className="text-white/70 text-sm font-medium">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 pt-8 border-t border-white/20 max-w-4xl mx-auto"
        >
          <p className="text-white/70 text-sm">
            Metrics updated quarterly • Data verified by third-party audit • Industry-leading performance benchmarks
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopifyChannelMetrics;
