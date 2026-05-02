import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Database, PackageCheck, Truck } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import { SectionHeading } from "./home/HomePrimitives";

const HowItWorksProcess = () => {
  const navigate = useNavigate();

  const steps = [
    { icon: Package, number: "01", title: "RECEIVE", description: "Ship it to us, we handle the rest. Same-day receiving with complete photo documentation so you know exactly what arrived.", stat: "Same Day", statLabel: "Processing", metric: "99.8%", metricLabel: "Accuracy" },
    { icon: Database, number: "02", title: "STORE", description: "Your products, organized and tracked in real-time. Strategic placement means faster picking and fewer errors.", stat: "Real-Time", statLabel: "Tracking", metric: "50K+", metricLabel: "SKUs Managed" },
    { icon: PackageCheck, number: "03", title: "FULFILL", description: "When orders hit, we move. Same-day turnaround with quality checks that catch mistakes before customers do.", stat: "Same Day", statLabel: "Turnaround", metric: "99.9%", metricLabel: "Order Accuracy" },
    { icon: Truck, number: "04", title: "SHIP", description: "Best carrier for speed and cost, automatically selected. Your customers get tracking, you get peace of mind.", stat: "2-Day", statLabel: "West Coast", metric: "Auto", metricLabel: "Tracking" },
  ];

  return (
    <section className="relative py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="How It Works"
            title={<TranslatedText>How It Actually Works (No Jargon)</TranslatedText>}
            subtitle={<TranslatedText>We made fulfillment simple because you've got a brand to build.</TranslatedText>}
          />

          {/* Clean horizontal progress line */}
          <div className="relative">
            <div
              className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-[2px] z-0"
              style={{
                background:
                  "linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))",
              }}
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-background rounded-2xl p-7 pt-12 border border-border hover:border-secondary/40 hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl"
                  >
                    {/* numbered circle */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold text-base flex items-center justify-center shadow-lg shadow-secondary/40 ring-4 ring-background">
                      {step.number}
                    </div>

                    <div className="mb-5 flex justify-center">
                      <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center ring-1 ring-primary/10">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-center text-primary mb-3 tracking-wide">
                      <TranslatedText>{step.title}</TranslatedText>
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-5 leading-relaxed">
                      <TranslatedText>{step.description}</TranslatedText>
                    </p>

                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="bg-secondary/10 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-secondary">
                          <TranslatedText>{step.stat}</TranslatedText>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                          <TranslatedText>{step.statLabel}</TranslatedText>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          <TranslatedText>{step.metricLabel}</TranslatedText>
                        </span>
                        <span className="font-bold text-primary">{step.metric}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-7 text-lg shadow-lg shadow-secondary/30"
            >
              <TranslatedText>Schedule Your Onboarding Call</TranslatedText>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksProcess;
