import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { TranslatedText } from "./TranslatedText";
import { GridBackdrop } from "./home/HomePrimitives";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 overflow-hidden bg-primary">
      <GridBackdrop color="white" opacity={0.06} />
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--secondary)), transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
            <TranslatedText>Your Competitors Are Already Shipping Faster.</TranslatedText>
            <br />
            <span className="text-secondary">
              <TranslatedText>What Are You Waiting For?</TranslatedText>
            </span>
          </h2>

          <p className="text-lg md:text-xl mb-10 text-white/85 leading-relaxed max-w-3xl mx-auto">
            <TranslatedText>
              Get a free fulfillment audit from our team. We'll analyze your current operations, show you where you're leaving money on the table, and map out exactly how Westfield can help you scale. No sales pitch. Just real advice from people who've done this 2 million times.
            </TranslatedText>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-7 text-lg shadow-2xl shadow-secondary/30 hover:-translate-y-0.5 transition-all group"
            >
              <TranslatedText>Get Your Free Fulfillment Audit</TranslatedText>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/pricing")}
              variant="outline"
              className="border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-primary font-bold px-10 py-7 text-lg transition-all"
            >
              <TranslatedText>View Pricing</TranslatedText>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-6 text-white/85">
            <a href="tel:+18189355478" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">1.818.935.5478</span>
            </a>
            <a href="mailto:info@westfieldprepcenter.com" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">info@westfieldprepcenter.com</span>
            </a>
          </div>

          <p className="text-sm text-white/65">
            <TranslatedText>Trusted by 100+ e-commerce brands · 2M+ orders shipped · Same-day turnaround, every time</TranslatedText>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
