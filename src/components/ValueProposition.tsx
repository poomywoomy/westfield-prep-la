import { Package, DollarSign, MapPin, TrendingUp, CheckCircle, Users } from "lucide-react";
import { TranslatedText } from "./TranslatedText";
import { WcuSectionHeading } from "./wcu/WcuPrimitives";

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
    <section className="relative py-24" style={{ background: "hsl(var(--wcu-cream))" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <WcuSectionHeading
            eyebrow="Why Switch"
            title={<TranslatedText>Why Growing Brands Fire Their Old 3PL and Switch to Westfield</TranslatedText>}
            subtitle={<TranslatedText>We've heard the horror stories. Missed shipments. Ghost-mode support. Surprise fees. Here's why that doesn't happen here.</TranslatedText>}
          />

          <div className="flex items-center justify-center gap-8 mb-12 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-[hsl(var(--wcu-ink))]" />
              <TranslatedText className="text-sm font-bold text-[hsl(var(--wcu-ink))]">100+ Brands Trust Us</TranslatedText>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-[hsl(var(--wcu-sunset))]" />
              <TranslatedText className="text-sm font-bold text-[hsl(var(--wcu-sunset-deep))]">2M+ Orders Fulfilled this Year</TranslatedText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-7 border border-[hsl(var(--wcu-line))] hover:-translate-y-1 transition-all duration-300 shadow-[0_3px_0_0_hsl(var(--wcu-line))] hover:shadow-[0_20px_40px_-15px_hsl(var(--wcu-sunset)/0.3)]"
                >
                  <div className="mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--wcu-peach))] flex items-center justify-center group-hover:rotate-[-6deg] transition-transform">
                      <Icon className="w-7 h-7 text-[hsl(var(--wcu-sunset-deep))]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-[hsl(var(--wcu-ink))]">
                    <TranslatedText>{benefit.title}</TranslatedText>
                  </h3>
                  <p className="text-[hsl(var(--wcu-ink-soft))] leading-relaxed text-sm mb-5">
                    <TranslatedText>{benefit.description}</TranslatedText>
                  </p>
                  <div className="pt-4 border-t border-dashed border-[hsl(var(--wcu-line))]">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[hsl(var(--wcu-peach))] text-xs font-bold text-[hsl(var(--wcu-sunset-deep))]">
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
