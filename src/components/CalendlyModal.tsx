import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CalendlyModal = ({ open, onOpenChange }: CalendlyModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (open) {
      trackEvent('calendly_modal_opened');
      
      // Load Calendly widget script if not already loaded
      if (!scriptLoaded.current && !document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.head.appendChild(script);
        scriptLoaded.current = true;
      }

      // Initialize Calendly inline widget after a short delay
      const timer = setTimeout(() => {
        if (containerRef.current && (window as any).Calendly) {
          (window as any).Calendly.initInlineWidget({
            url: 'https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting',
            parentElement: containerRef.current,
            prefill: {},
            utm: {},
          });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[700px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-secondary" />
            Schedule a Call with Our Team
          </DialogTitle>
        </DialogHeader>
        <div 
          ref={containerRef}
          className="flex-1 min-h-[600px] w-full"
          style={{ height: '600px' }}
        >
          {/* Fallback if Calendly doesn't load */}
          <div className="flex items-center justify-center h-full bg-muted/50">
            <div className="text-center space-y-4 p-8">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Loading calendar...</p>
              <a 
                href="https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                Or click here to open in new tab
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;
