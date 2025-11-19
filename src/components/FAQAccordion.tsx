import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const FAQAccordion = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Do you have minimum order requirements?",
      answer: "No, we don't require monthly minimums. Whether you're fulfilling 50 orders or 50,000+ orders per month, we can support your business. Our pricing scales with your volume, so you only pay for what you use."
    },
    {
      question: "What's your order turnaround time?",
      answer: "We process orders within 24-48 hours of receiving them. Orders placed before 2 PM PST typically ship same-day. Our efficient operations and LA location ensure fast delivery times for your customers."
    },
    {
      question: "What e-commerce platforms do you support?",
      answer: "We work with all major platforms including Shopify, Amazon (FBA and FBM), WooCommerce, BigCommerce, TikTok Shop, Walmart, Etsy, eBay, and more. If you're on a platform not listed, contact us - we likely support it."
    },
    {
      question: "How does pricing work?",
      answer: "Our pricing is transparent and straightforward: receiving fees, storage per cubic foot, and pick & pack fees per order. No setup fees, no hidden charges. We provide custom quotes based on your specific needs so you know exactly what to expect."
    },
    {
      question: "Can you handle returns?",
      answer: "Yes, we provide complete returns management. We receive returned products, inspect them, and either restock or dispose per your instructions. You'll receive reports on all returns processed."
    },
    {
      question: "How do I get started?",
      answer: "Start with a free fulfillment audit. We'll review your current operations, discuss your needs, and provide a custom quote. Once you're ready, onboarding typically takes 3-5 business days."
    },
    {
      question: "What makes Westfield different from other 3PLs?",
      answer: "We combine fast turnaround times with transparent pricing and dedicated support. Our LA location provides strategic advantages for importers and West Coast shipping. Plus, we don't require minimums - we're built for growing brands at every stage."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about working with Westfield Prep Center
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                    activeIndex === index
                      ? 'bg-primary text-primary-foreground border-primary shadow-xl'
                      : 'bg-card border-border hover:border-primary/50 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className={`text-2xl font-bold ${
                        activeIndex === index ? 'text-primary-foreground/60' : 'text-primary/40'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`font-bold text-lg ${
                        activeIndex === index ? 'text-primary-foreground' : 'text-card-foreground'
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`flex-shrink-0 w-6 h-6 transition-transform ${
                        activeIndex === index ? 'rotate-180 text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              {activeIndex !== null && (
                <div className="sticky top-32 bg-gradient-to-br from-card to-card/50 border-2 border-border rounded-3xl p-12 shadow-2xl animate-fade-in">
                  <div className="text-6xl font-bold text-primary/10 mb-6">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-foreground">
                    {faqs[activeIndex].question}
                  </h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {faqs[activeIndex].answer}
                  </p>
                </div>
              )}

              {activeIndex === null && (
                <div className="sticky top-32 bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-dashed border-border rounded-3xl p-12 flex items-center justify-center h-96">
                  <p className="text-2xl text-muted-foreground text-center">
                    Click a question to see the answer
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-10">
            <button 
              onClick={() => navigate("/contact")}
              className="text-primary hover:underline font-medium"
            >
              Have another question? Contact Us →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
