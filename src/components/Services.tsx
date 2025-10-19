import { Package, Camera, Shield, Tag, Box, Truck, ShoppingCart, Video, Store, ShoppingBag, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Store,
    title: "Shopify Fulfillment",
    description: "Seamless integration and order fulfillment for your Shopify store.",
  },
  {
    icon: ShoppingBag,
    title: "Amazon Fulfillment",
    description: "Expert FBA prep and fulfillment services for Amazon sellers with FNSKU labeling.",
  },
  {
    icon: Video,
    title: "TikTok Shop Fulfillment",
    description: "Fast-turnaround fulfillment solutions optimized for TikTok Shop orders.",
  },
  {
    icon: Users,
    title: "DTC Fulfillment",
    description: "Direct-to-consumer fulfillment with branded packaging and personalized unboxing experiences.",
  },
  {
    icon: Package,
    title: "Receiving & Inspection",
    description: "Thorough inspection of all incoming shipments to ensure quality standards.",
  },
  {
    icon: Shield,
    title: "Polybagging & Bubble Wrap",
    description: "Professional packaging to protect your products during transit and storage.",
  },
  {
    icon: Box,
    title: "Bundling & Case Prep",
    description: "Expert bundling and carton preparation to platform specifications.",
  },
  {
    icon: Tag,
    title: "Product Labeling",
    description: "Accurate labeling including FNSKU for seamless inventory management.",
  },
  {
    icon: Truck,
    title: "LTL & SPD Shipping",
    description: "Efficient shipping solutions with major carriers for fast delivery.",
  },
  {
    icon: Camera,
    title: "Photo Proof QC",
    description: "Detailed photo documentation of every step for complete transparency.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Boutique fulfillment solutions with faster processing times than larger prep centers
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
