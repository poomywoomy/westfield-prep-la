import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { ShoppingCart, ClipboardCheck, Search, Package, Truck, Bell } from "lucide-react";

const FulfillmentProcess = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const steps = [
    {
      icon: ShoppingCart,
      step: "01",
      title: "Order Received",
      description: "Orders auto-sync from Shopify, Amazon, TikTok Shop, or your custom integration. Our WMS captures every detail instantly.",
      timing: "Real-time"
    },
    {
      icon: ClipboardCheck,
      step: "02",
      title: "Validation & Queue",
      description: "We verify inventory availability, payment status, and shipping address. Problem orders are flagged immediately.",
      timing: "< 5 minutes"
    },
    {
      icon: Search,
      step: "03",
      title: "Pick",
      description: "Our team uses barcode scanning to locate your products with pinpoint accuracy. Every scan is logged.",
      timing: "15-30 minutes"
    },
    {
      icon: Package,
      step: "04",
      title: "Pack & QC",
      description: "Items are carefully packed with your branded materials if requested. Final quality check before sealing.",
      timing: "10-20 minutes"
    },
    {
      icon: Truck,
      step: "05",
      title: "Ship",
      description: "We select the optimal carrier based on your preferences and destination. Labels are generated and packages staged for pickup.",
      timing: "Same day by 2PM"
    },
    {
      icon: Bell,
      step: "06",
      title: "Notify",
      description: "Tracking info syncs back to your platform and your customer receives a shipment notification automatically.",
      timing: "Instant"
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-slate-900">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Westfield Fulfillment Process
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Six precision steps from click to doorstep. Every order, every time.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/30 to-blue-500/50" />

          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative lg:flex ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center`}
              >
                {/* Content Card */}
                <div className={`lg:w-[calc(50%-60px)] ${idx % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'}`}>
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                    <div className={`flex items-center gap-4 mb-4 ${idx % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'}`}>
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-blue-400 font-mono text-sm">{step.step}</span>
                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-400 mb-3">{step.description}</p>
                    <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full font-medium">
                      {step.timing}
                    </span>
                  </div>
                </div>

                {/* Center Node */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-800 border-4 border-blue-500 items-center justify-center z-10">
                  <span className="text-blue-400 font-bold">{idx + 1}</span>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden lg:block lg:w-[calc(50%-60px)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FulfillmentProcess;
