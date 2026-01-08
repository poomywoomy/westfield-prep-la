import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "@/components/TranslatedText";

const StickyCTA = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm md:text-base font-medium text-foreground hidden sm:block">
                <TranslatedText>Ready to scale your fulfillment?</TranslatedText>
              </p>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  size="sm"
                  className="flex-1 sm:flex-none bg-secondary hover:bg-secondary/90"
                  onClick={() => navigate("/contact")}
                >
                  <TranslatedText>Get a Quote</TranslatedText>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => navigate("/pricing")}
                >
                  <TranslatedText>See Pricing</TranslatedText>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
