import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceInfo {
  icon: LucideIcon;
  title: string;
  description: string;
  fullDescription: string;
  benefits: string[];
  bestFor: string[];
  pricing?: string;
}

interface ServiceInfoDialogProps {
  service: ServiceInfo | null;
  open: boolean;
  onClose: () => void;
}

const ServiceInfoDialog = ({ service, open, onClose }: ServiceInfoDialogProps) => {
  const navigate = useNavigate();

  if (!service) return null;

  const Icon = service.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-3xl">{service.title}</DialogTitle>
              <DialogDescription className="text-base mt-1">{service.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-xl font-semibold mb-3">Overview</h3>
            <p className="text-muted-foreground leading-relaxed">{service.fullDescription}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Key Benefits</h3>
            <div className="grid gap-3">
              {service.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Best For</h3>
            <div className="flex flex-wrap gap-2">
              {service.bestFor.map((item, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-full text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {service.pricing && (
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Pricing</h3>
              <p className="text-muted-foreground">{service.pricing}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => {
                navigate("/contact");
                onClose();
              }}
            >
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceInfoDialog;
