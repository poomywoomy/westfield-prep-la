import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past hero (approximately 85vh)
      const heroHeight = window.innerHeight * 0.85;
      const scrollPosition = window.scrollY;

      // Check if quote form is in view
      const quoteForm = document.getElementById("quote-form");
      if (quoteForm) {
        const rect = quoteForm.getBoundingClientRect();
        const isQuoteFormVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        // Show if past hero but hide if quote form is visible
        setIsVisible(scrollPosition > heroHeight && !isQuoteFormVisible);
      } else {
        setIsVisible(scrollPosition > heroHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-[hsl(var(--shopify-page-accent))] shadow-lg border-t border-white/10">
        <div className="container mx-auto px-4 py-3">
          <Button
            onClick={() => navigate("/contact")}
            size="lg"
            className="w-full bg-white text-[hsl(var(--shopify-page-accent))] hover:bg-white/90 font-semibold shadow-md"
          >
            Get a Quote
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
