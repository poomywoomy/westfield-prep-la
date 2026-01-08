import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ReturnsFAQ = () => {
  const faqs = [
    {
      question: "How fast do you process returns?",
      answer: "Most returns are inspected and processed within 5 hours of arrival. Resellable items are restocked the same day. Maximum turnaround is 24 hours, even for complex multi-SKU returns."
    },
    {
      question: "What information do I get about each return?",
      answer: "Every return includes high-resolution photos, condition assessment notes, quantity verification, and a clear pass/fail decision. All documentation is available in your client dashboard."
    },
    {
      question: "How do you determine if an item is resellable vs damaged?",
      answer: "We follow your custom inspection criteria or our standard protocol: checking for physical damage, missing parts, packaging integrity, and functionality. You can set specific rules for your products."
    },
    {
      question: "Can I set custom inspection criteria for my products?",
      answer: "Absolutely. You can configure inspection rules per SKU or product category. For example, cosmetic products might have stricter packaging requirements than durable goods."
    },
    {
      question: "Do you integrate with my Shopify store for returns?",
      answer: "Yes, we have full Shopify integration. Returns created in Shopify sync automatically. We enrich line items with your SKU data and push status updates back to your store."
    },
    {
      question: "What happens to items you classify as damaged?",
      answer: "Damaged items are moved to a separate inventory location and flagged for your review. You decide: dispose, return to sender, attempt rework, or donate. We execute your decision with photo documentation."
    },
    {
      question: "How are discrepancies between expected and actual quantities tracked?",
      answer: "Any variance between expected and received quantities is logged as a discrepancy. You receive notification with photos and can review the issue in your dashboard. We help document evidence for carrier or customer claims."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our returns processing services.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-rose-900">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Have more questions?{" "}
            <Link to="/contact" className="text-rose-600 hover:underline font-medium">
              Contact our team
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ReturnsFAQ;
