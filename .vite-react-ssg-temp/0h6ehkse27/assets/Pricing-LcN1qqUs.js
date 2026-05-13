import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, lazy, useMemo, Suspense } from "react";
import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, T as TranslatedText, g as DialogDescription, B as Button, t as trackEvent, s as supabase, u as useTranslation, S as StructuredData, H as Header, h as TooltipProvider, i as Tooltip, j as TooltipTrigger, k as TooltipContent, A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent, F as Footer } from "../main.mjs";
import { C as ContactForm } from "./ContactForm-BLq-5_OP.js";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { X, Calculator, Mail, ArrowRight, Package, Truck, CheckCircle, AlertTriangle, Check, DollarSign, Shield, Zap, Clock, Star, Sparkles, Calendar, Users, ShieldCheck, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { S as Skeleton } from "./skeleton-6MvOnm4j.js";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "./select-Cb0hy2VC.js";
import "@radix-ui/react-select";
import "./checkbox-B9ll9gww.js";
import "@radix-ui/react-checkbox";
import "zod";
import "./launchpadServices-DTpLXarh.js";
import "@radix-ui/react-label";
const ExitIntentModal = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [monthlyOrders, setMonthlyOrders] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
        trackEvent("exit_intent_shown", { trigger: "mouse_leave" });
      }
    };
    let lastScrollY = window.scrollY;
    let scrollUpCount = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY && currentScrollY < 100) {
        scrollUpCount++;
        if (scrollUpCount > 3 && !hasShown) {
          setOpen(true);
          setHasShown(true);
          sessionStorage.setItem("exitIntentShown", "true");
          trackEvent("exit_intent_shown", { trigger: "scroll_up" });
        }
      } else {
        scrollUpCount = 0;
      }
      lastScrollY = currentScrollY;
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShown]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("lead_magnet_downloads").insert({
        email,
        full_name: "",
        guide_type: "exit_intent_savings_estimate"
      });
      if (error) throw error;
      trackEvent("exit_intent_converted", {
        email_captured: true,
        monthly_orders: monthlyOrders || "not_provided"
      });
      toast.success("We'll send your custom estimate shortly!");
      setOpen(false);
      onClose?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[450px]", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleClose,
        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100",
        children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(DialogHeader, { className: "text-center pt-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Calculator, { className: "w-8 h-8 text-secondary" }) }),
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Wait! Want a Custom Savings Estimate?" }) }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-base mt-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get a personalized fulfillment cost analysis sent to your inbox." }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "exit-email", children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "Email Address" }),
          " *"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "exit-email",
              type: "email",
              placeholder: "you@company.com",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "pl-10",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "exit-orders", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Monthly Order Volume (optional)" }) }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "exit-orders",
            type: "text",
            placeholder: "e.g., 500-1000",
            value: monthlyOrders,
            onChange: (e) => setMonthlyOrders(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "submit",
          className: "w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground",
          disabled: isSubmitting,
          children: [
            isSubmitting ? /* @__PURE__ */ jsx(TranslatedText, { children: "Sending..." }) : /* @__PURE__ */ jsx(TranslatedText, { children: "Send My Estimate" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-4 h-4" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "No spam. Just your personalized savings breakdown." }) })
    ] })
  ] }) });
};
const EnhancedROICalculator = lazy(() => import("./EnhancedROICalculator-JqZ-Dakw.js"));
const shippingAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Box",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { i: { x: 0.5, y: 1 }, o: { x: 0.5, y: 0 }, t: 0, s: [100, 110, 0] },
            { i: { x: 0.5, y: 1 }, o: { x: 0.5, y: 0 }, t: 30, s: [100, 90, 0] },
            { t: 60, s: [100, 110, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [80, 60] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 8 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.976, 0.451, 0.086, 1] },
          o: { a: 0, k: 100 }
        }
      ]
    }
  ]
};
const Pricing = () => {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [savedCalculation, setSavedCalculation] = useState(null);
  const { tSync } = useTranslation();
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const serviceData = {
    serviceType: "Service",
    name: "3PL Fulfillment & Prep Center Services",
    description: "Custom 3PL pricing for receiving, FBA prep, DTC fulfillment, storage, and multi-channel integration. Transparent, volume-based rates in Los Angeles.",
    features: ["Receiving & Inspection", "FBA Prep & Labeling", "DTC Fulfillment", "Storage Solutions", "Returns Processing", "Photo Documentation", "Inventory Tracking", "Multi-Channel Support"]
  };
  const faqData = [
    {
      question: "What's included in Westfield 3PL pricing?",
      answer: "All-in pricing includes receiving, storage, labeling, pick & pack, and compliance for Amazon FBA, WFS, and DTC. Our transparent pricing means no hidden fees—what we quote is what you pay."
    },
    {
      question: "Do you support Shopify integrations?",
      answer: "Yes, we offer native Shopify integration for real-time inventory and order sync, with no additional charge. Orders sync automatically and ship same-day when received before 2 PM PST."
    },
    {
      question: "What are your Amazon FBA prep rates?",
      answer: "Our Amazon FBA prep services range from $1.00–$2.50 per unit depending on volume and complexity. This includes FNSKU labeling, polybagging, bubble wrap, and compliance with all Amazon requirements."
    },
    {
      question: "How does your DTC fulfillment pricing compare to big-box 3PLs?",
      answer: "Unlike big-box 3PLs with $3K+ minimums and tiered fees, we offer flexible pricing starting at $1.00/unit with no monthly minimums. You get dedicated support and 24-hour turnaround at a fraction of the cost."
    },
    {
      question: "Are there any setup fees or minimums?",
      answer: "No setup fees or long-term contracts required. We work with businesses of all sizes. While we don't have strict minimums, pricing is optimized for businesses shipping at least 100 units per month."
    },
    {
      question: "How does storage pricing work?",
      answer: "Storage is billed monthly based on space used (pallet or cubic feet). Rates vary by volume—higher volume clients receive preferred pricing. We also offer overflow and seasonal storage options."
    },
    {
      question: "Do you charge for receiving inventory?",
      answer: "Yes, we charge a per-carton or per-pallet fee for receiving and inspection. This includes check-in, inventory counting, photo documentation, and system updates. Exact rates depend on shipment size and frequency."
    },
    {
      question: "Can I get a custom quote for my business?",
      answer: "Absolutely! Every business is unique. Contact us with your monthly volume, services needed, and product details. We'll provide a detailed pricing breakdown within 24 hours with no commitment required."
    }
  ];
  const highlights = [
    { icon: Zap, titleKey: "24-Hour Turnaround", descKey: "Lightning-fast prep and fulfillment" },
    { icon: ShieldCheck, titleKey: "FBA Compliance", descKey: "Amazon/Walmart prep to spec" },
    { icon: BarChart3, titleKey: "Real-Time Inventory", descKey: "Full visibility into stock" },
    { icon: Users, titleKey: "Dedicated Support", descKey: "Hands-on fulfillment specialists" }
  ];
  const serviceCards = [
    { icon: Package, serviceKey: "Receiving", descKey: "Per carton or pallet inspection and check-in" },
    { icon: ShieldCheck, serviceKey: "FBA Prep", descKey: "FNSKU labeling, polybagging, bubble wrap, bundling" },
    { icon: Truck, serviceKey: "DTC Fulfillment", descKey: "Pick, pack, and ship direct to your customers" },
    { icon: BarChart3, serviceKey: "Storage", descKey: "Secure, climate-controlled warehouse space" },
    { icon: Clock, serviceKey: "Returns Processing", descKey: "Inspection, restocking, and customer updates" },
    { icon: Shield, serviceKey: "Photo Documentation", descKey: "Quality control and proof of service" },
    { icon: Check, serviceKey: "Inventory Tracking", descKey: "Real-time dashboard access to your stock" },
    { icon: Zap, serviceKey: "Multi-Channel Support", descKey: "Shopify, Amazon, TikTok Shop integration" }
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem("roiCalculatorData");
    if (saved) {
      try {
        setSavedCalculation(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved calculation");
      }
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const easeOut = [0, 0, 0.2, 1];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: easeOut
      }
    }
  };
  const SectionDivider = ({ icon: Icon }) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-6", children: Icon ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "h-px w-16 bg-gradient-to-r from-transparent to-muted-foreground/20" }),
    /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 text-muted-foreground/30" }),
    /* @__PURE__ */ jsx("div", { className: "h-px w-16 bg-gradient-to-l from-transparent to-muted-foreground/20" })
  ] }) : /* @__PURE__ */ jsx("div", { className: "h-px w-32 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent" }) });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "3PL Fulfillment Pricing | Shopify & Amazon Sellers | Westfield" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Transparent 3PL pricing for Shopify fulfillment, Amazon FBA & WFS prep, and DTC brands. Rates from $1.00–$2.50 per unit with a 24-hour turnaround. Calculate your ROI instantly."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/pricing" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: "Westfield Prep Center" }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "3PL pricing, Shopify fulfillment, Amazon FBA prep, DTC fulfillment, Los Angeles 3PL, fulfillment center pricing, pick and pack rates" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/pricing" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "3PL Fulfillment Pricing | Shopify & Amazon Sellers" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Transparent 3PL pricing for Shopify fulfillment & Amazon FBA prep. $1.00–$2.50/unit. 24-hour turnaround." }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://westfieldprepcenter.com/hero-warehouse-optimized.webp" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Westfield Prep Center" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@Westfield3PL" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "3PL Fulfillment Pricing | Shopify & Amazon Sellers" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Transparent 3PL pricing for Shopify fulfillment & Amazon FBA prep. $1.00–$2.50/unit. 24-hour turnaround." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://westfieldprepcenter.com/hero-warehouse-optimized.webp" })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "service", data: serviceData }),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqData }),
    /* @__PURE__ */ jsx(StructuredData, { type: "product" }),
    /* @__PURE__ */ jsx(StructuredData, { type: "breadcrumb", data: { items: [{ label: "Home", path: "/" }, { label: "3PL Pricing", path: "/pricing" }] } }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: showStickyCTA && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 },
        transition: { duration: prefersReducedMotion ? 0.1 : 0.3 },
        className: "fixed top-0 left-0 right-0 z-50 bg-[#0A66C2] shadow-lg py-3 hidden md:block",
        children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-white font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ready to save on fulfillment?" }) }),
            savedCalculation?.estimatedSavings && /* @__PURE__ */ jsxs(
              motion.span,
              {
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                className: "text-[#F97316] font-bold",
                children: [
                  "Save $",
                  savedCalculation.estimatedSavings.toLocaleString(),
                  "/mo"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold transition-transform hover:scale-105",
              asChild: true,
              children: /* @__PURE__ */ jsxs("a", { href: "https://calendly.com/westfieldprepcenter/30min", target: "_blank", rel: "noopener noreferrer", children: [
                /* @__PURE__ */ jsx(TranslatedText, { children: "Schedule a Call" }),
                " ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-4 h-4" })
              ] })
            }
          )
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", { children: [
        /* @__PURE__ */ jsx("section", { className: "py-4 bg-muted/30", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: "Home", path: "/" },
              { label: "Pricing", path: "/pricing" }
            ]
          }
        ) }) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "container py-16", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-[600px] w-full" }) }), children: /* @__PURE__ */ jsx(EnhancedROICalculator, { variant: "pricing" }) }),
        /* @__PURE__ */ jsxs(
          motion.section,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: prefersReducedMotion ? 0.1 : 0.6 },
            className: "py-20 md:py-24 relative overflow-hidden",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl" }),
                /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-[#0A66C2]/10 rounded-full blur-3xl" }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 flex items-center justify-center opacity-20 blur-sm pointer-events-none overflow-hidden",
                  role: "img",
                  "aria-label": tSync("3PL shipping and fulfillment animation for Shopify and Amazon sellers"),
                  children: /* @__PURE__ */ jsx(
                    Lottie,
                    {
                      animationData: shippingAnimationData,
                      loop: true,
                      className: "w-[400px] h-[400px]"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 text-center relative z-10", children: [
                /* @__PURE__ */ jsx(
                  motion.h1,
                  {
                    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0.1 : 0.5 },
                    className: "text-3xl md:text-5xl lg:text-6xl font-bold mb-6",
                    children: /* @__PURE__ */ jsx(TranslatedText, { children: "3PL Fulfillment Pricing for Shopify, Amazon & DTC Brands" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  motion.p,
                  {
                    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0.1 : 0.5 },
                    className: "text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4",
                    children: /* @__PURE__ */ jsx(TranslatedText, { children: "Real ROI, Real Savings" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  motion.p,
                  {
                    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: prefersReducedMotion ? 0 : 0.4, duration: prefersReducedMotion ? 0.1 : 0.5 },
                    className: "text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-12",
                    children: /* @__PURE__ */ jsx(TranslatedText, { children: "Every business is unique. Tell us your needs and we'll create a pricing model that scales with you. No hidden fees, no surprises—just transparent pricing tailored to your volume." })
                  }
                ),
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    variants: containerVariants,
                    initial: "hidden",
                    animate: "visible",
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto",
                    children: [
                      /* @__PURE__ */ jsxs(
                        motion.div,
                        {
                          variants: itemVariants,
                          whileHover: prefersReducedMotion ? {} : { scale: 1.03, y: -4 },
                          className: "bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-all",
                          children: [
                            /* @__PURE__ */ jsx("p", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-[#F97316]", children: savedCalculation?.monthlyUnits?.toLocaleString() || "2M+" }),
                            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-muted-foreground mt-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: savedCalculation?.monthlyUnits ? "Your Monthly Units" : "Units Processed" }) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        motion.div,
                        {
                          variants: itemVariants,
                          whileHover: prefersReducedMotion ? {} : { scale: 1.03, y: -4 },
                          className: "bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-all",
                          children: [
                            /* @__PURE__ */ jsxs("p", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-green-500", children: [
                              "$",
                              savedCalculation?.estimatedSavings?.toLocaleString() || "50K+"
                            ] }),
                            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-muted-foreground mt-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: savedCalculation?.estimatedSavings ? "Your Est. Savings" : "Client Savings" }) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        motion.div,
                        {
                          variants: itemVariants,
                          whileHover: prefersReducedMotion ? {} : { scale: 1.03, y: -4 },
                          className: "bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-all",
                          children: [
                            /* @__PURE__ */ jsx("p", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A66C2]", children: "24hr" }),
                            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-muted-foreground mt-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Avg. Turnaround" }) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        motion.div,
                        {
                          variants: itemVariants,
                          whileHover: prefersReducedMotion ? {} : { scale: 1.03, y: -4 },
                          className: "bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-all",
                          children: [
                            /* @__PURE__ */ jsx("p", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-[#F97316]", children: "99.8%" }),
                            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-muted-foreground mt-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Accuracy Rate" }) })
                          ]
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx("section", { className: "py-16 md:py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx(
          motion.div,
          {
            variants: containerVariants,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, margin: "-100px" },
            className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto",
            children: highlights.map((item, index) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                variants: itemVariants,
                whileHover: prefersReducedMotion ? {} : { scale: 1.03, y: -6 },
                className: "bg-card rounded-2xl p-5 md:p-6 text-center shadow-lg border hover:shadow-xl hover:border-[#F97316]/30 transition-all cursor-pointer group",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-xl bg-[#F97316]/10 flex items-center justify-center group-hover:bg-[#F97316]/20 transition-colors", children: /* @__PURE__ */ jsx(item.icon, { className: "w-6 h-6 md:w-7 md:h-7 text-[#F97316] group-hover:scale-110 transition-transform" }) }),
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm md:text-base mb-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.titleKey }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.descKey }) })
                ]
              },
              index
            ))
          }
        ) }) }),
        /* @__PURE__ */ jsx(SectionDivider, { icon: Package }),
        /* @__PURE__ */ jsx("section", { className: "py-16 md:py-24 relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-6xl relative z-10", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "text-center mb-10 md:mb-14",
              children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "3PL Fulfillment Comparison: In-House vs Big Box vs Westfield" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "See how our boutique 3PL stacks up against doing it yourself or using a large fulfillment provider" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { delay: 0.1 },
              className: "bg-card rounded-2xl shadow-lg border overflow-hidden",
              children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[700px]", children: [
                /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-muted/50 border-b border-border", children: [
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-4 md:px-6 md:py-5 text-left font-semibold text-sm uppercase tracking-wide text-muted-foreground w-[200px]", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Feature" }) }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-4 md:px-6 md:py-5 text-center font-semibold text-sm uppercase tracking-wide", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                    /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "In-House" }) })
                  ] }) }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-4 md:px-6 md:py-5 text-center font-semibold text-sm uppercase tracking-wide", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-muted-foreground", children: [
                    /* @__PURE__ */ jsx(Truck, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Big Box 3PLs" }) })
                  ] }) }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-4 md:px-6 md:py-5 text-center font-semibold text-sm uppercase tracking-wide bg-green-50/50 dark:bg-green-900/10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsx("span", { children: "Westfield ★" })
                  ] }) })
                ] }) }),
                /* @__PURE__ */ jsxs("tbody", { children: [
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "FBA & WFS Pricing" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400 cursor-help", children: [
                        /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-sm underline decoration-dotted underline-offset-2", children: [
                          "$2.75–$4.50/",
                          /* @__PURE__ */ jsx(TranslatedText, { children: "unit" })
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Supplies + Labor + Error" }) }) })
                    ] }) }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
                        "$2.50–$3.50/",
                        /* @__PURE__ */ jsx(TranslatedText, { children: "unit" })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold", children: [
                        "$1.00–$2.00/",
                        /* @__PURE__ */ jsx(TranslatedText, { children: "unit" })
                      ] })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "DTC Fulfillment Pricing" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400 cursor-help", children: [
                        /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-sm underline decoration-dotted underline-offset-2", children: [
                          "$1.50–$3.00/",
                          /* @__PURE__ */ jsx(TranslatedText, { children: "unit" })
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Supplies + Labor + Error" }) }) })
                    ] }) }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Variable" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold", children: [
                        "$1.00–$2.50/",
                        /* @__PURE__ */ jsx(TranslatedText, { children: "unit" })
                      ] })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Turnaround Time" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                      /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "2–5 days" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "48–72 hours" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "24 hours" }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Real-Time Inventory Visibility" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                      /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "No" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Limited" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Yes" }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: "Amazon / Walmart / Shopify / WFS" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                      /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "None" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Partial" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "All Supported" }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Dedicated Human Support" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                      /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "No" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Tiered" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Yes" }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Compliance (FBA/WFS)" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                      /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Risk" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "FBA Only" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Both" }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Order Integrations" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                      /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Manual" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Yes" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Yes" }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Hybrid DTC + Marketplace" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Limited" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Limited" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Built-in" }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Monthly Minimums" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2 text-muted-foreground", children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "N/A" }) }) }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                      /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: "$3K+" })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Low/None" }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Liability Exposure" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                      /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "High" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Low" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Low" }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/20 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 font-medium text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Operational Complexity" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600 dark:text-red-400", children: [
                      /* @__PURE__ */ jsx(X, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "High" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Medium" }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 md:px-6 md:py-4 text-center bg-green-50/30 dark:bg-green-900/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600 dark:text-green-400", children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Low" }) })
                    ] }) })
                  ] })
                ] })
              ] }) })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(SectionDivider, {}),
        /* @__PURE__ */ jsx("section", { className: "py-16 md:py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: prefersReducedMotion ? 0.1 : 0.5 },
              className: "text-center mb-12 md:mb-16",
              children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "How We Determine Your Pricing" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We believe in transparent, fair pricing based on your actual needs" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              variants: containerVariants,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              className: "grid md:grid-cols-2 gap-6 md:gap-8 mb-12",
              children: [
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    variants: itemVariants,
                    whileHover: prefersReducedMotion ? {} : { scale: 1.02, y: -4 },
                    className: "bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all group",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(DollarSign, { className: "w-7 h-7 text-white" }) }),
                      /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold mb-3", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Volume-Based Pricing" }) }),
                      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-base", children: /* @__PURE__ */ jsx(TranslatedText, { children: "The more you ship, the better your rates. Our pricing scales with your business, ensuring you always get competitive rates that improve as you grow." }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    variants: itemVariants,
                    whileHover: prefersReducedMotion ? {} : { scale: 1.02, y: -4 },
                    className: "bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all group",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Shield, { className: "w-7 h-7 text-white" }) }),
                      /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold mb-3", children: /* @__PURE__ */ jsx(TranslatedText, { children: "No Hidden Fees" }) }),
                      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-base", children: /* @__PURE__ */ jsx(TranslatedText, { children: "What we quote is what you pay. No surprise charges, no hidden costs. We provide detailed breakdowns so you know exactly where your money goes." }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    variants: itemVariants,
                    whileHover: prefersReducedMotion ? {} : { scale: 1.02, y: -4 },
                    className: "bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all group",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Zap, { className: "w-7 h-7 text-white" }) }),
                      /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold mb-3", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Custom Quotes Within 24 Hours" }) }),
                      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-base", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Fill out our form below and receive a detailed pricing breakdown within 24 hours. Fast, accurate, and tailored specifically to your business needs." }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    variants: itemVariants,
                    whileHover: prefersReducedMotion ? {} : { scale: 1.02, y: -4 },
                    className: "bg-card p-6 md:p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all group",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Clock, { className: "w-7 h-7 text-white" }) }),
                      /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold mb-3", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Flexible & Scalable" }) }),
                      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-base", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Our pricing adapts to your business. Whether you're shipping 100 units or 10,000, we have a solution that works for your current size and future growth." }) })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "bg-card p-6 md:p-8 rounded-2xl border shadow-lg",
              children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-bold mb-6 text-center", children: /* @__PURE__ */ jsx(TranslatedText, { children: "What Affects Your Price" }) }),
                /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-4 md:gap-6", children: [
                  { title: "Monthly Unit Volume", desc: "Higher volumes unlock better per-unit rates and additional benefits" },
                  { title: "Service Complexity", desc: "Simple FBA prep costs less than custom kitting and branded packaging" },
                  { title: "Storage Requirements", desc: "Short-term vs. long-term storage, pallet count, and special handling needs" },
                  { title: "Special Handling", desc: "Custom branding, gift wrapping, expiration date tracking, and fragile items" }
                ].map((item, index) => /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: prefersReducedMotion ? 0 : -10 },
                    whileInView: { opacity: 1, x: 0 },
                    viewport: { once: true },
                    transition: { delay: prefersReducedMotion ? 0 : index * 0.1 },
                    whileHover: prefersReducedMotion ? {} : { x: 4 },
                    className: "flex gap-3 group cursor-default",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-500/30 transition-colors", children: /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-green-500" }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "font-semibold mb-1 text-sm md:text-base", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.title }) }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.desc }) })
                      ] })
                    ]
                  },
                  index
                )) })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-16 md:py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "text-center mb-10 md:mb-12",
              children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Pricing Built Around Your Shopify Volume" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Professional services included in your custom quote" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              variants: containerVariants,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              className: "grid grid-cols-2 md:grid-cols-4 gap-4",
              children: serviceCards.map((item, index) => /* @__PURE__ */ jsxs(
                motion.div,
                {
                  variants: itemVariants,
                  whileHover: prefersReducedMotion ? {} : { scale: 1.05, y: -4 },
                  className: "bg-card rounded-xl p-4 border shadow-md hover:shadow-lg hover:border-[#F97316]/30 transition-all text-center group cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center group-hover:bg-[#F97316]/10 transition-colors", children: /* @__PURE__ */ jsx(item.icon, { className: "w-5 h-5 text-[#F97316] group-hover:scale-110 transition-transform" }) }),
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-sm mb-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.serviceKey }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.descKey }) })
                  ]
                },
                index
              ))
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-center text-xs md:text-sm text-muted-foreground mt-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "All services are customized based on your specific needs and volume. Contact us for detailed pricing." }) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 text-center", children: [
          /* @__PURE__ */ jsx(
            motion.h2,
            {
              initial: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "text-base md:text-lg font-semibold text-muted-foreground mb-8",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "Trusted by Growing Brands" })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              whileInView: { opacity: 1 },
              viewport: { once: true },
              transition: { delay: prefersReducedMotion ? 0 : 0.2 },
              className: "flex flex-wrap justify-center gap-6 md:gap-8",
              children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsx(
                motion.div,
                {
                  whileHover: prefersReducedMotion ? {} : { scale: 1.1, opacity: 1 },
                  className: "w-20 md:w-24 h-10 md:h-12 bg-muted/60 rounded-lg opacity-50 hover:opacity-80 transition-all flex items-center justify-center cursor-pointer",
                  children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsx(TranslatedText, { children: "Logo" }),
                    " ",
                    i
                  ] })
                },
                i
              ))
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(SectionDivider, { icon: Star }),
        /* @__PURE__ */ jsx("section", { className: "py-16 md:py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
          /* @__PURE__ */ jsx(
            motion.h2,
            {
              initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "text-2xl md:text-4xl font-bold mb-10 md:mb-12 text-center",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "Why Our Clients Choose Us" })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              variants: containerVariants,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              className: "grid md:grid-cols-2 gap-6 md:gap-8",
              children: [
                { icon: Zap, title: "24-Hour Turnaround Guaranteed", desc: "Orders received before 2 PM PST ship the same day. Fast processing means happy customers and better reviews for your business." },
                { icon: Shield, title: "Dedicated Account Management", desc: "Direct access to your account manager via phone and email. No ticket systems, no automated responses—just real support when you need it." },
                { icon: DollarSign, title: "Los Angeles Port Proximity", desc: "Located minutes from LA/Long Beach ports. Faster inbound receiving, lower drayage costs, and quicker time to market for imported goods." },
                { icon: Check, title: "Flexible & Scalable Solutions", desc: "We adapt to your business, not the other way around. Custom workflows, special handling, and solutions that grow with your success." }
              ].map((item, index) => /* @__PURE__ */ jsxs(
                motion.div,
                {
                  variants: itemVariants,
                  whileHover: prefersReducedMotion ? {} : { scale: 1.02, y: -4 },
                  className: "flex gap-4 bg-card p-5 md:p-6 rounded-2xl border shadow-md hover:shadow-lg transition-all group",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316]/20 to-[#F97316]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#F97316]/30 group-hover:to-[#F97316]/20 transition-colors", children: /* @__PURE__ */ jsx(item.icon, { className: "w-6 h-6 text-[#F97316] group-hover:scale-110 transition-transform" }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-base md:text-xl font-semibold mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.title }) }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.desc }) })
                    ] })
                  ]
                },
                index
              ))
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-16 md:py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "text-center mb-10 md:mb-12",
              children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Frequently Asked Questions About Our 3PL Pricing" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Common questions about our pricing structure" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { delay: prefersReducedMotion ? 0 : 0.2 },
              children: /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "w-full space-y-3", children: faqData.map((faq, index) => /* @__PURE__ */ jsxs(
                AccordionItem,
                {
                  value: `item-${index}`,
                  className: "bg-card border rounded-2xl px-4 md:px-6 shadow-sm hover:shadow-md transition-shadow",
                  children: [
                    /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-sm md:text-base hover:no-underline py-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: faq.question }) }),
                    /* @__PURE__ */ jsx(AccordionContent, { className: "text-sm md:text-base text-muted-foreground pb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: faq.answer }) })
                  ]
                },
                index
              )) })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("section", { className: "py-16 md:py-20 bg-muted/30 relative overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-[#0A66C2]/10 rounded-full blur-3xl" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 max-w-3xl relative z-10", children: /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true },
              className: "bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/90 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl",
              children: [
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { scale: 0.8, opacity: 0 },
                    whileInView: { scale: 1, opacity: 1 },
                    viewport: { once: true },
                    transition: { delay: prefersReducedMotion ? 0 : 0.1, type: "spring", stiffness: 200 },
                    className: "text-3xl md:text-5xl font-extrabold mb-4",
                    children: [
                      /* @__PURE__ */ jsx(TranslatedText, { children: "Save up to" }),
                      " ",
                      /* @__PURE__ */ jsxs("span", { className: "text-[#F97316]", children: [
                        "$",
                        savedCalculation?.estimatedSavings?.toLocaleString() || "2,500+"
                      ] }),
                      "/",
                      /* @__PURE__ */ jsx(TranslatedText, { children: "month" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: prefersReducedMotion ? 0 : -10 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { delay: prefersReducedMotion ? 0 : 0.2 },
                    className: "inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6",
                    children: [
                      /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-[#F97316]" }),
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-sm md:text-base", children: /* @__PURE__ */ jsx(TranslatedText, { children: "You're Likely Eligible for Additional Per-Unit Discounts" }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(Calendar, { className: "w-12 h-12 mx-auto mb-4 opacity-90" }),
                /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Want to Talk Numbers?" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-white/80 mb-8 max-w-md mx-auto text-sm md:text-base", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Let's explore a custom quote tailored to your volume and needs." }) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "lg",
                    className: "w-full md:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 md:px-10 py-5 md:py-6 text-base md:text-lg rounded-xl shadow-lg min-h-[48px] transition-transform hover:scale-105",
                    asChild: true,
                    children: /* @__PURE__ */ jsxs("a", { href: "https://calendly.com/westfieldprepcenter/30min", target: "_blank", rel: "noopener noreferrer", children: [
                      /* @__PURE__ */ jsx(TranslatedText, { children: "Schedule a Call" }),
                      " ",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5" })
                    ] })
                  }
                )
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "py-16 md:py-20 relative overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-0 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 right-0 w-96 h-96 bg-[#0A66C2]/10 rounded-full blur-3xl" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl relative z-10", children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                className: "text-center mb-10 md:mb-12",
                children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get Your Custom 3PL Quote Today" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Tell us about your business and receive a detailed pricing breakdown within 24 hours. No pressure, no commitment—just honest answers to help you make the right decision." }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: prefersReducedMotion ? 0 : 0.2 },
                className: "bg-card p-6 md:p-8 rounded-3xl border shadow-xl",
                children: /* @__PURE__ */ jsx(ContactForm, {})
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "py-8 bg-muted/50 border-t", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-wrap justify-center gap-6 md:gap-10", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/pricing",
              className: "flex items-center gap-2 text-sm font-medium text-primary",
              children: [
                /* @__PURE__ */ jsx(DollarSign, { className: "w-4 h-4" }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "Pricing" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/why-choose-us",
              className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group",
              children: [
                /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 group-hover:scale-110 transition-transform" }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "Features" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/contact",
              className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group",
              children: [
                /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 group-hover:scale-110 transition-transform" }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "Contact" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/faq",
              className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group",
              children: [
                /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 group-hover:scale-110 transition-transform" }),
                " ",
                /* @__PURE__ */ jsx(TranslatedText, { children: "FAQ" })
              ]
            }
          )
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(ExitIntentModal, {})
    ] })
  ] });
};
export {
  Pricing as default
};
