import { useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, DollarSign, Headphones } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const values = [
  {
    icon: Shield,
    title: "Error-Free FBA Prep",
    description:
      "Our rigorous QC process catches issues before they become Amazon chargebacks. Every unit is inspected, labeled correctly, and packaged to Amazon's exact specifications.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description:
      "Most shipments are prepped and ready within 24-48 hours of receiving. When you need speed, we deliver—keeping your inventory flowing to Amazon fulfillment centers.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description:
      "No hidden fees or surprise charges. Our per-unit pricing is clear and predictable, so you can accurately calculate your margins and scale with confidence.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Get a dedicated account manager who knows your products and business. Real humans answering your questions, not chatbots or ticket queues.",
  },
];

const AmazonChannelValueGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-orange-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Amazon Sellers{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Trust Us
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built our entire operation around Amazon seller success. Every process,
            every check, every shipment is designed to protect your account and maximize your profits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 bg-card rounded-xl border border-border hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 group-hover:from-orange-200 group-hover:to-amber-200 transition-colors duration-300">
                <value.icon className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-orange-600 transition-colors duration-300">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmazonChannelValueGrid;
