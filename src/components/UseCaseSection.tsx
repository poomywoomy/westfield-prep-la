import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Package, Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { TranslatedText } from "@/components/TranslatedText";

const personas = [
  {
    id: "shopify",
    icon: ShoppingCart,
    label: "Shopify DTC",
    title: "Shopify DTC Brand",
    headline: "Fast, reliable pick-pack.",
    description:
      "Same-day shipping, custom branding, native Shopify sync. Perfect for direct-to-consumer brands scaling fast.",
    link: "/shopify-fulfillment",
    features: ["Same-day processing", "Custom packaging & inserts", "Real-time inventory sync", "QC photo proof"],
    metric: { value: "92%", label: "of orders ship same-day" },
  },
  {
    id: "amazon",
    icon: Package,
    label: "Amazon FBA",
    title: "Amazon FBA Seller",
    headline: "Compliant FBA prep.",
    description:
      "FNSKU labeling, polybag, bundling, shipment creation. Get your inventory Amazon-ready in 24 hours.",
    link: "/amazon-fba-prep",
    features: ["FNSKU labeling", "Bundling & kitting", "24hr turnaround", "Direct ship to FCs"],
    metric: { value: "24hr", label: "Amazon-ready turnaround" },
  },
  {
    id: "hybrid",
    icon: Layers,
    label: "Hybrid",
    title: "Hybrid Seller",
    headline: "DTC + Marketplace, unified.",
    description:
      "One inventory, multiple channels, single dashboard. Shopify + Amazon + Walmart under one roof.",
    link: "/pricing",
    features: ["Multi-channel sync", "Single source of truth", "Unified dashboard", "No double-counting"],
    metric: { value: "1", label: "inventory across all channels" },
  },
];

const UseCaseSection = () => {
  const [active, setActive] = useState("shopify");
  const persona = personas.find((p) => p.id === active)!;
  const Icon = persona.icon;

  const handleSelect = (id: string) => {
    setActive(id);
    trackEvent("use_case_selected", { persona: id });
  };

  return (
    <section className="relative py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-secondary">
              Built for your business
            </span>
            <h2 className="mt-3 text-4xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight">
              <TranslatedText>Which seller</TranslatedText>{" "}
              <span className="font-display italic font-normal text-secondary">
                <TranslatedText>are you?</TranslatedText>
              </span>
            </h2>
          </div>

          {/* Tab selector */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 rounded-full bg-muted border border-border">
              {personas.map((p) => {
                const isActive = p.id === active;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    className={`px-5 md:px-7 py-2.5 rounded-full text-sm font-bold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-primary/60 hover:text-primary"
                    }`}
                  >
                    <TranslatedText>{p.label}</TranslatedText>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Single feature card that swaps */}
          <div
            key={persona.id}
            className="relative grid lg:grid-cols-[1.3fr_1fr] gap-0 rounded-3xl overflow-hidden bg-primary text-primary-foreground shadow-2xl animate-fade-in"
          >
            {/* Left content */}
            <div className="p-10 md:p-14 relative">
              <div
                className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-25 blur-3xl"
                style={{ background: "hsl(var(--secondary))" }}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary mb-5">
                  <Icon className="w-3.5 h-3.5" />
                  <TranslatedText>{persona.title}</TranslatedText>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5">
                  <TranslatedText>{persona.headline}</TranslatedText>
                </h3>
                <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
                  <TranslatedText>{persona.description}</TranslatedText>
                </p>

                <ul className="space-y-3 mb-8">
                  {persona.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/95">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <TranslatedText className="font-medium">{f}</TranslatedText>
                    </li>
                  ))}
                </ul>

                <Link
                  to={persona.link}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold transition-all hover:-translate-y-0.5 group"
                >
                  <TranslatedText>Learn more</TranslatedText>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right metric panel */}
            <div className="relative bg-secondary/10 border-l border-white/10 p-10 md:p-14 flex flex-col justify-center items-center text-center">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-12 h-12 text-secondary" strokeWidth={1.5} />
                </div>
                <div className="text-7xl md:text-8xl font-bold tracking-tight text-white leading-none">
                  {persona.metric.value}
                </div>
                <div className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-white/70 max-w-[200px]">
                  <TranslatedText>{persona.metric.label}</TranslatedText>
                </div>
              </div>
            </div>
          </div>

          {/* Persona indicators below */}
          <div className="mt-8 flex justify-center gap-3">
            {personas.map((p) => {
              const isActive = p.id === active;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={`h-1.5 rounded-full transition-all ${
                    isActive ? "w-12 bg-secondary" : "w-6 bg-border hover:bg-secondary/40"
                  }`}
                  aria-label={`View ${p.label}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
