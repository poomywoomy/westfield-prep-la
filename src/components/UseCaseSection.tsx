import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Package, Layers, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const personas = [
  {
    id: "shopify",
    icon: ShoppingCart,
    title: "Shopify DTC Brand",
    headline: "Fast, reliable pick-pack",
    description: "Same-day shipping, custom branding, native Shopify sync. Perfect for direct-to-consumer brands scaling fast.",
    link: "/shopify-fulfillment",
    color: "from-[#5E8E3E]/20 to-[#5E8E3E]/5",
    iconBg: "bg-[#5E8E3E]",
    features: ["Same-day processing", "Custom packaging", "Real-time sync"],
  },
  {
    id: "amazon",
    icon: Package,
    title: "Amazon FBA Seller",
    headline: "Compliant FBA prep",
    description: "FNSKU labeling, polybag, bundling, shipment creation. Get your inventory Amazon-ready in 24 hours.",
    link: "/amazon-fba-prep",
    color: "from-[#FF9900]/20 to-[#FF9900]/5",
    iconBg: "bg-[#FF9900]",
    features: ["FNSKU labeling", "Bundling & kitting", "24hr turnaround"],
  },
  {
    id: "hybrid",
    icon: Layers,
    title: "Hybrid Seller",
    headline: "DTC + Marketplace unified",
    description: "One inventory, multiple channels, single dashboard. Shopify + Amazon + Walmart under one roof.",
    link: "/pricing",
    color: "from-secondary/20 to-secondary/5",
    iconBg: "bg-secondary",
    features: ["Multi-channel sync", "Single inventory", "Unified dashboard"],
  },
];

const UseCaseSection = () => {
  const handleCardClick = (personaId: string) => {
    trackEvent('use_case_selected', { persona: personaId });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
            Built For Your Business
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Which seller are you?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've optimized our services for each selling channel. Find your fit.
          </p>
        </motion.div>

        {/* Persona Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={persona.link}
                onClick={() => handleCardClick(persona.id)}
                className="group block h-full"
              >
                <div className={`relative h-full p-6 lg:p-8 rounded-2xl border border-border bg-gradient-to-br ${persona.color} hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${persona.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <persona.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {persona.title}
                  </h3>
                  <p className="text-xl font-bold text-foreground mb-3">
                    {persona.headline}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {persona.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {persona.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-secondary font-semibold text-sm group-hover:gap-3 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
