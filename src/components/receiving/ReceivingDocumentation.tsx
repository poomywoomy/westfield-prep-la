import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Shield, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const ReceivingDocumentation = () => {
  const features = [
    {
      icon: Camera,
      title: "High-Resolution Photos",
      desc: "Every unit photographed with professional-grade cameras. Clear, detailed images that show exact condition."
    },
    {
      icon: Clock,
      title: "30-Day Retention",
      desc: "Photos stored for 30 days from upload date. Plenty of time to review discrepancies and file claims."
    },
    {
      icon: Eye,
      title: "Dashboard Access",
      desc: "View all receiving photos directly in your client dashboard. No emails or file sharing required."
    },
    {
      icon: Shield,
      title: "Dispute Protection",
      desc: "Photo evidence protects you in supplier disputes. Prove condition at time of receipt."
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
            Photo Documentation System
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete visual record of every shipment. Our photo documentation protects your investment 
            and provides transparency you can trust. View all photos in your 
            <Link to="/integrations" className="text-purple-600 hover:underline mx-1">integrated dashboard</Link>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Photo Age Warning Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mt-12"
        >
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-purple-800">
              <strong>Note:</strong> Photos are automatically deleted after 30 days to protect client privacy. 
              A warning appears in your dashboard when photos are 25+ days old, giving you time to download 
              any images you need for records.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReceivingDocumentation;
