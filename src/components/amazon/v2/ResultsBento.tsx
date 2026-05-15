import BentoTile from "@/components/shared/BentoTile";
import { TranslatedText } from "@/components/TranslatedText";

const cases = [
  { industry: "Electronics & accessories", challenge: "High-value SKUs needed photo QC for every unit.", outcome: "Zero damage claims · 100% FBA compliance" },
  { industry: "Supplements & health", challenge: "Lot tracking + expiration date labeling at scale.", outcome: "100% Amazon compliance · zero restricted inventory" },
  { industry: "Toys & games", challenge: "Q4 rush demanded same-day pallet forwarding.", outcome: "99% same-day ship rate during peak" },
];

const ResultsBento = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
            <TranslatedText>Results</TranslatedText>
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--surface-navy))]">
            <TranslatedText>Outcomes from real Amazon sellers.</TranslatedText>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {cases.map((c, i) => (
            <BentoTile key={c.industry} variant={i === 1 ? "navy" : "light"} eyebrow={`Case ${i + 1}`} delay={i * 0.06}>
              <h3 className="text-xl font-bold tracking-tight"><TranslatedText>{c.industry}</TranslatedText></h3>
              <p className={`mt-3 text-sm ${i === 1 ? "text-white/70" : "text-[hsl(var(--surface-navy))]/65"}`}><TranslatedText>{c.challenge}</TranslatedText></p>
              <div className={`mt-auto pt-6 border-t ${i === 1 ? "border-white/10" : "border-black/10"}`}>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--orange-glow))]"><TranslatedText>Outcome</TranslatedText></div>
                <div className={`mt-1 font-semibold ${i === 1 ? "" : "text-[hsl(var(--surface-navy))]"}`}><TranslatedText>{c.outcome}</TranslatedText></div>
              </div>
            </BentoTile>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsBento;
