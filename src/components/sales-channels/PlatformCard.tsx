import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Zap } from "lucide-react";
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

export interface PlatformData {
  key: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  bestFor: string[];
  setupTime: string;
  featured?: boolean;
  path?: string;
  brandColor: string;
}

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

interface PlatformCardProps {
  platform: PlatformData;
  onClick: () => void;
  index: number;
}

const PlatformCard = ({ platform, onClick, index }: PlatformCardProps) => {
  const Icon = platformIcons[platform.key];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onClick}
      className={`group relative cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        platform.featured
          ? "col-span-1 md:col-span-2 border-primary/50 bg-gradient-to-br from-card via-card to-primary/10"
          : "border-border hover:border-primary/40 bg-card"
      }`}
    >
      {/* Background Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${platform.brandColor}20 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className={`relative z-10 ${platform.featured ? "p-8" : "p-6"}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Icon Container */}
            <div
              className={`${
                platform.featured ? "w-16 h-16" : "w-12 h-12"
              } rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
              style={{ backgroundColor: `${platform.brandColor}15` }}
            >
              {Icon ? (
                <Icon
                  size={platform.featured ? 32 : 24}
                  color={platform.brandColor}
                />
              ) : platform.key === "faire" ? (
                <img
                  src="/integration-logos/faire-logo.png"
                  alt="Faire"
                  className={`${platform.featured ? "w-10 h-10" : "w-7 h-7"} object-contain`}
                />
              ) : (
                <div
                  className="font-bold text-white rounded-lg w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: platform.brandColor }}
                >
                  {platform.name.slice(0, 2)}
                </div>
              )}
            </div>

            <div>
              <h3
                className={`font-bold text-foreground ${
                  platform.featured ? "text-2xl" : "text-lg"
                }`}
              >
                {platform.name}
              </h3>
              <p className="text-sm text-muted-foreground">{platform.tagline}</p>
            </div>
          </div>

          {platform.featured && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <TranslatedText>Featured</TranslatedText>
            </span>
          )}
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{platform.setupTime} setup</span>
          </div>
          {platform.featured && (
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <Check className="w-3.5 h-3.5" />
              <TranslatedText>Real-time sync</TranslatedText>
            </div>
          )}
        </div>

        {/* Best For Tags (Featured only) */}
        {platform.featured && platform.bestFor.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {platform.bestFor.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
          <TranslatedText>Learn More</TranslatedText>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Bottom Border Glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: platform.brandColor }}
      />
    </motion.div>
  );
};

export default PlatformCard;
