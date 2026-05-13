import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowUpRight, Zap, Clock, Globe, Building2, Users, Warehouse } from "lucide-react";
import { T as TranslatedText, B as Button } from "../main.mjs";
import { useNavigate } from "react-router-dom";
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
const services = [
  { icon: Zap, title: "Same-Day Shipping", short: "Order at 10am? Shipped by 3pm. The Westfield difference.", bestFor: ["DTC", "High-volume"], link: "/order-fulfillment", featured: true },
  { icon: Clock, title: "Same-Day Check-Ins", short: "Inventory checked in, photographed, and ready to sell within 24 hours.", bestFor: ["Launches", "Restocks"], link: "/receiving-inspection" },
  { icon: Globe, title: "International", short: "Customs handled. Worldwide delivery without the headaches.", bestFor: ["Global"], link: "/order-fulfillment" },
  { icon: Building2, title: "B2B Fulfillment", short: "Pallets, wholesale, retail compliance. We speak B2B fluently.", bestFor: ["Wholesale", "Retail"], link: "/order-fulfillment" },
  { icon: Users, title: "DTC Fulfillment", short: "Custom inserts, tissue, thank-you cards. Instagram-worthy unboxings.", bestFor: ["Luxury", "Subscription"], link: "/shopify-fulfillment" },
  { icon: Warehouse, title: "Storage & Warehousing", short: "Flexible terms. No long-term contracts. Pay for what you use.", bestFor: ["Seasonal", "Overflow"], link: "/storage-warehousing" }
];
const Services = () => {
  const navigate = useNavigate();
  const [featured, ...rest] = services;
  const FeatureIcon = featured.icon;
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "services",
      className: "relative py-28",
      style: {
        background: "linear-gradient(180deg, #F4F2ED 0%, hsl(var(--background)) 100%)"
      },
      children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 mb-14", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold tracking-[0.22em] uppercase text-secondary", children: "What we do · 06 services" }) }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight", children: [
              /* @__PURE__ */ jsx(TranslatedText, { children: "Every fulfillment" }),
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "font-display italic font-normal text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "scenario, covered." }) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-5 text-lg text-muted-foreground max-w-xl", children: /* @__PURE__ */ jsx(TranslatedText, { children: "From your first 50 orders to full-scale multi-channel distribution — the playbook is built." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-5", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => navigate(featured.link),
              className: "lg:row-span-2 cursor-pointer group relative rounded-3xl bg-primary text-primary-foreground p-10 overflow-hidden hover:-translate-y-1 transition-all min-h-[440px] flex flex-col justify-between",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl",
                    style: { background: "hsl(var(--secondary))" },
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-secondary", children: "01 / Flagship" }),
                  /* @__PURE__ */ jsx("div", { className: "mt-4 w-20 h-20 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center", children: /* @__PURE__ */ jsx(FeatureIcon, { className: "w-10 h-10 text-secondary", strokeWidth: 1.5 }) }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-6 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]", children: /* @__PURE__ */ jsx(TranslatedText, { children: featured.title }) }),
                  /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-white/80 leading-relaxed max-w-md", children: /* @__PURE__ */ jsx(TranslatedText, { children: featured.short }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-between mt-8", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: featured.bestFor.map((b, i) => /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider",
                      children: /* @__PURE__ */ jsx(TranslatedText, { children: b })
                    },
                    i
                  )) }),
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center group-hover:rotate-45 transition-transform", children: /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-5 h-5" }) })
                ] })
              ]
            }
          ),
          rest.map((s, i) => {
            const Icon = s.icon;
            const iconBgs = [
              "bg-secondary/15 text-secondary",
              "bg-primary/10 text-primary",
              "bg-secondary/15 text-secondary",
              "bg-primary/10 text-primary",
              "bg-secondary/15 text-secondary"
            ];
            return /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => navigate(s.link),
                className: "cursor-pointer group relative rounded-2xl bg-background border border-border p-7 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-xl transition-all",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-5", children: [
                    /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center ${iconBgs[i]}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) }),
                    /* @__PURE__ */ jsx("span", { className: "font-display italic text-2xl text-primary/20", children: String(i + 2).padStart(2, "0") })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-primary tracking-tight mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: s.title }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: s.short }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-border", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: s.bestFor.map((b, j) => /* @__PURE__ */ jsxs(
                      "span",
                      {
                        className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
                        children: [
                          b,
                          j < s.bestFor.length - 1 && /* @__PURE__ */ jsx("span", { className: "ml-1", children: "·" })
                        ]
                      },
                      j
                    )) }),
                    /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" })
                  ] })
                ]
              },
              i
            );
          })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-14 text-center", children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "lg",
            onClick: () => navigate("/contact"),
            className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-7 text-lg shadow-lg shadow-secondary/30",
            children: /* @__PURE__ */ jsx(TranslatedText, { children: "Explore all services" })
          }
        ) })
      ] }) })
    }
  );
};
export {
  Services as default
};
