import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.85;
      const scrollPosition = window.scrollY;
      const quoteForm = document.getElementById("quote-form");
      if (quoteForm) {
        const rect = quoteForm.getBoundingClientRect();
        const isQuoteFormVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setIsVisible(scrollPosition > heroHeight && !isQuoteFormVisible);
      } else {
        setIsVisible(scrollPosition > heroHeight);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const event: AnalyticsEvent = "pricing_cta_click";
    trackEvent(event, { location: "sticky_mobile" });
    navigate("/contact");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-3 bg-gradient-to-t from-background to-transparent">
      <Button
        onClick={handleClick}
        size="lg"
        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-full shadow-[0_20px_40px_-10px_hsl(var(--secondary)/0.6)] py-6"
      >
        Get Free Fulfillment Audit
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
};

export default StickyMobileCTA;
