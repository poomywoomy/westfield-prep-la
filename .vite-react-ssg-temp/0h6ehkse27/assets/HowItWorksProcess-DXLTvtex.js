import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { T as TranslatedText, B as Button } from "../main.mjs";
import { ArrowRight, Package, Database, PackageCheck, Truck } from "lucide-react";
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
const HowItWorksProcess = () => {
  const navigate = useNavigate();
  const steps = [
    { icon: Package, number: "01", title: "Receive", description: "Ship it to us, we handle the rest. Same-day receiving with complete photo documentation so you know exactly what arrived.", stat: "Same-Day", statLabel: "Processing" },
    { icon: Database, number: "02", title: "Store", description: "Your products, organized and tracked in real-time. Strategic placement means faster picking and fewer errors.", stat: "Real-Time", statLabel: "Tracking" },
    { icon: PackageCheck, number: "03", title: "Fulfill", description: "When orders hit, we move. Same-day turnaround with quality checks that catch mistakes before customers do.", stat: "99.9%", statLabel: "Order Accuracy" },
    { icon: Truck, number: "04", title: "Ship", description: "Best carrier for speed and cost, automatically selected. Your customers get tracking, you get peace of mind.", stat: "2-Day", statLabel: "West Coast" }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "relative py-28 bg-primary text-primary-foreground overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-[0.05] pointer-events-none",
        style: {
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-1/2 -left-40 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none",
        style: { background: "hsl(var(--secondary))" },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 relative", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold tracking-[0.22em] uppercase text-secondary", children: "How it works · 04 steps" }),
        /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight", children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "How it actually works." }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "font-display italic font-normal text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "(No jargon.)" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 text-lg text-white/70 max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We made fulfillment simple because you've got a brand to build." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-[60px] md:left-[88px] top-0 bottom-0 w-px bg-gradient-to-b from-secondary/60 via-white/20 to-transparent", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-12", children: steps.map((step, index) => {
          const Icon = step.icon;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] gap-6 md:gap-10 items-start group",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "font-display italic text-7xl md:text-9xl leading-none text-transparent select-none",
                      style: { WebkitTextStroke: "1.5px hsl(var(--secondary))" },
                      children: step.number
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute top-8 -right-1 md:-right-3 w-5 h-5 rounded-full bg-secondary ring-4 ring-primary z-10" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-7 md:p-8 hover:bg-white/10 hover:border-secondary/30 transition-all", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                    /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-secondary" }),
                    /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-bold tracking-tight", children: /* @__PURE__ */ jsx(TranslatedText, { children: step.title }) })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-white/75 text-base md:text-lg leading-relaxed mb-5 max-w-2xl", children: /* @__PURE__ */ jsx(TranslatedText, { children: step.description }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-4 border-t border-white/10", children: [
                    /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: step.stat }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-widest text-white/50 font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: step.statLabel }) })
                  ] })
                ] })
              ]
            },
            index
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-16", children: /* @__PURE__ */ jsxs(
        Button,
        {
          size: "lg",
          onClick: () => navigate("/contact"),
          className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-7 text-lg shadow-lg shadow-secondary/30 group",
          children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Schedule your onboarding call" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })
          ]
        }
      ) })
    ] }) })
  ] });
};
export {
  HowItWorksProcess as default
};
