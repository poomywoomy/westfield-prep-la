import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FulfillmentFAQ = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const faqs = [
    {
      question: "What is your order cutoff time for same-day shipping?",
      answer: "Orders received by 2 PM PST ship the same day, Monday through Saturday. Orders after 2 PM ship the next business day. During peak seasons like Q4, we sometimes extend hours to accommodate higher volumes."
    },
    {
      question: "What e-commerce platforms do you integrate with?",
      answer: "We have native integrations with Shopify, Amazon Seller Central, TikTok Shop, Walmart Marketplace, eBay, Etsy, WooCommerce, BigCommerce, and Magento. We also offer a REST API for custom platforms and can work with most order management systems."
    },
    {
      question: "Do you provide real-time tracking to customers?",
      answer: "Yes! Tracking information syncs automatically to your sales platform and triggers customer notification emails. Customers can track their package from the moment it leaves our facility to their doorstep."
    },
    {
      question: "Can you handle branded or custom packaging?",
      answer: "Absolutely. We can use your branded boxes, tissue paper, stickers, and inserts. Just ship us your materials and we'll store them alongside your inventory. Custom packaging adds a small per-order fee depending on complexity."
    },
    {
      question: "What happens if there's a shipping error?",
      answer: "We take full responsibility for errors caused by our team. If we ship the wrong item or quantity, we'll reship the correct order at no charge and cover return shipping for the incorrect item. Our 99.8% accuracy rate means errors are rare, but when they happen, we make it right."
    },
    {
      question: "Do you have minimum order requirements?",
      answer: "We work best with brands shipping at least 100 orders per month, but we're flexible for growing businesses. There's no maximum—we've handled flash sales with 5,000+ orders in a single day. Contact us to discuss your volume."
    },
    {
      question: "Can you handle rush or expedited orders?",
      answer: "Yes. We offer priority processing for time-sensitive orders. Rush orders received by 12 PM PST can ship same-day via expedited carriers. Additional fees apply for rush handling, and we'll work with you on carrier selection for the fastest delivery."
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-slate-50 dark:bg-slate-900/50">
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
            Common questions about our order fulfillment services
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
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-6 data-[state=open]:border-blue-500/50"
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

export default FulfillmentFAQ;
