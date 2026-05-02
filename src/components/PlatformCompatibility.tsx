import { useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Store, Music, Package, Building2, Palette, Zap, ArrowRight } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const PlatformCompatibility = () => {
  const navigate = useNavigate();

  const platforms = [
    { name: "Shopify", icon: ShoppingBag },
    { name: "Amazon", icon: Package },
    { name: "WooCommerce", icon: ShoppingCart },
    { name: "TikTok Shop", icon: Music },
    { name: "BigCommerce", icon: Store },
    { name: "Walmart", icon: Building2 },
    { name: "Etsy", icon: Palette },
    { name: "eBay", icon: Store },
  ];

  // Duplicate for seamless marquee loop
  const marqueeRow = [...platforms, ...platforms];

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-3xl">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-secondary">
            Integrations · API-first
          </span>
          <h2 className="mt-3 text-4xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight">
            <TranslatedText>Plays nicely with</TranslatedText>{" "}
            <span className="font-display italic font-normal text-secondary">
              <TranslatedText>everything you sell on.</TranslatedText>
            </span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            <TranslatedText>
              Connect your store in minutes. Orders flow automatically, inventory syncs in real-time.
            </TranslatedText>
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        <div className="group flex overflow-hidden py-6">
          <div className="flex shrink-0 animate-marquee gap-6 group-hover:[animation-play-state:paused]">
            {marqueeRow.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-7 py-5 rounded-2xl bg-muted border border-border min-w-[220px] hover:border-secondary/40 hover:bg-background transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center ring-1 ring-border">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-primary text-lg">{p.name}</div>
                    <div className="text-xs text-secondary font-bold uppercase tracking-wider">
                      <TranslatedText>Native sync</TranslatedText>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom callout band */}
      <div className="container mx-auto px-4 mt-14">
        <div className="max-w-6xl mx-auto rounded-3xl bg-primary text-primary-foreground p-10 md:p-14 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, hsl(var(--secondary)), transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative grid md:grid-cols-[1.2fr_auto] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">
                <Zap className="w-3 h-3 text-secondary" />
                <TranslatedText>API · Webhook · Real-time</TranslatedText>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                <TranslatedText>Selling on multiple channels?</TranslatedText>
              </h3>
              <p className="text-white/80 text-lg max-w-2xl">
                <TranslatedText>
                  We manage your inventory centrally so you never oversell and always ship fast.
                </TranslatedText>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/sales-channels")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold transition-colors"
              >
                <TranslatedText>See platforms</TranslatedText>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/integrations")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-primary font-bold transition-colors"
              >
                <TranslatedText>View API</TranslatedText>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformCompatibility;
