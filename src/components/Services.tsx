import { useState } from "react";
import { Package, Camera, Truck, Users, Zap, Clock, Globe, Building2, Warehouse, TruckIcon, Headphones, RotateCcw, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ServiceInfoDialog from "@/components/ServiceInfoDialog";

const services = [
  {
    icon: Zap,
    title: "Same-Day Shipping",
    description: "Orders received before 2PM PST ship the same day. Fast nationwide delivery from our Los Angeles hub.",
    fullDescription: "Our same-day shipping service ensures your customers receive their orders quickly. Orders placed before 2 PM PST ship out the same business day, giving you a competitive edge in customer satisfaction.",
    benefits: [
      "Orders ship same day when received before 2 PM PST cutoff",
      "Strategic Los Angeles location for fast coast-to-coast delivery",
      "All major carriers available including USPS, FedEx, UPS",
      "Tracking numbers provided within hours of shipment",
      "Weekend processing available for high-volume clients"
    ],
    bestFor: ["DTC Brands", "Time-Sensitive Products", "High-Volume Sellers"],
    pricing: "Contact us for custom pricing"
  },
  {
    icon: Clock,
    title: "Same-Day Check-Ins",
    description: "Inventory received and processed within 24 hours with complete photo documentation.",
    fullDescription: "Get your inventory ready to sell faster with our same-day check-in service. We receive, verify, photograph, and stock your products within 24 hours of arrival.",
    benefits: [
      "Inventory ready to ship within 24 hours of arrival",
      "ASN verification against physical inventory",
      "Timestamped photo documentation of all items",
      "Immediate inventory sync to your dashboard",
      "Quick turnaround for restocks and new product launches"
    ],
    bestFor: ["Fast-Moving Inventory", "Product Launches", "Seasonal Restocks"],
    pricing: "Contact us for custom pricing"
  },
  {
    icon: Globe,
    title: "International Shipping",
    description: "Worldwide fulfillment with customs documentation and global carrier partnerships.",
    fullDescription: "Expand your business globally with our international shipping services. We handle customs documentation, international carrier coordination, and ensure compliance with destination country requirements.",
    benefits: [
      "Customs documentation prepared for all shipments",
      "Partnerships with major international carriers",
      "Duty and tax calculation assistance",
      "Restricted items compliance checking",
      "International tracking and delivery confirmation"
    ],
    bestFor: ["Global Brands", "Export Businesses", "Multi-Country Sellers"],
    pricing: "Custom pricing based on destination and volume"
  },
  {
    icon: Building2,
    title: "B2B Fulfillment",
    description: "Wholesale orders, pallet forwarding, and bulk distribution for business clients.",
    fullDescription: "Specialized B2B fulfillment for wholesale orders and bulk distribution. We handle pallet prep, LTL freight, and large-volume shipments to retailers and distributors.",
    benefits: [
      "Professional pallet building and shrink wrapping",
      "LTL freight coordination and BOL generation",
      "Bulk order processing for wholesale clients",
      "Retailer compliance prep (Walmart, Target, etc.)",
      "Direct-to-retailer distribution center shipping"
    ],
    bestFor: ["Wholesalers", "Brand Distributors", "Retail Vendors"],
    pricing: "Volume-based pricing available for wholesale clients"
  },
  {
    icon: Users,
    title: "DTC Fulfillment",
    description: "Direct-to-consumer orders with branded packaging and premium unboxing experiences.",
    fullDescription: "Create memorable unboxing experiences with our DTC fulfillment service. From custom packaging to branded inserts, we help you build customer loyalty through exceptional presentation.",
    benefits: [
      "Custom branded packaging and tissue paper",
      "Thank-you cards and promotional inserts",
      "Gift wrapping and special packaging options",
      "Personalized notes for repeat customers",
      "Premium unboxing materials for product launches"
    ],
    bestFor: ["Luxury Brands", "Subscription Boxes", "Gift Products"],
    pricing: "Contact us for custom pricing"
  },
  {
    icon: Warehouse,
    title: "Storage & Warehousing",
    description: "Climate-controlled secure storage with flexible monthly terms in Los Angeles.",
    fullDescription: "Climate-controlled warehouse space in Los Angeles with flexible storage options. No long-term contracts required - pay only for the space you use each month.",
    benefits: [
      "Climate-controlled facility year-round",
      "24/7 security monitoring and access control",
      "Flexible month-to-month storage terms",
      "Inventory cycle counts included",
      "Prime Los Angeles location near major ports"
    ],
    bestFor: ["Seasonal Inventory", "Long-Term Storage", "Overflow Stock"],
    pricing: "Contact us for custom pricing"
  },
  {
    icon: TruckIcon,
    title: "Carton/Pallet Forwarding",
    description: "LTL freight management and professional pallet prep to any destination nationwide.",
    fullDescription: "Full-service freight forwarding for cartons and pallets. We handle everything from pallet building to carrier coordination for nationwide LTL shipments.",
    benefits: [
      "Professional pallet building and securing",
      "LTL carrier coordination and rate negotiation",
      "BOL generation and freight documentation",
      "Delivery appointment scheduling",
      "Freight tracking and delivery confirmation"
    ],
    bestFor: ["Bulk Shippers", "Amazon FBA Sellers", "B2B Distributors"],
    pricing: "Contact us for custom pricing"
  },
  {
    icon: Camera,
    title: "Photo Proof QC",
    description: "Timestamped photo documentation of every step for complete order transparency.",
    fullDescription: "Complete transparency with photo documentation of every stage. From receiving to shipping, you get timestamped photos proving proper handling and quality control.",
    benefits: [
      "Photos of all inbound inventory upon arrival",
      "Defect and damage documentation",
      "Pre-shipment verification photos",
      "Timestamped proof of proper handling",
      "Digital photo archive accessible anytime"
    ],
    bestFor: ["High-Value Products", "Quality-Critical Items", "Accountability"],
    pricing: "Contact us for custom pricing"
  },
  {
    icon: Headphones,
    title: "Dedicated Brand Support",
    description: "Personal account manager with priority processing and custom workflow setup.",
    fullDescription: "Get white-glove service with a dedicated account manager who knows your business. Priority processing, custom workflows, and direct communication for peace of mind.",
    benefits: [
      "Personal account manager assigned to your brand",
      "Priority processing during peak seasons",
      "Custom workflow development",
      "Direct phone and email support",
      "Quarterly business reviews and optimization"
    ],
    bestFor: ["Growing Brands", "High-Volume Clients", "Complex Operations"],
    pricing: "Contact us for custom pricing"
  },
  {
    icon: RotateCcw,
    title: "Returns Processing",
    description: "Inspection, restocking, refurbishment, and complete returns management.",
    fullDescription: "Complete returns management including inspection, restocking decisions, refurbishment, and customer communication. Turn returns into revenue recovery.",
    benefits: [
      "Inspection and quality assessment of all returns",
      "Restocking, refurbishment, or disposal decisions",
      "Return reason tracking and reporting",
      "Damaged item photo documentation",
      "Automated customer refund notifications"
    ],
    bestFor: ["Apparel Brands", "Electronics Sellers", "High-Return Categories"],
    pricing: "Contact us for custom pricing"
  },
  {
    icon: Network,
    title: "Multi-Channel Inventory",
    description: "Real-time inventory sync across Shopify, Amazon, TikTok Shop, and all sales channels.",
    fullDescription: "Never oversell again with real-time inventory synchronization across all your sales channels. One central inventory pool automatically updates all platforms.",
    benefits: [
      "Real-time inventory sync across all channels",
      "Automatic stock updates after every order",
      "Low stock alerts and reorder notifications",
      "Inventory forecasting and trend analysis",
      "Prevention of overselling across platforms"
    ],
    bestFor: ["Multi-Channel Sellers", "Omnichannel Brands", "Growing Businesses"],
    pricing: "Contact us for custom pricing"
  },
  {
    icon: Package,
    title: "Custom Kitting",
    description: "Bundle assembly, promotional sets, and subscription box preparation services.",
    fullDescription: "Professional kitting and bundle assembly for subscription boxes, promotional sets, and multi-item bundles. Perfect for creating unique product offerings.",
    benefits: [
      "Custom bundle and kit assembly",
      "Subscription box preparation and scheduling",
      "Promotional set creation for campaigns",
      "Quality control for multi-item packages",
      "Flexible kitting for seasonal offerings"
    ],
    bestFor: ["Subscription Boxes", "Gift Sets", "Promotional Bundles"],
    pricing: "Contact us for custom pricing"
  },
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  return (
    <>
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
                <Card 
                  key={index} 
                  className="border-border hover:shadow-lg transition-all cursor-pointer hover:border-primary/40"
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-3">{service.description}</p>
                    <button className="text-sm font-medium text-primary hover:underline">
                      Learn More →
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <ServiceInfoDialog 
        service={selectedService}
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
};

export default Services;
