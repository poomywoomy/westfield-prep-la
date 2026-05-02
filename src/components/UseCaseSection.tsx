import { Link } from "react-router-dom";
import { ShoppingCart, Package, Layers, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { TranslatedText } from "@/components/TranslatedText";
import { WcuSectionHeading, SunburstStamp } from "@/components/wcu/WcuPrimitives";

const personas = [
  {
    id: "shopify",
    icon: ShoppingCart,
    title: "Shopify DTC Brand",
    headline: "Fast, reliable pick-pack",
    description: "Same-day shipping, custom branding, native Shopify sync. Perfect for direct-to-consumer brands scaling fast.",
    link: "/shopify-fulfillment",
    features: ["Same-day processing", "Custom packaging", "Real-time sync"],
  },
  {
    id: "amazon",
    icon: Package,
    title: "Amazon FBA Seller",
    headline: "Compliant FBA prep",
    description: "FNSKU labeling, polybag, bundling, shipment creation. Get your inventory Amazon-ready in 24 hours.",
    link: "/amazon-fba-prep",
    features: ["FNSKU labeling", "Bundling & kitting", "24hr turnaround"],
  },
  {
    id: "hybrid",
    icon: Layers,
    title: "Hybrid Seller",
    headline: "DTC + Marketplace unified",
    description: "One inventory, multiple channels, single dashboard. Shopify + Amazon + Walmart under one roof.",
    link: "/pricing",
    features: ["Multi-channel sync", "Single inventory", "Unified dashboard"],
  },
];

const UseCaseSection = () => {
  const handleCardClick = (id: string) => trackEvent("use_case_selected", { persona: id });

  return (
    <section className="relative py-24" style={{ background: "hsl(var(--wcu-linen))" }}>
      <div className="container mx-auto px-4">
        <WcuSectionHeading
          eyebrow="Built For Your Business"
          title={<TranslatedText>Which seller are you?</TranslatedText>}
          subtitle={<TranslatedText>We've optimized our services for each selling channel. Find your fit.</TranslatedText>}
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {personas.map((persona, index) => (
            <Link
              key={persona.id}
              to={persona.link}
              onClick={() => handleCardClick(persona.id)}
              className="group block h-full"
            >
              <div
                className="relative h-full p-7 rounded-[28px] bg-white border border-[hsl(var(--wcu-line))] hover:-translate-y-1.5 transition-all duration-300 shadow-[0_4px_0_0_hsl(var(--wcu-line))] hover:shadow-[0_30px_60px_-20px_hsl(var(--wcu-sunset)/0.35)]"
                style={{ outline: "1.5px dashed hsl(var(--wcu-peach-deep))", outlineOffset: "-8px" }}
              >
                {/* polaroid corner stamp */}
                <div className="absolute -top-4 -right-4">
                  <SunburstStamp size={48} />
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--wcu-peach))] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <persona.icon className="w-7 h-7 text-[hsl(var(--wcu-sunset-deep))]" />
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--wcu-sunset-deep))] mb-2">
                  <TranslatedText>{persona.title}</TranslatedText>
                </p>
                <h3 className="text-2xl font-bold text-[hsl(var(--wcu-ink))] mb-3">
                  <TranslatedText>{persona.headline}</TranslatedText>
                </h3>
                <p className="text-[hsl(var(--wcu-ink-soft))] text-sm leading-relaxed mb-5">
                  <TranslatedText>{persona.description}</TranslatedText>
                </p>

                <ul className="space-y-2 mb-6 pt-5 border-t border-dashed border-[hsl(var(--wcu-line))]">
                  {persona.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[hsl(var(--wcu-ink))]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--wcu-sunset))]" />
                      <TranslatedText>{feature}</TranslatedText>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-[hsl(var(--wcu-sunset-deep))] font-bold text-sm group-hover:gap-3 transition-all">
                  <TranslatedText>Learn more</TranslatedText>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
