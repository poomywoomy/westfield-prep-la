import { Star, Package, Camera, Truck } from "lucide-react";
import { motion } from "framer-motion";

const ShopifyTrustBar = () => {
  const metrics = [
    { icon: Star, label: "5.0/5 Google Rated", value: "5.0/5" },
    { icon: Package, label: "400,000+ Orders Fulfilled", value: "400K+" },
    { icon: Camera, label: "100% QC Photo Coverage", value: "100%" },
    { icon: Truck, label: "99.2% Same-Day Ship Rate", value: "99.2%" },
  ];

  return (
    <section className="py-8 bg-[hsl(var(--shopify-page-light))] border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-border/30 hover:border-[hsl(var(--shopify-page-accent))]/30 hover:shadow-md transition-all"
            >
              <metric.icon className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--shopify-page-accent))] mb-2" />
              <div className="font-bold text-lg md:text-xl text-[hsl(var(--shopify-page-primary))]">
                {metric.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopifyTrustBar;
