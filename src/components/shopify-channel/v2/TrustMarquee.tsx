import { TranslatedText } from "@/components/TranslatedText";

const items = [
  "400K+ orders shipped",
  "99.8% accuracy",
  "Same-day cutoff 2 PM PT",
  "Real-time Shopify sync",
  "Branded unboxing",
  "QC photo proof",
  "No order minimums",
  "Los Angeles, CA",
];

const TrustMarquee = () => {
  return (
    <section className="bg-[hsl(var(--surface-navy-2))] border-y border-white/10 overflow-hidden">
      <div className="relative py-5">
        <div className="flex animate-[scroll_40s_linear_infinite] gap-12 whitespace-nowrap">
          {[...items, ...items, ...items].map((t, i) => (
            <div key={i} className="flex items-center gap-12 text-white/60 text-sm font-semibold tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--orange-glow))]" />
              <TranslatedText>{t}</TranslatedText>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default TrustMarquee;
