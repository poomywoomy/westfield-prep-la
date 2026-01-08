import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "@/components/TranslatedText";

interface ChannelCTAProps {
  title: string;
  subtitle?: string;
}

const ChannelCTA = ({ title, subtitle }: ChannelCTAProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/90">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            <TranslatedText>{title}</TranslatedText>
          </h2>
          
          {subtitle && (
            <p className="text-xl text-white/80 mb-8">
              <TranslatedText>{subtitle}</TranslatedText>
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-white font-semibold text-lg px-8 py-6"
              onClick={() => navigate("/contact")}
            >
              <TranslatedText>Get a Quote</TranslatedText>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white/10 font-semibold text-lg px-8 py-6"
              onClick={() => navigate("/pricing")}
            >
              <TranslatedText>See Pricing</TranslatedText>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChannelCTA;
