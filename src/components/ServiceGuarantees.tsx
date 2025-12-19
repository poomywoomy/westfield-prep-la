import { useRef } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  DollarSign, 
  Camera, 
  MessageCircle, 
  ShieldCheck,
  CheckCircle 
} from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const guarantees = [
  {
    icon: Zap,
    title: "Same-Day Shipping",
    description: "Orders received by 2pm PST ship same day. No exceptions, no excuses.",
  },
  {
    icon: Target,
    title: "99.8% Accuracy",
    description: "Right product, right label, right customer — every time.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees, no surprise invoices. Ever.",
  },
  {
    icon: Camera,
    title: "Photo-Proof QC",
    description: "Every shipment photographed before it leaves our dock.",
  },
  {
    icon: MessageCircle,
    title: "< 2hr Response Time",
    description: "Real humans answer real questions. Fast.",
  },
  {
    icon: ShieldCheck,
    title: "Fully Insured",
    description: "GL + Warehouse Legal Liability. Your inventory is protected.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const ServiceGuarantees = () => {
  const ref = useRef<HTMLElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #0A0A23, #050510)",
      }}
    >
      {/* Subtle radial glow */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
            Our Promise
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Guarantees That{" "}
            <span className="text-primary">Actually Mean Something</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            We don't just talk about excellence — we stake our reputation on it.
          </p>
        </motion.div>

        {/* Guarantee Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative p-8 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
                whileHover={{
                  borderColor: "hsl(var(--primary) / 0.3)",
                  boxShadow: "0 0 40px hsl(var(--primary) / 0.15)",
                }}
              >
                {/* Icon */}
                <motion.div
                  className="mb-6"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {guarantee.title}
                </h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  {guarantee.description}
                </p>

                {/* Guarantee Badge */}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold tracking-widest uppercase text-primary/80">
                    Guaranteed
                  </span>
                </div>

                {/* Hover glow effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at center, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceGuarantees;
