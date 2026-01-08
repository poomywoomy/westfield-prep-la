import { TrendingUp, Package, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

const ShopifyChannelCaseStudy = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const metrics = [
    { icon: TrendingUp, value: "287%", label: "Revenue Growth" },
    { icon: Package, value: "8x", label: "Order Volume Increase" },
    { icon: Clock, value: "73%", label: "Faster Ship Time" },
    { icon: Star, value: "4.9★", label: "Customer Rating" },
  ];

  return (
    <section ref={ref} className="py-24 bg-[hsl(var(--shopify-page-light))]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[hsl(var(--shopify-page-accent))]/10 text-[hsl(var(--shopify-page-accent))] text-sm font-semibold mb-4">
              Case Study
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--shopify-page-primary))]">
              How a Skincare Brand Scaled 8x in One Year
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden"
          >
            <div className="grid lg:grid-cols-2">
              {/* Left Content */}
              <div className="p-8 md:p-12">
                <div className="inline-block px-3 py-1 rounded-full bg-[hsl(var(--shopify-page-primary))]/10 text-[hsl(var(--shopify-page-primary))] text-xs font-semibold mb-6">
                  DTC Skincare • 50K+ Monthly Orders
                </div>

                <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]">
                  The Challenge
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  A fast-growing skincare brand was struggling with fulfillment bottlenecks. Their in-house team couldn't keep up with order volume after a viral TikTok campaign. They were shipping orders 4-5 days late, receiving negative reviews, and losing repeat customers. Their Shopify store was growing, but their operations couldn't scale.
                </p>

                <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]">
                  The Solution
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We onboarded them in 48 hours. Within a week, all orders were shipping same-day. Our custom branded packaging elevated their unboxing experience. Real-time inventory sync eliminated overselling. Returns processing improved customer satisfaction. They could finally focus on marketing and product development instead of logistics.
                </p>

                <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]">
                  The Results
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Within 12 months, the brand grew from 6,000 monthly orders to 50,000+. Customer reviews improved from 3.8 to 4.9 stars. Return requests dropped 40%. The founders successfully raised a Series A, citing "operational excellence" as a key factor investors mentioned.
                </p>
              </div>

              {/* Right Metrics */}
              <div className="bg-gradient-to-br from-[hsl(var(--shopify-page-primary))] to-[hsl(var(--shopify-page-accent))]/80 p-8 md:p-12 flex flex-col justify-center">
                <div className="text-white mb-8">
                  <h3 className="text-2xl font-bold mb-2">Results After 12 Months</h3>
                  <p className="text-white/80">Real metrics from a real Shopify brand</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
                    >
                      <metric.icon className="h-8 w-8 text-white/90 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                      <div className="text-sm text-white/70">{metric.label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <blockquote className="text-white/90 italic">
                    "Westfield didn't just fix our fulfillment—they transformed our entire business. We went from dreading Black Friday to crushing it."
                  </blockquote>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                      JL
                    </div>
                    <div>
                      <div className="text-white font-medium">Jessica L.</div>
                      <div className="text-white/60 text-sm">Founder & CEO</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShopifyChannelCaseStudy;
