import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MetricCounter } from "@/components/ui/metric-counter";
import { CheckCircle, Camera, Clock, Package } from "lucide-react";

const ReceivingMetrics = () => {
  const metrics = [
    {
      icon: CheckCircle,
      value: 99.8,
      suffix: "%",
      label: "Accuracy Rate",
      desc: "Unit count precision"
    },
    {
      icon: Camera,
      value: 100,
      suffix: "%",
      label: "Photo Coverage",
      desc: "Every item documented"
    },
    {
      icon: Clock,
      value: 4,
      suffix: "hr",
      label: "Avg Processing",
      desc: "Arrival to available"
    },
    {
      icon: Package,
      value: 10000,
      suffix: "+",
      label: "Units Monthly",
      desc: "Processing capacity"
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
            Receiving Performance Metrics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Precision receiving that protects your bottom line. Our metrics speak to the 
            accuracy and speed that e-commerce sellers depend on.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-purple-100">
                <CardContent className="p-6 md:p-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <metric.icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">
                    <MetricCounter value={metric.value} suffix={metric.suffix} />
                  </p>
                  <p className="font-semibold mb-1">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pass/Fail Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mt-12"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">QC Pass Rate</span>
              <span className="text-purple-600 font-bold">98%</span>
            </div>
            <div className="flex gap-1 h-4 rounded-full overflow-hidden">
              <div className="bg-green-500" style={{ width: '98%' }} />
              <div className="bg-red-500" style={{ width: '2%' }} />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-green-600 font-medium">Pass: 98%</span>
              <span className="text-red-600 font-medium">Fail: 2%</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ReceivingMetrics;
