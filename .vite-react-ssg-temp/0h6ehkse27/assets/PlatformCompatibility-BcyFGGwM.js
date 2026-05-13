import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight, ShoppingBag, Package, ShoppingCart, Music, Store, Building2, Palette } from "lucide-react";
import { T as TranslatedText } from "../main.mjs";
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
const PlatformCompatibility = () => {
  const navigate = useNavigate();
  const platforms = [
    { name: "Shopify", icon: ShoppingBag },
    { name: "Amazon", icon: Package },
    { name: "WooCommerce", icon: ShoppingCart },
    { name: "TikTok Shop", icon: Music },
    { name: "BigCommerce", icon: Store },
    { name: "Walmart", icon: Building2 },
    { name: "Etsy", icon: Palette },
    { name: "eBay", icon: Store }
  ];
  const marqueeRow = [...platforms, ...platforms];
  return /* @__PURE__ */ jsxs("section", { className: "relative py-24 bg-background overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 mb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold tracking-[0.22em] uppercase text-secondary", children: "Integrations · API-first" }),
      /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-4xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Plays nicely with" }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-display italic font-normal text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "everything you sell on." }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-5 text-lg text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Connect your store in minutes. Orders flow automatically, inventory syncs in real-time." }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" }),
      /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" }),
      /* @__PURE__ */ jsx("div", { className: "group flex overflow-hidden py-6", children: /* @__PURE__ */ jsx("div", { className: "flex shrink-0 animate-marquee gap-6 group-hover:[animation-play-state:paused]", children: marqueeRow.map((p, i) => {
        const Icon = p.icon;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-7 py-5 rounded-2xl bg-muted border border-border min-w-[220px] hover:border-secondary/40 hover:bg-background transition-all",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-background flex items-center justify-center ring-1 ring-border", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-primary text-lg", children: p.name }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-secondary font-bold uppercase tracking-wider", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Native sync" }) })
              ] })
            ]
          },
          i
        );
      }) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 mt-14", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto rounded-3xl bg-primary text-primary-foreground p-10 md:p-14 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-15",
          style: {
            background: "radial-gradient(circle at 80% 20%, hsl(var(--secondary)), transparent 55%)"
          },
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative grid md:grid-cols-[1.2fr_auto] gap-8 items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-[0.18em] mb-4", children: [
            /* @__PURE__ */ jsx(Zap, { className: "w-3 h-3 text-secondary" }),
            /* @__PURE__ */ jsx(TranslatedText, { children: "API · Webhook · Real-time" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-bold tracking-tight mb-3", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Selling on multiple channels?" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-white/80 text-lg max-w-2xl", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We manage your inventory centrally so you never oversell and always ship fast." }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => navigate("/sales-channels"),
              className: "inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold transition-colors",
              children: [
                /* @__PURE__ */ jsx(TranslatedText, { children: "See platforms" }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate("/integrations"),
              className: "inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-primary font-bold transition-colors",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "View API" })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
export {
  PlatformCompatibility as default
};
