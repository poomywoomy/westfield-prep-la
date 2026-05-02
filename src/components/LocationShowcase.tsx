import { MapPin, Anchor, TrendingUp, Globe, Truck, Zap } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const LaMap = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden="true">
    <defs>
      <radialGradient id="locGlow" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
        <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
      </radialGradient>
      <pattern id="locDots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="white" opacity="0.18" />
      </pattern>
    </defs>
    <rect width="400" height="400" fill="hsl(var(--primary))" />
    <rect width="400" height="400" fill="url(#locDots)" />
    <circle cx="200" cy="240" r="180" fill="url(#locGlow)" />

    {/* Simplified California outline */}
    <path
      d="M120 30 L 175 28 L 200 50 L 205 85 L 220 110 L 235 130 L 250 160 L 253 195 L 245 225 L 258 255 L 268 285 L 258 315 L 232 330 L 195 325 L 168 305 L 142 282 L 128 250 L 113 220 L 98 188 L 88 152 L 92 115 L 102 75 L 120 30 Z"
      fill="hsl(var(--primary)/0.5)"
      stroke="white"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />

    {/* Concentric pulse rings on LA */}
    <g transform="translate(205, 268)">
      <circle r="60" fill="none" stroke="hsl(var(--secondary))" strokeOpacity="0.3" strokeWidth="1.5" />
      <circle r="40" fill="none" stroke="hsl(var(--secondary))" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle r="22" fill="hsl(var(--secondary))" fillOpacity="0.2" />
      <circle r="10" fill="hsl(var(--secondary))" />
      <circle r="4" fill="white" />
    </g>

    {/* Label */}
    <g transform="translate(245, 270)">
      <text fontSize="13" fontWeight="700" fill="white">Los Angeles</text>
      <text y="16" fontSize="10" fill="white" opacity="0.65">Westfield Prep Center</text>
    </g>

    {/* Connection lines to other US points */}
    <g stroke="hsl(var(--secondary))" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 4" fill="none">
      <line x1="205" y1="268" x2="380" y2="180" />
      <line x1="205" y1="268" x2="380" y2="280" />
      <line x1="205" y1="268" x2="380" y2="350" />
    </g>
    <g fill="hsl(var(--secondary))">
      <circle cx="380" cy="180" r="3" />
      <circle cx="380" cy="280" r="3" />
      <circle cx="380" cy="350" r="3" />
    </g>
  </svg>
);

const StatTile = ({ value, label, sub }: { value: string; label: string; sub: string }) => (
  <div className="p-5 rounded-xl bg-background border border-border">
    <div className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{value}</div>
    <div className="mt-1 text-sm font-bold text-primary">
      <TranslatedText>{label}</TranslatedText>
    </div>
    <div className="text-xs text-muted-foreground mt-0.5">
      <TranslatedText>{sub}</TranslatedText>
    </div>
  </div>
);

const LocationShowcase = () => {
  return (
    <section className="relative py-0 bg-background overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[640px]">
        {/* LEFT — full-bleed map */}
        <div className="relative bg-primary min-h-[400px] lg:min-h-[640px]">
          <LaMap />
        </div>

        {/* RIGHT — content */}
        <div className="flex items-center px-6 md:px-12 lg:px-16 py-16 lg:py-20">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-secondary">
              Location · 90001
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-[0.95] tracking-tight">
              <TranslatedText>Why LA?</TranslatedText>
              <br />
              <span className="font-display italic font-normal text-secondary">
                <TranslatedText>Because location is logistics.</TranslatedText>
              </span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              <TranslatedText>
                Closer to the port. Faster to the customer. 15+ years and 2M+ orders later, we know exactly why LA is the smartest place to base your fulfillment.
              </TranslatedText>
            </p>

            {/* Stat tiles grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <StatTile value="22mi" label="To Port of LA" sub="40% of US imports" />
              <StatTile value="2-day" label="To West Coast" sub="Pacific region" />
              <StatTile value="50" label="States covered" sub="All from one hub" />
              <StatTile value="6+" label="Amazon FCs" sub="Within same-day reach" />
            </div>

            {/* Quick badges */}
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                { icon: Anchor, text: "Port Adjacent" },
                { icon: TrendingUp, text: "West Coast Hub" },
                { icon: Globe, text: "Asia-Pacific Gateway" },
                { icon: Truck, text: "Nationwide" },
                { icon: Zap, text: "Same-Day Cutoff 2pm" },
                { icon: MapPin, text: "Los Angeles, CA" },
              ].map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-primary text-xs font-bold border border-border"
                >
                  <b.icon className="w-3.5 h-3.5 text-secondary" />
                  <TranslatedText>{b.text}</TranslatedText>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationShowcase;
