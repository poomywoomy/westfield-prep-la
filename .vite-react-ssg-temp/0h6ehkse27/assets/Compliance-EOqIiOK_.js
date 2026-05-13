import { jsx, jsxs } from "react/jsx-runtime";
import { Shield, FileCheck, Award, Flame, Lock, Leaf } from "lucide-react";
import { T as TranslatedText } from "../main.mjs";
import { S as SectionHeading, I as IconBadge } from "./HomePrimitives-DXHeGbEl.js";
import "vite-react-ssg";
import "react";
import "react-router-dom";
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
const items = [
  { icon: Shield, title: "Fully Insured Operations", desc: "General Liability and Warehouse Legal Liability coverage provides complete peace of mind for your inventory. Your products are protected from receiving through shipping.", tags: ["General Liability", "WLL Coverage"] },
  { icon: FileCheck, title: "Multi-Platform Compliant", desc: "All prep meets Amazon, Walmart, and Shopify requirements: polybag suffocation warnings, 50-lb box rule, accurate case labels. We stay current with all marketplace requirements.", tags: ["Amazon FBA", "Walmart WFS", "Shopify"] },
  { icon: Award, title: "Quality Assurance", desc: "Rigorous inspection processes and photo documentation for every order. Each shipment is verified against ASNs with timestamped quality control photos for full transparency and accountability.", tags: ["Photo QC", "ASN Verification"] },
  { icon: Flame, title: "Advanced Security Systems", desc: "24/7 monitoring, fire suppression, and comprehensive theft prevention protocols. Our facility features state-of-the-art security cameras, restricted access zones, and automated fire detection systems.", tags: ["24/7 Surveillance", "Fire Protection"] },
  { icon: Lock, title: "Data Security & Confidentiality", desc: "Enterprise-grade data protection with encrypted systems and strict confidentiality agreements to safeguard your business information. Your data and intellectual property are always protected.", tags: ["Encrypted Systems", "NDAs Available"] },
  { icon: Leaf, title: "Sustainable Practices", desc: "Eco-friendly operations with recycling programs, energy-efficient facilities, and sustainable packaging materials. We're committed to reducing our environmental impact while maintaining excellence.", tags: ["Recycling Program", "Eco Packaging"] }
];
const Compliance = () => {
  return /* @__PURE__ */ jsx("section", { className: "relative py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        eyebrow: "Trust & Safety",
        title: /* @__PURE__ */ jsx(TranslatedText, { children: "Compliance & Safety You Can Trust" }),
        subtitle: /* @__PURE__ */ jsx(TranslatedText, { children: "Your inventory deserves enterprise-grade protection. We've invested in comprehensive insurance, security systems, and sustainable practices to safeguard your business." })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: items.map((it, i) => {
      const Icon = it.icon;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group bg-background rounded-2xl p-6 border border-border hover:border-secondary/40 hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl",
          children: [
            /* @__PURE__ */ jsx(IconBadge, { size: "lg", children: /* @__PURE__ */ jsx(Icon, { className: "w-7 h-7" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mt-4 mb-2 text-primary tracking-tight", children: /* @__PURE__ */ jsx(TranslatedText, { children: it.title }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: it.desc }) }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 pt-3 border-t border-border", children: it.tags.map((t, j) => /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 bg-muted text-primary text-[10px] uppercase tracking-wider font-bold rounded-full border border-border", children: /* @__PURE__ */ jsx(TranslatedText, { children: t }) }, j)) })
          ]
        },
        i
      );
    }) })
  ] }) });
};
export {
  Compliance as default
};
