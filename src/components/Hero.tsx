import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-warehouse-optimized.webp";
import { ArrowRight, TrendingUp, Shield, Clock } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  const stats = [
    { value: "2M+", label: "Orders Fulfilled" },
    { value: "100+", label: "Happy Clients" },
    { value: "99.8%", label: "Accuracy Rate" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-stretch overflow-hidden">
      {/* LEFT SIDE - 40% Dark Background with Content */}
      <div className="w-full lg:w-[40%] bg-gradient-to-br from-primary via-primary to-primary/90 relative z-10 flex flex-col justify-between p-8 lg:p-12 xl:p-16">
        <div className="flex-1 flex flex-col justify-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full mb-8 w-fit animate-fade-in">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="text-white font-semibold text-sm">Trusted by Growing E-Commerce Brands</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-white drop-shadow-2xl mb-6 animate-fade-in">
            Los Angeles's Premier E-Commerce Fulfillment & 3PL Partner
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 font-light leading-relaxed max-w-xl animate-fade-in">
            Fast order processing, transparent pricing, and reliable logistics for growing online brands.
          </p>

          {/* Trust Badges Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-secondary text-2xl font-bold">✓</span>
              <span className="text-white font-semibold text-sm">Same-Day Receiving</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-secondary text-2xl font-bold">✓</span>
              <span className="text-white font-semibold text-sm">24-48hr Turnaround</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-secondary text-2xl font-bold">✓</span>
              <span className="text-white font-semibold text-sm">No Minimums</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-secondary text-2xl font-bold">✓</span>
              <span className="text-white font-semibold text-sm">2M+ Orders Fulfilled</span>
            </div>
          </div>
        </div>

        {/* CTAs at Bottom */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button
            onClick={goToContact}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-10 py-7 font-bold shadow-2xl hover:scale-105 transition-all group"
          >
            Get Free Fulfillment Audit
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => navigate("/services")}
            size="lg"
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-10 py-7 font-semibold backdrop-blur-sm hover:scale-105 transition-all"
          >
            View Services
          </Button>
        </div>
      </div>

      {/* RIGHT SIDE - 60% Bold Photography */}
      <div className="hidden lg:block lg:w-[60%] relative">
        {/* Main Image - NO overlay */}
        <img
          src={heroImage}
          alt="Modern warehouse interior with organized inventory at Westfield Prep Center Los Angeles"
          fetchPriority="high"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        
        {/* Floating Stat Cards */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="grid grid-cols-1 gap-6 max-w-md">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:scale-105 transition-transform animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtle gradient overlay only at edges for depth */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-primary/20 pointer-events-none" />
      </div>
    </section>
  );
};

export default Hero;
