import { useEffect, useRef, useState } from "react";
import { Package, Users, TrendingUp, Award } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { MetricCounter } from "@/components/ui/metric-counter";
import { TranslatedText } from "./TranslatedText";

const StatsStrip = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.3 });
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible && !hasAnimated) setHasAnimated(true);
  }, [isVisible, hasAnimated]);

  const stats = [
    { icon: Package, value: 2000000, suffix: "+", label: "Orders fulfilled", subtext: "Every single one on time." },
    { icon: Award, value: 99.8, suffix: "%", label: "Accuracy rate", subtext: "Close enough isn't good enough." },
    { icon: TrendingUp, value: 15, suffix: "+", label: "Years in business", subtext: "We've seen and solved it all." },
    { icon: Users, value: 100, suffix: "+", label: "Active brands", subtext: "Trusted with their reputation." },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-24 bg-primary text-primary-foreground overflow-hidden"
    >
      {/* Soft glow */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-25 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--secondary)), transparent 65%)",
        }}
        aria-hidden="true"
      />
      {/* Dotted texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-14">
          <span className="font-display italic text-secondary text-2xl">By the numbers</span>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 relative">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`px-4 md:px-8 py-8 text-center relative ${
                index > 0 ? "lg:border-l border-l-white/10" : ""
              } ${index === 1 || index === 3 ? "border-l border-l-white/10 lg:border-l" : ""}`}
            >
              {/* Tiny accent line */}
              <div className="mx-auto h-1 w-10 bg-secondary rounded-full mb-5" />

              {/* OVERSIZED counter */}
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-none">
                {hasAnimated ? (
                  <MetricCounter value={stat.value} duration={1500} suffix={stat.suffix} />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>

              <div className="mt-4 text-sm md:text-base font-bold uppercase tracking-[0.16em] text-white/95">
                <TranslatedText>{stat.label}</TranslatedText>
              </div>
              <div className="mt-2 text-xs md:text-sm text-white/55 font-display italic">
                <TranslatedText>{stat.subtext}</TranslatedText>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
