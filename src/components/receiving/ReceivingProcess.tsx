import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Package, FileCheck, Camera, CheckCircle, AlertTriangle, Clock } from "lucide-react";

const ReceivingProcess = () => {
  const steps = [
    {
      num: 1,
      icon: Package,
      title: "Shipment Arrival",
      desc: "Your shipment is logged immediately upon arrival. We record carrier details, tracking numbers, and capture initial photos of the delivery condition. This creates an audit trail from the moment your goods arrive.",
      time: "15 min"
    },
    {
      num: 2,
      icon: FileCheck,
      title: "Count Verification",
      desc: "Every unit is counted against your packing list or ASN. We verify quantities box-by-box, flagging any discrepancies between expected and actual counts before proceeding.",
      time: "30 min"
    },
    {
      num: 3,
      icon: Camera,
      title: "Photo Documentation",
      desc: "100% of received items are photographed with high-resolution cameras. These photos are uploaded to your dashboard and retained for 30 days, providing visual proof of condition at time of receipt.",
      time: "20 min"
    },
    {
      num: 4,
      icon: CheckCircle,
      title: "Quality Inspection",
      desc: "Each unit undergoes thorough quality control: checking for damage, verifying barcodes scan correctly, confirming labels are compliant, and assessing packaging integrity.",
      time: "45 min"
    },
    {
      num: 5,
      icon: AlertTriangle,
      title: "Discrepancy Report",
      desc: "Any issues discovered are immediately documented with photos and detailed notes. You receive real-time notifications so you can make informed decisions about damaged or missing items.",
      time: "10 min"
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
            Our 5-Step Receiving Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From truck to shelf in under 4 hours. Every shipment follows our proven workflow 
            to ensure accuracy and protect your inventory investment.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4 border-l-purple-500">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Step Number */}
                  <div 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl border-4 border-purple-500 text-purple-600 flex-shrink-0"
                  >
                    {step.num}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Time Estimate */}
                  <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full flex-shrink-0">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{step.time}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute left-8 top-full w-0.5 h-6 bg-purple-300" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Total Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 bg-purple-100 px-6 py-3 rounded-full">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Average Total Processing: Under 4 Hours</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReceivingProcess;
