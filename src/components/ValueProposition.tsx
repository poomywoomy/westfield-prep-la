import { Package, DollarSign, MapPin, TrendingUp, CheckCircle, Users } from "lucide-react";
import { TranslatedText } from "./TranslatedText";

const ValueProposition = () => {
  const benefits = [{
    icon: Package,
    title: "Speed That Keeps Customers Happy",
    description: "Your orders ship same-day. Same-day receiving means your inventory is live and selling faster.",
    stat: "Same-Day"
  }, {
    icon: DollarSign,
    title: "No 'Gotcha' Invoices",
    description: "You'll know exactly what you're paying before you sign. No hidden fees, no surprise charges, no fine print.",
    stat: "Zero Hidden Fees"
  }, {
    icon: MapPin,
    title: "The LA Advantage",
    description: "Minutes from the Port of LA means lower import costs and lightning-fast West Coast distribution.",
    stat: "Port Adjacent"
  }, {
    icon: TrendingUp,
    title: "Grow Without Growing Pains",
    description: "No minimums. No volume commitments. Whether you're shipping 50 or 5,000+ orders a month, we flex with you.",
    stat: "No Minimums"
  }, {
    icon: CheckCircle,
    title: "99.8% Accuracy (We Obsess Over It)",
    description: "Our fulfillment specialists treat your products like their own. One wrong shipment is one too many.",
    stat: "99.8% Accuracy"
  }, {
    icon: Users,
    title: "A Team That Actually Responds",
    description: "< 2hr response times. Direct access to your account team. No ticket queues, no bots, no ghosting.",
    stat: "< 2hr Response"
  }];
  
  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground mb-6">
              <TranslatedText>Why Growing Brands Fire Their Old 3PL and Switch to Westfield</TranslatedText>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              <TranslatedText>We've heard the horror stories. Missed shipments. Ghost-mode support. Surprise fees. Here's why that doesn't happen here.</TranslatedText>
            </p>

            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-primary"></div>
                <TranslatedText className="text-sm font-semibold text-primary">100+ Brands Trust Us</TranslatedText>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-secondary"></div>
                <TranslatedText className="text-sm font-semibold text-secondary">2M+ Orders Fulfilled this Year</TranslatedText>
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
                  className="group relative bg-card border border-border rounded-xl p-8 hover:border-secondary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Top: Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-full bg-secondary/5 group-hover:bg-secondary/10 flex items-center justify-center transition-all duration-300">
                      <Icon className="w-7 h-7 text-secondary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-secondary transition-colors duration-300">
                    <TranslatedText>{benefit.title}</TranslatedText>
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                    <TranslatedText>{benefit.description}</TranslatedText>
                  </p>

                  {/* Bottom: Stat Badge */}
                  <div className="pt-4 border-t border-border/50">
                    <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-secondary/5 group-hover:bg-secondary/10 transition-colors duration-300">
                      <TranslatedText className="text-xs font-bold text-secondary whitespace-nowrap">
                        {benefit.stat}
                      </TranslatedText>
                    </div>
                  </div>
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
