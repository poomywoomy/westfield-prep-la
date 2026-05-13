import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { T as TranslatedText, B as Button, A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent, S as StructuredData, H as Header, F as Footer } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { T as TrustStrip, S as StickyCTA } from "./StickyCTA-DPOcmQvz.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { Clock, Shield, MapPin, Tag, CheckCircle, Zap, DollarSign, Headphones, Package, Box, Truck, Camera, ClipboardCheck, TrendingUp, BarChart3 } from "lucide-react";
import { u as useIntersectionObserver } from "./use-intersection-observer-0IkYX39w.js";
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
const AmazonChannelHero = () => {
  const featureCards = [
    { icon: Tag, title: "FNSKU Labeling", desc: "100% compliant labels" },
    { icon: Clock, title: "24hr Turnaround", desc: "Fast prep processing" },
    { icon: CheckCircle, title: "99.7% Accuracy", desc: "Quality guaranteed" }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "relative w-full overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/50 to-white", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03]", style: { backgroundImage: `repeating-linear-gradient(45deg, #f97316 0px, #f97316 1px, transparent 1px, transparent 20px)` } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-[500px] h-[400px] bg-gradient-radial from-orange-200/30 via-amber-100/20 to-transparent rounded-full blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-radial from-amber-200/20 to-transparent rounded-full blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 container mx-auto px-4 pt-12 pb-16 lg:pt-16 lg:pb-20", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 text-center lg:text-left", children: [
        /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "mb-6", children: /* @__PURE__ */ jsxs(Badge, { className: "bg-orange-500 text-white border-orange-600 px-5 py-2 text-sm font-semibold shadow-lg shadow-orange-500/20", children: [
          /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2 mr-2", children: [
            /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" }),
            /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-white" })
          ] }),
          /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon FBA Certified Partner" })
        ] }) }),
        /* @__PURE__ */ jsxs(motion.h1, { className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, children: [
          /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon FBA Prep" }) }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-slate-900", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Done Right in LA" }) })
        ] }),
        /* @__PURE__ */ jsxs(motion.p, { className: "text-lg md:text-xl text-slate-600 mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "Expert prep, labeling, and fulfillment services that keep your Amazon account compliant and your inventory moving. Trusted by" }),
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/why-choose-us", className: "text-orange-600 hover:text-orange-700 underline underline-offset-2 font-medium transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "500+ sellers" }) }),
          " ",
          /* @__PURE__ */ jsx(TranslatedText, { children: "shipping millions of units annually." })
        ] }),
        /* @__PURE__ */ jsx(motion.div, { className: "flex flex-wrap justify-center lg:justify-start gap-3 mb-8", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.3 }, children: [{ icon: Clock, text: "Same-Day Receiving" }, { icon: Shield, text: "Full Compliance" }, { icon: MapPin, text: "LA Port Access" }].map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-orange-100/80 backdrop-blur-sm rounded-full border border-orange-200/50", children: [
          /* @__PURE__ */ jsx(item.icon, { className: "w-4 h-4 text-orange-600" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-orange-800", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.text }) })
        ] }, index)) }),
        /* @__PURE__ */ jsxs(motion.div, { className: "flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.4 }, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center lg:justify-start", children: [
            /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "px-8 py-6 text-base font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/25 hover:scale-105 transition-all duration-300", children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get a Free Quote" }) }) }),
            /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "lg", className: "px-8 py-6 text-base font-bold border-2 border-orange-400 text-orange-700 hover:bg-orange-50", children: /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(TranslatedText, { children: "View Pricing" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 lg:gap-8 justify-center lg:justify-start lg:border-l lg:border-slate-200 lg:pl-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center lg:text-left", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-bold text-orange-600", children: "1M+" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Units Processed" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center lg:text-left", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-bold text-orange-600", children: "24hr" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Turnaround" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center lg:text-left", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-bold text-orange-600", children: "500+" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: /* @__PURE__ */ jsx(TranslatedText, { children: "FBA Shipments/Mo" }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 hidden lg:flex flex-col gap-4", children: featureCards.map((card, index) => /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, delay: 0.3 + index * 0.1 }, whileHover: { scale: 1.02, x: -5 }, className: "bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-orange-100 hover:border-orange-300 transition-all duration-300 cursor-default", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20", children: /* @__PURE__ */ jsx(card.icon, { className: "w-6 h-6 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: /* @__PURE__ */ jsx(TranslatedText, { children: card.title }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: /* @__PURE__ */ jsx(TranslatedText, { children: card.desc }) })
        ] })
      ] }) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" })
  ] });
};
const values = [
  { icon: Shield, title: "Error-Free FBA Prep", description: "Our rigorous QC process catches issues before they become Amazon chargebacks. Every unit is inspected, labeled correctly, and packaged to Amazon's exact specifications." },
  { icon: Zap, title: "Fast Turnaround", description: "Most shipments are prepped and ready within 24-48 hours of receiving. When you need speed, we deliver—keeping your inventory flowing to Amazon fulfillment centers." },
  { icon: DollarSign, title: "Transparent Pricing", description: "No hidden fees or surprise charges. Our per-unit pricing is clear and predictable, so you can accurately calculate your margins and scale with confidence." },
  { icon: Headphones, title: "Dedicated Support", description: "Get a dedicated account manager who knows your products and business. Real humans answering your questions, not chatbots or ticket queues." }
];
const AmazonChannelValueGrid = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-background to-orange-50/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(motion.div, { ref, initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Why Amazon Sellers" }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Trust Us" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We've built our entire operation around Amazon seller success. Every process, every check, every shipment is designed to protect your account and maximize your profits." }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: values.map((value, index) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5, delay: index * 0.1 }, className: "group relative p-6 bg-card rounded-xl border border-border hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 group-hover:from-orange-200 group-hover:to-amber-200 transition-colors duration-300", children: /* @__PURE__ */ jsx(value.icon, { className: "w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform duration-300" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2 text-foreground group-hover:text-orange-600 transition-colors duration-300", children: /* @__PURE__ */ jsx(TranslatedText, { children: value.title }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: value.description }) })
    ] }, index)) })
  ] }) });
};
const services = [
  { icon: Tag, title: "FNSKU Labeling", description: "Every product gets the correct FNSKU barcode applied precisely where Amazon requires. We handle label printing, application, and verification to prevent commingling and ensure accurate tracking.", link: "/labeling-compliance" },
  { icon: Package, title: "Polybagging & Prep", description: "Transparent polybags with suffocation warnings, applied per Amazon's prep requirements. We match bag sizes to your products for a professional presentation that meets FBA standards.", link: "/amazon-fba-prep" },
  { icon: Shield, title: "Bubble Wrap Protection", description: "Fragile items get proper protection with bubble wrap, foam, or other cushioning materials. We follow Amazon's fragile handling guidelines to minimize damage during transit.", link: "/amazon-fba-prep" },
  { icon: Box, title: "Carton & Box Prep", description: "Proper carton packing with correct box labels, weight limits, and mixed-SKU organization. Every box meets Amazon's inbound shipment requirements to avoid delays at the FC.", link: "/amazon-fba-prep" },
  { icon: Truck, title: "Pallet Forwarding", description: "For larger shipments, we build pallets to Amazon's LTL/FTL specifications. Proper stacking, shrink-wrapping, and labeling ensure smooth receiving at the fulfillment center.", link: "/storage-warehousing" },
  { icon: Camera, title: "Photo-Proof QC", description: "Every shipment is photographed before it leaves our facility. You get visual documentation of your inventory's condition, packaging quality, and label placement.", link: "/receiving-inspection" }
];
const AmazonChannelServices = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(motion.div, { ref, initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Complete" }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "FBA Prep Services" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "From receiving to shipping, we handle every step of the prep process. Your products arrive at Amazon ready to sell, with zero compliance issues." }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: services.map((service, index) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5, delay: index * 0.1 }, className: "group relative p-6 bg-card rounded-xl border border-border hover:border-orange-300 hover:shadow-xl transition-all duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 group-hover:from-orange-600 group-hover:to-amber-600 transition-colors duration-300 shadow-lg", children: /* @__PURE__ */ jsx(service.icon, { className: "w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-3 text-foreground group-hover:text-orange-600 transition-colors duration-300", children: /* @__PURE__ */ jsx(TranslatedText, { children: service.title }) }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: service.description }) }),
      /* @__PURE__ */ jsxs(Link, { to: service.link, className: "text-sm font-medium text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 group/link", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Learn more" }),
        /* @__PURE__ */ jsx("span", { className: "group-hover/link:translate-x-1 transition-transform duration-200", children: "→" })
      ] })
    ] }, index)) })
  ] }) });
};
const metrics = [
  { value: 1e6, suffix: "+", label: "Units Processed", prefix: "" },
  { value: 24, suffix: "hr", label: "Avg Receiving Time", prefix: "<" },
  { value: 99.7, suffix: "%", label: "Accuracy Rate", prefix: "" },
  { value: 99.2, suffix: "%", label: "Same-Day Prep", prefix: "" },
  { value: 500, suffix: "+", label: "FBA Shipments/Mo", prefix: "" },
  { value: 0, suffix: "%", label: "Chargeback Rate", prefix: "" }
];
const AmazonChannelMetrics = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsxs("section", { className: "relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(motion.div, { className: "absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-10", animate: { scale: [1, 1.2, 1], x: [0, -30, 0] }, transition: { duration: 10, repeat: Infinity, ease: "easeInOut" } }),
      /* @__PURE__ */ jsx(motion.div, { className: "absolute bottom-0 left-0 w-80 h-80 bg-amber-500 rounded-full blur-3xl opacity-10", animate: { scale: [1, 1.3, 1], y: [0, -40, 0] }, transition: { duration: 8, repeat: Infinity, ease: "easeInOut" } })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 relative z-10", children: [
      /* @__PURE__ */ jsxs(motion.div, { ref, initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5 }, className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4 text-white", children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "The Numbers" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Speak for Themselves" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-white/70 max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We've helped hundreds of Amazon sellers scale their FBA business with reliable, compliant prep services that protect their accounts." }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children: metrics.map((metric, index) => /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5, delay: index * 0.1 }, className: "relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-2xl md:text-3xl font-bold text-white mb-1", children: [
          metric.prefix,
          isVisible ? /* @__PURE__ */ jsx(MetricCounter, { value: metric.value, duration: 2e3, suffix: metric.suffix }) : `0${metric.suffix}`
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-white/60", children: /* @__PURE__ */ jsx(TranslatedText, { children: metric.label }) })
      ] }) }, index)) })
    ] })
  ] });
};
const steps = [
  { icon: Package, title: "Receive Your Inventory", description: "Ship your products to our LA warehouse. We receive and check in every unit within 24 hours, comparing counts against your ASN and flagging any discrepancies immediately." },
  { icon: ClipboardCheck, title: "Inspect & Prep", description: "Our team inspects each item for damage or defects. Products are sorted, organized, and prepared according to Amazon's category-specific requirements." },
  { icon: Tag, title: "Label & Package", description: "FNSKU labels are printed and applied with precision. Polybagging, bubble wrap, and any special prep is completed per your instructions and Amazon's guidelines." },
  { icon: Camera, title: "QC & Documentation", description: "Every shipment is photographed and documented before leaving. You get visual proof of quality, label placement, and packaging for your records." },
  { icon: Truck, title: "Ship to Amazon", description: "We create your shipment plan, generate box labels, and coordinate pickup. Your inventory arrives at Amazon FCs ready to be stowed and sold." }
];
const AmazonChannelTimeline = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-orange-50/50 to-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(motion.div, { ref, initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5 }, className: "text-center mb-16", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "The" }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "FBA Prep Process" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "From receiving to shipping, here's exactly how we handle your inventory. A transparent, repeatable process you can count on." }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-400 to-amber-400 transform md:-translate-x-1/2" }),
      steps.map((step, index) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: index % 2 === 0 ? -50 : 50 }, animate: isVisible ? { opacity: 1, x: 0 } : {}, transition: { duration: 0.5, delay: index * 0.15 }, className: `relative flex items-start gap-6 mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`, children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg border-4 border-background", children: /* @__PURE__ */ jsx(step.icon, { className: "w-7 h-7 text-white" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: `ml-28 md:ml-0 md:w-5/12 p-6 bg-card rounded-xl border border-border hover:border-orange-200 hover:shadow-lg transition-all duration-300 ${index % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-orange-500", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Step" }),
            " ",
            index + 1
          ] }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-2 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: step.title }) }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: step.description }) })
        ] })
      ] }, index))
    ] }) })
  ] }) });
};
const AmazonChannelCaseStudy = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.2 });
  const isVisible = !!entry?.isIntersecting;
  const caseMetrics = [
    { icon: TrendingUp, value: "6x", label: "Volume Growth", detail: "8K → 50K units/mo" },
    { icon: Clock, value: "40+", label: "Hours Saved Weekly", detail: "Fully outsourced prep" },
    { icon: Package, value: "99.8%", label: "Prep Accuracy", detail: "Near-zero errors" },
    { icon: DollarSign, value: "600+", label: "IPI Score", detail: "Account health restored" }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs(motion.div, { ref, initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5 }, className: "max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Real" }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Seller Success" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "See how we helped an Amazon seller transform their FBA operations." }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-amber-200 rounded-full blur-3xl opacity-30" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-8 md:gap-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:w-1/2", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Home & Kitchen Seller" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-4 text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "From Garage Operations to 50K Units/Month" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "The Challenge:" }) }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "This seller was prepping FBA shipments in their garage, spending 40+ hours weekly on labeling and packaging. Frequent compliance issues led to IPI score drops and stranded inventory." })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Our Solution:" }) }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "We took over all prep operations, implementing strict QC protocols and same-day receiving. Photo documentation gave them visibility without the hands-on work." })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "The Result:" }) }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "In 6 months, they scaled from 8,000 to 50,000 units monthly while reducing prep errors to near-zero. Their IPI score recovered to 600+, and they reclaimed 40+ hours per week to focus on sourcing and growth." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md:w-1/2", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: caseMetrics.map((metric, index) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: isVisible ? { opacity: 1, scale: 1 } : {}, transition: { duration: 0.5, delay: 0.3 + index * 0.1 }, className: "p-4 bg-white rounded-xl border border-orange-100 shadow-sm", children: [
            /* @__PURE__ */ jsx(metric.icon, { className: "w-8 h-8 text-orange-500 mb-2" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground", children: metric.value }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: metric.label }) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: metric.detail }) })
          ] }, index)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-8 border-t border-orange-200 flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600", children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Start Your Success Story" }) }) }),
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "border-orange-300 hover:bg-orange-50", children: /* @__PURE__ */ jsx(Link, { to: "/why-choose-us", children: /* @__PURE__ */ jsx(TranslatedText, { children: "See More Results" }) }) })
        ] })
      ] })
    ] })
  ] }) }) });
};
const faqs$1 = [
  { question: "What Amazon FBA prep services do you offer?", answer: "We provide comprehensive FBA prep services including FNSKU labeling, polybagging with suffocation warnings, bubble wrap protection for fragile items, carton prep and box labeling, pallet building for LTL/FTL shipments, product photography and QC documentation, and inventory receiving with same-day check-in. Every service follows Amazon's latest prep requirements to ensure your shipments are accepted without issues." },
  { question: "How quickly can you turn around my FBA shipments?", answer: "Most FBA shipments are prepped and ready within 24-48 hours of receiving your inventory. We offer same-day receiving, meaning your products are checked in and counted the same day they arrive. For rush orders or high-volume shipments, we can often accommodate expedited timelines—just let us know your deadline when you create your ASN." },
  { question: "What are your FBA prep pricing and fees?", answer: "Our FBA prep pricing is transparent and per-unit based. Standard prep (labeling + polybagging) starts at competitive rates, with additional services like bubble wrap, bundling, or special handling priced separately. We provide detailed quotes based on your specific products and volume. No hidden fees—what you see is what you pay. Contact us for a custom quote tailored to your catalog." },
  { question: "How do you handle FBA compliance and avoid chargebacks?", answer: "We stay current with Amazon's ever-changing prep requirements and update our SOPs accordingly. Every unit goes through a multi-point QC check before shipping. We photograph shipments for documentation, verify FNSKU accuracy, and ensure packaging meets category-specific guidelines. This rigorous process has kept our chargeback rate at effectively 0% across all client shipments." },
  { question: "Can you handle oversized and heavy/bulky FBA items?", answer: "Absolutely. We have the equipment and space to handle oversized and heavy/bulky items that require special prep. This includes proper palletizing, shrink-wrapping, and labeling for Amazon's non-standard size tiers. We're experienced with furniture, fitness equipment, home goods, and other large products that many prep centers can't accommodate." }
];
const AmazonChannelFAQ = () => {
  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });
  const isVisible = !!entry?.isIntersecting;
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-background to-orange-50/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(motion.div, { ref, initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: [
        /* @__PURE__ */ jsx(TranslatedText, { children: "Frequently Asked" }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Questions" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get answers to common questions about our Amazon FBA prep services." }) })
    ] }),
    /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: isVisible ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5, delay: 0.2 }, className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "space-y-4", children: faqs$1.map((faq, index) => /* @__PURE__ */ jsxs(AccordionItem, { value: `item-${index}`, className: "border border-border rounded-xl px-6 bg-card hover:border-orange-200 transition-colors duration-200 data-[state=open]:border-orange-300 data-[state=open]:shadow-md", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left font-semibold hover:text-orange-600 hover:no-underline py-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: faq.question }) }),
      /* @__PURE__ */ jsx(AccordionContent, { className: "text-muted-foreground pb-4 leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: faq.answer }) })
    ] }, index)) }) })
  ] }) });
};
const faqs = [
  {
    question: "What Amazon FBA prep services do you offer?",
    answer: "We provide comprehensive FBA prep services including FNSKU labeling, polybagging, bubble wrap, carton prep, pallet building, and QC documentation."
  },
  {
    question: "How quickly can you turn around my FBA shipments?",
    answer: "Most shipments are prepped within 24-48 hours of receiving. We offer same-day receiving and expedited options for rush orders."
  },
  {
    question: "What are your FBA prep pricing and fees?",
    answer: "Our pricing is transparent and per-unit based. Contact us for a custom quote tailored to your catalog and volume."
  }
];
const Amazon = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Amazon FBA Prep Center Los Angeles | Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Professional Amazon FBA prep center in Los Angeles offering labeling,\npackaging, and compliant services with fast turnaround for sellers. Get started today."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/sales-channels/amazon" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Amazon FBA Prep Center Los Angeles | Westfield 3PL" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          property: "og:description",
          content: "Expert FBA prep with 24hr turnaround, 99.7% accuracy, and full Amazon compliance. Trusted by 500+ sellers."
        }
      ),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/sales-channels/amazon" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" })
    ] }),
    /* @__PURE__ */ jsx(
      StructuredData,
      {
        type: "service",
        data: {
          name: "Amazon FBA Prep Services",
          description: "Professional Amazon FBA prep and fulfillment services including FNSKU labeling, poly bagging, bundling, and compliant shipment building in Los Angeles."
        }
      }
    ),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: { faqs } }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { label: "Sales Channels", path: "/sales-channels" },
            { label: "Amazon FBA", path: "/sales-channels/amazon" }
          ]
        }
      ),
      /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(AmazonChannelHero, {}),
        /* @__PURE__ */ jsx(TrustStrip, {}),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-6 text-center", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Why Amazon Sellers Choose a" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Dedicated 3PL" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon's marketplace is one of the most competitive sales channels in the world. Winning Buy Box placement, fast delivery windows, and flawless inventory management can make the difference between plateauing and scaling 10x. But managing FBA prep in-house comes with significant challenges that drain your time and resources." }) }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6 mb-8", children: [
            "Constantly changing FBA prep requirements",
            "FNSKU labeling standards and compliance",
            "Storage restrictions and rising fees",
            "Shipment creation and routing complexity",
            "IPI score management",
            "Stranded inventory prevention"
          ].map((item, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100",
              children: [
                /* @__PURE__ */ jsx(Shield, { className: "h-5 w-5 text-orange-500 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: item }) })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-center", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "For many brands, trying to juggle these tasks in-house leads to errors, delays, and lost buy-boxes. That's where a specialized" }),
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/amazon-fba-prep", className: "text-orange-600 hover:underline font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon Prep Center" }) }),
            " ",
            /* @__PURE__ */ jsx(TranslatedText, { children: "becomes essential for sustainable growth." })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-orange-50/50 to-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-6 text-center", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "What Is" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon FBA Prep?" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8 text-center", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon FBA prep refers to the services required to get your inventory ready to be accepted into an Amazon Fulfillment Network (FBA) distribution center. Every product category has specific requirements, and failing to meet them results in rejected shipments, chargebacks, and potential account suspensions." }) }),
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8", children: [
            "FNSKU barcode labeling",
            "Polybagging with suffocation warnings",
            "Bubble wrap for fragile items",
            "Bundling and kit creation",
            "Box reinforcement and prep",
            "Compliance with category guides"
          ].map((item, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-orange-200 transition-colors",
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-orange-500 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: item }) })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs("p", { className: "text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Our team stays current with Amazon's ever-evolving prep guidelines across all product categories. Learn more about our" }),
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/labeling-compliance", className: "text-orange-600 hover:underline font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: "labeling and compliance services" }) }),
            "."
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(AmazonChannelValueGrid, {}),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-12 text-center", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "How Westfield Helps You" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Win on Amazon" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-8 bg-card rounded-2xl border border-border hover:border-orange-200 hover:shadow-lg transition-all duration-300", children: [
              /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(Shield, { className: "h-7 w-7 text-orange-600" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Error-Free FBA Prep & Compliance" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon is constantly updating its requirements, and one misprinted label or missing prep instruction can trigger chargebacks. Our team stays current with all FBA inbound shipment requirements, unique prep instructions per category, and ASIN-specific compliance rules. We validate every unit before it ships." }) }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-orange-600", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Result: Near-zero chargeback rate across all client shipments." }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-8 bg-card rounded-2xl border border-border hover:border-orange-200 hover:shadow-lg transition-all duration-300", children: [
              /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(Zap, { className: "h-7 w-7 text-orange-600" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Fast Turnaround + Same-Day Receiving" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Speed matters on Amazon. Our warehouse processes inbound pallets and cartons quickly with 24-hour receiving turn times (often faster), real-time inventory syncing to your Seller Central dashboard, and notifications as soon as inventory is available for shipment to FBA." }) }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-orange-600", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Result: Keep your Buy Box presence strong with faster inventory velocity." }) })
            ] })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(AmazonChannelServices, {}),
        /* @__PURE__ */ jsx(AmazonChannelMetrics, {}),
        /* @__PURE__ */ jsx(AmazonChannelTimeline, {}),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(BarChart3, { className: "h-8 w-8 text-orange-600" }) }) }),
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-6 text-center", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Real-Time Reporting &" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Inventory Sync" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8 text-center", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Your Amazon inventory is dynamic. We offer two-way API integration with Seller Central, live updates on received inventory, real-time photo proof and scan records, and automatic exception handling for damaged or mismatched SKUs. No more guessing stock on hand—we sync with your backend so Amazon supply never goes dark." }) }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              className: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600",
              children: /* @__PURE__ */ jsx(Link, { to: "/integrations", children: /* @__PURE__ */ jsx(TranslatedText, { children: "See Our Integrations" }) })
            }
          ) })
        ] }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-orange-50/50 to-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(DollarSign, { className: "h-8 w-8 text-orange-600" }) }) }),
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Cost-Efficiency" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Built for Growth" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8", children: /* @__PURE__ */ jsx(TranslatedText, { children: "With a specialized Amazon 3PL, you only pay for what you use. No overhead for labor or warehouse equipment, fewer chargebacks due to compliance errors, and reduced risk of stranded inventory eating into your margins." }) }),
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8", children: [
            "Pay only for services you use",
            "Zero equipment or labor overhead",
            "Fewer compliance chargebacks",
            "Reduced stranded inventory risk"
          ].map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-card rounded-lg border border-border", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-orange-500 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-left", children: /* @__PURE__ */ jsx(TranslatedText, { children: item }) })
          ] }, idx)) }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "All of this translates to better profit margins, fewer operational headaches, and freedom to sell more and worry less. Check our" }),
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/pricing", className: "text-orange-600 hover:underline font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: "transparent pricing" }) }),
            " ",
            /* @__PURE__ */ jsx(TranslatedText, { children: "for details." })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(AmazonChannelCaseStudy, {}),
        /* @__PURE__ */ jsx(AmazonChannelFAQ, {}),
        /* @__PURE__ */ jsx("section", { className: "py-24 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ready to Scale Your Amazon Business?" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-white/90 mb-8 max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Join 500+ Amazon sellers who trust Westfield for compliant, fast, and reliable FBA prep services." }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                asChild: true,
                size: "lg",
                className: "px-10 py-7 text-lg font-bold bg-white text-orange-600 hover:bg-white/90 shadow-lg",
                children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get Your Free Quote" }) })
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
  Amazon as default
};
