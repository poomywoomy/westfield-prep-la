import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const InventoryFAQ = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const faqs = [
    {
      question: "How often do you perform cycle counts?",
      answer: "We perform daily cycle counts on high-velocity SKUs (your top 20% by movement), weekly counts on medium-velocity items, and monthly counts on slow movers. This tiered approach ensures your bestsellers are always accurate while efficiently covering your entire catalog."
    },
    {
      question: "Can I see my inventory in real-time?",
      answer: "Yes! Your client dashboard provides 24/7 real-time visibility into every SKU, location, and transaction. Inventory levels update within seconds of any receiving, shipment, or adjustment. You can access the dashboard from any device—desktop, tablet, or phone."
    },
    {
      question: "Do you support multiple warehouse locations?",
      answer: "Currently, we operate from our Los Angeles facility. However, our WMS is designed to track inventory across multiple locations if you have stock elsewhere. We can receive transfers from other warehouses and maintain unified inventory counts."
    },
    {
      question: "What's your minimum SKU count to work with you?",
      answer: "There's no minimum SKU requirement. Whether you have 10 SKUs or 10,000, our system handles it the same way. We work with brands at all stages—from startups with a handful of products to established companies with complex catalogs."
    },
    {
      question: "How do you handle inventory shrinkage or discrepancies?",
      answer: "When cycle counts reveal discrepancies, we investigate immediately. Every variance is documented with photos and notes. We adjust inventory to match actual counts and provide you with detailed variance reports. Our average shrinkage rate is less than 0.1%—far below industry standards."
    },
    {
      question: "What reports can I access through the dashboard?",
      answer: "You'll have access to inventory levels by SKU and location, transaction history (receiving, shipments, adjustments), low stock alerts, aging inventory reports, cycle count variance reports, and demand velocity analytics. Reports can be exported as CSV or PDF."
    },
    {
      question: "Which platforms does your WMS integrate with?",
      answer: "We have native integrations with Shopify, Amazon Seller Central, TikTok Shop, Walmart Marketplace, eBay, Etsy, WooCommerce, BigCommerce, and Magento. We also offer a REST API for custom integrations. Inventory syncs automatically—no manual updates required."
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950/30">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Common questions about our inventory management services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`}
                className="bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-500/20 rounded-xl px-6 data-[state=open]:border-cyan-500/50"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-semibold pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
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

export default InventoryFAQ;
