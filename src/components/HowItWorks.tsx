import { Package, Tag, Send } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Ship to our warehouse",
    description: "Send your products directly to our Los Angeles facility",
  },
  {
    icon: Tag,
    title: "We prep/label",
    description: "Our team inspects, labels, and prepares your items for FBA",
  },
  {
    icon: Send,
    title: "We send to Amazon FBA",
    description: "We handle shipping to Amazon fulfillment centers nationwide",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to get your products FBA-ready
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-primary/20 -z-10 hidden md:block" 
                     style={{ display: index === steps.length - 1 ? 'none' : 'block' }} />
                <div className="absolute top-2 -right-4 text-6xl font-bold text-primary/10 -z-10">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
