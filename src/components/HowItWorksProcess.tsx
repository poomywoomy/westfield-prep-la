import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Database, PackageCheck, Truck, ArrowRight } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const HowItWorksProcess = () => {
  const navigate = useNavigate();

  const steps = [
    { icon: Package, number: "01", title: "Receive", description: "Ship it to us, we handle the rest. Same-day receiving with complete photo documentation so you know exactly what arrived.", stat: "Same-Day", statLabel: "Processing" },
    { icon: Database, number: "02", title: "Store", description: "Your products, organized and tracked in real-time. Strategic placement means faster picking and fewer errors.", stat: "Real-Time", statLabel: "Tracking" },
    { icon: PackageCheck, number: "03", title: "Fulfill", description: "When orders hit, we move. Same-day turnaround with quality checks that catch mistakes before customers do.", stat: "99.9%", statLabel: "Order Accuracy" },
    { icon: Truck, number: "04", title: "Ship", description: "Best carrier for speed and cost, automatically selected. Your customers get tracking, you get peace of mind.", stat: "2-Day", statLabel: "West Coast" },
  ];

  return (
    <section className="relative py-28 bg-primary text-primary-foreground overflow-hidden">
      {/* Background atmospheric */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-40 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--secondary))" }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-secondary">
              How it works · 04 steps
            </span>
            <h2 className="mt-3 text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight">
              <TranslatedText>How it actually works.</TranslatedText>
              <br />
              <span className="font-display italic font-normal text-secondary">
                <TranslatedText>(No jargon.)</TranslatedText>
              </span>
            </h2>
            <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
              <TranslatedText>
                We made fulfillment simple because you've got a brand to build.
              </TranslatedText>
            </p>
          </div>

          {/* Vertical timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-[60px] md:left-[88px] top-0 bottom-0 w-px bg-gradient-to-b from-secondary/60 via-white/20 to-transparent" aria-hidden="true" />

            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="relative grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] gap-6 md:gap-10 items-start group"
                  >
                    {/* HUGE outlined number */}
                    <div className="relative">
                      <div
                        className="font-display italic text-7xl md:text-9xl leading-none text-transparent select-none"
                        style={{ WebkitTextStroke: "1.5px hsl(var(--secondary))" }}
                      >
                        {step.number}
                      </div>
                      {/* Pulse dot on the timeline */}
                      <div className="absolute top-8 -right-1 md:-right-3 w-5 h-5 rounded-full bg-secondary ring-4 ring-primary z-10" />
                    </div>

                    {/* Content card */}
                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-7 md:p-8 hover:bg-white/10 hover:border-secondary/30 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-6 h-6 text-secondary" />
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                          <TranslatedText>{step.title}</TranslatedText>
                        </h3>
                      </div>
                      <p className="text-white/75 text-base md:text-lg leading-relaxed mb-5 max-w-2xl">
                        <TranslatedText>{step.description}</TranslatedText>
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <span className="px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold">
                          <TranslatedText>{step.stat}</TranslatedText>
                        </span>
                        <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">
                          <TranslatedText>{step.statLabel}</TranslatedText>
                        </span>
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
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-7 text-lg shadow-lg shadow-secondary/30 group"
            >
              <TranslatedText>Schedule your onboarding call</TranslatedText>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksProcess;
