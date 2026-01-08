import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ReceivingFAQ = () => {
  const faqs = [
    {
      question: "What's included in your receiving service?",
      answer: "Full receiving includes shipment verification, unit counting, condition inspection, high-resolution photography, barcode scanning, and immediate inventory updates in your dashboard. We also flag and document any discrepancies with detailed notes and photos."
    },
    {
      question: "How fast are shipments processed after arrival?",
      answer: "Most shipments are fully processed within 4 hours of arrival. This includes counting, inspection, photography, and updating your inventory. Rush processing is available for time-sensitive shipments."
    },
    {
      question: "Do you provide photos of all items received?",
      answer: "Yes, 100% of items are photographed during receiving. Photos are uploaded to your dashboard and retained for 30 days. You'll see images of packaging condition, individual units, and any damage discovered."
    },
    {
      question: "What happens if there's a discrepancy between expected and actual quantities?",
      answer: "Discrepancies are immediately flagged with photo documentation and detailed notes. You receive a notification and can review the issue in your dashboard. We help you file claims with carriers or suppliers when needed."
    },
    {
      question: "Can I specify special handling instructions for my shipments?",
      answer: "Absolutely. You can add custom handling instructions to any ASN or configure default instructions for your account. We follow your specifications for fragile items, orientation requirements, and special inspection criteria."
    },
    {
      question: "How are damaged items handled during receiving?",
      answer: "Damaged items are photographed, documented, and moved to a separate damaged inventory location. You're notified immediately and can decide whether to dispose, return to sender, or attempt rework. Learn more about our returns processing for damaged goods."
    },
    {
      question: "Do you inspect all items or just sample?",
      answer: "We inspect 100% of units in every shipment. Unlike 3PLs that sample-check, we verify every single unit to catch all discrepancies. This protects you from discovering problems later when it's too late to file claims."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>

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
            Everything you need to know about our receiving and inspection services.
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
                  <h3 className="font-semibold text-lg mb-3 text-purple-900">{faq.question}</h3>
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
            <Link to="/contact" className="text-purple-600 hover:underline font-medium">
              Contact our team
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ReceivingFAQ;
