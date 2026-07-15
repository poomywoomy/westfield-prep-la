import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Star, Shield, Zap, CheckCircle, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import CalendlyModal from "./CalendlyModal";
import { TranslatedText } from "./TranslatedText";

const PremiumHero = () => {
  const navigate = useNavigate();
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const goToContact = () => navigate("/contact");

  const handleScheduleCall = () => {
    trackEvent("schedule_call_clicked", { location: "hero" });
    setCalendlyOpen(true);
  };

  return (
    <>
      <section className="relative w-full overflow-hidden bg-primary">
        {/* Bright warehouse photo — visible on right, soft navy fade on left for legibility */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-warehouse-optimized.webp"
            alt="Westfield Prep Center loading dock and warehouse interior in Los Angeles"
            // @ts-expect-error - lowercase fetchpriority is the correct HTML attribute
            fetchpriority="high"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-90"
          />
          {/* Left-side gradient — keeps headline legible, lets right half breathe */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.92) 30%, hsl(var(--primary)/0.55) 55%, hsl(var(--primary)/0.15) 80%, transparent 100%)",
            }}
          />
          {/* Subtle bottom fade to next section */}
          <div
            className="absolute inset-x-0 bottom-0 h-40"
            style={{
              background: "linear-gradient(to bottom, transparent, hsl(var(--primary)/0.6))",
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-10 items-center min-h-[560px]">
            {/* LEFT — copy, takes 7 cols */}
            <div className="lg:col-span-7 text-primary-foreground">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <TranslatedText className="text-xs font-bold tracking-[0.18em] uppercase text-white">
                  Los Angeles 3PL
                </TranslatedText>
              </div>

              {/* MASSIVE headline — left-aligned, 8xl on large screens */}
              <h1 className="font-bold leading-[0.95] tracking-tight text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.25rem]">
                <TranslatedText>Ship 3x Faster</TranslatedText>
                <br />
                <span className="font-display font-normal italic text-white/95">
                  <TranslatedText>with a</TranslatedText>
                </span>{" "}
                <span className="relative inline-block text-secondary">
                  <TranslatedText>Shopify</TranslatedText>
                  <span className="absolute left-0 -bottom-2 h-[6px] w-full bg-secondary/40 rounded-full" />
                </span>
                <br />
                <span className="text-secondary">
                  <TranslatedText>+ Amazon-Ready 3PL</TranslatedText>
                </span>
              </h1>

              {/* Sub */}
              <p className="mt-7 text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
                <TranslatedText>
                  Full-service fulfillment & FBA prep in 24 hours. Transparent pricing. Built for 1,000+ orders/month.
                </TranslatedText>
              </p>

              {/* Authoritative trust line — replaces 4 pills */}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-white/90">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                  <span className="text-sm font-bold ml-1.5">4.9</span>
                </div>
                <span className="h-4 w-px bg-white/25" />
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <Shield className="w-4 h-4 text-secondary" />
                  <TranslatedText>SOC2 Ready</TranslatedText>
                </div>
                <span className="h-4 w-px bg-white/25" />
                <TranslatedText className="text-sm font-semibold">
                  Trusted by 500+ brands
                </TranslatedText>
              </div>

              {/* CTAs */}
              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={goToContact}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg md:text-xl px-10 md:px-12 py-7 md:py-8 shadow-2xl shadow-secondary/40 ring-4 ring-secondary/20 hover:-translate-y-0.5 hover:ring-secondary/30 transition-all group rounded-xl"
                >
                  <TranslatedText>Get Free Fulfillment Audit</TranslatedText>
                  <ArrowRight className="ml-2.5 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => navigate("/pricing")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-primary font-bold text-lg px-10 py-8 transition-all rounded-xl"
                >
                  <TranslatedText>View Pricing</TranslatedText>
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <TranslatedText>No credit card</TranslatedText>
                </span>
                <span className="text-white/30">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-secondary" />
                  <TranslatedText>24hr response</TranslatedText>
                </span>
                <span className="text-white/30">·</span>
                <button
                  onClick={handleScheduleCall}
                  className="inline-flex items-center gap-1.5 hover:text-secondary transition-colors group"
                >
                  <Calendar className="w-4 h-4" />
                  <TranslatedText className="font-medium underline-offset-4 group-hover:underline">
                    Schedule a call
                  </TranslatedText>
                </button>
              </div>
            </div>

            {/* RIGHT — floating glass stat cards over the visible warehouse */}
            <div className="lg:col-span-5 hidden lg:block relative h-full min-h-[480px]">
              <div className="absolute top-4 right-0 w-64 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 p-5 shadow-2xl animate-slide-up">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/80">
                    Live Accuracy
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white tracking-tight">99.8</span>
                  <span className="text-2xl font-bold text-secondary">%</span>
                </div>
                <p className="text-xs text-white/75 mt-1">
                  <TranslatedText>across 2M+ orders shipped</TranslatedText>
                </p>
              </div>

              <div
                className="absolute bottom-12 left-2 w-72 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 p-5 shadow-2xl animate-slide-up"
                style={{ animationDelay: "150ms" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/80">
                    Turnaround
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white tracking-tight">24</span>
                  <span className="font-display italic text-2xl text-secondary">hours</span>
                </div>
                <p className="text-xs text-white/75 mt-1">
                  <TranslatedText>receive → prep → ship, every time</TranslatedText>
                </p>
              </div>

              <div
                className="absolute bottom-0 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/90 backdrop-blur-sm text-secondary-foreground shadow-xl animate-slide-up"
                style={{ animationDelay: "300ms" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  <TranslatedText>Now onboarding</TranslatedText>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CalendlyModal open={calendlyOpen} onOpenChange={setCalendlyOpen} />
    </>
  );
};

export default PremiumHero;
