import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { TranslatedText } from "@/components/TranslatedText";

const ShopifyChannelFAQ = () => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How quickly can I get started with Shopify fulfillment?",
      answer: "Most Shopify stores are fully operational within 48 hours of connecting. The integration takes about 5 minutes. Once your inventory arrives at our LA warehouse, we can start shipping orders the same day. There's no lengthy onboarding process or technical implementation required."
    },
    {
      question: "What happens when I get a sudden surge in orders?",
      answer: "We're built for scale. Whether you're featured on a major publication, go viral on TikTok, or run a flash sale, our infrastructure handles it. We've processed 10x normal volume during Black Friday for multiple brands without delays. No advance notice required—we staff based on real-time order projections."
    },
    {
      question: "Can you match my current branded packaging?",
      answer: "Absolutely. We work with custom mailer boxes, branded tissue paper, thank-you cards, promotional inserts, stickers, and gift wrapping. Many brands ship us their packaging materials. We can also source materials on your behalf and store them at no additional cost. Every unboxing experience can be exactly what your brand requires."
    },
    {
      question: "How does inventory sync work between Shopify and your warehouse?",
      answer: "Our integration syncs in real-time. When we receive inventory, your Shopify stock updates automatically. When orders ship, quantities adjust instantly. When returns are restocked, availability reflects immediately. This eliminates overselling and ensures customers always see accurate availability."
    },
    {
      question: "What are your shipping carrier options and rates?",
      answer: "We offer discounted rates across USPS, UPS, FedEx, and regional carriers. Our system automatically selects the optimal carrier based on package size, weight, destination, and delivery speed requirements. Most brands save 15-25% on shipping compared to their previous setup. Visit our pricing page for detailed rate information."
    },
    {
      question: "How do you handle returns and exchanges?",
      answer: "We provide full returns processing. When a return arrives, we receive it, inspect the item, photograph its condition, and update your inventory. Sellable items are restocked immediately. Damaged items are flagged in your dashboard with photos. Exchange orders can be triggered automatically based on your preferences."
    },
    {
      question: "Is there a minimum order volume requirement?",
      answer: "No minimums and no long-term contracts. We work with brands doing 50 orders per month and brands doing 50,000+. Pricing scales as you grow. You're never locked into volume commitments you can't meet."
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]">
            <TranslatedText>Shopify Fulfillment FAQ</TranslatedText>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            <TranslatedText>Common questions from Shopify store owners considering Westfield as their fulfillment partner.</TranslatedText>
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="border border-border/50 rounded-xl overflow-hidden bg-white hover:border-[hsl(var(--shopify-page-accent))]/30 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[hsl(var(--shopify-page-light))]/50 transition-colors"
              >
                <span className="font-semibold text-foreground pr-4"><TranslatedText>{faq.question}</TranslatedText></span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-[hsl(var(--shopify-page-accent))] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                      <TranslatedText>{faq.answer}</TranslatedText>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopifyChannelFAQ;
