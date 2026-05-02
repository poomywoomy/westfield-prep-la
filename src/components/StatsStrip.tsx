import { useEffect, useRef, useState } from "react";
import { Package, Users, TrendingUp, Award } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { MetricCounter } from "@/components/ui/metric-counter";
import { TranslatedText } from "./TranslatedText";
import { IconBadge } from "./home/HomePrimitives";

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
    <section ref={ref} className="relative py-16 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border max-w-6xl mx-auto rounded-xl overflow-hidden border border-border">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-background p-7 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <IconBadge size="md">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </IconBadge>
                  <div className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                    {hasAnimated ? (
                      <MetricCounter value={stat.value} duration={1500} suffix={stat.suffix} />
                    ) : (
                      <span>0{stat.suffix}</span>
                    )}
                  </div>
                  <div className="h-[3px] w-8 bg-secondary rounded-full" />
                  <div className="text-sm font-bold text-primary">
                    <TranslatedText>{stat.label}</TranslatedText>
                  </div>
                  <div className="text-xs text-muted-foreground">
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
