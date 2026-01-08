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
    question: "How do you connect to TikTok Shop for fulfillment?",
    answer:
      "We integrate with TikTok Shop through established middleware platforms and APIs. Once connected, orders flow automatically into our system, inventory levels sync in real-time, and tracking information is pushed back to TikTok and your customers. The setup typically takes 24-48 hours, and our team handles the technical configuration so you can focus on creating content.",
  },
  {
    question: "Can you handle sudden order spikes from viral videos?",
    answer:
      "Absolutely—that's exactly what we're built for. We maintain surge capacity specifically for TikTok sellers, with flexible staffing and buffer inventory systems. When your video goes viral, we activate priority protocols to process your orders first. We've successfully handled spikes from 100 to 10,000+ orders overnight without missing a beat.",
  },
  {
    question: "What's your average processing time for TikTok Shop orders?",
    answer:
      "Our average processing time for TikTok Shop orders is 6 hours from order receipt to shipment. We understand TikTok customers expect fast delivery, so we prioritize quick turnaround. For standard orders, same-day shipping is typical when orders arrive before our cutoff time. During viral surges, we may extend slightly but maintain communication throughout.",
  },
  {
    question: "Do you offer branded packaging for TikTok Shop orders?",
    answer:
      "Yes! Unboxing content is huge on TikTok, so we offer custom branded packaging options. This includes branded boxes, tissue paper, thank-you cards, stickers, and promotional inserts. Many of our TikTok sellers see their customers post unboxing videos, which creates organic marketing. We work with you to design a packaging experience worth sharing.",
  },
  {
    question: "How do returns work for TikTok Shop orders?",
    answer:
      "We handle TikTok Shop returns end-to-end. When a return is initiated, we receive the product, inspect its condition, and update your inventory accordingly. Sellable items go back into available stock, while damaged items are documented and set aside. You get full visibility into return status and can make decisions about damaged inventory.",
  },
];

const TikTokChannelFAQ = () => {
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
    <section className="py-20 bg-gradient-to-b from-background to-pink-50/30">
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
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about TikTok Shop fulfillment.
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
                className="border border-border rounded-xl px-6 bg-card hover:border-pink-200 transition-colors duration-200 data-[state=open]:border-pink-300 data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-pink-600 hover:no-underline py-4">
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

export default TikTokChannelFAQ;
