import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { B as Button, t as trackEvent } from "../main.mjs";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "vite-react-ssg";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "framer-motion";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
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
    const event = "pricing_cta_click";
    trackEvent(event, { location: "sticky_mobile" });
    navigate("/contact");
  };
  if (!isVisible) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 z-50 lg:hidden p-3 bg-gradient-to-t from-background to-transparent", children: /* @__PURE__ */ jsxs(
    Button,
    {
      onClick: handleClick,
      size: "lg",
      className: "w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-full shadow-[0_20px_40px_-10px_hsl(var(--secondary)/0.6)] py-6",
      children: [
        "Get Free Fulfillment Audit",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5" })
      ]
    }
  ) });
};
export {
  StickyMobileCTA as default
};
