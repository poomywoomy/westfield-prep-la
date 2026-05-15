import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Boxes, ShieldCheck, Clock } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import heroImg from "@/assets/amazon-v2/hero-pallet.jpg";

const HeroBento = () => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-[hsl(var(--surface-navy))] text-white overflow-hidden">
      <div className="absolute inset-0 bento-grid-faint opacity-50 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]" style={{ background: "hsl(var(--orange-glow))" }} />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Boxes className="h-3.5 w-3.5 text-[hsl(var(--orange-glow))]" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase">
                <TranslatedText>Amazon FBA Prep · Los Angeles, CA</TranslatedText>
              </span>
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.98]">
              <TranslatedText>Amazon FBA prep,</TranslatedText>
              <br />
              <span className="bg-gradient-to-r from-white via-white to-[hsl(var(--orange-glow))] bg-clip-text text-transparent">
                <TranslatedText>engineered for compliance.</TranslatedText>
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
              <TranslatedText>FNSKU labeling, polybagging, bundling, carton prep, and LTL pallet forwarding — all photo-documented, all Amazon-ready, all from LA.</TranslatedText>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[hsl(var(--orange-glow))] text-white font-bold hover:-translate-y-0.5 transition-all shadow-[0_20px_60px_-15px_hsl(var(--orange-glow)/0.6)]">
                <TranslatedText>Get a custom quote</TranslatedText>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white/5 border border-white/15 text-white font-semibold hover:bg-white/10 backdrop-blur-sm">
                <TranslatedText>See pricing</TranslatedText>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { v: "1M+", l: "Units prepped" },
                { v: "24h", l: "Turnaround" },
                { v: "99.8%", l: "Compliance" },
              ].map((s) => (
                <div key={s.l} className="border-l border-white/10 pl-4">
                  <div className="text-2xl md:text-3xl font-bold tracking-tight">{s.v}</div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1"><TranslatedText>{s.l}</TranslatedText></div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/5] lg:aspect-auto lg:h-full min-h-[480px]">
              <img src={heroImg} alt="Wrapped pallet of FBA-bound cartons with compliance labels in a Los Angeles prep warehouse" width={1600} height={1024} {...({ fetchpriority: "high" } as any)} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-navy))]/80 via-transparent to-transparent" />
              <div className="absolute top-5 left-5">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[hsl(var(--surface-navy))]/80 backdrop-blur-md border border-white/15 text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--orange-glow))]" />
                  <TranslatedText>FNSKU · Hazmat · Lithium-cert</TranslatedText>
                </div>
              </div>
              <div className="absolute bottom-5 right-5 px-4 py-3 rounded-xl bg-white text-[hsl(var(--surface-navy))] shadow-2xl">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[hsl(var(--orange-glow))]">
                  <Clock className="h-3 w-3" />Avg turnaround
                </div>
                <div className="text-2xl font-bold tracking-tight mt-0.5">24 hours</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroBento;
