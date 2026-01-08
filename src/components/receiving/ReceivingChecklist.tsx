import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Barcode, Calendar, Box, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const ReceivingChecklist = () => {
  const checklistItems = [
    {
      icon: Package,
      title: "Quantity Accuracy",
      desc: "Every unit counted and verified against your ASN or packing list. Discrepancies flagged immediately with photo evidence."
    },
    {
      icon: Box,
      title: "Damage Assessment",
      desc: "Visual inspection of packaging and product condition. Crushed boxes, water damage, and cosmetic defects documented."
    },
    {
      icon: Barcode,
      title: "Barcode Verification",
      desc: "All barcodes scanned to confirm they read correctly. Invalid or missing barcodes reported before storage."
    },
    {
      icon: Calendar,
      title: "Expiration Checks",
      desc: "Date-coded products verified for shelf life. Items approaching expiration flagged for FIFO rotation priority."
    },
    {
      icon: Box,
      title: "Packaging Condition",
      desc: "Retail-ready assessment for FBA and DTC orders. Packaging integrity confirmed for marketplace compliance."
    },
    {
      icon: Tag,
      title: "Label Compliance",
      desc: "FBA labels, FNSKU codes, and compliance markings verified. Non-compliant items identified before prep begins."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Inspection Checklist
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every shipment undergoes our 6-point inspection protocol. Nothing reaches your 
            <Link to="/inventory-management" className="text-purple-600 hover:underline mx-1">inventory</Link>
            without passing quality control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {checklistItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReceivingChecklist;
