import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const faqs = [
  {
    question: "What Amazon FBA prep services do you offer?",
    answer:
      "We provide comprehensive FBA prep services including FNSKU labeling, polybagging with suffocation warnings, bubble wrap protection for fragile items, carton prep and box labeling, pallet building for LTL/FTL shipments, product photography and QC documentation, and inventory receiving with same-day check-in. Every service follows Amazon's latest prep requirements to ensure your shipments are accepted without issues.",
  },
  {
    question: "How quickly can you turn around my FBA shipments?",
    answer:
      "Most FBA shipments are prepped and ready within 24-48 hours of receiving your inventory. We offer same-day receiving, meaning your products are checked in and counted the same day they arrive. For rush orders or high-volume shipments, we can often accommodate expedited timelines—just let us know your deadline when you create your ASN.",
  },
  {
    question: "What are your FBA prep pricing and fees?",
    answer:
      "Our FBA prep pricing is transparent and per-unit based. Standard prep (labeling + polybagging) starts at competitive rates, with additional services like bubble wrap, bundling, or special handling priced separately. We provide detailed quotes based on your specific products and volume. No hidden fees—what you see is what you pay. Contact us for a custom quote tailored to your catalog.",
  },
  {
    question: "How do you handle FBA compliance and avoid chargebacks?",
    answer:
      "We stay current with Amazon's ever-changing prep requirements and update our SOPs accordingly. Every unit goes through a multi-point QC check before shipping. We photograph shipments for documentation, verify FNSKU accuracy, and ensure packaging meets category-specific guidelines. This rigorous process has kept our chargeback rate at effectively 0% across all client shipments.",
  },
  {
    question: "Can you handle oversized and heavy/bulky FBA items?",
    answer:
      "Absolutely. We have the equipment and space to handle oversized and heavy/bulky items that require special prep. This includes proper palletizing, shrink-wrapping, and labeling for Amazon's non-standard size tiers. We're experienced with furniture, fitness equipment, home goods, and other large products that many prep centers can't accommodate.",
  },
];

const AmazonChannelFAQ = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  // Schema.org FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-orange-50/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about our Amazon FBA prep services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card hover:border-orange-200 transition-colors duration-200 data-[state=open]:border-orange-300 data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-orange-600 hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default AmazonChannelFAQ;
