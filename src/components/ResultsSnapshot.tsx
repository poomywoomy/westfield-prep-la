import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Target } from "lucide-react";

interface Result {
  industry: string;
  challenge: string;
  solution: string;
  results: string;
}

interface ResultsSnapshotProps {
  results: Result[];
  platformTheme: "shopify" | "amazon" | "tiktok";
}

const ResultsSnapshot = ({ results, platformTheme }: ResultsSnapshotProps) => {
  const themeColors = {
    shopify: {
      gradient: "from-[hsl(var(--shopify-blue))] to-[hsl(var(--shopify-teal))]",
      border: "border-[hsl(var(--shopify-border))]",
      icon: "text-[hsl(var(--shopify-teal))]",
      bg: "from-[hsl(var(--shopify-accent))]/40 to-background",
    },
    amazon: {
      gradient: "from-blue-600 to-orange-600",
      border: "border-blue-200/50",
      icon: "text-blue-600",
      bg: "from-blue-50/30 to-background",
    },
    tiktok: {
      gradient: "from-pink-600 to-cyan-600",
      border: "border-pink-200/50",
      icon: "text-pink-600",
      bg: "from-pink-50/30 to-background",
    },
  };

  const theme = themeColors[platformTheme];

  return (
    <section className={`py-20 bg-gradient-to-b ${theme.bg}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
            Proven Results Across Industries
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real fulfillment capabilities delivering measurable outcomes
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {results.map((result, idx) => (
            <Card
              key={idx}
              className={`${theme.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <CardHeader className="relative">
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${theme.gradient} text-white rounded-lg px-3 py-1.5 mb-3 text-sm font-semibold shadow-md`}>
                  {result.industry}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <Target className={`h-5 w-5 ${theme.icon} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Challenge</p>
                      <p className="text-sm leading-relaxed mt-1">{result.challenge}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <TrendingUp className={`h-5 w-5 ${theme.icon} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Solution</p>
                      <p className="text-sm leading-relaxed mt-1">{result.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`h-5 w-5 ${theme.icon} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Results</p>
                      <p className="text-sm font-semibold leading-relaxed mt-1">{result.results}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSnapshot;
