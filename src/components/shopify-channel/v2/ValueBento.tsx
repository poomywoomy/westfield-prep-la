import { Zap, Camera, Sparkles, RefreshCw, Infinity as InfinityIcon } from "lucide-react";
import BentoTile from "@/components/shared/BentoTile";
import { TranslatedText } from "@/components/TranslatedText";
import unboxingImg from "@/assets/shopify-v2/unboxing.jpg";
import scannerImg from "@/assets/shopify-v2/scanner-sync.jpg";
import qcImg from "@/assets/shopify-v2/qc-bench.jpg";

const ValueBento = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
            <TranslatedText>What you get</TranslatedText>
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--surface-navy))]">
            <TranslatedText>Five things every Shopify brand should expect from a 3PL.</TranslatedText>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[minmax(220px,auto)]">
          {/* Same-day — large dark tile */}
          <BentoTile variant="navy" className="md:col-span-2 lg:col-span-2 md:row-span-2 min-h-[460px]" eyebrow="01 · Speed" delay={0}>
            <Zap className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              <TranslatedText>Same-day shipping, by 2 PM PT cutoff.</TranslatedText>
            </h3>
            <p className="mt-3 text-white/70 max-w-md">
              <TranslatedText>
                Orders flow from Shopify into our pick queue automatically. 99.2% ship same business day, every business day.
              </TranslatedText>
            </p>
            <div className="mt-6 flex items-center gap-6 text-xs uppercase tracking-wider text-white/50">
              <div><span className="block text-2xl text-white font-bold normal-case tracking-tight">99.2%</span>same-day</div>
              <div><span className="block text-2xl text-white font-bold normal-case tracking-tight">&lt;5 min</span>order to picker</div>
            </div>
          </BentoTile>

          {/* QC Photo Proof — image */}
          <BentoTile variant="image" imageSrc={qcImg} imageAlt="Quality control bench inspecting product under ring light" className="md:col-span-1 lg:col-span-2 min-h-[220px]" eyebrow="02 · Trust" delay={0.05}>
            <Camera className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-2xl font-bold tracking-tight">
              <TranslatedText>QC photo proof on every order.</TranslatedText>
            </h3>
            <p className="mt-2 text-sm text-white/80 max-w-sm">
              <TranslatedText>Receiving, prep, and outbound — documented and stored 30 days.</TranslatedText>
            </p>
          </BentoTile>

          {/* Branded unboxing — image */}
          <BentoTile variant="image" imageSrc={unboxingImg} imageAlt="Premium navy mailer box with cream tissue paper and thank-you card" className="lg:col-span-1 min-h-[220px]" eyebrow="03 · Brand" delay={0.1}>
            <Sparkles className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-xl font-bold tracking-tight">
              <TranslatedText>Branded unboxing.</TranslatedText>
            </h3>
            <p className="mt-2 text-xs text-white/80">
              <TranslatedText>Mailers, tissue, cards, inserts.</TranslatedText>
            </p>
          </BentoTile>

          {/* Real-time sync — image */}
          <BentoTile variant="image" imageSrc={scannerImg} imageAlt="Worker scanning a shipping label with handheld barcode scanner" className="lg:col-span-1 min-h-[220px]" eyebrow="04 · Sync" delay={0.15}>
            <RefreshCw className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-xl font-bold tracking-tight">
              <TranslatedText>Real-time inventory.</TranslatedText>
            </h3>
            <p className="mt-2 text-xs text-white/80">
              <TranslatedText>Levels push to Shopify in seconds.</TranslatedText>
            </p>
          </BentoTile>

          {/* No minimums — wide light tile */}
          <BentoTile variant="light" className="md:col-span-3 lg:col-span-2 min-h-[220px]" eyebrow="05 · Flexibility" delay={0.2}>
            <InfinityIcon className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-2xl md:text-3xl font-bold tracking-tight">
              <TranslatedText>No minimums. No lock-in.</TranslatedText>
            </h3>
            <p className="mt-2 text-[hsl(var(--surface-navy))]/70 max-w-md">
              <TranslatedText>Ship 50 or 50,000 orders a month. Month-to-month, transparent per-unit pricing.</TranslatedText>
            </p>
          </BentoTile>
        </div>
      </div>
    </section>
  );
};

export default ValueBento;
