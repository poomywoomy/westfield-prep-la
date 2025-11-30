import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

const ShopifyAddOns = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const addOns = [
    "Lot + Batch Tracking",
    "Gift Wrapping",
    "Custom SKU Config",
    "Promotional Inserts",
    "Inventory Audits",
    "Compliance Checks",
    "Seasonal Kitting",
    "Multi-Channel Sync",
  ];

  return (
    <section ref={ref} className="py-20 bg-[hsl(var(--shopify-page-light))]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]">
            Flexible Add-On Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Scale your fulfillment with these optional capabilities
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {addOns.map((addOn, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Badge
                  variant="outline"
                  className="px-5 py-3 text-base font-medium border-2 border-border/50 bg-white hover:border-[hsl(var(--shopify-page-accent))] hover:bg-[hsl(var(--shopify-page-accent))]/5 hover:scale-105 transition-all cursor-pointer"
                >
                  {addOn}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopifyAddOns;
