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
        <div className="max-w-7xl mx-auto">
          {/* Full Width Header Section */}
          <div className="text-left animate-fade-in mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-white font-medium text-sm">Trusted by Growing E-Commerce Brands</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white drop-shadow-lg max-w-none">
              Los Angeles Prep Center | Professional E-Commerce Fulfillment
            </h1>
          </div>

          {/* Two Column Content Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left animate-fade-in">
              <h2 className="text-2xl md:text-3xl mb-4 text-white/95 font-semibold">
                Complete Fulfillment & 3PL Services
              </h2>
              
              <p className="text-xl md:text-2xl mb-8 text-white/90 font-light leading-relaxed">
                Fast order processing, transparent pricing, and reliable logistics for growing online brands. Same-day receiving. 24-48 hour turnaround. No minimums.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button
                  onClick={goToContact}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-7 font-bold shadow-2xl hover:scale-105 transition-all group"
                >
                  Get Free Fulfillment Audit
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => navigate("/services")}
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 py-7 font-semibold backdrop-blur-sm"
                >
                  View Services
                </Button>
              </div>

              {/* Social Proof Line */}
              <p className="text-white/80 text-sm mb-10 italic">
                Trusted by 100+ e-commerce brands across California
              </p>

              {/* Trust Badges Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/20">
                {trustBadges.map((badge, index) => (
                  <div key={index} className="text-left flex items-start gap-2">
                    <span className="text-secondary text-xl font-bold flex-shrink-0">
                      {badge.icon}
                    </span>
                    <span className="text-sm text-white/90 font-medium leading-tight">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Feature Highlights */}
            <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:scale-105 hover:-translate-y-1">
                <Shield className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Fully Insured</h3>
                <p className="text-white/80 text-sm">GL + WLL Coverage for complete peace of mind</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:scale-105 hover:-translate-y-1 mt-8">
                <Clock className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Same-Day Processing</h3>
                <p className="text-white/80 text-sm">Orders before 2pm PST ship same day</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:scale-105 hover:-translate-y-1 -mt-4">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-xl font-bold text-white mb-2">Photo-Proof QC</h3>
                <p className="text-white/80 text-sm">Every shipment fully documented</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:scale-105 hover:-translate-y-1 mt-4">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-bold text-white mb-2">Los Angeles Based</h3>
                <p className="text-white/80 text-sm">Strategic location for fast shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
