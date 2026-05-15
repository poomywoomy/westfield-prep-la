import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "navy" | "ink" | "light" | "image";

interface BentoTileProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  imageSrc?: string;
  imageAlt?: string;
  eyebrow?: string;
  delay?: number;
  as?: "div" | "article" | "section";
}

const variantClasses: Record<Variant, string> = {
  navy:
    "bg-[hsl(var(--surface-navy))] text-white border border-white/10 shadow-[0_30px_80px_-30px_hsl(var(--surface-navy)/0.6)]",
  ink:
    "bg-[hsl(var(--surface-navy-2))] text-white border border-white/10",
  light:
    "bg-white text-[hsl(var(--surface-navy))] border border-black/5 shadow-[0_20px_60px_-30px_hsl(var(--surface-navy)/0.25)]",
  image:
    "text-white border border-white/10 overflow-hidden bg-[hsl(var(--surface-navy))]",
};

export const BentoTile = ({
  children,
  className,
  variant = "navy",
  imageSrc,
  imageAlt = "",
  eyebrow,
  delay = 0,
  as: Tag = "div",
}: BentoTileProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative rounded-3xl overflow-hidden",
        variantClasses[variant],
        className
      )}
    >
      <Tag className="relative h-full w-full">
        {variant === "image" && imageSrc && (
          <>
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-navy))] via-[hsl(var(--surface-navy))]/70 to-transparent" />
          </>
        )}
        {(variant === "navy" || variant === "ink") && (
          <div className="absolute inset-0 bento-grid-faint opacity-60 pointer-events-none" />
        )}
        <div className="relative h-full p-7 md:p-8 flex flex-col">
          {eyebrow && (
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase mb-4 opacity-70">
              {eyebrow}
            </span>
          )}
          {children}
        </div>
      </Tag>
    </motion.div>
  );
};

export default BentoTile;
