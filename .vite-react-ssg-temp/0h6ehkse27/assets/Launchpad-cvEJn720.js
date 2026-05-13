import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Box, ArrowUpRight, Sparkles, Check, Rocket, Layers, Users, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { D as Dialog, d as DialogContent, f as DialogTitle, g as DialogDescription, H as Header, F as Footer, n as generateMetaTags } from "../main.mjs";
import { SiShopify, SiAmazon, SiTiktok, SiWalmart } from "react-icons/si";
import { L as LAUNCHPAD_SERVICES, g as getServiceBySlug } from "./launchpadServices-DTpLXarh.js";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
const useGoToPricing = (slug, onOpenChange) => {
  const navigate = useNavigate();
  return () => {
    onOpenChange(false);
    navigate(`/contact?service=launchpad&focus=${slug}`);
  };
};
const Hidden = ({ s }) => /* @__PURE__ */ jsxs(VisuallyHidden, { children: [
  /* @__PURE__ */ jsx(DialogTitle, { children: s.name }),
  /* @__PURE__ */ jsx(DialogDescription, { children: s.summary })
] });
const SideSheetModal = ({ service, open, onOpenChange }) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: "!max-w-[560px] !w-full !h-screen !max-h-screen !top-0 !right-0 !left-auto !translate-x-0 !translate-y-0 !rounded-none p-0 overflow-y-auto bg-[#F4F8EC] border-l border-[#5E8E3E]/30 [&>button]:text-[#0E2A12] data-[state=open]:!slide-in-from-right data-[state=closed]:!slide-out-to-right",
      children: [
        /* @__PURE__ */ jsx(Hidden, { s: service }),
        /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1 bg-[#5E8E3E]" }),
        /* @__PURE__ */ jsxs("div", { className: "px-8 pt-10 pb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-[#5E8E3E] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5E8E3E]", children: [
              "Build sprint · Service ",
              service.number
            ] })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold tracking-[-0.02em] text-[#0E2A12] mb-4 leading-[1.05]", children: service.tagline }),
          /* @__PURE__ */ jsx("p", { className: "text-[#3a5a3e] text-[15px] leading-relaxed font-light", children: service.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-8 py-6 border-t border-[#5E8E3E]/15", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5E8E3E] mb-4", children: "What's in the sprint" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2.5", children: service.includes.map((i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3 text-[#0E2A12] text-[14px]", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-[#5E8E3E] mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: i })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-8 py-6 border-t border-[#5E8E3E]/15", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5E8E3E] mb-4", children: "Sprint timeline" }),
          /* @__PURE__ */ jsxs("div", { className: "relative pl-6", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute left-2 top-2 bottom-2 w-px bg-[#5E8E3E]/40" }),
            service.steps.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "relative mb-5 last:mb-0", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-[#5E8E3E] border-2 border-[#F4F8EC]" }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono text-[#5E8E3E] uppercase mb-1", children: [
                "Week ",
                i + 1
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[14px] font-semibold text-[#0E2A12]", children: s.title }),
              /* @__PURE__ */ jsx("div", { className: "text-[13px] text-[#3a5a3e] font-light", children: s.desc })
            ] }, s.title))
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "px-8 py-6 border-t border-[#5E8E3E]/15 sticky bottom-0 bg-[#F4F8EC]", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: goToPricing,
            className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5E8E3E] hover:bg-[#4d7732] text-white font-semibold text-sm transition-all",
            children: [
              "Get pricing for this sprint ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          }
        ) })
      ]
    }
  ) });
};
const DarkChecklistModal = ({ service, open, onOpenChange }) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl p-0 overflow-hidden bg-white border-[#131A22]/20 max-h-[90vh] overflow-y-auto [&>button]:text-white", children: [
    /* @__PURE__ */ jsx(Hidden, { s: service }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#131A22] text-white px-8 py-7", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-5", children: [
        /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-lg bg-[#FF9900] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[#131A22]" }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#FF9900]", children: [
          "Service ",
          service.number,
          " · Seller Central"
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-[1.1]", children: service.tagline }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-5", children: service.deliverables.map((d) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "px-3 py-1 rounded-full bg-[#FF9900]/15 text-[#FF9900] text-[11px] font-semibold border border-[#FF9900]/40",
          children: d.title
        },
        d.title
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-8 py-7", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[#1a1a1a] text-[14px] leading-relaxed mb-6", children: service.description }),
      /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#131A22] mb-3", children: "Setup checklist" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-7", children: service.includes.map((i, idx) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: "flex items-start gap-3 px-3 py-2.5 rounded-md bg-[#F7F8FA] border border-[#131A22]/8",
          children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] text-[#FF9900] font-bold mt-0.5 w-5", children: String(idx + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx("span", { className: "text-[14px] text-[#131A22]", children: i })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: goToPricing,
          className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#FF9900] hover:bg-[#e88a00] text-[#131A22] font-bold text-sm transition-all",
          children: [
            "Get pricing → ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ]
        }
      )
    ] })
  ] }) });
};
const GalleryModal = ({ service, open, onOpenChange }) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: "max-w-4xl p-0 overflow-hidden border-[#6B2E8C]/30 max-h-[90vh] overflow-y-auto [&>button]:text-[#2A0F3A]",
      style: {
        background: "linear-gradient(160deg, #F5ECF8 0%, #EFE3F5 60%, #E5D2EE 100%)"
      },
      children: [
        /* @__PURE__ */ jsx(Hidden, { s: service }),
        /* @__PURE__ */ jsxs("div", { className: "px-10 pt-10 pb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-full bg-[#6B2E8C] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6B2E8C]", children: [
              "Module ",
              service.number,
              " · A+ & Storefront"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-serif italic text-[#2A0F3A] leading-[1.05] mb-4", children: service.tagline }),
          /* @__PURE__ */ jsx("p", { className: "text-[#4A2A5C] text-[15px] leading-relaxed max-w-2xl", children: service.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-10 py-8 border-t border-[#6B2E8C]/15", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6B2E8C] mb-4", children: "Module gallery" }),
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: service.deliverables.map((d, i) => {
            const meta2 = [
              { dim: "970 × 600 · DESKTOP", stat: "+18% PDP conversion lift" },
              { dim: "970 × 600 · COMPARISON", stat: "Drives shoppers up the catalog" },
              { dim: "1464 × 600 · LIFESTYLE", stat: "Builds brand trust above the fold" },
              { dim: "MULTI-PAGE · STOREFRONT", stat: "Repeat-visit shopping experience" }
            ][i] || { dim: "AMAZON-READY", stat: "" };
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-xl bg-white/70 backdrop-blur border border-[#6B2E8C]/20 p-5 shadow-sm",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "aspect-[16/9] rounded-md mb-4 bg-gradient-to-br from-[#F5ECF8] to-[#E5D2EE] border border-[#6B2E8C]/15 p-3 flex items-center justify-center overflow-hidden", children: [
                    i === 0 && /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 110", className: "w-full h-full", role: "img", "aria-label": "Hero module wireframe", children: [
                      /* @__PURE__ */ jsx("rect", { x: "6", y: "6", width: "188", height: "56", rx: "3", fill: "#6B2E8C", opacity: "0.85" }),
                      /* @__PURE__ */ jsx("rect", { x: "14", y: "20", width: "90", height: "6", rx: "1", fill: "#fff", opacity: "0.9" }),
                      /* @__PURE__ */ jsx("rect", { x: "14", y: "32", width: "60", height: "4", rx: "1", fill: "#fff", opacity: "0.7" }),
                      /* @__PURE__ */ jsx("rect", { x: "14", y: "44", width: "40", height: "10", rx: "5", fill: "#FFD86B" }),
                      /* @__PURE__ */ jsx("rect", { x: "6", y: "70", width: "92", height: "34", rx: "2", fill: "#6B2E8C", opacity: "0.18" }),
                      /* @__PURE__ */ jsx("rect", { x: "102", y: "70", width: "92", height: "34", rx: "2", fill: "#6B2E8C", opacity: "0.12" })
                    ] }),
                    i === 1 && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 200 110", className: "w-full h-full", role: "img", "aria-label": "Comparison chart wireframe", children: [0, 1, 2, 3].map((c) => /* @__PURE__ */ jsxs("g", { children: [
                      /* @__PURE__ */ jsx("rect", { x: 8 + c * 47, y: "6", width: "42", height: "14", rx: "2", fill: "#6B2E8C", opacity: c === 0 ? 0.85 : 0.4 }),
                      [0, 1, 2, 3].map((r) => /* @__PURE__ */ jsx("circle", { cx: 29 + c * 47, cy: 32 + r * 18, r: "3.5", fill: r % 2 === c % 2 ? "#6B2E8C" : "none", stroke: "#6B2E8C", strokeWidth: "1", opacity: "0.7" }, r))
                    ] }, c)) }),
                    i === 2 && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 200 110", className: "w-full h-full", role: "img", "aria-label": "Lifestyle band wireframe", children: [0, 1, 2].map((c) => /* @__PURE__ */ jsxs("g", { children: [
                      /* @__PURE__ */ jsx("rect", { x: 6 + c * 64, y: "10", width: "60", height: "60", rx: "3", fill: "#6B2E8C", opacity: 0.25 + c * 0.12 }),
                      /* @__PURE__ */ jsx("circle", { cx: 36 + c * 64, cy: "34", r: "6", fill: "#fff", opacity: "0.9" }),
                      /* @__PURE__ */ jsx("rect", { x: 10 + c * 64, y: "76", width: "40", height: "3", fill: "#6B2E8C", opacity: "0.7" }),
                      /* @__PURE__ */ jsx("rect", { x: 10 + c * 64, y: "84", width: "52", height: "2", fill: "#6B2E8C", opacity: "0.4" }),
                      /* @__PURE__ */ jsx("rect", { x: 10 + c * 64, y: "90", width: "32", height: "2", fill: "#6B2E8C", opacity: "0.4" })
                    ] }, c)) }),
                    i === 3 && /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 110", className: "w-full h-full", role: "img", "aria-label": "Storefront pages wireframe", children: [
                      /* @__PURE__ */ jsx("rect", { x: "6", y: "6", width: "188", height: "14", rx: "2", fill: "#6B2E8C", opacity: "0.85" }),
                      [0, 1, 2, 3, 4].map((n) => /* @__PURE__ */ jsx("rect", { x: 14 + n * 32, y: "11", width: "22", height: "4", rx: "1", fill: "#fff", opacity: "0.85" }, n)),
                      /* @__PURE__ */ jsx("rect", { x: "6", y: "26", width: "120", height: "44", rx: "2", fill: "#6B2E8C", opacity: "0.3" }),
                      /* @__PURE__ */ jsx("rect", { x: "130", y: "26", width: "64", height: "20", rx: "2", fill: "#6B2E8C", opacity: "0.18" }),
                      /* @__PURE__ */ jsx("rect", { x: "130", y: "50", width: "64", height: "20", rx: "2", fill: "#6B2E8C", opacity: "0.18" }),
                      [0, 1, 2, 3].map((n) => /* @__PURE__ */ jsx("rect", { x: 6 + n * 48, y: "76", width: "44", height: "28", rx: "2", fill: "#6B2E8C", opacity: "0.15" }, n))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono text-[#6B2E8C] mb-1 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("span", { children: [
                      "MODULE 0",
                      i + 1
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "opacity-70", children: meta2.dim })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "font-serif italic text-lg text-[#2A0F3A]", children: d.title }),
                  /* @__PURE__ */ jsx("div", { className: "text-[13px] text-[#4A2A5C] mt-1", children: d.desc }),
                  meta2.stat && /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-[#6B2E8C] mt-2 font-semibold", children: [
                    "↗ ",
                    meta2.stat
                  ] })
                ]
              },
              d.title
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-10 py-6 border-t border-[#6B2E8C]/15 grid sm:grid-cols-2 gap-4 bg-white/40", children: [
          /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: service.includes.slice(0, 3).map((i) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: "text-[13px] text-[#2A0F3A] flex gap-2 items-start",
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-[#6B2E8C]", children: "◆" }),
                /* @__PURE__ */ jsx("span", { children: i })
              ]
            },
            i
          )) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: goToPricing,
              className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#6B2E8C] hover:bg-[#5A2575] text-white font-semibold text-sm transition-all",
              children: [
                "Get pricing for A+ ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
              ]
            }
          )
        ] })
      ]
    }
  ) });
};
const MagazineModal = ({ service, open, onOpenChange }) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-5xl p-0 overflow-hidden bg-[#F4ECDD] border-2 border-[#1C1C1C] max-h-[90vh] overflow-y-auto [&>button]:text-[#1C1C1C]", children: [
    /* @__PURE__ */ jsx(Hidden, { s: service }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-[1fr_1.2fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-10 border-r border-[#1C1C1C]/30 bg-[#1C1C1C] text-[#F4ECDD]", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono uppercase tracking-[0.3em] mb-8", children: [
          "ED. ",
          service.number,
          " · Design"
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-5xl font-semibold tracking-[-0.04em] leading-[0.92] mb-8", children: [
          service.name,
          "."
        ] }),
        /* @__PURE__ */ jsx(Icon, { className: "h-10 w-10 mb-6 opacity-50" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#F4ECDD]/70 text-[14px] leading-relaxed", children: service.tagline })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-10", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[#1C1C1C] text-[14px] leading-relaxed mb-7 first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]", children: service.description }),
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.3em] text-[#1C1C1C] mb-3", children: "Inside this issue" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3 mb-6", children: service.deliverables.map((d, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "border border-[#1C1C1C] p-3 bg-[#F4ECDD]",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "aspect-square bg-white mb-2 p-2 flex items-center justify-center border border-[#1C1C1C]/20", children: [
                i === 0 && /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full", role: "img", "aria-label": "Design system specimen", children: [
                  /* @__PURE__ */ jsx("rect", { x: "6", y: "6", width: "14", height: "14", fill: "#1C1C1C" }),
                  /* @__PURE__ */ jsx("rect", { x: "22", y: "6", width: "14", height: "14", fill: "#C2654A" }),
                  /* @__PURE__ */ jsx("rect", { x: "38", y: "6", width: "14", height: "14", fill: "#5E8E3E" }),
                  /* @__PURE__ */ jsx("rect", { x: "54", y: "6", width: "14", height: "14", fill: "#F4ECDD", stroke: "#1C1C1C" }),
                  /* @__PURE__ */ jsx("rect", { x: "70", y: "6", width: "14", height: "14", fill: "#FFD86B" }),
                  /* @__PURE__ */ jsx("text", { x: "6", y: "38", fontSize: "14", fontWeight: "700", fill: "#1C1C1C", fontFamily: "serif", children: "H1" }),
                  /* @__PURE__ */ jsx("text", { x: "32", y: "38", fontSize: "10", fontWeight: "600", fill: "#1C1C1C", children: "H2" }),
                  /* @__PURE__ */ jsx("text", { x: "50", y: "38", fontSize: "7", fill: "#1C1C1C", children: "Body" }),
                  /* @__PURE__ */ jsx("text", { x: "6", y: "56", fontSize: "6", fill: "#1C1C1C", opacity: "0.5", fontFamily: "monospace", children: "— Type scale —" }),
                  [0, 1, 2, 3, 4, 5, 6, 7].map((n) => /* @__PURE__ */ jsx("g", { children: [0, 1, 2, 3, 4, 5, 6, 7].map((m) => /* @__PURE__ */ jsx("circle", { cx: 8 + n * 11, cy: 68 + m * 4, r: "0.7", fill: "#1C1C1C", opacity: "0.4" }, m)) }, n))
                ] }),
                i === 1 && /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full", role: "img", "aria-label": "Page layout stack", children: [
                  /* @__PURE__ */ jsx("rect", { x: "6", y: "6", width: "88", height: "22", fill: "#1C1C1C", opacity: "0.85" }),
                  /* @__PURE__ */ jsx("rect", { x: "10", y: "12", width: "30", height: "3", fill: "#F4ECDD" }),
                  /* @__PURE__ */ jsx("rect", { x: "10", y: "18", width: "20", height: "2", fill: "#F4ECDD", opacity: "0.7" }),
                  /* @__PURE__ */ jsx("rect", { x: "60", y: "14", width: "28", height: "8", rx: "4", fill: "#C2654A" }),
                  /* @__PURE__ */ jsx("text", { x: "6", y: "38", fontSize: "5", fontFamily: "monospace", fill: "#1C1C1C", opacity: "0.6", children: "HERO · 1440" }),
                  /* @__PURE__ */ jsx("rect", { x: "6", y: "42", width: "40", height: "26", fill: "#1C1C1C", opacity: "0.15" }),
                  /* @__PURE__ */ jsx("rect", { x: "50", y: "42", width: "44", height: "26", fill: "none", stroke: "#1C1C1C" }),
                  /* @__PURE__ */ jsx("rect", { x: "50", y: "46", width: "22", height: "3", fill: "#1C1C1C" }),
                  /* @__PURE__ */ jsx("rect", { x: "50", y: "52", width: "34", height: "2", fill: "#1C1C1C", opacity: "0.5" }),
                  /* @__PURE__ */ jsx("rect", { x: "50", y: "56", width: "28", height: "2", fill: "#1C1C1C", opacity: "0.5" }),
                  /* @__PURE__ */ jsx("rect", { x: "50", y: "62", width: "14", height: "4", fill: "#C2654A" }),
                  /* @__PURE__ */ jsx("text", { x: "6", y: "78", fontSize: "5", fontFamily: "monospace", fill: "#1C1C1C", opacity: "0.6", children: "PDP · COLLECTION" }),
                  [0, 1, 2, 3].map((n) => /* @__PURE__ */ jsx("rect", { x: 6 + n * 22, y: "82", width: "20", height: "12", fill: "#1C1C1C", opacity: "0.18" }, n))
                ] }),
                i === 2 && /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full", role: "img", "aria-label": "Responsive device frames", children: [
                  /* @__PURE__ */ jsx("rect", { x: "2", y: "14", width: "94", height: "72", rx: "3", fill: "none", stroke: "#1C1C1C", strokeWidth: "1.5" }),
                  /* @__PURE__ */ jsx("text", { x: "4", y: "11", fontSize: "5", fontFamily: "monospace", fill: "#1C1C1C", children: "XL · 1440" }),
                  /* @__PURE__ */ jsx("rect", { x: "14", y: "22", width: "70", height: "56", rx: "2", fill: "none", stroke: "#1C1C1C", strokeWidth: "1.2" }),
                  /* @__PURE__ */ jsx("text", { x: "16", y: "20", fontSize: "4.5", fontFamily: "monospace", fill: "#1C1C1C", opacity: "0.8", children: "MD · 768" }),
                  /* @__PURE__ */ jsx("rect", { x: "36", y: "34", width: "26", height: "40", rx: "2", fill: "#1C1C1C", opacity: "0.85" }),
                  /* @__PURE__ */ jsx("rect", { x: "38", y: "38", width: "22", height: "28", rx: "1", fill: "#F4ECDD" }),
                  /* @__PURE__ */ jsx("circle", { cx: "49", cy: "71", r: "1.5", fill: "#F4ECDD" }),
                  /* @__PURE__ */ jsx("text", { x: "36", y: "32", fontSize: "4", fontFamily: "monospace", fill: "#1C1C1C", children: "XS · 375" }),
                  /* @__PURE__ */ jsx("text", { x: "6", y: "94", fontSize: "4.5", fontFamily: "monospace", fill: "#1C1C1C", opacity: "0.6", children: "— breakpoints 375 · 768 · 1440 —" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[12px] font-semibold text-[#1C1C1C]", children: d.title }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] font-mono text-[#1C1C1C]/60 mt-0.5", children: d.desc })
            ]
          },
          d.title
        )) }),
        /* @__PURE__ */ jsx("ul", { className: "text-[12px] text-[#1C1C1C]/80 space-y-1 mb-6 columns-2", children: service.includes.slice(0, 6).map((i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { children: "—" }),
          /* @__PURE__ */ jsx("span", { children: i })
        ] }, i)) }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: goToPricing,
            className: "inline-flex items-center gap-2 px-6 py-3 bg-[#1C1C1C] text-[#F4ECDD] font-semibold text-sm hover:bg-black transition-colors border-2 border-[#1C1C1C]",
            children: [
              "Get pricing → ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          }
        )
      ] })
    ] })
  ] }) });
};
const RenderQueueModal = ({ service, open, onOpenChange }) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: "max-w-3xl p-0 overflow-hidden bg-[#08111F] border-[#2B6CFF]/40 max-h-[90vh] overflow-y-auto [&>button]:text-[#2B6CFF]",
      style: {
        backgroundImage: "linear-gradient(rgba(43,108,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(43,108,255,0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      },
      children: [
        /* @__PURE__ */ jsx(Hidden, { s: service }),
        /* @__PURE__ */ jsxs("div", { className: "px-8 pt-8 pb-6 border-b border-[#2B6CFF]/20", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-md bg-[#2B6CFF] flex items-center justify-center shadow-[0_0_30px_rgba(43,108,255,0.5)]", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono uppercase tracking-[0.25em] text-[#2B6CFF]", children: [
              "▸ R-",
              service.number,
              " · Render Pipeline"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold tracking-[-0.02em] text-white leading-[1.1] mb-3", children: service.tagline }),
          /* @__PURE__ */ jsx("p", { className: "text-white/60 text-[14px] leading-relaxed font-light", children: service.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-8 py-6", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.25em] text-[#2B6CFF] mb-4", children: "// render queue" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-7 font-mono", children: service.steps.map((s, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-4 px-4 py-3 rounded-md bg-[#0E1A2E] border border-[#2B6CFF]/20",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-[#2B6CFF]", children: [
                  "[",
                  String(i + 1).padStart(2, "0"),
                  "]"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-white text-[13px] flex-1", children: s.title }),
                /* @__PURE__ */ jsx("span", { className: "text-white/40 text-[11px]", children: s.desc }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#2B6CFF]", children: "●" })
              ]
            },
            s.title
          )) }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.25em] text-[#2B6CFF] mb-3", children: "// outputs" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3 mb-7", children: service.deliverables.map((d) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "rounded-md bg-[#0E1A2E] border border-[#2B6CFF]/20 p-3",
              children: [
                /* @__PURE__ */ jsx(Box, { className: "h-5 w-5 text-[#2B6CFF] mb-2" }),
                /* @__PURE__ */ jsx("div", { className: "text-[12px] font-semibold text-white", children: d.title }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px] text-white/50 mt-0.5", children: d.desc })
              ]
            },
            d.title
          )) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: goToPricing,
              className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#2B6CFF] hover:bg-[#1a5cf0] text-white font-mono font-semibold text-sm transition-all shadow-[0_0_30px_rgba(43,108,255,0.4)]",
              children: "▸ Get pricing — render quote"
            }
          )
        ] })
      ]
    }
  ) });
};
const ContactSheetModal = ({ service, open, onOpenChange }) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl p-0 overflow-hidden bg-[#F1DDD2] border-[#2A140C]/30 max-h-[90vh] overflow-y-auto [&>button]:text-[#2A140C]", children: [
    /* @__PURE__ */ jsx(Hidden, { s: service }),
    /* @__PURE__ */ jsxs("div", { className: "px-10 pt-10 pb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-full bg-[#2A140C] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[#C2654A]" }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#2A140C]", children: [
          "Roll ",
          service.number,
          " · LA Studio"
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold tracking-[-0.02em] text-[#2A140C] leading-[1.05] mb-3", children: service.tagline }),
      /* @__PURE__ */ jsx("p", { className: "text-[#2A140C]/70 text-[15px] leading-relaxed", children: service.description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#2A140C] py-5 px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-[9px] font-mono uppercase tracking-[0.3em] text-[#C2654A] mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { children: "Contact sheet · production card" }),
        /* @__PURE__ */ jsxs("span", { className: "opacity-60", children: [
          "35MM · ROLL ",
          service.number
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-1 mb-1", children: Array.from({ length: 24 }).map((_, n) => /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-[#C2654A]/20 rounded-[1px]" }, n)) }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: [
        { label: "Hero Shots", count: "12 frames", aspect: "1:1 · AMZN", glyph: "hero" },
        { label: "Lifestyle Set", count: "24 frames", aspect: "4:5 · IG", glyph: "model" },
        { label: "Variant Coverage", count: "36 frames", aspect: "1:1 · SKU", glyph: "swatch" },
        { label: "Flat Lay", count: "8 frames", aspect: "1:1 · PDP", glyph: "flat" },
        { label: "Ghost Mannequin", count: "6 frames", aspect: "4:5 · APP", glyph: "ghost" }
      ].map((f, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex-shrink-0 w-44 bg-[#3a1f15] p-2 rounded-sm border border-[#C2654A]/20",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-[3/4] bg-gradient-to-br from-[#5a2e1d] to-[#2A140C] rounded-sm flex items-center justify-center mb-2 relative overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "absolute top-1 left-1 text-[8px] font-mono text-[#C2654A]/70", children: [
                "F-",
                String(i + 1).padStart(2, "0")
              ] }),
              /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 60 80", className: "w-3/4 h-3/4 text-[#F1DDD2]/55", role: "img", "aria-label": f.label, children: [
                f.glyph === "hero" && /* @__PURE__ */ jsxs("g", { fill: "currentColor", children: [
                  /* @__PURE__ */ jsx("rect", { x: "8", y: "14", width: "44", height: "44", rx: "3", opacity: "0.25" }),
                  /* @__PURE__ */ jsx("circle", { cx: "30", cy: "34", r: "9", opacity: "0.7" }),
                  /* @__PURE__ */ jsx("rect", { x: "14", y: "50", width: "32", height: "4", opacity: "0.5" }),
                  /* @__PURE__ */ jsx("rect", { x: "18", y: "58", width: "24", height: "3", opacity: "0.4" })
                ] }),
                f.glyph === "model" && /* @__PURE__ */ jsxs("g", { fill: "currentColor", children: [
                  /* @__PURE__ */ jsx("circle", { cx: "30", cy: "22", r: "7", opacity: "0.8" }),
                  /* @__PURE__ */ jsx("path", { d: "M18 36 Q30 32 42 36 L44 60 Q30 64 16 60 Z", opacity: "0.6" }),
                  /* @__PURE__ */ jsx("rect", { x: "24", y: "60", width: "4", height: "14", opacity: "0.5" }),
                  /* @__PURE__ */ jsx("rect", { x: "32", y: "60", width: "4", height: "14", opacity: "0.5" })
                ] }),
                f.glyph === "swatch" && /* @__PURE__ */ jsx("g", { fill: "currentColor", children: [0, 1, 2].map((r) => [0, 1, 2].map((c) => /* @__PURE__ */ jsx("rect", { x: 10 + c * 15, y: 14 + r * 18, width: "12", height: "14", opacity: 0.3 + (r + c) % 5 * 0.13 }, `${r}-${c}`))) }),
                f.glyph === "flat" && /* @__PURE__ */ jsxs("g", { fill: "currentColor", children: [
                  /* @__PURE__ */ jsx("rect", { x: "8", y: "14", width: "44", height: "50", rx: "2", opacity: "0.18" }),
                  /* @__PURE__ */ jsx("rect", { x: "14", y: "20", width: "14", height: "14", opacity: "0.6" }),
                  /* @__PURE__ */ jsx("circle", { cx: "42", cy: "27", r: "7", opacity: "0.55" }),
                  /* @__PURE__ */ jsx("rect", { x: "14", y: "38", width: "32", height: "3", opacity: "0.4" }),
                  /* @__PURE__ */ jsx("rect", { x: "14", y: "44", width: "20", height: "3", opacity: "0.4" }),
                  /* @__PURE__ */ jsx("rect", { x: "14", y: "52", width: "32", height: "8", rx: "1", opacity: "0.5" })
                ] }),
                f.glyph === "ghost" && /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.7", children: [
                  /* @__PURE__ */ jsx("path", { d: "M22 18 L18 26 L16 50 L24 56 L36 56 L44 50 L42 26 L38 18 Z" }),
                  /* @__PURE__ */ jsx("path", { d: "M22 18 Q30 14 38 18" }),
                  /* @__PURE__ */ jsx("line", { x1: "22", y1: "32", x2: "38", y2: "32", strokeDasharray: "2 2", opacity: "0.4" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold text-[#F1DDD2] px-1", children: f.label }),
            /* @__PURE__ */ jsxs("div", { className: "text-[9px] font-mono text-[#C2654A] px-1 flex items-center justify-between mt-0.5", children: [
              /* @__PURE__ */ jsx("span", { children: f.count }),
              /* @__PURE__ */ jsx("span", { className: "opacity-70", children: f.aspect })
            ] })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-1 mt-1", children: Array.from({ length: 24 }).map((_, n) => /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-[#C2654A]/20 rounded-[1px]" }, n)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[9px] font-mono text-[#C2654A] items-center", children: [
        /* @__PURE__ */ jsx("span", { children: "PRE-PRO" }),
        /* @__PURE__ */ jsx("div", { className: "h-2 rounded-sm bg-[#C2654A]/30 relative", children: /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1/4 bg-[#C2654A] rounded-sm" }) }),
        /* @__PURE__ */ jsx("span", { children: "SHOOT" }),
        /* @__PURE__ */ jsx("div", { className: "h-2 rounded-sm bg-[#C2654A]/30 relative", children: /* @__PURE__ */ jsx("div", { className: "absolute left-1/4 top-0 bottom-0 w-2/4 bg-[#C2654A] rounded-sm" }) }),
        /* @__PURE__ */ jsx("span", { children: "DELIVERY" }),
        /* @__PURE__ */ jsx("div", { className: "h-2 rounded-sm bg-[#C2654A]/30 relative", children: /* @__PURE__ */ jsx("div", { className: "absolute left-3/4 top-0 bottom-0 w-1/4 bg-[#C2654A] rounded-sm" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-10 py-7 grid sm:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C2654A] mb-3", children: "On set" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: service.includes.map((i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2 text-[13px] text-[#2A140C]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#C2654A]", children: "●" }),
          /* @__PURE__ */ jsx("span", { children: i })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C2654A] mb-3", children: "Production days" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 mb-6", children: service.steps.map((s, i) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-[11px] font-mono text-[#C2654A]", children: [
            "DAY 0",
            i + 1
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-[14px] font-semibold text-[#2A140C]", children: s.title }),
          /* @__PURE__ */ jsx("div", { className: "text-[12px] text-[#2A140C]/70", children: s.desc })
        ] }, s.title)) }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: goToPricing,
            className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C2654A] hover:bg-[#a8543c] text-white font-semibold text-sm transition-all",
            children: [
              "Get pricing for shoot day ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          }
        )
      ] })
    ] })
  ] }) });
};
const NotebookModal = ({ service, open, onOpenChange }) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: "max-w-3xl p-0 overflow-hidden bg-white border-[#0E0E0E]/20 max-h-[90vh] overflow-y-auto [&>button]:text-[#0E0E0E]",
      style: {
        backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(14,14,14,0.07) 31px, rgba(14,14,14,0.07) 32px)",
        backgroundColor: "#FFFEF7"
      },
      children: [
        /* @__PURE__ */ jsx(Hidden, { s: service }),
        /* @__PURE__ */ jsx("div", { className: "absolute left-14 top-0 bottom-0 w-px bg-[#FFB1B1]/60" }),
        /* @__PURE__ */ jsxs("div", { className: "pl-20 pr-10 pt-10 pb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-md bg-[#0E0E0E] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[#FFF59A]" }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono uppercase tracking-[0.25em] text-[#0E0E0E]/60", children: [
              "DRAFT v",
              service.number,
              " · Listing Copy"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-[#0E0E0E] mb-4 leading-[1.1]", children: /* @__PURE__ */ jsx("span", { className: "bg-[#FFF59A] px-2 box-decoration-clone", children: service.tagline }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[#0E0E0E]/75 text-[15px] leading-[2rem] font-mono", children: service.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pl-20 pr-10 py-6", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.25em] text-[#0E0E0E]/60 mb-3", children: "// Scope" }),
          /* @__PURE__ */ jsx("ol", { className: "space-y-2 mb-7", children: service.includes.map((i, idx) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: "flex gap-3 text-[14px] text-[#0E0E0E] font-mono leading-[2rem]",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[#0E0E0E]/40 w-6", children: [
                  idx + 1,
                  "."
                ] }),
                /* @__PURE__ */ jsx("span", { children: i })
              ]
            },
            i
          )) }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.25em] text-[#0E0E0E]/60 mb-3", children: "// Deliverables" }),
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-3 gap-3 mb-7", children: service.deliverables.map((d) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "border-2 border-[#0E0E0E] bg-white p-3",
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-[#0E0E0E]", children: /* @__PURE__ */ jsx("span", { className: "bg-[#FFF59A] px-1", children: d.title }) }),
                /* @__PURE__ */ jsx("div", { className: "text-[12px] text-[#0E0E0E]/70 mt-1 font-mono", children: d.desc })
              ]
            },
            d.title
          )) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: goToPricing,
              className: "inline-flex items-center gap-2 px-6 py-3 bg-[#0E0E0E] text-[#FFF59A] font-mono font-bold text-sm hover:bg-black transition-colors",
              children: "✎ Get pricing for copy"
            }
          )
        ] })
      ]
    }
  ) });
};
const ServiceDetailModal = ({
  service,
  open,
  onOpenChange
}) => {
  if (!service) return null;
  const props = { service, open, onOpenChange };
  switch (service.theme.modalVariant) {
    case "side-sheet":
      return /* @__PURE__ */ jsx(SideSheetModal, { ...props });
    case "dark-checklist":
      return /* @__PURE__ */ jsx(DarkChecklistModal, { ...props });
    case "gallery":
      return /* @__PURE__ */ jsx(GalleryModal, { ...props });
    case "magazine":
      return /* @__PURE__ */ jsx(MagazineModal, { ...props });
    case "render-queue":
      return /* @__PURE__ */ jsx(RenderQueueModal, { ...props });
    case "contact-sheet":
      return /* @__PURE__ */ jsx(ContactSheetModal, { ...props });
    case "notebook":
      return /* @__PURE__ */ jsx(NotebookModal, { ...props });
  }
};
const ShopifyCard = ({ service, onOpen, index }) => {
  const Icon = service.icon;
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      type: "button",
      onClick: onOpen,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, delay: index * 0.04 },
      className: "group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#F4F8EC] border border-[#5E8E3E]/25 p-7",
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute -right-4 -bottom-8 text-[180px] font-semibold leading-none text-[#5E8E3E]/10 select-none", children: service.number }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-[#5E8E3E] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5E8E3E]", children: "Shopify" })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "relative text-xl font-semibold text-[#0E2A12] mb-2 leading-snug", children: service.name }),
        /* @__PURE__ */ jsx("p", { className: "relative text-[#3a5a3e] text-[14px] font-light leading-relaxed flex-1 mb-6", children: service.summary }),
        /* @__PURE__ */ jsxs("div", { className: "relative inline-flex items-center gap-2 text-[#5E8E3E] text-[13px] font-semibold", children: [
          "Open build sheet",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" })
        ] })
      ]
    }
  );
};
const AmazonCard = ({ service, onOpen, index }) => {
  const Icon = service.icon;
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      type: "button",
      onClick: onOpen,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, delay: index * 0.04 },
      className: "group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#131A22] p-7 border border-[#FF9900]/20",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-[#FF9900] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[#131A22]" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FF9900]", children: [
            "Service ",
            service.number
          ] })
        ] }),
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-white mb-2 leading-snug", children: [
          service.name,
          /* @__PURE__ */ jsx("span", { className: "block w-12 h-[3px] bg-[#FF9900] mt-3" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-white/60 text-[14px] font-light leading-relaxed flex-1 mb-6 mt-3", children: service.summary }),
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-[#FF9900] text-[13px] font-semibold", children: [
          "See the checklist",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" })
        ] })
      ]
    }
  );
};
const APlusCard = ({ service, onOpen, index }) => {
  const Icon = service.icon;
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      type: "button",
      onClick: onOpen,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, delay: index * 0.04 },
      className: "group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl p-7 border border-[#6B2E8C]/30",
      style: {
        background: "linear-gradient(135deg, #F5ECF8 0%, #EFE3F5 50%, #E5D2EE 100%)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-full bg-[#6B2E8C] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B2E8C]", children: [
            "Module ",
            service.number
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif italic text-[#2A0F3A] mb-2 leading-snug", children: service.name }),
        /* @__PURE__ */ jsx("p", { className: "text-[#4A2A5C] text-[14px] font-light leading-relaxed flex-1 mb-6", children: service.summary }),
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-[#6B2E8C] text-[13px] font-semibold", children: [
          "Browse modules",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" })
        ] })
      ]
    }
  );
};
const StorefrontCard = ({ service, onOpen, index }) => {
  const Icon = service.icon;
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      type: "button",
      onClick: onOpen,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, delay: index * 0.04 },
      className: "group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#F4ECDD] border-2 border-[#1C1C1C] p-7",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-6 pb-4 border-b border-[#1C1C1C]/30", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono uppercase tracking-[0.3em] text-[#1C1C1C]", children: [
            "ED. ",
            service.number,
            " / Design"
          ] }),
          /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[#1C1C1C]" })
        ] }),
        /* @__PURE__ */ jsxs("h3", { className: "text-3xl font-semibold tracking-[-0.03em] text-[#1C1C1C] leading-[0.95] mb-4", children: [
          service.name,
          "."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[#1C1C1C]/70 text-[14px] font-light leading-relaxed flex-1 mb-6", children: service.summary }),
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-[#1C1C1C] text-[13px] font-semibold border-b border-[#1C1C1C] pb-1 self-start", children: [
          "Read the spread",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3.5 w-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" })
        ] })
      ]
    }
  );
};
const ImagingCard = ({ service, onOpen, index }) => {
  const Icon = service.icon;
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      type: "button",
      onClick: onOpen,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, delay: index * 0.04 },
      className: "group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#08111F] p-7 border border-[#2B6CFF]/30",
      style: {
        backgroundImage: "linear-gradient(rgba(43,108,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,108,255,0.08) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundColor: "#08111F"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-md bg-[#2B6CFF] flex items-center justify-center shadow-[0_0_20px_rgba(43,108,255,0.5)]", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono uppercase tracking-[0.2em] text-[#2B6CFF]", children: [
            "R-",
            service.number
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-white mb-2 leading-snug", children: service.name }),
        /* @__PURE__ */ jsx("p", { className: "text-white/55 text-[14px] font-light leading-relaxed flex-1 mb-6", children: service.summary }),
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 text-[#2B6CFF] text-[13px] font-mono font-semibold", children: "▸ View render queue" })
      ]
    }
  );
};
const PhotoCard = ({ service, onOpen, index }) => {
  const Icon = service.icon;
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      type: "button",
      onClick: onOpen,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, delay: index * 0.04 },
      className: "group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-[#F1DDD2] p-7 border border-[#C2654A]/30",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-full bg-[#2A140C] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[#C2654A]" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2A140C]", children: [
            "Roll · ",
            service.number
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-[#2A140C] mb-2 leading-snug", children: service.name }),
        /* @__PURE__ */ jsx("p", { className: "text-[#2A140C]/70 text-[14px] font-light leading-relaxed flex-1 mb-6", children: service.summary }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 -mx-1 mb-3", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex-1 aspect-[3/2] rounded-sm bg-[#2A140C]/80 relative overflow-hidden",
            children: /* @__PURE__ */ jsx("div", { className: "absolute inset-1 border border-[#C2654A]/30 rounded-[2px]" })
          },
          i
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-[#C2654A] text-[13px] font-semibold", children: [
          "Open contact sheet",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" })
        ] })
      ]
    }
  );
};
const ListingCard = ({ service, onOpen, index }) => {
  const Icon = service.icon;
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      type: "button",
      onClick: onOpen,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5, delay: index * 0.04 },
      className: "group relative text-left rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:-translate-y-0.5 transition-all hover:shadow-xl bg-white p-7 border border-[#0E0E0E]/15",
      style: {
        backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(14,14,14,0.05) 27px, rgba(14,14,14,0.05) 28px)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-md bg-[#0E0E0E] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[#FFF59A]" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono uppercase tracking-[0.25em] text-[#0E0E0E]/60", children: [
            "DRAFT v",
            service.number
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-[#0E0E0E] mb-3 leading-snug", children: /* @__PURE__ */ jsx("span", { className: "bg-[#FFF59A] px-1 box-decoration-clone", children: service.name }) }),
        /* @__PURE__ */ jsx("p", { className: "text-[#0E0E0E]/65 text-[14px] font-light leading-relaxed flex-1 mb-6 font-mono", children: service.summary }),
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-[#0E0E0E] text-[13px] font-semibold", children: [
          "Open the notebook",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" })
        ] })
      ]
    }
  );
};
const ServiceCard = ({ service, onOpen, index }) => {
  switch (service.theme.cardVariant) {
    case "shopify":
      return /* @__PURE__ */ jsx(ShopifyCard, { service, onOpen, index });
    case "amazon":
      return /* @__PURE__ */ jsx(AmazonCard, { service, onOpen, index });
    case "aplus":
      return /* @__PURE__ */ jsx(APlusCard, { service, onOpen, index });
    case "storefront":
      return /* @__PURE__ */ jsx(StorefrontCard, { service, onOpen, index });
    case "imaging":
      return /* @__PURE__ */ jsx(ImagingCard, { service, onOpen, index });
    case "photo":
      return /* @__PURE__ */ jsx(PhotoCard, { service, onOpen, index });
    case "listing":
      return /* @__PURE__ */ jsx(ListingCard, { service, onOpen, index });
  }
};
const meta = generateMetaTags(
  "Westfield Launchpad | Shopify, Amazon & Product Media Services in LA",
  "Get your product off the ground with Shopify setup, Amazon Seller Central & A+ content, 3D product imaging, and pro studio photography from Westfield's Los Angeles team.",
  "/launchpad"
);
const steps = [
  { n: "01", title: "Discovery", desc: "We learn the product, the buyer, and the channel goals." },
  { n: "02", title: "Asset Plan", desc: "Shot list, render plan, channel checklist, and timeline." },
  { n: "03", title: "Production", desc: "Studio shoots, 3D renders, store builds, and listing pages." },
  { n: "04", title: "Launch", desc: "Live store, live listings, ready-to-fulfill from our LA warehouse." }
];
const faqs = [
  {
    q: "Do I need to be a fulfillment client to use Launchpad?",
    a: "No. Launchpad is open to any seller. You can use our creative and setup services without ever shipping a unit through our warehouse, but most clients pair the two so launch and logistics live under one roof.",
    cat: "Logistics"
  },
  {
    q: "How long does a typical launch project take?",
    a: "Most Shopify builds and Amazon listing packages wrap in 2 to 4 weeks. Studio shoots are scheduled inside the same window. Complex 3D imaging or large catalogs may extend the timeline, and we will tell you upfront.",
    cat: "Timeline"
  },
  {
    q: "Do I ship product to your studio for photography?",
    a: "Yes. Our Los Angeles studio receives samples directly. If you are already storing inventory with us, we just pull a unit from your shelf for the shoot, no extra shipping required.",
    cat: "Logistics"
  },
  {
    q: "What file formats do I get for imagery and assets?",
    a: "You get web-ready JPG and PNG, plus high-resolution masters. For 3D we deliver still renders and 360 spins. For listings we deliver Amazon-ready images sized to spec, plus source files on request.",
    cat: "Creative"
  },
  {
    q: "Who owns the assets after the project is done?",
    a: "You do. Final images, copy, store files, and renders are yours to keep, reuse, and license to retailers or distributors.",
    cat: "Creative"
  },
  {
    q: "Can you set up Seller Central and Brand Registry for me?",
    a: "Yes. We handle Seller Central registration, Brand Registry, ungating in restricted categories, and parent or child variation trees so you launch clean and stay compliant.",
    cat: "Setup"
  },
  {
    q: "Do you write the listing copy and keywords too?",
    a: "Yes. Titles, bullets, descriptions, and backend search terms are written by operators who actually sell on these platforms, tuned to rank and convert.",
    cat: "Setup"
  }
];
const FAQ_CATEGORIES = ["All", "Setup", "Creative", "Timeline", "Logistics"];
const Launchpad = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState(0);
  const [activeService, setActiveService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickerSlug, setPickerSlug] = useState(LAUNCHPAD_SERVICES[0].slug);
  const [stack, setStack] = useState([]);
  const pickerService = LAUNCHPAD_SERVICES.find((s) => s.slug === pickerSlug) || LAUNCHPAD_SERVICES[0];
  const toggleStack = (slug) => setStack((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  const goToQuote = () => {
    if (stack.length === 0) return navigate("/contact?service=launchpad");
    navigate(`/contact?service=launchpad&focus=${stack.join(",")}`);
  };
  const [faqCategory, setFaqCategory] = useState("All");
  const visibleFaqs = faqCategory === "All" ? faqs : faqs.filter((f) => f.cat === faqCategory);
  const openService = (service) => {
    setActiveService(service);
    setModalOpen(true);
  };
  useEffect(() => {
    const slug = searchParams.get("service");
    const svc = getServiceBySlug(slug);
    if (svc) {
      setActiveService(svc);
      setModalOpen(true);
    }
  }, [searchParams]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: meta.title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: meta.description }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: meta.canonical }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: meta.ogTitle }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: meta.ogDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: meta.ogUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: meta.ogImage }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: meta.twitterTitle }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: meta.twitterDescription }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: meta.twitterImage }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#f6f1ea]", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", { children: [
        /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden pt-32 pb-28 md:pt-44 md:pb-36 bg-[#f6f1ea]", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#f6f1ea] via-[#efe7db] to-[#e8dcc9]" }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 opacity-[0.04]",
              style: {
                backgroundImage: "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
                backgroundSize: "80px 80px"
              }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 -right-32 w-[520px] h-[520px] bg-[#c97b54]/15 rounded-full blur-[120px]" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 -left-32 w-[420px] h-[420px] bg-[#d4a574]/20 rounded-full blur-[100px]" }),
          /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6 },
                className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1a1a1a]/15 bg-white/60 backdrop-blur-sm text-[#1a1a1a] text-[11px] font-semibold uppercase tracking-[0.2em] mb-8",
                children: [
                  /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-[#c97b54]" }),
                  "Westfield Launchpad"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.h1,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.7, delay: 0.1 },
                className: "text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-[-0.03em] leading-[0.95] text-[#1a1a1a] mb-8",
                children: [
                  "Launch faster.",
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("span", { className: "italic font-light text-[#c97b54]", children: "Sell smarter." })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              motion.p,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.7, delay: 0.2 },
                className: "text-lg md:text-xl text-[#3a3a3a] max-w-2xl mx-auto mb-12 leading-relaxed font-light",
                children: "Shopify dashboards, Amazon Seller Central, A+ content, 3D product imaging, and studio photography. We make your product look launch ready from day one, all from our Los Angeles studio and warehouse."
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.7, delay: 0.3 },
                className: "flex flex-col sm:flex-row justify-center gap-3 mb-14",
                children: [
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: "#services",
                      className: "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f6f1ea] font-medium text-base transition-all hover:-translate-y-0.5",
                      children: [
                        "Explore Services",
                        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => navigate("/contact?service=launchpad"),
                      className: "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent hover:bg-[#1a1a1a]/5 text-[#1a1a1a] font-medium text-base border border-[#1a1a1a]/20 transition-all",
                      children: "Get Pricing"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.7, delay: 0.5 },
                className: "flex items-center justify-center gap-2 flex-wrap",
                children: [
                  { Icon: SiShopify, label: "Shopify" },
                  { Icon: SiAmazon, label: "Amazon" },
                  { Icon: SiTiktok, label: "TikTok Shop" },
                  { Icon: SiWalmart, label: "Walmart" }
                ].map(({ Icon, label }) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/50 border border-[#1a1a1a]/10 backdrop-blur-sm text-[#3a3a3a] text-xs font-medium",
                    children: [
                      /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
                      label
                    ]
                  },
                  label
                ))
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "py-24 md:py-28 bg-[#f6f1ea] border-y border-[#1a1a1a]/10", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 max-w-6xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-10 max-w-2xl", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4", children: "Start Here" }),
            /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5 leading-[1.05]", children: [
              "Build your ",
              /* @__PURE__ */ jsx("span", { className: "italic font-light text-[#c97b54]", children: "launch stack." })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[#5a5a5a] text-lg leading-relaxed font-light", children: "Pick what you need. We will quote it as one package, run it as one project, and bill it on one invoice." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/70 backdrop-blur-sm border border-[#1a1a1a]/10 shadow-[0_30px_80px_-30px_rgba(26,26,26,0.18)] overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[340px_1fr]", children: [
              /* @__PURE__ */ jsx("div", { className: "border-b lg:border-b-0 lg:border-r border-[#1a1a1a]/10 bg-[#f6f1ea]/60 p-3", children: /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: LAUNCHPAD_SERVICES.map((s) => {
                const isActive = pickerSlug === s.slug;
                const isSelected = stack.includes(s.slug);
                return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onMouseEnter: () => setPickerSlug(s.slug),
                    onClick: () => setPickerSlug(s.slug),
                    className: `group w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${isActive ? "bg-white border-l-2 border-[#c97b54] shadow-sm" : "border-l-2 border-transparent hover:bg-white/60"}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { className: `text-[10px] font-mono tracking-wider ${isActive ? "text-[#c97b54]" : "text-[#5a5a5a]"}`, children: s.number }),
                      /* @__PURE__ */ jsx("span", { className: `flex-1 text-[14px] font-medium ${isActive ? "text-[#1a1a1a]" : "text-[#3a3a3a]"}`, children: s.shortName }),
                      isSelected && /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-[#c97b54] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Check, { className: "h-2.5 w-2.5 text-white", strokeWidth: 3 }) }),
                      isActive && !isSelected && /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#c97b54]" })
                    ]
                  }
                ) }, s.slug);
              }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "p-8 md:p-10 bg-white", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono tracking-[0.2em] text-[#c97b54] mb-3", children: [
                  pickerService.number,
                  " · PREVIEW"
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[#1a1a1a] leading-[1.15] mb-3", children: pickerService.tagline }),
                /* @__PURE__ */ jsx("p", { className: "text-[#5a5a5a] text-[15px] leading-relaxed font-light mb-6", children: pickerService.summary }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-8", children: pickerService.deliverables.slice(0, 3).map((d) => /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6f1ea] border border-[#1a1a1a]/10 text-[12px] font-medium text-[#1a1a1a]",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-[#c97b54]" }),
                      d.title
                    ]
                  },
                  d.title
                )) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggleStack(pickerService.slug),
                      className: `inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all ${stack.includes(pickerService.slug) ? "bg-[#1a1a1a] text-[#f6f1ea] hover:bg-[#2a2a2a]" : "bg-[#c97b54] text-white hover:bg-[#b86c47]"}`,
                      children: stack.includes(pickerService.slug) ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }),
                        " Added to stack"
                      ] }) : /* @__PURE__ */ jsx(Fragment, { children: "+ Add to my stack" })
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => openService(pickerService),
                      className: "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#1a1a1a]/15 text-[#1a1a1a] font-medium text-sm hover:bg-[#f6f1ea] transition-all",
                      children: [
                        "See full details ",
                        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-[#1a1a1a]/10 bg-[#f6f1ea]/40 px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono tracking-[0.2em] text-[#5a5a5a] mb-2", children: [
                  "YOUR STACK · ",
                  stack.length
                ] }),
                stack.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-[14px] text-[#5a5a5a] font-light italic", children: "Nothing added yet. Pick a service above, or just book a call." }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: stack.map((slug) => {
                  const s = LAUNCHPAD_SERVICES.find((x) => x.slug === slug);
                  return /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-white border border-[#1a1a1a]/10 text-[13px] font-medium text-[#1a1a1a]",
                      children: [
                        s.shortName,
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => toggleStack(slug),
                            className: "w-4 h-4 rounded-full bg-[#1a1a1a]/10 hover:bg-[#c97b54] hover:text-white text-[#5a5a5a] flex items-center justify-center text-[10px] leading-none transition-colors",
                            "aria-label": `Remove ${s.shortName}`,
                            children: "×"
                          }
                        )
                      ]
                    },
                    slug
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: goToQuote,
                  className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1a] text-[#f6f1ea] font-semibold text-sm hover:bg-[#2a2a2a] transition-all flex-shrink-0",
                  children: [
                    stack.length === 0 ? "Book a call" : `Get a quote (${stack.length})`,
                    /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                  ]
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("section", { id: "services", className: "py-28 md:py-32 bg-[#f6f1ea]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mb-16", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4", children: "Our Services" }),
            /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5", children: "What we help with" }),
            /* @__PURE__ */ jsx("p", { className: "text-[#5a5a5a] text-lg leading-relaxed font-light", children: "Tap any service to see what's included, deliverables, and how it works. One team, one timeline, one invoice." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: LAUNCHPAD_SERVICES.map((s, idx) => /* @__PURE__ */ jsx(
            ServiceCard,
            {
              service: s,
              index: idx,
              onOpen: () => openService(s)
            },
            s.slug
          )) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-28 md:py-32 bg-[#efe7db]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mb-16", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4", children: "Process" }),
            /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5", children: "How it works" }),
            /* @__PURE__ */ jsx("p", { className: "text-[#5a5a5a] text-lg leading-relaxed font-light", children: "A simple, transparent path from first call to first sale." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-4 gap-px bg-[#1a1a1a]/10 border border-[#1a1a1a]/10", children: steps.map((step, idx) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: idx * 0.08 },
              className: "bg-[#efe7db] hover:bg-[#f6f1ea] transition-all p-8",
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-[#c97b54] text-sm font-semibold tracking-[0.15em] mb-4", children: step.n }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold tracking-[-0.01em] text-[#1a1a1a] mb-3", children: step.title }),
                /* @__PURE__ */ jsx("p", { className: "text-[#5a5a5a] text-[15px] leading-relaxed font-light", children: step.desc })
              ]
            },
            step.n
          )) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-28 md:py-32 bg-[#f6f1ea]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mb-16", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4", children: "Why Launchpad" }),
            /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-5", children: "Why sellers use Launchpad" }),
            /* @__PURE__ */ jsx("p", { className: "text-[#5a5a5a] text-lg leading-relaxed font-light", children: "One team, one timeline, one invoice. Built by operators who actually run stores." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6 max-w-6xl", children: [
            {
              Icon: Rocket,
              stat: "2 to 4 wks",
              label: "Typical launch window",
              desc: "Store, listings, and assets live in under a month for most projects."
            },
            {
              Icon: Layers,
              stat: "1 vendor",
              label: "Instead of five",
              desc: "Stop coordinating photographers, devs, and copywriters. We do it all."
            },
            {
              Icon: Users,
              stat: "100% yours",
              label: "Asset ownership",
              desc: "Every file, image, and storefront belongs to you forever."
            }
          ].map((m) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-white border border-[#1a1a1a]/10 rounded-2xl p-10",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(m.Icon, { className: "h-5 w-5 text-[#f6f1ea]" }) }),
                /* @__PURE__ */ jsx("div", { className: "text-4xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-1", children: m.stat }),
                /* @__PURE__ */ jsx("div", { className: "text-[#c97b54] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4", children: m.label }),
                /* @__PURE__ */ jsx("p", { className: "text-[#5a5a5a] text-[15px] leading-relaxed font-light", children: m.desc })
              ]
            },
            m.label
          )) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-28 md:py-32 bg-[#efe7db]", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 max-w-6xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[360px_1fr] gap-12 lg:gap-20", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:sticky lg:top-28 self-start", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-mono tracking-[0.25em] text-[#c97b54] mb-4", children: "FAQ · LAUNCHPAD Q&A" }),
            /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1a1a1a] mb-4 leading-[1.05]", children: [
              "Straight answers, ",
              /* @__PURE__ */ jsx("span", { className: "italic font-light text-[#c97b54]", children: "no filler." })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[#5a5a5a] text-[15px] font-light leading-relaxed mb-8", children: "The questions we hear most from founders the week before they pull the trigger on a launch." }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-8", children: FAQ_CATEGORIES.map((cat) => {
              const active = faqCategory === cat;
              return /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setFaqCategory(cat);
                    setOpenFaq(null);
                  },
                  className: `px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all ${active ? "bg-[#1a1a1a] text-[#f6f1ea] border-[#1a1a1a]" : "bg-transparent text-[#3a3a3a] border-[#1a1a1a]/20 hover:border-[#c97b54] hover:text-[#1a1a1a]"}`,
                  children: cat
                },
                cat
              );
            }) }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a1a1a]/10 bg-[#f6f1ea] p-5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] font-mono tracking-[0.2em] text-[#c97b54] mb-2", children: "STILL STUCK?" }),
              /* @__PURE__ */ jsx("div", { className: "text-[#1a1a1a] font-semibold text-[15px] mb-3 leading-snug", children: "Book a 20 minute call. We will map your launch live." }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => navigate("/contact?service=launchpad"),
                  className: "inline-flex items-center gap-2 text-[13px] font-semibold text-[#c97b54] hover:text-[#b86c47] transition-colors",
                  children: [
                    "Talk to a human ",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            visibleFaqs.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-[#5a5a5a] text-[15px] font-light italic py-8", children: "No questions in this category yet." }),
            /* @__PURE__ */ jsx("ul", { children: visibleFaqs.map((f, idx) => {
              const open = openFaq === idx;
              const num = String(idx + 1).padStart(2, "0");
              return /* @__PURE__ */ jsxs("li", { className: "border-b border-[#1a1a1a]/15 last:border-b-0", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setOpenFaq(open ? null : idx),
                    className: "w-full flex items-start gap-5 md:gap-7 py-6 md:py-7 text-left group",
                    "aria-expanded": open,
                    children: [
                      /* @__PURE__ */ jsx("span", { className: `font-mono text-[13px] md:text-[14px] tabular-nums tracking-wider mt-1 transition-colors ${open ? "text-[#c97b54]" : "text-[#5a5a5a] group-hover:text-[#c97b54]"}`, children: num }),
                      /* @__PURE__ */ jsx("span", { className: `flex-1 text-[18px] md:text-[22px] tracking-[-0.01em] leading-[1.25] transition-all ${open ? "text-[#1a1a1a] font-semibold" : "text-[#1a1a1a]/80 font-medium group-hover:text-[#1a1a1a]"}`, children: f.q }),
                      /* @__PURE__ */ jsx("span", { className: `mt-2 w-7 h-7 rounded-full border border-[#1a1a1a]/15 flex items-center justify-center flex-shrink-0 transition-all ${open ? "bg-[#c97b54] border-[#c97b54] rotate-180" : "bg-transparent group-hover:border-[#c97b54]"}`, children: /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 ${open ? "text-white" : "text-[#5a5a5a]"}` }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 pb-7" : "grid-rows-[0fr] opacity-0"}`,
                    children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "pl-[44px] md:pl-[56px] pr-10 text-[#5a5a5a] text-[15px] md:text-[16px] leading-relaxed font-light", children: [
                      f.a,
                      /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx("span", { className: "inline-block px-2.5 py-0.5 rounded-full bg-[#c97b54]/10 text-[#c97b54] text-[10px] font-mono tracking-wider uppercase", children: f.cat }) })
                    ] }) })
                  }
                )
              ] }, f.q);
            }) })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxs("section", { className: "relative py-28 md:py-36 overflow-hidden bg-[#1a1a1a]", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-[#c97b54]/20 rounded-full blur-[140px]" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#d4a574]/15 rounded-full blur-[120px]" }),
          /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 relative z-10 text-center max-w-3xl", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-[#f6f1ea] mb-6 leading-[1.05]", children: [
              "Ready to launch your ",
              /* @__PURE__ */ jsx("span", { className: "italic font-light text-[#c97b54]", children: "product?" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-[#b8b3aa] mb-12 font-light max-w-xl mx-auto", children: "Book a 20 minute call. We will look at your product, your channel, and tell you exactly what it takes to get to first sale." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-3", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => navigate("/contact?service=launchpad"),
                  className: "inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#c97b54] hover:bg-[#b86c47] text-[#1a1a1a] font-semibold text-base transition-all hover:-translate-y-0.5",
                  children: [
                    "Get Pricing",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => navigate("/why-choose-us"),
                  className: "inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-transparent hover:bg-white/5 text-[#f6f1ea] font-medium text-base border border-white/20 transition-all",
                  children: "Why Choose Westfield"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] }),
    /* @__PURE__ */ jsx(
      ServiceDetailModal,
      {
        service: activeService,
        open: modalOpen,
        onOpenChange: setModalOpen
      }
    )
  ] });
};
export {
  Launchpad as default
};
