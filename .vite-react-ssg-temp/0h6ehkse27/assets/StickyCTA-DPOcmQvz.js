import { jsx, jsxs } from "react/jsx-runtime";
import { Clock, Target, RefreshCw, MapPin } from "lucide-react";
import { T as TranslatedText, B as Button } from "../main.mjs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
const metrics = [
  { icon: Clock, label: "24-Hour Turnaround", value: "24hr" },
  { icon: Target, label: "99.8% Accuracy", value: "99.8%" },
  { icon: RefreshCw, label: "Real-Time Sync", value: "Live" },
  { icon: MapPin, label: "Los Angeles, CA HQ", value: "LA" }
];
const TrustStrip = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-8 bg-muted/30 border-y border-border", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8", children: metrics.map((metric, idx) => {
    const Icon = metric.icon;
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-secondary" }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: metric.label }) }) })
    ] }, idx);
  }) }) }) });
};
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
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isVisible && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
      transition: { duration: 0.3, ease: "easeOut" },
      className: "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg",
      children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base font-medium text-foreground hidden sm:block", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ready to scale your fulfillment?" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              className: "flex-1 sm:flex-none bg-secondary hover:bg-secondary/90",
              onClick: () => navigate("/contact"),
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get a Quote" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "flex-1 sm:flex-none",
              onClick: () => navigate("/pricing"),
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "See Pricing" })
            }
          )
        ] })
      ] }) })
    }
  ) });
};
export {
  StickyCTA as S,
  TrustStrip as T
};
