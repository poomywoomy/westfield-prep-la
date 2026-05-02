import { useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Store, Music, Package, Building2, Palette, Code, Zap } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import { SectionHeading } from "./home/HomePrimitives";

const PlatformCompatibility = () => {
  const navigate = useNavigate();

  const ecommercePlatforms = [
    { name: "Shopify", icon: ShoppingBag, strength: "Primary Integration" },
    { name: "WooCommerce", icon: ShoppingCart, strength: "Full Support" },
    { name: "BigCommerce", icon: Store, strength: "Full Support" },
    { name: "TikTok Shop", icon: Music, strength: "Growing Platform" },
  ];

  const marketplaces = [
    { name: "Amazon", icon: Package, strength: "FBA Specialist" },
    { name: "Walmart", icon: Building2, strength: "Full Integration" },
    { name: "Etsy", icon: Palette, strength: "Handmade Focus" },
  ];

  const PlatformTile = ({ name, icon: Icon, strength }: { name: string; icon: any; strength: string }) => (
    <div className="group bg-background rounded-xl p-6 border border-border hover:border-secondary/40 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mb-3 ring-1 ring-primary/10 group-hover:ring-secondary/30 transition">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <div className="font-bold text-primary">{name}</div>
      <div className="text-xs font-semibold text-secondary mt-1">
        <TranslatedText>{strength}</TranslatedText>
      </div>
    </div>
  );

  return (
    <section className="relative py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Integrations"
            title={<TranslatedText>Plays Nicely With Every Platform You Sell On</TranslatedText>}
            subtitle={<TranslatedText>Connect your store in minutes. Orders flow automatically to our warehouse for fast, accurate fulfillment.</TranslatedText>}
          />

          <div className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] mb-5 text-secondary text-center">
              <TranslatedText>E-Commerce Platforms</TranslatedText>
            </h3>
            <div className="rounded-2xl p-6 bg-background border border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ecommercePlatforms.map((p, i) => <PlatformTile key={i} {...p} />)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] mb-5 text-secondary text-center">
              <TranslatedText>Marketplaces</TranslatedText>
            </h3>
            <div className="rounded-2xl p-6 bg-background border border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {marketplaces.map((p, i) => <PlatformTile key={i} {...p} />)}
                <button onClick={() => navigate("/integrations")} className="group bg-background rounded-xl p-6 border-2 border-dashed border-border hover:border-secondary hover:-translate-y-1 transition-all flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                    <Code className="w-7 h-7 text-secondary" />
                  </div>
                  <div className="font-bold text-primary">
                    <TranslatedText>Many More</TranslatedText>
                  </div>
                  <div className="text-xs font-semibold text-secondary mt-1">
                    <TranslatedText>View All</TranslatedText> →
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm mb-8">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-primary">
                <TranslatedText>API-First • Webhook-Enabled • Real-Time Sync</TranslatedText>
              </span>
            </div>
          </div>

          <div className="rounded-2xl p-10 md:p-14 text-center bg-primary text-primary-foreground relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, hsl(var(--secondary)), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <h3 className="text-3xl font-bold mb-4 tracking-tight">
                <TranslatedText>Selling on Multiple Channels?</TranslatedText>
              </h3>
              <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
                <TranslatedText>We manage your inventory centrally so you never oversell and always ship fast. Connect your tech stack in minutes.</TranslatedText>
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => navigate("/sales-channels")} className="px-7 py-3 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold transition-colors">
                  <TranslatedText>See All Platforms</TranslatedText> →
                </button>
                <button onClick={() => navigate("/integrations")} className="px-7 py-3 rounded-full bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-primary font-bold transition-colors">
                  <TranslatedText>View Integrations & API</TranslatedText> →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformCompatibility;
