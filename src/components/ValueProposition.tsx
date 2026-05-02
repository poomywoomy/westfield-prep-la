import { Package, DollarSign, MapPin, TrendingUp, CheckCircle, Users } from "lucide-react";
import { TranslatedText } from "./TranslatedText";
import { SectionHeading, IconBadge } from "./home/HomePrimitives";

const ValueProposition = () => {
  const benefits = [
    { icon: Package, title: "Speed That Keeps Customers Happy", description: "Your orders ship same-day. Same-day receiving means your inventory is live and selling faster.", stat: "Same-Day" },
    { icon: DollarSign, title: "No 'Gotcha' Invoices", description: "You'll know exactly what you're paying before you sign. No hidden fees, no surprise charges, no fine print.", stat: "Zero Hidden Fees" },
    { icon: MapPin, title: "The LA Advantage", description: "Minutes from the Port of LA means lower import costs and lightning-fast West Coast distribution.", stat: "Port Adjacent" },
    { icon: TrendingUp, title: "Grow Without Growing Pains", description: "No minimums. No volume commitments. Whether you're shipping 50 or 5,000+ orders a month, we flex with you.", stat: "No Minimums" },
    { icon: CheckCircle, title: "99.8% Accuracy (We Obsess Over It)", description: "Our fulfillment specialists treat your products like their own. One wrong shipment is one too many.", stat: "99.8% Accuracy" },
    { icon: Users, title: "A Team That Actually Responds", description: "< 2hr response times. Direct access to your account team. No ticket queues, no bots, no ghosting.", stat: "< 2hr Response" },
  ];

  return (
    <section className="relative py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Why Switch"
            title={<TranslatedText>Why Growing Brands Fire Their Old 3PL and Switch to Westfield</TranslatedText>}
            subtitle={<TranslatedText>We've heard the horror stories. Missed shipments. Ghost-mode support. Surprise fees. Here's why that doesn't happen here.</TranslatedText>}
          />

          <div className="flex items-center justify-center gap-8 mb-12 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <TranslatedText className="text-sm font-bold text-primary">100+ Brands Trust Us</TranslatedText>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-secondary rounded-full" />
              <TranslatedText className="text-sm font-bold text-secondary">2M+ Orders Fulfilled this Year</TranslatedText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-background rounded-2xl p-7 border border-border hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl"
                >
                  <IconBadge size="lg">
                    <Icon className="w-7 h-7" />
                  </IconBadge>
                  <h3 className="text-lg font-bold mt-5 mb-3 text-primary tracking-tight">
                    <TranslatedText>{benefit.title}</TranslatedText>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-5">
                    <TranslatedText>{benefit.description}</TranslatedText>
                  </p>
                  <div className="pt-4 border-t border-border">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                      <TranslatedText>{benefit.stat}</TranslatedText>
                    </span>
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
