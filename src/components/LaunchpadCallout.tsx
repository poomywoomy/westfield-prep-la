import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Sparkles, Zap, PackageCheck } from "lucide-react";
import { TranslatedText } from "./TranslatedText";

const LaunchpadCallout = () => {
  const navigate = useNavigate();

  const bullets = [
    { icon: Zap, text: "Onboarding in days, not months" },
    { icon: PackageCheck, text: "Receiving, prep & shipping under one roof" },
    { icon: Sparkles, text: "Custom playbook for your first 1,000 orders" },
  ];

  return (
    <section className="relative overflow-hidden py-24 bg-background">
      {/* Diagonal orange band that the card sits on */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70%] -skew-y-2 bg-secondary"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70%] -skew-y-2 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 38px, hsl(var(--secondary-foreground)/0.4) 38px, hsl(var(--secondary-foreground)/0.4) 39px)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          {/* Offset white card */}
          <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-0 rounded-3xl bg-background shadow-[0_30px_80px_-20px_rgba(10,10,35,0.5)] overflow-hidden">
            {/* LEFT — content */}
            <div className="p-10 md:p-14 relative">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-[11px] font-bold tracking-[0.18em] uppercase mb-5">
                <Rocket className="w-3.5 h-3.5" />
                <TranslatedText>Westfield Launchpad</TranslatedText>
              </span>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-[1.0] tracking-tight">
                <TranslatedText>From idea to</TranslatedText>{" "}
                <span className="font-display italic font-normal text-secondary">
                  <TranslatedText>shipping</TranslatedText>
                </span>
                <br />
                <TranslatedText>in weeks.</TranslatedText>
              </h2>

              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                <TranslatedText>
                  A guided onboarding program built for new and growing brands. We set up your integrations, prep your inventory, and get your first orders out the door — fast.
                </TranslatedText>
              </p>

              <ul className="mt-8 space-y-3">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                      <b.icon className="w-4 h-4 text-secondary" />
                    </div>
                    <TranslatedText className="text-primary font-medium">
                      {b.text}
                    </TranslatedText>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("/launchpad")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all group"
                >
                  <TranslatedText>Explore Launchpad</TranslatedText>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/contact")}
                  className="border-2 border-primary/20 bg-transparent text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-6 text-lg transition-all"
                >
                  <TranslatedText>Talk to a specialist</TranslatedText>
                </Button>
              </div>
            </div>

            {/* RIGHT — rocket panel with bold dark background */}
            <div className="relative bg-primary text-primary-foreground p-10 md:p-12 flex flex-col justify-center items-center text-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at 50% 60%, hsl(var(--secondary)/0.6), transparent 60%)",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-secondary/30 blur-3xl scale-150" />
                  <Rocket className="relative w-32 h-32 md:w-40 md:h-40 text-secondary animate-float" strokeWidth={1.25} />
                </div>
                <div className="mt-8">
                  <div className="font-display italic text-5xl md:text-6xl text-white leading-none">days</div>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">
                    <TranslatedText>not months · for new & scaling brands</TranslatedText>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchpadCallout;
