import { Package, ClipboardCheck, Camera, Box, Gift, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

const ShopifyTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const steps = [
    {
      number: 1,
      icon: Package,
      title: "Receiving",
      description: "Inbound shipments verified and logged",
    },
    {
      number: 2,
      icon: ClipboardCheck,
      title: "ASN Check-in",
      description: "Matched with advance shipping notice",
    },
    {
      number: 3,
      icon: Camera,
      title: "QC with Photos",
      description: "Timestamped image documentation",
    },
    {
      number: 4,
      icon: Box,
      title: "Pick & Pack",
      description: "Custom fulfillment per SKU spec",
    },
    {
      number: 5,
      icon: Gift,
      title: "Branded Inserts",
      description: "Cards, gifts, packaging done right",
    },
    {
      number: 6,
      icon: Truck,
      title: "Same-Day Ship",
      description: "Orders before 2PM ship that day",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-[hsl(var(--shopify-page-light))]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]">
            Our Fulfillment Process
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Six proven steps from receiving to same-day shipment
          </p>
        </div>
        <div className="max-w-4xl mx-auto relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[hsl(var(--shopify-page-accent))]/30 to-[hsl(var(--shopify-page-accent))]/10" />
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex items-start gap-6 group"
              >
                {/* Number badge */}
                <div className="relative z-10 flex-shrink-0 h-24 w-24 rounded-2xl bg-gradient-to-br from-[hsl(var(--shopify-page-accent))] to-[hsl(var(--shopify-page-accent))]/80 flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <step.icon className="h-8 w-8 mb-1" />
                  <span className="text-sm font-bold">{step.number}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md border border-border/50 group-hover:border-[hsl(var(--shopify-page-accent))]/30 group-hover:shadow-xl transition-all">
                  <h3 className="text-xl font-bold mb-2 text-[hsl(var(--shopify-page-primary))]">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopifyTimeline;
