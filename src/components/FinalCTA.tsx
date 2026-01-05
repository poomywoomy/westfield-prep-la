import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, CheckCircle } from "lucide-react";
import { TranslatedText } from "./TranslatedText";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <TranslatedText>Your Competitors Are Already Shipping Faster. What Are You Waiting For?</TranslatedText>
          </h2>
          
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            <TranslatedText>Get a free fulfillment audit from our team. We'll analyze your current operations, show you where you're leaving money on the table, and map out exactly how Westfield can help you scale. No sales pitch. Just real advice from people who've done this 2 million times.</TranslatedText>
          </p>

          <Button 
            size="lg"
            onClick={() => navigate("/contact")}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-7 text-lg font-bold mb-10"
          >
            <TranslatedText>Get Your Free Fulfillment Audit</TranslatedText>
          </Button>

          {/* Alternative Contact Options */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <a 
              href="tel:+18189355478" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Phone className="w-5 h-5" />
              <span>1.818.935.5478</span>
            </a>
            <a 
              href="mailto:info@westfieldprepcenter.com"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Mail className="w-5 h-5" />
              <span>info@westfieldprepcenter.com</span>
            </a>
          </div>

          {/* Trust Reinforcement */}
          <p className="text-sm opacity-75">
            <TranslatedText>Trusted by 100+ e-commerce brands | 2M+ orders shipped | Same-day turnaround, every time</TranslatedText>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
