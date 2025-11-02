import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlatformInfo {
  name: string;
  description: string;
  fullDescription: string;
  features: string[];
  bestFor: string[];
  integration: string;
  setupTime: string;
}

interface PlatformInfoDialogProps {
  platform: PlatformInfo | null;
  open: boolean;
  onClose: () => void;
}

const PlatformInfoDialog = ({ platform, open, onClose }: PlatformInfoDialogProps) => {
  const navigate = useNavigate();

  if (!platform) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl mb-2">{platform.name} Fulfillment</DialogTitle>
          <DialogDescription className="text-base">{platform.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-xl font-semibold mb-3">Platform Overview</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {platform.fullDescription}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Fulfillment Features</h3>
            <div className="grid gap-3">
              {platform.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Best For</h3>
            <div className="flex flex-wrap gap-2">
              {platform.bestFor.map((item, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Integration</h4>
              </div>
              <p className="text-muted-foreground text-sm">{platform.integration}</p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Setup Time</h4>
              </div>
              <p className="text-muted-foreground text-sm">{platform.setupTime}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => {
                navigate("/contact");
                onClose();
              }}
            >
              Get Started with {platform.name}
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

export default PlatformInfoDialog;
