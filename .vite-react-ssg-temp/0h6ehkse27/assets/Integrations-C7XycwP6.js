import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Head } from "vite-react-ssg";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Button, G as CalendlyModal, t as trackEvent, m as cn, H as Header, T as TranslatedText, A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, g as DialogDescription, F as Footer } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { X, Zap, Calendar, ArrowLeft, ArrowRight, Plus, RefreshCcw, Phone, Mail, Check, Globe, ShoppingCart, Truck, Package, Code, Route, Shield, Sparkles, ChevronRight, Clock, Activity, Lock } from "lucide-react";
import { B as Badge } from "./badge-BbLwm7hH.js";
import useEmblaCarousel from "embla-carousel-react";
import { SiShopify, SiAmazon, SiWalmart, SiFedex, SiUps, SiTiktok, SiEtsy, SiDhl, SiWoo, SiBigcommerce, SiMagento, SiPrestashop, SiWix, SiUsps, SiDeutschepost } from "react-icons/si";
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
const StickyIntegrationsCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      setIsVisible(scrollPercent > 30 && !isDismissed);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);
  const handleDemoClick = () => {
    trackEvent("integration_cta_clicked", { action: "book_demo" });
    setCalendlyOpen(true);
  };
  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AnimatePresence, { children: isVisible && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 },
        className: "hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 z-40",
        children: /* @__PURE__ */ jsxs("div", { className: "relative bg-background border border-border rounded-l-xl shadow-xl p-4 w-64", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleDismiss,
              className: "absolute -left-3 top-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors",
              children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 text-secondary" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: "Integration Demo" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "See how we connect Shopify, Amazon & more in under 5 minutes." }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: handleDemoClick,
                className: "w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm",
                size: "sm",
                children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 mr-2" }),
                  "Book a Demo"
                ]
              }
            )
          ] })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isVisible && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 100 },
        className: "lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-t border-border",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 max-w-lg mx-auto", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleDemoClick,
              className: "flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground",
              size: "lg",
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 mr-2" }),
                "Book Integration Demo"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleDismiss,
              className: "p-2 rounded-lg hover:bg-muted transition-colors",
              children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-muted-foreground" })
            }
          )
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx(CalendlyModal, { open: calendlyOpen, onOpenChange: setCalendlyOpen })
  ] });
};
const CarouselContext = React.createContext(null);
function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
const Carousel = React.forwardRef(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y"
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const onSelect = React.useCallback((api2) => {
      if (!api2) {
        return;
      }
      setCanScrollPrev(api2.canScrollPrev());
      setCanScrollNext(api2.canScrollNext());
    }, []);
    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);
    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);
    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );
    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }
      setApi(api);
    }, [api, setApi]);
    React.useEffect(() => {
      if (!api) {
        return;
      }
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);
    return /* @__PURE__ */ jsx(
      CarouselContext.Provider,
      {
        value: {
          carouselRef,
          api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext
        },
        children: /* @__PURE__ */ jsx(
          "div",
          {
            ref,
            onKeyDownCapture: handleKeyDown,
            className: cn("relative", className),
            role: "region",
            "aria-roledescription": "carousel",
            ...props,
            children
          }
        )
      }
    );
  }
);
Carousel.displayName = "Carousel";
const CarouselContent = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();
    return /* @__PURE__ */ jsx("div", { ref: carouselRef, className: "overflow-hidden", children: /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className),
        ...props
      }
    ) });
  }
);
CarouselContent.displayName = "CarouselContent";
const CarouselItem = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        role: "group",
        "aria-roledescription": "slide",
        className: cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className),
        ...props
      }
    );
  }
);
CarouselItem.displayName = "CarouselItem";
const CarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return /* @__PURE__ */ jsxs(
      Button,
      {
        ref,
        variant,
        size,
        className: cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        ),
        disabled: !canScrollPrev,
        onClick: scrollPrev,
        ...props,
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Previous slide" })
        ]
      }
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";
const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return /* @__PURE__ */ jsxs(
      Button,
      {
        ref,
        variant,
        size,
        className: cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        ),
        disabled: !canScrollNext,
        onClick: scrollNext,
        ...props,
        children: [
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Next slide" })
        ]
      }
    );
  }
);
CarouselNext.displayName = "CarouselNext";
const brandColors = {
  shopify: "#5E8E3E",
  shopifyPlus: "#3D6B29",
  amazon: "#FF9900",
  walmart: "#0057A0",
  tiktok: "#000000",
  etsy: "#D5581D",
  woocommerce: "#674399",
  bigcommerce: "#121118",
  faire: "#1A1A1A",
  magento: "#EE672F",
  prestashop: "#DF0067",
  wix: "#0C6EFC",
  mystore: "#1D4ED8",
  salesforce: "#00A1E0",
  lightspeed: "#78BE20",
  shipstation: "#84BD00",
  netsuite: "#1A5276",
  skubana: "#2E86AB",
  cin7: "#5B2C6F",
  quickbooks: "#2CA01C",
  hubspot: "#FF7A59",
  zoho: "#C8202B"
};
const carrierColors = {
  dhl: "#D40511",
  fedex: "#4D148C",
  ups: "#351C15",
  usps: "#004B87",
  shipstation: "#5A9A00",
  canadapost: "#E4002B",
  australiapost: "#E4002B",
  deutschepost: "#D40511"
};
const platformIcons = {
  shopify: SiShopify,
  shopifyPlus: SiShopify,
  amazon: SiAmazon,
  walmart: SiWalmart,
  tiktok: SiTiktok,
  etsy: SiEtsy,
  woocommerce: SiWoo,
  bigcommerce: SiBigcommerce,
  faire: null,
  magento: SiMagento,
  prestashop: SiPrestashop,
  wix: SiWix,
  mystore: null,
  netsuite: null,
  skubana: null,
  cin7: null,
  quickbooks: null,
  salesforce: null,
  hubspot: null,
  zoho: null
};
const logoImages = {
  mystore: "/integration-logos/mystore-logo.jpeg",
  faire: "/integration-logos/faire-logo.png",
  salesforce: "/integration-logos/salesforce-logo.jpeg",
  lightspeed: "/integration-logos/lightspeed-logo.svg",
  shipstation: "/integration-logos/shipstation-logo.png"
};
const carrierIcons = {
  dhl: SiDhl,
  fedex: SiFedex,
  ups: SiUps,
  usps: SiUsps,
  deutschepost: SiDeutschepost
};
const carrierLogoImages = {
  uship: "/integration-logos/uship-logo.png",
  ehub: "/integration-logos/ehub-logo.jpeg",
  pitneybowes: "/integration-logos/pitneybowes-logo.svg",
  postnord: "/integration-logos/postnord-logo.svg",
  bring: "/integration-logos/bring-logo.svg",
  canadapost: "/integration-logos/canadapost-logo.png",
  asendia: "/integration-logos/asendia-logo.png",
  australiapost: "/integration-logos/australiapost-logo.png",
  nzcouriers: "/integration-logos/nzcouriers-logo.jpeg",
  tusk: "/integration-logos/tusk-logo.jpeg",
  passport: "/integration-logos/passport-logo.jpeg",
  stallion: "/integration-logos/stallion-logo.png",
  vesyl: "/integration-logos/vesyl-logo.jpeg",
  flavorcloud: "/integration-logos/flavorcloud-logo.png",
  buku: "/integration-logos/bukuship-logo.png"
};
const filterLabels = {
  all: "All",
  ecommerce: "E-Commerce",
  shipping: "Shipping & Returns",
  inventory: "Inventory & WMS"
};
const filterOptions = [
  { id: "all", label: filterLabels.all, icon: /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }) },
  { id: "ecommerce", label: filterLabels.ecommerce, icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "w-4 h-4" }) },
  { id: "shipping", label: filterLabels.shipping, icon: /* @__PURE__ */ jsx(Truck, { className: "w-4 h-4" }) },
  { id: "inventory", label: filterLabels.inventory, icon: /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }) }
];
const integrations = [
  // E-Commerce (only those with icons/logos)
  { name: "Shopify", key: "shopify", category: "ecommerce", description: "Seamlessly sync your Shopify store with real-time order imports, inventory updates, and automatic tracking.", setupTime: "< 5 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true }, badge: "Most Popular" },
  { name: "Amazon", key: "amazon", category: "ecommerce", description: "Full Amazon Seller Central integration with FBA prep and inventory sync capabilities.", setupTime: "< 15 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true } },
  { name: "Walmart", key: "walmart", category: "ecommerce", description: "Connect your Walmart Marketplace with WFS-ready fulfillment support.", setupTime: "< 15 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: true }, badge: "WFS Ready" },
  { name: "TikTok Shop", key: "tiktok", category: "ecommerce", description: "Fulfill TikTok Shop orders with automatic inventory sync and tracking updates.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: true } },
  { name: "Etsy", key: "etsy", category: "ecommerce", description: "Sync your Etsy shop orders and manage inventory across all channels.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: false } },
  { name: "WooCommerce", key: "woocommerce", category: "ecommerce", description: "WordPress WooCommerce integration with webhook support for real-time updates.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true } },
  { name: "BigCommerce", key: "bigcommerce", category: "ecommerce", description: "Enterprise e-commerce platform integration with full order management.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: true } },
  { name: "Faire", key: "faire", category: "ecommerce", description: "Wholesale marketplace connecting brands and retailers for B2B order fulfillment.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: false } },
  { name: "Magento", key: "magento", category: "ecommerce", description: "Flexible open-source e-commerce platform for enterprise merchants.", setupTime: "< 15 minutes", features: { orderSync: true, inventorySync: true, returns: true, realTime: true } },
  { name: "Wix", key: "wix", category: "ecommerce", description: "Website builder with integrated e-commerce and automatic order sync.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: false } },
  // Shipping (only carriers with actual logos in public/integration-logos)
  { name: "ShipStation", key: "shipstation", category: "shipping", description: "Multi-carrier shipping platform integration for label printing and tracking.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: false, returns: false, realTime: true } },
  { name: "Canada Post", key: "canadapost", category: "shipping", description: "Canadian domestic and international shipping integration.", setupTime: "< 5 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "Australia Post", key: "australiapost", category: "shipping", description: "Australian domestic and international shipping services.", setupTime: "< 5 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "Pitney Bowes", key: "pitneybowes", category: "shipping", description: "Global shipping and mailing solutions integration.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "PostNord", key: "postnord", category: "shipping", description: "Nordic region postal and logistics services.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "Bring", key: "bring", category: "shipping", description: "Scandinavian logistics and parcel delivery.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "Asendia", key: "asendia", category: "shipping", description: "International mail and e-commerce delivery solutions.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "NZ Couriers", key: "nzcouriers", category: "shipping", description: "New Zealand domestic courier services.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "Stallion Express", key: "stallion", category: "shipping", description: "Cross-border shipping solutions for Canadian sellers.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "Passport", key: "passport", category: "shipping", description: "International shipping with duties and taxes included.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "BUKU Ship", key: "buku", category: "shipping", description: "E-commerce shipping and fulfillment platform.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: false, returns: false, realTime: true } },
  { name: "Vesyl", key: "vesyl", category: "shipping", description: "Multi-carrier shipping management platform.", setupTime: "< 10 minutes", features: { orderSync: true, inventorySync: false, returns: false, realTime: true } },
  { name: "FlavorCloud", key: "flavorcloud", category: "shipping", description: "International shipping with landed cost calculations.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  { name: "uShip", key: "uship", category: "shipping", description: "Freight and large item shipping marketplace.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: false, realTime: true } },
  { name: "eHub", key: "ehub", category: "shipping", description: "Enterprise shipping technology platform.", setupTime: "< 15 minutes", features: { orderSync: true, inventorySync: false, returns: false, realTime: true } },
  { name: "Tusk Logistics", key: "tusk", category: "shipping", description: "Regional parcel delivery network.", setupTime: "< 10 minutes", features: { orderSync: false, inventorySync: false, returns: true, realTime: true } },
  // Inventory & WMS
  { name: "Lightspeed", key: "lightspeed", category: "inventory", description: "Point of sale and inventory management for retail.", setupTime: "< 15 minutes", features: { orderSync: true, inventorySync: true, returns: false, realTime: true } }
];
const featureHighlightsData = [
  { icon: RefreshCcw, titleKey: "Sync in Real Time", descKey: "Inventory and order data flows in both directions — no manual updates needed." },
  { icon: Zap, titleKey: "Zero Setup Required", descKey: "Pre-built integrations for Shopify, Amazon, Walmart, Faire & more." },
  { icon: Code, titleKey: "Custom API Access", descKey: "Need something unique? Use our developer-friendly REST API or EDI." },
  { icon: Route, titleKey: "Automated Order Routing", descKey: "Set rules by channel, SKU, or customer segment." },
  { icon: Shield, titleKey: "Enterprise Security", descKey: "SOC2-compliant infrastructure with role-based access." }
];
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4 }
  }
};
const OrbitingLogos = () => {
  const orbitLogos = [
    { key: "shopify", name: "Shopify", Icon: SiShopify, color: brandColors.shopify },
    { key: "amazon", name: "Amazon", Icon: SiAmazon, color: brandColors.amazon },
    { key: "walmart", name: "Walmart", Icon: SiWalmart, color: brandColors.walmart },
    { key: "tiktok", name: "TikTok", Icon: SiTiktok, color: brandColors.tiktok },
    { key: "etsy", name: "Etsy", Icon: SiEtsy, color: brandColors.etsy },
    { key: "fedex", name: "FedEx", Icon: SiFedex, color: carrierColors.fedex },
    { key: "ups", name: "UPS", Icon: SiUps, color: carrierColors.ups },
    { key: "dhl", name: "DHL", Icon: SiDhl, color: carrierColors.dhl }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "relative w-80 h-80 md:w-96 md:h-96 mx-auto", children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { scale: 0 },
        animate: { scale: 1 },
        transition: { type: "spring", duration: 0.8 },
        className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
        children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 md:w-28 md:h-28 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-secondary/30", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/westfield-logo.png",
            alt: "Westfield Prep Center",
            className: "w-16 h-16 md:w-20 md:h-20 object-contain"
          }
        ) })
      }
    ),
    orbitLogos.map((logo, index) => {
      const angle = index * 360 / orbitLogos.length;
      const radius = 130;
      return /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0 },
          animate: {
            opacity: 1,
            scale: 1,
            rotate: [0, 360]
          },
          transition: {
            opacity: { delay: 0.2 + index * 0.1 },
            scale: { delay: 0.2 + index * 0.1, type: "spring" },
            rotate: {
              duration: 40 + index * 2,
              repeat: Infinity,
              ease: "linear"
            }
          },
          className: "absolute top-1/2 left-1/2 w-12 h-12 md:w-14 md:h-14",
          style: {
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`
          },
          children: /* @__PURE__ */ jsxs(
            motion.div,
            {
              animate: { rotate: [0, -360] },
              transition: {
                duration: 40 + index * 2,
                repeat: Infinity,
                ease: "linear"
              },
              whileHover: { scale: 1.2 },
              className: "w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer group relative border border-border/50 hover:border-secondary/50 transition-colors",
              children: [
                /* @__PURE__ */ jsx(logo.Icon, { size: 24, color: logo.color, className: "md:w-7 md:h-7" }),
                /* @__PURE__ */ jsx("div", { className: "absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-white bg-foreground px-2 py-1 rounded whitespace-nowrap", children: logo.name }) })
              ]
            }
          )
        },
        logo.key
      );
    }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-8 border-2 border-dashed border-white/20 rounded-full" })
  ] });
};
const IntegrationIcon = ({
  integrationKey,
  size = 36
}) => {
  const color = brandColors[integrationKey] || carrierColors[integrationKey] || "#6366F1";
  const logoImage = logoImages[integrationKey] || carrierLogoImages[integrationKey];
  if (logoImage) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src: logoImage,
        alt: integrationKey,
        className: "object-contain rounded",
        style: { width: size, height: size }
      }
    );
  }
  const Icon = platformIcons[integrationKey] || carrierIcons[integrationKey];
  if (Icon) {
    return /* @__PURE__ */ jsx(Icon, { size, color });
  }
  const initials = integrationKey.slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "rounded-lg flex items-center justify-center font-bold text-white",
      style: {
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: size * 0.4
      },
      children: initials
    }
  );
};
const IntegrationCard = ({
  integration,
  onClick
}) => {
  const color = brandColors[integration.key] || carrierColors[integration.key] || "#6366F1";
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      variants: cardVariants,
      whileHover: { y: -8, scale: 1.02 },
      onClick,
      className: "group relative cursor-pointer rounded-2xl border bg-card hover:bg-card/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden",
      children: [
        integration.badge && /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-4 z-20", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-1 text-white text-xs px-3 py-1.5 rounded-b-lg shadow-lg font-medium",
            style: { backgroundColor: color },
            children: [
              integration.badge === "Most Popular" && /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }),
              integration.badge
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 relative z-10", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-background shadow-sm border mb-4", children: /* @__PURE__ */ jsx(IntegrationIcon, { integrationKey: integration.key, size: 32 }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground mb-2", children: integration.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            integration.features.orderSync && /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium", children: "Orders" }),
            integration.features.inventorySync && /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground font-medium", children: "Inventory" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 text-primary" }) })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity",
            style: { backgroundColor: color }
          }
        )
      ]
    }
  );
};
const SecurityBanner = () => {
  const securityFeatures = [
    { icon: Clock, labelKey: "99.99% Uptime SLA" },
    { icon: Shield, labelKey: "SOC2-Compliant" },
    { icon: Activity, labelKey: "Real-Time Monitoring" },
    { icon: Lock, labelKey: "Role-Based Access" }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-12 bg-muted/50", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true },
      variants: staggerContainer,
      className: "grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8",
      children: securityFeatures.map((feature) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          variants: cardVariants,
          className: "flex flex-col md:flex-row items-center gap-3 text-center md:text-left",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(feature.icon, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm md:text-base", children: /* @__PURE__ */ jsx(TranslatedText, { children: feature.labelKey }) })
          ]
        },
        feature.labelKey
      ))
    }
  ) }) });
};
const Integrations = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const filteredIntegrations = useMemo(() => {
    if (selectedFilter === "all") return integrations;
    return integrations.filter((i) => i.category === selectedFilter);
  }, [selectedFilter]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Shopify & Amazon 3PL Integrations | Westfield Prep Center" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Connect Shopify, Amazon, Walmart, and 20+ platforms to Westfield's 3PL. Real-time order sync, inventory visibility — no developers required."
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/integrations" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Shopify & Amazon 3PL Integrations | Westfield Prep Center" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Connect Shopify, Amazon, Walmart, and 20+ platforms to Westfield's 3PL. Real-time order sync, inventory visibility — no developers required." }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/integrations" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://westfieldprepcenter.com/hero-warehouse-optimized.webp" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Westfield Prep Center" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@Westfield3PL" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Shopify & Amazon 3PL Integrations | Westfield Prep Center" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Connect Shopify, Amazon, Walmart, and 20+ platforms to Westfield's 3PL. Real-time order sync, inventory visibility." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://westfieldprepcenter.com/hero-warehouse-optimized.webp" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "SoftwareApplication",
            "name": "Westfield 3PL Integration Platform",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "Connect your e-commerce platforms, marketplaces, and carriers for Shopify 3PL integration and Amazon prep center sync",
            "featureList": [
              "Shopify fulfillment integration",
              "Amazon prep center sync",
              "Order routing and tracking",
              "Real-time inventory sync",
              ...integrations.map((i) => i.name)
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "url": "https://westfieldprepcenter.com/integrations"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do Shopify 3PL integrations work with Westfield?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our Shopify 3PL integration connects directly via OAuth. Once connected, orders automatically sync in real-time, inventory updates push within minutes, and tracking numbers upload automatically when orders ship."
                }
              },
              {
                "@type": "Question",
                "name": "Do you support real-time order syncing for Amazon prep?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all our e-commerce integrations including Amazon prep center sync support real-time order syncing via webhooks. When a customer places an order, it appears in our system within seconds."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need a developer to set up 3PL integrations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No developer needed. Our Shopify and Amazon 3PL integrations are plug-and-play with guided setup. Most clients complete setup in under 10 minutes."
                }
              },
              {
                "@type": "Question",
                "name": "Which e-commerce platforms do you integrate with?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We integrate with 40+ platforms including Shopify, Amazon, Walmart, TikTok Shop, Etsy, WooCommerce, BigCommerce, and many more. Contact us to see if we support your platform."
                }
              }
            ]
          }
        ]
      }) })
    ] }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Home", path: "/" }, { label: "Integrations", path: "/integrations" }] }),
    /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-to-br from-primary via-primary/95 to-secondary/20 pt-16 pb-20 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: {
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: "40px 40px"
      } }) }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: "hidden",
              animate: "visible",
              variants: staggerContainer,
              className: "text-center lg:text-left",
              children: [
                /* @__PURE__ */ jsx(motion.div, { variants: fadeUpVariants, children: /* @__PURE__ */ jsxs(Badge, { className: "bg-white/20 text-white border-white/30 mb-6 px-4 py-2", children: [
                  /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 mr-2" }),
                  /* @__PURE__ */ jsx(TranslatedText, { children: "20+ Integrations" })
                ] }) }),
                /* @__PURE__ */ jsx(
                  motion.h1,
                  {
                    variants: fadeUpVariants,
                    className: "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight",
                    children: /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify & Amazon 3PL Integrations" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  motion.p,
                  {
                    variants: fadeUpVariants,
                    className: "text-xl text-white/80 mb-8 max-w-xl",
                    children: /* @__PURE__ */ jsx(TranslatedText, { children: "From Shopify to Amazon, our 3PL platform connects your entire stack — effortlessly." })
                  }
                ),
                /* @__PURE__ */ jsx(motion.div, { variants: fadeUpVariants, className: "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start", children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsxs(
                  Button,
                  {
                    size: "lg",
                    className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1",
                    children: [
                      /* @__PURE__ */ jsx(TranslatedText, { children: "Get Started Today" }),
                      /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5" })
                    ]
                  }
                ) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.3 },
              className: "hidden lg:block",
              children: /* @__PURE__ */ jsx(OrbitingLogos, {})
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: "hidden",
            animate: "visible",
            variants: staggerContainer,
            className: "lg:hidden flex flex-wrap justify-center gap-3 mt-10",
            children: [
              { key: "shopify", Icon: SiShopify, color: brandColors.shopify },
              { key: "amazon", Icon: SiAmazon, color: brandColors.amazon },
              { key: "walmart", Icon: SiWalmart, color: brandColors.walmart },
              { key: "fedex", Icon: SiFedex, color: carrierColors.fedex },
              { key: "ups", Icon: SiUps, color: carrierColors.ups }
            ].map((logo) => /* @__PURE__ */ jsx(
              motion.div,
              {
                variants: cardVariants,
                className: "w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center",
                children: /* @__PURE__ */ jsx(logo.Icon, { size: 24, color: logo.color })
              },
              logo.key
            ))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, margin: "-100px" },
          variants: staggerContainer,
          className: "text-center mb-12",
          children: [
            /* @__PURE__ */ jsx(
              motion.h2,
              {
                variants: fadeUpVariants,
                className: "text-3xl md:text-4xl font-bold text-foreground mb-4",
                children: /* @__PURE__ */ jsx(TranslatedText, { children: "Browse All Integrations" })
              }
            ),
            /* @__PURE__ */ jsx(
              motion.p,
              {
                variants: fadeUpVariants,
                className: "text-lg text-muted-foreground max-w-2xl mx-auto",
                children: /* @__PURE__ */ jsx(TranslatedText, { children: "Filter by category to find the perfect connections for your business." })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUpVariants,
          className: "flex flex-wrap justify-center gap-2 md:gap-3 mb-12",
          children: filterOptions.map((filter) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSelectedFilter(filter.id),
              className: `
                  flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all
                  ${selectedFilter === filter.id ? "bg-primary text-primary-foreground shadow-lg scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80"}
                `,
              children: [
                filter.icon,
                /* @__PURE__ */ jsx(TranslatedText, { children: filter.label }),
                selectedFilter === filter.id && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: filteredIntegrations.length })
              ]
            },
            filter.id
          ))
        }
      ),
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          animate: "visible",
          exit: "hidden",
          variants: staggerContainer,
          className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
          children: [
            filteredIntegrations.map((integration) => /* @__PURE__ */ jsx(
              IntegrationCard,
              {
                integration,
                onClick: () => setSelectedIntegration(integration)
              },
              integration.key
            )),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                variants: cardVariants,
                className: "group relative bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/30 p-6 flex flex-col items-center justify-center text-center min-h-[180px] hover:border-primary/50 hover:bg-muted/50 transition-all duration-300",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors", children: /* @__PURE__ */ jsx(Plus, { className: "w-6 h-6 text-primary" }) }),
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground mb-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: "And Many More..." }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "New integrations added regularly" }) })
                ]
              }
            )
          ]
        },
        selectedFilter
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: staggerContainer,
          className: "text-center mb-12",
          children: [
            /* @__PURE__ */ jsx(
              motion.h2,
              {
                variants: fadeUpVariants,
                className: "text-3xl md:text-4xl font-bold text-foreground mb-4",
                children: /* @__PURE__ */ jsx(TranslatedText, { children: "Why Integrations Matter" })
              }
            ),
            /* @__PURE__ */ jsx(
              motion.p,
              {
                variants: fadeUpVariants,
                className: "text-lg text-muted-foreground max-w-2xl mx-auto",
                children: /* @__PURE__ */ jsx(TranslatedText, { children: "Connect once, automate forever. Here's what our integrations unlock for your business." })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUpVariants,
          children: /* @__PURE__ */ jsxs(
            Carousel,
            {
              opts: {
                align: "start",
                loop: true
              },
              className: "w-full max-w-5xl mx-auto",
              children: [
                /* @__PURE__ */ jsx(CarouselContent, { className: "-ml-2 md:-ml-4", children: featureHighlightsData.map((feature, index) => /* @__PURE__ */ jsx(CarouselItem, { className: "pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3", children: /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    whileHover: { y: -6, scale: 1.02 },
                    className: "h-full bg-card rounded-2xl border shadow-lg p-6 flex flex-col",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(feature.icon, { className: "w-7 h-7 text-primary" }) }),
                      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: feature.titleKey }) }),
                      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm flex-grow", children: /* @__PURE__ */ jsx(TranslatedText, { children: feature.descKey }) })
                    ]
                  }
                ) }, index)) }),
                /* @__PURE__ */ jsx(CarouselPrevious, { className: "hidden md:flex -left-12" }),
                /* @__PURE__ */ jsx(CarouselNext, { className: "hidden md:flex -right-12" })
              ]
            }
          )
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true },
        variants: staggerContainer,
        className: "max-w-4xl mx-auto",
        children: [
          /* @__PURE__ */ jsx(
            motion.h2,
            {
              variants: fadeUpVariants,
              className: "text-3xl md:text-4xl font-bold text-center text-foreground mb-12",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "Plug & Play in 3 Simple Steps" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: [
            { step: "1", titleKey: "Connect Your Store", descKey: "Authenticate with OAuth in one click. No API keys or developers needed." },
            { step: "2", titleKey: "Configure Settings", descKey: "Set your sync preferences, inventory rules, and order routing logic." },
            { step: "3", titleKey: "Start Shipping", descKey: "Orders flow in automatically. Inventory syncs. Tracking uploads." }
          ].map((item, index) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              variants: cardVariants,
              whileHover: { y: -4 },
              className: "relative text-center",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg", children: item.step }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.titleKey }) }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: item.descKey }) }),
                index < 2 && /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" })
              ]
            },
            item.step
          )) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-foreground text-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true },
        variants: staggerContainer,
        className: "max-w-4xl mx-auto",
        children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
          /* @__PURE__ */ jsxs(motion.div, { variants: fadeUpVariants, children: [
            /* @__PURE__ */ jsxs(Badge, { className: "bg-secondary/20 text-secondary border-secondary/30 mb-4", children: [
              /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 mr-2" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "Quick Setup" })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Connect Your Store in Minutes" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-background/70 mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Our pre-built integrations make it easy to connect your e-commerce platforms. No developers needed — just authenticate and start syncing." }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsx("span", { className: "text-secondary font-bold", children: "1" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Authenticate Your Store" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-background/60 text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Click connect and log in to your platform. We use secure OAuth for authentication." }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsx("span", { className: "text-secondary font-bold", children: "2" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Configure Sync Settings" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-background/60 text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Choose which products to sync and set your fulfillment preferences." }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsx("span", { className: "text-secondary font-bold", children: "3" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Start Fulfilling Orders" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-background/60 text-sm", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Orders sync automatically. We ship, you grow." }) })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(motion.div, { variants: fadeUpVariants, children: /* @__PURE__ */ jsx("div", { className: "relative bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl p-8 border border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(RefreshCcw, { className: "w-10 h-10 text-secondary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Real-Time Sync" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-background/70 mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Orders, inventory, and tracking update automatically across all your connected platforms." }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-secondary", children: "40+" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-background/60", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Integrations" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-secondary", children: "<5min" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-background/60", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Avg. Setup" }) })
              ] })
            ] })
          ] }) }) })
        ] })
      }
    ) }) }),
    /* @__PURE__ */ jsx(SecurityBanner, {}),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true },
        variants: staggerContainer,
        className: "max-w-3xl mx-auto",
        children: [
          /* @__PURE__ */ jsx(
            motion.h2,
            {
              variants: fadeUpVariants,
              className: "text-3xl md:text-4xl font-bold text-center text-foreground mb-12",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "Frequently Asked Questions" })
            }
          ),
          /* @__PURE__ */ jsx(motion.div, { variants: fadeUpVariants, children: /* @__PURE__ */ jsxs(Accordion, { type: "single", collapsible: true, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs(AccordionItem, { value: "item-1", className: "border rounded-xl px-6 bg-card", children: [
              /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left font-semibold hover:no-underline", children: /* @__PURE__ */ jsx(TranslatedText, { children: "How do integrations work with Westfield?" }) }),
              /* @__PURE__ */ jsx(AccordionContent, { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Our integrations connect directly to your platforms via OAuth. Once connected, orders automatically sync in real-time, inventory updates push to your stores within minutes, and tracking numbers are uploaded automatically when orders ship. Setup takes less than 10 minutes with no coding required." }) })
            ] }),
            /* @__PURE__ */ jsxs(AccordionItem, { value: "item-2", className: "border rounded-xl px-6 bg-card", children: [
              /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left font-semibold hover:no-underline", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Do you support real-time order syncing?" }) }),
              /* @__PURE__ */ jsx(AccordionContent, { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Yes, all our e-commerce integrations support real-time order syncing via webhooks. When a customer places an order on your store, it appears in our system within seconds. Inventory levels sync bidirectionally, so your store always shows accurate stock counts." }) })
            ] }),
            /* @__PURE__ */ jsxs(AccordionItem, { value: "item-3", className: "border rounded-xl px-6 bg-card", children: [
              /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left font-semibold hover:no-underline", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Do I need a developer to set up integrations?" }) }),
              /* @__PURE__ */ jsx(AccordionContent, { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "No developer needed. Our integrations are plug-and-play with guided setup. Simply authenticate your store, configure your preferences, and start syncing. Most clients complete setup in under 10 minutes. Our team is available to help if you need assistance." }) })
            ] }),
            /* @__PURE__ */ jsxs(AccordionItem, { value: "item-4", className: "border rounded-xl px-6 bg-card", children: [
              /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left font-semibold hover:no-underline", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Which platforms do you integrate with?" }) }),
              /* @__PURE__ */ jsx(AccordionContent, { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "We integrate with 40+ platforms including Shopify, Amazon, Walmart, TikTok Shop, Etsy, eBay, WooCommerce, BigCommerce, Faire, and many more e-commerce platforms and shipping carriers. Check our catalog above to see if your platform is supported." }) })
            ] })
          ] }) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true },
        variants: staggerContainer,
        className: "max-w-4xl mx-auto text-center",
        children: [
          /* @__PURE__ */ jsx(
            motion.h2,
            {
              variants: fadeUpVariants,
              className: "text-3xl md:text-4xl font-bold mb-6",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ready to Connect Your Store?" })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              variants: fadeUpVariants,
              className: "text-xl mb-10 opacity-90 leading-relaxed",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get started with our pre-built integrations and start fulfilling orders faster. Our team is ready to help you connect your platforms." })
            }
          ),
          /* @__PURE__ */ jsxs(motion.div, { variants: fadeUpVariants, className: "flex flex-col sm:flex-row gap-4 justify-center mb-10", children: [
            /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-7 text-lg font-bold rounded-full",
                children: [
                  /* @__PURE__ */ jsx(TranslatedText, { children: "Get Started" }),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(
              Button,
              {
                size: "lg",
                variant: "outline",
                className: "border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full",
                children: /* @__PURE__ */ jsx(TranslatedText, { children: "View Pricing" })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              variants: fadeUpVariants,
              className: "flex flex-col sm:flex-row gap-6 justify-center items-center mb-8",
              children: [
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "tel:+18189355478",
                    className: "flex items-center gap-2 hover:opacity-80 transition-opacity",
                    children: [
                      /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5" }),
                      /* @__PURE__ */ jsx("span", { children: "1.818.935.5478" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "mailto:info@westfieldprepcenter.com",
                    className: "flex items-center gap-2 hover:opacity-80 transition-opacity",
                    children: [
                      /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
                      /* @__PURE__ */ jsx("span", { children: "info@westfieldprepcenter.com" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              variants: fadeUpVariants,
              className: "text-sm opacity-75",
              children: /* @__PURE__ */ jsx(TranslatedText, { children: "Trusted by 100+ e-commerce brands | 2M+ orders shipped | Same-day turnaround" })
            }
          )
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!selectedIntegration, onOpenChange: () => setSelectedIntegration(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-lg", children: selectedIntegration && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsx(IntegrationIcon, { integrationKey: selectedIntegration.key, size: 40 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl", children: selectedIntegration.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Setup time:" }),
            " ",
            selectedIntegration.setupTime
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-base text-foreground", children: selectedIntegration.description }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Supported Features" }) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
          { label: "Order Sync", enabled: selectedIntegration.features.orderSync },
          { label: "Inventory Sync", enabled: selectedIntegration.features.inventorySync },
          { label: "Returns", enabled: selectedIntegration.features.returns },
          { label: "Real-Time", enabled: selectedIntegration.features.realTime }
        ].map((feature) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center gap-2 p-3 rounded-lg ${feature.enabled ? "bg-green-500/10" : "bg-muted"}`,
            children: [
              feature.enabled ? /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-green-600" }) : /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { className: feature.enabled ? "text-foreground" : "text-muted-foreground", children: feature.label })
            ]
          },
          feature.label
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: "flex-1", children: /* @__PURE__ */ jsxs(Button, { className: "w-full", size: "lg", children: [
          "Connect Now",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-4 h-4" })
        ] }) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "lg",
            onClick: () => setSelectedIntegration(null),
            children: "Close"
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(StickyIntegrationsCTA, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Integrations as default
};
