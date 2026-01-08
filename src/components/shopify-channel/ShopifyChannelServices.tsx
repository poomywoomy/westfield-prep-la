import { Package, Palette, Truck, RotateCcw, Camera, Boxes } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Link } from "react-router-dom";

const ShopifyChannelServices = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;

  const services = [
    {
      icon: Package,
      title: "Pick & Pack Fulfillment",
      description: "Every order picked accurately, packed professionally, and shipped same-day when received before 2PM. We handle single items, multi-SKU orders, and complex bundles with equal precision.",
      link: "/order-fulfillment",
      linkText: "Learn about fulfillment →",
    },
    {
      icon: Palette,
      title: "Custom Branding & Kitting",
      description: "Branded tissue paper, custom mailer boxes, thank-you cards, promotional inserts, stickers, and gift wrapping. Create memorable unboxing experiences that turn customers into brand advocates.",
      link: "/kitting-bundling",
      linkText: "See branding options →",
    },
    {
      icon: Truck,
      title: "Multi-Carrier Shipping",
      description: "Access discounted rates across USPS, UPS, FedEx, and regional carriers. We automatically select the best carrier based on destination, weight, and delivery speed requirements.",
      link: "/pricing",
      linkText: "View shipping rates →",
    },
    {
      icon: RotateCcw,
      title: "Returns Management",
      description: "Full returns processing including receiving, inspection, quality control photography, restocking, and inventory updates. Problem items flagged before they cause customer complaints.",
      link: "/returns-processing",
      linkText: "Returns workflow →",
    },
    {
      icon: Camera,
      title: "Photo Quality Control",
      description: "Every order photographed before shipping. Every return documented on arrival. Full visual audit trail accessible through your client dashboard for dispute resolution.",
      link: "/receiving-inspection",
      linkText: "QC process details →",
    },
    {
      icon: Boxes,
      title: "Inventory Storage",
      description: "Climate-controlled, secure warehouse space in Los Angeles. Strategic location for fast West Coast delivery and efficient nationwide distribution. No long-term commitments.",
      link: "/storage-warehousing",
      linkText: "Storage options →",
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-[hsl(var(--shopify-page-light))]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]">
            Complete Shopify Fulfillment Services
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            From the moment your products arrive at our Los Angeles warehouse to the second they land on your customer's doorstep, we handle every step with care. Each service is designed specifically for DTC Shopify brands who demand quality.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-border/50 hover:border-[hsl(var(--shopify-page-accent))]/50 hover:shadow-2xl transition-all duration-300 group bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--shopify-page-accent))]/5 to-transparent rounded-bl-full" />
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[hsl(var(--shopify-page-accent))]/15 to-[hsl(var(--shopify-page-accent))]/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="h-7 w-7 text-[hsl(var(--shopify-page-accent))]" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
                  <Link 
                    to={service.link}
                    className="inline-block text-sm font-medium text-[hsl(var(--shopify-page-accent))] hover:text-[hsl(var(--shopify-page-primary))] transition-colors"
                  >
                    {service.linkText}
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopifyChannelServices;
