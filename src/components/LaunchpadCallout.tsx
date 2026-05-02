import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Sparkles, Zap, PackageCheck } from "lucide-react";
import { TranslatedText } from "./TranslatedText";
import { GridBackdrop } from "./home/HomePrimitives";

const LaunchpadCallout = () => {
  const navigate = useNavigate();

  const bullets = [
    { icon: Zap, text: "Onboarding in days, not months" },
    { icon: PackageCheck, text: "Receiving, prep & shipping under one roof" },
    { icon: Sparkles, text: "Custom playbook for your first 1,000 orders" },
  ];

  return (
    <section className="relative overflow-hidden py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl bg-primary text-primary-foreground p-10 md:p-16 overflow-hidden">
            <GridBackdrop color="white" opacity={0.08} />
            <div
              className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, hsl(var(--secondary)), transparent 65%)",
              }}
              aria-hidden="true"
            />

            <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
              {/* Left: copy */}
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-[11px] font-bold tracking-[0.18em] uppercase mb-5">
                  <Rocket className="w-3.5 h-3.5" />
                  <TranslatedText>Westfield Launchpad</TranslatedText>
                </span>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                  <TranslatedText>From idea to</TranslatedText>{" "}
                  <span className="text-secondary">
                    <TranslatedText>shipping</TranslatedText>
                  </span>{" "}
                  <TranslatedText>in weeks.</TranslatedText>
                </h2>

                <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl">
                  <TranslatedText>
                    A guided onboarding program built for new and growing brands. We set up your
                    integrations, prep your inventory, and get your first orders out the door — fast.
                  </TranslatedText>
                </p>

                <ul className="mt-8 space-y-3">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                        <b.icon className="w-4 h-4 text-secondary" />
                      </div>
                      <TranslatedText className="text-white/90 font-medium">
                        {b.text}
                      </TranslatedText>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={() => navigate("/launchpad")}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-6 text-lg shadow-lg shadow-secondary/30 hover:-translate-y-0.5 transition-all group"
                  >
                    <TranslatedText>Explore Launchpad</TranslatedText>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/contact")}
                    className="border-2 border-white/30 bg-transparent text-white hover:bg-white hover:text-primary font-bold px-8 py-6 text-lg transition-all"
                  >
                    <TranslatedText>Talk to a Specialist</TranslatedText>
                  </Button>
                </div>
              </div>

              {/* Right: clean rocket icon panel */}
              <div className="relative">
                <div className="aspect-square max-w-sm mx-auto rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-10 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 60%, hsl(var(--secondary)/0.25), transparent 60%)",
                    }}
                  />
                  <Rocket
                    className="relative w-40 h-40 text-secondary"
                    strokeWidth={1.25}
                  />
                </div>
                <p className="mt-5 text-center text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">
                  <TranslatedText>For new & scaling brands</TranslatedText>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchpadCallout;
