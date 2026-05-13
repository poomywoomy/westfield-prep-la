import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import { S as StructuredData, H as Header, T as TranslatedText, B as Button, F as Footer, n as generateMetaTags } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { MapPin, Package, Truck, Zap, Check, X, ArrowRight } from "lucide-react";
import "react";
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
const ThreePLLosAngeles = () => {
  const meta = generateMetaTags(
    "3PL Fulfillment Services at West Coast 3PL Warehouse",
    "3PL fulfillment services at our West Coast 3PL warehouse help your e-commerce business grow. Fast, accurate, and reliable shipping. Get started with us today!",
    "/3pl-los-angeles",
    "/la-port-logistics.jpg"
  );
  const serviceData = {
    serviceType: "LogisticsService",
    name: "Los Angeles 3PL Fulfillment Services",
    description: "Premium third-party logistics (3PL) services in Los Angeles including Shopify fulfillment, Amazon FBA prep, same-day receiving, inventory management, and multi-channel order processing for e-commerce brands.",
    features: [
      "Shopify Fulfillment",
      "Same-Day Receiving",
      "Inventory Management",
      "Multi-Channel Order Processing",
      "Amazon FBA Prep",
      "West Coast Distribution",
      "Real-Time Inventory Tracking",
      "Custom Packaging & Kitting"
    ]
  };
  const faqData = [
    {
      question: "What makes a Los Angeles 3PL better than other locations?",
      answer: "Los Angeles 3PL centers offer strategic port proximity (15 minutes from LA/Long Beach ports), access to major carrier hubs, and optimal West Coast distribution. This means faster receiving, lower shipping costs to California customers, and 2-day ground delivery across the western United States."
    },
    {
      question: "How quickly can you receive inventory at your LA facility?",
      answer: "We offer same-day container processing for shipments received before 2PM PST. Most domestic freight is processed and inventoried within 24 hours of arrival at our Los Angeles warehouse."
    },
    {
      question: "Do you integrate with Shopify stores?",
      answer: "Yes, we offer seamless Shopify integration with real-time inventory syncing, automatic order imports, and instant tracking number updates. Our system supports multi-location inventory and custom fulfillment rules."
    },
    {
      question: "What's your coverage area from Los Angeles?",
      answer: "From our LA location, we provide 2-day ground shipping to all West Coast states, 3-day to Mountain states, and 4-5 day coast-to-coast. We also offer expedited air shipping for time-sensitive orders."
    },
    {
      question: "Can you handle Amazon FBA prep from your LA warehouse?",
      answer: "Yes, we provide full Amazon FBA prep services including FNSKU labeling, polybagging, bubble wrap, carton prep, and direct shipment to Amazon fulfillment centers. We're experienced with all Amazon compliance requirements."
    },
    {
      question: "What types of businesses do you work with?",
      answer: "We serve DTC brands, Shopify merchants, Amazon FBA sellers, multi-channel retailers, and subscription box companies. Our clients range from startups to established brands shipping 1,000+ orders per month."
    },
    {
      question: "How does pricing work for 3PL services in LA?",
      answer: "Our pricing is customized based on your volume, storage needs, and service requirements. We offer transparent per-unit receiving fees, monthly storage fees, and per-order fulfillment fees. Contact us for a detailed quote."
    },
    {
      question: "Do you offer real-time inventory visibility?",
      answer: "Yes, our client portal provides 24/7 access to real-time inventory levels, order status, shipment tracking, and detailed analytics. You can manage your inventory from anywhere with full transparency."
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: meta.title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: meta.description }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: meta.canonical }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: meta.ogTitle }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: meta.ogDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: meta.ogUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: meta.ogImage }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: meta.twitterTitle }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: meta.twitterDescription }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: meta.twitterImage })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "organization" }),
    /* @__PURE__ */ jsx(StructuredData, { type: "service", data: serviceData }),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqData }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "3PL Los Angeles", path: "/3pl-los-angeles" }] }),
      /* @__PURE__ */ jsx("section", { className: "relative pt-32 md:pt-40 pb-16 md:pb-20 bg-gradient-to-b from-white via-gray-50/50 to-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 md:px-12 max-w-5xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-12 h-12 text-primary flex-shrink-0" }),
          /* @__PURE__ */ jsx("h1", { className: "text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-foreground leading-[1.1] border-l-4 border-primary pl-6 shadow-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "3PL in Los Angeles" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl text-muted-foreground/90 font-light leading-relaxed max-w-3xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Los Angeles's trusted 3PL partner for growing online brands. Expert order fulfillment, real-time inventory tracking, and strategic West Coast distribution." }) }),
        /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(Button, { size: "lg", className: "text-lg px-8 py-6", onClick: () => window.location.href = "/contact", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get Your Quote" }) }) })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 md:px-12 max-w-4xl", children: /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-center text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "A Los Angeles 3PL brings speed, structure, and proximity to one of the world's busiest logistics ecosystems. From same-day container receiving to 2-day West Coast delivery, our fulfillment center positions your brand where it needs to be." }) }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-16 bg-white border-y border-border/10", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 md:px-12 max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-0 divide-x divide-border/10", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-8 md:px-16 py-8 space-y-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx(Package, { className: "w-10 h-10 text-primary stroke-[1]" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Port Proximity" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Immediate access to Port of Los Angeles and Port of Long Beach with faster inbound container processing" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-8 md:px-16 py-8 space-y-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx(Truck, { className: "w-10 h-10 text-primary stroke-[1]" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Carrier Hub" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Proximity to USPS, UPS, FedEx major hubs with reduced lead time for replenishment" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-8 md:px-16 py-8 space-y-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx(Zap, { className: "w-10 h-10 text-primary stroke-[1]" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "West Coast Distribution" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Strategic positioning for 1 to 2 day delivery across California and western states" }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6", children: /* @__PURE__ */ jsx("div", { className: "h-px bg-border/40" }) }),
      /* @__PURE__ */ jsx("section", { className: "py-32 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-16 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-5xl font-light leading-tight", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Secure, Climate-Controlled Storage Designed for West Coast Brands" }) }),
          /* @__PURE__ */ jsx("div", { className: "w-20 h-0.5 bg-primary" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "A modern 3PL warehouse does far more than hold inventory. It protects your products, organizes your stock intelligently, and maintains the consistency your supply chain depends on. A Los Angeles-based fulfillment center provides climate-controlled storage, dedicated racking zones, and product-specific segregation ensuring your inventory stays in optimal condition from arrival to outbound." }) }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "This creates faster access, safer handling, and a more stable operational flow for brands shipping throughout California and the broader West Coast." }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-96 rounded-lg overflow-hidden shadow-lg", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/blog-images/3pl-warehouse-storage-la.jpg",
            alt: "Modern climate-controlled 3PL warehouse in Los Angeles with organized pallet racking and secure storage for e-commerce inventory",
            className: "w-full h-full object-cover"
          }
        ) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-border" }),
      /* @__PURE__ */ jsx("section", { className: "py-32 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-16 items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "h-96 rounded-lg overflow-hidden shadow-lg order-2 md:order-1", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/blog-images/inventory-management-barcode-scanning.jpg",
            alt: "Warehouse worker using barcode scanner for real-time inventory management and SKU tracking in Los Angeles 3PL facility",
            className: "w-full h-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 order-1 md:order-2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-5xl font-light leading-tight", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Streamlined Inventory Management With Real-Time Visibility" }) }),
          /* @__PURE__ */ jsx("div", { className: "w-20 h-0.5 bg-primary" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Partnering with a 3PL in Los Angeles brings structure and transparency to your inventory movement. Advanced tracking systems monitor every SKU, update stock levels automatically, and provide location accuracy down to the bin." }) }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: /* @__PURE__ */ jsx(TranslatedText, { children: "This helps your team:" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Identify trends in slow-moving and high-velocity SKUs" }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Prevent costly oversells and stockouts" }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Maintain accurate counts across all sales channels" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "With a professional 3PL, you eliminate manual errors and gain a clear, real-time view of your product flow." }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-border" }),
      /* @__PURE__ */ jsx("section", { className: "py-32 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-16 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-5xl font-light leading-tight", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Fast, Reliable Distribution Across LA, California, and Nationwide" }) }),
          /* @__PURE__ */ jsx("div", { className: "w-20 h-0.5 bg-primary" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "A third-party logistics partner ensures your shipments move efficiently across multiple routes whether you're fulfilling DTC orders, sending wholesale replenishments, or distributing bulk shipments." }) }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Los Angeles is one of the strongest shipping hubs in the country, giving brands access to:" }) }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Distributed networks for faster regional delivery" }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Optimized carrier selection (UPS, FedEx, USPS, carriers local to LA)" }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-primary mt-1 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: "Multiple outbound strategies to support DTC, retail, and B2B" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "A professional 3PL coordinates every step so your orders leave accurately, on time, and without operational friction." }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-96 rounded-lg overflow-hidden shadow-lg", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/blog-images/shipping-distribution-loading-dock.jpg",
            alt: "Aerial view of Los Angeles 3PL loading dock with trucks for fast distribution across California and nationwide shipping",
            className: "w-full h-full object-cover"
          }
        ) })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx("div", { className: "w-3/5 mx-auto h-px bg-border" }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-40 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-b border-border pb-10", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "DTC & Lifestyle Brands" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Direct-to-consumer growth" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Brands needing fast order turnaround and clean packaging" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-b border-border pb-10", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Beauty, Skincare, Cosmetics" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Temperature-sensitive products" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Climate-controlled storage with product segregation" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-b border-border pb-10", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Apparel & Accessories" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Fashion and seasonal goods" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Quick restocking and multi-channel distribution" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-b border-border pb-10", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Wellness & Supplement Brands" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Health-focused products" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Compliance-ready handling and lot tracking" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-b border-border pb-10", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "TikTok Shop Creators" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "High-velocity social commerce" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Rapid fulfillment for viral product launches" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-b border-border pb-10", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Influencer-Led Launches" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Creator-driven brands" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Flexible fulfillment for launch campaigns" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-b border-border pb-10", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "West Coast Focused Brands" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Regional distribution priority" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "1 to 2 day delivery across California" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-b border-border pb-10", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon FBA Prep" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "FBA-bound inventory" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Professional prep, labeling, and shipment creation" }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("section", { className: "pt-40 pb-32 bg-muted/20 relative overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 opacity-5",
            style: {
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, hsl(var(--border)) 49px, hsl(var(--border)) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, hsl(var(--border)) 49px, hsl(var(--border)) 50px)`
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-5xl relative z-10", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-5xl font-light text-center mb-12", children: /* @__PURE__ */ jsx(TranslatedText, { children: "How a 3PL Streamlines Your Logistics in LA" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Los Angeles provides infrastructure that most logistics markets cannot match. LAX air freight terminals handle international shipments daily. The USPS distribution hub in City of Industry processes millions of parcels weekly. A dense courier network ensures same-day and next-day pickup across the metro area." }) }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Warehouse clusters in Commerce, Vernon, Torrance, and Gardena create low-latency restock routes to Amazon fulfillment centers like ONT8, LGB8, and SNA4. For brands shipping West Coast inventory or managing FBA prep, LA provides the operational clarity and speed required to scale without friction." }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "py-24 bg-background overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "flex gap-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory",
          style: { scrollBehavior: "smooth" },
          children: [
            {
              title: "Scaling DTC Brands",
              description: "Brands experiencing rapid growth need fulfillment infrastructure that scales without delays. A Los Angeles 3PL provides the capacity, speed, and operational consistency required to handle high order volumes."
            },
            {
              title: "West Coast Distribution",
              description: "Shipping from Los Angeles positions your inventory closer to California, Nevada, Arizona, and Oregon customers with 1 to 2 day transit zones and lower shipping costs."
            },
            {
              title: "Port Proximity Benefits",
              description: "Direct access to LA and Long Beach ports reduces container processing time and accelerates inventory availability. This creates faster restocking cycles and more predictable supply chain flow."
            },
            {
              title: "Influencer & Content Creator Support",
              description: "LA-based creators and influencer-led brands benefit from local fulfillment with same-day handling, flexible packaging, and rapid response to viral product launches."
            }
          ].map((useCase, index) => /* @__PURE__ */ jsxs("div", { className: "min-w-[400px] px-12 py-16 border-r border-border snap-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: useCase.title }) }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx(TranslatedText, { children: useCase.description }) })
          ] }, index))
        }
      ) }),
      /* @__PURE__ */ jsxs("section", { className: "relative py-40 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40" }),
        /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-7xl relative z-10", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-5xl md:text-6xl font-bold text-white text-center mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Los Angeles vs Non-Los Angeles 3PLs" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-white/60 text-center mb-16", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Why location matters for e-commerce fulfillment" }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 max-w-5xl mx-auto", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "LA 3PL" }) }),
              [
                "Direct port proximity",
                "1 to 2 days West Coast delivery",
                "Short container to shelf time",
                "Dense carrier network",
                "Ideal for DTC brands",
                "Lower shipping costs for CA customers"
              ].map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 text-white", children: [
                /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-green-400 mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: item }) })
              ] }, index))
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Non-LA 3PL" }) }),
              [
                "Slower inbound movement",
                "3 to 5 days delivery",
                "Long container processing",
                "Limited carrier access",
                "Mixed suitability",
                "Higher costs for West Coast"
              ].map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 text-white/60", children: [
                /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-red-400 mt-1 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(TranslatedText, { children: item }) })
              ] }, index))
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "py-32 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-5xl font-light text-center mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Why Brands Choose a 3PL in Los Angeles" }) }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-1 bg-primary mx-auto mb-16" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-0", children: [
          "Shorter transit zones for California and West Coast customers",
          "High daily order processing capacity with same-day handling",
          "Better access to influencer ecosystem and creator partnerships",
          "Faster restocks for California Amazon fulfillment centers",
          "Ideal for luxury, beauty, and lifestyle brand positioning",
          "Frequent freight schedules from Asia to LA ports"
        ].map((reason, index) => /* @__PURE__ */ jsx("div", { className: "py-5 border-b border-border", children: /* @__PURE__ */ jsx("p", { className: "text-lg text-center", children: /* @__PURE__ */ jsx(TranslatedText, { children: reason }) }) }, index)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-32 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-3xl text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Explore more about fulfillment, logistics, and 3PL operations in Los Angeles." }) }),
        /* @__PURE__ */ jsxs(Link, { to: "/why-choose-us", className: "inline-flex items-center gap-2 text-primary hover:underline", children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "Learn more about our services" }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  ThreePLLosAngeles as default
};
