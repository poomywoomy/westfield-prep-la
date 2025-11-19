import { Package, DollarSign, MapPin, TrendingUp, CheckCircle, Users } from "lucide-react";
const ValueProposition = () => {
  const benefits = [{
    icon: Package,
    title: "Fast Turnaround",
    description: "Orders processed in 24-48 hours. Same-day receiving available.",
    stat: "24-48hr"
  }, {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees. Clear per-item pricing you can calculate upfront.",
    stat: "No Hidden Fees"
  }, {
    icon: MapPin,
    title: "Strategic Location",
    description: "Near Port of LA for lower import costs. Fast West Coast distribution.",
    stat: "LA Based"
  }, {
    icon: TrendingUp,
    title: "Built to Scale",
    description: "No minimums. We grow with you from 50 to 5,000+ orders/month.",
    stat: "No Minimums"
  }, {
    icon: CheckCircle,
    title: "Quality-Focused",
    description: "Experienced fulfillment specialists who treat your products like their own.",
    stat: "99.8% Accuracy"
  }, {
    icon: Users,
    title: "Dedicated Support",
    description: "Direct communication with your account team. Fast response times.",
    stat: "< 2hr Response"
  }];
  return <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground mb-6">
              Why E-Commerce Brands Choose Westfield
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Expert 3PL and fulfillment services for online brands throughout Los Angeles and Southern California.
            </p>

            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-primary"></div>
                <span className="text-sm font-semibold text-primary">100+ Brands Trust Us</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-secondary"></div>
                <span className="text-sm font-semibold text-secondary">2M+ Orders Fulfilled this Year    </span>
              </div>
            </div>
          </div>

          {/* Benefits Grid - Card Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index} 
                  className="group relative bg-card border border-border rounded-xl p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  {/* Top: Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-all duration-300">
                      <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                    {benefit.description}
                  </p>

                  {/* Bottom: Stat Badge */}
                  <div className="pt-4 border-t border-border/50">
                    <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
                      <span className="text-xs font-bold text-primary whitespace-nowrap">
                        {benefit.stat}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>;
};
export default ValueProposition;