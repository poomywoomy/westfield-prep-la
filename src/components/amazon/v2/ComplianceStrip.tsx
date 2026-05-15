import { TranslatedText } from "@/components/TranslatedText";

const certs = ["FNSKU", "Hazmat-Cert", "Lithium-Cert", "SFP-Ready", "Vendor Central", "Small & Light"];

const ComplianceStrip = () => {
  return (
    <section className="bg-[hsl(var(--surface-navy-2))] border-y border-white/10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/60">
          {certs.map((c) => (
            <div key={c} className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--orange-glow))]" />
              <TranslatedText>{c}</TranslatedText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComplianceStrip;
