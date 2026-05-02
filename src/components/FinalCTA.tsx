import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { TranslatedText } from "./TranslatedText";
import { SunburstStamp } from "./wcu/WcuPrimitives";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--wcu-sunset)) 0%, hsl(var(--wcu-sunset-deep)) 50%, hsl(var(--wcu-ink)) 130%)",
      }}
    >
      <div className="absolute inset-0 wcu-paper-grain opacity-40" aria-hidden="true" />
      {/* confetti dots */}
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
        <defs>
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <div className="absolute top-8 right-8 opacity-30">
        <SunburstStamp size={120} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
            <TranslatedText>Your Competitors Are Already Shipping Faster.</TranslatedText>
            <br />
            <span className="text-[hsl(var(--wcu-peach))]">
              <TranslatedText>What Are You Waiting For?</TranslatedText>
            </span>
          </h2>

          <p className="text-lg md:text-xl mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto">
            <TranslatedText>
              Get a free fulfillment audit from our team. We'll analyze your current operations, show you where you're leaving money on the table, and map out exactly how Westfield can help you scale. No sales pitch. Just real advice from people who've done this 2 million times.
            </TranslatedText>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-white text-[hsl(var(--wcu-sunset-deep))] hover:bg-[hsl(var(--wcu-cream))] font-bold px-10 py-7 text-lg shadow-2xl hover:-translate-y-0.5 transition-all group"
            >
              <TranslatedText>Get Your Free Fulfillment Audit</TranslatedText>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/pricing")}
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[hsl(var(--wcu-sunset-deep))] font-bold px-10 py-7 text-lg transition-all"
            >
              <TranslatedText>View Pricing</TranslatedText>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-6 text-white/95">
            <a href="tel:+18189355478" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">1.818.935.5478</span>
            </a>
            <a href="mailto:info@westfieldprepcenter.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">info@westfieldprepcenter.com</span>
            </a>
          </div>

          <p className="text-sm opacity-80">
            <TranslatedText>Trusted by 100+ e-commerce brands | 2M+ orders shipped | Same-day turnaround, every time</TranslatedText>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
