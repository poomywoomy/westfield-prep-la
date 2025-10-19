import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-warehouse-optimized.webp";
import { Star, Shield, Zap, Camera, MapPin } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  const trustBadges = [
    {
      icon: Star,
      title: "5.0 Star Rating",
      subtitle: "4 Google Reviews",
    },
    {
      icon: Shield,
      title: "Fully Insured",
      subtitle: "GL + WLL Coverage",
    },
    {
      icon: Zap,
      title: "Same-Day Turnaround",
      subtitle: "Orders Before 2pm PST",
    },
    {
      icon: Camera,
      title: "Photo-Proof QC",
      subtitle: "Every Shipment Documented",
    },
    {
      icon: MapPin,
      title: "Los Angeles Based",
      subtitle: "Fast West Coast Shipping",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="container mx-auto px-4 relative z-10 pt-16 pb-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline with Animation */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <span className="text-white font-medium">🚀 Boutique Fulfillment • Faster Than Big Centers</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Shopify, Amazon, & E-commerce Fulfillment in Los Angeles
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/95 max-w-3xl mx-auto font-light">
              Shopify-first fulfillment with photo-proof QC, branded packaging, and same-day cutoffs. Also supporting Amazon FBA and TikTok Shop.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mb-12">
            <Button
              onClick={goToContact}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xl px-12 py-8 font-bold shadow-2xl hover:scale-105 transition-transform"
            >
              Get a Quote
            </Button>
          </div>

          {/* Trust Badges Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/95 backdrop-blur-sm border-white/20 p-4 hover:bg-white transition-all hover:scale-105 hover:shadow-xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-bold text-sm text-foreground mb-1">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {badge.subtitle}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
