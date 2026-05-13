import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { T as TranslatedText, B as Button } from "../main.mjs";
import { Rocket, ArrowRight, Zap, PackageCheck, Sparkles } from "lucide-react";
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
const LaunchpadCallout = () => {
  const navigate = useNavigate();
  const bullets = [
    { icon: Zap, text: "Onboarding in days, not months" },
    { icon: PackageCheck, text: "Receiving, prep & shipping under one roof" },
    { icon: Sparkles, text: "Custom playbook for your first 1,000 orders" }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden py-24 bg-background", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70%] -skew-y-2 bg-secondary",
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70%] -skew-y-2 opacity-20",
        style: {
          backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 38px, hsl(var(--secondary-foreground)/0.4) 38px, hsl(var(--secondary-foreground)/0.4) 39px)"
        },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 relative", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "relative grid lg:grid-cols-[1.3fr_1fr] gap-0 rounded-3xl bg-background shadow-[0_30px_80px_-20px_rgba(10,10,35,0.5)] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-10 md:p-14 relative", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-[11px] font-bold tracking-[0.18em] uppercase mb-5", children: [
          /* @__PURE__ */ jsx(Rocket, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsx(TranslatedText, { children: "Westfield Launchpad" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-[1.0] tracking-tight", children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "From idea to" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-display italic font-normal text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "shipping" }) }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx(TranslatedText, { children: "in weeks." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl", children: /* @__PURE__ */ jsx(TranslatedText, { children: "A guided onboarding program built for new and growing brands. We set up your integrations, prep your inventory, and get your first orders out the door — fast." }) }),
        /* @__PURE__ */ jsx("ul", { className: "mt-8 space-y-3", children: bullets.map((b, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(b.icon, { className: "w-4 h-4 text-secondary" }) }),
          /* @__PURE__ */ jsx(TranslatedText, { className: "text-primary font-medium", children: b.text })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "lg",
              onClick: () => navigate("/launchpad"),
              className: "bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all group",
              children: [
                /* @__PURE__ */ jsx(TranslatedText, { children: "Explore Launchpad" }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "lg",
              variant: "outline",
              onClick: () => navigate("/contact"),
              className: "border-2 border-primary/20 bg-transparent text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-6 text-lg transition-all",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "Talk to a specialist" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-primary text-primary-foreground p-10 md:p-12 flex flex-col justify-center items-center text-center overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 opacity-30",
            style: {
              background: "radial-gradient(circle at 50% 60%, hsl(var(--secondary)/0.6), transparent 60%)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 opacity-[0.06]",
            style: {
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-flex items-center justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-secondary/30 blur-3xl scale-150" }),
            /* @__PURE__ */ jsx(Rocket, { className: "relative w-32 h-32 md:w-40 md:h-40 text-secondary animate-float", strokeWidth: 1.25 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
            /* @__PURE__ */ jsx("div", { className: "font-display italic text-5xl md:text-6xl text-white leading-none", children: "days" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs uppercase tracking-[0.2em] text-white/60 font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "not months · for new & scaling brands" }) })
          ] })
        ] })
      ] })
    ] }) }) })
  ] });
};
export {
  LaunchpadCallout as default
};
