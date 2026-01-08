import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SiShopify, SiAmazon } from "react-icons/si";

const ReturnsIntegrations = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Platform Integrations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Returns sync automatically from your selling platforms. No manual data entry required.
            View all your integrations on our{" "}
            <Link to="/integrations" className="text-rose-600 hover:underline">integrations page</Link>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-xl bg-[#96bf48]/10 flex items-center justify-center mb-4">
                  <SiShopify className="w-10 h-10 text-[#96bf48]" />
                </div>
                <h3 className="font-bold text-xl mb-3">Shopify Returns</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Returns created in Shopify automatically sync to our system. Line items are enriched 
                  with your SKU data, and processing updates flow back to your store.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Real-time webhook sync
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    SKU enrichment via aliases
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Inventory auto-restocking
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-xl bg-[#FF9900]/10 flex items-center justify-center mb-4">
                  <SiAmazon className="w-10 h-10 text-[#FF9900]" />
                </div>
                <h3 className="font-bold text-xl mb-3">Amazon FBA Returns</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Removal orders from Amazon FBA are processed with the same care. We receive, 
                  inspect, and restock sellable units while documenting unsellable items.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Removal order processing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Condition grading
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Re-prep for FBA resend
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReturnsIntegrations;
