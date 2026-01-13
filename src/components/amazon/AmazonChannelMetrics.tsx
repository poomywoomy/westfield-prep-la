import { useRef } from "react";
import { motion } from "framer-motion";
import { MetricCounter } from "@/components/ui/metric-counter";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { TranslatedText } from "@/components/TranslatedText";

const metrics = [
  { value: 1000000, suffix: "+", label: "Units Processed", prefix: "" },
  { value: 24, suffix: "hr", label: "Avg Receiving Time", prefix: "<" },
  { value: 99.7, suffix: "%", label: "Accuracy Rate", prefix: "" },
  { value: 99.2, suffix: "%", label: "Same-Day Prep", prefix: "" },
  { value: 500, suffix: "+", label: "FBA Shipments/Mo", prefix: "" },
  { value: 0, suffix: "%", label: "Chargeback Rate", prefix: "" },
];

const AmazonChannelMetrics = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-10" animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500 rounded-full blur-3xl opacity-10" animate={{ scale: [1, 1.3, 1], y: [0, -40, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white"><TranslatedText>The Numbers</TranslatedText>{" "}<span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"><TranslatedText>Speak for Themselves</TranslatedText></span></h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto"><TranslatedText>We've helped hundreds of Amazon sellers scale their FBA business with reliable, compliant prep services that protect their accounts.</TranslatedText></p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{metric.prefix}{isVisible ? <MetricCounter value={metric.value} duration={2000} suffix={metric.suffix} /> : `0${metric.suffix}`}</div>
                <div className="text-sm text-white/60"><TranslatedText>{metric.label}</TranslatedText></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmazonChannelMetrics;
