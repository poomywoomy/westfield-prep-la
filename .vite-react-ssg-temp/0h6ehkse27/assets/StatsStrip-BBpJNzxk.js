import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Package, Award, TrendingUp, Users } from "lucide-react";
import { u as useIntersectionObserver } from "./use-intersection-observer-0IkYX39w.js";
import { M as MetricCounter } from "./metric-counter-TC-ts67f.js";
import { T as TranslatedText } from "../main.mjs";
import "vite-react-ssg";
import "react-router-dom";
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
const StatsStrip = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.3 });
  const isVisible = !!entry?.isIntersecting;
  useEffect(() => {
    if (isVisible && !hasAnimated) setHasAnimated(true);
  }, [isVisible, hasAnimated]);
  const stats = [
    { icon: Package, value: 2e6, suffix: "+", label: "Orders fulfilled", subtext: "Every single one on time." },
    { icon: Award, value: 99.8, suffix: "%", label: "Accuracy rate", subtext: "Close enough isn't good enough." },
    { icon: TrendingUp, value: 15, suffix: "+", label: "Years in business", subtext: "We've seen and solved it all." },
    { icon: Users, value: 100, suffix: "+", label: "Active brands", subtext: "Trusted with their reputation." }
  ];
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref,
      className: "relative py-20 md:py-24 bg-primary text-primary-foreground overflow-hidden",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-25 blur-3xl pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at center, hsl(var(--secondary)), transparent 65%)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 opacity-[0.06] pointer-events-none",
            style: {
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "text-center mb-14", children: /* @__PURE__ */ jsx("span", { className: "font-display italic text-secondary text-2xl", children: "By the numbers" }) }),
          /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 relative", children: stats.map((stat, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `px-4 md:px-8 py-8 text-center relative ${index > 0 ? "lg:border-l border-l-white/10" : ""} ${index === 1 || index === 3 ? "border-l border-l-white/10 lg:border-l" : ""}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "mx-auto h-1 w-10 bg-secondary rounded-full mb-5" }),
                /* @__PURE__ */ jsx("div", { className: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none tabular-nums break-words", children: hasAnimated ? /* @__PURE__ */ jsx(MetricCounter, { value: stat.value, duration: 1500, suffix: stat.suffix }) : /* @__PURE__ */ jsxs("span", { children: [
                  "0",
                  stat.suffix
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "mt-4 text-sm md:text-base font-bold uppercase tracking-[0.16em] text-white/95", children: /* @__PURE__ */ jsx(TranslatedText, { children: stat.label }) }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs md:text-sm text-white/55 font-display italic", children: /* @__PURE__ */ jsx(TranslatedText, { children: stat.subtext }) })
              ]
            },
            index
          )) })
        ] })
      ]
    }
  );
};
export {
  StatsStrip as default
};
