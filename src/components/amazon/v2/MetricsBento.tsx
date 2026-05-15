import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TranslatedText } from "@/components/TranslatedText";

const Counter = ({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}{suffix}</span>;
};

const stats = [
  { v: 1, suf: "M+", dec: 0, l: "Units prepped / yr", d: "Across DTC, FBA, and Vendor Central." },
  { v: 99.8, suf: "%", dec: 1, l: "Compliance pass rate", d: "Inbound checked-in without rework." },
  { v: 24, suf: "h", dec: 0, l: "Avg turnaround", d: "Receive to ship to Amazon FC." },
  { v: 0, suf: "", dec: 0, l: "Hidden fees", d: "Per-unit pricing only." },
];

const MetricsBento = () => {
  return (
    <section className="py-24 md:py-32 bg-[hsl(var(--surface-navy-2))] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
            <TranslatedText>Performance</TranslatedText>
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            <TranslatedText>Measured on every shipment, every month.</TranslatedText>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-8 hover:border-[hsl(var(--orange-glow))]/40 transition-colors">
              <div className="text-5xl md:text-6xl font-bold tracking-tight"><Counter to={s.v} suffix={s.suf} decimals={s.dec} /></div>
              <div className="mt-5 text-xs uppercase tracking-[0.18em] text-[hsl(var(--orange-glow))]"><TranslatedText>{s.l}</TranslatedText></div>
              <p className="mt-2 text-sm text-white/60 leading-relaxed"><TranslatedText>{s.d}</TranslatedText></p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsBento;
