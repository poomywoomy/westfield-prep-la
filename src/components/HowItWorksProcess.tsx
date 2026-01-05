import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, Database, PackageCheck, Truck } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const HowItWorksProcess = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Package,
      number: "01",
      title: "RECEIVE",
      description: "Ship it to us, we handle the rest. Same-day receiving with complete photo documentation so you know exactly what arrived.",
      stat: "Same Day",
      statLabel: "Processing Time",
      metric: "99.8%",
      metricLabel: "Accuracy Rate"
    },
    {
      icon: Database,
      number: "02",
      title: "STORE",
      description: "Your products, organized and tracked in real-time. Strategic placement means faster picking and fewer errors.",
      stat: "Real-Time",
      statLabel: "Inventory Tracking",
      metric: "50K+",
      metricLabel: "SKUs Managed"
    },
    {
      icon: PackageCheck,
      number: "03",
      title: "FULFILL",
      description: "When orders hit, we move. Same-day turnaround with quality checks that catch mistakes before customers do.",
      stat: "Same Day",
      statLabel: "Turnaround Time",
      metric: "99.9%",
      metricLabel: "Order Accuracy"
    },
    {
      icon: Truck,
      number: "04",
      title: "SHIP",
      description: "Best carrier for speed and cost, automatically selected. Your customers get tracking, you get peace of mind.",
      stat: "2-Day",
      statLabel: "West Coast Delivery",
      metric: "Auto",
      metricLabel: "Tracking Updates"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              <TranslatedText>How It Actually Works (No Jargon, No Confusion)</TranslatedText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              <TranslatedText>We made fulfillment simple because you've got a brand to build.</TranslatedText>
            </p>
          </div>

          {/* 4-Column Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const progress = ((index + 1) / steps.length) * 100;
              
              return (
                <div
                  key={index}
                  className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-primary/50"
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>

                  {/* Animated Icon */}
                  <div className="mb-6 relative">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    {/* Progress Ring */}
                    <div className="absolute -inset-2 rounded-3xl border-2 border-primary/20 group-hover:border-primary/40 transition-colors" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 text-center text-card-foreground group-hover:text-primary transition-colors">
                    <TranslatedText>{step.title}</TranslatedText>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
                    <TranslatedText>{step.description}</TranslatedText>
                  </p>

                  {/* Stats Section */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    {/* Primary Stat */}
                    <div className="bg-primary/5 rounded-lg p-4 text-center group-hover:bg-primary/10 transition-colors">
                      <div className="text-3xl font-bold text-primary mb-1">
                        <TranslatedText>{step.stat}</TranslatedText>
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        <TranslatedText>{step.statLabel}</TranslatedText>
                      </div>
                    </div>

                    {/* Secondary Metric */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground"><TranslatedText>{step.metricLabel}</TranslatedText>:</span>
                      <span className="font-bold text-foreground">{step.metric}</span>
                    </div>

                    {/* Progress Bar */}
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* Connection Line Indicators */}
          <div className="hidden lg:flex justify-center items-center gap-4 mt-8">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-1 bg-primary/30 rounded-full" />
                {index < steps.length - 1 && (
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button 
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-8 text-xl font-bold"
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
