import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const ShopifyCaseStudies = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const caseStudies = [
    {
      industry: "Beauty Brand",
      badge: "Beauty & Skincare",
      challenge: "Flash-sale chaos with high volume spikes",
      solution: "Fast check-in + branded packaging workflow",
      result: "99.9% accuracy, 50% faster throughput",
    },
    {
      industry: "Apparel",
      badge: "Fashion & Apparel",
      challenge: "Subscription kitting + QC requirements",
      solution: "Dedicated kitting station + photo documentation",
      result: "Zero errors, 100% unboxing satisfaction",
    },
    {
      industry: "Home Goods",
      badge: "Home & Lifestyle",
      challenge: "Multi-channel inventory sync needed",
      solution: "Platform integration + stock automation",
      result: "24hr inventory accuracy guarantee",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-[hsl(var(--shopify-page-light))] to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]">
            Proven Results Across Industries
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real challenges solved with measurable outcomes
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex-shrink-0 w-[85vw] md:w-auto snap-center"
              >
                <Card className="h-full border-2 border-border/50 hover:border-[hsl(var(--shopify-page-accent))]/50 hover:shadow-xl transition-all duration-300 bg-white group">
                  <CardHeader>
                    <Badge className="w-fit mb-3 bg-[hsl(var(--shopify-page-accent))]/10 text-[hsl(var(--shopify-page-accent))] border-[hsl(var(--shopify-page-accent))]/20 hover:bg-[hsl(var(--shopify-page-accent))]/20">
                      {study.badge}
                    </Badge>
                    <CardTitle className="text-xl mb-4">{study.industry}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        Challenge
                      </h4>
                      <p className="text-sm">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        Solution
                      </h4>
                      <p className="text-sm">{study.solution}</p>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <h4 className="font-semibold text-sm text-[hsl(var(--shopify-page-accent))] mb-1 flex items-center gap-1">
                        Result
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-sm font-medium">{study.result}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopifyCaseStudies;
