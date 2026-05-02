import { useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Store, Music, Package, Building2, Palette, Code, Zap } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import { WcuSectionHeading } from "./wcu/WcuPrimitives";

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
    <div className="group relative bg-white rounded-2xl p-6 border border-[hsl(var(--wcu-line))] hover:-translate-y-1 transition-all shadow-[0_3px_0_0_hsl(var(--wcu-line))] hover:shadow-[0_20px_40px_-15px_hsl(var(--wcu-sunset)/0.3)] flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--wcu-peach))] flex items-center justify-center mb-3 group-hover:rotate-[-6deg] transition-transform">
        <Icon className="w-8 h-8 text-[hsl(var(--wcu-sunset-deep))]" />
      </div>
      <div className="font-bold text-[hsl(var(--wcu-ink))]">{name}</div>
      <div className="text-xs font-semibold text-[hsl(var(--wcu-sunset-deep))] mt-1">
        <TranslatedText>{strength}</TranslatedText>
      </div>
    </div>
  );

  return (
    <section className="relative py-24" style={{ background: "hsl(var(--wcu-linen))" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <WcuSectionHeading
            eyebrow="Integrations"
            title={<TranslatedText>Plays Nicely With Every Platform You Sell On</TranslatedText>}
            subtitle={<TranslatedText>Connect your store in minutes. Orders flow automatically to our warehouse for fast, accurate fulfillment.</TranslatedText>}
          />

          {/* Peach "shelf" */}
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-5 text-[hsl(var(--wcu-ink))] text-center">
              <TranslatedText>E-Commerce Platforms</TranslatedText>
            </h3>
            <div
              className="rounded-[28px] p-6 border border-[hsl(var(--wcu-line))]"
              style={{ background: "hsl(var(--wcu-cream))", outline: "1.5px dashed hsl(var(--wcu-peach-deep))", outlineOffset: "-8px" }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ecommercePlatforms.map((p, i) => <PlatformTile key={i} {...p} />)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-5 text-[hsl(var(--wcu-ink))] text-center">
              <TranslatedText>Marketplaces</TranslatedText>
            </h3>
            <div
              className="rounded-[28px] p-6 border border-[hsl(var(--wcu-line))]"
              style={{ background: "hsl(var(--wcu-cream))", outline: "1.5px dashed hsl(var(--wcu-peach-deep))", outlineOffset: "-8px" }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {marketplaces.map((p, i) => <PlatformTile key={i} {...p} />)}
                <button onClick={() => navigate("/integrations")} className="group relative bg-white rounded-2xl p-6 border-2 border-dashed border-[hsl(var(--wcu-sunset)/0.5)] hover:border-[hsl(var(--wcu-sunset))] hover:-translate-y-1 transition-all flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--wcu-peach))] flex items-center justify-center mb-3">
                    <Code className="w-8 h-8 text-[hsl(var(--wcu-sunset-deep))]" />
                  </div>
                  <div className="font-bold text-[hsl(var(--wcu-ink))]">
                    <TranslatedText>Many More</TranslatedText>
                  </div>
                  <div className="text-xs font-semibold text-[hsl(var(--wcu-sunset-deep))] mt-1">
                    <TranslatedText>View All</TranslatedText> →
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[hsl(var(--wcu-line))] mb-8 shadow-sm">
              <Zap className="w-4 h-4 text-[hsl(var(--wcu-sunset-deep))]" />
              <span className="text-sm font-semibold text-[hsl(var(--wcu-ink))]">
                <TranslatedText>API-First • Webhook-Enabled • Real-Time Sync</TranslatedText>
              </span>
            </div>
          </div>

          <div
            className="rounded-[28px] p-10 md:p-14 text-center border border-[hsl(var(--wcu-line))]"
            style={{ background: "linear-gradient(135deg, hsl(var(--wcu-peach)), hsl(var(--wcu-cream)))", outline: "1.5px dashed hsl(var(--wcu-peach-deep))", outlineOffset: "-10px" }}
          >
            <h3 className="text-3xl font-bold mb-4 text-[hsl(var(--wcu-ink))]">
              <TranslatedText>Selling on Multiple Channels?</TranslatedText>
            </h3>
            <p className="text-lg text-[hsl(var(--wcu-ink-soft))] mb-6 max-w-2xl mx-auto">
              <TranslatedText>We manage your inventory centrally so you never oversell and always ship fast. Connect your tech stack in minutes.</TranslatedText>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => navigate("/sales-channels")} className="px-7 py-3 rounded-full bg-[hsl(var(--wcu-sunset))] hover:bg-[hsl(var(--wcu-sunset-deep))] text-white font-bold transition-colors">
                <TranslatedText>See All Platforms</TranslatedText> →
              </button>
              <button onClick={() => navigate("/integrations")} className="px-7 py-3 rounded-full bg-transparent border-2 border-[hsl(var(--wcu-ink))] text-[hsl(var(--wcu-ink))] hover:bg-[hsl(var(--wcu-ink))] hover:text-[hsl(var(--wcu-linen))] font-bold transition-colors">
                <TranslatedText>View Integrations & API</TranslatedText> →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformCompatibility;
