import { useRef } from "react";
import { motion } from "framer-motion";
import { MetricCounter } from "@/components/ui/metric-counter";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const metrics = [
  { value: 100000, suffix: "+", label: "Viral Orders Fulfilled", prefix: "" },
  { value: 6, suffix: "hr", label: "Avg Processing Time", prefix: "" },
  { value: 1, suffix: "%", label: "Error Rate", prefix: "<" },
  { value: 95, suffix: "%+", label: "Customer Satisfaction", prefix: "" },
  { value: 10, suffix: "x", label: "Surge Capacity", prefix: "" },
  { value: 99, suffix: "%", label: "On-Time Delivery", prefix: "" },
];

const TikTokChannelMetrics = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-fuchsia-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -40, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-500 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Built for{" "}
            <span className="bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
              Viral Moments
            </span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            When your content takes off, your fulfillment needs to keep pace. 
            These numbers show why TikTok sellers trust us with their biggest moments.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {metric.prefix}
                  {isVisible ? (
                    <MetricCounter
                      value={metric.value}
                      duration={2000}
                      suffix={metric.suffix}
                    />
                  ) : (
                    `0${metric.suffix}`
                  )}
                </div>
                <div className="text-sm text-white/60">{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TikTokChannelMetrics;
