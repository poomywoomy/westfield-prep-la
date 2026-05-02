import { Zap, Clock, Globe, Building2, Users, Warehouse, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TranslatedText } from "./TranslatedText";

const services = [
  { icon: Zap, title: "Same-Day Shipping", short: "Order at 10am? Shipped by 3pm. The Westfield difference.", bestFor: ["DTC", "High-volume"], link: "/order-fulfillment", featured: true },
  { icon: Clock, title: "Same-Day Check-Ins", short: "Inventory checked in, photographed, and ready to sell within 24 hours.", bestFor: ["Launches", "Restocks"], link: "/receiving-inspection" },
  { icon: Globe, title: "International", short: "Customs handled. Worldwide delivery without the headaches.", bestFor: ["Global"], link: "/order-fulfillment" },
  { icon: Building2, title: "B2B Fulfillment", short: "Pallets, wholesale, retail compliance. We speak B2B fluently.", bestFor: ["Wholesale", "Retail"], link: "/order-fulfillment" },
  { icon: Users, title: "DTC Fulfillment", short: "Custom inserts, tissue, thank-you cards. Instagram-worthy unboxings.", bestFor: ["Luxury", "Subscription"], link: "/shopify-fulfillment" },
  { icon: Warehouse, title: "Storage & Warehousing", short: "Flexible terms. No long-term contracts. Pay for what you use.", bestFor: ["Seasonal", "Overflow"], link: "/storage-warehousing" },
];

const Services = () => {
  const navigate = useNavigate();
  const [featured, ...rest] = services;
  const FeatureIcon = featured.icon;

  return (
    <section
      id="services"
      className="relative py-28"
      style={{
        background:
          "linear-gradient(180deg, #F4F2ED 0%, hsl(var(--background)) 100%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Right-aligned heading for variety */}
          <div className="grid lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-secondary">
                What we do · 06 services
              </span>
            </div>
            <div className="lg:col-span-7">
              <h2 className="text-4xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight">
                <TranslatedText>Every fulfillment</TranslatedText>
                <br />
                <span className="font-display italic font-normal text-secondary">
                  <TranslatedText>scenario, covered.</TranslatedText>
                </span>
              </h2>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                <TranslatedText>
                  From your first 50 orders to full-scale multi-channel distribution — the playbook is built.
                </TranslatedText>
              </p>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Featured tall hero card spanning 2 rows */}
            <div
              onClick={() => navigate(featured.link)}
              className="lg:row-span-2 cursor-pointer group relative rounded-3xl bg-primary text-primary-foreground p-10 overflow-hidden hover:-translate-y-1 transition-all min-h-[440px] flex flex-col justify-between"
            >
              <div
                className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl"
                style={{ background: "hsl(var(--secondary))" }}
                aria-hidden="true"
              />
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">
                  01 / Flagship
                </span>
                <div className="mt-4 w-20 h-20 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                  <FeatureIcon className="w-10 h-10 text-secondary" strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                  <TranslatedText>{featured.title}</TranslatedText>
                </h3>
                <p className="mt-4 text-lg text-white/80 leading-relaxed max-w-md">
                  <TranslatedText>{featured.short}</TranslatedText>
                </p>
              </div>
              <div className="relative flex items-center justify-between mt-8">
                <div className="flex flex-wrap gap-1.5">
                  {featured.bestFor.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider"
                    >
                      <TranslatedText>{b}</TranslatedText>
                    </span>
                  ))}
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Small cards in mosaic */}
            {rest.map((s, i) => {
              const Icon = s.icon;
              // Distinct icon background colors from controlled palette
              const iconBgs = [
                "bg-secondary/15 text-secondary",
                "bg-primary/10 text-primary",
                "bg-secondary/15 text-secondary",
                "bg-primary/10 text-primary",
                "bg-secondary/15 text-secondary",
              ];
              return (
                <div
                  key={i}
                  onClick={() => navigate(s.link)}
                  className="cursor-pointer group relative rounded-2xl bg-background border border-border p-7 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgs[i]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-display italic text-2xl text-primary/20">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary tracking-tight mb-2">
                    <TranslatedText>{s.title}</TranslatedText>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    <TranslatedText>{s.short}</TranslatedText>
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-1">
                      {s.bestFor.map((b, j) => (
                        <span
                          key={j}
                          className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                        >
                          {b}
                          {j < s.bestFor.length - 1 && <span className="ml-1">·</span>}
                        </span>
                      ))}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
              <TranslatedText>Explore all services</TranslatedText>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
