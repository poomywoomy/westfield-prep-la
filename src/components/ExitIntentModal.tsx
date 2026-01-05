import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Mail, ArrowRight, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TranslatedText } from "@/components/TranslatedText";

interface ExitIntentModalProps {
  onClose?: () => void;
}

const ExitIntentModal = ({ onClose }: ExitIntentModalProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [monthlyOrders, setMonthlyOrders] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem('exitIntentShown');
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Desktop: Mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
        trackEvent('exit_intent_shown', { trigger: 'mouse_leave' });
      }
    };

    // Mobile: Scroll up pattern (aggressive scroll up)
    let lastScrollY = window.scrollY;
    let scrollUpCount = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY && currentScrollY < 100) {
        scrollUpCount++;
        if (scrollUpCount > 3 && !hasShown) {
          setOpen(true);
          setHasShown(true);
          sessionStorage.setItem('exitIntentShown', 'true');
          trackEvent('exit_intent_shown', { trigger: 'scroll_up' });
        }
      } else {
        scrollUpCount = 0;
      }
      lastScrollY = currentScrollY;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to lead_magnet_downloads table
      const { error } = await supabase.from('lead_magnet_downloads').insert({
        email,
        full_name: '',
        guide_type: 'exit_intent_savings_estimate',
      });

      if (error) throw error;

      trackEvent('exit_intent_converted', { 
        email_captured: true,
        monthly_orders: monthlyOrders || 'not_provided' 
      });

      toast.success("We'll send your custom estimate shortly!");
      setOpen(false);
      onClose?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px]">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center pt-6">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-secondary" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            <TranslatedText>Wait! Want a Custom Savings Estimate?</TranslatedText>
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            <TranslatedText>Get a personalized fulfillment cost analysis sent to your inbox.</TranslatedText>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="exit-email"><TranslatedText>Email Address</TranslatedText> *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="exit-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exit-orders"><TranslatedText>Monthly Order Volume (optional)</TranslatedText></Label>
            <Input
              id="exit-orders"
              type="text"
              placeholder="e.g., 500-1000"
              value={monthlyOrders}
              onChange={(e) => setMonthlyOrders(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? <TranslatedText>Sending...</TranslatedText> : <TranslatedText>Send My Estimate</TranslatedText>}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            <TranslatedText>No spam. Just your personalized savings breakdown.</TranslatedText>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;
