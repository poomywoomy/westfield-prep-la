import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { B as Button, A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent, S as StructuredData, H as Header, F as Footer, n as generateMetaTags } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Clock, Zap, ArrowRight, AlertTriangle, TrendingDown, Users, ShoppingCart, ClipboardCheck, Search, Package, Truck, Bell, Store, Target, Gauge, DollarSign, RotateCcw, Camera, CheckCircle } from "lucide-react";
import { u as useIntersectionObserver } from "./use-intersection-observer-0IkYX39w.js";
import { SiShopify, SiAmazon, SiTiktok } from "react-icons/si";
import { M as MetricCounter } from "./metric-counter-TC-ts67f.js";
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
const FulfillmentHero = () => {
  const navigate = useNavigate();
  const stats = [
    { value: "99.8%", label: "Accuracy Rate" },
    { value: "2PM", label: "Same-Day Cutoff" },
    { value: "4.5hr", label: "Avg Processing" },
    { value: "10K+", label: "Monthly Orders" }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03]", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-full w-full",
        style: {
          backgroundImage: `
              linear-gradient(to right, #3B82F6 1px, transparent 1px),
              linear-gradient(to bottom, #3B82F6 1px, transparent 1px)
            `,
          backgroundSize: "60px 60px"
        }
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px] animate-pulse", style: { animationDelay: "1s" } }),
    /* @__PURE__ */ jsx("div", { className: "container relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: "flex flex-wrap gap-4 mb-8",
          children: [
            { icon: Shield, text: "99.8% Accuracy" },
            { icon: Clock, text: "2PM Same-Day Cutoff" },
            { icon: Zap, text: "4.5hr Avg Processing" }
          ].map((badge, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium",
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
            "Your E-Commerce",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "relative", children: [
              "Command Center",
              /* @__PURE__ */ jsx("span", { className: "absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400" })
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
          className: "text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed",
          children: "From order received to doorstep delivered, we handle your entire fulfillment operation. Real-time tracking, multi-channel integration, and obsessive attention to accuracy—all from our Los Angeles facility."
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.3 },
          className: "flex flex-wrap gap-4 mb-12",
          children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "lg",
                onClick: () => navigate("/contact"),
                className: "bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg shadow-[0_0_30px_rgba(59,130,246,0.4)]",
                children: "Get Your Quote"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "lg",
                variant: "outline",
                onClick: () => navigate("/pricing"),
                className: "border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg",
                children: "See Pricing"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.4 },
          className: "grid grid-cols-2 md:grid-cols-4 gap-4",
          children: stats.map((stat, idx) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.4, delay: 0.5 + idx * 0.1 },
              className: "bg-slate-800/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 text-center",
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-bold text-blue-400", children: stat.value }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-400", children: stat.label })
              ]
            },
            idx
          ))
        }
      )
    ] }) })
  ] });
};
const FulfillmentWhyOutsource = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const painPoints = [
    {
      icon: Clock,
      title: "Time Drain",
      problem: "Hours spent packing instead of growing",
      solution: "We handle every order so you can focus on sales and marketing"
    },
    {
      icon: AlertTriangle,
      title: "Error Rates",
      problem: "Wrong items, missed orders, unhappy customers",
      solution: "Our 99.8% accuracy rate means fewer returns and refunds"
    },
    {
      icon: TrendingDown,
      title: "Scaling Challenges",
      problem: "Holiday rush overwhelms your garage operation",
      solution: "We flex capacity up or down with your volume—no hiring needed"
    },
    {
      icon: Users,
      title: "Staff Management",
      problem: "Training, payroll, and turnover headaches",
      solution: "Our trained team is your team, without the HR burden"
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-slate-50 dark:bg-slate-900/50", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Why Outsource Your Fulfillment?" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: "Running fulfillment in-house sounds manageable—until your first viral moment. Suddenly you're drowning in orders, making errors, and spending all your time packing boxes instead of growing your brand. Here's what we hear from brands who finally made the switch to Westfield. The transformation isn't just operational—it's transformational for your entire business." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8 max-w-5xl mx-auto", children: painPoints.map((point, idx) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: idx * 0.1 },
        className: "group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-5", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(point.icon, { className: "w-7 h-7 text-blue-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-2", children: point.title }),
              /* @__PURE__ */ jsx("p", { className: "text-red-500/80 dark:text-red-400/80 text-sm mb-3 line-through decoration-red-400/50", children: point.problem }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: point.solution })
            ] })
          ] })
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
        children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/why-choose-us",
            className: "inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors",
            children: [
              "Learn more about why brands choose Westfield",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ]
          }
        )
      }
    )
  ] }) });
};
const FulfillmentProcess = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });
  const steps = [
    {
      icon: ShoppingCart,
      step: "01",
      title: "Order Received",
      description: "Orders auto-sync from Shopify, Amazon, TikTok Shop, or your custom integration. Our WMS captures every detail instantly.",
      timing: "Real-time"
    },
    {
      icon: ClipboardCheck,
      step: "02",
      title: "Validation & Queue",
      description: "We verify inventory availability, payment status, and shipping address. Problem orders are flagged immediately.",
      timing: "< 5 minutes"
    },
    {
      icon: Search,
      step: "03",
      title: "Pick",
      description: "Our team uses barcode scanning to locate your products with pinpoint accuracy. Every scan is logged.",
      timing: "15-30 minutes"
    },
    {
      icon: Package,
      step: "04",
      title: "Pack & QC",
      description: "Items are carefully packed with your branded materials if requested. Final quality check before sealing.",
      timing: "10-20 minutes"
    },
    {
      icon: Truck,
      step: "05",
      title: "Ship",
      description: "We select the optimal carrier based on your preferences and destination. Labels are generated and packages staged for pickup.",
      timing: "Same day by 2PM"
    },
    {
      icon: Bell,
      step: "06",
      title: "Notify",
      description: "Tracking info syncs back to your platform and your customer receives a shipment notification automatically.",
      timing: "Instant"
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-slate-900", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: "The Westfield Fulfillment Process" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-400 max-w-3xl mx-auto mb-4", children: "Six precision steps from click to doorstep. Every order, every time. Our process has been refined over thousands of shipments to eliminate errors and maximize speed." }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 max-w-3xl mx-auto", children: "Each step includes built-in quality checkpoints. Barcodes are scanned at every handoff, photos are captured for high-value items, and exceptions are flagged instantly. The result? A 99.8% accuracy rate that protects your brand reputation and keeps customers coming back." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/30 to-blue-500/50" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-8 lg:space-y-0", children: steps.map((step, idx) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: idx % 2 === 0 ? -50 : 50 },
          animate: isInView ? { opacity: 1, x: 0 } : {},
          transition: { duration: 0.5, delay: idx * 0.1 },
          className: `relative lg:flex ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center`,
          children: [
            /* @__PURE__ */ jsx("div", { className: `lg:w-[calc(50%-60px)] ${idx % 2 === 0 ? "lg:pr-8 lg:text-right" : "lg:pl-8 lg:text-left"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-colors", children: [
              /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 mb-4 ${idx % 2 === 0 ? "lg:justify-end" : "lg:justify-start"}`, children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(step.icon, { className: "w-6 h-6 text-blue-400" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-blue-400 font-mono text-sm", children: step.step }),
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-white", children: step.title })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-slate-400 mb-3", children: step.description }),
              /* @__PURE__ */ jsx("span", { className: "inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full font-medium", children: step.timing })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-800 border-4 border-blue-500 items-center justify-center z-10", children: /* @__PURE__ */ jsx("span", { className: "text-blue-400 font-bold", children: idx + 1 }) }),
            /* @__PURE__ */ jsx("div", { className: "hidden lg:block lg:w-[calc(50%-60px)]" })
          ]
        },
        idx
      )) })
    ] })
  ] }) });
};
const FulfillmentChannels = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const channels = [
    {
      name: "Shopify",
      icon: SiShopify,
      color: "bg-[#96BF48]",
      description: "Native integration syncs orders, inventory, and tracking in real-time. Works with Shopify Plus too.",
      link: "/sales-channels/shopify"
    },
    {
      name: "Amazon",
      icon: SiAmazon,
      color: "bg-[#FF9900]",
      description: "FBA prep, FBM fulfillment, or hybrid. We handle Amazon's strict requirements so you don't have to.",
      link: "/sales-channels/amazon"
    },
    {
      name: "TikTok Shop",
      icon: SiTiktok,
      color: "bg-gradient-to-br from-[#00f2ea] to-[#ff0050]",
      description: "Meet TikTok's 48-hour shipping SLA effortlessly. We're built for viral moments.",
      link: "/sales-channels/tiktok-shop"
    },
    {
      name: "Walmart",
      icon: Store,
      color: "bg-[#0071DC]",
      description: "Walmart Marketplace fulfillment with their two-day delivery standards built-in.",
      link: "/integrations"
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Multi-Channel Support" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "One warehouse, every platform. We integrate where you sell so orders flow seamlessly from any channel." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto", children: channels.map((channel, idx) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: idx * 0.1 },
        children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: channel.link,
            className: "group block h-full bg-card border border-border rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300",
            children: [
              /* @__PURE__ */ jsx("div", { className: `w-14 h-14 ${channel.color} rounded-xl flex items-center justify-center mb-5`, children: /* @__PURE__ */ jsx(channel.icon, { className: "w-7 h-7 text-white" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-3 group-hover:text-blue-500 transition-colors", children: channel.name }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: channel.description }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity", children: [
                "Learn more ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              ] })
            ]
          }
        )
      },
      idx
    )) }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: 0.6 },
        className: "text-center mt-12",
        children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/integrations",
            className: "inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors",
            children: [
              "See all 50+ integrations",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ]
          }
        )
      }
    )
  ] }) });
};
const FulfillmentMetrics = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const metrics = [
    {
      icon: Target,
      value: 99.8,
      suffix: "%",
      label: "Order Accuracy",
      description: "Verified through double-scan QC at every station"
    },
    {
      icon: Clock,
      value: 4.5,
      suffix: "hrs",
      label: "Avg Processing Time",
      description: "From order received to carrier pickup"
    },
    {
      icon: Package,
      value: 1e4,
      suffix: "+",
      label: "Monthly Capacity",
      description: "Orders per month with room to scale"
    },
    {
      icon: Gauge,
      value: 2,
      suffix: "PM",
      label: "Same-Day Cutoff",
      description: "PST, Monday through Saturday"
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-slate-50 dark:bg-slate-900/50", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Speed & Accuracy by the Numbers" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "We obsess over metrics so you can obsess over growth. Here's how we perform." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto", children: metrics.map((metric, idx) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: idx * 0.1 },
        className: "relative group",
        children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 text-center h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(metric.icon, { className: "w-7 h-7 text-blue-500" }) }),
            /* @__PURE__ */ jsx("div", { className: "text-4xl md:text-5xl font-bold text-blue-500 mb-2", children: /* @__PURE__ */ jsx(MetricCounter, { value: metric.value, suffix: metric.suffix }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-2", children: metric.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: metric.description })
          ] })
        ] })
      },
      idx
    )) })
  ] }) });
};
const FulfillmentCarriers = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const carriers = [
    { name: "USPS", services: "Priority, First Class, Media Mail" },
    { name: "UPS", services: "Ground, 2-Day, Next Day Air" },
    { name: "FedEx", services: "Ground, Express, SmartPost" },
    { name: "DHL", services: "Express, eCommerce" },
    { name: "Regional", services: "OnTrac, LaserShip, Spee-Dee" }
  ];
  const benefits = [
    {
      icon: DollarSign,
      title: "Discounted Rates",
      description: "We pass our volume discounts directly to you—often 30-50% below retail rates."
    },
    {
      icon: Zap,
      title: "Smart Selection",
      description: "Our system auto-selects the best carrier based on destination, weight, and speed requirements."
    },
    {
      icon: Truck,
      title: "Daily Pickups",
      description: "All major carriers pick up from our facility daily, ensuring no delays in transit."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Carrier Network" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto mb-4", children: "Access to every major carrier at rates you couldn't get on your own." }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-3xl mx-auto", children: "Why not just negotiate your own carrier rates? Because volume matters. We ship thousands of packages monthly, unlocking discounts you couldn't get shipping dozens. Those savings—often 30-50% below retail rates—go directly to your bottom line. Plus, our relationships mean priority support when issues arise. Your packages don't get lost in the system; they get personal attention from carrier reps who know us by name." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: isInView ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.5, delay: 0.1 },
          className: "flex flex-wrap justify-center gap-4 mb-16",
          children: carriers.map((carrier, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-xl px-6 py-4 hover:border-blue-500/50 transition-colors",
              children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-lg", children: carrier.name }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: carrier.services })
              ]
            },
            idx
          ))
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: benefits.map((benefit, idx) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: isInView ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.5, delay: 0.2 + idx * 0.1 },
          className: "text-center",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(benefit.icon, { className: "w-8 h-8 text-blue-500" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-2", children: benefit.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: benefit.description })
          ]
        },
        idx
      )) })
    ] })
  ] }) });
};
const FulfillmentReturns = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const steps = [
    {
      icon: RotateCcw,
      title: "RMA Generation",
      description: "We create return labels and track inbound packages automatically."
    },
    {
      icon: Camera,
      title: "Inspection & Photos",
      description: "Every return is photographed and inspected within 24 hours of receipt."
    },
    {
      icon: CheckCircle,
      title: "Grade & Decide",
      description: "Items are graded as resellable, damaged, or defective. You decide what happens next."
    },
    {
      icon: Package,
      title: "Restock or Dispose",
      description: "Resellable items go back to inventory; others are disposed per your instructions."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-slate-900", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -30 },
        animate: isInView ? { opacity: 1, x: 0 } : {},
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-6", children: "Returns Processing Included" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-400 mb-8", children: "Returns are inevitable in e-commerce. We handle them efficiently so they don't become a bottleneck. Fast processing, clear documentation, and inventory reconciliation—all part of the service." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: steps.map((step, idx) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: isInView ? { opacity: 1, x: 0 } : {},
              transition: { duration: 0.5, delay: 0.2 + idx * 0.1 },
              className: "flex items-start gap-4",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(step.icon, { className: "w-5 h-5 text-blue-400" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-white mb-1", children: step.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm", children: step.description })
                ] })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: isInView ? { opacity: 1, y: 0 } : {},
              transition: { duration: 0.5, delay: 0.6 },
              className: "mt-8",
              children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/returns-processing",
                  className: "inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors",
                  children: [
                    "Learn more about returns processing",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
                  ]
                }
              )
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
        children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsx("div", { className: "text-5xl font-bold text-blue-400 mb-2", children: "24hr" }),
            /* @__PURE__ */ jsx("div", { className: "text-slate-400", children: "Average return processing time" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 rounded-xl p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: "85%" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-400", children: "Resellable rate" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 rounded-xl p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: "100%" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-400", children: "Photo documented" })
            ] })
          ] })
        ] })
      }
    )
  ] }) }) }) });
};
const FulfillmentFAQ = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });
  const faqs = [
    {
      question: "What is your order cutoff time for same-day shipping?",
      answer: "Orders received by 2 PM PST ship the same day, Monday through Saturday. Orders after 2 PM ship the next business day. During peak seasons like Q4, we sometimes extend hours to accommodate higher volumes."
    },
    {
      question: "What e-commerce platforms do you integrate with?",
      answer: "We have native integrations with Shopify, Amazon Seller Central, TikTok Shop, Walmart Marketplace, eBay, Etsy, WooCommerce, BigCommerce, and Magento. We also offer a REST API for custom platforms and can work with most order management systems."
    },
    {
      question: "Do you provide real-time tracking to customers?",
      answer: "Yes! Tracking information syncs automatically to your sales platform and triggers customer notification emails. Customers can track their package from the moment it leaves our facility to their doorstep."
    },
    {
      question: "Can you handle branded or custom packaging?",
      answer: "Absolutely. We can use your branded boxes, tissue paper, stickers, and inserts. Just ship us your materials and we'll store them alongside your inventory. Custom packaging adds a small per-order fee depending on complexity."
    },
    {
      question: "What happens if there's a shipping error?",
      answer: "We take full responsibility for errors caused by our team. If we ship the wrong item or quantity, we'll reship the correct order at no charge and cover return shipping for the incorrect item. Our 99.8% accuracy rate means errors are rare, but when they happen, we make it right."
    },
    {
      question: "Do you have minimum order requirements?",
      answer: "We work best with brands shipping at least 100 orders per month, but we're flexible for growing businesses. There's no maximum—we've handled flash sales with 5,000+ orders in a single day. Contact us to discuss your volume."
    },
    {
      question: "Can you handle rush or expedited orders?",
      answer: "Yes. We offer priority processing for time-sensitive orders. Rush orders received by 12 PM PST can ship same-day via expedited carriers. Additional fees apply for rush handling, and we'll work with you on carrier selection for the fastest delivery."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-slate-50 dark:bg-slate-900/50", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Frequently Asked Questions" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Common questions about our order fulfillment services" })
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
            className: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-6 data-[state=open]:border-blue-500/50",
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
const FulfillmentCTA = () => {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });
  const navigate = useNavigate();
  const benefits = [
    "Free onboarding & integration setup",
    "No long-term contracts required",
    "Dedicated account manager"
  ];
  return /* @__PURE__ */ jsxs("section", { ref, className: "py-24 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px]" }),
    /* @__PURE__ */ jsx("div", { className: "container relative z-10", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "max-w-4xl mx-auto text-center",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold text-white mb-6", children: "Ready to Scale Your Fulfillment?" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-slate-300 mb-6 max-w-2xl mx-auto", children: "Join 500+ brands that trust Westfield Prep Center for their e-commerce fulfillment. Get a custom quote in 24 hours." }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 mb-8 max-w-2xl mx-auto", children: [
            /* @__PURE__ */ jsx("p", { className: "text-slate-300 italic mb-4", children: '"Switching to Westfield cut our shipping errors by 95% and freed up 20 hours per week. Our customers are happier, and we can finally focus on growing instead of packing boxes."' }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold", children: "JM" }),
              /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "text-white font-medium", children: "Jessica Martinez" }),
                /* @__PURE__ */ jsx("div", { className: "text-slate-400 text-sm", children: "Founder, Bloom Cosmetics" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-6 mb-10", children: benefits.map((benefit, idx) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: isInView ? { opacity: 1, y: 0 } : {},
              transition: { duration: 0.5, delay: 0.2 + idx * 0.1 },
              className: "flex items-center gap-2 text-slate-300",
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-blue-400" }),
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
                    className: "bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg shadow-[0_0_40px_rgba(59,130,246,0.4)]",
                    children: [
                      "Get Your Custom Quote",
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
const OrderFulfillment = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const meta = generateMetaTags(
    "Order Fulfillment Services for Businesses with a Custom",
    "Westfield Prep Center provides reliable order fulfillment services for businesses of all sizes. From storage to packing & shipping, we handle orders with care.",
    "/order-fulfillment"
  );
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Order Fulfillment Services",
    "description": "Professional order fulfillment with same-day processing and real-time tracking",
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
        "name": "What is your order cutoff time for same-day shipping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Orders received by 2 PM PST ship the same day, Monday through Saturday. Orders after 2 PM ship the next business day."
        }
      },
      {
        "@type": "Question",
        "name": "What e-commerce platforms do you integrate with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We integrate with Shopify, Amazon Seller Central, TikTok Shop, Walmart Marketplace, eBay, Etsy, WooCommerce, BigCommerce, and Magento. We also offer a REST API for custom platforms."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide real-time tracking to customers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Tracking information syncs automatically to your sales platform and triggers customer notification emails."
        }
      },
      {
        "@type": "Question",
        "name": "Can you handle branded or custom packaging?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We can use your branded boxes, tissue paper, stickers, and inserts. Just ship us your materials and we'll store them alongside your inventory."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if there's a shipping error?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We take full responsibility for errors caused by our team. If we ship the wrong item, we'll reship the correct order at no charge and cover return shipping."
        }
      },
      {
        "@type": "Question",
        "name": "Do you have minimum order requirements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We work best with brands shipping at least 100 orders per month, but we're flexible for growing businesses. There's no maximum."
        }
      },
      {
        "@type": "Question",
        "name": "Can you handle rush or expedited orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Rush orders received by 12 PM PST can ship same-day via expedited carriers. Additional fees apply for rush handling."
        }
      }
    ]
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: meta.title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: meta.description }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "3pl los angeles, order fulfillment, prep center, ecommerce fulfillment, shopify fulfillment, same day shipping, pick and pack" }),
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
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Order Fulfillment", path: "/order-fulfillment" }] }),
      /* @__PURE__ */ jsx(FulfillmentHero, {}),
      /* @__PURE__ */ jsx(FulfillmentWhyOutsource, {}),
      /* @__PURE__ */ jsx(FulfillmentProcess, {}),
      /* @__PURE__ */ jsx(FulfillmentChannels, {}),
      /* @__PURE__ */ jsx(FulfillmentMetrics, {}),
      /* @__PURE__ */ jsx(FulfillmentCarriers, {}),
      /* @__PURE__ */ jsx(FulfillmentReturns, {}),
      /* @__PURE__ */ jsx(FulfillmentFAQ, {}),
      /* @__PURE__ */ jsx(FulfillmentCTA, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  OrderFulfillment as default
};
