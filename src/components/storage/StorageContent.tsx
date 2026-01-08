import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MetricCounter } from "@/components/ui/metric-counter";
import { Warehouse, Thermometer, BarChart3, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const StorageContent = () => {
  const metrics = [
    { icon: Warehouse, value: 50000, suffix: "+", label: "Sq Ft Facility" },
    { icon: Thermometer, value: 72, suffix: "°F", label: "Climate Controlled" },
    { icon: BarChart3, value: 75, suffix: "%", label: "Capacity Available" },
  ];
  const security = ["24/7 CCTV Surveillance", "Restricted Access Controls", "Insurance Coverage Included", "Regular Security Audits", "Fire Suppression Systems", "Backup Power Generation"];
  const features = ["Climate-controlled environment (72°F)", "FIFO/FEFO inventory rotation", "Lot and batch tracking", "Cycle count program", "Photo documentation", "Real-time inventory access", "Forklift and pallet jack access", "Same-day inventory access", "Hazmat storage certified", "Flexible month-to-month terms"];
  const faqs = [
    { q: "What storage options do you offer?", a: "We offer pallet storage (per pallet/month), bin storage (per cubic foot), and dedicated space for larger clients. All options include climate control and 24/7 security." },
    { q: "How is pricing calculated?", a: "Storage is priced per pallet per month or per cubic foot for bin storage. No long-term commitments required. Volume discounts available for larger accounts." },
    { q: "What security measures protect my inventory?", a: "24/7 video surveillance, restricted access controls, insurance coverage, regular security audits, fire suppression, and backup power all protect your goods." },
    { q: "Is the facility climate controlled?", a: "Yes, we maintain 72°F year-round. Humidity is also controlled to protect sensitive products. Ideal for cosmetics, supplements, and electronics." },
    { q: "Can I access my inventory same-day?", a: "Yes. Request access through your dashboard or contact us directly. We accommodate same-day pickup requests during business hours." },
    { q: "Do you offer hazmat storage?", a: "Yes, we're certified for certain hazmat categories. Contact us with your product details and we'll confirm if we can accommodate your specific requirements." },
    { q: "What's included in storage fees?", a: "Storage fees include shelving/racking, climate control, security, insurance, and dashboard access. Receiving, prep services, and shipping are billed separately." }
  ];

  return (
    <>
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {metrics.map((m, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="text-center p-8 border-2 border-cyan-100 hover:shadow-xl transition-all">
                  <m.icon className="w-12 h-12 mx-auto mb-4 text-cyan-600" />
                  <p className="text-4xl font-bold text-cyan-600 mb-1"><MetricCounter value={m.value} suffix={m.suffix} /></p>
                  <p className="text-muted-foreground">{m.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Security Infrastructure</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Your inventory is protected by enterprise-grade security. Peace of mind included.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {security.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Warehouse Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need for professional inventory storage. Pairs perfectly with our <Link to="/receiving-inspection" className="text-cyan-600 hover:underline">receiving</Link> and <Link to="/order-fulfillment" className="text-cyan-600 hover:underline">fulfillment</Link> services.</p>
          </motion.div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((f, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                <span>{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}>
                <Card><CardContent className="p-6"><h3 className="font-semibold text-lg mb-2 text-cyan-900">{faq.q}</h3><p className="text-muted-foreground">{faq.a}</p></CardContent></Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8"><p className="text-muted-foreground">More questions? <Link to="/contact" className="text-cyan-600 hover:underline font-medium">Contact us</Link></p></div>
        </div>
      </section>
    </>
  );
};

export default StorageContent;
