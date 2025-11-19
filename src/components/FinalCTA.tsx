import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, CheckCircle } from "lucide-react";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Simplify Your Fulfillment?
          </h2>
          
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            Get a free fulfillment audit from our team. We'll analyze your current operations, identify cost-saving opportunities, and show you exactly how Westfield can support your growth. No obligations, no pressure - just expert advice.
          </p>

          <Button 
            size="lg"
            onClick={() => navigate("/contact")}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-7 text-lg font-bold mb-10"
          >
            Get Your Free Fulfillment Audit
          </Button>

          {/* Alternative Contact Options */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <a 
              href="tel:+1234567890" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Phone className="w-5 h-5" />
              <span>(XXX) XXX-XXXX</span>
            </a>
            <a 
              href="mailto:hello@westfieldprepcenter.com"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Mail className="w-5 h-5" />
              <span>hello@westfieldprepcenter.com</span>
            </a>
          </div>

          {/* Trust Reinforcement */}
          <p className="text-sm opacity-75">
            Serving 100+ e-commerce brands | 2M+ orders fulfilled this year | Same-day receiving
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
