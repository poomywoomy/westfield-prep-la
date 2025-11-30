import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

const ShopifyTestimonials = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const heroQuote = {
    text: "Working with Westfield is seamless. They scale with us — and they care about our customers.",
    author: "Bryan Flores",
    position: "CEO",
    company: "Home Goods Brand",
  };

  const additionalQuotes = [
    {
      text: "500+ orders/month with perfect QC photos.",
      author: "Sarah M.",
      company: "Beauty Brand",
    },
    {
      text: "Custom packaging and inserts handled flawlessly.",
      author: "Alex R.",
      company: "Apparel Co.",
    },
    {
      text: "3k units/month and growing. They just get it.",
      author: "Jordan T.",
      company: "Home Goods",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]">
            Trusted by Growing Shopify Brands
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real feedback from real businesses we serve every day
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 border-[hsl(var(--shopify-page-accent))]/30 bg-gradient-to-br from-white to-[hsl(var(--shopify-page-accent))]/5 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[hsl(var(--shopify-page-accent))] text-[hsl(var(--shopify-page-accent))]"
                    />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl font-semibold text-[hsl(var(--shopify-page-primary))] mb-6 leading-relaxed">
                  "{heroQuote.text}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[hsl(var(--shopify-page-accent))] to-[hsl(var(--shopify-page-accent))]/60" />
                  <div>
                    <div className="font-bold text-[hsl(var(--shopify-page-primary))]">
                      {heroQuote.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {heroQuote.position} • {heroQuote.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Quotes Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {additionalQuotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full border-2 border-border/50 hover:border-[hsl(var(--shopify-page-accent))]/30 hover:shadow-lg transition-all bg-white">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-[hsl(var(--shopify-page-accent))] text-[hsl(var(--shopify-page-accent))]"
                        />
                      ))}
                    </div>
                    <p className="text-base font-medium mb-4 text-[hsl(var(--shopify-page-primary))]">
                      "{quote.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(var(--shopify-page-accent))]/20 to-[hsl(var(--shopify-page-accent))]/10" />
                      <div>
                        <div className="font-semibold text-sm">{quote.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {quote.company}
                        </div>
                      </div>
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

export default ShopifyTestimonials;
