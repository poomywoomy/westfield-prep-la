import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { T as TranslatedText, B as Button } from "../main.mjs";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { G as GridBackdrop } from "./HomePrimitives-DXHeGbEl.js";
import "vite-react-ssg";
import "react";
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
const FinalCTA = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("section", { className: "relative py-24 overflow-hidden bg-primary", children: [
    /* @__PURE__ */ jsx(GridBackdrop, { color: "white", opacity: 0.06 }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl",
        style: {
          background: "radial-gradient(circle, hsl(var(--secondary)), transparent 65%)"
        },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 relative", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center text-primary-foreground", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Your Competitors Are Already Shipping Faster." }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "What Are You Waiting For?" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl mb-10 text-white/85 leading-relaxed max-w-3xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get a free fulfillment audit from our team. We'll analyze your current operations, show you where you're leaving money on the table, and map out exactly how Westfield can help you scale. No sales pitch. Just real advice from people who've done this 2 million times." }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4 mb-10", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "lg",
            onClick: () => navigate("/contact"),
            className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-7 text-lg shadow-2xl shadow-secondary/30 hover:-translate-y-0.5 transition-all group",
            children: [
              /* @__PURE__ */ jsx(TranslatedText, { children: "Get Your Free Fulfillment Audit" }),
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "lg",
            onClick: () => navigate("/pricing"),
            variant: "outline",
            className: "border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-primary font-bold px-10 py-7 text-lg transition-all",
            children: /* @__PURE__ */ jsx(TranslatedText, { children: "View Pricing" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-6 justify-center items-center mb-6 text-white/85", children: [
        /* @__PURE__ */ jsxs("a", { href: "tel:+18189355478", className: "flex items-center gap-2 hover:text-secondary transition-colors", children: [
          /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "1.818.935.5478" })
        ] }),
        /* @__PURE__ */ jsxs("a", { href: "mailto:info@westfieldprepcenter.com", className: "flex items-center gap-2 hover:text-secondary transition-colors", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "info@westfieldprepcenter.com" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-white/65", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Trusted by 100+ e-commerce brands · 2M+ orders shipped · Same-day turnaround, every time" }) })
    ] }) })
  ] });
};
export {
  FinalCTA as default
};
