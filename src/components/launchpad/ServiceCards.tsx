import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { LaunchpadService } from "./launchpadServices";

type CardProps = {
  service: LaunchpadService;
  onOpen: () => void;
  index: number;
};

const wrap = (children: React.ReactNode, index: number, extra = "") => (
  <motion.button
    type="button"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.04 }}
    className={`group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl ${extra}`}
  >
    {children}
  </motion.button>
);

// 01 — Shopify: cream card with green watermark number
export const ShopifyCard = ({ service, onOpen, index }: CardProps) => {
  const Icon = service.icon;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#F4F8EC] border border-[#5E8E3E]/25 p-7"
    >
      <span className="absolute -right-4 -bottom-8 text-[180px] font-semibold leading-none text-[#5E8E3E]/10 select-none">
        {service.number}
      </span>
      <div className="relative flex items-center justify-between mb-8">
        <div className="w-11 h-11 rounded-xl bg-[#5E8E3E] flex items-center justify-center">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5E8E3E]">
          Shopify
        </span>
      </div>
      <h3 className="relative text-xl font-semibold text-[#0E2A12] mb-2 leading-snug">
        {service.name}
      </h3>
      <p className="relative text-[#3a5a3e] text-[14px] font-light leading-relaxed flex-1 mb-6">
        {service.summary}
      </p>
      <div className="relative inline-flex items-center gap-2 text-[#5E8E3E] text-[13px] font-semibold">
        Open build sheet
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
};

// 02 — Amazon: dark navy card, orange accent
export const AmazonCard = ({ service, onOpen, index }: CardProps) => {
  const Icon = service.icon;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#131A22] p-7 border border-[#FF9900]/20"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="w-11 h-11 rounded-xl bg-[#FF9900] flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#131A22]" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FF9900]">
          Service {service.number}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 leading-snug">
        {service.name}
        <span className="block w-12 h-[3px] bg-[#FF9900] mt-3" />
      </h3>
      <p className="text-white/60 text-[14px] font-light leading-relaxed flex-1 mb-6 mt-3">
        {service.summary}
      </p>
      <div className="inline-flex items-center gap-2 text-[#FF9900] text-[13px] font-semibold">
        See the checklist
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
};

// 03 — A+ Content: plum gradient
export const APlusCard = ({ service, onOpen, index }: CardProps) => {
  const Icon = service.icon;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl p-7 border border-[#6B2E8C]/30"
      style={{
        background:
          "linear-gradient(135deg, #F5ECF8 0%, #EFE3F5 50%, #E5D2EE 100%)",
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="w-11 h-11 rounded-full bg-[#6B2E8C] flex items-center justify-center">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B2E8C]">
          Module {service.number}
        </span>
      </div>
      <h3 className="text-2xl font-serif italic text-[#2A0F3A] mb-2 leading-snug">
        {service.name}
      </h3>
      <p className="text-[#4A2A5C] text-[14px] font-light leading-relaxed flex-1 mb-6">
        {service.summary}
      </p>
      <div className="inline-flex items-center gap-2 text-[#6B2E8C] text-[13px] font-semibold">
        Browse modules
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
};

// 04 — Storefront Design: editorial / oversized type
export const StorefrontCard = ({ service, onOpen, index }: CardProps) => {
  const Icon = service.icon;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#F4ECDD] border-2 border-[#1C1C1C] p-7"
    >
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#1C1C1C]/30">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1C1C1C]">
          ED. {service.number} / Design
        </div>
        <Icon className="h-5 w-5 text-[#1C1C1C]" />
      </div>
      <h3 className="text-3xl font-semibold tracking-[-0.03em] text-[#1C1C1C] leading-[0.95] mb-4">
        {service.name}.
      </h3>
      <p className="text-[#1C1C1C]/70 text-[14px] font-light leading-relaxed flex-1 mb-6">
        {service.summary}
      </p>
      <div className="inline-flex items-center gap-2 text-[#1C1C1C] text-[13px] font-semibold border-b border-[#1C1C1C] pb-1 self-start">
        Read the spread
        <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </motion.button>
  );
};

// 05 — 3D Imaging: blueprint grid
export const ImagingCard = ({ service, onOpen, index }: CardProps) => {
  const Icon = service.icon;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#08111F] p-7 border border-[#2B6CFF]/30"
      style={{
        backgroundImage:
          "linear-gradient(rgba(43,108,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,108,255,0.08) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundColor: "#08111F",
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="w-11 h-11 rounded-md bg-[#2B6CFF] flex items-center justify-center shadow-[0_0_20px_rgba(43,108,255,0.5)]">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#2B6CFF]">
          R-{service.number}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 leading-snug">
        {service.name}
      </h3>
      <p className="text-white/55 text-[14px] font-light leading-relaxed flex-1 mb-6">
        {service.summary}
      </p>
      <div className="inline-flex items-center gap-2 text-[#2B6CFF] text-[13px] font-mono font-semibold">
        ▸ View render queue
      </div>
    </motion.button>
  );
};

// 06 — Studio Photography: terracotta with film strip
export const PhotoCard = ({ service, onOpen, index }: CardProps) => {
  const Icon = service.icon;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#F1DDD2] p-7 border border-[#C2654A]/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-11 h-11 rounded-full bg-[#2A140C] flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#C2654A]" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2A140C]">
          Roll · {service.number}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-[#2A140C] mb-2 leading-snug">
        {service.name}
      </h3>
      <p className="text-[#2A140C]/70 text-[14px] font-light leading-relaxed flex-1 mb-6">
        {service.summary}
      </p>
      {/* Film strip footer */}
      <div className="flex gap-1.5 -mx-1 mb-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 aspect-[3/2] rounded-sm bg-[#2A140C]/80 relative overflow-hidden"
          >
            <div className="absolute inset-1 border border-[#C2654A]/30 rounded-[2px]" />
          </div>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 text-[#C2654A] text-[13px] font-semibold">
        Open contact sheet
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
};

// 07 — Listing copy: typed page with highlighter
export const ListingCard = ({ service, onOpen, index }: CardProps) => {
  const Icon = service.icon;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-white p-7 border border-[#0E0E0E]/15"
      style={{
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, rgba(14,14,14,0.05) 27px, rgba(14,14,14,0.05) 28px)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-11 h-11 rounded-md bg-[#0E0E0E] flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#FFF59A]" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0E0E0E]/60">
          DRAFT v{service.number}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-[#0E0E0E] mb-3 leading-snug">
        <span className="bg-[#FFF59A] px-1 box-decoration-clone">
          {service.name}
        </span>
      </h3>
      <p className="text-[#0E0E0E]/65 text-[14px] font-light leading-relaxed flex-1 mb-6 font-mono">
        {service.summary}
      </p>
      <div className="inline-flex items-center gap-2 text-[#0E0E0E] text-[13px] font-semibold">
        Open the notebook
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
};

export const ServiceCard = ({ service, onOpen, index }: CardProps) => {
  switch (service.theme.cardVariant) {
    case "shopify":
      return <ShopifyCard service={service} onOpen={onOpen} index={index} />;
    case "amazon":
      return <AmazonCard service={service} onOpen={onOpen} index={index} />;
    case "aplus":
      return <APlusCard service={service} onOpen={onOpen} index={index} />;
    case "storefront":
      return <StorefrontCard service={service} onOpen={onOpen} index={index} />;
    case "imaging":
      return <ImagingCard service={service} onOpen={onOpen} index={index} />;
    case "photo":
      return <PhotoCard service={service} onOpen={onOpen} index={index} />;
    case "listing":
      return <ListingCard service={service} onOpen={onOpen} index={index} />;
  }
};
