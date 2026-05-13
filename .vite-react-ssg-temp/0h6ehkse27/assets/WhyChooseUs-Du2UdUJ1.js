import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { S as StructuredData, H as Header, F as Footer } from "../main.mjs";
import { SiShopify, SiAmazon, SiWalmart, SiTiktok } from "react-icons/si";
import { ShieldCheck, ArrowRight, Camera, RefreshCw, TrendingUp, Anchor, Truck, MapPin, CheckCircle2, Tag, Clock, Box, Sparkles, ShoppingBag, X, Server, Globe, ChevronUp, ChevronDown, HeartHandshake, Inbox, PackageCheck } from "lucide-react";
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
import "@radix-ui/react-dropdown-menu";
const HandUnderline = ({ className = "" }) => /* @__PURE__ */ jsxs(
  "svg",
  {
    viewBox: "0 0 360 28",
    className,
    fill: "none",
    "aria-hidden": "true",
    children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M4 18 C 70 4, 150 4, 220 14 S 330 24, 356 10",
          stroke: "hsl(var(--wcu-sunset))",
          strokeWidth: "5",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M14 24 C 110 18, 230 18, 340 22",
          stroke: "hsl(var(--wcu-sunset-deep))",
          strokeWidth: "2",
          strokeLinecap: "round",
          opacity: "0.55"
        }
      )
    ]
  }
);
const OrganicDivider = ({
  flip = false,
  fromColor = "hsl(var(--wcu-linen))",
  toColor = "hsl(var(--wcu-cream))"
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: "w-full overflow-hidden leading-[0]",
    style: { background: fromColor, transform: flip ? "rotate(180deg)" : void 0 },
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx(
      "svg",
      {
        viewBox: "0 0 1440 90",
        preserveAspectRatio: "none",
        className: "block w-full h-[60px] md:h-[90px]",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M0,40 C240,90 520,0 760,30 C1000,60 1220,90 1440,40 L1440,90 L0,90 Z",
            fill: toColor
          }
        )
      }
    )
  }
);
const HeroBackdrop = () => /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10 overflow-hidden pointer-events-none", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute -top-32 -right-32 w-[720px] h-[720px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--wcu-sunset)/0.45),hsl(var(--wcu-peach)/0.25),transparent_70%)] blur-2xl" }),
  /* @__PURE__ */ jsx("div", { className: "absolute -bottom-40 right-1/4 w-[520px] h-[520px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--wcu-peach)/0.6),transparent_70%)] blur-2xl" }),
  /* @__PURE__ */ jsx(
    "svg",
    {
      className: "absolute -bottom-10 -left-10 w-[640px] h-[420px] opacity-[0.18]",
      viewBox: "0 0 640 420",
      fill: "none",
      "aria-hidden": "true",
      children: Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ jsx(
        "path",
        {
          d: `M0 ${360 - i * 26} C 160 ${320 - i * 26}, 320 ${400 - i * 26}, 640 ${340 - i * 26}`,
          stroke: "hsl(var(--wcu-ink))",
          strokeWidth: "1"
        },
        i
      ))
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 wcu-paper-grain opacity-[0.35] mix-blend-multiply" })
] });
const ComparisonGraphic = () => /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 md:gap-8 my-16", children: [
  /* @__PURE__ */ jsxs("div", { className: "relative rounded-[28px] p-8 md:p-10 bg-[hsl(28_25%_92%)] border border-[hsl(var(--wcu-line))] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -right-8 -top-8 opacity-[0.07] text-[hsl(var(--wcu-ink))]", children: /* @__PURE__ */ jsx(X, { size: 220, strokeWidth: 1.5 }) }),
    /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-ink)/0.06)] text-[hsl(var(--wcu-ink-soft))] text-xs font-semibold mb-5", children: 'The "Black Box" 3PL' }),
    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-[hsl(var(--wcu-ink))] mb-6", children: "How most warehouses still operate." }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-5 relative z-10", children: [
      ["Blind Receiving", "Your stock sits on a dock for 5 days. You don't know it arrived until it's checked in a week later."],
      ["Ghosting Support", "You submit a ticket for a missing order. You get an automated reply. You wait 48 hours for a real human."],
      ["Hidden Fees", "Account Management Fee. Setup Fee. Technology Fee. The invoice is always higher than the quote."]
    ].map(([t, d]) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "mt-1 min-w-[22px] h-[22px] rounded-full bg-[hsl(var(--wcu-ink)/0.08)] flex items-center justify-center", children: /* @__PURE__ */ jsx(X, { size: 12, className: "text-[hsl(var(--wcu-ink-soft))]" }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-[hsl(var(--wcu-ink-soft))] leading-relaxed", children: [
        /* @__PURE__ */ jsxs("strong", { className: "text-[hsl(var(--wcu-ink))] font-semibold", children: [
          t,
          ": "
        ] }),
        d
      ] })
    ] }, t)) })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "relative rounded-[28px] p-8 md:p-10 bg-white border border-[hsl(var(--wcu-sunset)/0.25)] shadow-[0_30px_60px_-30px_hsl(var(--wcu-sunset)/0.35)] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-3 rounded-[22px] border border-dashed border-[hsl(var(--wcu-sunset)/0.35)] pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -right-8 -top-8 opacity-[0.08] text-[hsl(var(--wcu-sunset))]", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 220, strokeWidth: 1.5 }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-sunset)/0.12)] text-[hsl(var(--wcu-sunset-deep))] text-xs font-semibold mb-5", children: "The Westfield Standard" }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-[hsl(var(--wcu-ink))] mb-6", children: "A boutique partner that picks up the phone." }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-5", children: [
        ["24hr Intake", "We scan your ASN within 24 hours. You get a notification, with photos, the moment it hits our dock."],
        ["Direct Slack Access", "You talk to the person packing your boxes. Real-time problem solving, not ticket queues."],
        ["Flat Pricing", "One prep fee. One pick fee. One storage fee. If we didn't quote it, we don't bill it."]
      ].map(([t, d]) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4 items-start", children: [
        /* @__PURE__ */ jsx("div", { className: "mt-1 min-w-[22px] h-[22px] rounded-full bg-[hsl(var(--wcu-sunset))] flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 14, className: "text-white", strokeWidth: 3 }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-[hsl(var(--wcu-ink-soft))] leading-relaxed", children: [
          /* @__PURE__ */ jsxs("strong", { className: "text-[hsl(var(--wcu-ink))] font-semibold", children: [
            t,
            ": "
          ] }),
          d
        ] })
      ] }, t)) })
    ] })
  ] })
] });
const TechStackGraphic = () => /* @__PURE__ */ jsxs("div", { className: "relative p-10 md:p-14 rounded-[32px] bg-[hsl(var(--wcu-cream))] border border-[hsl(var(--wcu-line))] my-12 overflow-hidden", children: [
  /* @__PURE__ */ jsx(
    "div",
    {
      className: "absolute inset-0 opacity-40",
      style: {
        backgroundImage: "radial-gradient(hsl(var(--wcu-ink) / 0.12) 1px, transparent 1px)",
        backgroundSize: "22px 22px"
      }
    }
  ),
  /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative mb-12", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-[hsl(var(--wcu-sunset)/0.35)] blur-2xl" }),
      /* @__PURE__ */ jsx("div", { className: "relative w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center shadow-[0_18px_40px_-10px_hsl(var(--wcu-sunset)/0.55)]", children: /* @__PURE__ */ jsx(Server, { size: 40, className: "text-white" }) })
    ] }),
    /* @__PURE__ */ jsxs(
      "svg",
      {
        className: "absolute top-[64px] left-1/2 -translate-x-1/2 w-[88%] h-[80px] pointer-events-none hidden md:block",
        viewBox: "0 0 800 80",
        fill: "none",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsx("path", { d: "M100 70 C 200 10, 320 10, 400 35", stroke: "hsl(var(--wcu-sunset))", strokeWidth: "2", strokeDasharray: "6 6", strokeLinecap: "round", opacity: "0.7" }),
          /* @__PURE__ */ jsx("path", { d: "M700 70 C 600 10, 480 10, 400 35", stroke: "hsl(var(--wcu-sunset))", strokeWidth: "2", strokeDasharray: "6 6", strokeLinecap: "round", opacity: "0.7" }),
          /* @__PURE__ */ jsx("path", { d: "M280 78 L 360 40", stroke: "hsl(var(--wcu-sunset))", strokeWidth: "2", strokeDasharray: "6 6", strokeLinecap: "round", opacity: "0.7" }),
          /* @__PURE__ */ jsx("path", { d: "M520 78 L 440 40", stroke: "hsl(var(--wcu-sunset))", strokeWidth: "2", strokeDasharray: "6 6", strokeLinecap: "round", opacity: "0.7" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-4xl", children: [
      { icon: ShoppingBag, label: "Shopify / Plus", desc: "Real-time bi-directional sync" },
      { icon: Box, label: "Amazon FBA", desc: "FNSKU & prep compliance" },
      { icon: TrendingUp, label: "TikTok Shop", desc: "48hr SLA adherence" },
      { icon: Globe, label: "B2B / EDI", desc: "Retail routing guides" }
    ].map((item, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white rounded-2xl border border-[hsl(var(--wcu-line))] p-6 text-center hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_hsl(var(--wcu-sunset)/0.35)] hover:border-[hsl(var(--wcu-sunset)/0.4)] transition-all group",
        children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto w-11 h-11 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center mb-3 group-hover:bg-[hsl(var(--wcu-sunset))] group-hover:text-white transition-colors", children: /* @__PURE__ */ jsx(item.icon, { size: 20 }) }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-[hsl(var(--wcu-ink))] text-sm mb-1", children: item.label }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-[hsl(var(--wcu-ink-soft))]", children: item.desc })
        ]
      },
      i
    )) })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "relative text-center mt-8", children: /* @__PURE__ */ jsx("p", { className: "text-[hsl(var(--wcu-ink-soft))] text-sm", children: "+ Native integrations for Walmart, eBay, Etsy, WooCommerce, and 50+ others via middleware." }) })
] });
const journeySteps = [
  { icon: HeartHandshake, title: "Welcome", desc: "Onboarding call, SLA, and a real human assigned to your brand." },
  { icon: Inbox, title: "Receive", desc: "ASN scanned within 24 hrs. Photos posted before unloading is done." },
  { icon: PackageCheck, title: "Prep", desc: "FNSKU, polybag, kit, label — done to spec, photographed, logged." },
  { icon: Truck, title: "Ship", desc: "Same-day cutoff. Zone-skipped via SoCal carrier hubs." },
  { icon: Sparkles, title: "Care", desc: "Returns inspected, graded, and re-stocked with photo proof." }
];
const JourneyPath = () => /* @__PURE__ */ jsxs("div", { className: "relative py-12 md:py-16", children: [
  /* @__PURE__ */ jsx(
    "svg",
    {
      className: "hidden md:block absolute inset-x-0 top-[110px] h-[180px] w-full pointer-events-none",
      viewBox: "0 0 1200 180",
      preserveAspectRatio: "none",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M60 90 C 220 10, 380 170, 540 90 S 860 10, 1020 90 S 1180 130, 1180 90",
          stroke: "hsl(var(--wcu-sunset))",
          strokeWidth: "2.5",
          strokeDasharray: "8 10",
          strokeLinecap: "round",
          fill: "none",
          opacity: "0.6"
        }
      )
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "relative grid md:grid-cols-5 gap-8 md:gap-4", children: journeySteps.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center text-center", children: [
    i < journeySteps.length - 1 && /* @__PURE__ */ jsx("div", { className: "md:hidden absolute left-1/2 top-[88px] bottom-[-40px] w-px border-l-2 border-dashed border-[hsl(var(--wcu-sunset)/0.4)]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-[hsl(var(--wcu-sunset)/0.25)] blur-xl" }),
      /* @__PURE__ */ jsx("div", { className: "relative w-20 h-20 rounded-full bg-white border border-[hsl(var(--wcu-line))] shadow-[0_20px_40px_-20px_hsl(var(--wcu-ink)/0.25)] flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center text-white", children: /* @__PURE__ */ jsx(s.icon, { size: 24 }) }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[hsl(var(--wcu-ink))] text-white text-xs font-semibold flex items-center justify-center font-mono", children: String(i + 1).padStart(2, "0") })
    ] }),
    /* @__PURE__ */ jsx("h3", { className: "mt-5 text-lg font-semibold text-[hsl(var(--wcu-ink))]", children: s.title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[hsl(var(--wcu-ink-soft))] max-w-[200px] leading-relaxed", children: s.desc })
  ] }, s.title)) })
] });
const FAQItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "border-b border-[hsl(var(--wcu-line))] last:border-0", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "w-full py-6 text-left flex items-center justify-between hover:text-[hsl(var(--wcu-sunset-deep))] transition-colors focus:outline-none",
        onClick: () => setIsOpen(!isOpen),
        children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-lg text-[hsl(var(--wcu-ink))] pr-8", children: q }),
          /* @__PURE__ */ jsx("span", { className: "w-8 h-8 rounded-full bg-[hsl(var(--wcu-peach)/0.5)] text-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center flex-shrink-0", children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, { size: 18 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 18 }) })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: "pb-6 text-[hsl(var(--wcu-ink-soft))] leading-relaxed animate-in fade-in slide-in-from-top-2", children: a })
  ] });
};
const WhyChooseUs = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Why Choose Our Los Angeles Prep Center | Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Discover why e-commerce sellers choose Westfield Prep Center in Los Angeles. Photo-proof QC, same-day processing, boutique service, and full insurance coverage. Learn what makes us different."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/why-choose-us/" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Why Choose Our Los Angeles Prep Center | Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          property: "og:description",
          content: "Discover why e-commerce sellers choose Westfield Prep Center in Los Angeles. Photo-proof QC, same-day processing, boutique service, and full insurance coverage."
        }
      ),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/why-choose-us/" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          property: "og:image",
          content: "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
        }
      ),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Why Choose Our Los Angeles Prep Center | Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "twitter:description",
          content: "Discover why e-commerce sellers choose Westfield Prep Center. Photo-proof QC, same-day processing, boutique service, and full insurance coverage."
        }
      ),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "twitter:image",
          content: "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      StructuredData,
      {
        type: "service",
        data: {
          name: "Boutique Fulfillment Services",
          description: "White-glove prep center and fulfillment services in Los Angeles. Specializing in Amazon FBA prep, Shopify fulfillment, and multi-channel e-commerce logistics with same-day processing and photo-proof QC."
        }
      }
    ),
    /* @__PURE__ */ jsx(
      StructuredData,
      {
        type: "breadcrumb",
        data: [
          { name: "Home", url: "https://westfieldprepcenter.com/" },
          { name: "Why Choose Us", url: "https://westfieldprepcenter.com/why-choose-us/" }
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[hsl(var(--wcu-linen))] text-[hsl(var(--wcu-ink))] font-sans selection:bg-[hsl(var(--wcu-sunset))] selection:text-white", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", { className: "pt-20", children: [
        /* @__PURE__ */ jsxs("section", { className: "relative pt-24 pb-24 overflow-hidden", children: [
          /* @__PURE__ */ jsx(HeroBackdrop, {}),
          /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 relative z-10 text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-[hsl(var(--wcu-sunset)/0.25)] text-sm font-medium text-[hsl(var(--wcu-sunset-deep))] mb-8 shadow-[0_8px_24px_-8px_hsl(var(--wcu-sunset)/0.35)]", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { size: 16 }),
              /* @__PURE__ */ jsx("span", { children: "99.8% Order Accuracy Guaranteed" })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-5xl md:text-7xl font-bold leading-[1.05] mb-8 tracking-tight text-[hsl(var(--wcu-ink))]", children: [
              "The Infrastructure Your ",
              /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
              /* @__PURE__ */ jsxs("span", { className: "relative inline-block", children: [
                /* @__PURE__ */ jsx("span", { className: "relative z-10 bg-gradient-to-r from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] bg-clip-text text-transparent", children: "Brand Deserves." }),
                /* @__PURE__ */ jsx(HandUnderline, { className: "absolute -bottom-3 left-0 w-full h-6" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-xl text-[hsl(var(--wcu-ink-soft))] max-w-3xl mx-auto mb-10 leading-relaxed", children: [
              "E-commerce has evolved. Your fulfillment partner shouldn't be stuck in 2010. We combine strategic",
              " ",
              /* @__PURE__ */ jsx("strong", { className: "text-[hsl(var(--wcu-ink))] font-semibold", children: "LA port access" }),
              ",",
              " ",
              /* @__PURE__ */ jsx("strong", { className: "text-[hsl(var(--wcu-ink))] font-semibold", children: "proprietary technology" }),
              ", and",
              " ",
              /* @__PURE__ */ jsx("strong", { className: "text-[hsl(var(--wcu-ink))] font-semibold", children: "boutique care" }),
              " to turn your logistics from a cost center into a growth engine."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4 mb-16", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => navigate("/contact"),
                  className: "w-full sm:w-auto bg-gradient-to-r from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] hover:brightness-105 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-[0_18px_40px_-12px_hsl(var(--wcu-sunset)/0.55)] hover:-translate-y-0.5 flex items-center justify-center gap-2",
                  children: [
                    "Start Shipping Now ",
                    /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => navigate("/pricing"),
                  className: "w-full sm:w-auto bg-white/70 backdrop-blur border border-[hsl(var(--wcu-ink)/0.15)] hover:bg-white text-[hsl(var(--wcu-ink))] px-8 py-4 rounded-full font-semibold text-lg transition-all",
                  children: "View Our Pricing"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-[hsl(var(--wcu-ink)/0.1)] pt-10 flex flex-wrap justify-center items-center gap-8 md:gap-12", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(SiShopify, { className: "w-7 h-7 text-[#5E8E3E]" }),
                /* @__PURE__ */ jsx("span", { className: "text-base font-semibold text-[hsl(var(--wcu-ink))]/75", children: "Shopify Plus" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(SiAmazon, { className: "w-7 h-7 text-[#E47911]" }),
                /* @__PURE__ */ jsx("span", { className: "text-base font-semibold text-[hsl(var(--wcu-ink))]/75", children: "Amazon FBA" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(SiWalmart, { className: "w-7 h-7 text-[#0071DC]" }),
                /* @__PURE__ */ jsx("span", { className: "text-base font-semibold text-[hsl(var(--wcu-ink))]/75", children: "Walmart" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(SiTiktok, { className: "w-7 h-7 text-[hsl(var(--wcu-ink))]" }),
                /* @__PURE__ */ jsx("span", { className: "text-base font-semibold text-[hsl(var(--wcu-ink))]/75", children: "TikTok Shop" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(OrganicDivider, { fromColor: "hsl(var(--wcu-linen))", toColor: "hsl(var(--wcu-cream))" }),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-[hsl(var(--wcu-cream))]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center mb-12", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--wcu-sunset-deep))] mb-3", children: "The Difference" }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--wcu-ink))]", children: "Why brands leave their old 3PL." }),
            /* @__PURE__ */ jsx("p", { className: "text-[hsl(var(--wcu-ink-soft))] text-lg leading-relaxed", children: "The logistics industry is plagued by black-box operations. You send inventory in, and you lose visibility until the customer complains. We built Westfield to fix the three biggest pain points in modern fulfillment." })
          ] }),
          /* @__PURE__ */ jsx(ComparisonGraphic, {})
        ] }) }),
        /* @__PURE__ */ jsx(OrganicDivider, { fromColor: "hsl(var(--wcu-cream))", toColor: "hsl(var(--wcu-linen))" }),
        /* @__PURE__ */ jsxs("section", { className: "py-24 container mx-auto px-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-20", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--wcu-sunset-deep))] mb-3", children: "Built for High-Growth Brands" }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--wcu-ink))]", children: "More than store and ship." }),
            /* @__PURE__ */ jsx("p", { className: "text-[hsl(var(--wcu-ink-soft))] max-w-2xl mx-auto text-lg", children: "We engineer a workflow that protects your margins and elevates your brand experience." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-24", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row items-center gap-16", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:w-1/2", children: [
                /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-semibold mb-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-sm bg-[hsl(var(--wcu-sunset))]" }),
                  "Proprietary Technology"
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-bold mb-6 text-[hsl(var(--wcu-ink))]", children: "A dashboard that tells the truth." }),
                /* @__PURE__ */ jsx("p", { className: "text-[hsl(var(--wcu-ink-soft))] text-lg mb-6 leading-relaxed", children: "Stop emailing spreadsheets back and forth. Our custom-built WMS acts as your central command center." }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-4 mb-8", children: [
                  { icon: Camera, t: "Visual Validation", d: "Every damaged item is photographed and uploaded instantly. You decide: discard, discount, or return." },
                  { icon: RefreshCw, t: "Real-Time Sync", d: "Inventory levels sync across Shopify, Amazon, and TikTok every 5 minutes. No overselling." }
                ].map(({ icon: Icon, t, d }) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "mt-1 w-9 h-9 rounded-xl bg-[hsl(var(--wcu-peach)/0.7)] text-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { size: 16 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold block text-[hsl(var(--wcu-ink))]", children: t }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm text-[hsl(var(--wcu-ink-soft))]", children: d })
                  ] })
                ] }, t)) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "lg:w-1/2 w-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[hsl(var(--wcu-line))] shadow-[0_40px_80px_-40px_hsl(var(--wcu-ink)/0.35)] overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500", children: [
                /* @__PURE__ */ jsxs("div", { className: "h-9 bg-[hsl(var(--wcu-cream))] border-b border-[hsl(var(--wcu-line))] flex items-center px-4 gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-[hsl(0_60%_75%)]" }),
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-[hsl(40_75%_72%)]" }),
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-[hsl(140_40%_72%)]" }),
                  /* @__PURE__ */ jsx("div", { className: "ml-3 text-[10px] uppercase tracking-widest text-[hsl(var(--wcu-ink-soft))]", children: "westfield · live" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end mb-8", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[hsl(var(--wcu-ink-soft))] uppercase tracking-wider mb-1", children: "Total Inventory Value" }),
                      /* @__PURE__ */ jsx("div", { className: "text-3xl font-mono text-[hsl(var(--wcu-ink))]", children: "$1,240,590.00" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-[hsl(var(--wcu-sunset-deep))] text-sm flex items-center gap-1 font-semibold", children: [
                      "+12% ",
                      /* @__PURE__ */ jsx(TrendingUp, { size: 14 })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-2.5 bg-[hsl(var(--wcu-cream))] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full w-[70%] rounded-full bg-gradient-to-r from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))]" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-[hsl(var(--wcu-ink-soft))] font-mono", children: [
                      /* @__PURE__ */ jsx("span", { children: "Available: 14,203" }),
                      /* @__PURE__ */ jsx("span", { children: "Reserved: 2,400" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-3 gap-3", children: [
                    ["Orders Today", "142", "ink"],
                    ["Pending", "4", "amber"],
                    ["Shipped", "138", "sunset"]
                  ].map(([l, v, c]) => /* @__PURE__ */ jsxs("div", { className: "bg-[hsl(var(--wcu-cream))] p-3 rounded-xl border border-[hsl(var(--wcu-line))]", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[hsl(var(--wcu-ink-soft))] uppercase tracking-wide", children: l }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `text-xl font-bold ${c === "amber" ? "text-[hsl(35_85%_45%)]" : c === "sunset" ? "text-[hsl(var(--wcu-sunset-deep))]" : "text-[hsl(var(--wcu-ink))]"}`,
                        children: v
                      }
                    )
                  ] }, l)) })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row-reverse items-center gap-16", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:w-1/2", children: [
                /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-semibold mb-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-sm bg-[hsl(var(--wcu-sunset))]" }),
                  "Strategic Geography"
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-bold mb-6 text-[hsl(var(--wcu-ink))]", children: "The Los Angeles advantage." }),
                /* @__PURE__ */ jsxs("p", { className: "text-[hsl(var(--wcu-ink-soft))] text-lg mb-6 leading-relaxed", children: [
                  "Location isn't just about shipping cost. It's about",
                  " ",
                  /* @__PURE__ */ jsx("strong", { className: "text-[hsl(var(--wcu-ink))] font-semibold", children: "velocity" }),
                  ". Being minutes from the Port of Los Angeles lets us receive ocean freight days, sometimes weeks, faster than inland warehouses."
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-4 mb-8", children: [
                  { icon: Anchor, t: "Faster Restocks", d: "Drayage from the port takes hours, not days. We unload containers and make inventory sellable within 24-48 hours." },
                  { icon: Truck, t: "Zone Skipping", d: "We use major SoCal carrier hubs to inject packages deep into the network, lowering zone costs." }
                ].map(({ icon: Icon, t, d }) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "mt-1 w-9 h-9 rounded-xl bg-[hsl(var(--wcu-peach)/0.7)] text-[hsl(var(--wcu-sunset-deep))] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { size: 16 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold block text-[hsl(var(--wcu-ink))]", children: t }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm text-[hsl(var(--wcu-ink-soft))]", children: d })
                  ] })
                ] }, t)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "lg:w-1/2 w-full relative h-[400px] rounded-3xl overflow-hidden border border-[hsl(var(--wcu-line))] bg-gradient-to-br from-[hsl(var(--wcu-cream))] to-[hsl(var(--wcu-peach)/0.5)]", children: [
                /* @__PURE__ */ jsx("svg", { className: "absolute inset-0 w-full h-full opacity-30", viewBox: "0 0 600 400", fill: "none", "aria-hidden": "true", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(
                  "ellipse",
                  {
                    cx: "300",
                    cy: "200",
                    rx: 70 + i * 38,
                    ry: 45 + i * 24,
                    stroke: "hsl(var(--wcu-ink))",
                    strokeWidth: "1"
                  },
                  i
                )) }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-[hsl(var(--wcu-sunset)/0.4)] rounded-full animate-ping" }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[hsl(var(--wcu-sunset)/0.2)] rounded-full" }),
                /* @__PURE__ */ jsxs("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10", children: [
                  /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-[0_18px_40px_-12px_hsl(var(--wcu-sunset)/0.55)] mb-3", children: /* @__PURE__ */ jsx(MapPin, { size: 28, className: "text-[hsl(var(--wcu-sunset))]" }) }),
                  /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-[hsl(var(--wcu-ink))]", children: "Westfield Prep" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-[hsl(var(--wcu-ink-soft))]", children: "Los Angeles, CA" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto mb-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-semibold mb-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-sm bg-[hsl(var(--wcu-sunset))]" }),
                  "Our Journey With You"
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-bold mb-3 text-[hsl(var(--wcu-ink))]", children: "Five steps. One promise." }),
                /* @__PURE__ */ jsx("p", { className: "text-[hsl(var(--wcu-ink-soft))]", children: "From the welcome handshake to the post-purchase follow-through, every step is documented, photographed, and accountable." })
              ] }),
              /* @__PURE__ */ jsx(JourneyPath, {})
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto mb-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-semibold mb-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-sm bg-[hsl(var(--wcu-sunset))]" }),
                  "Ecosystem"
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--wcu-ink))]", children: "We speak e-commerce fluently." }),
                /* @__PURE__ */ jsx("p", { className: "text-[hsl(var(--wcu-ink-soft))]", children: "Whether you sell D2C, wholesale, or on marketplaces, our system standardizes your orders into a single flow." })
              ] }),
              /* @__PURE__ */ jsx(TechStackGraphic, {})
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(OrganicDivider, { fromColor: "hsl(var(--wcu-linen))", toColor: "hsl(var(--wcu-cream))" }),
        /* @__PURE__ */ jsx("section", { className: "py-24 bg-[hsl(var(--wcu-cream))]", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--wcu-sunset-deep))] mb-3", children: "FBA Mastery" }),
            /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--wcu-ink))]", children: [
              "Amazon FBA Prep, ",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "text-[hsl(var(--wcu-sunset-deep))]", children: "zero compliance errors." })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[hsl(var(--wcu-ink-soft))] text-lg mb-6", children: "Amazon's receiving standards are strict. One missing barcode or wrong box size can result in chargebacks or inventory rejection. We are FBA specialists." }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8", children: [
              ["FNSKU Labeling", "Precise covering of UPCs with Amazon-compliant barcodes."],
              ["Polybagging", "Suffocation warnings applied to all apparel and plush items."],
              ["Kitting / Bundling", "Sold-as-Set bundles with shrink wrap and do-not-separate labels."],
              ["Carton Forwarding", "Direct SPD and LTL handoffs to Amazon Fulfillment Centers."]
            ].map(([t, d]) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white p-5 rounded-2xl border border-[hsl(var(--wcu-line))] hover:border-[hsl(var(--wcu-sunset)/0.4)] transition-colors",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-[hsl(var(--wcu-ink))] mb-1", children: t }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-[hsl(var(--wcu-ink-soft))]", children: d })
                ]
              },
              t
            )) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: [
            { icon: CheckCircle2, value: "0%", label: "Chargeback Rate" },
            { icon: Tag, value: "99.7%", label: "Label Accuracy" },
            { icon: Clock, value: "24hr", label: "Prep Turnaround" },
            { icon: Box, value: "2M+", label: "Units Prepped", ribbon: true }
          ].map(({ icon: Icon, value, label, ribbon }) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative bg-white rounded-2xl p-6 border border-[hsl(var(--wcu-line))] text-center shadow-[0_18px_40px_-24px_hsl(var(--wcu-ink)/0.25)] overflow-hidden",
              children: [
                ribbon && /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "absolute -right-4 -top-4 w-24 h-24 opacity-30 text-[hsl(var(--wcu-sunset))]",
                    viewBox: "0 0 100 100",
                    fill: "currentColor",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ jsx("path", { d: "M0 0 L 100 0 L 100 60 L 70 50 L 50 70 L 30 50 L 0 60 Z" })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] mx-auto mb-2 flex items-center justify-center text-[hsl(var(--wcu-sunset-deep))]", children: /* @__PURE__ */ jsx(Icon, { size: 22 }) }),
                  /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-[hsl(var(--wcu-ink))]", children: value }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-[hsl(var(--wcu-ink-soft))]", children: label })
                ] })
              ]
            },
            label
          )) })
        ] }) }) }),
        /* @__PURE__ */ jsx(OrganicDivider, { fromColor: "hsl(var(--wcu-cream))", toColor: "hsl(var(--wcu-linen))" }),
        /* @__PURE__ */ jsxs("section", { className: "py-24 relative overflow-hidden bg-[hsl(var(--wcu-linen))]", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-1/3 h-full bg-[hsl(var(--wcu-peach)/0.5)] blur-3xl pointer-events-none" }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-0 bottom-0 w-1/3 h-full bg-[hsl(var(--wcu-sunset)/0.15)] blur-3xl pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--wcu-peach)/0.6)] text-[hsl(var(--wcu-ink))] text-xs font-bold tracking-wider uppercase mb-4", children: [
                /* @__PURE__ */ jsx(Sparkles, { size: 12, className: "text-[hsl(var(--wcu-sunset-deep))]" }),
                "Westfield Launchpad"
              ] }),
              /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-5xl font-bold mb-4 text-[hsl(var(--wcu-ink))]", children: [
                "Launch faster. ",
                /* @__PURE__ */ jsx("br", {}),
                "Sell smarter."
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xl text-[hsl(var(--wcu-ink-soft))] max-w-2xl mx-auto", children: "Shopify setup, Amazon Seller Central, A+ content, 3D product imaging, and pro studio photography. All under one roof." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[hsl(var(--wcu-line))] rounded-3xl p-8 md:p-12 shadow-[0_40px_80px_-40px_hsl(var(--wcu-ink)/0.25)]", children: [
              /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-5 mb-10", children: [
                { icon: ShoppingBag, title: "Shopify Dashboard Setup", desc: "Store build, theme config, app stack, and payments dialed in." },
                { icon: Tag, title: "Amazon Account & A+ Content", desc: "Seller Central registration, brand registry, A+ modules, and storefront." },
                { icon: Box, title: "3D Product Imaging", desc: "Photoreal renders that look like studio shots. No physical samples needed." },
                { icon: Camera, title: "Studio Photo & Model Shoots", desc: "Coordinated sessions with models, props, and lifestyle sets in LA." }
              ].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex gap-4 p-5 rounded-2xl bg-[hsl(var(--wcu-cream))] border border-[hsl(var(--wcu-line))]",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 text-[hsl(var(--wcu-sunset-deep))] border border-[hsl(var(--wcu-line))]", children: /* @__PURE__ */ jsx(Icon, { size: 22 }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg text-[hsl(var(--wcu-ink))]", children: title }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-[hsl(var(--wcu-ink-soft))]", children: desc })
                    ] })
                  ]
                },
                title
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-[hsl(var(--wcu-line))]", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => navigate("/launchpad"),
                    className: "inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] hover:brightness-105 text-white px-8 py-3 rounded-full font-semibold transition-all hover:-translate-y-0.5 shadow-[0_18px_40px_-12px_hsl(var(--wcu-sunset)/0.5)]",
                    children: [
                      "Explore Launchpad Services ",
                      /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => navigate("/contact"),
                    className: "inline-flex items-center gap-2 bg-[hsl(var(--wcu-cream))] hover:bg-[hsl(var(--wcu-peach)/0.5)] text-[hsl(var(--wcu-ink))] px-8 py-3 rounded-full font-semibold border border-[hsl(var(--wcu-line))] transition-colors",
                    children: "Book a Discovery Call"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "py-24 container mx-auto px-6 max-w-4xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--wcu-sunset-deep))] mb-3", children: "Common Questions" }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--wcu-ink))]", children: "Transparency from the start." }),
            /* @__PURE__ */ jsx("p", { className: "text-[hsl(var(--wcu-ink-soft))]", children: "We answer the hard questions before you ask them." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[hsl(var(--wcu-line))] rounded-3xl p-6 md:p-8 shadow-[0_30px_60px_-40px_hsl(var(--wcu-ink)/0.25)]", children: [
            /* @__PURE__ */ jsx(
              FAQItem,
              {
                q: "Do you have monthly minimums?",
                a: "We believe in growing with you. While we don't have strict minimum orders per month, we do have a minimum monthly storage and account fee of $250 to ensure we can dedicate resources to your account. This is usually easily met by active sellers."
              }
            ),
            /* @__PURE__ */ jsx(
              FAQItem,
              {
                q: "How fast is your receiving process?",
                a: "Our SLA is 24 to 48 hours from the moment the truck hits our dock. For urgent restocks, we offer a Hot Receive service to get inventory sellable within 4 hours."
              }
            ),
            /* @__PURE__ */ jsx(
              FAQItem,
              {
                q: "Do you handle returns?",
                a: "Yes. Returns are a huge pain point for e-commerce. We inspect every return, photograph it, and grade it based on your criteria (Sellable, Damaged, Refurbish). You see the photo on the dashboard before we restock it."
              }
            ),
            /* @__PURE__ */ jsx(
              FAQItem,
              {
                q: "Can you use my branded boxes?",
                a: "Absolutely. We specialize in branded unboxing experiences. Tissue paper, stickers, inserts, custom tape — we do it all. We charge a small surcharge for complex pack-outs, but standard branded box usage is often included in the pick and pack fee."
              }
            ),
            /* @__PURE__ */ jsx(
              FAQItem,
              {
                q: "What if you make a mistake?",
                a: "We own it. If we mis-ship an order, we pay for the shipping cost of the replacement and the return label. Our accuracy rate is 99.8%, but we are accountable for the 0.2%."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden", children: [
          /* @__PURE__ */ jsx(OrganicDivider, { fromColor: "hsl(var(--wcu-linen))", toColor: "hsl(var(--wcu-sunset))" }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-[hsl(var(--wcu-sunset))] via-[hsl(var(--wcu-sunset))] to-[hsl(var(--wcu-sunset-deep))] py-24 relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 wcu-paper-grain opacity-20 mix-blend-overlay pointer-events-none" }),
            /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 relative z-10 text-center", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold mb-6 text-white", children: 'Stop settling for "good enough" logistics.' }),
              /* @__PURE__ */ jsx("p", { className: "text-xl text-white/85 mb-10 max-w-2xl mx-auto", children: "Your brand is premium. Your fulfillment should be too. Let's build a supply chain that customers rave about." }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => navigate("/contact"),
                    className: "bg-white hover:bg-[hsl(var(--wcu-cream))] text-[hsl(var(--wcu-ink))] px-10 py-4 rounded-full font-semibold text-lg shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5",
                    children: "Get Your Custom Quote"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => navigate("/contact"),
                    className: "bg-[hsl(var(--wcu-ink))] hover:bg-black text-white px-10 py-4 rounded-full font-semibold text-lg transition-all border border-white/10",
                    children: "Talk to an Expert"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  WhyChooseUs as default
};
