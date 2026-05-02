import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import { WcuSectionHeading } from "./wcu/WcuPrimitives";

const FAQAccordion = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    { question: "Do you have minimum order requirements?", answer: "No, we don't require monthly minimums. Whether you're fulfilling 50 orders or 50,000+ orders per month, we can support your business. Our pricing scales with your volume, so you only pay for what you use." },
    { question: "What's your order turnaround time?", answer: "We process orders within 24 hours of receiving them. Orders placed before 2 PM PST typically ship same-day. Our efficient operations and LA location ensure fast delivery times for your customers." },
    { question: "What e-commerce platforms do you support?", answer: "We work with all major platforms including Shopify, Amazon (FBA and FBM), WooCommerce, BigCommerce, TikTok Shop, Walmart, Etsy, eBay, and more. If you're on a platform not listed, contact us - we likely support it." },
    { question: "How does pricing work?", answer: "Our pricing is transparent and straightforward: receiving fees, storage per cubic foot, and pick & pack fees per order. No setup fees, no hidden charges. We provide custom quotes based on your specific needs so you know exactly what to expect." },
    { question: "Can you handle returns?", answer: "Yes, we provide complete returns management. We receive returned products, inspect them, and either restock or dispose per your instructions. You'll receive reports on all returns processed." },
    { question: "Do you offer warehouse tours or client visits?", answer: "As a service-area business, we handle all client operations remotely through our secure client portal. This allows us to focus on fast turnaround times and efficient fulfillment. Your dedicated account manager is always available for questions and updates." },
    { question: "How do I get started?", answer: "Start with a free fulfillment audit. We'll review your current operations, discuss your needs, and provide a custom quote. Once you're ready, onboarding typically takes 3-5 business days." },
    { question: "What makes Westfield different from other 3PLs?", answer: "We combine fast turnaround times with transparent pricing and dedicated support. Our LA location provides strategic advantages for importers and West Coast shipping. Plus, we don't require minimums - we're built for growing brands at every stage." },
  ];

  return (
    <section className="relative py-24" style={{ background: "hsl(var(--wcu-cream))" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <WcuSectionHeading
            eyebrow="FAQ"
            title={<TranslatedText>Frequently Asked Questions</TranslatedText>}
            subtitle={<TranslatedText>Everything you need to know about working with Westfield Prep Center</TranslatedText>}
          />

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? "bg-white border-[hsl(var(--wcu-sunset))] shadow-[0_20px_40px_-15px_hsl(var(--wcu-sunset)/0.3)]"
                      : "bg-white border-[hsl(var(--wcu-line))] hover:border-[hsl(var(--wcu-peach-deep))]"
                  }`}
                >
                  <button
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-bold text-[hsl(var(--wcu-sunset-deep))] tracking-widest flex-shrink-0 mt-0.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-bold text-[hsl(var(--wcu-ink))] text-lg">
                        <TranslatedText>{faq.question}</TranslatedText>
                      </span>
                    </div>
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isOpen
                          ? "bg-[hsl(var(--wcu-sunset))] rotate-45"
                          : "bg-[hsl(var(--wcu-peach))]"
                      }`}
                    >
                      <Plus className={`w-5 h-5 ${isOpen ? "text-white" : "text-[hsl(var(--wcu-sunset-deep))]"}`} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pl-[60px] -mt-1">
                      <div className="pt-4 border-t border-dashed border-[hsl(var(--wcu-line))]">
                        <p className="text-[hsl(var(--wcu-ink-soft))] leading-relaxed">
                          <TranslatedText>{faq.answer}</TranslatedText>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/contact")}
              className="text-[hsl(var(--wcu-sunset-deep))] hover:underline font-bold"
            >
              <TranslatedText>Have another question? Contact Us</TranslatedText> →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
