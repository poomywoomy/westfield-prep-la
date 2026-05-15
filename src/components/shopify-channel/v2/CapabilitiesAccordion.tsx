import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TranslatedText } from "@/components/TranslatedText";

const groups = [
  {
    title: "Pick, pack & ship",
    items: ["Same-day cutoff 2 PM PT", "Scan-on-pack verification", "Rate-shopped carriers (USPS / UPS / FedEx / DHL)", "Insurance & signature options"],
  },
  {
    title: "Branded experience",
    items: ["Custom mailers & boxes", "Tissue, crinkle, void fill", "Thank-you cards & inserts", "Gift wrap & gift notes"],
  },
  {
    title: "Inventory & integrations",
    items: ["Real-time Shopify sync", "Webhooks under 5 seconds", "Bundles, variants, kitting", "Multi-channel: Amazon + TikTok"],
  },
  {
    title: "Returns & QC",
    items: ["Branded return portal", "Photo inspection on receipt", "Restock decision in 24h", "Damage & discrepancy logs"],
  },
];

const CapabilitiesAccordion = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
              <TranslatedText>Capabilities</TranslatedText>
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--surface-navy))]">
              <TranslatedText>Everything a serious DTC brand needs.</TranslatedText>
            </h2>
            <p className="mt-4 text-[hsl(var(--surface-navy))]/65">
              <TranslatedText>One operations partner. One contract. Zero hidden fees.</TranslatedText>
            </p>
          </div>
          <div className="lg:col-span-8">
            <Accordion type="multiple" defaultValue={["item-0"]} className="space-y-3">
              {groups.map((g, i) => (
                <AccordionItem key={g.title} value={`item-${i}`} className="border border-black/10 rounded-2xl px-5 data-[state=open]:bg-[hsl(var(--surface-navy))] data-[state=open]:text-white data-[state=open]:border-transparent transition-colors">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <TranslatedText>{g.title}</TranslatedText>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid sm:grid-cols-2 gap-2 pb-2">
                      {g.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--orange-glow))] flex-shrink-0" />
                          <TranslatedText>{it}</TranslatedText>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesAccordion;
