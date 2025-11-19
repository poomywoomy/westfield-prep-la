import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-warehouse-optimized.webp";
import { ArrowRight, TrendingUp, Shield, Clock } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  const trustBadges = [
    { icon: "✓", label: "Same-Day Receiving" },
    { icon: "✓", label: "24-48hr Turnaround" },
    { icon: "✓", label: "No Minimums" },
    { icon: "✓", label: "2M+ Orders Fulfilled" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Optimized Background Image */}
      <img
        src={heroImage}
        alt="Modern warehouse interior with organized inventory at Westfield Prep Center Los Angeles"
        fetchPriority="high"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/70 z-[1]" />
      {/* Animated Overlay Patterns */}
      <div className="absolute inset-0 z-[2]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full mb-8 animate-fade-in">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="text-white font-semibold text-sm">Trusted by Growing E-Commerce Brands</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white drop-shadow-2xl mb-6 animate-fade-in">
            Los Angeles Prep Center | Professional E-Commerce Fulfillment
          </h1>

          {/* Subheadline */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 text-white/95 font-semibold animate-fade-in">
            Complete Fulfillment & 3PL Services
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 text-white/90 font-light leading-relaxed max-w-3xl mx-auto animate-fade-in">
            Fast order processing, transparent pricing, and reliable logistics for growing online brands. Same-day receiving. 24-48 hour turnaround. No minimums.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center animate-fade-in">
            <Button
              onClick={goToContact}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-10 py-8 font-bold shadow-2xl hover:scale-105 transition-all group"
            >
              Get Free Fulfillment Audit
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate("/services")}
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-10 py-8 font-semibold backdrop-blur-sm hover:scale-105 transition-all"
            >
              View Services
            </Button>
          </div>

          {/* Trust Badges - More Prominent */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-white/20 animate-fade-in">
            {trustBadges.map((badge, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
              >
                <span className="text-secondary text-3xl font-bold">
                  {badge.icon}
                </span>
                <span className="text-sm md:text-base text-white font-semibold leading-tight text-center">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-12 pt-8 border-t border-white/20 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">2M+</div>
              <div className="text-sm text-white/80">Orders Fulfilled</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">100+</div>
              <div className="text-sm text-white/80">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">99.8%</div>
              <div className="text-sm text-white/80">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
