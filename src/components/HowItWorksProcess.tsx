import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Database, PackageCheck, Truck } from "lucide-react";

const HowItWorksProcess = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Package,
      number: "01",
      title: "RECEIVE",
      description: "Ship your inventory to our LA warehouse. Same-day receiving with complete photo documentation and ASN verification."
    },
    {
      icon: Database,
      number: "02",
      title: "STORE",
      description: "We organize and track your stock in real-time. Strategic pallet placement and bin organization for fast picking."
    },
    {
      icon: PackageCheck,
      number: "03",
      title: "FULFILL",
      description: "When orders come in, we pick products within 24-48 hours. Quality checks ensure accuracy before packing."
    },
    {
      icon: Truck,
      number: "04",
      title: "SHIP",
      description: "We pack with care and ship via the best carrier for speed & cost. Tracking updates sent automatically."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Simple, Streamlined Fulfillment Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From receiving to shipping, we handle every step with precision and speed
            </p>
          </div>

          {/* Horizontal Timeline */}
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className="relative">
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                    {/* Number & Content */}
                    <div className={`${!isEven ? 'lg:col-start-2' : ''} space-y-6`}>
                      <div className="flex items-center gap-6">
                        <span className="text-8xl md:text-9xl font-bold text-primary/10 leading-none">
                          {step.number}
                        </span>
                        <div className="bg-primary/10 p-6 rounded-2xl">
                          <Icon className="w-12 h-12 text-primary" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-card-foreground">
                          {step.title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12 border border-border/50 h-64 flex items-center justify-center">
                        <div className="text-center">
                          <Icon className="w-24 h-24 text-primary/20 mx-auto mb-4" />
                          <span className="text-6xl font-bold text-primary/10">{step.number}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connector Line (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex justify-center my-8">
                      <div className="h-24 w-1 bg-gradient-to-b from-primary to-primary/20"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button 
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-8 text-xl font-bold"
            >
              Schedule Your Onboarding Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksProcess;
