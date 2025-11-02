import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ProcessStep {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  time?: string;
  details?: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
  theme?: "shopify" | "amazon" | "tiktok" | "default";
}

const ProcessTimeline = ({ steps, theme = "default" }: ProcessTimelineProps) => {
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);

  const themeColors = {
    shopify: {
      gradient: "from-[hsl(var(--shopify-blue))] to-[hsl(var(--shopify-teal))]",
      border: "border-[hsl(var(--shopify-border))]",
      hover: "hover:border-[hsl(var(--shopify-blue))]/50",
      icon: "text-[hsl(var(--shopify-blue))]",
    },
    amazon: {
      gradient: "from-[hsl(var(--amazon-blue))] to-[hsl(var(--amazon-orange))]",
      border: "border-[hsl(var(--amazon-border))]",
      hover: "hover:border-[hsl(var(--amazon-orange))]/50",
      icon: "text-[hsl(var(--amazon-orange))]",
    },
    tiktok: {
      gradient: "from-[hsl(var(--tiktok-pink))] to-[hsl(var(--tiktok-cyan))]",
      border: "border-[hsl(var(--tiktok-border))]",
      hover: "hover:border-[hsl(var(--tiktok-pink))]/50",
      icon: "text-[hsl(var(--tiktok-pink))]",
    },
    default: {
      gradient: "from-primary to-secondary",
      border: "border-border",
      hover: "hover:border-primary/50",
      icon: "text-primary",
    },
  };

  const colors = themeColors[theme];

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.step}
              className={`${colors.border} ${colors.hover} hover:shadow-xl transition-all duration-300 cursor-pointer group bg-card`}
              onClick={() => setSelectedStep(step)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${colors.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                    {step.time && (
                      <span className={`text-xs font-medium ${colors.icon}`}>
                        ⏱ {step.time}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                <button className={`text-sm font-medium ${colors.icon} hover:underline`}>
                  Learn More →
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedStep} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              {selectedStep && (
                <>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${colors.gradient}`}>
                    <span className="text-white font-bold">{selectedStep.step}</span>
                  </div>
                  {selectedStep.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedStep && (
            <>
              <DialogDescription className="text-lg">{selectedStep.description}</DialogDescription>
              {selectedStep.time && (
                <div className={`inline-flex items-center gap-2 ${colors.icon} font-medium mt-2`}>
                  ⏱ Typical Duration: {selectedStep.time}
                </div>
              )}
              {selectedStep.details && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Additional Details:</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{selectedStep.details}</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProcessTimeline;
