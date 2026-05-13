import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Star, Quote } from "lucide-react";
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
const Reviews = () => {
  const reviews = [
    {
      name: "Bryan Flores",
      company: "Home Goods Brand",
      platform: "Amazon + Shopify",
      role: "Founder & CEO",
      text: "I have nothing but good things to say about Westfield since I've started working with them. Quality and smooth process every time. They help process a good amount of units for my business and I'd definitely recommend them."
    },
    {
      name: "Michael Chen",
      company: "Beauty Brand",
      platform: "Shopify Store",
      role: "Operations Lead",
      text: "We ship 500+ Shopify orders a month. Westfield ships same-day, QC photos cut support tickets in half, and they just get it. Onboarding took less than a week."
    },
    {
      name: "Sarah Martinez",
      company: "Apparel Company",
      platform: "Multi-Channel",
      role: "Co-Founder",
      text: "Fast, brand-safe DTC. Branded packaging, custom inserts, and seamless Shopify + Amazon handling. Our unboxing reviews on TikTok have never been better."
    },
    {
      name: "Nuantip Diteesrivorakul",
      company: "E-Commerce Seller",
      platform: "Amazon FBA",
      role: "Owner",
      text: "Working with Westfield for 4-5 months sending 3k units/month. Great communication and fast turnaround on all shipments. They flag issues before they become problems."
    }
  ];
  const [active, setActive] = useState(0);
  const featured = reviews[active];
  return /* @__PURE__ */ jsx("section", { className: "relative py-28 bg-background overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold tracking-[0.22em] uppercase text-secondary", children: "Testimonials · 5.0 on Google" }),
        /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-4xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight max-w-2xl", children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "What growing brands" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-secondary", children: "say." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 fill-secondary text-secondary" }, i)),
        /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-primary ml-2", children: "5.0" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "/ 6 reviews" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Quote, { className: "absolute -top-6 -left-2 w-24 h-24 text-secondary/15", strokeWidth: 1 }),
      /* @__PURE__ */ jsxs(
        "blockquote",
        {
          className: "relative text-2xl md:text-4xl lg:text-5xl font-medium text-primary leading-[1.25] tracking-tight max-w-5xl animate-fade-in",
          children: [
            '"',
            featured.text,
            '"'
          ]
        },
        active
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 flex items-center gap-5", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold ring-4 ring-secondary/20", children: featured.name.charAt(0) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-primary", children: featured.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            featured.role,
            " · ",
            featured.company
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-secondary font-bold uppercase tracking-widest mt-0.5", children: featured.platform })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-14 pt-10 border-t border-border", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5", children: /* @__PURE__ */ jsx(TranslatedText, { children: "More reviews" }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: reviews.map((r, i) => {
        const isActive = i === active;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActive(i),
            className: `text-left p-5 rounded-xl border transition-all ${isActive ? "bg-primary text-primary-foreground border-primary shadow-lg -translate-y-1" : "bg-background border-border hover:border-secondary/40 hover:-translate-y-0.5"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", children: [...Array(5)].map((_, j) => /* @__PURE__ */ jsx(
                Star,
                {
                  className: `w-3 h-3 ${isActive ? "fill-secondary text-secondary" : "fill-secondary text-secondary"}`
                },
                j
              )) }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: `text-sm font-bold mb-1 ${isActive ? "text-white" : "text-primary"}`,
                  children: r.name
                }
              ),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: `text-xs ${isActive ? "text-white/70" : "text-muted-foreground"}`,
                  children: r.company
                }
              )
            ]
          },
          i
        );
      }) })
    ] })
  ] }) }) });
};
export {
  Reviews as default
};
