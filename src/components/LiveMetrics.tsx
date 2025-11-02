import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface Metric {
  label: string;
  value: number;
  type: "counter" | "percentage";
}

interface LiveMetricsProps {
  metrics: Metric[];
  platformTheme: "shopify" | "amazon" | "tiktok";
}

const LiveMetrics = ({ metrics, platformTheme }: LiveMetricsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const themeColors = {
    shopify: {
      gradient: "from-[hsl(var(--shopify-blue))] via-[hsl(var(--shopify-teal))] to-[hsl(var(--shopify-blue-dark))]",
      cardBorder: "border-[hsl(var(--shopify-border))]",
      accent: "bg-[hsl(var(--shopify-teal))]",
    },
    amazon: {
      gradient: "from-blue-600 via-blue-700 to-orange-600",
      cardBorder: "border-blue-200/50",
      accent: "bg-blue-600",
    },
    tiktok: {
      gradient: "from-pink-600 via-cyan-600 to-yellow-600",
      cardBorder: "border-pink-200/50",
      accent: "bg-pink-600",
    },
  };

  const theme = themeColors[platformTheme];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const AnimatedCounter = ({ value, type }: { value: number; type: "counter" | "percentage" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [isVisible, value, type]);

    if (type === "percentage") {
      return <span>{count.toFixed(1)}%</span>;
    }

    return <span>{count.toLocaleString()}</span>;
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Live Performance Data</span>
          </div>
          <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
            Real-Time Performance Metrics
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our current operational statistics updated in real-time
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {metrics.map((metric, idx) => (
            <Card
              key={idx}
              className={`${theme.cardBorder} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
            >
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                <div className="relative">
                  <div className={`text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                    {isVisible ? (
                      <AnimatedCounter value={metric.value} type={metric.type} />
                    ) : (
                      <span>0</span>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">{metric.label}</p>
                  {metric.type === "percentage" && (
                    <div className="w-full bg-muted rounded-full h-2 mt-4 overflow-hidden">
                      <div
                        className={`h-full ${theme.accent} rounded-full transition-all duration-2000 ease-out`}
                        style={{ width: isVisible ? `${metric.value}%` : "0%" }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveMetrics;
