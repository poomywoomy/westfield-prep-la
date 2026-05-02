import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, CheckCircle, Clock, Plug, Shield, Star, Truck, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import CalendlyModal from "./CalendlyModal";
import { TranslatedText } from "./TranslatedText";
import { HandUnderline, SunsetBlobs, TopoBackdrop, SunburstStamp } from "./wcu/WcuPrimitives";

const WarehouseSkyline = () => (
  <svg viewBox="0 0 600 320" className="w-full h-auto" aria-hidden="true">
    {/* sun */}
    <circle cx="470" cy="110" r="62" fill="hsl(var(--wcu-peach-deep))" opacity="0.85" />
    <circle cx="470" cy="110" r="42" fill="hsl(var(--wcu-sunset))" />
    {/* mountains */}
    <path d="M0 230 L 120 140 L 220 220 L 320 130 L 430 230 L 540 170 L 600 220 L 600 320 L 0 320 Z"
      fill="hsl(var(--wcu-ink))" opacity="0.18" />
    <path d="M0 250 L 90 200 L 200 250 L 300 200 L 410 260 L 520 210 L 600 250 L 600 320 L 0 320 Z"
      fill="hsl(var(--wcu-ink))" opacity="0.28" />
    {/* warehouse */}
    <g>
      <rect x="120" y="200" width="360" height="90" fill="hsl(var(--wcu-linen))" stroke="hsl(var(--wcu-ink))" strokeWidth="2.5" />
      <path d="M120 200 L 200 165 L 400 165 L 480 200 Z" fill="hsl(var(--wcu-cream))" stroke="hsl(var(--wcu-ink))" strokeWidth="2.5" />
      {/* doors */}
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={150 + i * 80} y="225" width="55" height="60" fill="hsl(var(--wcu-sunset))" stroke="hsl(var(--wcu-ink))" strokeWidth="2" />
      ))}
      {/* windows on roof */}
      <rect x="240" y="178" width="30" height="14" fill="hsl(var(--wcu-peach))" stroke="hsl(var(--wcu-ink))" strokeWidth="1.5" />
      <rect x="330" y="178" width="30" height="14" fill="hsl(var(--wcu-peach))" stroke="hsl(var(--wcu-ink))" strokeWidth="1.5" />
    </g>
    {/* truck */}
    <g transform="translate(40 240)">
      <rect x="0" y="0" width="70" height="35" fill="hsl(var(--wcu-cream))" stroke="hsl(var(--wcu-ink))" strokeWidth="2" />
      <rect x="70" y="10" width="25" height="25" fill="hsl(var(--wcu-sunset))" stroke="hsl(var(--wcu-ink))" strokeWidth="2" />
      <circle cx="20" cy="40" r="7" fill="hsl(var(--wcu-ink))" />
      <circle cx="80" cy="40" r="7" fill="hsl(var(--wcu-ink))" />
    </g>
    {/* boxes */}
    <g transform="translate(500 250)">
      <rect x="0" y="0" width="28" height="28" fill="hsl(var(--wcu-peach-deep))" stroke="hsl(var(--wcu-ink))" strokeWidth="1.5" />
      <rect x="32" y="-12" width="28" height="40" fill="hsl(var(--wcu-sunset))" stroke="hsl(var(--wcu-ink))" strokeWidth="1.5" />
      <line x1="0" y1="14" x2="28" y2="14" stroke="hsl(var(--wcu-ink))" strokeWidth="1" />
    </g>
  </svg>
);

const PremiumHero = () => {
  const navigate = useNavigate();
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const goToContact = () => navigate("/contact");

  const handleScheduleCall = () => {
    trackEvent("schedule_call_clicked", { location: "hero" });
    setCalendlyOpen(true);
  };

  const featureTags = [
    { icon: Clock, text: "24hr Turnaround" },
    { icon: Truck, text: "No Minimums" },
    { icon: Plug, text: "Plug & Play" },
    { icon: Shield, text: "99.8% Accuracy" },
  ];

  const trustBadges = [
    { icon: Shield, text: "SOC2 Ready" },
    { icon: Zap, text: "WMS-Integrated" },
    { icon: Star, text: "4.9★ Rating" },
    { icon: CheckCircle, text: "99.99% Uptime" },
  ];

  return (
    <>
      <section
        className="relative w-full overflow-hidden"
        style={{ background: "hsl(var(--wcu-linen))" }}
      >
        <div className="absolute inset-0 wcu-paper-grain opacity-50" aria-hidden="true" />
        <TopoBackdrop />
        <SunsetBlobs />

        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center max-w-7xl mx-auto">
            {/* LEFT: copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[hsl(var(--wcu-line))] shadow-sm mb-6">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--wcu-sunset))] animate-pulse" />
                <TranslatedText className="text-xs font-bold tracking-widest uppercase text-[hsl(var(--wcu-sunset-deep))]">
                  Los Angeles 3PL
                </TranslatedText>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-[hsl(var(--wcu-ink))] tracking-tight">
                <TranslatedText>Ship 3x Faster with a</TranslatedText>{" "}
                <span className="relative inline-block">
                  <span className="text-[hsl(var(--wcu-sunset-deep))]">
                    <TranslatedText>Shopify + Amazon-Ready 3PL</TranslatedText>
                  </span>
                  <HandUnderline className="absolute -bottom-3 left-0 w-full h-5" />
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-[hsl(var(--wcu-ink-soft))] leading-relaxed max-w-xl">
                <TranslatedText>
                  Full-service fulfillment & FBA prep in 24 hours. Transparent pricing. No monthly minimums.
                </TranslatedText>
              </p>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {trustBadges.map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[hsl(var(--wcu-line))] shadow-sm"
                  >
                    <badge.icon className="w-3.5 h-3.5 text-[hsl(var(--wcu-sunset-deep))]" />
                    <TranslatedText className="text-xs font-semibold text-[hsl(var(--wcu-ink))]">
                      {badge.text}
                    </TranslatedText>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={goToContact}
                  size="lg"
                  className="bg-[hsl(var(--wcu-sunset))] hover:bg-[hsl(var(--wcu-sunset-deep))] text-white font-bold text-lg px-8 py-7 shadow-lg shadow-[hsl(var(--wcu-sunset)/0.3)] hover:-translate-y-0.5 transition-all group"
                >
                  <TranslatedText>Get Free Fulfillment Audit</TranslatedText>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => navigate("/pricing")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-[hsl(var(--wcu-ink))] bg-white text-[hsl(var(--wcu-ink))] hover:bg-[hsl(var(--wcu-ink))] hover:text-[hsl(var(--wcu-linen))] font-bold text-lg px-8 py-7 transition-all"
                >
                  <TranslatedText>View Pricing</TranslatedText>
                </Button>
              </div>

              <button
                onClick={handleScheduleCall}
                className="mt-5 flex items-center gap-2 text-[hsl(var(--wcu-ink-soft))] hover:text-[hsl(var(--wcu-sunset-deep))] transition-colors group"
              >
                <Calendar className="w-4 h-4" />
                <TranslatedText className="text-sm font-medium underline-offset-4 group-hover:underline">
                  Or schedule a call with our team
                </TranslatedText>
              </button>

              {/* Feature pills */}
              <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
                {featureTags.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(var(--wcu-peach))] border border-[hsl(var(--wcu-line))] hover:-translate-y-0.5 transition-all"
                  >
                    <tag.icon className="w-4 h-4 text-[hsl(var(--wcu-sunset-deep))]" />
                    <TranslatedText className="text-sm font-semibold text-[hsl(var(--wcu-ink))]">
                      {tag.text}
                    </TranslatedText>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: handcrafted illustration */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 z-10">
                <SunburstStamp size={84} />
              </div>
              <div
                className="relative rounded-[32px] bg-white p-6 md:p-10 border border-[hsl(var(--wcu-line))] shadow-[0_30px_60px_-20px_hsl(var(--wcu-sunset)/0.35)]"
                style={{ outline: "1.5px dashed hsl(var(--wcu-peach-deep))", outlineOffset: "-10px" }}
              >
                <WarehouseSkyline />
                <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-dashed border-[hsl(var(--wcu-line))]">
                  {[
                    { v: "2M+", l: "Orders" },
                    { v: "99.8%", l: "Accuracy" },
                    { v: "15+", l: "Years" },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-[hsl(var(--wcu-sunset-deep))]">{s.v}</div>
                      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--wcu-ink-soft))] font-semibold">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CalendlyModal open={calendlyOpen} onOpenChange={setCalendlyOpen} />
    </>
  );
};

export default PremiumHero;
