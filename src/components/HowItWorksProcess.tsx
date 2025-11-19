import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Database, PackageCheck, Truck } from "lucide-react";

const HowItWorksProcess = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Package,
      title: "RECEIVE",
      description: "Ship your inventory to our LA warehouse. Same-day receiving."
    },
    {
      icon: Database,
      title: "STORE",
      description: "We organize and track your stock in real-time. You always know what's in stock."
    },
    {
      icon: PackageCheck,
      title: "FULFILL",
      description: "When orders come in, we pick products within 24-48 hours."
    },
    {
      icon: Truck,
      title: "SHIP",
      description: "We pack with care and ship via the best carrier for speed & cost."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
            Simple, Streamlined Fulfillment Process
          </h2>

          {/* 4-Step Visual Process */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connector Line (hidden on last step) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-primary/30 z-0" />
                  )}
                  
                  <div className="relative bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all z-10">
                    <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    
                    <div className="text-sm font-bold text-primary mb-2">
                      STEP {index + 1}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-card-foreground">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanatory Paragraph */}
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <p className="text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
              Getting started with Westfield is straightforward. Send your inventory to our Los Angeles fulfillment center - we'll receive it same-day and add it to your account. As orders come in from your store, we automatically receive them, pick the products, pack them securely, and ship to your customers. You'll have full visibility into inventory levels, order status, and tracking information throughout the process. Whether you're on Shopify, Amazon, WooCommerce, or another platform, our team handles the logistics while you focus on sales.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            >
              Schedule Your Onboarding Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksProcess;
