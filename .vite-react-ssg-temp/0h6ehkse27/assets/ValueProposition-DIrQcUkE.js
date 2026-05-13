import { jsx, jsxs } from "react/jsx-runtime";
import { Package, DollarSign, MapPin, TrendingUp, CheckCircle, Users } from "lucide-react";
import { T as TranslatedText } from "../main.mjs";
import "vite-react-ssg";
import "react";
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
const ValueProposition = () => {
  const hero = {
    icon: Package,
    title: "Speed that keeps customers happy.",
    description: "Your orders ship same-day. Same-day receiving means your inventory is live and selling faster — not sitting on a dock for a week. We've built the systems, the team, and the LA-port-adjacent location to make every hour count.",
    stat: "Same-Day",
    statLabel: "processing & shipping"
  };
  const small = [
    { icon: DollarSign, title: "No 'gotcha' invoices", description: "Know exactly what you'll pay before you sign. Zero hidden fees.", stat: "0", statLabel: "Hidden fees" },
    { icon: MapPin, title: "The LA advantage", description: "Minutes from the Port of LA — lower import costs, faster West Coast.", stat: "22mi", statLabel: "To Port of LA" },
    { icon: TrendingUp, title: "Grow without growing pains", description: "No minimums, no commitments. 50 or 50,000 orders — we flex with you.", stat: "0", statLabel: "Minimums" },
    { icon: CheckCircle, title: "99.8% accuracy, obsessively", description: "Our specialists treat your products like their own. One mis-ship is one too many.", stat: "99.8%", statLabel: "Accuracy" },
    { icon: Users, title: "A team that responds", description: "Direct access to your account team. No ticket queues. No bots. No ghosting.", stat: "<2hr", statLabel: "Response time" }
  ];
  return /* @__PURE__ */ jsx("section", { className: "relative py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 mb-14", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold tracking-[0.22em] uppercase text-secondary", children: "Why switch" }),
        /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-[0.95] tracking-tight", children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "Why brands fire" }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx(TranslatedText, { children: "their old 3PL and" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-display italic font-normal text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "switch." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 lg:pt-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Missed shipments. Ghost-mode support. Surprise fees. We've heard the horror stories — and engineered the fix." }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-x-6 gap-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1 w-10 bg-primary rounded-full" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary", children: "100+ Brands" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1 w-10 bg-secondary rounded-full" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-secondary", children: "2M+ Orders / yr" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 lg:row-span-2 relative rounded-3xl bg-primary text-primary-foreground p-10 md:p-12 overflow-hidden flex flex-col justify-between min-h-[420px]", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30 blur-3xl",
            style: { background: "hsl(var(--secondary))" },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(hero.icon, { className: "w-8 h-8 text-secondary" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-5", children: /* @__PURE__ */ jsx(TranslatedText, { children: hero.title }) }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-white/80 leading-relaxed max-w-lg", children: /* @__PURE__ */ jsx(TranslatedText, { children: hero.description }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative mt-8 flex items-end justify-between gap-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-display italic text-7xl md:text-8xl text-secondary leading-none", children: hero.stat }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm font-bold uppercase tracking-[0.16em] text-white/70", children: /* @__PURE__ */ jsx(TranslatedText, { children: hero.statLabel }) })
        ] }) })
      ] }),
      small.map((b, i) => {
        const Icon = b.icon;
        const variants = [
          "bg-background border border-border shadow-sm",
          "bg-muted border border-border",
          "bg-background border-t-4 border-t-secondary border-x border-b border-border shadow-sm",
          "bg-background border border-border shadow-sm",
          "bg-muted border border-border"
        ];
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `lg:col-span-5 rounded-2xl p-7 hover:-translate-y-0.5 transition-all ${variants[i]}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 text-secondary" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-primary tracking-tight mb-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: b.title }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: b.description }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right flex-shrink-0", children: [
                /* @__PURE__ */ jsx("div", { className: "font-display italic text-3xl text-secondary leading-none", children: b.stat }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: b.statLabel }) })
              ] })
            ] })
          },
          i
        );
      })
    ] })
  ] }) }) });
};
export {
  ValueProposition as default
};
