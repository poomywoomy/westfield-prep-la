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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {badges.map((badge, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6 pb-6">
                <badge.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
