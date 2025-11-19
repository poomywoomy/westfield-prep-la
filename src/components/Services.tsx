import { Zap, Clock, Globe, Building2, Users, Warehouse, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Zap,
    title: "Same-Day Shipping",
    description: "Orders received before 2PM PST ship the same day. Fast nationwide delivery from our Los Angeles hub.",
    bestFor: ["DTC Brands", "Time-Sensitive Products", "High-Volume Sellers"]
  },
  {
    icon: Clock,
    title: "Same-Day Check-Ins",
    description: "Inventory received and processed within 24 hours with complete photo documentation.",
    bestFor: ["Fast-Moving Inventory", "Product Launches", "Seasonal Restocks"]
  },
  {
    icon: Globe,
    title: "International Shipping",
    description: "Worldwide fulfillment with customs documentation and global carrier partnerships.",
    bestFor: ["Global Brands", "Export Businesses", "Multi-Country Sellers"]
  },
  {
    icon: Building2,
    title: "B2B Fulfillment",
    description: "Wholesale orders, pallet forwarding, and bulk distribution for business clients.",
    bestFor: ["Wholesalers", "Brand Distributors", "Retail Vendors"]
  },
  {
    icon: Users,
    title: "DTC Fulfillment",
    description: "Direct-to-consumer orders with branded packaging and premium unboxing experiences.",
    bestFor: ["Luxury Brands", "Subscription Boxes", "Gift Products"]
  },
  {
    icon: Warehouse,
    title: "Storage & Warehousing",
    description: "Climate-controlled secure storage with flexible monthly terms in Los Angeles.",
    bestFor: ["Seasonal Inventory", "Long-Term Storage", "Overflow Stock"]
  }
];

const Services = () => {
  const goToContact = () => {
    window.location.href = "/contact";
  };

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Fulfillment Solutions
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Comprehensive logistics services designed to scale with your business
            </p>
          </div>

          {/* Premium Horizontal Rows */}
          <div className="space-y-0">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className="group flex flex-col md:flex-row items-start gap-6 md:gap-8 py-10 border-b border-border/20 hover:border-primary/30 transition-all"
                >
                  {/* Left: Number + Icon */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <span className="text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  {/* Middle: Title + Description */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <button 
                      onClick={goToContact}
                      className="text-primary hover:text-primary/80 flex items-center gap-2 font-medium transition-colors group/btn"
                    >
                      Learn More 
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  {/* Right: Best For Badge */}
                  <div className="text-left md:text-right flex-shrink-0 md:min-w-[180px]">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Best For</span>
                    <div className="flex flex-col gap-1">
                      {service.bestFor.map((item, i) => (
                        <span key={i} className="text-sm font-semibold text-primary">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <Button 
              size="lg"
              onClick={goToContact}
              className="px-8 py-6 text-lg"
            >
              Explore All Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
