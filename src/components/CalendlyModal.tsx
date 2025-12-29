import { useEffect, useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

const CalendlyModal = ({ open, onOpenChange }: CalendlyModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const initializeWidget = useCallback(() => {
    if (!containerRef.current || !window.Calendly) return false;
    
    try {
      // Clear container before initializing
      containerRef.current.innerHTML = '';
      
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting',
        parentElement: containerRef.current,
        prefill: {},
        utm: {},
      });
      
      setIsLoading(false);
      setHasError(false);
      return true;
    } catch (error) {
      console.error('Calendly init error:', error);
      setHasError(true);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      return;
    }

    trackEvent('calendly_modal_opened');
    setIsLoading(true);
    setHasError(false);

    const loadAndInit = () => {
      // Check if Calendly is already loaded
      if (window.Calendly) {
        setTimeout(initializeWidget, 100);
        return;
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
      
      if (existingScript) {
        // Script exists, wait for it to load
        const checkCalendly = setInterval(() => {
          if (window.Calendly) {
            clearInterval(checkCalendly);
            initializeWidget();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkCalendly);
          if (!window.Calendly) setHasError(true);
        }, 5000);
        return;
      }

      // Load script fresh
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      
      script.onload = () => {
        setTimeout(initializeWidget, 200);
      };
      
      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    loadAndInit();
  }, [open, initializeWidget]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[700px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-secondary" />
            Schedule a Call with Our Team
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative flex-1 min-h-[600px] w-full">
          {/* Loading overlay */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 mx-auto text-secondary animate-spin" />
                <p className="text-muted-foreground">Loading calendar...</p>
              </div>
            </div>
          )}
          
          {/* Error state */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="text-center space-y-4 p-8">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Unable to load calendar</p>
                <a 
                  href="https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                >
                  Open in new tab
                </a>
              </div>
            </div>
          )}
          
          {/* Calendly container */}
          <div 
            ref={containerRef}
            className="w-full h-full"
            style={{ minHeight: '600px' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;
