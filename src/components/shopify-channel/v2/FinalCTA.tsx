import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const FinalCTA = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl bg-[hsl(var(--surface-navy))] text-white p-10 md:p-20 overflow-hidden border border-white/10 text-center">
          <div className="absolute inset-0 bento-grid-faint opacity-50 pointer-events-none" />
          <div
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-15 blur-[120px]"
            style={{ background: "hsl(var(--orange-glow))" }}
          />
          <div className="relative max-w-3xl mx-auto">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
              <TranslatedText>Get a quote</TranslatedText>
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              <TranslatedText>Ready to ship like the brands you admire?</TranslatedText>
            </h2>
            <p className="mt-5 text-white/70 text-lg">
              <TranslatedText>Custom quote in 24 hours. Built for 1,000+ orders/mo. No lock-in.</TranslatedText>
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[hsl(var(--orange-glow))] text-white font-bold hover:-translate-y-0.5 transition-all shadow-[0_20px_60px_-15px_hsl(var(--orange-glow)/0.6)]">
                <TranslatedText>Get a custom quote</TranslatedText>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/15 text-white font-semibold hover:bg-white/10 transition-all backdrop-blur-sm">
                <TranslatedText>See pricing</TranslatedText>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
