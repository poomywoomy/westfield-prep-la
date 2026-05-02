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
    { icon: Package, value: 2000000, suffix: "+", label: "Orders Fulfilled", subtext: "...and counting. Every single one on time." },
    { icon: Award, value: 99.8, suffix: "%", label: "Accuracy Rate", subtext: "Because close enough isn't good enough." },
    { icon: TrendingUp, value: 15, suffix: "+", label: "Years in Business", subtext: "We've seen it all. We've solved it all." },
    { icon: Users, value: 100, suffix: "+", label: "Active Clients", subtext: "Brands that trust us with their reputation." },
  ];

  return (
    <section
      ref={ref}
      className="relative py-16"
      style={{ background: "hsl(var(--wcu-linen))" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-6 border border-[hsl(var(--wcu-line))] hover:-translate-y-1 transition-all"
                style={{ outline: "1.5px dashed hsl(var(--wcu-peach-deep))", outlineOffset: "-6px" }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--wcu-peach))] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[hsl(var(--wcu-sunset-deep))]" aria-hidden="true" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-[hsl(var(--wcu-sunset-deep))]">
                    {hasAnimated ? (
                      <MetricCounter value={stat.value} duration={1500} suffix={stat.suffix} />
                    ) : (
                      <span>0{stat.suffix}</span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-[hsl(var(--wcu-ink))]">
                    <TranslatedText>{stat.label}</TranslatedText>
                  </div>
                  <div className="text-xs text-[hsl(var(--wcu-ink-soft))] italic">
                    <TranslatedText>{stat.subtext}</TranslatedText>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
