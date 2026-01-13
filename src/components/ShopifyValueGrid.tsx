import { Zap, Gift, Camera, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { TranslatedText } from "@/components/TranslatedText";

const ShopifyValueGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const values = [
    {
      icon: Zap,
      title: "Lightning Speed",
      description: "Orders in by 2PM ship same day.",
    },
    {
      icon: Gift,
      title: "Brand-Safe Fulfillment",
      description: "Inserts, wraps, unboxing done your way.",
    },
    {
      icon: Camera,
      title: "QC with Photo Proof",
      description: "Every item inspected and documented.",
    },
    {
      icon: MapPin,
      title: "LA-Based, Nationwide Reach",
      description: "Fast access to all major US markets.",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-background to-[hsl(var(--shopify-page-light))]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]">
            <TranslatedText>Why DTC Brands Choose Us</TranslatedText>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            <TranslatedText>We deliver speed, quality, and brand excellence in every order</TranslatedText>
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-border/50 hover:border-[hsl(var(--shopify-page-accent))]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-white">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--shopify-page-accent))]/10 to-[hsl(var(--shopify-page-accent))]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="h-7 w-7 text-[hsl(var(--shopify-page-accent))]" />
                  </div>
                  <CardTitle className="text-xl"><TranslatedText>{value.title}</TranslatedText></CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground"><TranslatedText>{value.description}</TranslatedText></p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopifyValueGrid;
