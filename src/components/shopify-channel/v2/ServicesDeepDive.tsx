import { Package, Palette, Truck, RotateCcw, Camera, Boxes, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TranslatedText } from "@/components/TranslatedText";

const services = [
  {
    icon: Package,
    title: "Pick & Pack Fulfillment",
    description:
      "Every order picked accurately, packed professionally, and shipped same-day when received before 2 PM PT. We handle single items, multi-SKU orders, and complex bundles with equal precision — every unit barcode-scanned against the order before the box closes.",
    link: "/order-fulfillment",
    linkText: "Learn about fulfillment",
  },
  {
    icon: Palette,
    title: "Custom Branding & Kitting",
    description:
      "Branded tissue paper, custom mailer boxes, thank-you cards, promotional inserts, stickers, and gift wrapping. Create memorable unboxing experiences that turn first-time buyers into repeat customers and brand advocates.",
    link: "/kitting-bundling",
    linkText: "See branding options",
  },
  {
    icon: Truck,
    title: "Multi-Carrier Shipping",
    description:
      "Discounted rates across USPS, UPS, FedEx, and regional carriers. We automatically select the best carrier based on destination, weight, and delivery speed — saving you margin on every order without lifting a finger.",
    link: "/pricing",
    linkText: "View shipping rates",
  },
  {
    icon: RotateCcw,
    title: "Returns Management",
    description:
      "Full returns processing including receiving, inspection, quality-control photography, restocking, and inventory updates. Damaged or non-resellable items are flagged the moment they arrive — before they cause customer complaints or chargebacks.",
    link: "/returns-processing",
    linkText: "Returns workflow",
  },
  {
    icon: Camera,
    title: "Photo Quality Control",
    description:
      "Every order photographed before shipping. Every return documented on arrival. A full visual audit trail is accessible through your client dashboard, giving you bulletproof evidence for any dispute and complete confidence in our work.",
    link: "/receiving-inspection",
    linkText: "QC process details",
  },
  {
    icon: Boxes,
    title: "Inventory Storage",
    description:
      "Climate-controlled, secure warehouse space in Los Angeles, CA. Strategic location for fast West Coast delivery and efficient nationwide distribution. No long-term commitments — pay only for the space you actually use, month to month.",
    link: "/storage-warehousing",
    linkText: "Storage options",
  },
];

const ServicesDeepDive = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
            <TranslatedText>Complete service stack</TranslatedText>
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--surface-navy))]">
            <TranslatedText>Every Shopify fulfillment service, under one roof in Los Angeles.</TranslatedText>
          </h2>
          <p className="mt-5 text-lg text-[hsl(var(--surface-navy))]/65 leading-relaxed">
            <TranslatedText>
              From the moment your inventory lands at our Los Angeles warehouse to the second it reaches your customer's
              doorstep, we handle every step. Each service is designed for DTC Shopify brands who care about accuracy,
              speed, and how their unboxing feels.
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
