import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const ReturnsPathways = () => {
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
            Two Pathways: Resellable or Damaged
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            After inspection, every item is sorted into one of two pathways. 
            This clear separation ensures accurate inventory and maximum value recovery.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Green Path - Resellable */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 border-2 border-green-500 bg-gradient-to-br from-green-50 to-white h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-xl text-green-800">Resellable Items</h3>
              </div>
              
              <p className="text-green-700 mb-6 leading-relaxed">
                Items that pass QC inspection are immediately restocked to your available inventory. 
                They're ready for resale the same day, minimizing time out of stock and maximizing 
                your recovery rate.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">qc_pass</span>
                  <ArrowRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Receiving Location</span>
                </div>
                <div className="flex items-center gap-2 pl-8">
                  <ArrowRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Available Inventory</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>92%</strong> of returns processed are resellable
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Red Path - Damaged */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 border-2 border-red-500 bg-gradient-to-br from-red-50 to-white h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-bold text-xl text-red-800">Damaged Items</h3>
              </div>
              
              <p className="text-red-700 mb-6 leading-relaxed">
                Items that fail QC inspection are moved to damaged inventory and flagged for your review. 
                You decide the final disposition: dispose, return to sender, or attempt rework.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">qc_fail</span>
                  <ArrowRight className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Receiving Location</span>
                </div>
                <div className="flex items-center gap-2 pl-8">
                  <ArrowRight className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Damaged Inventory</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-100 rounded-lg">
                <p className="text-sm text-red-800">
                  All damaged items documented with <strong>photos and notes</strong>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReturnsPathways;
