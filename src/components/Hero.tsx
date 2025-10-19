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
    { value: "2pm PST", label: "Same-Day Cutoff" },
    { value: "100%", label: "Photo-Proof QC" },
    { value: "< 24hr", label: "Average Turnaround" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background with Parallax Effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/70" />
        {/* Animated Overlay Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full mb-6">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-white font-medium text-sm">Trusted by Growing E-Commerce Brands</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                Fulfillment That Moves as Fast as Your Brand
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-white/90 font-light leading-relaxed">
                Westfield Prep Center helps sellers deliver and scale faster. Every order is documented, every brand is protected. <span className="block mt-3 text-2xl md:text-3xl font-bold text-secondary animate-pulse">Let us help you reach the next level of your growth.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  onClick={goToContact}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-7 font-bold shadow-2xl hover:scale-105 transition-all group"
                >
                  Get a Quote
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

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
                {stats.map((stat, index) => (
                  <div key={index} className="text-left">
                    <div className="text-2xl md:text-3xl font-bold text-secondary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/80">
                      {stat.label}
                    </div>
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
