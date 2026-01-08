import { Clock, Target, RefreshCw, MapPin } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const metrics = [
  { icon: Clock, label: "24-Hour Turnaround", value: "24hr" },
  { icon: Target, label: "99.8% Accuracy", value: "99.8%" },
  { icon: RefreshCw, label: "Real-Time Sync", value: "Live" },
  { icon: MapPin, label: "Los Angeles, CA HQ", value: "LA" },
];

const TrustStrip = () => {
  return (
    <section className="py-8 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="flex items-center justify-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    <TranslatedText>{metric.label}</TranslatedText>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
