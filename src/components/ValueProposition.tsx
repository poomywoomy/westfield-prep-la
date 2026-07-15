import { Package, DollarSign, MapPin, TrendingUp, CheckCircle, Users } from "lucide-react";
import { TranslatedText } from "./TranslatedText";

const ValueProposition = () => {
  // Hero benefit (large card)
  const hero = {
    icon: Package,
    title: "Speed that keeps customers happy.",
    description:
      "Your orders ship same-day. Same-day receiving means your inventory is live and selling faster — not sitting on a dock for a week. We've built the systems, the team, and the LA-port-adjacent location to make every hour count.",
    stat: "Same-Day",
    statLabel: "processing & shipping",
  };

  const small = [
    { icon: DollarSign, title: "No 'gotcha' invoices", description: "Know exactly what you'll pay before you sign. Zero hidden fees.", stat: "0", statLabel: "Hidden fees" },
    { icon: MapPin, title: "The LA advantage", description: "Minutes from the Port of LA — lower import costs, faster West Coast.", stat: "22mi", statLabel: "To Port of LA" },
    { icon: TrendingUp, title: "Built for scaling brands", description: "Purpose-built for brands shipping 1,000+ orders/month, scaling to 50,000+.", stat: "1,000+", statLabel: "Orders/mo sweet spot" },
    { icon: CheckCircle, title: "99.8% accuracy, obsessively", description: "Our specialists treat your products like their own. One mis-ship is one too many.", stat: "99.8%", statLabel: "Accuracy" },
    { icon: Users, title: "A team that responds", description: "Direct access to your account team. No ticket queues. No bots. No ghosting.", stat: "<2hr", statLabel: "Response time" },
  ];

  return (
    <section className="relative py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* LEFT-aligned heading */}
          <div className="grid lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-secondary">
                Why switch
              </span>
              <h2 className="mt-3 text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-[0.95] tracking-tight">
                <TranslatedText>Why brands fire</TranslatedText>
                <br />
                <TranslatedText>their old 3PL and</TranslatedText>{" "}
                <span className="font-display italic font-normal text-secondary">
                  <TranslatedText>switch.</TranslatedText>
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                <TranslatedText>
                  Missed shipments. Ghost-mode support. Surprise fees. We've heard the horror stories — and engineered the fix.
                </TranslatedText>
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-10 bg-primary rounded-full" />
                  <span className="text-sm font-bold text-primary">100+ Brands</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-10 bg-secondary rounded-full" />
                  <span className="text-sm font-bold text-secondary">2M+ Orders / yr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Asymmetric grid — 1 hero + 5 small in masonry */}
          <div className="grid lg:grid-cols-12 gap-5">
            {/* Hero card spans large */}
            <div className="lg:col-span-7 lg:row-span-2 relative rounded-3xl bg-primary text-primary-foreground p-10 md:p-12 overflow-hidden flex flex-col justify-between min-h-[420px]">
              <div
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30 blur-3xl"
                style={{ background: "hsl(var(--secondary))" }}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center mb-6">
                  <hero.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-5">
                  <TranslatedText>{hero.title}</TranslatedText>
                </h3>
                <p className="text-lg text-white/80 leading-relaxed max-w-lg">
                  <TranslatedText>{hero.description}</TranslatedText>
                </p>
              </div>
              <div className="relative mt-8 flex items-end justify-between gap-6">
                <div>
                  <div className="font-display italic text-7xl md:text-8xl text-secondary leading-none">
                    {hero.stat}
                  </div>
                  <div className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-white/70">
                    <TranslatedText>{hero.statLabel}</TranslatedText>
                  </div>
                </div>
              </div>
            </div>

            {/* Small cards — varied styles */}
            {small.map((b, i) => {
              const Icon = b.icon;
              // Mix styles: solid white / outlined / orange-accented
              const variants = [
                "bg-background border border-border shadow-sm",
                "bg-muted border border-border",
                "bg-background border-t-4 border-t-secondary border-x border-b border-border shadow-sm",
                "bg-background border border-border shadow-sm",
                "bg-muted border border-border",
              ];
              return (
                <div
                  key={i}
                  className={`lg:col-span-5 rounded-2xl p-7 hover:-translate-y-0.5 transition-all ${variants[i]}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary tracking-tight mb-1">
                        <TranslatedText>{b.title}</TranslatedText>
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <TranslatedText>{b.description}</TranslatedText>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display italic text-3xl text-secondary leading-none">
                        {b.stat}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                        <TranslatedText>{b.statLabel}</TranslatedText>
                      </div>
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
