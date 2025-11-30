import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ShopifyFinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-[hsl(var(--shopify-page-accent))] to-[hsl(var(--shopify-page-accent))]/90 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
          >
            You Don't Need Another Warehouse.
            <br />
            You Need a 3PL Partner.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto"
          >
            Let's talk about your volume, brand, and growth targets. We'll tailor
            a quote — and show you how fulfillment should feel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-white text-[hsl(var(--shopify-page-accent))] hover:bg-white/90 px-10 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-transform"
            >
              Talk to Our Fulfillment Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 text-sm opacity-80"
          >
            Same-day receiving • 24-48hr turnaround • No order minimums
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ShopifyFinalCTA;
