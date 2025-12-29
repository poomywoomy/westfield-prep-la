import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Zap, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import CalendlyModal from "./CalendlyModal";

const StickyIntegrationsCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 30% of the page
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercent > 30 && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDemoClick = () => {
    trackEvent('integration_cta_clicked', { action: 'book_demo' });
    setCalendlyOpen(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 z-40"
          >
            <div className="relative bg-background border border-border rounded-l-xl shadow-xl p-4 w-64">
              <button
                onClick={handleDismiss}
                className="absolute -left-3 top-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-semibold text-sm">Integration Demo</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  See how we connect Shopify, Amazon & more in under 5 minutes.
                </p>

                <Button
                  onClick={handleDemoClick}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Demo
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating CTA */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-t border-border"
          >
            <div className="flex items-center gap-3 max-w-lg mx-auto">
              <Button
                onClick={handleDemoClick}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Integration Demo
              </Button>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CalendlyModal open={calendlyOpen} onOpenChange={setCalendlyOpen} />
    </>
  );
};

export default StickyIntegrationsCTA;
