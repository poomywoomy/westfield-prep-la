import { motion } from "framer-motion";
import { TranslatedText } from "@/components/TranslatedText";
import labelImg from "@/assets/amazon-v2/labeling.jpg";
import polyImg from "@/assets/amazon-v2/polybagging.jpg";
import cartonImg from "@/assets/amazon-v2/carton-pallet.jpg";
import qcImg from "@/assets/amazon-v2/qc-documentation.jpg";
import ltlImg from "@/assets/amazon-v2/ltl-dock.jpg";

const steps = [
  { n: "01", t: "Receive inventory", d: "Inbound checked against your ASN, photo documented for receiving.", img: labelImg },
  { n: "02", t: "Prep & label", d: "FNSKU, polybag, bubble wrap, expiration & lot labeling per Amazon spec.", img: polyImg },
  { n: "03", t: "Carton & pallet", d: "Case-packed per shipment plan. Banded onto compliant pallets.", img: cartonImg },
  { n: "04", t: "Photo QC", d: "Every prep step photographed for chargeback-proof documentation.", img: qcImg },
  { n: "05", t: "Ship to Amazon", d: "LTL forwarded with BOL, tracking, and proof of delivery.", img: ltlImg },
];

const ProcessTimeline = () => {
  return (
    <section className="py-24 md:py-32 bg-[hsl(var(--surface-navy))] text-white relative overflow-hidden">
      <div className="absolute inset-0 bento-grid-faint opacity-50 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
            <TranslatedText>Process</TranslatedText>
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            <TranslatedText>Five steps from receiving dock to Amazon FC.</TranslatedText>
          </h2>
        </div>
        <div className="space-y-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              className="grid md:grid-cols-12 gap-4 items-stretch rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden"
            >
              <div className="md:col-span-4 aspect-[16/9] md:aspect-auto md:min-h-[200px] relative">
                <img src={s.img} alt={s.t} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90" />
              </div>
              <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-center">
                <div className="text-[hsl(var(--orange-glow))] font-bold text-sm tracking-wider">{s.n}</div>
                <h3 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight"><TranslatedText>{s.t}</TranslatedText></h3>
                <p className="mt-2 text-white/65 max-w-2xl"><TranslatedText>{s.d}</TranslatedText></p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
