import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MetricCounter } from "@/components/ui/metric-counter";
import { DollarSign, TrendingUp, RotateCcw, Clock } from "lucide-react";

const ReturnsMetrics = () => {
  const metrics = [
    {
      icon: TrendingUp,
      value: 85,
      suffix: "%",
      label: "Recovery Rate",
      desc: "Value recovered from returns"
    },
    {
      icon: DollarSign,
      value: 87,
      prefix: "$",
      suffix: "K",
      label: "Avg Monthly Recovery",
      desc: "Client value recovered"
    },
    {
      icon: RotateCcw,
      value: 92,
      suffix: "%",
      label: "Resellable Rate",
      desc: "Items returned to stock"
    },
    {
      icon: Clock,
      value: 24,
      suffix: "hr",
      label: "Max Turnaround",
      desc: "From arrival to restocked"
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
            Value Recovery Metrics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Returns don't have to be a loss. Our optimized process recovers maximum value 
            and gets resellable items back in stock fast.
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
              <Card className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-rose-100">
                <CardContent className="p-6 md:p-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                    <metric.icon className="w-7 h-7 text-rose-600" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-rose-600 mb-1">
                    <MetricCounter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
                  </p>
                  <p className="font-semibold mb-1">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Before/After Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mt-12"
        >
          <Card className="p-6 border-2 border-rose-200">
            <h3 className="font-semibold text-center mb-6">The Hidden Cost of Mishandled Returns</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Without Professional Processing</p>
                <p className="text-2xl font-bold text-muted-foreground">~50%</p>
                <p className="text-xs text-muted-foreground">Recovery rate</p>
              </div>
              <div className="text-center p-4 bg-rose-50 rounded-lg border border-rose-200">
                <p className="text-sm text-rose-600 mb-1">With Westfield</p>
                <p className="text-2xl font-bold text-rose-600">85%+</p>
                <p className="text-xs text-rose-600">Recovery rate</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ReturnsMetrics;
