import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, Star } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

interface Metric {
  label: string;
  value: string;
}

interface CaseStudyCardProps {
  title: string;
  description: string;
  metrics: Metric[];
}

const CaseStudyCard = ({ title, description, metrics }: CaseStudyCardProps) => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-secondary fill-secondary" />
              <span className="text-sm font-medium text-secondary">
                <TranslatedText>Case Study</TranslatedText>
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              <TranslatedText>{title}</TranslatedText>
            </h3>
            
            <p className="text-white/80 mb-8 text-lg">
              <TranslatedText>{description}</TranslatedText>
            </p>
            
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {metrics.map((metric, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-secondary mr-1" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-secondary">
                    {metric.value}
                  </p>
                  <p className="text-sm text-white/70 mt-1">
                    <TranslatedText>{metric.label}</TranslatedText>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudyCard;
