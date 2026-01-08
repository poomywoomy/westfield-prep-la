import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SiShopify } from "react-icons/si";
import westfieldLogo from "@/assets/westfield-logo.png";

const ShopifyChannelIntegration = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const navigate = useNavigate();

  const integrationFeatures = [
    {
      title: "Automatic Order Import",
      description: "New orders flow into our WMS within seconds. No manual entry, no copy-paste errors, no delays.",
    },
    {
      title: "Instant Stock Updates",
      description: "Inventory levels sync in real-time. Sell on multiple channels without overselling.",
    },
    {
      title: "Tracking Number Sync",
      description: "Shipping confirmations push back to Shopify automatically. Customers get updates instantly.",
    },
    {
      title: "Returns Automation",
      description: "RMA processing, inventory restocking, and quality checks all happen seamlessly.",
    },
    {
      title: "Multi-Location Support",
      description: "Manage inventory across our LA facility and any additional locations you operate.",
    },
    {
      title: "SKU Mapping Intelligence",
      description: "Complex variant handling, bundle mapping, and alias management built in.",
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]">
              True Shopify Integration, Not Just a Plugin
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Most 3PLs offer basic Shopify connections that break during peak seasons. Our integration is battle-tested across Black Friday surges, flash sales, and viral TikTok moments. We've processed millions of orders without a single sync failure. Learn why brands trust our <a href="/why-choose-us" className="text-[hsl(var(--shopify-page-accent))] hover:underline font-medium">dedicated fulfillment approach</a>.
            </p>

            <div className="grid gap-4 mb-8">
              {integrationFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[hsl(var(--shopify-page-light))]/50 hover:bg-[hsl(var(--shopify-page-light))] transition-colors group"
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[hsl(var(--shopify-page-accent))]/20 flex items-center justify-center group-hover:bg-[hsl(var(--shopify-page-accent))]/30 transition-colors">
                    <Check className="h-4 w-4 text-[hsl(var(--shopify-page-accent))]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={() => navigate("/integrations")}
              className="bg-[hsl(var(--shopify-page-accent))] hover:bg-[hsl(var(--shopify-page-accent))]/90 text-white"
            >
              View All Integrations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-[hsl(var(--shopify-page-primary))] to-[hsl(var(--shopify-page-accent))]/80 rounded-3xl p-8 md:p-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
              
              <div className="relative z-10 text-white">
                <div className="text-sm font-medium opacity-80 mb-4 uppercase tracking-wider">
                  Shopify ↔ Westfield WMS
                </div>
                
                <div className="space-y-6">
                  {/* Sync Animation */}
                  <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#96BF48] rounded-lg flex items-center justify-center">
                        <SiShopify className="text-white w-6 h-6" />
                      </div>
                      <span className="font-medium">Shopify Store</span>
                    </div>
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-[hsl(var(--shopify-page-accent))]"
                    >
                      ⟷
                    </motion.div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                        <img 
                          src={westfieldLogo} 
                          alt="Westfield WMS" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-medium">WMS</span>
                    </div>
                  </div>

                  {/* Live Data */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="text-3xl font-bold">147</div>
                      <div className="text-sm opacity-80">Orders Today</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="text-3xl font-bold">98.9%</div>
                      <div className="text-sm opacity-80">Sync Success</div>
                    </div>
                  </div>

                  <div className="text-sm opacity-80 text-center pt-4 border-t border-white/20">
                    Real-time sync • Zero downtime • Enterprise-grade reliability
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

export default ShopifyChannelIntegration;
