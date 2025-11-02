import { Package, Camera, Truck, Users, Zap, Clock, Globe, Building2, Warehouse, TruckIcon, Headphones, RotateCcw, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Zap,
    title: "Same-Day Shipping",
    description: "Orders received before 2PM PST ship the same day. Fast nationwide delivery from our Los Angeles hub.",
  },
  {
    icon: Clock,
    title: "Same-Day Check-Ins",
    description: "Inventory received and processed within 24 hours with complete photo documentation.",
  },
  {
    icon: Globe,
    title: "International Shipping",
    description: "Worldwide fulfillment with customs documentation and global carrier partnerships.",
  },
  {
    icon: Building2,
    title: "B2B Fulfillment",
    description: "Wholesale orders, pallet forwarding, and bulk distribution for business clients.",
  },
  {
    icon: Users,
    title: "DTC Fulfillment",
    description: "Direct-to-consumer orders with branded packaging and premium unboxing experiences.",
  },
  {
    icon: Warehouse,
    title: "Storage & Warehousing",
    description: "Climate-controlled secure storage starting at $0.80/unit/month in Los Angeles.",
  },
  {
    icon: TruckIcon,
    title: "Carton/Pallet Forwarding",
    description: "LTL freight management and professional pallet prep to any destination nationwide.",
  },
  {
    icon: Camera,
    title: "Photo Proof QC",
    description: "Timestamped photo documentation of every step for complete order transparency.",
  },
  {
    icon: Headphones,
    title: "Dedicated Brand Support",
    description: "Personal account manager with priority processing and custom workflow setup.",
  },
  {
    icon: RotateCcw,
    title: "Returns Processing",
    description: "Inspection, restocking, refurbishment, and complete returns management.",
  },
  {
    icon: Network,
    title: "Multi-Channel Inventory",
    description: "Real-time inventory sync across Shopify, Amazon, TikTok Shop, and all sales channels.",
  },
  {
    icon: Package,
    title: "Custom Kitting",
    description: "Bundle assembly, promotional sets, and subscription box preparation services.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Premium 3PL Services in Los Angeles</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Full-service fulfillment solutions for DTC brands, Amazon sellers, and multi-channel e-commerce businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
