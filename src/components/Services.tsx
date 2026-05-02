import { Zap, Clock, Globe, Building2, Users, Warehouse, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TranslatedText } from "./TranslatedText";
import { SectionHeading, IconBadge } from "./home/HomePrimitives";

const services = [
  { icon: Zap, title: "Same-Day Shipping", description: "Order at 10am? Shipped by 3pm. That's the Westfield difference. Fast nationwide delivery from our Los Angeles hub.", bestFor: ["DTC Brands", "Time-Sensitive Products", "High-Volume Sellers"] },
  { icon: Clock, title: "Same-Day Check-Ins", description: "Your inventory doesn't sit in limbo. It's checked in, photographed, and ready to sell within 24 hours.", bestFor: ["Fast-Moving Inventory", "Product Launches", "Seasonal Restocks"] },
  { icon: Globe, title: "International Shipping", description: "Your products, delivered worldwide. We handle the customs headaches so you don't have to.", bestFor: ["Global Brands", "Export Businesses", "Multi-Country Sellers"] },
  { icon: Building2, title: "B2B Fulfillment", description: "Pallets, wholesale orders, retail compliance. We speak B2B fluently.", bestFor: ["Wholesalers", "Brand Distributors", "Retail Vendors"] },
  { icon: Users, title: "DTC Fulfillment", description: "Custom inserts, tissue paper, thank-you cards? We'll make your unboxing experience Instagram-worthy.", bestFor: ["Luxury Brands", "Subscription Boxes", "Gift Products"] },
  { icon: Warehouse, title: "Storage & Warehousing", description: "Flexible terms, no long-term contracts. Pay for what you use, scale when you're ready.", bestFor: ["Seasonal Inventory", "Long-Term Storage", "Overflow Stock"] },
];

const serviceLinks: Record<string, string> = {
  "Same-Day Shipping": "/order-fulfillment",
  "Same-Day Check-Ins": "/receiving-inspection",
  "International Shipping": "/order-fulfillment",
  "B2B Fulfillment": "/order-fulfillment",
  "DTC Fulfillment": "/shopify-fulfillment",
  "Storage & Warehousing": "/storage-warehousing",
};

const Services = () => {
  const navigate = useNavigate();
  const goToService = (title: string) => navigate(serviceLinks[title] || "/contact");

  return (
    <section id="services" className="relative py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="What We Do"
            title={<TranslatedText>Every Fulfillment Scenario, Covered</TranslatedText>}
            subtitle={<TranslatedText>From your first 50 orders to full-scale multi-channel distribution, we've built the playbook.</TranslatedText>}
          />

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-background rounded-2xl p-7 border border-border hover:border-secondary/40 hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <span className="block text-[11px] font-bold text-secondary tracking-[0.18em] mb-2">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <IconBadge size="lg">
                        <Icon className="w-7 h-7" />
                      </IconBadge>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-primary tracking-tight">
                        <TranslatedText>{service.title}</TranslatedText>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        <TranslatedText>{service.description}</TranslatedText>
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {service.bestFor.map((item, i) => (
                          <span key={i} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-muted text-primary border border-border">
                            <TranslatedText>{item}</TranslatedText>
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => goToService(service.title)}
                        className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:gap-2 transition-all"
                      >
                        <TranslatedText>Learn More</TranslatedText>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-7 text-lg shadow-lg shadow-secondary/30"
            >
              <TranslatedText>Explore All Services</TranslatedText>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
