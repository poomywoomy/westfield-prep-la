import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Database, PackageCheck, Truck } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import { WcuSectionHeading } from "./wcu/WcuPrimitives";

const HowItWorksProcess = () => {
  const navigate = useNavigate();

  const steps = [
    { icon: Package, number: "01", title: "RECEIVE", description: "Ship it to us, we handle the rest. Same-day receiving with complete photo documentation so you know exactly what arrived.", stat: "Same Day", statLabel: "Processing", metric: "99.8%", metricLabel: "Accuracy" },
    { icon: Database, number: "02", title: "STORE", description: "Your products, organized and tracked in real-time. Strategic placement means faster picking and fewer errors.", stat: "Real-Time", statLabel: "Tracking", metric: "50K+", metricLabel: "SKUs Managed" },
    { icon: PackageCheck, number: "03", title: "FULFILL", description: "When orders hit, we move. Same-day turnaround with quality checks that catch mistakes before customers do.", stat: "Same Day", statLabel: "Turnaround", metric: "99.9%", metricLabel: "Order Accuracy" },
    { icon: Truck, number: "04", title: "SHIP", description: "Best carrier for speed and cost, automatically selected. Your customers get tracking, you get peace of mind.", stat: "2-Day", statLabel: "West Coast", metric: "Auto", metricLabel: "Tracking" },
  ];

  return (
    <section className="relative py-24" style={{ background: "hsl(var(--wcu-cream))" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <WcuSectionHeading
            eyebrow="How It Works"
            title={<TranslatedText>How It Actually Works (No Jargon)</TranslatedText>}
            subtitle={<TranslatedText>We made fulfillment simple because you've got a brand to build.</TranslatedText>}
          />

          {/* Meandering dotted SVG path */}
          <div className="relative">
            <svg
              className="hidden lg:block absolute top-16 left-0 w-full h-32 pointer-events-none"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M120,60 C 280,10 420,110 600,60 S 920,10 1080,60"
                stroke="hsl(var(--wcu-sunset))"
                strokeWidth="3"
                strokeDasharray="2 10"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-[28px] p-7 border border-[hsl(var(--wcu-line))] hover:-translate-y-1 transition-all shadow-[0_4px_0_0_hsl(var(--wcu-line))] hover:shadow-[0_20px_40px_-15px_hsl(var(--wcu-sunset)/0.3)]"
                  >
                    {/* numbered sunset circle */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[hsl(var(--wcu-sunset))] text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-[hsl(var(--wcu-sunset)/0.4)] border-4 border-white">
                      {step.number}
                    </div>

                    <div className="mt-4 mb-5 flex justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--wcu-peach))] flex items-center justify-center group-hover:rotate-[-6deg] transition-transform">
                        <Icon className="w-10 h-10 text-[hsl(var(--wcu-sunset-deep))]" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-center text-[hsl(var(--wcu-ink))] mb-3 tracking-wide">
                      <TranslatedText>{step.title}</TranslatedText>
                    </h3>
                    <p className="text-sm text-[hsl(var(--wcu-ink-soft))] text-center mb-5 leading-relaxed">
                      <TranslatedText>{step.description}</TranslatedText>
                    </p>

                    <div className="pt-4 border-t border-dashed border-[hsl(var(--wcu-line))] space-y-3">
                      <div className="bg-[hsl(var(--wcu-peach))] rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-[hsl(var(--wcu-sunset-deep))]">
                          <TranslatedText>{step.stat}</TranslatedText>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--wcu-ink-soft))] font-semibold">
                          <TranslatedText>{step.statLabel}</TranslatedText>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[hsl(var(--wcu-ink-soft))]">
                          <TranslatedText>{step.metricLabel}</TranslatedText>
                        </span>
                        <span className="font-bold text-[hsl(var(--wcu-ink))]">{step.metric}</span>
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
              className="bg-[hsl(var(--wcu-sunset))] hover:bg-[hsl(var(--wcu-sunset-deep))] text-white font-bold px-10 py-7 text-lg shadow-lg shadow-[hsl(var(--wcu-sunset)/0.3)]"
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
