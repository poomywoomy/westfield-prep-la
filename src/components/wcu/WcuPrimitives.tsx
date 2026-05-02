// Shared "Soft Linen & Sunset" visual primitives used across the homepage
// and Why Choose Us page. Pure SVG/CSS — no external deps.

import React from "react";

export const HandUnderline = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 360 28" className={className} fill="none" aria-hidden="true">
    <path
      d="M4 18 C 70 4, 150 4, 220 14 S 330 24, 356 10"
      stroke="hsl(var(--wcu-sunset))"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M14 24 C 110 18, 230 18, 340 22"
      stroke="hsl(var(--wcu-sunset-deep))"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.55"
    />
  </svg>
);

export const OrganicDivider = ({
  flip = false,
  fromColor = "hsl(var(--wcu-linen))",
  toColor = "hsl(var(--wcu-cream))",
}: {
  flip?: boolean;
  fromColor?: string;
  toColor?: string;
}) => (
  <div
    className="w-full overflow-hidden leading-[0]"
    style={{ background: fromColor, transform: flip ? "rotate(180deg)" : undefined }}
    aria-hidden="true"
  >
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[90px]">
      <path
        d="M0,40 C240,90 520,0 760,40 C1000,80 1220,20 1440,50 L1440,90 L0,90 Z"
        fill={toColor}
      />
    </svg>
  </div>
);

// Soft sunset blob backdrop
export const SunsetBlobs = ({ className = "" }: { className?: string }) => (
  <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
    <div
      className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full opacity-60 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, hsl(var(--wcu-peach-deep)/0.55), transparent 65%)",
      }}
    />
    <div
      className="absolute -bottom-32 -right-20 w-[600px] h-[600px] rounded-full opacity-50 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, hsl(var(--wcu-sunset)/0.35), transparent 65%)",
      }}
    />
    <div
      className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-40 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, hsl(var(--wcu-peach)/0.6), transparent 70%)",
      }}
    />
  </div>
);

// Topographic line pattern (very subtle)
export const TopoBackdrop = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute inset-0 w-full h-full opacity-[0.07] ${className}`}
    viewBox="0 0 1200 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <pattern id="topo" x="0" y="0" width="1200" height="600" patternUnits="userSpaceOnUse">
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d={`M0,${50 + i * 50} C200,${30 + i * 50} 400,${80 + i * 50} 600,${50 + i * 50} S1000,${20 + i * 50} 1200,${60 + i * 50}`}
            stroke="hsl(var(--wcu-ink))"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </pattern>
    </defs>
    <rect width="1200" height="600" fill="url(#topo)" />
  </svg>
);

// Sunburst stamp (used as little badge accent)
export const SunburstStamp = ({ className = "", size = 72 }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    <g stroke="hsl(var(--wcu-sunset))" strokeWidth="2" strokeLinecap="round">
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * Math.PI) / 8;
        const x1 = 50 + Math.cos(a) * 28;
        const y1 = 50 + Math.sin(a) * 28;
        const x2 = 50 + Math.cos(a) * 42;
        const y2 = 50 + Math.sin(a) * 42;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
    <circle cx="50" cy="50" r="22" fill="hsl(var(--wcu-sunset))" />
  </svg>
);

// Stitched-border helper for cards: just a className combo
export const stitchedCard =
  "rounded-2xl bg-white border border-[hsl(var(--wcu-line))] shadow-[0_2px_0_0_hsl(var(--wcu-line))] [outline:1.5px_dashed_hsl(var(--wcu-peach-deep))] [outline-offset:-6px]";

// Section heading with hand underline
export const WcuSectionHeading = ({
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
  <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-12`}>
    {eyebrow && (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-[hsl(var(--wcu-peach))] text-[hsl(var(--wcu-sunset-deep))] mb-4">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl md:text-5xl font-bold text-[hsl(var(--wcu-ink))] leading-[1.1]">
      {title}
      {accent && (
        <span className="relative inline-block ml-2">
          <span className="text-[hsl(var(--wcu-sunset-deep))]">{accent}</span>
          <HandUnderline className="absolute -bottom-3 left-0 w-full h-5" />
        </span>
      )}
    </h2>
    {subtitle && (
      <p className="mt-6 text-lg md:text-xl text-[hsl(var(--wcu-ink-soft))] leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);
