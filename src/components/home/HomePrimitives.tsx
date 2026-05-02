// Professional brand primitives used across the homepage.
// Brand palette: Midnight Navy (--primary) + Fulfillment Orange (--secondary)
// Clean, Stripe/Apple-like — no hand-drawn or playful elements.

import React from "react";
import { TranslatedText } from "@/components/TranslatedText";

export const SectionHeading = ({
  eyebrow,
  title,
  accent,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  accent?: string;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
}) => (
  <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-14`}>
    {eyebrow && (
      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase bg-secondary/10 text-secondary mb-4">
        <TranslatedText>{eyebrow}</TranslatedText>
      </span>
    )}
    <h2 className="text-3xl md:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
      {title}
      {accent && (
        <>
          {" "}
          <span className="relative inline-block">
            <span className="text-secondary">{accent}</span>
            <span className="absolute left-0 -bottom-1 h-[3px] w-full bg-secondary rounded-full" />
          </span>
        </>
      )}
    </h2>
    {subtitle && (
      <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

export const IconBadge = ({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = {
    sm: "w-10 h-10 rounded-lg",
    md: "w-12 h-12 rounded-xl",
    lg: "w-14 h-14 rounded-xl",
  };
  return (
    <div
      className={`${sizes[size]} bg-secondary/10 text-secondary flex items-center justify-center ring-1 ring-secondary/20`}
    >
      {children}
    </div>
  );
};

export const GradientDivider = ({ className = "" }: { className?: string }) => (
  <div
    className={`h-px w-full ${className}`}
    style={{
      background:
        "linear-gradient(to right, transparent, hsl(var(--primary)/0.15), hsl(var(--secondary)/0.4), hsl(var(--primary)/0.15), transparent)",
    }}
    aria-hidden="true"
  />
);

// Subtle dotted grid backdrop for hero/CTA sections
export const GridBackdrop = ({
  className = "",
  color = "currentColor",
  opacity = 0.08,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    aria-hidden="true"
    style={{ opacity }}
  >
    <defs>
      <pattern id="hp-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.2" fill={color} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hp-dots)" />
  </svg>
);
