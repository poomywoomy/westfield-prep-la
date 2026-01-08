import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ChannelFeaturesProps {
  features: Feature[];
  title?: string;
}

const ChannelFeatures = ({ features, title = "Key Features" }: ChannelFeaturesProps) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <TranslatedText>{title}</TranslatedText>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-secondary/30 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  <TranslatedText>{feature.title}</TranslatedText>
                </h3>
                <p className="text-muted-foreground text-sm">
                  <TranslatedText>{feature.description}</TranslatedText>
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChannelFeatures;
