import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShoppingCart, Package, Layers } from "lucide-react";
import { T as TranslatedText, t as trackEvent } from "../main.mjs";
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
const personas = [
  {
    id: "shopify",
    icon: ShoppingCart,
    label: "Shopify DTC",
    title: "Shopify DTC Brand",
    headline: "Fast, reliable pick-pack.",
    description: "Same-day shipping, custom branding, native Shopify sync. Perfect for direct-to-consumer brands scaling fast.",
    link: "/shopify-fulfillment",
    features: ["Same-day processing", "Custom packaging & inserts", "Real-time inventory sync", "QC photo proof"],
    metric: { value: "92%", label: "of orders ship same-day" }
  },
  {
    id: "amazon",
    icon: Package,
    label: "Amazon FBA",
    title: "Amazon FBA Seller",
    headline: "Compliant FBA prep.",
    description: "FNSKU labeling, polybag, bundling, shipment creation. Get your inventory Amazon-ready in 24 hours.",
    link: "/amazon-fba-prep",
    features: ["FNSKU labeling", "Bundling & kitting", "24hr turnaround", "Direct ship to FCs"],
    metric: { value: "24hr", label: "Amazon-ready turnaround" }
  },
  {
    id: "hybrid",
    icon: Layers,
    label: "Hybrid",
    title: "Hybrid Seller",
    headline: "DTC + Marketplace, unified.",
    description: "One inventory, multiple channels, single dashboard. Shopify + Amazon + Walmart under one roof.",
    link: "/pricing",
    features: ["Multi-channel sync", "Single source of truth", "Unified dashboard", "No double-counting"],
    metric: { value: "1", label: "inventory across all channels" }
  }
];
const UseCaseSection = () => {
  const [active, setActive] = useState("shopify");
  const persona = personas.find((p) => p.id === active);
  const Icon = persona.icon;
  const handleSelect = (id) => {
    setActive(id);
    trackEvent("use_case_selected", { persona: id });
  };
  return /* @__PURE__ */ jsx("section", { className: "relative py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold tracking-[0.22em] uppercase text-secondary", children: "Built for your business" }),
      /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-4xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Which seller" }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-display italic font-normal text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "are you?" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-10", children: /* @__PURE__ */ jsx("div", { className: "inline-flex p-1.5 rounded-full bg-muted border border-border", children: personas.map((p) => {
      const isActive = p.id === active;
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleSelect(p.id),
          className: `px-5 md:px-7 py-2.5 rounded-full text-sm font-bold transition-all ${isActive ? "bg-primary text-primary-foreground shadow-md" : "text-primary/60 hover:text-primary"}`,
          children: /* @__PURE__ */ jsx(TranslatedText, { children: p.label })
        },
        p.id
      );
    }) }) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative grid lg:grid-cols-[1.3fr_1fr] gap-0 rounded-3xl overflow-hidden bg-primary text-primary-foreground shadow-2xl animate-fade-in",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-10 md:p-14 relative", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-25 blur-3xl",
                style: { background: "hsl(var(--secondary))" },
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary mb-5", children: [
                /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx(TranslatedText, { children: persona.title })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5", children: /* @__PURE__ */ jsx(TranslatedText, { children: persona.headline }) }),
              /* @__PURE__ */ jsx("p", { className: "text-lg text-white/80 leading-relaxed mb-8 max-w-lg", children: /* @__PURE__ */ jsx(TranslatedText, { children: persona.description }) }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-8", children: persona.features.map((f, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-white/95", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-secondary flex-shrink-0" }),
                /* @__PURE__ */ jsx(TranslatedText, { className: "font-medium", children: f })
              ] }, i)) }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: persona.link,
                  className: "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold transition-all hover:-translate-y-0.5 group",
                  children: [
                    /* @__PURE__ */ jsx(TranslatedText, { children: "Learn more" }),
                    /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative bg-secondary/10 border-l border-white/10 p-10 md:p-14 flex flex-col justify-center items-center text-center", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 opacity-10",
                style: {
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                },
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(Icon, { className: "w-12 h-12 text-secondary", strokeWidth: 1.5 }) }),
              /* @__PURE__ */ jsx("div", { className: "text-7xl md:text-8xl font-bold tracking-tight text-white leading-none", children: persona.metric.value }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 text-sm font-bold uppercase tracking-[0.16em] text-white/70 max-w-[200px]", children: /* @__PURE__ */ jsx(TranslatedText, { children: persona.metric.label }) })
            ] })
          ] })
        ]
      },
      persona.id
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center gap-3", children: personas.map((p) => {
      const isActive = p.id === active;
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleSelect(p.id),
          className: `h-1.5 rounded-full transition-all ${isActive ? "w-12 bg-secondary" : "w-6 bg-border hover:bg-secondary/40"}`,
          "aria-label": `View ${p.label}`
        },
        p.id
      );
    }) })
  ] }) }) });
};
export {
  UseCaseSection as default
};
