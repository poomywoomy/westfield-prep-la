import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Boxes, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "@/components/TranslatedText";
import {
  SiShopify,
  SiAmazon,
  SiWalmart,
  SiTiktok,
  SiEtsy,
} from "react-icons/si";

const floatingLogos = [
  { Icon: SiShopify, color: "#5E8E3E", delay: 0 },
  { Icon: SiAmazon, color: "#FF9900", delay: 0.1 },
  { Icon: SiWalmart, color: "#0057A0", delay: 0.2 },
  { Icon: SiTiktok, color: "#000000", delay: 0.3 },
  { Icon: SiEtsy, color: "#D5581D", delay: 0.4 },
];

const SalesChannelsHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 md:py-32 mt-16 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Floating Platform Logos */}
          <div className="flex justify-center gap-4 mb-8">
            {floatingLogos.map((logo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: logo.delay, duration: 0.5 }}
                className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer"
              >
                <logo.Icon size={24} color={logo.color} className="md:w-7 md:h-7" />
              </motion.div>
            ))}
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              <TranslatedText>10+ Platform Integrations</TranslatedText>
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
          >
            <TranslatedText>Every Platform.</TranslatedText>
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              <TranslatedText>One Warehouse.</TranslatedText>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            <TranslatedText>
              Connect your store in minutes. Orders flow automatically to our LA warehouse for fast, accurate fulfillment across all your sales channels.
            </TranslatedText>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-lg px-8 py-6"
              onClick={() => navigate("/contact")}
            >
              <TranslatedText>Get Started Free</TranslatedText>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/15 border-white/50 text-white hover:bg-white/25 text-lg px-8 py-6"
              onClick={() => navigate("/pricing")}
            >
              <Boxes className="w-5 h-5 mr-2" />
              <TranslatedText>View Pricing</TranslatedText>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span><TranslatedText>Real-time inventory sync</TranslatedText></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span><TranslatedText>Under 5 min setup</TranslatedText></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span><TranslatedText>No coding required</TranslatedText></span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default SalesChannelsHero;
