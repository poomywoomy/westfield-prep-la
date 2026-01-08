import { Zap, Gift, RefreshCw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

const ShopifyChannelValueGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const values = [
    {
      icon: Zap,
      title: "Real-Time Inventory Sync",
      description: "Automatic stock updates the moment orders ship or inventory arrives. No manual spreadsheets, no overselling, no customer complaints. Your Shopify store always shows accurate availability.",
    },
    {
      icon: Gift,
      title: "Branded Unboxing Experiences",
      description: "Custom tissue paper, thank-you cards, promotional inserts, and gift wrapping. Every package tells your brand story and creates Instagram-worthy unboxing moments that drive repeat purchases.",
    },
    {
      icon: RefreshCw,
      title: "Seamless Returns Processing",
      description: "We receive, inspect, restock, and update your inventory automatically. Quality control photos document every return. Damaged items are flagged before they reach your customers again.",
    },
    {
      icon: TrendingUp,
      title: "Scale Without Limits",
      description: "From 50 orders per month to 5,000+, our infrastructure grows with you. No long-term contracts, no hidden fees. Flash sales and seasonal spikes handled without breaking a sweat.",
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-background to-[hsl(var(--shopify-page-light))]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]">
            Why Shopify Brands Choose Westfield
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Running a Shopify store is hard enough. Let us handle the fulfillment complexity while you focus on growing your brand, launching products, and delighting customers. Here's what sets us apart from generic 3PLs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="h-full border-2 border-border/50 hover:border-[hsl(var(--shopify-page-accent))]/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--shopify-page-accent))] to-[hsl(var(--shopify-page-primary))] opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--shopify-page-accent))]/10 to-[hsl(var(--shopify-page-accent))]/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <value.icon className="h-8 w-8 text-[hsl(var(--shopify-page-accent))]" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopifyChannelValueGrid;
