import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, CheckCircle, Clock, Plug, Shield, Star, Truck, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import CalendlyModal from "./CalendlyModal";
import { TranslatedText } from "./TranslatedText";
import { GridBackdrop } from "./home/HomePrimitives";

const PremiumHero = () => {
  const navigate = useNavigate();
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const goToContact = () => navigate("/contact");

  const handleScheduleCall = () => {
    trackEvent("schedule_call_clicked", { location: "hero" });
    setCalendlyOpen(true);
  };

  const featureTags = [
    { icon: Clock, text: "24hr Turnaround" },
    { icon: Truck, text: "No Minimums" },
    { icon: Plug, text: "Plug & Play" },
    { icon: Shield, text: "99.8% Accuracy" },
  ];

  const trustBadges = [
    { icon: Shield, text: "SOC2 Ready" },
    { icon: Zap, text: "WMS-Integrated" },
    { icon: Star, text: "4.9★ Rating" },
    { icon: CheckCircle, text: "99.99% Uptime" },
  ];

  return (
    <>
      <section className="relative w-full overflow-hidden bg-primary">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-warehouse-optimized.webp"
            alt="Westfield Prep Center loading dock and warehouse interior in Los Angeles"
            fetchPriority="high"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary)/0.92) 0%, hsl(var(--primary)/0.85) 55%, hsl(var(--primary)/0.78) 100%)",
            }}
          />
          <GridBackdrop color="white" opacity={0.06} />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto text-center text-primary-foreground">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-6">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <TranslatedText className="text-xs font-bold tracking-[0.18em] uppercase text-white">
                Los Angeles 3PL
              </TranslatedText>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              <TranslatedText>Ship 3x Faster with a</TranslatedText>{" "}
              <span className="text-secondary">
                <TranslatedText>Shopify + Amazon-Ready 3PL</TranslatedText>
              </span>
            </h1>

            {/* Sub */}
            <p className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto">
              <TranslatedText>
                Full-service fulfillment & FBA prep in 24 hours. Transparent pricing. No monthly minimums.
              </TranslatedText>
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
              {trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15"
                >
                  <badge.icon className="w-3.5 h-3.5 text-secondary" />
                  <TranslatedText className="text-xs font-semibold text-white">
                    {badge.text}
                  </TranslatedText>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={goToContact}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg px-10 py-7 shadow-xl shadow-secondary/30 hover:-translate-y-0.5 transition-all group"
              >
                <TranslatedText>Get Free Fulfillment Audit</TranslatedText>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/pricing")}
                size="lg"
                variant="outline"
                className="border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-primary font-bold text-lg px-10 py-7 transition-all"
              >
                <TranslatedText>View Pricing</TranslatedText>
              </Button>
            </div>

            <button
              onClick={handleScheduleCall}
              className="mt-6 inline-flex items-center gap-2 text-white/75 hover:text-secondary transition-colors group mx-auto"
            >
              <Calendar className="w-4 h-4" />
              <TranslatedText className="text-sm font-medium underline-offset-4 group-hover:underline">
                Or schedule a call with our team
              </TranslatedText>
            </button>

            {/* Feature pills row */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {featureTags.map((tag, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-secondary/40 hover:-translate-y-0.5 transition-all"
                >
                  <tag.icon className="w-4 h-4 text-secondary" />
                  <TranslatedText className="text-sm font-semibold text-white">
                    {tag.text}
                  </TranslatedText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CalendlyModal open={calendlyOpen} onOpenChange={setCalendlyOpen} />
    </>
  );
};

export default PremiumHero;
