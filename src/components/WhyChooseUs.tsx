import { Clock, Camera, DollarSign, MapPin } from "lucide-react";

const reasons = [
  {
    icon: Clock,
    title: "Same-Day Turnaround",
    description: "Fast processing to keep your inventory moving and sales flowing.",
  },
  {
    icon: Camera,
    title: "Photo Proof QC",
    description: "Visual confirmation of every step for complete transparency.",
  },
  {
    icon: DollarSign,
    title: "Transparent Invoicing",
    description: "Clear, itemized billing with no surprise fees or hidden charges.",
  },
  {
    icon: MapPin,
    title: "LA-Based Location",
    description: "Strategic Los Angeles location with easy access to all major carriers.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Westfield Prep Center</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Experience the difference of working with a dedicated fulfillment partner
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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
      </div>
    </section>
  );
};

export default WhyChooseUs;
