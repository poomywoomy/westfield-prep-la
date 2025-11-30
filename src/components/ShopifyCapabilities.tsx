import { Package, BarChart, Heart, CheckCircle, Truck, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

const ShopifyCapabilities = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const capabilities = [
    {
      icon: Package,
      title: "Order Fulfillment",
      description: "Fast, accurate pick and pack.",
    },
    {
      icon: BarChart,
      title: "Inventory Sync",
      description: "Real-time tracking across platforms.",
    },
    {
      icon: Heart,
      title: "Custom Branding",
      description: "Kitting, bundle assembly, promo inserts.",
    },
    {
      icon: CheckCircle,
      title: "Photo QC",
      description: "Visual proof for every order.",
    },
    {
      icon: Truck,
      title: "Fast US Shipping",
      description: "Coast-to-coast from LA.",
    },
    {
      icon: Award,
      title: "Premium Packaging",
      description: "Gift wrapping, branded boxing.",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]">
            Complete Fulfillment Solutions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to deliver exceptional customer experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-border/50 hover:border-[hsl(var(--shopify-page-accent))]/50 hover:shadow-xl transition-all duration-300 group bg-white cursor-pointer">
                <CardHeader>
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[hsl(var(--shopify-page-accent))]/10 to-[hsl(var(--shopify-page-accent))]/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <capability.icon className="h-8 w-8 text-[hsl(var(--shopify-page-accent))]" />
                  </div>
                  <CardTitle className="text-lg">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {capability.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopifyCapabilities;
