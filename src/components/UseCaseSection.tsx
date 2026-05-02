import { Link } from "react-router-dom";
import { ShoppingCart, Package, Layers, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { TranslatedText } from "@/components/TranslatedText";
import { SectionHeading, IconBadge } from "@/components/home/HomePrimitives";

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
    <section className="relative py-24 bg-muted">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Built For Your Business"
          title={<TranslatedText>Which seller are you?</TranslatedText>}
          subtitle={<TranslatedText>We've optimized our services for each selling channel. Find your fit.</TranslatedText>}
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {personas.map((persona) => (
            <Link
              key={persona.id}
              to={persona.link}
              onClick={() => handleCardClick(persona.id)}
              className="group block h-full"
            >
              <div className="relative h-full p-7 rounded-2xl bg-background border border-border hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
                <IconBadge size="lg">
                  <persona.icon className="w-7 h-7" />
                </IconBadge>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary mb-2">
                  <TranslatedText>{persona.title}</TranslatedText>
                </p>
                <h3 className="text-2xl font-bold text-primary mb-3 tracking-tight">
                  <TranslatedText>{persona.headline}</TranslatedText>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  <TranslatedText>{persona.description}</TranslatedText>
                </p>

                <ul className="space-y-2 mb-6 pt-5 border-t border-border">
                  {persona.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <TranslatedText>{feature}</TranslatedText>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-secondary font-bold text-sm group-hover:gap-3 transition-all">
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
