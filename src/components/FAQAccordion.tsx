import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQAccordion = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Do you have minimum order requirements?",
      answer: "No, we don't require monthly minimums. Whether you're fulfilling 50 orders or 5,000+ orders per month, we can support your business. Our pricing scales with your volume, so you only pay for what you use."
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-card-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

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
