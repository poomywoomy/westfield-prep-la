import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { motion, AnimatePresence } from "framer-motion";
import { T as TranslatedText, B as Button, S as StructuredData, H as Header, F as Footer } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { Sparkles, ArrowRight, Boxes, Zap, Clock, Check, X, ExternalLink, Plus } from "lucide-react";
import { SiShopify, SiAmazon, SiWalmart, SiTiktok, SiEtsy, SiWoo, SiBigcommerce, SiMagento, SiWix } from "react-icons/si";
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
const floatingLogos = [
  { Icon: SiShopify, color: "#5E8E3E", delay: 0 },
  { Icon: SiAmazon, color: "#FF9900", delay: 0.1 },
  { Icon: SiWalmart, color: "#0057A0", delay: 0.2 },
  { Icon: SiTiktok, color: "#000000", delay: 0.3 },
  { Icon: SiEtsy, color: "#D5581D", delay: 0.4 }
];
const SalesChannelsHero = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("section", { className: "relative py-24 md:py-32 mt-16 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-10",
          style: {
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px"
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-4 mb-8", children: floatingLogos.map((logo, idx) => /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: logo.delay, duration: 0.5 },
          className: "w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer",
          children: /* @__PURE__ */ jsx(logo.Icon, { size: 24, color: logo.color, className: "md:w-7 md:h-7" })
        },
        idx
      )) }),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.5 },
          className: "inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6",
          children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-primary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "10+ Platform Integrations" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.h1,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.6 },
          className: "text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white",
          children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Every Platform." }),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent", children: /* @__PURE__ */ jsx(TranslatedText, { children: "One Warehouse." }) })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.7 },
          className: "text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto",
          children: /* @__PURE__ */ jsx(TranslatedText, { children: "Connect your store in minutes. Orders flow automatically to our LA warehouse for fast, accurate fulfillment across all your sales channels." })
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.8 },
          className: "flex flex-col sm:flex-row gap-4 justify-center",
          children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                className: "bg-secondary hover:bg-secondary/90 text-lg px-8 py-6",
                onClick: () => navigate("/contact"),
                children: [
                  /* @__PURE__ */ jsx(TranslatedText, { children: "Get Started Free" }),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                variant: "outline",
                className: "bg-white/15 border-white/50 text-white hover:bg-white/25 text-lg px-8 py-6",
                onClick: () => navigate("/pricing"),
                children: [
                  /* @__PURE__ */ jsx(Boxes, { className: "w-5 h-5 mr-2" }),
                  /* @__PURE__ */ jsx(TranslatedText, { children: "View Pricing" })
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
          animate: { opacity: 1 },
          transition: { delay: 1 },
          className: "mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Real-time inventory sync" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Under 5 min setup" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "No coding required" }) })
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" })
  ] });
};
const platformIcons$1 = {
  shopify: SiShopify,
  amazon: SiAmazon,
  walmart: SiWalmart,
  tiktok: SiTiktok,
  etsy: SiEtsy,
  woocommerce: SiWoo,
  bigcommerce: SiBigcommerce,
  magento: SiMagento,
  wix: SiWix,
  faire: null
};
const PlatformCard = ({ platform, onClick, index }) => {
  const Icon = platformIcons$1[platform.key];
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05, duration: 0.4 },
      onClick,
      className: `group relative cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${platform.featured ? "col-span-1 md:col-span-2 border-primary/50 bg-gradient-to-br from-card via-card to-primary/10" : "border-border hover:border-primary/40 bg-card"}`,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            style: {
              background: `radial-gradient(circle at 50% 100%, ${platform.brandColor}20 0%, transparent 70%)`
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: `relative z-10 ${platform.featured ? "p-8" : "p-6"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `${platform.featured ? "w-16 h-16" : "w-12 h-12"} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`,
                  style: { backgroundColor: `${platform.brandColor}15` },
                  children: Icon ? /* @__PURE__ */ jsx(
                    Icon,
                    {
                      size: platform.featured ? 32 : 24,
                      color: platform.brandColor
                    }
                  ) : platform.key === "faire" ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: "/integration-logos/faire-logo.png",
                      alt: "Faire",
                      className: `${platform.featured ? "w-10 h-10" : "w-7 h-7"} object-contain`
                    }
                  ) : /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "font-bold text-white rounded-lg w-full h-full flex items-center justify-center",
                      style: { backgroundColor: platform.brandColor },
                      children: platform.name.slice(0, 2)
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: `font-bold text-foreground ${platform.featured ? "text-2xl" : "text-lg"}`,
                    children: platform.name
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: platform.tagline }) })
              ] })
            ] }),
            platform.featured && /* @__PURE__ */ jsxs("span", { className: "px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Zap, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "Featured" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: `${platform.setupTime} setup` }) })
            ] }),
            platform.featured && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-primary", children: [
              /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "Real-time sync" })
            ] })
          ] }),
          platform.featured && platform.bestFor.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: platform.bestFor.slice(0, 3).map((item, idx) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: item })
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Learn More" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity",
            style: { backgroundColor: platform.brandColor }
          }
        )
      ]
    }
  );
};
const platformIcons = {
  shopify: SiShopify,
  amazon: SiAmazon,
  walmart: SiWalmart,
  tiktok: SiTiktok,
  etsy: SiEtsy,
  woocommerce: SiWoo,
  bigcommerce: SiBigcommerce,
  magento: SiMagento,
  wix: SiWix,
  faire: null
};
const PlatformDetailModal = ({ platform, open, onClose }) => {
  const navigate = useNavigate();
  if (!platform) return null;
  const Icon = platformIcons[platform.key];
  const handleGetStarted = () => {
    onClose();
    if (platform.path) {
      navigate(platform.path);
    } else {
      navigate("/contact");
    }
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: onClose,
        className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
        transition: { type: "spring", duration: 0.5 },
        className: "fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-card rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col",
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative p-6 md:p-8",
              style: {
                background: `linear-gradient(135deg, ${platform.brandColor}15 0%, transparent 100%)`
              },
              children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onClose,
                    className: "absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors",
                    children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-20 h-20 rounded-2xl flex items-center justify-center",
                      style: { backgroundColor: `${platform.brandColor}20` },
                      children: Icon ? /* @__PURE__ */ jsx(Icon, { size: 48, color: platform.brandColor }) : platform.key === "faire" ? /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: "/integration-logos/faire-logo.png",
                          alt: "Faire",
                          className: "w-12 h-12 object-contain"
                        }
                      ) : /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "w-full h-full rounded-2xl flex items-center justify-center text-2xl font-bold text-white",
                          style: { backgroundColor: platform.brandColor },
                          children: platform.name.slice(0, 2)
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-foreground", children: platform.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: platform.tagline }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                        /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
                        /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: `${platform.setupTime} setup` }) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm text-primary", children: [
                        /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4" }),
                        /* @__PURE__ */ jsx(TranslatedText, { children: "Real-time sync" })
                      ] })
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6 md:p-8 pt-0 md:pt-0 space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Overview" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: platform.description }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-3", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Key Features" }) }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: platform.features.map((feature, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0",
                    style: { backgroundColor: `${platform.brandColor}20` },
                    children: /* @__PURE__ */ jsx(
                      Check,
                      {
                        className: "w-3 h-3",
                        style: { color: platform.brandColor }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: feature }) })
              ] }, idx)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-3", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Best For" }) }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: platform.bestFor.map((item, idx) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "px-3 py-1.5 rounded-full text-sm font-medium",
                  style: {
                    backgroundColor: `${platform.brandColor}15`,
                    color: platform.brandColor
                  },
                  children: /* @__PURE__ */ jsx(TranslatedText, { children: item })
                },
                idx
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 pt-4 border-t border-border flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                className: "flex-1 bg-primary hover:bg-primary/90",
                onClick: handleGetStarted,
                children: [
                  /* @__PURE__ */ jsx(TranslatedText, { children: "Get Started" }),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                ]
              }
            ),
            platform.path && /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                variant: "outline",
                onClick: () => {
                  onClose();
                  navigate(platform.path);
                },
                children: [
                  /* @__PURE__ */ jsx(TranslatedText, { children: "View Full Page" }),
                  /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 ml-2" })
                ]
              }
            )
          ] })
        ]
      }
    )
  ] }) });
};
const supportedPlatforms = [
  // Featured Platforms
  {
    key: "shopify",
    name: "Shopify",
    tagline: "Primary Integration",
    description: "Shopify is the leading e-commerce platform powering millions of online stores. Our direct integration provides seamless real-time order imports, automatic inventory synchronization, and instant tracking updates. Perfect for DTC brands looking for reliable, fast fulfillment from Los Angeles.",
    features: [
      "Real-time order sync via webhooks",
      "Automatic inventory level updates",
      "Direct tracking number injection",
      "Multi-location inventory support",
      "Shopify Plus compatible",
      "Returns processing integration"
    ],
    bestFor: ["DTC Brands", "Subscription Boxes", "Fashion & Apparel", "Health & Beauty"],
    setupTime: "< 5 min",
    featured: true,
    path: "/sales-channels/shopify",
    brandColor: "#5E8E3E"
  },
  {
    key: "amazon",
    name: "Amazon",
    tagline: "FBA Prep Specialists",
    description: "As Amazon FBA prep specialists, we handle everything from receiving your inventory to preparing it for Amazon's fulfillment centers. Our LA location offers fast turnaround and compliance with all Amazon requirements including FNSKU labeling, poly bagging, and shipment planning.",
    features: [
      "FBA prep and forwarding",
      "FNSKU labeling and compliance",
      "Poly bagging and bundling",
      "Amazon-optimized box sizes",
      "Inventory replenishment tracking",
      "Multi-node shipment splitting"
    ],
    bestFor: ["FBA Sellers", "Private Label", "Wholesale", "Arbitrage"],
    setupTime: "< 15 min",
    featured: true,
    path: "/sales-channels/amazon",
    brandColor: "#FF9900"
  },
  {
    key: "tiktok",
    name: "TikTok Shop",
    tagline: "48-Hour SLA Fulfillment",
    description: "TikTok Shop demands speed. Our integration ensures orders from your TikTok Shop are processed and shipped within TikTok's strict 48-hour SLA requirements. We handle the fulfillment complexity so you can focus on creating viral content.",
    features: [
      "48-hour SLA compliance",
      "Automatic order import",
      "Real-time inventory sync",
      "Tracking updates to TikTok",
      "High-volume capacity",
      "Peak season scalability"
    ],
    bestFor: ["Influencer Brands", "Viral Products", "Beauty & Cosmetics", "Trending Items"],
    setupTime: "< 10 min",
    featured: true,
    path: "/sales-channels/tiktok-shop",
    brandColor: "#000000"
  },
  // Regular Platforms
  {
    key: "walmart",
    name: "Walmart",
    tagline: "WFS Ready",
    description: "Walmart Marketplace is one of the largest e-commerce platforms in the US. We provide specialized fulfillment including WFS (Walmart Fulfillment Services) prep, compliance with Walmart's strict packaging standards, and support for 2-day shipping requirements.",
    features: [
      "WFS prep and forwarding",
      "Walmart packaging compliance",
      "2-day shipping support",
      "Order import and tracking",
      "Returns processing"
    ],
    bestFor: ["Home Goods", "Electronics", "Grocery", "Seasonal"],
    setupTime: "< 15 min",
    brandColor: "#0057A0"
  },
  {
    key: "etsy",
    name: "Etsy",
    tagline: "Handmade & Craft Focus",
    description: "Etsy sellers need fulfillment that matches the care they put into their products. We offer gentle handling for handmade items, custom packaging options, and the personal touch Etsy buyers expect. Perfect for artisan sellers scaling beyond home fulfillment.",
    features: [
      "Gentle handling for delicate items",
      "Custom branded packaging",
      "Gift wrapping options",
      "Small-batch inventory",
      "Made-to-order support"
    ],
    bestFor: ["Handmade Crafts", "Vintage Items", "Art Prints", "Jewelry"],
    setupTime: "< 10 min",
    brandColor: "#D5581D"
  },
  {
    key: "woocommerce",
    name: "WooCommerce",
    tagline: "WordPress Integration",
    description: "WooCommerce powers millions of WordPress-based stores. Our integration connects directly with your WooCommerce installation, providing automatic order imports, real-time inventory updates, and tracking number injection without manual work.",
    features: [
      "WordPress plugin integration",
      "Automatic order sync",
      "Real-time inventory updates",
      "Custom shipping methods",
      "Subscription order support"
    ],
    bestFor: ["WordPress Sites", "Subscription Products", "Custom Brands", "Niche Markets"],
    setupTime: "< 10 min",
    brandColor: "#674399"
  },
  {
    key: "bigcommerce",
    name: "BigCommerce",
    tagline: "Enterprise E-commerce",
    description: "BigCommerce is built for growing and enterprise businesses. Our integration matches BigCommerce's capabilities with enterprise-grade fulfillment, supporting high-volume operations, B2B workflows, and complex multi-channel inventory management.",
    features: [
      "Enterprise fulfillment",
      "High-volume processing",
      "Multi-channel inventory",
      "B2B order support",
      "Advanced reporting"
    ],
    bestFor: ["Growing Brands", "Enterprise", "B2B Sellers", "High Volume"],
    setupTime: "< 10 min",
    brandColor: "#121118"
  },
  {
    key: "faire",
    name: "Faire",
    tagline: "Wholesale Marketplace",
    description: "Faire connects brands with retailers worldwide. We provide specialized B2B fulfillment for Faire sellers, handling wholesale orders, pallet building, retailer compliance prep, and the professional presentation wholesale buyers expect.",
    features: [
      "Wholesale order fulfillment",
      "Bulk packaging",
      "Retailer compliance prep",
      "Pallet building",
      "Drop shipping to retailers"
    ],
    bestFor: ["Wholesale Brands", "Artisan Products", "Retail Vendors", "B2B"],
    setupTime: "< 10 min",
    brandColor: "#1A1A1A"
  },
  {
    key: "magento",
    name: "Magento",
    tagline: "Flexible & Customizable",
    description: "Magento (Adobe Commerce) offers maximum flexibility for custom e-commerce implementations. Our integration adapts to your Magento setup, supporting custom workflows, multi-store configurations, and complex business logic.",
    features: [
      "Custom platform integration",
      "Multi-store support",
      "B2B workflows",
      "Advanced automation",
      "Complex catalog handling"
    ],
    bestFor: ["Custom Businesses", "Enterprise", "B2B Operations", "Complex Catalogs"],
    setupTime: "< 15 min",
    brandColor: "#EE672F"
  },
  {
    key: "wix",
    name: "Wix",
    tagline: "Simple & Scalable",
    description: "Wix makes it easy for businesses to sell online without technical expertise. Our straightforward integration connects with your Wix store, handling orders automatically while you focus on growing your business.",
    features: [
      "Simple store integration",
      "Automatic order sync",
      "Inventory management",
      "Small business friendly",
      "Scalable solutions"
    ],
    bestFor: ["Small Businesses", "Startups", "Service-Based", "New E-commerce"],
    setupTime: "< 10 min",
    brandColor: "#0C6EFC"
  }
];
const featuredPlatforms = supportedPlatforms.filter((p) => p.featured);
const regularPlatforms = supportedPlatforms.filter((p) => !p.featured);
const SalesChannels = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const allPlatforms = supportedPlatforms.map((platform) => ({
    name: platform.name,
    description: platform.tagline,
    path: platform.path
  }));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Supported Sales Channels | Multi-Channel Fulfillment - Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "We support all major e-commerce platforms including Shopify, Amazon, TikTok Shop, Walmart, eBay, and more. Multi-channel fulfillment from our Los Angeles warehouse."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/sales-channels" })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "itemList", data: { platforms: allPlatforms } }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Sales Channels", path: "/sales-channels" }] }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(SalesChannelsHero, {}),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "text-center mb-12",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-2 mb-4", children: [
                  /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-secondary" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Featured Integrations" }) })
                ] }),
                /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Our Most Popular Platforms" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Deep integrations with the platforms that power e-commerce. Real-time sync, automatic order import, and seamless fulfillment." }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6 mb-16", children: featuredPlatforms.map((platform, idx) => /* @__PURE__ */ jsx(
            PlatformCard,
            {
              platform,
              onClick: () => setSelectedPlatform(platform),
              index: idx
            },
            platform.key
          )) }),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "text-center mb-8",
              children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "More Supported Platforms" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Full integration support for all major e-commerce and wholesale platforms." }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
            regularPlatforms.map((platform, idx) => /* @__PURE__ */ jsx(
              PlatformCard,
              {
                platform,
                onClick: () => setSelectedPlatform(platform),
                index: idx + featuredPlatforms.length
              },
              platform.key
            )),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: 0.1 * (regularPlatforms.length + featuredPlatforms.length) },
                className: "group relative bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all duration-300",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Plus, { className: "w-7 h-7 text-primary" }) }),
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground mb-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: "And More" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Custom integrations available" }) })
                ]
              }
            )
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-br from-primary to-secondary", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 text-center", children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            children: [
              /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-white", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ready to Simplify Your Fulfillment?" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xl mb-8 text-white/90 max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Connect your store today and start shipping from Los Angeles. No setup fees, no long-term contracts." }) }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "lg",
                  className: "bg-white text-primary hover:bg-white/90 text-lg px-8 py-6",
                  onClick: () => navigate("/contact"),
                  children: [
                    /* @__PURE__ */ jsx(TranslatedText, { children: "Get Started Free" }),
                    /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
                  ]
                }
              )
            ]
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] }),
    /* @__PURE__ */ jsx(
      PlatformDetailModal,
      {
        platform: selectedPlatform,
        open: !!selectedPlatform,
        onClose: () => setSelectedPlatform(null)
      }
    )
  ] });
};
export {
  SalesChannels as default
};
