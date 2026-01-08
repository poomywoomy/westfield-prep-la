import { Upload, Package, ClipboardCheck, Camera, Truck, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

const ShopifyChannelTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Connect Your Store",
      description: "Install our Shopify app and authorize access. Takes under 5 minutes. Your products and orders start syncing immediately.",
      time: "5 minutes",
    },
    {
      number: 2,
      icon: Package,
      title: "Ship Your Inventory",
      description: "Send your products to our LA warehouse. We receive, count, photograph, and check-in every unit. Full visibility in your dashboard.",
      time: "Same-day receiving",
    },
    {
      number: 3,
      icon: ClipboardCheck,
      title: "Configure Preferences",
      description: "Set up branded packaging, carrier preferences, return addresses, and any special handling instructions for specific SKUs.",
      time: "1-2 hours",
    },
    {
      number: 4,
      icon: Camera,
      title: "Orders Flow In",
      description: "New orders import automatically. Our team picks, packs, applies custom branding, and photographs each order before shipping.",
      time: "Real-time",
    },
    {
      number: 5,
      icon: Truck,
      title: "Same-Day Shipping",
      description: "Orders received before 2PM Pacific ship that day. Tracking numbers sync back to Shopify. Customers get shipping confirmations.",
      time: "Before 2PM cutoff",
    },
    {
      number: 6,
      icon: Bell,
      title: "Monitor & Scale",
      description: "Track inventory levels, order status, and fulfillment metrics through your dashboard. Scale up seamlessly as your brand grows.",
      time: "Ongoing",
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]">
            From Connection to First Shipment
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Getting started with Westfield is simple. Most Shopify stores are fully operational within 48 hours of connecting. Here's exactly what happens at each step of the onboarding process.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-[60px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[hsl(var(--shopify-page-accent))] via-[hsl(var(--shopify-page-accent))]/50 to-[hsl(var(--shopify-page-accent))]/10" />
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative flex items-start gap-6 md:gap-8 group"
              >
                {/* Number badge */}
                <div className="relative z-10 flex-shrink-0 h-[120px] w-[120px] rounded-2xl bg-gradient-to-br from-[hsl(var(--shopify-page-accent))] to-[hsl(var(--shopify-page-primary))] flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
                  <step.icon className="h-8 w-8 mb-2" />
                  <span className="text-lg font-bold">Step {step.number}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md border border-border/50 group-hover:border-[hsl(var(--shopify-page-accent))]/40 group-hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-[hsl(var(--shopify-page-primary))]">
                      {step.title}
                    </h3>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-[hsl(var(--shopify-page-accent))]/10 text-[hsl(var(--shopify-page-accent))]">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopifyChannelTimeline;
