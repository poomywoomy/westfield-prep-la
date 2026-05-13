import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { B as Button, S as StructuredData, H as Header, F as Footer, n as generateMetaTags } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DollarSign, Package, ArrowRight, RotateCcw, CheckCircle, XCircle, PackageCheck, Camera, ClipboardCheck, GitBranch, CheckCircle2, TrendingUp, Clock } from "lucide-react";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
import { M as MetricCounter } from "./metric-counter-TC-ts67f.js";
import { SiShopify, SiAmazon } from "react-icons/si";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "@radix-ui/react-dropdown-menu";
import "./use-intersection-observer-0IkYX39w.js";
const ReturnsHero = () => {
  const navigate = useNavigate();
  const [flowStage, setFlowStage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowStage((prev) => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-rose-950 via-red-900 to-slate-950" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute w-4 h-4 rounded-full bg-green-400/20",
        initial: {
          x: `${20 + i * 15}%`,
          y: "100%",
          opacity: 0
        },
        animate: {
          y: "-10%",
          opacity: [0, 0.6, 0]
        },
        transition: {
          duration: 4,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeOut"
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsx("div", { className: "container relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "text-center mb-12",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 mb-6", children: [
              /* @__PURE__ */ jsx(DollarSign, { className: "w-4 h-4 text-green-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-green-200", children: "$87K Avg. Monthly Value Recovered" })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight", children: [
              "Returns Are Revenue",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-green-400", children: "Waiting to Be Recovered" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-rose-100/80 mb-8 max-w-3xl mx-auto", children: "Stop treating returns as a write-off. Our 5-hour processing workflow turns 85% of returns back into sellable inventory. Photo documentation, smart sorting, and seamless marketplace integration." })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.3 },
          className: "relative max-w-3xl mx-auto mb-12",
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 md:gap-4 flex-wrap", children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: `flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${flowStage >= 0 ? "bg-rose-500/20 border-2 border-rose-400" : "bg-slate-800/50 border-2 border-slate-700"}`,
                animate: { scale: flowStage === 0 ? 1.05 : 1 },
                children: [
                  /* @__PURE__ */ jsx(Package, { className: `w-8 h-8 ${flowStage >= 0 ? "text-rose-400" : "text-slate-500"}` }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs mt-2 text-white font-medium", children: "Received" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(ArrowRight, { className: `w-6 h-6 transition-colors ${flowStage >= 1 ? "text-white" : "text-slate-600"}` }),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: `flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${flowStage >= 1 ? "bg-amber-500/20 border-2 border-amber-400" : "bg-slate-800/50 border-2 border-slate-700"}`,
                animate: { scale: flowStage === 1 ? 1.05 : 1 },
                children: [
                  /* @__PURE__ */ jsx(RotateCcw, { className: `w-8 h-8 ${flowStage >= 1 ? "text-amber-400" : "text-slate-500"}` }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs mt-2 text-white font-medium", children: "Inspected" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(ArrowRight, { className: `w-6 h-6 transition-colors ${flowStage >= 2 ? "text-white" : "text-slate-600"}` }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  className: `flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${flowStage >= 2 && flowStage !== 4 ? "bg-green-500/20 border-2 border-green-400" : "bg-slate-800/50 border-2 border-slate-700"}`,
                  animate: { scale: flowStage === 2 ? 1.05 : 1 },
                  children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: `w-6 h-6 ${flowStage >= 2 ? "text-green-400" : "text-slate-500"}` }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-white font-medium", children: "85% Resellable" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  className: `flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${flowStage >= 4 ? "bg-red-500/20 border-2 border-red-400" : "bg-slate-800/50 border-2 border-slate-700"}`,
                  animate: { scale: flowStage === 4 ? 1.05 : 1 },
                  children: [
                    /* @__PURE__ */ jsx(XCircle, { className: `w-6 h-6 ${flowStage >= 4 ? "text-red-400" : "text-slate-500"}` }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-white font-medium", children: "15% Damaged" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(ArrowRight, { className: `w-6 h-6 transition-colors ${flowStage >= 3 ? "text-green-400" : "text-slate-600"}` }),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: `flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${flowStage >= 3 ? "bg-green-500/30 border-2 border-green-400 shadow-lg shadow-green-500/20" : "bg-slate-800/50 border-2 border-slate-700"}`,
                animate: { scale: flowStage === 3 ? 1.1 : 1 },
                children: [
                  /* @__PURE__ */ jsx(DollarSign, { className: `w-8 h-8 ${flowStage >= 3 ? "text-green-400" : "text-slate-500"}` }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs mt-2 text-white font-medium", children: "Recovered" })
                ]
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.5 },
          className: "flex flex-col sm:flex-row items-center justify-center gap-4",
          children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "lg",
                onClick: () => navigate("/contact"),
                className: "bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-6 text-lg",
                children: "Calculate Your Recovery"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "lg",
                variant: "outline",
                onClick: () => navigate("/pricing"),
                className: "border-2 border-rose-400/50 bg-rose-500/10 text-white hover:bg-rose-500/20 px-8 py-6 text-lg",
                children: "View Pricing"
              }
            )
          ]
        }
      )
    ] }) })
  ] });
};
const ReturnsWorkflow = () => {
  const steps = [
    {
      step: 1,
      icon: PackageCheck,
      title: "Return Received",
      desc: "Items logged upon arrival. Quantities verified against expected return manifest. Added to receiving location for processing."
    },
    {
      step: 2,
      icon: Camera,
      title: "QC Photo Documentation",
      desc: "Mandatory photos uploaded for transparency. High-resolution images capture item condition. Photos retained for 30 days.",
      highlight: true
    },
    {
      step: 3,
      icon: ClipboardCheck,
      title: "Quality Inspection",
      desc: "Physical inspection of each item. Damage assessment, functionality testing, and packaging condition evaluation."
    },
    {
      step: 4,
      icon: GitBranch,
      title: "Condition Decision",
      desc: "Smart sorting based on inspection results. Resellable items go one direction, damaged items another.",
      split: true
    },
    {
      step: 5,
      icon: CheckCircle2,
      title: "Final Disposition",
      desc: "Resellable items restocked to available inventory. Damaged items flagged for your decision on disposal or rework."
    }
  ];
  const returnTypes = ["Customer Returns", "FBA Returns", "Damaged in Transit", "Quality Issues"];
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Returns Processing Workflow" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto mb-8", children: "Every return follows our proven 5-step process for maximum value recovery" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 justify-center", children: returnTypes.map((type, idx) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm font-medium border border-rose-200",
              children: type
            },
            idx
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto relative", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 -translate-y-1/2 pointer-events-none z-0" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10", children: steps.map((item) => {
        const IconComponent = item.icon;
        return /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: item.step * 0.1 },
            children: /* @__PURE__ */ jsxs(
              Card,
              {
                className: `h-full bg-white p-6 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${item.highlight ? "border-2 border-rose-400 ring-4 ring-rose-100" : ""}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-14 h-14 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconComponent, { className: "w-7 h-7 text-rose-600" }) }),
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 mx-auto mb-3 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold", children: item.step }),
                  /* @__PURE__ */ jsx("h3", { className: "font-bold mb-2 text-sm", children: item.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: item.desc })
                ]
              }
            )
          },
          item.step
        );
      }) })
    ] })
  ] }) });
};
const ReturnsPathways = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Two Pathways: Resellable or Damaged" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "After inspection, every item is sorted into one of two pathways. This clear separation ensures accurate inventory and maximum value recovery." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          children: /* @__PURE__ */ jsxs(Card, { className: "p-8 border-2 border-green-500 bg-gradient-to-br from-green-50 to-white h-full", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-7 h-7 text-green-600" }) }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-xl text-green-800", children: "Resellable Items" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-green-700 mb-6 leading-relaxed", children: "Items that pass QC inspection are immediately restocked to your available inventory. They're ready for resale the same day, minimizing time out of stock and maximizing your recovery rate." }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium", children: "qc_pass" }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-green-600" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-green-800", children: "Receiving Location" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pl-8", children: [
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-green-600" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-green-800", children: "Available Inventory" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 p-4 bg-green-100 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-800", children: [
              /* @__PURE__ */ jsx("strong", { children: "92%" }),
              " of returns processed are resellable"
            ] }) })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          children: /* @__PURE__ */ jsxs(Card, { className: "p-8 border-2 border-red-500 bg-gradient-to-br from-red-50 to-white h-full", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(XCircle, { className: "w-7 h-7 text-red-600" }) }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-xl text-red-800", children: "Damaged Items" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-red-700 mb-6 leading-relaxed", children: "Items that fail QC inspection are moved to damaged inventory and flagged for your review. You decide the final disposition: dispose, return to sender, or attempt rework." }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium", children: "qc_fail" }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-red-600" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-red-800", children: "Receiving Location" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pl-8", children: [
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-red-600" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-red-800", children: "Damaged Inventory" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 p-4 bg-red-100 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-800", children: [
              "All damaged items documented with ",
              /* @__PURE__ */ jsx("strong", { children: "photos and notes" })
            ] }) })
          ] })
        }
      )
    ] })
  ] }) });
};
const ReturnsMetrics = () => {
  const metrics = [
    {
      icon: TrendingUp,
      value: 85,
      suffix: "%",
      label: "Recovery Rate",
      desc: "Value recovered from returns"
    },
    {
      icon: DollarSign,
      value: 87,
      prefix: "$",
      suffix: "K",
      label: "Avg Monthly Recovery",
      desc: "Client value recovered"
    },
    {
      icon: RotateCcw,
      value: 92,
      suffix: "%",
      label: "Resellable Rate",
      desc: "Items returned to stock"
    },
    {
      icon: Clock,
      value: 24,
      suffix: "hr",
      label: "Max Turnaround",
      desc: "From arrival to restocked"
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Value Recovery Metrics" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Returns don't have to be a loss. Our optimized process recovers maximum value and gets resellable items back in stock fast." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto", children: metrics.map((metric, idx) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        transition: { delay: idx * 0.1 },
        children: /* @__PURE__ */ jsx(Card, { className: "text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-rose-100", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 md:p-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(metric.icon, { className: "w-7 h-7 text-rose-600" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-3xl md:text-4xl font-bold text-rose-600 mb-1", children: /* @__PURE__ */ jsx(MetricCounter, { value: metric.value, prefix: metric.prefix, suffix: metric.suffix }) }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold mb-1", children: metric.label }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: metric.desc })
        ] }) })
      },
      idx
    )) }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "max-w-2xl mx-auto mt-12",
        children: /* @__PURE__ */ jsxs(Card, { className: "p-6 border-2 border-rose-200", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-center mb-6", children: "The Hidden Cost of Mishandled Returns" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-muted rounded-lg", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Without Professional Processing" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-muted-foreground", children: "~50%" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Recovery rate" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-rose-50 rounded-lg border border-rose-200", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-rose-600 mb-1", children: "With Westfield" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-rose-600", children: "85%+" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-600", children: "Recovery rate" })
            ] })
          ] })
        ] })
      }
    )
  ] }) });
};
const ReturnsIntegrations = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Platform Integrations" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: [
            "Returns sync automatically from your selling platforms. No manual data entry required. View all your integrations on our",
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/integrations", className: "text-rose-600 hover:underline", children: "integrations page" }),
            "."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          children: /* @__PURE__ */ jsx(Card, { className: "h-full transition-all duration-300 hover:shadow-xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-xl bg-[#96bf48]/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(SiShopify, { className: "w-10 h-10 text-[#96bf48]" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-xl mb-3", children: "Shopify Returns" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4 leading-relaxed", children: "Returns created in Shopify automatically sync to our system. Line items are enriched with your SKU data, and processing updates flow back to your store." }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-rose-500" }),
                "Real-time webhook sync"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-rose-500" }),
                "SKU enrichment via aliases"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-rose-500" }),
                "Inventory auto-restocking"
              ] })
            ] })
          ] }) })
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: 0.1 },
          children: /* @__PURE__ */ jsx(Card, { className: "h-full transition-all duration-300 hover:shadow-xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-xl bg-[#FF9900]/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(SiAmazon, { className: "w-10 h-10 text-[#FF9900]" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-xl mb-3", children: "Amazon FBA Returns" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4 leading-relaxed", children: "Removal orders from Amazon FBA are processed with the same care. We receive, inspect, and restock sellable units while documenting unsellable items." }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-rose-500" }),
                "Removal order processing"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-rose-500" }),
                "Condition grading"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-rose-500" }),
                "Re-prep for FBA resend"
              ] })
            ] })
          ] }) })
        }
      )
    ] })
  ] }) });
};
const ReturnsFAQ = () => {
  const faqs = [
    {
      question: "How fast do you process returns?",
      answer: "Most returns are inspected and processed within 5 hours of arrival. Resellable items are restocked the same day. Maximum turnaround is 24 hours, even for complex multi-SKU returns."
    },
    {
      question: "What information do I get about each return?",
      answer: "Every return includes high-resolution photos, condition assessment notes, quantity verification, and a clear pass/fail decision. All documentation is available in your client dashboard."
    },
    {
      question: "How do you determine if an item is resellable vs damaged?",
      answer: "We follow your custom inspection criteria or our standard protocol: checking for physical damage, missing parts, packaging integrity, and functionality. You can set specific rules for your products."
    },
    {
      question: "Can I set custom inspection criteria for my products?",
      answer: "Absolutely. You can configure inspection rules per SKU or product category. For example, cosmetic products might have stricter packaging requirements than durable goods."
    },
    {
      question: "Do you integrate with my Shopify store for returns?",
      answer: "Yes, we have full Shopify integration. Returns created in Shopify sync automatically. We enrich line items with your SKU data and push status updates back to your store."
    },
    {
      question: "What happens to items you classify as damaged?",
      answer: "Damaged items are moved to a separate inventory location and flagged for your review. You decide: dispose, return to sender, attempt rework, or donate. We execute your decision with photo documentation."
    },
    {
      question: "How are discrepancies between expected and actual quantities tracked?",
      answer: "Any variance between expected and received quantities is logged as a discrepancy. You receive notification with photos and can review the issue in your dashboard. We help document evidence for carrier or customer claims."
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Frequently Asked Questions" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Everything you need to know about our returns processing services." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto space-y-4", children: faqs.map((faq, idx) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: idx * 0.05 },
        children: /* @__PURE__ */ jsx(Card, { className: "transition-all duration-300 hover:shadow-lg", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-3 text-rose-900", children: faq.question }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: faq.answer })
        ] }) })
      },
      idx
    )) }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mt-12",
        children: /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
          "Have more questions?",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-rose-600 hover:underline font-medium", children: "Contact our team" })
        ] })
      }
    )
  ] }) });
};
const ReturnsCTA = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-br from-rose-950 via-red-900 to-slate-900 text-white", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      className: "max-w-4xl mx-auto text-center",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-10 h-10 text-rose-300" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: "Streamline Your Returns Today" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-rose-100/80 mb-8 max-w-2xl mx-auto", children: "Stop losing money on mishandled returns. Our optimized reverse logistics process recovers maximum value from every returned item." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-6 mb-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-rose-200", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-rose-400" }),
            /* @__PURE__ */ jsx("span", { children: "85%+ Recovery Rate" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-rose-200", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-rose-400" }),
            /* @__PURE__ */ jsx("span", { children: "5hr Avg Processing" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-rose-200", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-rose-400" }),
            /* @__PURE__ */ jsx("span", { children: "Same-Day Restocking" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "lg",
              onClick: () => navigate("/contact"),
              className: "bg-white text-rose-900 hover:bg-rose-100 px-8 py-6 text-lg group",
              children: [
                "Get Started",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "lg",
              variant: "outline",
              onClick: () => navigate("/pricing"),
              className: "border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg",
              children: "View Pricing"
            }
          )
        ] })
      ]
    }
  ) }) });
};
const ReturnsProcessing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const meta = generateMetaTags(
    "Returns Processing | Los Angeles 3PL & Prep Center Services",
    "Fast returns processing at our LA prep center. 5-hour inspection, restocking, and value recovery. Expert 3PL reverse logistics for Amazon FBA and e-commerce returns.",
    "/returns-processing"
  );
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Returns Processing Services",
    "description": "Professional returns processing and reverse logistics",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    }
  };
  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How fast do you process returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most returns are inspected and processed within 5 hours of arrival with immediate photo documentation and reporting."
        }
      },
      {
        "@type": "Question",
        "name": "What information do I get about each return?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You receive QC photos, condition assessment, reason codes, and disposition recommendations for every returned item."
        }
      },
      {
        "@type": "Question",
        "name": "How do you determine resellable vs damaged?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our trained QC team inspects each item against your criteria. Resellable items must pass packaging, functionality, and appearance checks."
        }
      },
      {
        "@type": "Question",
        "name": "Can I set custom inspection criteria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can define custom pass/fail criteria per SKU or product category through your dashboard settings."
        }
      },
      {
        "@type": "Question",
        "name": "Do you integrate with my Shopify store?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we sync with Shopify returns automatically. Return webhooks update inventory in real-time as items are processed."
        }
      },
      {
        "@type": "Question",
        "name": "What happens to damaged items?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Damaged items are moved to a separate location. You choose: discard, return to sender, liquidate, or attempt repair."
        }
      },
      {
        "@type": "Question",
        "name": "How are discrepancies tracked?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Expected vs actual quantities are compared. Any variance triggers an alert with photos and notes for your review."
        }
      }
    ]
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: meta.title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: meta.description }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "3pl los angeles, prep center, returns processing, reverse logistics, amazon fba returns, ecommerce fulfillment" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: meta.canonical })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "service", data: serviceData }),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqSchemaData }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Returns Processing", path: "/returns-processing" }] }),
      /* @__PURE__ */ jsx(ReturnsHero, {}),
      /* @__PURE__ */ jsx(ReturnsWorkflow, {}),
      /* @__PURE__ */ jsx(ReturnsPathways, {}),
      /* @__PURE__ */ jsx(ReturnsMetrics, {}),
      /* @__PURE__ */ jsx(ReturnsIntegrations, {}),
      /* @__PURE__ */ jsx(ReturnsFAQ, {}),
      /* @__PURE__ */ jsx(ReturnsCTA, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  ReturnsProcessing as default
};
