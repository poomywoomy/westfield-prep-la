import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { B as Button, A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent, S as StructuredData, H as Header, F as Footer, n as generateMetaTags } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Shield, RefreshCw, Database, BarChart3, AlertTriangle, ShoppingCart, Scan, Cloud, Smartphone, Zap, Bell, TrendingUp, RotateCcw, Layers, Calendar, ArrowRight, ClipboardList, CheckCircle, AlertCircle, FileText, Thermometer, Warehouse } from "lucide-react";
import { u as useIntersectionObserver } from "./use-intersection-observer-0IkYX39w.js";
import { SiShopify, SiAmazon, SiTiktok } from "react-icons/si";
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
const InventoryHero = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("section", { className: "relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-30",
        style: {
          backgroundImage: `
            radial-gradient(at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
            radial-gradient(at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
            radial-gradient(at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 70%)
          `
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 left-1/3 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] animate-pulse", style: { animationDelay: "1.5s" } }),
    /* @__PURE__ */ jsx("div", { className: "container relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: "flex flex-wrap justify-center gap-4 mb-8",
          children: [
            { icon: Shield, text: "99.9% Accuracy" },
            { icon: RefreshCw, text: "Real-Time Sync" },
            { icon: Database, text: "10,000+ SKUs" }
          ].map((badge, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium",
              children: [
                /* @__PURE__ */ jsx(badge.icon, { className: "w-4 h-4" }),
                badge.text
              ]
            },
            idx
          ))
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.h1,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.1 },
          className: "text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight",
          children: [
            "Real-Time",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "relative inline-block", children: [
              "Inventory Intelligence",
              /* @__PURE__ */ jsx("span", { className: "absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 },
          className: "text-lg md:text-xl text-purple-200/80 mb-8 max-w-2xl mx-auto leading-relaxed",
          children: "Know exactly what you have, where it is, and when you'll need more. Our WMS syncs with every sales channel to prevent stockouts, eliminate overselling, and give you complete visibility—24/7."
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.3 },
          className: "flex flex-wrap justify-center gap-4 mb-12",
          children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "lg",
                onClick: () => navigate("/contact"),
                className: "bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)]",
                children: "Schedule a Demo"
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
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: 0.5 },
          className: "bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_60px_rgba(139,92,246,0.15)]",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-purple-300 font-medium", children: "Live Inventory Dashboard" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "Syncing" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
              { sku: "SKU-1234", level: 85, color: "bg-cyan-500", status: "Healthy" },
              { sku: "SKU-5678", level: 45, color: "bg-yellow-500", status: "Low Stock" },
              { sku: "SKU-9012", level: 92, color: "bg-green-500", status: "Healthy" },
              { sku: "SKU-3456", level: 23, color: "bg-red-500", status: "Critical" }
            ].map((item, idx) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.7 + idx * 0.1 },
                className: "bg-slate-800/50 rounded-lg p-4",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs mb-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-mono text-slate-400", children: item.sku }),
                    /* @__PURE__ */ jsxs("span", { className: "text-white", children: [
                      item.level,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "h-2 bg-slate-700 rounded-full overflow-hidden mb-2", children: /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      initial: { width: 0 },
                      animate: { width: `${item.level}%` },
                      transition: { duration: 1, delay: 0.8 + idx * 0.1 },
                      className: `h-full ${item.color} rounded-full`
                    }
                  ) }),
                  /* @__PURE__ */ jsx("span", { className: `text-xs ${item.level < 30 ? "text-red-400" : item.level < 50 ? "text-yellow-400" : "text-green-400"}`, children: item.status })
                ]
              },
              idx
            )) }),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 1.3 },
                className: "mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-400 text-sm", children: [
                  /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "2 SKUs below reorder threshold • Auto-alert sent to purchasing" })
                ] })
              }
            )
          ]
        }
      )
    ] }) })
  ] });
};
const InventoryChallenge = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const challenges = [
    {
      icon: AlertTriangle,
      title: "Stockouts",
      stat: "30%",
      description: "of shoppers won't wait—they'll buy from a competitor when you're out of stock."
    },
    {
      icon: ShoppingCart,
      title: "Overselling",
      stat: "$500+",
      description: "average cost per incident when you sell items you don't have (refunds, reviews, lost customers)."
    },
    {
      icon: RefreshCw,
      title: "Manual Counts",
      stat: "8 hrs",
      description: "wasted weekly on spreadsheet updates that are outdated the moment you save them."
    },
    {
      icon: BarChart3,
      title: "Multi-Channel Chaos",
      stat: "40%",
      description: "of brands struggle to sync inventory across Shopify, Amazon, TikTok, and other channels."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-white dark:bg-slate-950", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "The Inventory Challenge" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto mb-4", children: "Growing brands face the same painful inventory problems. Sound familiar?" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-3xl mx-auto", children: "When you're selling on multiple channels—Shopify, Amazon, TikTok Shop, wholesale—keeping track of what's actually in stock becomes a full-time job. Spreadsheets break down, manual counts take hours, and by the time you update one platform, another sale has already changed everything. The cost of getting it wrong? Lost sales, angry customers, and refunds that eat into your margins." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto", children: challenges.map((challenge, idx) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: idx * 0.1 },
        className: "group relative bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-slate-900 dark:to-purple-950/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-500/20 hover:shadow-xl transition-all duration-300",
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(challenge.icon, { className: "w-6 h-6 text-purple-500" }) }),
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2", children: challenge.stat }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-2", children: challenge.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: challenge.description })
        ]
      },
      idx
    )) }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: 0.5 },
        className: "text-center mt-12",
        children: /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Our WMS eliminates these problems with real-time tracking, automated alerts, and seamless multi-channel sync." })
      }
    )
  ] }) });
};
const InventoryTechnology = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const features = [
    {
      icon: Scan,
      title: "Barcode Scanning at Every Touchpoint",
      description: "From receiving to shipping, every unit is scanned. No guesswork, no manual entry errors, no missing inventory."
    },
    {
      icon: Cloud,
      title: "Real-Time Cloud Sync",
      description: "Inventory levels update instantly across all your sales channels. When we ship an order, your Shopify, Amazon, and TikTok Shop stock adjust within seconds."
    },
    {
      icon: Smartphone,
      title: "Mobile Dashboard Access",
      description: "Check your inventory from anywhere. Our responsive dashboard works on any device—phone, tablet, or desktop."
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Low stock alerts, reorder notifications, and cycle count scheduling happen automatically. You focus on selling; we handle the logistics."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: "Our WMS Technology" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-purple-200/70 max-w-3xl mx-auto mb-4", children: "Enterprise-grade warehouse management that grows with your business" }),
          /* @__PURE__ */ jsx("p", { className: "text-purple-200/50 max-w-3xl mx-auto", children: "Built on years of 3PL experience, our Warehouse Management System was designed specifically for e-commerce sellers—not retrofitted from legacy systems built for traditional retail. Every feature exists because a real brand needed it. From lot tracking for consumables to bundle management for kits, we've solved the problems you're dealing with right now." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8 max-w-5xl mx-auto", children: features.map((feature, idx) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: idx * 0.1 },
        className: "group bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(feature.icon, { className: "w-7 h-7 text-cyan-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-white mb-3", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-purple-200/70 leading-relaxed", children: feature.description })
          ] })
        ] })
      },
      idx
    )) })
  ] }) });
};
const InventoryFeatures = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });
  const features = [
    {
      icon: BarChart3,
      title: "Real-Time Dashboard",
      description: "Live inventory levels across all locations, updated with every scan and shipment."
    },
    {
      icon: Bell,
      title: "Low Stock Alerts",
      description: "Custom thresholds per SKU. Get notified before you run out, not after."
    },
    {
      icon: TrendingUp,
      title: "Demand Forecasting",
      description: "AI-powered predictions help you reorder at the right time based on sales velocity."
    },
    {
      icon: RotateCcw,
      title: "Cycle Count Automation",
      description: "Scheduled counts on high-velocity SKUs to catch discrepancies early."
    },
    {
      icon: Layers,
      title: "Lot & Batch Tracking",
      description: "Track inventory by lot number for recalls, FIFO, or compliance requirements."
    },
    {
      icon: Calendar,
      title: "Expiration Management",
      description: "Automatic alerts for products approaching expiry dates. Perfect for consumables."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-white dark:bg-slate-950", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Inventory Tracking Features" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto mb-4", children: "Everything you need to maintain perfect inventory accuracy" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-3xl mx-auto", children: "Our feature set goes beyond basic inventory counts. We've built tools for every scenario: seasonal fluctuations, product launches, clearance events, and steady-state operations. Whether you have 50 SKUs or 5,000, the same powerful features scale with your business without adding complexity." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto", children: features.map((feature, idx) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: idx * 0.08 },
        className: "group relative bg-card border border-border rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(feature.icon, { className: "w-6 h-6 text-purple-500" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-2", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: feature.description })
          ] })
        ]
      },
      idx
    )) })
  ] }) });
};
const InventorySync = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const platforms = [
    { name: "Shopify", icon: SiShopify, color: "#96BF48" },
    { name: "Amazon", icon: SiAmazon, color: "#FF9900" },
    { name: "TikTok Shop", icon: SiTiktok, color: "#ff0050" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950/30", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -30 },
        animate: isInView ? { opacity: 1, x: 0 } : {},
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: "Multi-Channel Sync" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8", children: "Selling on multiple platforms? Our WMS maintains a single source of truth. When inventory changes—whether from a sale, a return, or a receiving—every connected channel updates automatically." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-8", children: [
            "Automatic stock level updates across all channels",
            "Oversell prevention with real-time inventory locks",
            "Unified dashboard for all platform inventory",
            "Historical inventory reporting and analytics"
          ].map((item, idx) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: isInView ? { opacity: 1, x: 0 } : {},
              transition: { duration: 0.5, delay: 0.2 + idx * 0.1 },
              className: "flex items-center gap-3",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-cyan-500" }) }),
                /* @__PURE__ */ jsx("span", { className: "text-foreground", children: item })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/integrations",
              className: "inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors",
              children: [
                "View all integrations",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, x: 30 },
        animate: isInView ? { opacity: 1, x: 0 } : {},
        transition: { duration: 0.6, delay: 0.2 },
        className: "relative",
        children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-500/20", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-8", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(RefreshCw, { className: "w-10 h-10 text-white" }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-2xl border-2 border-purple-500 animate-ping opacity-30" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-1", children: "Westfield WMS" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Single Source of Truth" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-6", children: platforms.map((platform, idx) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: isInView ? { opacity: 1, y: 0 } : {},
              transition: { delay: 0.4 + idx * 0.1 },
              className: "text-center",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-14 h-14 rounded-xl flex items-center justify-center mb-2",
                    style: { backgroundColor: `${platform.color}20` },
                    children: /* @__PURE__ */ jsx(platform.icon, { className: "w-7 h-7", style: { color: platform.color } })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: platform.name })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "All channels synced • Updated 3s ago" })
          ] }) })
        ] })
      }
    )
  ] }) }) }) });
};
const InventoryCycleCounts = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const steps = [
    {
      icon: ClipboardList,
      step: "01",
      title: "Schedule",
      description: "Daily counts on high-velocity SKUs, weekly on medium, monthly on slow movers."
    },
    {
      icon: Scan,
      step: "02",
      title: "Scan",
      description: "Our team scans every unit in the designated zone using mobile barcode readers."
    },
    {
      icon: CheckCircle,
      step: "03",
      title: "Verify",
      description: "System compares scanned counts to expected inventory. Matches are confirmed instantly."
    },
    {
      icon: AlertCircle,
      step: "04",
      title: "Flag Variances",
      description: "Any discrepancies are flagged for investigation. Nothing slips through the cracks."
    },
    {
      icon: FileText,
      step: "05",
      title: "Report",
      description: "You receive detailed variance reports with photos and resolution notes."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: "Cycle Count Process" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-purple-200/70 max-w-2xl mx-auto", children: "Continuous counting means continuous accuracy. Here's how we maintain 99.9% precision." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-5 gap-6", children: steps.map((step, idx) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: isInView ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.5, delay: idx * 0.1 },
          className: "relative",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center h-full hover:border-cyan-500/30 transition-colors", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(step.icon, { className: "w-6 h-6 text-cyan-400" }) }),
              /* @__PURE__ */ jsx("div", { className: "text-sm font-mono text-cyan-400 mb-2", children: step.step }),
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-white mb-2", children: step.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-purple-200/60", children: step.description })
            ] }),
            idx < steps.length - 1 && /* @__PURE__ */ jsx("div", { className: "hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-purple-500/50 to-cyan-500/50" })
          ]
        },
        idx
      )) }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: isInView ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.5, delay: 0.6 },
          className: "mt-16 grid sm:grid-cols-3 gap-8",
          children: [
            { value: "Daily", label: "High-velocity SKU counts" },
            { value: "< 0.1%", label: "Average variance rate" },
            { value: "24hr", label: "Resolution time for discrepancies" }
          ].map((stat, idx) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-cyan-400 mb-2", children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-purple-200/60", children: stat.label })
          ] }, idx))
        }
      )
    ] })
  ] }) });
};
const InventoryStorage = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const storageOptions = [
    {
      title: "Pallet Storage",
      description: "Bulk inventory stored on standard 48x40 pallets. Ideal for high-volume SKUs.",
      icon: "📦"
    },
    {
      title: "Shelf Storage",
      description: "Individual units on racked shelving. Perfect for pick-and-pack operations.",
      icon: "🗄️"
    },
    {
      title: "Bin Storage",
      description: "Small items organized in labeled bins. Efficient for accessories and components.",
      icon: "📋"
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-white dark:bg-slate-950", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -30 },
        animate: isInView ? { opacity: 1, x: 0 } : {},
        transition: { duration: 0.6 },
        className: "order-2 lg:order-1",
        children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: storageOptions.map((option, idx) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: isInView ? { opacity: 1, y: 0 } : {},
              transition: { delay: 0.2 + idx * 0.1 },
              className: `bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-slate-900 dark:to-purple-950/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-500/20 ${idx === 2 ? "col-span-2" : ""}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-3xl mb-3", children: option.icon }),
                /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: option.title }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: option.description })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: isInView ? { opacity: 1, y: 0 } : {},
              transition: { delay: 0.5 },
              className: "mt-4 flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl",
              children: [
                /* @__PURE__ */ jsx(Thermometer, { className: "w-6 h-6 text-cyan-500" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium text-cyan-700 dark:text-cyan-400", children: "Climate-Controlled Available" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "For temperature-sensitive products" })
                ] })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: 30 },
        animate: isInView ? { opacity: 1, x: 0 } : {},
        transition: { duration: 0.6 },
        className: "order-1 lg:order-2",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx(Warehouse, { className: "w-8 h-8 text-purple-500" }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold", children: "Storage & Warehousing" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-4", children: "Our Los Angeles facility offers flexible storage solutions for inventory of all sizes. From single pallets to thousands of SKUs, we have the space and systems to keep your products organized, accessible, and ready to ship." }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: "With over 25,000 square feet of warehouse space and capacity for 500+ pallets, we can accommodate everything from startup inventory to enterprise-scale operations. Our strategic location—just miles from the Port of Los Angeles—means your imported goods move quickly from container to shelf, ready for fulfillment within days, not weeks." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-8", children: [
            "Secure, monitored facility 24/7",
            "Flexible month-to-month terms",
            "No minimum storage requirements",
            "Strategic LA location near major ports"
          ].map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-purple-500" }) }),
            /* @__PURE__ */ jsx("span", { children: item })
          ] }, idx)) }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/storage-warehousing",
              className: "inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors",
              children: [
                "Learn more about storage options",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              ]
            }
          )
        ]
      }
    )
  ] }) }) }) });
};
const InventoryFAQ = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });
  const faqs = [
    {
      question: "How often do you perform cycle counts?",
      answer: "We perform daily cycle counts on high-velocity SKUs (your top 20% by movement), weekly counts on medium-velocity items, and monthly counts on slow movers. This tiered approach ensures your bestsellers are always accurate while efficiently covering your entire catalog."
    },
    {
      question: "Can I see my inventory in real-time?",
      answer: "Yes! Your client dashboard provides 24/7 real-time visibility into every SKU, location, and transaction. Inventory levels update within seconds of any receiving, shipment, or adjustment. You can access the dashboard from any device—desktop, tablet, or phone."
    },
    {
      question: "Do you support multiple warehouse locations?",
      answer: "Currently, we operate from our Los Angeles facility. However, our WMS is designed to track inventory across multiple locations if you have stock elsewhere. We can receive transfers from other warehouses and maintain unified inventory counts."
    },
    {
      question: "What's your minimum SKU count to work with you?",
      answer: "There's no minimum SKU requirement. Whether you have 10 SKUs or 10,000, our system handles it the same way. We work with brands at all stages—from startups with a handful of products to established companies with complex catalogs."
    },
    {
      question: "How do you handle inventory shrinkage or discrepancies?",
      answer: "When cycle counts reveal discrepancies, we investigate immediately. Every variance is documented with photos and notes. We adjust inventory to match actual counts and provide you with detailed variance reports. Our average shrinkage rate is less than 0.1%—far below industry standards."
    },
    {
      question: "What reports can I access through the dashboard?",
      answer: "You'll have access to inventory levels by SKU and location, transaction history (receiving, shipments, adjustments), low stock alerts, aging inventory reports, cycle count variance reports, and demand velocity analytics. Reports can be exported as CSV or PDF."
    },
    {
      question: "Which platforms does your WMS integrate with?",
      answer: "We have native integrations with Shopify, Amazon Seller Central, TikTok Shop, Walmart Marketplace, eBay, Etsy, WooCommerce, BigCommerce, and Magento. We also offer a REST API for custom integrations. Inventory syncs automatically—no manual updates required."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950/30", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Frequently Asked Questions" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Common questions about our inventory management services" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6, delay: 0.2 },
        className: "max-w-3xl mx-auto",
        children: /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "space-y-4", children: faqs.map((faq, idx) => /* @__PURE__ */ jsxs(
          AccordionItem,
          {
            value: `item-${idx}`,
            className: "bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-500/20 rounded-xl px-6 data-[state=open]:border-cyan-500/50",
            children: [
              /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left hover:no-underline py-5", children: /* @__PURE__ */ jsx("span", { className: "font-semibold pr-4", children: faq.question }) }),
              /* @__PURE__ */ jsx(AccordionContent, { className: "text-muted-foreground pb-5", children: faq.answer })
            ]
          },
          idx
        )) })
      }
    )
  ] }) });
};
const InventoryCTA = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const navigate = useNavigate();
  const benefits = [
    "Free 30-minute demo",
    "See your data in our system",
    "Custom integration plan"
  ];
  return /* @__PURE__ */ jsxs("section", { ref, className: "py-24 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-30",
        style: {
          backgroundImage: `
            radial-gradient(at 30% 40%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
            radial-gradient(at 70% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)
          `
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "container relative z-10", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "max-w-4xl mx-auto text-center",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold text-white mb-6", children: "Take Control of Your Inventory" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-purple-200/80 mb-6 max-w-2xl mx-auto", children: "Real-time visibility, automated alerts, and seamless multi-channel sync. See how our WMS can transform your operations." }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 mb-8 max-w-2xl mx-auto", children: [
            /* @__PURE__ */ jsx("p", { className: "text-purple-200/80 mb-4", children: "During your demo, we'll walk through your catalog, show how inventory would flow through our system, and answer every question. Most demos take just 30 minutes—we respect your time and focus on your specific needs." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-4 text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full", children: "30-minute session" }),
              /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full", children: "Screen share walkthrough" }),
              /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full", children: "Q&A included" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-6 mb-10", children: benefits.map((benefit, idx) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: isInView ? { opacity: 1, y: 0 } : {},
              transition: { duration: 0.5, delay: 0.2 + idx * 0.1 },
              className: "flex items-center gap-2 text-purple-200",
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-cyan-400" }),
                /* @__PURE__ */ jsx("span", { children: benefit })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: isInView ? { opacity: 1, y: 0 } : {},
              transition: { duration: 0.5, delay: 0.5 },
              className: "flex flex-wrap justify-center gap-4",
              children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    size: "lg",
                    onClick: () => navigate("/contact"),
                    className: "bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg shadow-[0_0_40px_rgba(6,182,212,0.4)]",
                    children: [
                      "Schedule a Demo",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
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
              ]
            }
          )
        ]
      }
    ) })
  ] });
};
const InventoryManagement = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const meta = generateMetaTags(
    "Inventory Management | Los Angeles 3PL Prep Center Services",
    "Real-time inventory management at our Los Angeles 3PL. Prep center with SKU tracking, low-stock alerts, cycle counts, and multi-channel sync for e-commerce brands.",
    "/inventory-management"
  );
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Inventory Management Services",
    "description": "Real-time inventory tracking and management with advanced analytics and multi-channel sync",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    },
    "areaServed": "Los Angeles, CA"
  };
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How often do you perform cycle counts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We perform daily cycle counts on high-velocity SKUs, weekly counts on medium-velocity items, and monthly counts on slow movers."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see my inventory in real-time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Your client dashboard provides 24/7 real-time visibility into every SKU, location, and transaction."
        }
      },
      {
        "@type": "Question",
        "name": "Do you support multiple warehouse locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, we operate from our Los Angeles facility. Our WMS can track inventory across multiple locations if you have stock elsewhere."
        }
      },
      {
        "@type": "Question",
        "name": "What's your minimum SKU count to work with you?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "There's no minimum SKU requirement. Whether you have 10 SKUs or 10,000, our system handles it the same way."
        }
      },
      {
        "@type": "Question",
        "name": "How do you handle inventory shrinkage or discrepancies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When cycle counts reveal discrepancies, we investigate immediately. Every variance is documented with photos and notes. Our average shrinkage rate is less than 0.1%."
        }
      },
      {
        "@type": "Question",
        "name": "What reports can I access through the dashboard?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You'll have access to inventory levels, transaction history, low stock alerts, aging inventory reports, cycle count variance reports, and demand velocity analytics."
        }
      },
      {
        "@type": "Question",
        "name": "Which platforms does your WMS integrate with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We integrate with Shopify, Amazon Seller Central, TikTok Shop, Walmart Marketplace, eBay, Etsy, WooCommerce, BigCommerce, Magento, and offer a REST API for custom integrations."
        }
      }
    ]
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: meta.title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: meta.description }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "3pl los angeles, inventory management, prep center, sku tracking, cycle counts, ecommerce inventory, wms, warehouse management" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: meta.canonical }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: meta.ogTitle }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: meta.ogDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: meta.ogUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: meta.ogImage })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "service", data: serviceData }),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqData }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Inventory Management", path: "/inventory-management" }] }),
      /* @__PURE__ */ jsx(InventoryHero, {}),
      /* @__PURE__ */ jsx(InventoryChallenge, {}),
      /* @__PURE__ */ jsx(InventoryTechnology, {}),
      /* @__PURE__ */ jsx(InventoryFeatures, {}),
      /* @__PURE__ */ jsx(InventorySync, {}),
      /* @__PURE__ */ jsx(InventoryCycleCounts, {}),
      /* @__PURE__ */ jsx(InventoryStorage, {}),
      /* @__PURE__ */ jsx(InventoryFAQ, {}),
      /* @__PURE__ */ jsx(InventoryCTA, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  InventoryManagement as default
};
