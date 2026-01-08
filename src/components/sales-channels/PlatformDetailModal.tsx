import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Clock, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "@/components/TranslatedText";
import {
  SiShopify,
  SiAmazon,
  SiWalmart,
  SiTiktok,
  SiEtsy,
  SiWoo,
  SiBigcommerce,
  SiMagento,
  SiWix,
} from "react-icons/si";
import { IconType } from "react-icons";
import { PlatformData } from "./PlatformCard";

const platformIcons: Record<string, IconType | null> = {
  shopify: SiShopify,
  amazon: SiAmazon,
  walmart: SiWalmart,
  tiktok: SiTiktok,
  etsy: SiEtsy,
  woocommerce: SiWoo,
  bigcommerce: SiBigcommerce,
  magento: SiMagento,
  wix: SiWix,
  faire: null,
};

interface PlatformDetailModalProps {
  platform: PlatformData | null;
  open: boolean;
  onClose: () => void;
}

const PlatformDetailModal = ({ platform, open, onClose }: PlatformDetailModalProps) => {
  const navigate = useNavigate();

  if (!platform) return null;

  const Icon = platformIcons[platform.key];

  const handleGetStarted = () => {
    onClose();
    if (platform.path) {
      navigate(platform.path);
    } else {
      navigate("/contact");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-card rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header with Brand Color */}
            <div
              className="relative p-6 md:p-8"
              style={{
                background: `linear-gradient(135deg, ${platform.brandColor}15 0%, transparent 100%)`,
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Platform Header */}
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${platform.brandColor}20` }}
                >
                  {Icon ? (
                    <Icon size={48} color={platform.brandColor} />
                  ) : platform.key === "faire" ? (
                    <img
                      src="/integration-logos/faire-logo.png"
                      alt="Faire"
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                      style={{ backgroundColor: platform.brandColor }}
                    >
                      {platform.name.slice(0, 2)}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {platform.name}
                  </h2>
                  <p className="text-muted-foreground">{platform.tagline}</p>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{platform.setupTime} setup</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-primary">
                      <Zap className="w-4 h-4" />
                      <TranslatedText>Real-time sync</TranslatedText>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-0 md:pt-0 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  <TranslatedText>Overview</TranslatedText>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {platform.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  <TranslatedText>Key Features</TranslatedText>
                </h3>
                <ul className="space-y-2">
                  {platform.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: `${platform.brandColor}20` }}
                      >
                        <Check
                          className="w-3 h-3"
                          style={{ color: platform.brandColor }}
                        />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  <TranslatedText>Best For</TranslatedText>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {platform.bestFor.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${platform.brandColor}15`,
                        color: platform.brandColor,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleGetStarted}
              >
                <TranslatedText>Get Started</TranslatedText>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {platform.path && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    navigate(platform.path!);
                  }}
                >
                  <TranslatedText>View Full Page</TranslatedText>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlatformDetailModal;
