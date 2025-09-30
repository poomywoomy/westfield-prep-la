import { Shield, FileCheck, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const complianceFeatures = [
  {
    icon: Shield,
    title: "Fully Insured",
    description:
      "General Liability and Warehouse Legal Liability coverage for complete peace of mind.",
  },
  {
    icon: FileCheck,
    title: "Amazon FBA Compliant",
    description:
      "All prep meets Amazon requirements: polybag suffocation warnings, 50-lb box rule, accurate case labels.",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Rigorous inspection processes and photo documentation for every order.",
  },
];

const Compliance = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Compliance & Safety
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your inventory is protected by industry-leading standards and certifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {complianceFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Compliance;
