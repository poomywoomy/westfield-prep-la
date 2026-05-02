import { Shield, FileCheck, Award, Flame, Lock, Leaf } from "lucide-react";
import { TranslatedText } from "./TranslatedText";
import { SectionHeading, IconBadge } from "./home/HomePrimitives";

const items = [
  { icon: Shield, title: "Fully Insured Operations", desc: "General Liability and Warehouse Legal Liability coverage provides complete peace of mind for your inventory. Your products are protected from receiving through shipping.", tags: ["General Liability", "WLL Coverage"] },
  { icon: FileCheck, title: "Multi-Platform Compliant", desc: "All prep meets Amazon, Walmart, and Shopify requirements: polybag suffocation warnings, 50-lb box rule, accurate case labels. We stay current with all marketplace requirements.", tags: ["Amazon FBA", "Walmart WFS", "Shopify"] },
  { icon: Award, title: "Quality Assurance", desc: "Rigorous inspection processes and photo documentation for every order. Each shipment is verified against ASNs with timestamped quality control photos for full transparency and accountability.", tags: ["Photo QC", "ASN Verification"] },
  { icon: Flame, title: "Advanced Security Systems", desc: "24/7 monitoring, fire suppression, and comprehensive theft prevention protocols. Our facility features state-of-the-art security cameras, restricted access zones, and automated fire detection systems.", tags: ["24/7 Surveillance", "Fire Protection"] },
  { icon: Lock, title: "Data Security & Confidentiality", desc: "Enterprise-grade data protection with encrypted systems and strict confidentiality agreements to safeguard your business information. Your data and intellectual property are always protected.", tags: ["Encrypted Systems", "NDAs Available"] },
  { icon: Leaf, title: "Sustainable Practices", desc: "Eco-friendly operations with recycling programs, energy-efficient facilities, and sustainable packaging materials. We're committed to reducing our environmental impact while maintaining excellence.", tags: ["Recycling Program", "Eco Packaging"] },
];

const Compliance = () => {
  return (
    <section className="relative py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Trust & Safety"
          title={<TranslatedText>Compliance & Safety You Can Trust</TranslatedText>}
          subtitle={<TranslatedText>Your inventory deserves enterprise-grade protection. We've invested in comprehensive insurance, security systems, and sustainable practices to safeguard your business.</TranslatedText>}
        />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <div
                key={i}
                className="group bg-background rounded-2xl p-6 border border-border hover:border-secondary/40 hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl"
              >
                <IconBadge size="lg">
                  <Icon className="w-7 h-7" />
                </IconBadge>
                <h3 className="text-lg font-bold mt-4 mb-2 text-primary tracking-tight">
                  <TranslatedText>{it.title}</TranslatedText>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  <TranslatedText>{it.desc}</TranslatedText>
                </p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                  {it.tags.map((t, j) => (
                    <span key={j} className="px-2.5 py-1 bg-muted text-primary text-[10px] uppercase tracking-wider font-bold rounded-full border border-border">
                      <TranslatedText>{t}</TranslatedText>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Compliance;
