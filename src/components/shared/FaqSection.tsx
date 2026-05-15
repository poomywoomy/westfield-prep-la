import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TranslatedText } from "@/components/TranslatedText";

interface FaqProps {
  title?: string;
  faqs: { question: string; answer: string }[];
  dark?: boolean;
}

const FaqSection = ({ title = "Frequently asked questions", faqs, dark = false }: FaqProps) => {
  return (
    <section className={`py-24 md:py-32 ${dark ? "bg-[hsl(var(--surface-navy))] text-white" : "bg-white"}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-center mb-12 ${dark ? "" : "text-[hsl(var(--surface-navy))]"}`}>
            <TranslatedText>{title}</TranslatedText>
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`f-${i}`} className={`rounded-2xl px-5 border ${dark ? "border-white/10 bg-white/[0.03]" : "border-black/10"}`}>
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                  <TranslatedText>{f.question}</TranslatedText>
                </AccordionTrigger>
                <AccordionContent className={dark ? "text-white/70" : "text-[hsl(var(--surface-navy))]/70"}>
                  <TranslatedText>{f.answer}</TranslatedText>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
