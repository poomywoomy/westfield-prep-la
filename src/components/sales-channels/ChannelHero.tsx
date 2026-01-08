import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "@/components/TranslatedText";

type ChannelType = "amazon" | "shopify" | "tiktok";

interface ChannelHeroProps {
  title: string;
  subtitle: string;
  channelType: ChannelType;
  backgroundImage?: string;
}

const gradientStyles: Record<ChannelType, string> = {
  amazon: "from-amber-600/90 via-orange-500/85 to-amber-700/90",
  shopify: "from-emerald-600/90 via-green-500/85 to-teal-600/90",
  tiktok: "from-pink-500/90 via-purple-500/85 to-violet-600/90",
};

const ChannelHero = ({ title, subtitle, channelType, backgroundImage }: ChannelHeroProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden mt-16">
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientStyles[channelType]}`} />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <TranslatedText>{title}</TranslatedText>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            <TranslatedText>{subtitle}</TranslatedText>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 font-semibold text-lg px-8 py-6"
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

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ChannelHero;
