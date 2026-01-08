import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

interface FAQItem {
  question: string;
  answer: string;
}

interface ChannelFAQProps {
  faqs: FAQItem[];
  title?: string;
}

const ChannelFAQ = ({ faqs, title = "Frequently Asked Questions" }: ChannelFAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <TranslatedText>{title}</TranslatedText>
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-foreground pr-4">
                  <TranslatedText>{faq.question}</TranslatedText>
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-muted-foreground">
                      <TranslatedText>{faq.answer}</TranslatedText>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChannelFAQ;
