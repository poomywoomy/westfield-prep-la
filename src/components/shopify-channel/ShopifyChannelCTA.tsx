import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { TranslatedText } from "@/components/TranslatedText";

const ShopifyChannelCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-[hsl(var(--shopify-page-accent))] via-[hsl(var(--shopify-page-accent))]/95 to-[hsl(var(--shopify-page-primary))] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-15">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <TranslatedText>Ready to Transform Your</TranslatedText>
            <br />
            <TranslatedText>Shopify Fulfillment?</TranslatedText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto"
          >
            <TranslatedText>Let's discuss your volume, your brand requirements, and your growth goals. We'll build a custom fulfillment solution that scales with your Shopify store.</TranslatedText>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-white text-[hsl(var(--shopify-page-accent))] hover:bg-white/90 px-10 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <TranslatedText>Get Your Free Quote</TranslatedText>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-lg font-bold"
            >
              <Phone className="mr-2 h-5 w-5" />
              <TranslatedText>View Pricing First</TranslatedText>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm opacity-90"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <TranslatedText>No minimums</TranslatedText>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <TranslatedText>No long-term contracts</TranslatedText>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <TranslatedText>Same-day shipping</TranslatedText>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <TranslatedText>48-hour onboarding</TranslatedText>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShopifyChannelCTA;
