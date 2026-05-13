import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { T as TranslatedText, B as Button, w as westfieldLogo, S as StructuredData, H as Header, F as Footer } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Package, BarChart3, CheckCircle, Gift, RefreshCw, TrendingUp, Check, Palette, Truck, RotateCcw, Camera, Boxes, Rocket, Clock, Users, Upload, ClipboardCheck, Bell, Star, ChevronDown, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-WfKgKW48.js";
import { u as useIntersectionObserver } from "./use-intersection-observer-0IkYX39w.js";
import { SiShopify } from "react-icons/si";
import { M as MetricCounter } from "./metric-counter-TC-ts67f.js";
import StickyMobileCTA from "./StickyMobileCTA-D9baN_LR.js";
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
const ShopifyChannelHero = () => {
  const trustPoints = [
    { icon: Zap, text: "Same-Day Shipping" },
    { icon: Package, text: "Branded Packaging" },
    { icon: BarChart3, text: "Real-Time Sync" },
    { icon: CheckCircle, text: "99.6% Accuracy" }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "relative w-full overflow-hidden bg-gradient-to-br from-white via-lime-50/50 to-emerald-50", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-[0.03]",
        style: {
          backgroundImage: `radial-gradient(circle at 1px 1px, #059669 1px, transparent 0)`,
          backgroundSize: "32px 32px"
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          animate: {
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          },
          transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          className: "absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-lime-300/30 to-emerald-300/30 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-2xl"
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          animate: {
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 0]
          },
          transition: { duration: 18, repeat: Infinity, ease: "easeInOut" },
          className: "absolute top-1/3 -left-32 w-64 h-64 bg-gradient-to-br from-emerald-200/40 to-lime-200/40 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-2xl"
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          animate: {
            scale: [1, 1.15, 1]
          },
          transition: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          className: "absolute bottom-10 right-1/4 w-48 h-48 bg-gradient-to-br from-lime-200/30 to-green-200/30 rounded-full blur-2xl"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-emerald-200/20 via-lime-100/10 to-transparent rounded-full blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 container mx-auto px-4 pt-12 pb-16 lg:pt-16 lg:pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl lg:max-w-5xl mx-auto lg:mx-0 lg:text-left text-center", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5, delay: 0.1 },
          className: "mb-6 lg:mb-8",
          children: /* @__PURE__ */ jsxs(Badge, { className: "bg-emerald-500 text-white border-emerald-600 px-5 py-2 text-sm font-semibold shadow-lg shadow-emerald-500/20", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-white mr-2 animate-pulse" }),
            /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify-Certified 3PL Partner" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.h1,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 },
          className: "text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight",
          children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify Fulfillment That" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-500", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Grows With You" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.3 },
          className: "text-lg md:text-xl text-slate-600 mb-6 max-w-3xl lg:max-w-2xl leading-relaxed",
          children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Real-time inventory sync, branded unboxing experiences, and same-day shipping from Los Angeles. Scale your DTC brand without the operational headaches." }),
            " ",
            /* @__PURE__ */ jsx(TranslatedText, { children: "Learn more about our" }),
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/why-choose-us", className: "text-emerald-600 hover:text-emerald-700 underline underline-offset-2 font-medium transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "dedicated approach" }) }),
            " ",
            /* @__PURE__ */ jsx(TranslatedText, { children: "and" }),
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/pricing", className: "text-emerald-600 hover:text-emerald-700 underline underline-offset-2 font-medium transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "transparent pricing" }) }),
            "."
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.4 },
          className: "flex flex-wrap justify-center lg:justify-start gap-3 mb-8",
          children: trustPoints.map((point, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-4 py-2 bg-lime-100/80 backdrop-blur-sm rounded-full border border-lime-200/50",
              children: [
                /* @__PURE__ */ jsx(point.icon, { className: "w-4 h-4 text-emerald-600" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-emerald-800 font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: point.text }) })
              ]
            },
            index
          ))
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.5 },
          className: "flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center lg:justify-start", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  asChild: true,
                  size: "lg",
                  className: "bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white px-8 py-6 text-base font-bold shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all duration-300 group",
                  children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
                    /* @__PURE__ */ jsx(TranslatedText, { children: "Get Your Custom Quote" }),
                    /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  asChild: true,
                  size: "lg",
                  variant: "outline",
                  className: "border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-base font-bold",
                  children: /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(TranslatedText, { children: "View Pricing" }) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 lg:gap-8 justify-center lg:justify-start lg:border-l lg:border-slate-200 lg:pl-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center lg:text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-bold text-emerald-600", children: "500K+" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Orders Shipped" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center lg:text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-bold text-emerald-600", children: "12hr" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Avg Lead Time" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center lg:text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-bold text-emerald-600", children: "150+" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify Brands" }) })
              ] })
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" })
  ] });
};
const ShopifyChannelValueGrid = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const values = [
    {
      icon: Zap,
      title: "Real-Time Inventory Sync",
      description: "Automatic stock updates the moment orders ship or inventory arrives. No manual spreadsheets, no overselling, no customer complaints. Your Shopify store always shows accurate availability."
    },
    {
      icon: Gift,
      title: "Branded Unboxing Experiences",
      description: "Custom tissue paper, thank-you cards, promotional inserts, and gift wrapping. Every package tells your brand story and creates Instagram-worthy unboxing moments that drive repeat purchases."
    },
    {
      icon: RefreshCw,
      title: "Seamless Returns Processing",
      description: "We receive, inspect, restock, and update your inventory automatically. Quality control photos document every return. Damaged items are flagged before they reach your customers again."
    },
    {
      icon: TrendingUp,
      title: "Scale Without Limits",
      description: "From 50 orders per month to 5,000+, our infrastructure grows with you. No long-term contracts, no hidden fees. Flash sales and seasonal spikes handled without breaking a sweat."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-gradient-to-b from-background to-[hsl(var(--shopify-page-light))]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Why Shopify Brands Choose Westfield" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Running a Shopify store is hard enough. Let us handle the fulfillment complexity while you focus on growing your brand, launching products, and delighting customers. Here's what sets us apart from generic 3PLs." }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8 max-w-6xl mx-auto", children: values.map((value, index) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 40 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: index * 0.15 },
        children: /* @__PURE__ */ jsxs(Card, { className: "h-full border-2 border-border/50 hover:border-[hsl(var(--shopify-page-accent))]/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-white overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--shopify-page-accent))] to-[hsl(var(--shopify-page-primary))] opacity-0 group-hover:opacity-100 transition-opacity" }),
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--shopify-page-accent))]/10 to-[hsl(var(--shopify-page-accent))]/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300", children: /* @__PURE__ */ jsx(value.icon, { className: "h-8 w-8 text-[hsl(var(--shopify-page-accent))]" }) }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xl md:text-2xl", children: /* @__PURE__ */ jsx(TranslatedText, { children: value.title }) })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: value.description }) }) })
        ] })
      },
      index
    )) })
  ] }) });
};
const ShopifyChannelIntegration = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const navigate = useNavigate();
  const integrationFeatures = [
    {
      title: "Automatic Order Import",
      description: "New orders flow into our WMS within seconds. No manual entry, no copy-paste errors, no delays."
    },
    {
      title: "Instant Stock Updates",
      description: "Inventory levels sync in real-time. Sell on multiple channels without overselling."
    },
    {
      title: "Tracking Number Sync",
      description: "Shipping confirmations push back to Shopify automatically. Customers get updates instantly."
    },
    {
      title: "Returns Automation",
      description: "RMA processing, inventory restocking, and quality checks all happen seamlessly."
    },
    {
      title: "Multi-Location Support",
      description: "Manage inventory across our LA facility and any additional locations you operate."
    },
    {
      title: "SKU Mapping Intelligence",
      description: "Complex variant handling, bundle mapping, and alias management built in."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -30 },
        animate: isVisible ? { opacity: 1, x: 0 } : {},
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "True Shopify Integration, Not Just a Plugin" }) }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg text-muted-foreground mb-8 leading-relaxed", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Most 3PLs offer basic Shopify connections that break during peak seasons. Our integration is battle-tested across Black Friday surges, flash sales, and viral TikTok moments. We've processed millions of orders without a single sync failure." }),
            " ",
            /* @__PURE__ */ jsx(TranslatedText, { children: "Learn why brands trust our" }),
            " ",
            /* @__PURE__ */ jsx("a", { href: "/why-choose-us", className: "text-[hsl(var(--shopify-page-accent))] hover:underline font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: "dedicated fulfillment approach" }) }),
            "."
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 mb-8", children: integrationFeatures.map((feature, index) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: isVisible ? { opacity: 1, x: 0 } : {},
              transition: { duration: 0.4, delay: index * 0.1 },
              className: "flex items-start gap-4 p-4 rounded-xl bg-[hsl(var(--shopify-page-light))]/50 hover:bg-[hsl(var(--shopify-page-light))] transition-colors group",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-8 w-8 rounded-full bg-[hsl(var(--shopify-page-accent))]/20 flex items-center justify-center group-hover:bg-[hsl(var(--shopify-page-accent))]/30 transition-colors", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-[hsl(var(--shopify-page-accent))]" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground mb-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: feature.title }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: feature.description }) })
                ] })
              ]
            },
            index
          )) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => navigate("/integrations"),
              className: "bg-[hsl(var(--shopify-page-accent))] hover:bg-[hsl(var(--shopify-page-accent))]/90 text-white",
              children: [
                /* @__PURE__ */ jsx(TranslatedText, { children: "View All Integrations" }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
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
        animate: isVisible ? { opacity: 1, x: 0 } : {},
        transition: { duration: 0.6, delay: 0.2 },
        className: "relative",
        children: /* @__PURE__ */ jsxs("div", { className: "relative bg-gradient-to-br from-[hsl(var(--shopify-page-primary))] to-[hsl(var(--shopify-page-accent))]/80 rounded-3xl p-8 md:p-12 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-white", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium opacity-80 mb-4 uppercase tracking-wider", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify ↔ Westfield WMS" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-[#96BF48] rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(SiShopify, { className: "text-white w-6 h-6" }) }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify Store" }) })
                ] }),
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { x: [0, 10, 0] },
                    transition: { duration: 1.5, repeat: Infinity },
                    className: "text-[hsl(var(--shopify-page-accent))]",
                    children: "⟷"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: westfieldLogo,
                      alt: "Westfield WMS",
                      className: "w-full h-full object-contain"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: "WMS" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold", children: "147" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm opacity-80", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Orders Today" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold", children: "98.9%" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm opacity-80", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Sync Success" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-sm opacity-80 text-center pt-4 border-t border-white/20", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Real-time sync • Zero downtime • Enterprise-grade reliability" }) })
            ] })
          ] })
        ] })
      }
    )
  ] }) }) });
};
const ShopifyChannelServices = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const services = [
    {
      icon: Package,
      title: "Pick & Pack Fulfillment",
      description: "Every order picked accurately, packed professionally, and shipped same-day when received before 2PM. We handle single items, multi-SKU orders, and complex bundles with equal precision.",
      link: "/order-fulfillment",
      linkText: "Learn about fulfillment →"
    },
    {
      icon: Palette,
      title: "Custom Branding & Kitting",
      description: "Branded tissue paper, custom mailer boxes, thank-you cards, promotional inserts, stickers, and gift wrapping. Create memorable unboxing experiences that turn customers into brand advocates.",
      link: "/kitting-bundling",
      linkText: "See branding options →"
    },
    {
      icon: Truck,
      title: "Multi-Carrier Shipping",
      description: "Access discounted rates across USPS, UPS, FedEx, and regional carriers. We automatically select the best carrier based on destination, weight, and delivery speed requirements.",
      link: "/pricing",
      linkText: "View shipping rates →"
    },
    {
      icon: RotateCcw,
      title: "Returns Management",
      description: "Full returns processing including receiving, inspection, quality control photography, restocking, and inventory updates. Problem items flagged before they cause customer complaints.",
      link: "/returns-processing",
      linkText: "Returns workflow →"
    },
    {
      icon: Camera,
      title: "Photo Quality Control",
      description: "Every order photographed before shipping. Every return documented on arrival. Full visual audit trail accessible through your client dashboard for dispute resolution.",
      link: "/receiving-inspection",
      linkText: "QC process details →"
    },
    {
      icon: Boxes,
      title: "Inventory Storage",
      description: "Climate-controlled, secure warehouse space in Los Angeles. Strategic location for fast West Coast delivery and efficient nationwide distribution. No long-term commitments.",
      link: "/storage-warehousing",
      linkText: "Storage options →"
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-[hsl(var(--shopify-page-light))]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Complete Shopify Fulfillment Services" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "From the moment your products arrive at our Los Angeles warehouse to the second they land on your customer's doorstep, we handle every step with care. Each service is designed specifically for DTC Shopify brands who demand quality." }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto", children: services.map((service, index) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 40 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay: index * 0.1 },
        children: /* @__PURE__ */ jsxs(Card, { className: "h-full border-2 border-border/50 hover:border-[hsl(var(--shopify-page-accent))]/50 hover:shadow-2xl transition-all duration-300 group bg-white relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--shopify-page-accent))]/5 to-transparent rounded-bl-full" }),
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-xl bg-gradient-to-br from-[hsl(var(--shopify-page-accent))]/15 to-[hsl(var(--shopify-page-accent))]/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(service.icon, { className: "h-7 w-7 text-[hsl(var(--shopify-page-accent))]" }) }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xl", children: /* @__PURE__ */ jsx(TranslatedText, { children: service.title }) })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: service.description }) }),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: service.link,
                className: "inline-block text-sm font-medium text-[hsl(var(--shopify-page-accent))] hover:text-[hsl(var(--shopify-page-primary))] transition-colors",
                children: /* @__PURE__ */ jsx(TranslatedText, { children: service.linkText })
              }
            )
          ] })
        ] })
      },
      index
    )) })
  ] }) });
};
const ShopifyChannelMetrics = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.3 });
  const isVisible = !!entry?.isIntersecting;
  const metrics = [
    { icon: Rocket, value: 5e5, suffix: "+", label: "Orders Fulfilled Annually" },
    { icon: Clock, value: 12, suffix: "hr", label: "Average Lead Time" },
    { icon: CheckCircle, value: 99.6, suffix: "%", label: "Order Accuracy Rate" },
    { icon: Package, value: 99.2, suffix: "%", label: "Same-Day Ship Rate" },
    { icon: TrendingUp, value: 2.9, suffix: "x", label: "Avg Revenue Growth" },
    { icon: Users, value: 150, suffix: "+", label: "Active Shopify Brands" }
  ];
  return /* @__PURE__ */ jsxs("section", { ref, className: "py-24 bg-[hsl(var(--shopify-page-primary))] text-white relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 opacity-15", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          animate: {
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0]
          },
          transition: { duration: 20, repeat: Infinity, ease: "easeInOut" },
          className: "absolute top-10 left-10 w-96 h-96 bg-[hsl(var(--shopify-page-accent))] rounded-full blur-3xl"
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          animate: {
            scale: [1.2, 1, 1.2],
            rotate: [0, -10, 0]
          },
          transition: { duration: 25, repeat: Infinity, ease: "easeInOut" },
          className: "absolute bottom-10 right-10 w-[500px] h-[500px] bg-[hsl(var(--shopify-page-accent))] rounded-full blur-3xl"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 relative z-10", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: isVisible ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.6 },
          className: "text-center mb-16",
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Proven Performance for Shopify Brands" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "These aren't projections. These are real metrics from real Shopify stores we fulfill daily. Our success is measured by your growth, your customer satisfaction, and your operational efficiency." }) })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto", children: metrics.map((metric, index) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: isVisible ? { opacity: 1, scale: 1 } : {},
          transition: { duration: 0.5, delay: index * 0.1 },
          className: "text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/25 hover:-translate-y-1 transition-all duration-300 group",
          children: [
            /* @__PURE__ */ jsx(metric.icon, { className: "h-10 w-10 text-[hsl(var(--shopify-page-accent))] mx-auto mb-4 group-hover:scale-110 transition-transform" }),
            /* @__PURE__ */ jsx("div", { className: "text-4xl md:text-5xl font-bold mb-3", children: isVisible ? /* @__PURE__ */ jsx(
              MetricCounter,
              {
                value: metric.value,
                suffix: metric.suffix,
                duration: 2e3
              }
            ) : "0" }),
            /* @__PURE__ */ jsx("div", { className: "text-white/70 text-sm font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: metric.label }) })
          ]
        },
        index
      )) }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: isVisible ? { opacity: 1 } : {},
          transition: { duration: 0.6, delay: 0.8 },
          className: "text-center mt-12 pt-8 border-t border-white/20 max-w-4xl mx-auto",
          children: /* @__PURE__ */ jsx("p", { className: "text-white/70 text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Metrics updated quarterly • Data verified by third-party audit • Industry-leading performance benchmarks" }) })
        }
      )
    ] })
  ] });
};
const ShopifyChannelTimeline = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Connect Your Store",
      description: "Install our Shopify app and authorize access. Takes under 5 minutes. Your products and orders start syncing immediately.",
      time: "5 minutes"
    },
    {
      number: 2,
      icon: Package,
      title: "Ship Your Inventory",
      description: "Send your products to our LA warehouse. We receive, count, photograph, and check-in every unit. Full visibility in your dashboard.",
      time: "Same-day receiving"
    },
    {
      number: 3,
      icon: ClipboardCheck,
      title: "Configure Preferences",
      description: "Set up branded packaging, carrier preferences, return addresses, and any special handling instructions for specific SKUs.",
      time: "1-2 hours"
    },
    {
      number: 4,
      icon: Camera,
      title: "Orders Flow In",
      description: "New orders import automatically. Our team picks, packs, applies custom branding, and photographs each order before shipping.",
      time: "Real-time"
    },
    {
      number: 5,
      icon: Truck,
      title: "Same-Day Shipping",
      description: "Orders received before 2PM Pacific ship that day. Tracking numbers sync back to Shopify. Customers get shipping confirmations.",
      time: "Before 2PM cutoff"
    },
    {
      number: 6,
      icon: Bell,
      title: "Monitor & Scale",
      description: "Track inventory levels, order status, and fulfillment metrics through your dashboard. Scale up seamlessly as your brand grows.",
      time: "Ongoing"
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "From Connection to First Shipment" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Getting started with Westfield is simple. Most Shopify stores are fully operational within 48 hours of connecting. Here's exactly what happens at each step of the onboarding process." }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto relative", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute left-[60px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[hsl(var(--shopify-page-accent))] via-[hsl(var(--shopify-page-accent))]/50 to-[hsl(var(--shopify-page-accent))]/10" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-8", children: steps.map((step, index) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -30 },
          animate: isVisible ? { opacity: 1, x: 0 } : {},
          transition: { duration: 0.5, delay: index * 0.12 },
          className: "relative flex items-start gap-6 md:gap-8 group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex-shrink-0 h-[120px] w-[120px] rounded-2xl bg-gradient-to-br from-[hsl(var(--shopify-page-accent))] to-[hsl(var(--shopify-page-primary))] flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300", children: [
              /* @__PURE__ */ jsx(step.icon, { className: "h-8 w-8 mb-2" }),
              /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold", children: [
                /* @__PURE__ */ jsx(TranslatedText, { children: "Step" }),
                " ",
                step.number
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-white rounded-xl p-6 shadow-md border border-border/50 group-hover:border-[hsl(var(--shopify-page-accent))]/40 group-hover:shadow-xl transition-all duration-300", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: step.title }) }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium px-3 py-1 rounded-full bg-[hsl(var(--shopify-page-accent))]/10 text-[hsl(var(--shopify-page-accent))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: step.time }) })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: step.description }) })
            ] })
          ]
        },
        index
      )) })
    ] })
  ] }) });
};
const ShopifyChannelCaseStudy = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const metrics = [
    { icon: TrendingUp, value: "287%", label: "Revenue Growth" },
    { icon: Package, value: "8x", label: "Order Volume Increase" },
    { icon: Clock, value: "73%", label: "Faster Ship Time" },
    { icon: Star, value: "4.9★", label: "Customer Rating" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-[hsl(var(--shopify-page-light))]", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block px-4 py-2 rounded-full bg-[hsl(var(--shopify-page-accent))]/10 text-[hsl(var(--shopify-page-accent))] text-sm font-semibold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Case Study" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "How a Skincare Brand Scaled 8x in One Year" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6, delay: 0.2 },
        className: "bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden",
        children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-8 md:p-12", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-block px-3 py-1 rounded-full bg-[hsl(var(--shopify-page-primary))]/10 text-[hsl(var(--shopify-page-primary))] text-xs font-semibold mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "DTC Skincare • 50K+ Monthly Orders" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "The Challenge" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6 leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "A fast-growing skincare brand was struggling with fulfillment bottlenecks. Their in-house team couldn't keep up with order volume after a viral TikTok campaign. They were shipping orders 4-5 days late, receiving negative reviews, and losing repeat customers. Their Shopify store was growing, but their operations couldn't scale." }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "The Solution" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6 leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We onboarded them in 48 hours. Within a week, all orders were shipping same-day. Our custom branded packaging elevated their unboxing experience. Real-time inventory sync eliminated overselling. Returns processing improved customer satisfaction. They could finally focus on marketing and product development instead of logistics." }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-4 text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "The Results" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: 'Within 12 months, the brand grew from 6,000 monthly orders to 50,000+. Customer reviews improved from 3.8 to 4.9 stars. Return requests dropped 40%. The founders successfully raised a Series A, citing "operational excellence" as a key factor investors mentioned.' }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-[hsl(var(--shopify-page-primary))] to-[hsl(var(--shopify-page-accent))]/80 p-8 md:p-12 flex flex-col justify-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-white mb-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Results After 12 Months" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-white/80", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Real metrics from a real Shopify brand" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6", children: metrics.map((metric, index) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9 },
                animate: isVisible ? { opacity: 1, scale: 1 } : {},
                transition: { duration: 0.4, delay: 0.4 + index * 0.1 },
                className: "bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center",
                children: [
                  /* @__PURE__ */ jsx(metric.icon, { className: "h-8 w-8 text-white/90 mx-auto mb-3" }),
                  /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white mb-1", children: metric.value }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-white/70", children: /* @__PURE__ */ jsx(TranslatedText, { children: metric.label }) })
                ]
              },
              index
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-6 border-t border-white/20", children: [
              /* @__PURE__ */ jsx("blockquote", { className: "text-white/90 italic", children: /* @__PURE__ */ jsx(TranslatedText, { children: `"Westfield didn't just fix our fulfillment—they transformed our entire business. We went from dreading Black Friday to crushing it."` }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold", children: "JL" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-white font-medium", children: "Jessica L." }),
                  /* @__PURE__ */ jsx("div", { className: "text-white/60 text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Founder & CEO" }) })
                ] })
              ] })
            ] })
          ] })
        ] })
      }
    )
  ] }) }) });
};
const ShopifyChannelFAQ = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    {
      question: "How quickly can I get started with Shopify fulfillment?",
      answer: "Most Shopify stores are fully operational within 48 hours of connecting. The integration takes about 5 minutes. Once your inventory arrives at our LA warehouse, we can start shipping orders the same day. There's no lengthy onboarding process or technical implementation required."
    },
    {
      question: "What happens when I get a sudden surge in orders?",
      answer: "We're built for scale. Whether you're featured on a major publication, go viral on TikTok, or run a flash sale, our infrastructure handles it. We've processed 10x normal volume during Black Friday for multiple brands without delays. No advance notice required—we staff based on real-time order projections."
    },
    {
      question: "Can you match my current branded packaging?",
      answer: "Absolutely. We work with custom mailer boxes, branded tissue paper, thank-you cards, promotional inserts, stickers, and gift wrapping. Many brands ship us their packaging materials. We can also source materials on your behalf and store them at no additional cost. Every unboxing experience can be exactly what your brand requires."
    },
    {
      question: "How does inventory sync work between Shopify and your warehouse?",
      answer: "Our integration syncs in real-time. When we receive inventory, your Shopify stock updates automatically. When orders ship, quantities adjust instantly. When returns are restocked, availability reflects immediately. This eliminates overselling and ensures customers always see accurate availability."
    },
    {
      question: "What are your shipping carrier options and rates?",
      answer: "We offer discounted rates across USPS, UPS, FedEx, and regional carriers. Our system automatically selects the optimal carrier based on package size, weight, destination, and delivery speed requirements. Most brands save 15-25% on shipping compared to their previous setup. Visit our pricing page for detailed rate information."
    },
    {
      question: "How do you handle returns and exchanges?",
      answer: "We provide full returns processing. When a return arrives, we receive it, inspect the item, photograph its condition, and update your inventory. Sellable items are restocked immediately. Damaged items are flagged in your dashboard with photos. Exchange orders can be triggered automatically based on your preferences."
    },
    {
      question: "Is there a minimum order volume requirement?",
      answer: "No minimums and no long-term contracts. We work with brands doing 50 orders per month and brands doing 50,000+. Pricing scales as you grow. You're never locked into volume commitments you can't meet."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--shopify-page-primary))]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify Fulfillment FAQ" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Common questions from Shopify store owners considering Westfield as their fulfillment partner." }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto space-y-4", children: faqs.map((faq, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.4, delay: index * 0.08 },
        className: "border border-border/50 rounded-xl overflow-hidden bg-white hover:border-[hsl(var(--shopify-page-accent))]/30 transition-colors",
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setOpenIndex(openIndex === index ? null : index),
              className: "w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[hsl(var(--shopify-page-light))]/50 transition-colors",
              children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground pr-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: faq.question }) }),
                /* @__PURE__ */ jsx(
                  ChevronDown,
                  {
                    className: `h-5 w-5 flex-shrink-0 text-[hsl(var(--shopify-page-accent))] transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(AnimatePresence, { children: openIndex === index && /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { height: 0, opacity: 0 },
              animate: { height: "auto", opacity: 1 },
              exit: { height: 0, opacity: 0 },
              transition: { duration: 0.3 },
              className: "overflow-hidden",
              children: /* @__PURE__ */ jsx("div", { className: "px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border/30 pt-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: faq.answer }) })
            }
          ) })
        ]
      },
      index
    )) })
  ] }) });
};
const ShopifyChannelCTA = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("section", { className: "py-24 bg-gradient-to-br from-[hsl(var(--shopify-page-accent))] via-[hsl(var(--shopify-page-accent))]/95 to-[hsl(var(--shopify-page-primary))] text-white relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 opacity-15", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          animate: {
            scale: [1, 1.3, 1],
            x: [0, 30, 0]
          },
          transition: { duration: 20, repeat: Infinity, ease: "easeInOut" },
          className: "absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl"
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          animate: {
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0]
          },
          transition: { duration: 25, repeat: Infinity, ease: "easeInOut" },
          className: "absolute bottom-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxs(
        motion.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          viewport: { once: true },
          className: "text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight",
          children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Ready to Transform Your" }),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify Fulfillment?" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.1 },
          viewport: { once: true },
          className: "text-xl md:text-2xl mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto",
          children: /* @__PURE__ */ jsx(TranslatedText, { children: "Let's discuss your volume, your brand requirements, and your growth goals. We'll build a custom fulfillment solution that scales with your Shopify store." })
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 },
          viewport: { once: true },
          className: "flex flex-col sm:flex-row gap-4 justify-center",
          children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                onClick: () => navigate("/contact"),
                className: "bg-white text-[hsl(var(--shopify-page-accent))] hover:bg-white/90 px-10 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300 group",
                children: [
                  /* @__PURE__ */ jsx(TranslatedText, { children: "Get Your Free Quote" }),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                variant: "outline",
                onClick: () => navigate("/pricing"),
                className: "border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-lg font-bold",
                children: [
                  /* @__PURE__ */ jsx(Phone, { className: "mr-2 h-5 w-5" }),
                  /* @__PURE__ */ jsx(TranslatedText, { children: "View Pricing First" })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          transition: { duration: 0.6, delay: 0.3 },
          viewport: { once: true },
          className: "mt-12 flex flex-wrap justify-center gap-6 text-sm opacity-90",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-white" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "No minimums" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-white" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "No long-term contracts" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-white" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "Same-day shipping" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-white" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "48-hour onboarding" })
            ] })
          ]
        }
      )
    ] }) })
  ] });
};
const faqData = [
  {
    question: "How quickly can I get started with Shopify fulfillment?",
    answer: "Most Shopify stores are fully operational within 48 hours of connecting."
  },
  {
    question: "What happens when I get a sudden surge in orders?",
    answer: "We're built for scale. We've processed 10x normal volume during Black Friday without delays."
  },
  {
    question: "Can you match my current branded packaging?",
    answer: "Absolutely. We work with custom mailer boxes, branded tissue paper, thank-you cards, and gift wrapping."
  },
  {
    question: "How does inventory sync work?",
    answer: "Our integration syncs in real-time. When we receive inventory, your Shopify stock updates automatically."
  },
  {
    question: "What are your shipping carrier options?",
    answer: "We offer discounted rates across USPS, UPS, FedEx, and regional carriers with automatic selection."
  },
  {
    question: "How do you handle returns?",
    answer: "Full returns processing including receiving, inspection, photography, and automatic restocking."
  },
  {
    question: "Is there a minimum order volume?",
    answer: "No minimums and no long-term contracts. We work with brands doing 50 to 50,000+ orders monthly."
  }
];
const Shopify = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Shopify Fulfillment Center with Expert Order Management" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Westfield Prep Center is a Shopify fulfillment center that offers efficient Shopify order management, inventory control, and scalable fulfillment solutions."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/sales-channels/shopify" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Shopify Fulfillment Services | Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          property: "og:description",
          content: "Professional Shopify 3PL fulfillment with real-time sync, branded packaging, and same-day shipping from Los Angeles."
        }
      ),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/sales-channels/shopify" })
    ] }),
    /* @__PURE__ */ jsx(
      StructuredData,
      {
        type: "service",
        data: {
          name: "Shopify Fulfillment Services",
          description: "Professional Shopify order fulfillment with real-time inventory sync, branded packaging, and same-day shipping from Los Angeles."
        }
      }
    ),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqData }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(
      Breadcrumbs,
      {
        items: [
          { label: "Sales Channels", path: "/sales-channels" },
          { label: "Shopify", path: "/sales-channels/shopify" }
        ]
      }
    ),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(ShopifyChannelHero, {}),
      /* @__PURE__ */ jsx(ShopifyChannelValueGrid, {}),
      /* @__PURE__ */ jsx(ShopifyChannelIntegration, {}),
      /* @__PURE__ */ jsx(ShopifyChannelServices, {}),
      /* @__PURE__ */ jsx(ShopifyChannelMetrics, {}),
      /* @__PURE__ */ jsx(ShopifyChannelTimeline, {}),
      /* @__PURE__ */ jsx(ShopifyChannelCaseStudy, {}),
      /* @__PURE__ */ jsx(ShopifyChannelFAQ, {}),
      /* @__PURE__ */ jsx(ShopifyChannelCTA, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(StickyMobileCTA, {})
  ] });
};
export {
  Shopify as default
};
