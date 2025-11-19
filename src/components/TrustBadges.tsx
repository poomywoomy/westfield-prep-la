import { Card, CardContent } from "@/components/ui/card";
import { Star, Shield, Camera, Zap, MapPin } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Star,
      title: "5.0 Star Rating",
      description: "4 Google Reviews"
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "GL + WLL Coverage"
    },
    {
      icon: Zap,
      title: "Same-Day Turnaround",
      description: "Orders Before 2pm PST"
    },
    {
      icon: Camera,
      title: "Photo-Proof QC",
      description: "Every Shipment Documented"
    },
    {
      icon: MapPin,
      title: "Los Angeles Based",
      description: "Fast West Coast Shipping"
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="relative group text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.15))`,
              }}
            >
              {/* Gradient Border Glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{
                     background: `linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--secondary) / 0.3))`,
                     filter: 'blur(8px)',
                   }}
              />
              
              {/* Content */}
              <div className="relative z-10">
                <badge.icon className="w-10 h-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm mb-1.5 text-foreground">{badge.title}</h3>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>

              {/* Subtle Shadow */}
              <div className="absolute inset-0 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
