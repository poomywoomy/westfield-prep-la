import { Package, DollarSign, MapPin, TrendingUp, CheckCircle, Users } from "lucide-react";

const ValueProposition = () => {
  const benefits = [
    {
      icon: Package,
      title: "Fast Turnaround",
      description: "Orders processed in 24-48 hours. Same-day receiving available.",
      stat: "24-48hr"
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden fees. Clear per-item pricing you can calculate upfront.",
      stat: "No Hidden Fees"
    },
    {
      icon: MapPin,
      title: "Strategic Location",
      description: "Near Port of LA for lower import costs. Fast West Coast distribution.",
      stat: "LA Based"
    },
    {
      icon: TrendingUp,
      title: "Built to Scale",
      description: "No minimums. We grow with you from 50 to 5,000+ orders/month.",
      stat: "No Minimums"
    },
    {
      icon: CheckCircle,
      title: "Quality-Focused",
      description: "Experienced fulfillment specialists who treat your products like their own.",
      stat: "99.8% Accuracy"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Direct communication with your account team. Fast response times.",
      stat: "< 2hr Response"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left: Large Bold Headline (40%) */}
            <div className="lg:col-span-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
                Why E-Commerce Brands Choose Westfield
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Expert 3PL and fulfillment services for online brands throughout Los Angeles and Southern California.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-primary"></div>
                  <span className="text-sm font-semibold text-primary">100+ Brands Trust Us</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-secondary"></div>
                  <span className="text-sm font-semibold text-secondary">2M+ Orders Fulfilled</span>
                </div>
              </div>
            </div>

            {/* Right: Benefits Grid (60%) */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div 
                      key={index}
                      className="group relative bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute top-6 right-6 text-4xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      
                      <Icon className="w-14 h-14 text-primary mb-6 group-hover:scale-110 transition-transform" />
                      
                      <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                        {benefit.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {benefit.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <span className="text-sm font-bold text-primary">{benefit.stat}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
