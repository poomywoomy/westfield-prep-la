import { useNavigate, Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Truck, Boxes, Users, ArrowRight } from "lucide-react";
import { TranslatedText } from "./TranslatedText";

const BuiltForScale = () => {
  const navigate = useNavigate();

  const proofPoints = [
    {
      icon: Truck,
      title: "Volume shipping rates",
      description:
        "Our shipping volume unlocks carrier rates normally reserved for the biggest accounts — and we pass them straight through to you, not marked up.",
      stat: "Carrier rates",
      statLabel: "Passed through",
    },
    {
      icon: Boxes,
      title: "Built for throughput",
      description:
        "Dock-to-ship capacity that absorbs order spikes without slowing down. 2M+ orders shipped for 100+ brands — and counting.",
      stat: "2M+",
      statLabel: "Orders shipped",
    },
    {
      icon: Users,
      title: "A team built for scale",
      description:
        "A dedicated account team that knows your operation. No ticket queues, no bots, no ghosting — even at high volume.",
      stat: "Direct",
      statLabel: "Account team",
    },
  ];

  return (
    <section className="relative py-24 md:py-28 bg-primary text-primary-foreground overflow-hidden">
      {/* Soft orange glow */}
      <div
        className="absolute -top-32 right-0 w-[700px] h-[400px] opacity-20 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--secondary)), transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-1 w-10 bg-secondary rounded-full" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-secondary">
              <TranslatedText>Scale, engineered in</TranslatedText>
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[0.98] tracking-tight">
            <TranslatedText>Built for</TranslatedText>{" "}
            <span className="font-display italic font-normal text-secondary">
              <TranslatedText>large-scale</TranslatedText>
            </span>{" "}
            <TranslatedText>brands.</TranslatedText>
          </h2>
          <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-2xl">
            <TranslatedText>
              Most 3PLs are built to survive your first 100 orders. We run the kind of volume that breaks smaller warehouses — and our shipping rates reflect it.
            </TranslatedText>
          </p>
        </div>

        {/* Proof cards */}
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {proofPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={i}
                className="rounded-2xl bg-white/[0.06] backdrop-blur-xs border border-white/12 p-8 hover:border-secondary/50 hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mb-6">
                  <Icon className="w-5.5 h-5.5 text-secondary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3">
                  <TranslatedText>{point.title}</TranslatedText>
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  <TranslatedText>{point.description}</TranslatedText>
                </p>
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="font-display italic text-2xl text-secondary leading-none">
                    <TranslatedText>{point.stat}</TranslatedText>
                  </div>
                  <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                    <TranslatedText>{point.statLabel}</TranslatedText>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA row */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate("/contact")}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg px-10 py-7 shadow-2xl shadow-secondary/30 hover:-translate-y-0.5 transition-all rounded-xl"
          >
            <TranslatedText>Get Free Fulfillment Audit</TranslatedText>
            <ArrowRight className="ml-2.5 w-5 h-5" />
          </Button>
          <Button
            onClick={() => navigate("/pricing")}
            size="lg"
            variant="outline"
            className="border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-primary font-bold text-lg px-10 py-7 transition-all rounded-xl"
          >
            <TranslatedText>See Pricing</TranslatedText>
          </Button>
        </div>

        <p className="mt-6 text-sm">
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 font-semibold text-white underline decoration-secondary decoration-2 underline-offset-4 hover:text-secondary transition-colors"
          >
            <TranslatedText>Meet the team behind the operation</TranslatedText>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </p>
      </div>
    </section>
  );
};

export default BuiltForScale;
