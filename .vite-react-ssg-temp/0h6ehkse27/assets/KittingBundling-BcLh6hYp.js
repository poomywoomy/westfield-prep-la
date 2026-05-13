import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { B as Button, S as StructuredData, H as Header, F as Footer } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Package, Zap, Gift, Layers, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
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
const KittingHero = () => {
  const navigate = useNavigate();
  const [assemblyStage, setAssemblyStage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAssemblyStage((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);
  const stats = [
    { value: "500+", label: "Kits/Day Capacity", icon: Layers },
    { value: "2hr", label: "Avg Assembly Time", icon: Clock },
    { value: "150+", label: "Active Kit Clients", icon: Users }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-10",
        style: {
          backgroundImage: `
            linear-gradient(to right, rgb(16, 185, 129) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(16, 185, 129) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600",
        animate: {
          backgroundPosition: ["0% 0%", "100% 0%"]
        },
        transition: { duration: 3, repeat: Infinity, ease: "linear" },
        style: { backgroundSize: "200% 100%" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "container relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
          className: "text-left",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 mb-6", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-emerald-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-emerald-200", children: "Assembly Workshop" })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight", children: [
              "We Assemble.",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300", children: "You Sell." })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-xl text-emerald-100/80 mb-8 leading-relaxed", children: [
              "Multi-SKU kits, subscription boxes, gift sets, promotional bundles assembled with precision. Every kit photographed. Every component verified.",
              /* @__PURE__ */ jsx("span", { className: "text-emerald-300 font-medium", children: " From 2-item bundles to 50+ component kits." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-6 mb-8 p-4 rounded-xl bg-slate-900/60 border border-emerald-400/20", children: stats.map((stat, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(stat.icon, { className: "w-5 h-5 text-emerald-400" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-white", children: stat.value }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-300", children: stat.label })
              ] })
            ] }, idx)) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "lg",
                  onClick: () => navigate("/contact"),
                  className: "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-6 text-lg",
                  children: "Get Assembly Quote"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "lg",
                  variant: "outline",
                  onClick: () => navigate("/pricing"),
                  className: "border-2 border-emerald-400/50 bg-emerald-500/10 text-white hover:bg-emerald-500/20 px-8 py-6 text-lg",
                  children: "View Pricing"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 30 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.3 },
          className: "relative",
          children: /* @__PURE__ */ jsxs("div", { className: "relative bg-slate-900/80 rounded-2xl border border-emerald-400/30 p-8 backdrop-blur-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative h-64 flex items-center justify-center", children: [
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  className: "absolute left-0 flex flex-col gap-4",
                  animate: { x: assemblyStage >= 1 ? 80 : 0 },
                  transition: { duration: 0.5 },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-blue-500/30 border border-blue-400 flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "w-6 h-6 text-blue-400" }) }),
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-purple-500/30 border border-purple-400 flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "w-6 h-6 text-purple-400" }) }),
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-amber-500/30 border border-amber-400 flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "w-6 h-6 text-amber-400" }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  className: "relative z-10",
                  animate: {
                    scale: assemblyStage === 2 ? [1, 1.1, 1] : 1,
                    rotate: assemblyStage === 2 ? [0, 5, -5, 0] : 0
                  },
                  transition: { duration: 0.5 },
                  children: assemblyStage < 3 ? /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-2xl bg-emerald-500/30 border-2 border-dashed border-emerald-400 flex items-center justify-center", children: /* @__PURE__ */ jsx(Zap, { className: "w-10 h-10 text-emerald-400" }) }) : /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      initial: { scale: 0.8, opacity: 0 },
                      animate: { scale: 1, opacity: 1 },
                      className: "w-24 h-24 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40",
                      children: /* @__PURE__ */ jsx(Gift, { className: "w-12 h-12 text-white" })
                    }
                  )
                }
              ),
              assemblyStage === 3 && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { scale: 0, rotate: -45 },
                  animate: { scale: 1, rotate: 0 },
                  className: "absolute right-0 top-0 px-3 py-1 rounded bg-green-500 text-white text-xs font-bold transform rotate-12",
                  children: "QC APPROVED"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mt-6", children: ["Components", "Merge", "Assembly", "Complete"].map((label, idx) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx("div", { className: `w-3 h-3 rounded-full transition-colors ${idx <= assemblyStage ? "bg-emerald-400" : "bg-slate-600"}` }),
              /* @__PURE__ */ jsx("span", { className: `text-xs mt-1 ${idx <= assemblyStage ? "text-emerald-300" : "text-slate-500"}`, children: label })
            ] }, idx)) })
          ] })
        }
      )
    ] }) })
  ] });
};
const KittingContent = () => {
  const useCases = ["Subscription box assembly", "Holiday gift sets", "Product sample kits", "Influencer PR boxes", "Promotional bundles", "New customer welcome kits", "Loyalty program rewards", "Event swag bags"];
  const benefits = ["Save 80% on assembly time vs in-house", "Scale up instantly for peak seasons", "No equipment or space investment", "Photo documentation of every kit", "Flexible minimum order quantities", "Custom packaging materials accepted"];
  const faqs = [
    { q: "What types of kits can you assemble?", a: "We handle everything from simple 2-item bundles to complex 20+ component kits. Subscription boxes, gift sets, PR boxes, sample kits, and promotional bundles are our specialty." },
    { q: "How long does kit assembly take?", a: "Standard kits are assembled same-day. Complex kits with 10+ components typically take 1-2 business days. Rush assembly available for urgent needs." },
    { q: "Do you photograph completed kits?", a: "Yes, every kit is photographed during QC. Photos are uploaded to your dashboard so you can verify assembly accuracy before shipping." },
    { q: "Can I provide custom packaging materials?", a: "Absolutely. Ship us your branded boxes, tissue paper, inserts, and we'll use them. We can also source packaging materials for you." },
    { q: "What's the minimum order for kitting?", a: "No strict minimums. We work with brands assembling 50 kits per month up to thousands. Pricing scales with volume." },
    { q: "How do you handle kit component shortages?", a: "We track component inventory in real-time. You're notified before stock runs out so kits are never delayed. We can hold partial kits until components arrive." },
    { q: "Can you store kit components separately?", a: "Yes. Components are stored individually and pulled for assembly as orders come in. This is ideal for subscription boxes with rotating items." }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Common Kitting Use Cases" }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: [
          "From subscription boxes to event swag, we handle assembly for brands of all sizes. Learn more about our ",
          /* @__PURE__ */ jsx(Link, { to: "/order-fulfillment", className: "text-emerald-600 hover:underline", children: "fulfillment services" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4", children: useCases.map((item, idx) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: -10 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { delay: idx * 0.05 }, className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-emerald-500 flex-shrink-0" }),
        /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg", children: item })
      ] }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Why Outsource Kitting?" }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: [
          "In-house kitting ties up your team and space. Professional assembly frees you to focus on growth. Check our ",
          /* @__PURE__ */ jsx(Link, { to: "/pricing", className: "text-emerald-600 hover:underline", children: "pricing" }),
          " for volume discounts."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4", children: benefits.map((item, idx) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: idx * 0.05 }, className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-emerald-500 flex-shrink-0" }),
        /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg", children: item })
      ] }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "text-center mb-12", children: /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Frequently Asked Questions" }) }),
      /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto space-y-4", children: faqs.map((faq, idx) => /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: idx * 0.03 }, children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-2 text-emerald-900", children: faq.q }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: faq.a })
      ] }) }) }, idx)) }),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-8", children: /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
        "More questions? ",
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-emerald-600 hover:underline font-medium", children: "Contact us" })
      ] }) })
    ] }) })
  ] });
};
const KittingCTA = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "max-w-4xl mx-auto text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(Gift, { className: "w-10 h-10 text-emerald-300" }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: "Ready to Create Custom Kits?" }),
    /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-emerald-100/80 mb-8 max-w-2xl mx-auto", children: "Let's discuss your kitting needs. From subscription boxes to promotional bundles, we'll handle assembly so you can focus on growing your brand." }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxs(Button, { size: "lg", onClick: () => navigate("/contact"), className: "bg-white text-emerald-900 hover:bg-emerald-100 px-8 py-6 text-lg group", children: [
        "Get a Quote",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })
      ] }),
      /* @__PURE__ */ jsx(Button, { size: "lg", variant: "outline", onClick: () => navigate("/pricing"), className: "border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg", children: "View Pricing" })
    ] })
  ] }) }) });
};
const KittingBundling = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const serviceData = {
    serviceType: "Service",
    name: "Kitting & Bundling Services - Los Angeles 3PL Prep Center",
    description: "Custom kitting and bundling at our LA 3PL prep center. Multi-SKU kits, gift sets, and promotional bundles with photo-proof QC.",
    features: ["Multi-SKU Kits", "Gift Sets", "Promotional Bundles", "Photo-Proof QC", "3PL Services"]
  };
  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of kitting services do you offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer multi-SKU kits, gift sets, promotional bundles, subscription box assembly, influencer PR boxes, and custom branded packaging."
        }
      },
      {
        "@type": "Question",
        name: "How long does kit assembly take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard kit assembly takes 1-3 business days depending on complexity and volume. Rush assembly is available for urgent needs."
        }
      },
      {
        "@type": "Question",
        name: "Do you provide photos of completed kits?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every kit is photographed during QC to ensure accuracy. Photos are available in your dashboard for verification."
        }
      },
      {
        "@type": "Question",
        name: "Can I provide custom packaging materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Send us your branded boxes, tissue paper, inserts, and we'll assemble kits to your exact specifications."
        }
      },
      {
        "@type": "Question",
        name: "What's the minimum order for kitting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No minimum order required. We handle everything from 10-kit test runs to 10,000+ unit production runs."
        }
      },
      {
        "@type": "Question",
        name: "How do you handle kit component shortages?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We alert you immediately when any component runs low. You can set reorder thresholds per SKU in your dashboard."
        }
      },
      {
        "@type": "Question",
        name: "Can you store kit components separately?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Components are stored individually and only assembled when you trigger a kitting order or when inventory thresholds are met."
        }
      }
    ]
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Educational Kitting & Bundling Services in Los Angeles CA" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Get the best educational kitting and bundling services in Los Angeles, CA.Accurate assembly, careful packaging, and reliable fulfillment. Contact us today."
        }
      ),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "keywords",
          content: "3pl los angeles, kitting services, bundling, prep center, subscription box assembly, product kitting"
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/kitting-bundling" })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "service", data: serviceData }),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqSchemaData }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Kitting & Bundling", path: "/kitting-bundling" }] }),
      /* @__PURE__ */ jsx(KittingHero, {}),
      /* @__PURE__ */ jsx(KittingContent, {}),
      /* @__PURE__ */ jsx(KittingCTA, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  KittingBundling as default
};
