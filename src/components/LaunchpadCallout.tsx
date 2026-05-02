import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Sparkles, Zap, PackageCheck } from "lucide-react";
import { TranslatedText } from "./TranslatedText";
import { HandUnderline, SunsetBlobs, TopoBackdrop, SunburstStamp } from "./wcu/WcuPrimitives";

const RocketArt = () => (
  <svg viewBox="0 0 420 360" className="w-full h-auto" aria-hidden="true">
    {/* runway */}
    <path
      d="M20 300 C 140 280, 280 320, 400 290"
      stroke="hsl(var(--wcu-sunset-deep))"
      strokeWidth="3"
      strokeDasharray="2 10"
      fill="none"
      strokeLinecap="round"
    />
    {/* contrail */}
    <path
      d="M70 320 C 140 240, 220 200, 300 120"
      stroke="hsl(var(--wcu-sunset))"
      strokeWidth="14"
      strokeLinecap="round"
      opacity="0.35"
      fill="none"
    />
    <path
      d="M70 320 C 140 240, 220 200, 300 120"
      stroke="hsl(var(--wcu-peach-deep))"
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.7"
      fill="none"
    />
    {/* rocket body */}
    <g transform="translate(280 60) rotate(35)">
      <path
        d="M0 30 C 0 10, 18 -10, 36 -10 C 54 -10, 72 10, 72 30 L 72 70 L 0 70 Z"
        fill="hsl(var(--wcu-sunset))"
      />
      <rect x="0" y="70" width="72" height="14" fill="hsl(var(--wcu-sunset-deep))" />
      <circle cx="36" cy="28" r="10" fill="hsl(var(--wcu-linen))" stroke="hsl(var(--wcu-ink))" strokeWidth="2" />
      <path d="M-14 70 L 0 50 L 0 84 Z" fill="hsl(var(--wcu-ink))" />
      <path d="M86 70 L 72 50 L 72 84 Z" fill="hsl(var(--wcu-ink))" />
      {/* flame */}
      <path
        d="M14 84 C 18 110, 28 120, 36 130 C 44 120, 54 110, 58 84 Z"
        fill="hsl(var(--wcu-peach-deep))"
      />
      <path
        d="M22 84 C 26 100, 32 108, 36 116 C 40 108, 46 100, 50 84 Z"
        fill="hsl(var(--wcu-sunset))"
      />
    </g>
    {/* stars */}
    <g fill="hsl(var(--wcu-sunset))">
      <circle cx="60" cy="80" r="3" />
      <circle cx="380" cy="200" r="3" />
      <circle cx="120" cy="180" r="2" />
      <circle cx="340" cy="60" r="2" />
    </g>
  </svg>
);

const LaunchpadCallout = () => {
  const navigate = useNavigate();

  const bullets = [
    { icon: Zap, text: "Onboarding in days, not months" },
    { icon: PackageCheck, text: "Receiving, prep & shipping under one roof" },
    { icon: Sparkles, text: "Custom playbook for your first 1,000 orders" },
  ];

  return (
    <section className="relative overflow-hidden py-24" style={{ background: "hsl(var(--wcu-cream))" }}>
      <TopoBackdrop />
      <SunsetBlobs />

      <div className="relative container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          {/* Left: copy */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[hsl(var(--wcu-line))] text-[hsl(var(--wcu-sunset-deep))] text-xs font-bold tracking-widest uppercase mb-5 shadow-sm">
              <Rocket className="w-3.5 h-3.5" />
              <TranslatedText>Westfield Launchpad</TranslatedText>
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--wcu-ink))] leading-[1.05]">
              <TranslatedText>From idea to</TranslatedText>{" "}
              <span className="relative inline-block">
                <span className="text-[hsl(var(--wcu-sunset-deep))]">
                  <TranslatedText>shipping</TranslatedText>
                </span>
                <HandUnderline className="absolute -bottom-3 left-0 w-full h-5" />
              </span>{" "}
              <TranslatedText>in weeks.</TranslatedText>
            </h2>

            <p className="mt-6 text-lg md:text-xl text-[hsl(var(--wcu-ink-soft))] leading-relaxed max-w-xl">
              <TranslatedText>
                A guided onboarding program built for new and growing brands. We set up your
                integrations, prep your inventory, and get your first orders out the door — fast.
              </TranslatedText>
            </p>

            <ul className="mt-8 space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[hsl(var(--wcu-line))] flex items-center justify-center shadow-sm">
                    <b.icon className="w-4 h-4 text-[hsl(var(--wcu-sunset-deep))]" />
                  </div>
                  <TranslatedText className="text-[hsl(var(--wcu-ink))] font-medium">
                    {b.text}
                  </TranslatedText>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/launchpad")}
                className="bg-[hsl(var(--wcu-sunset))] hover:bg-[hsl(var(--wcu-sunset-deep))] text-white font-bold px-8 py-6 text-lg shadow-lg shadow-[hsl(var(--wcu-sunset)/0.3)] hover:-translate-y-0.5 transition-all group"
              >
                <TranslatedText>Explore Launchpad</TranslatedText>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/contact")}
                className="border-2 border-[hsl(var(--wcu-ink))] bg-transparent text-[hsl(var(--wcu-ink))] hover:bg-[hsl(var(--wcu-ink))] hover:text-[hsl(var(--wcu-linen))] font-bold px-8 py-6 text-lg transition-all"
              >
                <TranslatedText>Talk to a Specialist</TranslatedText>
              </Button>
            </div>
          </div>

          {/* Right: rocket art card */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 z-10">
              <SunburstStamp size={80} />
            </div>
            <div
              className="relative rounded-[32px] bg-white p-8 md:p-12 border border-[hsl(var(--wcu-line))] shadow-[0_30px_60px_-20px_hsl(var(--wcu-sunset)/0.35)]"
              style={{ outline: "1.5px dashed hsl(var(--wcu-peach-deep))", outlineOffset: "-10px" }}
            >
              <RocketArt />
              <div className="mt-2 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--wcu-ink-soft))] font-semibold">
                  <TranslatedText>For new & scaling brands</TranslatedText>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchpadCallout;
