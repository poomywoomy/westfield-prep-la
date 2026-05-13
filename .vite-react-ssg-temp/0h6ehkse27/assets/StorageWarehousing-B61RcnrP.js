import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { B as Button, S as StructuredData, H as Header, F as Footer } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Thermometer, Camera, Package, Lock, Shield, Warehouse, CheckCircle, BarChart3, ArrowRight } from "lucide-react";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
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
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "./use-intersection-observer-0IkYX39w.js";
const StorageHero = () => {
  const navigate = useNavigate();
  const [activeRack, setActiveRack] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRack((prev) => (prev + 1) % 9);
    }, 800);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-20",
        style: {
          backgroundImage: `
            linear-gradient(to right, rgb(6, 182, 212) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(6, 182, 212) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40",
        animate: { x: [0, 1200, 0] },
        transition: { duration: 8, repeat: Infinity, ease: "linear" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "container relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
          className: "order-2 lg:order-1",
          children: /* @__PURE__ */ jsxs("div", { className: "relative bg-slate-900/80 rounded-2xl border border-cyan-400/30 p-6 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-green-400 animate-pulse" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-cyan-300 font-mono", children: "WAREHOUSE LIVE VIEW" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/20 border border-cyan-400/30", children: [
                  /* @__PURE__ */ jsx(Thermometer, { className: "w-3 h-3 text-cyan-400" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-cyan-300", children: "68°F" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 border border-green-400/30", children: [
                  /* @__PURE__ */ jsx(Camera, { className: "w-3 h-3 text-green-400" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-green-300", children: "REC" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3 mb-6", children: [...Array(9)].map((_, idx) => /* @__PURE__ */ jsx(
              motion.div,
              {
                className: `aspect-square rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${idx === activeRack ? "bg-cyan-500/30 border-cyan-400 shadow-lg shadow-cyan-500/30" : "bg-slate-800/50 border-slate-700 hover:border-slate-600"}`,
                animate: {
                  scale: idx === activeRack ? 1.05 : 1
                },
                children: /* @__PURE__ */ jsx(Package, { className: `w-8 h-8 ${idx === activeRack ? "text-cyan-400" : "text-slate-500"}` })
              },
              idx
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
                /* @__PURE__ */ jsx("span", { className: "text-cyan-300", children: "Warehouse Capacity" }),
                /* @__PURE__ */ jsx("span", { className: "text-cyan-400 font-medium", children: "72% Utilized" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-3 bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  className: "h-full bg-gradient-to-r from-cyan-500 to-teal-400",
                  initial: { width: 0 },
                  animate: { width: "72%" },
                  transition: { duration: 1.5, ease: "easeOut" }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-700", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 text-green-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-300", children: "Armed" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Camera, { className: "w-4 h-4 text-green-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-300", children: "Recording" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-green-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-300", children: "24/7 Monitored" })
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 30 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.2 },
          className: "text-left order-1 lg:order-2",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-6", children: [
              /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-cyan-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-cyan-200", children: "Secure Vault" })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight", children: [
              "Your Inventory.",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300", children: "Fort Knox Protection." })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-xl text-cyan-100/80 mb-8 leading-relaxed", children: [
              "50,000+ sq ft of climate-controlled, 24/7 secured storage. Real-time inventory tracking, FIFO rotation, and same-day access.",
              /* @__PURE__ */ jsx("span", { className: "text-cyan-300 font-medium", children: " From single pallets to dedicated warehouse bays." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700", children: [
                /* @__PURE__ */ jsx(Warehouse, { className: "w-5 h-5 text-cyan-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-white", children: "50,000+ Sq Ft" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700", children: [
                /* @__PURE__ */ jsx(Thermometer, { className: "w-5 h-5 text-cyan-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-white", children: "Climate Controlled" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700", children: [
                /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-cyan-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-white", children: "24/7 Security" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700", children: [
                /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-cyan-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-white", children: "Insured Storage" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "lg",
                  onClick: () => navigate("/contact"),
                  className: "bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-6 text-lg",
                  children: "Reserve Space Now"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "lg",
                  variant: "outline",
                  onClick: () => navigate("/pricing"),
                  className: "border-2 border-cyan-400/50 bg-cyan-500/10 text-white hover:bg-cyan-500/20 px-8 py-6 text-lg",
                  children: "View Pricing"
                }
              )
            ] })
          ]
        }
      )
    ] }) })
  ] });
};
const StorageContent = () => {
  const metrics = [
    { icon: Warehouse, value: 5e4, suffix: "+", label: "Sq Ft Facility" },
    { icon: Thermometer, value: 72, suffix: "°F", label: "Climate Controlled" },
    { icon: BarChart3, value: 75, suffix: "%", label: "Capacity Available" }
  ];
  const security = ["24/7 CCTV Surveillance", "Restricted Access Controls", "Insurance Coverage Included", "Regular Security Audits", "Fire Suppression Systems", "Backup Power Generation"];
  const features = ["Climate-controlled environment (72°F)", "FIFO/FEFO inventory rotation", "Lot and batch tracking", "Cycle count program", "Photo documentation", "Real-time inventory access", "Forklift and pallet jack access", "Same-day inventory access", "Hazmat storage certified", "Flexible month-to-month terms"];
  const faqs = [
    { q: "What storage options do you offer?", a: "We offer pallet storage (per pallet/month), bin storage (per cubic foot), and dedicated space for larger clients. All options include climate control and 24/7 security." },
    { q: "How is pricing calculated?", a: "Storage is priced per pallet per month or per cubic foot for bin storage. No long-term commitments required. Volume discounts available for larger accounts." },
    { q: "What security measures protect my inventory?", a: "24/7 video surveillance, restricted access controls, insurance coverage, regular security audits, fire suppression, and backup power all protect your goods." },
    { q: "Is the facility climate controlled?", a: "Yes, we maintain 72°F year-round. Humidity is also controlled to protect sensitive products. Ideal for cosmetics, supplements, and electronics." },
    { q: "Can I access my inventory same-day?", a: "Yes. Request access through your dashboard or contact us directly. We accommodate same-day pickup requests during business hours." },
    { q: "Do you offer hazmat storage?", a: "Yes, we're certified for certain hazmat categories. Contact us with your product details and we'll confirm if we can accommodate your specific requirements." },
    { q: "What's included in storage fees?", a: "Storage fees include shelving/racking, climate control, security, insurance, and dashboard access. Receiving, prep services, and shipping are billed separately." }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto", children: metrics.map((m, idx) => /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: idx * 0.1 }, children: /* @__PURE__ */ jsxs(Card, { className: "text-center p-8 border-2 border-cyan-100 hover:shadow-xl transition-all", children: [
      /* @__PURE__ */ jsx(m.icon, { className: "w-12 h-12 mx-auto mb-4 text-cyan-600" }),
      /* @__PURE__ */ jsx("p", { className: "text-4xl font-bold text-cyan-600 mb-1", children: /* @__PURE__ */ jsx(MetricCounter, { value: m.value, suffix: m.suffix }) }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: m.label })
    ] }) }, idx)) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Security Infrastructure" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Your inventory is protected by enterprise-grade security. Peace of mind included." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto", children: security.map((item, idx) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { delay: idx * 0.05 }, className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-cyan-500 flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: item })
      ] }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Warehouse Features" }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: [
          "Everything you need for professional inventory storage. Pairs perfectly with our ",
          /* @__PURE__ */ jsx(Link, { to: "/receiving-inspection", className: "text-cyan-600 hover:underline", children: "receiving" }),
          " and ",
          /* @__PURE__ */ jsx(Link, { to: "/order-fulfillment", className: "text-cyan-600 hover:underline", children: "fulfillment" }),
          " services."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3", children: features.map((f, idx) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: -10 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { delay: idx * 0.03 }, className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-cyan-500 flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: f })
      ] }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "text-center mb-12", children: /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Frequently Asked Questions" }) }),
      /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto space-y-4", children: faqs.map((faq, idx) => /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: idx * 0.03 }, children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-2 text-cyan-900", children: faq.q }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: faq.a })
      ] }) }) }, idx)) }),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-8", children: /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
        "More questions? ",
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-cyan-600 hover:underline font-medium", children: "Contact us" })
      ] }) })
    ] }) })
  ] });
};
const StorageCTA = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-900 text-white", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "max-w-4xl mx-auto text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(Warehouse, { className: "w-10 h-10 text-cyan-300" }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: "Need Secure Storage?" }),
    /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-cyan-100/80 mb-8 max-w-2xl mx-auto", children: "Get a custom storage quote tailored to your inventory needs. Flexible terms, no long-term commitments, and pricing that scales with your business." }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxs(Button, { size: "lg", onClick: () => navigate("/contact"), className: "bg-white text-cyan-900 hover:bg-cyan-100 px-8 py-6 text-lg font-semibold group shadow-lg", children: [
        "Get a Quote",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })
      ] }),
      /* @__PURE__ */ jsx(Button, { size: "lg", variant: "outline", onClick: () => navigate("/pricing"), className: "border-2 border-white/50 bg-white/15 text-white hover:bg-white/25 px-8 py-6 text-lg font-semibold backdrop-blur-sm", children: "View Pricing" })
    ] })
  ] }) }) });
};
const StorageWarehousing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const serviceData = {
    serviceType: "WarehouseService",
    name: "3PL Warehouse Storage & Prep Center Services",
    description: "Secure 3PL warehouse storage in Los Angeles. Climate-controlled prep center with pallet storage, lot control, and cycle counts for e-commerce inventory management.",
    features: ["Secure Racking", "Pallet Storage", "Lot Control", "Cycle Counts", "3PL Services"]
  };
  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of storage options do you offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer pallet storage, bin storage, and custom shelving solutions in a climate-controlled, 24/7 monitored facility."
        }
      },
      {
        "@type": "Question",
        name: "How is storage pricing calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Storage is priced per pallet per month or per cubic foot for bin storage with flexible terms and no long-term commitments."
        }
      },
      {
        "@type": "Question",
        name: "What security measures protect my inventory?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "24/7 video surveillance, restricted access controls, insurance coverage, and regular security audits protect your inventory."
        }
      },
      {
        "@type": "Question",
        name: "Is the facility climate controlled?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our facility maintains 72°F with humidity control year-round. Temperature logs are available for compliance needs."
        }
      },
      {
        "@type": "Question",
        name: "Can I access my inventory same-day?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Schedule a pickup or inspection visit through your dashboard. Same-day access is available during business hours."
        }
      },
      {
        "@type": "Question",
        name: "Do you offer hazmat storage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We can store certain hazmat categories with proper documentation. Contact us to verify your product classification."
        }
      },
      {
        "@type": "Question",
        name: "What's included in storage fees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Storage includes 24/7 security, climate control, insurance, inventory tracking, and access to your dashboard. Receiving and outbound are billed separately."
        }
      }
    ]
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Warehousing and Fulfillment Services for Ecommerce USA" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Warehouse in the USA for ecommerce offering storage and fulfillment solutions. Simplify inventory management and shipping with our reliable services. Start today!"
        }
      ),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "keywords",
          content: "3pl los angeles, los angeles 3pl, prep center, warehouse storage, pallet storage, climate controlled warehouse, ecommerce fulfillment"
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/storage-warehousing" })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "service", data: serviceData }),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqSchemaData }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Storage & Warehousing", path: "/storage-warehousing" }] }),
      /* @__PURE__ */ jsx(StorageHero, {}),
      /* @__PURE__ */ jsx(StorageContent, {}),
      /* @__PURE__ */ jsx(StorageCTA, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  StorageWarehousing as default
};
