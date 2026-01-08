import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const KittingContent = () => {
  const useCases = ["Subscription box assembly", "Holiday gift sets", "Product sample kits", "Influencer PR boxes", "Promotional bundles", "New customer welcome kits", "Loyalty program rewards", "Event swag bags"];
  const benefits = ["Save 80% on assembly time vs in-house", "Scale up instantly for peak seasons", "No equipment or space investment", "Photo documentation of every kit", "Flexible minimum order quantities", "Custom packaging materials accepted"];
  const faqs = [
    { q: "What types of kits can you assemble?", a: "We handle everything from simple 2-item bundles to complex 20+ component kits. Subscription boxes, gift sets, PR boxes, sample kits, and promotional bundles are our specialty." },
    { q: "How long does kit assembly take?", a: "Standard kits are assembled same-day. Complex kits with 10+ components typically take 1-2 business days. Rush assembly available for urgent needs." },
    { q: "Do you photograph completed kits?", a: "Yes, every kit is photographed during QC. Photos are uploaded to your dashboard so you can verify assembly accuracy before shipping." },
    { q: "Can I provide custom packaging materials?", a: "Absolutely. Ship us your branded boxes, tissue paper, inserts, and we'll use them. We can also source packaging materials for you." },
    { q: "What's the minimum order for kitting?", a: "No strict minimums. We work with brands assembling 50 kits per month up to thousands. Pricing scales with volume." },
    { q: "How do you handle kit component shortages?", a: "We track component inventory in real-time. You're notified before stock runs out so kits are never delayed. We can hold partial kits until components arrive." },
    { q: "Can you store kit components separately?", a: "Yes. Components are stored individually and pulled for assembly as orders come in. This is ideal for subscription boxes with rotating items." }
  ];

  return (
    <>
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Kitting Use Cases</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">From subscription boxes to event swag, we handle assembly for brands of all sizes. Learn more about our <Link to="/order-fulfillment" className="text-emerald-600 hover:underline">fulfillment services</Link>.</p>
          </motion.div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-base md:text-lg">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Outsource Kitting?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">In-house kitting ties up your team and space. Professional assembly frees you to focus on growth. Check our <Link to="/pricing" className="text-emerald-600 hover:underline">pricing</Link> for volume discounts.</p>
          </motion.div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-base md:text-lg">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}>
                <Card><CardContent className="p-6"><h3 className="font-semibold text-lg mb-2 text-emerald-900">{faq.q}</h3><p className="text-muted-foreground">{faq.a}</p></CardContent></Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8"><p className="text-muted-foreground">More questions? <Link to="/contact" className="text-emerald-600 hover:underline font-medium">Contact us</Link></p></div>
        </div>
      </section>
    </>
  );
};

export default KittingContent;
