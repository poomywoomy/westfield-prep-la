import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { T as TranslatedText, B as Button, w as westfieldLogo, A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent, S as StructuredData, H as Header, F as Footer } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { T as TrustStrip, S as StickyCTA } from "./StickyCTA-DPOcmQvz.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { Clock, Shield, TrendingUp, Zap, Heart, RefreshCw, Package, Truck, ArrowRight, Check, Bell, Star, Video, Gift, AlertTriangle } from "lucide-react";
import { u as useIntersectionObserver } from "./use-intersection-observer-0IkYX39w.js";
import { M as MetricCounter } from "./metric-counter-TC-ts67f.js";
import { SiTiktok } from "react-icons/si";
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
const TikTokChannelHero = () => {
  const floatingShapes = [
    { size: 16, left: "10%", top: "20%", color: "bg-pink-400/30", delay: 0 },
    { size: 12, left: "85%", top: "15%", color: "bg-purple-400/30", delay: 0.5 },
    { size: 20, left: "75%", top: "60%", color: "bg-fuchsia-400/25", delay: 1 },
    { size: 14, left: "5%", top: "70%", color: "bg-pink-500/20", delay: 1.5 },
    { size: 10, left: "90%", top: "80%", color: "bg-purple-500/25", delay: 2 },
    { size: 18, left: "20%", top: "85%", color: "bg-fuchsia-500/20", delay: 0.8 }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "relative w-full overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: { background: `radial-gradient(ellipse at 20% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(217, 70, 239, 0.12) 0%, transparent 50%), linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #fdf4ff 100%)` } }),
    floatingShapes.map((shape, index) => /* @__PURE__ */ jsx(motion.div, { className: `absolute ${shape.color} rounded-full blur-sm`, style: { width: shape.size, height: shape.size, left: shape.left, top: shape.top }, animate: { y: [0, -15, 0], x: [0, 5, 0], scale: [1, 1.1, 1] }, transition: { duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut", delay: shape.delay } }, index)),
    /* @__PURE__ */ jsx(motion.div, { className: "absolute w-8 h-8 bg-pink-300/20 rounded-lg rotate-12", style: { left: "15%", top: "30%" }, animate: { rotate: [12, -12, 12] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }),
    /* @__PURE__ */ jsx(motion.div, { className: "absolute w-6 h-6 bg-purple-300/25 rounded-lg -rotate-12", style: { right: "12%", top: "40%" }, animate: { rotate: [-12, 12, -12] }, transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 container mx-auto px-4 pt-12 pb-16 lg:pt-16 lg:pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "mb-6", children: /* @__PURE__ */ jsxs(Badge, { className: "bg-pink-500 text-white border-pink-600 px-5 py-2 text-sm font-semibold shadow-lg shadow-pink-500/25", children: [
        /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2 mr-2", children: [
          /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" }),
          /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-white" })
        ] }),
        /* @__PURE__ */ jsx(TranslatedText, { children: "Built for Viral Demand" })
      ] }) }),
      /* @__PURE__ */ jsxs(motion.h1, { className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, children: [
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "TikTok Shop" }) }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-slate-900", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Fulfillment That Scales" }) })
      ] }),
      /* @__PURE__ */ jsxs(motion.p, { className: "text-lg md:text-xl text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "When your video goes viral, your fulfillment needs to keep up. We handle surge demand, rapid turnaround, and" }),
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/kitting-bundling", className: "text-pink-600 hover:text-pink-700 underline underline-offset-2 font-medium transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "creator-friendly packaging" }) }),
        " ",
        /* @__PURE__ */ jsx(TranslatedText, { children: "so you never miss a sale." })
      ] }),
      /* @__PURE__ */ jsx(motion.div, { className: "flex flex-wrap justify-center gap-3 mb-8", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.3 }, children: [{ icon: Clock, text: "6hr Processing" }, { icon: Shield, text: "<1% Error Rate" }, { icon: TrendingUp, text: "Surge-Ready" }, { icon: Zap, text: "LA Fulfillment" }].map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-pink-100/80 backdrop-blur-sm rounded-full border border-pink-200/50", children: [
        /* @__PURE__ */ jsx(item.icon, { className: "w-4 h-4 text-pink-600" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-pink-800", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.text }) })
      ] }, index)) }),
      /* @__PURE__ */ jsxs(motion.div, { className: "flex flex-col sm:flex-row gap-3 justify-center mb-10", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.4 }, children: [
        /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "px-8 py-6 text-base font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-xl shadow-pink-500/25 hover:scale-105 transition-all duration-300", children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get Started" }) }) }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "lg", className: "px-8 py-6 text-base font-bold border-2 border-pink-400 text-pink-700 hover:bg-pink-50", children: /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(TranslatedText, { children: "See Pricing" }) }) })
      ] }),
      /* @__PURE__ */ jsx(motion.div, { className: "flex items-center justify-center gap-8 lg:gap-12", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.5 }, children: [{ value: "100K+", label: "Viral Orders" }, { value: "6hr", label: "Processing" }, { value: "95%+", label: "Satisfaction" }].map((stat, index) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent", children: stat.value }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: /* @__PURE__ */ jsx(TranslatedText, { children: stat.label }) })
      ] }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" })
  ] });
};
const values = [
  {
    icon: Zap,
    title: "Viral-Speed Fulfillment",
    description: "When your video hits the For You page and orders explode, we're ready. Our streamlined pick-pack process handles sudden volume spikes without delays or errors."
  },
  {
    icon: TrendingUp,
    title: "Surge Capacity",
    description: "We maintain buffer inventory and flexible staffing specifically for viral moments. Scale from 100 to 10,000 orders overnight without scrambling for resources."
  },
  {
    icon: Heart,
    title: "Creator-Friendly",
    description: "Unboxing matters on TikTok. We offer branded packaging, thank-you inserts, and presentation that encourages customers to share their experience on social."
  },
  {
    icon: RefreshCw,
    title: "Live Sync",
    description: "Real-time inventory and order status syncing keeps your TikTok Shop accurate. Never oversell, never disappoint customers with out-of-stock surprises."
  }
];
const TikTokChannelValueGrid = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-background to-pink-50/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        ref,
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Why TikTok Sellers" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Choose Us" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "TikTok commerce is different. Demand is unpredictable, speed is everything, and the unboxing experience can go viral. We're built for this reality." }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: values.map((value, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: index * 0.1 },
        className: "group relative p-6 bg-card rounded-xl border border-border hover:border-pink-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 group-hover:from-pink-200 group-hover:to-purple-200 transition-colors duration-300", children: /* @__PURE__ */ jsx(value.icon, { className: "w-6 h-6 text-pink-600 group-hover:scale-110 transition-transform duration-300" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2 text-foreground group-hover:text-pink-600 transition-colors duration-300", children: /* @__PURE__ */ jsx(TranslatedText, { children: value.title }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: value.description }) })
        ]
      },
      index
    )) })
  ] }) });
};
const capabilities = [
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "TikTok shoppers expect fast delivery. We prioritize your orders with same-day pick and pack, getting products out the door within hours of order placement. Our streamlined processes eliminate bottlenecks, ensuring your customers receive their purchases quickly and come back for more.",
    features: ["Same-day processing", "Priority pick queues", "6-hour average handling time"],
    link: "/order-fulfillment"
  },
  {
    icon: Package,
    title: "Scalable Inventory Management",
    description: "Viral success can happen overnight. We maintain safety stock levels and buffer inventory so you're never caught off-guard. Our real-time tracking shows exactly what's available, what's committed, and when you need to restock—preventing overselling and disappointed customers.",
    features: ["Safety stock alerts", "Real-time availability", "Demand forecasting support"],
    link: "/inventory-management"
  },
  {
    icon: Truck,
    title: "Order Routing & Carrier Optimization",
    description: "We select the best carrier for each shipment based on destination, package size, and delivery speed requirements. From economy ground for cost savings to expedited options for impatient buyers, we optimize every order for the best balance of speed and cost.",
    features: ["Multi-carrier network", "Rate shopping", "Automatic label generation"],
    link: "/pricing"
  }
];
const TikTokChannelServices = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        ref,
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Fulfillment" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Capabilities" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Purpose-built for the unpredictable nature of TikTok commerce. We handle the logistics so you can focus on creating content." }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: capabilities.map((capability, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: index * 0.15 },
        className: "group relative p-8 bg-card rounded-2xl border border-border hover:border-pink-300 hover:shadow-xl transition-all duration-300",
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 group-hover:from-pink-600 group-hover:to-purple-600 transition-colors duration-300 shadow-lg", children: /* @__PURE__ */ jsx(capability.icon, { className: "w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold mb-4 text-foreground group-hover:text-pink-600 transition-colors duration-300", children: /* @__PURE__ */ jsx(TranslatedText, { children: capability.title }) }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: capability.description }) }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-6", children: capability.features.map((feature, fIndex) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-pink-500" }),
            /* @__PURE__ */ jsx(TranslatedText, { children: feature })
          ] }, fIndex)) }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: capability.link,
              className: "text-sm font-medium text-pink-600 hover:text-pink-700 inline-flex items-center gap-1 group/link",
              children: [
                /* @__PURE__ */ jsx(TranslatedText, { children: "Learn more" }),
                /* @__PURE__ */ jsx("span", { className: "group-hover/link:translate-x-1 transition-transform duration-200", children: "→" })
              ]
            }
          )
        ]
      },
      index
    )) })
  ] }) });
};
const metrics = [
  { value: 1e5, suffix: "+", label: "Viral Orders Fulfilled", prefix: "" },
  { value: 6, suffix: "hr", label: "Avg Processing Time", prefix: "" },
  { value: 1, suffix: "%", label: "Error Rate", prefix: "<" },
  { value: 95, suffix: "%+", label: "Customer Satisfaction", prefix: "" },
  { value: 10, suffix: "x", label: "Surge Capacity", prefix: "" },
  { value: 99, suffix: "%", label: "On-Time Delivery", prefix: "" }
];
const TikTokChannelMetrics = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsxs("section", { className: "relative py-24 overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-fuchsia-900", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10",
          animate: {
            scale: [1, 1.2, 1],
            x: [0, -30, 0]
          },
          transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "absolute bottom-0 left-0 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10",
          animate: {
            scale: [1, 1.3, 1],
            y: [0, -40, 0]
          },
          transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-500 rounded-full blur-3xl opacity-10",
          animate: {
            scale: [1, 1.1, 1]
          },
          transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 relative z-10", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          ref,
          initial: { opacity: 0, y: 20 },
          animate: isVisible ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.5 },
          className: "text-center mb-16",
          children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4 text-white", children: [
              /* @__PURE__ */ jsx(TranslatedText, { children: "Built for" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Viral Moments" }) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-white/70 max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "When your content takes off, your fulfillment needs to keep pace. These numbers show why TikTok sellers trust us with their biggest moments." }) })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children: metrics.map((metric, index) => /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: isVisible ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.5, delay: index * 0.1 },
          className: "relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300",
          children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-2xl md:text-3xl font-bold text-white mb-1", children: [
              metric.prefix,
              isVisible ? /* @__PURE__ */ jsx(
                MetricCounter,
                {
                  value: metric.value,
                  duration: 2e3,
                  suffix: metric.suffix
                }
              ) : `0${metric.suffix}`
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-white/60", children: /* @__PURE__ */ jsx(TranslatedText, { children: metric.label }) })
          ] })
        },
        index
      )) })
    ] })
  ] });
};
const integrationFeatures = [
  {
    icon: RefreshCw,
    title: "Real-Time Order Import",
    description: "Orders from TikTok Shop are automatically imported into our system within minutes. No manual entry, no delays—just seamless order flow from platform to fulfillment."
  },
  {
    icon: Package,
    title: "SKU Mapping",
    description: "We map your TikTok product SKUs to our internal fulfillment SKUs, handling bundles, variants, and multi-packs automatically. One product in TikTok can trigger multiple items in the warehouse."
  },
  {
    icon: Truck,
    title: "Instant Status Sync",
    description: "As orders move through picking, packing, and shipping, status updates are pushed back to TikTok Shop in real-time. Your customers see accurate order progress without manual updates."
  },
  {
    icon: Bell,
    title: "Tracking Updates",
    description: "Tracking numbers and carrier information are automatically pushed to TikTok Shop and your customers. They get notified the moment their order ships, reducing 'where's my order' inquiries."
  }
];
const TikTokChannelIntegration = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-pink-50/50 to-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        ref,
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Seamless" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "TikTok Shop Integration" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Connect your TikTok Shop and let automation handle the rest. Our integration keeps orders, inventory, and tracking in perfect sync." }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: isVisible ? { opacity: 1, scale: 1 } : {},
          transition: { duration: 0.5, delay: 0.2 },
          className: "relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 mb-12",
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg mb-2", children: /* @__PURE__ */ jsx(SiTiktok, { className: "text-white w-10 h-10" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "TikTok Shop" }) })
            ] }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-8 h-8 text-pink-400 rotate-90 md:rotate-0" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg mb-2 p-2 border border-gray-100", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: westfieldLogo,
                  alt: "Westfield 3PL",
                  className: "w-full h-full object-contain"
                }
              ) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Westfield 3PL" }) })
            ] }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-8 h-8 text-pink-400 rotate-90 md:rotate-0" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg mb-2", children: /* @__PURE__ */ jsx(Check, { className: "w-10 h-10 text-white" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Happy Customer" }) })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: integrationFeatures.map((feature, index) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: isVisible ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.5, delay: 0.3 + index * 0.1 },
          className: "flex gap-4 p-6 bg-card rounded-xl border border-border hover:border-pink-200 hover:shadow-md transition-all duration-300",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(feature.icon, { className: "w-6 h-6 text-pink-600" }) }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: feature.title }) }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: feature.description }) })
            ] })
          ]
        },
        index
      )) }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: isVisible ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.5, delay: 0.7 },
          className: "mt-8 text-center",
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/integrations",
              className: "text-pink-600 hover:text-pink-700 font-medium inline-flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsx(TranslatedText, { children: "See all integrations" }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              ]
            }
          )
        }
      )
    ] })
  ] }) });
};
const TikTokChannelCaseStudy = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const caseMetrics = [
    { icon: TrendingUp, value: "3M+", label: "Video Views", detail: "Viral FYP placement" },
    { icon: Package, value: "5,000+", label: "Orders Fulfilled", detail: "In 48 hours" },
    { icon: Clock, value: "6hr", label: "Avg Processing", detail: "During surge" },
    { icon: Star, value: "4.9★", label: "Customer Rating", detail: "Post-fulfillment" }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs(motion.div, { ref, initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5 }, className: "max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Viral" }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Success Story" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "See how we helped a TikTok creator turn a viral moment into lasting success." }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-30" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-8 md:gap-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:w-1/2", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-block px-3 py-1 bg-pink-100 text-pink-700 text-sm font-medium rounded-full mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Beauty & Skincare" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-4 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "3 Million Views to 5,000 Orders in 48 Hours" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "The Moment:" }) }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "A skincare creator's product review hit the For You page and went viral overnight. Within hours, their TikTok Shop was flooded with orders—far beyond anything they could handle in-house." })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Our Response:" }) }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "We activated surge protocols immediately. Extra staff were brought in, and we prioritized their orders in our pick queue. Real-time communication kept the creator informed as we worked through the backlog." })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "The Outcome:" }) }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "All 5,000+ orders shipped within 48 hours. Customer satisfaction remained high, negative reviews were minimal, and the creator built a sustainable business from that viral moment." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md:w-1/2", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: caseMetrics.map((metric, index) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: isVisible ? { opacity: 1, scale: 1 } : {}, transition: { duration: 0.5, delay: 0.3 + index * 0.1 }, className: "p-4 bg-white rounded-xl border border-pink-100 shadow-sm", children: [
            /* @__PURE__ */ jsx(metric.icon, { className: "w-8 h-8 text-pink-500 mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground", children: metric.value }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: metric.label }) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: metric.detail }) })
          ] }, index)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-8 border-t border-pink-200 flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600", children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Prepare for Your Viral Moment" }) }) }),
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "border-pink-300 hover:bg-pink-50", children: /* @__PURE__ */ jsx(Link, { to: "/why-choose-us", children: /* @__PURE__ */ jsx(TranslatedText, { children: "See More Success Stories" }) }) })
        ] })
      ] })
    ] })
  ] }) }) });
};
const faqs$1 = [
  {
    question: "How do you connect to TikTok Shop for fulfillment?",
    answer: "We integrate with TikTok Shop through established middleware platforms and APIs. Once connected, orders flow automatically into our system, inventory levels sync in real-time, and tracking information is pushed back to TikTok and your customers. The setup typically takes 24-48 hours, and our team handles the technical configuration so you can focus on creating content."
  },
  {
    question: "Can you handle sudden order spikes from viral videos?",
    answer: "Absolutely—that's exactly what we're built for. We maintain surge capacity specifically for TikTok sellers, with flexible staffing and buffer inventory systems. When your video goes viral, we activate priority protocols to process your orders first. We've successfully handled spikes from 100 to 10,000+ orders overnight without missing a beat."
  },
  {
    question: "What's your average processing time for TikTok Shop orders?",
    answer: "Our average processing time for TikTok Shop orders is 6 hours from order receipt to shipment. We understand TikTok customers expect fast delivery, so we prioritize quick turnaround. For standard orders, same-day shipping is typical when orders arrive before our cutoff time. During viral surges, we may extend slightly but maintain communication throughout."
  },
  {
    question: "Do you offer branded packaging for TikTok Shop orders?",
    answer: "Yes! Unboxing content is huge on TikTok, so we offer custom branded packaging options. This includes branded boxes, tissue paper, thank-you cards, stickers, and promotional inserts. Many of our TikTok sellers see their customers post unboxing videos, which creates organic marketing. We work with you to design a packaging experience worth sharing."
  },
  {
    question: "How do returns work for TikTok Shop orders?",
    answer: "We handle TikTok Shop returns end-to-end. When a return is initiated, we receive the product, inspect its condition, and update your inventory accordingly. Sellable items go back into available stock, while damaged items are documented and set aside. You get full visibility into return status and can make decisions about damaged inventory."
  }
];
const TikTokChannelFAQ = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-background to-pink-50/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        ref,
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Frequently Asked" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Questions" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get answers to common questions about TikTok Shop fulfillment." }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: 0.2 },
        className: "max-w-3xl mx-auto",
        children: /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "space-y-4", children: faqs$1.map((faq, index) => /* @__PURE__ */ jsxs(
          AccordionItem,
          {
            value: `item-${index}`,
            className: "border border-border rounded-xl px-6 bg-card hover:border-pink-200 transition-colors duration-200 data-[state=open]:border-pink-300 data-[state=open]:shadow-md",
            children: [
              /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left font-semibold hover:text-pink-600 hover:no-underline py-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: faq.question }) }),
              /* @__PURE__ */ jsx(AccordionContent, { className: "text-muted-foreground pb-4 leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: faq.answer }) })
            ]
          },
          index
        )) })
      }
    )
  ] }) });
};
const faqs = [
  {
    question: "How do you connect to TikTok Shop?",
    answer: "We integrate via established middleware platforms and APIs. Setup takes 24-48 hours."
  },
  {
    question: "Can you handle viral order spikes?",
    answer: "Absolutely. We maintain surge capacity specifically for TikTok sellers with 10x scaling ability."
  },
  {
    question: "What's your average processing time?",
    answer: "Our average is 6 hours from order receipt to shipment. Same-day shipping is typical."
  }
];
const TikTokShop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "TikTok Shop Fulfillment by Expert TikTok Fulfillment Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Boost your TikTok shop sales with our TikTok fulfillment center. Quick,\naccurate, and hassle-free order processing to keep your customers happy. Contact now!"
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/sales-channels/tiktok-shop" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "TikTok Shop Fulfillment Los Angeles | Westfield 3PL" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          property: "og:description",
          content: "Fulfill viral TikTok Shop orders with 6hr processing, surge capacity, and branded packaging."
        }
      ),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/sales-channels/tiktok-shop" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" })
    ] }),
    /* @__PURE__ */ jsx(
      StructuredData,
      {
        type: "service",
        data: {
          name: "TikTok Shop Fulfillment",
          description: "Professional TikTok Shop fulfillment services with real-time order sync, surge capacity, and rapid pick/pack for viral demand in Los Angeles."
        }
      }
    ),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: { faqs } }),
    /* @__PURE__ */ jsx(StructuredData, { type: "software" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { label: "Sales Channels", path: "/sales-channels" },
            { label: "TikTok Shop", path: "/sales-channels/tiktok-shop" }
          ]
        }
      ),
      /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(TikTokChannelHero, {}),
        /* @__PURE__ */ jsx(TrustStrip, {}),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-6 text-center", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "The Power of" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "TikTok Shopping" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "TikTok Shop has flipped the ecommerce funnel. Unlike traditional platforms where customers search for products, TikTok's algorithm delivers products to customers through engaging content. This creates a unique dynamic where demand can explode overnight with zero warning." }) }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6 mb-8", children: [
            { icon: Video, text: "Viral content generates instant demand" },
            { icon: Heart, text: "Live selling drives impulse purchases" },
            { icon: Gift, text: "Limited drops sell out in minutes" }
          ].map((item, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl text-center border border-pink-500/20 hover:border-pink-500/40 transition-colors",
              children: [
                /* @__PURE__ */ jsx(item.icon, { className: "w-8 h-8 text-pink-500 mx-auto mb-3" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.text }) })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center", children: /* @__PURE__ */ jsx(TranslatedText, { children: "But that explosive demand requires fulfillment workflows that won't break when traffic spikes. Your viral moment should be celebrated, not stressed over." }) })
        ] }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-pink-50/50 to-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8 text-pink-600" }) }) }),
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-6 text-center", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Why TikTok Shop Needs a" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "3PL Partner" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8 text-center", children: /* @__PURE__ */ jsx(TranslatedText, { children: "One viral video can lead to thousands of orders in hours. Without scalable fulfillment infrastructure, your brand risks serious consequences that can damage your reputation and TikTok Shop seller metrics." }) }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6 mb-8", children: [
            "Fulfillment delays and backlogs",
            "Missing delivery expectations",
            "Higher support costs and refunds"
          ].map((item, idx) => /* @__PURE__ */ jsx("div", { className: "p-5 bg-pink-50 border border-pink-200 rounded-lg text-center", children: /* @__PURE__ */ jsx("span", { className: "font-medium text-pink-700", children: /* @__PURE__ */ jsx(TranslatedText, { children: item }) }) }, idx)) }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-center", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "A 3PL with experience in rapid surges gives you the operational backbone to support peak moments. We've handled drops going from 100 to 10,000+ orders overnight without missing SLAs. Learn more about our" }),
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/order-fulfillment", className: "text-pink-600 hover:underline font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: "order fulfillment capabilities" }) }),
            "."
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(TikTokChannelValueGrid, {}),
        /* @__PURE__ */ jsx(TikTokChannelIntegration, {}),
        /* @__PURE__ */ jsx(TikTokChannelServices, {}),
        /* @__PURE__ */ jsx(TikTokChannelMetrics, {}),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(Heart, { className: "h-8 w-8 text-pink-600" }) }) }),
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-6 text-center", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Creator-Friendly" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Fulfillment" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8 text-center", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Unboxing content is huge on TikTok. When customers share their experience, it creates organic marketing that money can't buy. That's why we offer custom branded packaging options including branded boxes, tissue paper, thank-you cards, stickers, and promotional inserts." }) }),
          /* @__PURE__ */ jsxs("p", { className: "text-center text-muted-foreground mb-8", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Many of our TikTok sellers see their customers post unboxing videos, creating a virtuous cycle of content and sales. We work with you to design a packaging experience worth sharing. Explore our" }),
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/kitting-bundling", className: "text-pink-600 hover:underline font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: "kitting and bundling services" }) }),
            " ",
            /* @__PURE__ */ jsx(TranslatedText, { children: "for more options." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              className: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
              children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Discuss Custom Packaging" }) })
            }
          ) })
        ] }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-pink-50/50 to-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Built for" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Surge Handling" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We maintain buffer inventory, flexible staffing, and prioritized pick queues specifically for TikTok sellers. When your video hits the For You page and orders explode, we activate surge protocols immediately. Extra staff are brought in, and your orders move to the front of the queue." }) }),
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8", children: [
            "10x surge capacity on demand",
            "Flexible staffing for peak events",
            "Priority pick queue activation",
            "Real-time communication throughout"
          ].map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-card rounded-lg border border-border", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-left", children: /* @__PURE__ */ jsx(TranslatedText, { children: item }) })
          ] }, idx)) }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Don't let your viral moment become a logistics nightmare. We're your partner in turning TikTok fame into sustainable business growth." }) })
        ] }) }) }),
        /* @__PURE__ */ jsx(TikTokChannelCaseStudy, {}),
        /* @__PURE__ */ jsx(TikTokChannelFAQ, {}),
        /* @__PURE__ */ jsx("section", { className: "py-24 bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600 text-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ready for Your Viral Moment?" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-white/90 mb-8 max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Partner with a 3PL that's built for TikTok's unpredictable, explosive demand. We'll handle the logistics so you can focus on creating content." }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                asChild: true,
                size: "lg",
                className: "px-10 py-7 text-lg font-bold bg-white text-pink-600 hover:bg-white/90 shadow-lg",
                children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get Started Today" }) })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                asChild: true,
                variant: "outline",
                size: "lg",
                className: "px-10 py-7 text-lg font-bold border-2 border-white text-white bg-transparent hover:bg-white/10",
                children: /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(TranslatedText, { children: "View Pricing" }) })
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(StickyCTA, {})
    ] })
  ] });
};
export {
  TikTokShop as default
};
