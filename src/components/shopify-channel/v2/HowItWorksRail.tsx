import { motion } from "framer-motion";
import { TranslatedText } from "@/components/TranslatedText";
import dockImg from "@/assets/shopify-v2/dock-shipping.jpg";
import scannerImg from "@/assets/shopify-v2/scanner-sync.jpg";
import unboxingImg from "@/assets/shopify-v2/unboxing.jpg";
import qcImg from "@/assets/shopify-v2/qc-bench.jpg";

const steps = [
  { n: "01", title: "Order lands", desc: "Shopify webhook hits our queue in under 5 seconds. Pick list assigned automatically.", img: scannerImg },
  { n: "02", title: "Pick & QC", desc: "Trained operator scans every unit. Photo captured before the box closes.", img: qcImg },
  { n: "03", title: "Brand & pack", desc: "Custom mailer, tissue, insert, thank-you card — exactly per your spec.", img: unboxingImg },
  { n: "04", title: "Ship same day", desc: "USPS, UPS, FedEx, regional carriers — rate-shopped automatically.", img: dockImg },
];

const HowItWorksRail = () => {
  return (
    <section className="py-24 md:py-32 bg-[hsl(var(--surface-navy))] text-white relative overflow-hidden">
      <div className="absolute inset-0 bento-grid-faint opacity-50 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
            <TranslatedText>How it works</TranslatedText>
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            <TranslatedText>From cart to carrier in four steps.</TranslatedText>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 group-hover:scale-[1.04] transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="text-[hsl(var(--orange-glow))] font-bold text-sm tracking-wider">{s.n}</div>
                <h3 className="mt-2 text-xl font-bold"><TranslatedText>{s.title}</TranslatedText></h3>
                <p className="mt-2 text-sm text-white/65 leading-relaxed"><TranslatedText>{s.desc}</TranslatedText></p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksRail;
