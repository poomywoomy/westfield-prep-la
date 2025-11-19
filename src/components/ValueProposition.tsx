import { Package, DollarSign, MapPin, TrendingUp, CheckCircle, Users } from "lucide-react";

const ValueProposition = () => {
  const benefits = [
    {
      icon: Package,
      title: "Fast Turnaround",
      description: "Orders processed in 24-48 hours. Same-day receiving available."
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden fees. Clear per-item pricing you can calculate upfront."
    },
    {
      icon: MapPin,
      title: "Strategic Location",
      description: "Near Port of LA for lower import costs. Fast West Coast distribution."
    },
    {
      icon: TrendingUp,
      title: "Built to Scale",
      description: "No minimums. We grow with you from 50 to 5,000+ orders/month."
    },
    {
      icon: CheckCircle,
      title: "Quality-Focused Team",
      description: "Experienced fulfillment specialists who treat your products like their own."
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Direct communication with your account team. Fast response times."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
            Why E-Commerce Brands Choose Westfield
          </h2>
          
          <p className="text-lg text-muted-foreground text-center mb-16 max-w-4xl mx-auto leading-relaxed">
            Westfield Prep Center provides expert 3PL and fulfillment services for online brands throughout Los Angeles and Southern California. From Shopify stores to multi-channel sellers, we handle receiving, inventory management, order processing, and shipping - so you can focus on growing your business. Our strategic LA location near the Port of Los Angeles reduces your inbound costs while providing fast delivery to customers nationwide.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
