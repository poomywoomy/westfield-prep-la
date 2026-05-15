import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import portImg from "@/assets/shopify-v2/port-la.jpg";

const CaseStudySpotlight = () => {
  return (
    <section className="py-24 md:py-32 bg-[hsl(var(--surface-navy))] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-white/10"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[320px] lg:min-h-[520px]">
              <img src={portImg} alt="Port of Los Angeles at dusk with shipping cranes" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--surface-navy))]/30 to-[hsl(var(--surface-navy))]/80 lg:bg-gradient-to-r lg:from-transparent lg:to-[hsl(var(--surface-navy))]" />
              <div className="absolute bottom-6 left-6 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-bold tracking-[0.18em] uppercase">
                <TranslatedText>LA Port advantage</TranslatedText>
              </div>
            </div>
            <div className="p-8 md:p-14 bg-[hsl(var(--surface-navy))]">
              <Quote className="h-8 w-8 text-[hsl(var(--orange-glow))]" />
              <p className="mt-5 text-2xl md:text-3xl font-medium leading-snug tracking-tight">
                <TranslatedText>
                  "We moved 4,200 orders during a 36-hour BFCM window. Every order had a QC photo. Zero misships. We finally trust our 3PL."
                </TranslatedText>
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(var(--orange-glow))] to-orange-700" />
                <div>
                  <div className="text-sm font-semibold">DTC Apparel Brand</div>
                  <div className="text-xs text-white/55">$8M ARR · Shopify Plus</div>
                </div>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  { v: "4,200", l: "BFCM orders" },
                  { v: "0", l: "Misships" },
                  { v: "100%", l: "QC coverage" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-3xl font-bold tracking-tight">{s.v}</div>
                    <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">
                      <TranslatedText>{s.l}</TranslatedText>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudySpotlight;
