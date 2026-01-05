import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-warehouse-optimized.webp";
import { ArrowRight, Shield, Clock, Award, TrendingUp } from "lucide-react";
import { TranslatedText } from "./TranslatedText";

const Hero = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  const stats = [
    { value: "2M+", label: "Orders Fulfilled" },
    { value: "100+", label: "Active Clients" },
    { value: "99.8%", label: "Accuracy Rate" },
    { value: "15+", label: "Years in Business" },
  ];

  const trustBadges = [
    { icon: Shield, text: "Same-Day Receiving" },
    { icon: Clock, text: "24-48hr Turnaround" },
    { icon: Award, text: "No Minimums" },
    { icon: TrendingUp, text: "100% Transparent Pricing" },
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern warehouse interior at Westfield Prep Center Los Angeles"
          fetchPriority="high"
          width="1920"
          height="1080"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"></div>
      </div>

      {/* Centered Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-fade-in bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            <TranslatedText>Los Angeles's Premier E-Commerce Fulfillment & 3PL Partner</TranslatedText>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-muted-foreground font-light leading-relaxed max-w-4xl mx-auto animate-fade-in">
            <TranslatedText>Fast order processing, transparent pricing, and reliable logistics for growing online brands.</TranslatedText>
          </p>

          {/* Trust Badges - Horizontal Row */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-10 animate-fade-in">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
                <badge.icon className="w-5 h-5 text-primary" />
                <TranslatedText className="text-sm font-semibold text-foreground">{badge.text}</TranslatedText>
              </div>
            ))}
          </div>

          {/* CTAs - Centered Side by Side */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-fade-in">
            <Button
              onClick={goToContact}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-10 py-7 font-bold shadow-lg hover:scale-105 transition-all group"
            >
              <TranslatedText>Get Free Fulfillment Audit</TranslatedText>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate("/pricing")}
              size="lg"
              variant="outline"
              className="border-2 border-primary/30 hover:bg-primary/10 text-foreground text-lg px-10 py-7 font-semibold hover:scale-105 transition-all"
            >
              <TranslatedText>View Pricing</TranslatedText>
            </Button>
          </div>

          {/* Stats Bar - Horizontal Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">
                  <TranslatedText>{stat.label}</TranslatedText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
