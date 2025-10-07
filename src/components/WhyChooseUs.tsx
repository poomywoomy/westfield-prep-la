import { Clock, Camera, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const reasons = [
  {
    icon: Clock,
    title: "Fast check-in",
    description: "Quick receiving and processing to get your products moving fast.",
  },
  {
    icon: Camera,
    title: "Dedicated support",
    description: "Personalized service from a team that knows your business.",
  },
  {
    icon: MapPin,
    title: "Local LA warehouse",
    description: "Strategic Los Angeles location for efficient nationwide shipping.",
  },
];

const WhyChooseUs = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Sellers Choose Us</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Experience the boutique advantage—personalized service with faster turnaround times
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                <p className="text-white/80">{reason.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/contact")}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6 font-semibold"
          >
            Get a Free Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
