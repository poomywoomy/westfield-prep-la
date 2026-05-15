import { CheckCircle2, AlertTriangle } from "lucide-react";
import BentoTile from "@/components/shared/BentoTile";
import { TranslatedText } from "@/components/TranslatedText";

const compliance = [
  "FNSKU labels on every unit",
  "Suffocation warnings on poly bags",
  "Carton content labels",
  "Expiration & lot date labeling",
  "Set creation & bundling",
  "Hazmat documentation",
  "LTL pallet standards",
  "Amazon box size requirements",
];

const rejections = [
  "Missing FNSKU labels",
  "Poly bag without suffocation warning",
  "Mixed SKUs without case labels",
  "Expired or near-expiry inventory",
  "Improperly stretch-wrapped pallets",
];

const ComplianceChecklist = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
            <TranslatedText>Compliance</TranslatedText>
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--surface-navy))]">
            <TranslatedText>The list that keeps your inventory checked-in, not chargebacked.</TranslatedText>
          </h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <BentoTile variant="light" className="lg:col-span-2" eyebrow="What we always do">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-2">
              {compliance.map((c) => (
                <div key={c} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--orange-glow))] mt-0.5 flex-shrink-0" />
                  <span className="text-[hsl(var(--surface-navy))] font-medium"><TranslatedText>{c}</TranslatedText></span>
                </div>
              ))}
            </div>
          </BentoTile>
          <BentoTile variant="navy" eyebrow="Common rejections we prevent">
            <ul className="mt-2 space-y-3">
              {rejections.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-[hsl(var(--orange-glow))] mt-0.5 flex-shrink-0" />
                  <span className="text-white/85"><TranslatedText>{r}</TranslatedText></span>
                </li>
              ))}
            </ul>
          </BentoTile>
        </div>
      </div>
    </section>
  );
};

export default ComplianceChecklist;
