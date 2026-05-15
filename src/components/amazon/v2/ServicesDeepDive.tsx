import { Tag, Package, Shield, Box, Truck, Camera, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TranslatedText } from "@/components/TranslatedText";

const services = [
  {
    icon: Tag,
    title: "FNSKU Labeling",
    description:
      "Every product gets the correct FNSKU barcode applied precisely where Amazon requires. We handle label printing, application, and scan verification — preventing commingling, mis-receipts, and the slow chargebacks that follow them.",
    link: "/labeling-compliance",
    linkText: "Labeling compliance",
  },
  {
    icon: Package,
    title: "Polybagging & Suffocation Labels",
    description:
      "Transparent polybags sized to the product and printed with FBA-compliant suffocation warnings. Clean, professional presentation that meets every poly bag requirement Amazon publishes — checked at QC before pack-out.",
    link: "/amazon-fba-prep",
    linkText: "FBA prep services",
  },
  {
    icon: Shield,
    title: "Bubble Wrap & Fragile Prep",
    description:
      "Fragile items get bubble wrap, foam, edge protection, or void-fill per Amazon's fragile handling guidelines. The goal is zero damage claims and zero customer complaints — and we obsess over it on every unit.",
    link: "/amazon-fba-prep",
    linkText: "Fragile handling",
  },
  {
    icon: Box,
    title: "Carton & Box Prep",
    description:
      "Proper carton packing with correct content labels, weight limits, and mixed-SKU organization. Every box meets Amazon's inbound shipment plan requirements so your inventory checks in on schedule, not on hold.",
    link: "/amazon-fba-prep",
    linkText: "Carton standards",
  },
  {
    icon: Truck,
    title: "LTL & Pallet Forwarding",
    description:
      "For larger shipments we build pallets to Amazon's LTL/FTL specifications. Proper stacking, banding, shrink-wrap, BOL generation, and carrier scheduling — all from a Los Angeles, CA dock that's ready for OTR pickup daily.",
    link: "/storage-warehousing",
    linkText: "LTL forwarding",
  },
  {
    icon: Camera,
    title: "Photo-Proof QC",
    description:
      "Every shipment is photographed before it leaves our facility. Visual proof of unit condition, label placement, and box contents — the documentation you need to win a chargeback dispute weeks after the fact.",
    link: "/receiving-inspection",
    linkText: "QC documentation",
  },
];

const ServicesDeepDive = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
            <TranslatedText>Complete prep service stack</TranslatedText>
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--surface-navy))]">
            <TranslatedText>Every Amazon FBA prep service Amazon requires, with photo proof.</TranslatedText>
          </h2>
          <p className="mt-5 text-lg text-[hsl(var(--surface-navy))]/65 leading-relaxed">
            <TranslatedText>
              From inbound receiving to LTL pickup, we handle every step of the FBA prep process. Your inventory
              arrives at the Amazon FC ready to sell, with zero compliance issues, zero suppressed listings, and a
              full audit trail you can pull up in seconds.
            </TranslatedText>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group rounded-3xl border border-black/5 bg-white p-7 md:p-8 shadow-[0_20px_60px_-30px_hsl(var(--surface-navy)/0.25)] hover:shadow-[0_30px_80px_-30px_hsl(var(--surface-navy)/0.45)] transition-shadow"
            >
              <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--surface-navy))] flex items-center justify-center mb-5">
                <s.icon className="h-6 w-6 text-[hsl(var(--orange-glow))]" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[hsl(var(--surface-navy))]">
                <TranslatedText>{s.title}</TranslatedText>
              </h3>
              <p className="mt-3 text-sm text-[hsl(var(--surface-navy))]/70 leading-relaxed">
                <TranslatedText>{s.description}</TranslatedText>
              </p>
              <Link
                to={s.link}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--orange-glow))] hover:gap-2.5 transition-all"
              >
                <TranslatedText>{s.linkText}</TranslatedText>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesDeepDive;
