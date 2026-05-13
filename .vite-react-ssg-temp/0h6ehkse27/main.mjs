import { Head, ViteReactSSG } from "vite-react-ssg";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useRef, useCallback, useEffect, useState, Suspense, createContext, useContext, useMemo, createElement, lazy } from "react";
import { Link, useLocation, Outlet, useNavigate, Navigate } from "react-router-dom";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, MessageCircle, FileText, Calendar, Phone, Rocket, Package, TrendingUp, Building2, VolumeX, Volume2, Send, Loader2, ChevronDown, ChevronRight, Check, Circle, Globe, Menu, Star, Shield, ArrowRight, CheckCircle, Clock, Zap, Linkedin, Instagram, Twitter, MapPin, Mail } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { SiShopify, SiAmazon, SiTiktok, SiWalmart, SiEtsy, SiWoo } from "react-icons/si";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
function createMemoryStorage() {
  const store = /* @__PURE__ */ new Map();
  return {
    getItem: (k) => store.has(k) ? store.get(k) : null,
    setItem: (k, v) => {
      store.set(k, String(v));
    },
    removeItem: (k) => {
      store.delete(k);
    },
    clear: () => {
      store.clear();
    },
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    }
  };
}
const g = globalThis;
if (typeof g.localStorage === "undefined") {
  g.localStorage = createMemoryStorage();
}
if (typeof g.sessionStorage === "undefined") {
  g.sessionStorage = createMemoryStorage();
}
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t)
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(ToastPrimitives.Root, { ref, className: cn(toastVariants({ variant }), className), ...props });
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToastPrimitives.Title, { ref, className: cn("text-sm font-semibold", className), ...props }));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToastPrimitives.Description, { ref, className: cn("text-sm opacity-90", className), ...props }));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster$1() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      position: "top-right",
      expand: false,
      visibleToasts: 2,
      toastOptions: {
        duration: 3e3,
        style: {
          maxWidth: "280px",
          minHeight: "48px",
          padding: "8px 12px"
        },
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg text-xs py-2",
          description: "group-[.toast]:text-muted-foreground text-[11px] leading-tight",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-xs px-2 py-1",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-xs px-2 py-1",
          title: "text-xs font-medium"
        }
      },
      ...props
    }
  );
};
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const SUPABASE_URL = "https://gqnvkecmxjijrxhggcro.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbnZrZWNteGppanJ4aGdnY3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDA1NjMsImV4cCI6MjA3NDkxNjU2M30.9lYv5DtHc_qIsKC2H38yKdSuCTyQPZLhV6hAKiN3xh0";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});
const INACTIVITY_TIMEOUT = 30 * 60 * 1e3;
const useAutoLogout = (isAuthenticated, logoutCallback) => {
  const timeoutRef = useRef(null);
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        logoutCallback();
      }, INACTIVITY_TIMEOUT);
    }
  }, [isAuthenticated, logoutCallback]);
  useEffect(() => {
    if (!isAuthenticated) return;
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });
    resetTimer();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);
};
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const isLoggingOut = useRef(false);
  const logout = useCallback(async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
    setSession(null);
    setUser(null);
    setRole(null);
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (error) {
      console.error("SignOut error:", error);
    }
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-")) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("sb-")) {
        sessionStorage.removeItem(key);
      }
    });
    window.location.replace("/login");
  }, []);
  useAutoLogout(!!user, logout);
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session2) => {
        if (isLoggingOut.current) {
          return;
        }
        if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }
        setSession(session2);
        setUser(session2?.user ?? null);
        if (session2?.user) {
          setTimeout(async () => {
            const { error } = await supabase.rpc("activate_client_on_login");
            if (error && false) {
              console.error("Error activating client:", error);
            }
            fetchUserRole(session2.user.id);
          }, 0);
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    );
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      if (session2?.user) {
        setTimeout(async () => {
          const { error } = await supabase.rpc("activate_client_on_login");
          if (error && false) {
            console.error("Error activating client:", error);
          }
          fetchUserRole(session2.user.id);
        }, 0);
      } else {
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).single();
      if (!error && data) {
        setRole(data.role);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return { user, session, loading, role, logout };
};
const GoogleAnalytics = () => {
  const { user } = useAuth();
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    if (!user) {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => setShouldLoad(true), { timeout: 2e3 });
      } else {
        setTimeout(() => setShouldLoad(true), 2e3);
      }
    }
  }, [user]);
  if (user || !shouldLoad) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Head, { children: [
    /* @__PURE__ */ jsx("script", { async: true, src: "https://www.googletagmanager.com/gtag/js?id=G-H0QHBLGNQC" }),
    /* @__PURE__ */ jsx("script", { children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H0QHBLGNQC', {
            'send_page_view': false
          });
        ` })
  ] });
};
const APPROVED_FAQ = [
  // Getting Started
  {
    category: "Getting Started",
    question: "What makes Westfield Prep Center different?",
    answer: "We're a boutique prep center with a dedicated team that can check in products and ship them out much faster than traditional large-scale fulfillment centers. You get personalized attention and quicker turnaround times.",
    alternateAnswers: [
      "Speed and personal attention are our calling cards. Unlike big-box fulfillment centers, we're boutique-sized — which means faster processing, direct communication, and a team that actually knows your account.",
      "Think of us as the anti-mega-warehouse. We're smaller by design, which lets us move fast and give you the kind of hands-on service that's hard to find at larger 3PLs."
    ]
  },
  {
    category: "Getting Started",
    question: "How do I get started?",
    answer: "Fill out our contact form with your business details and monthly volume. We'll respond with an onboarding packet and pricing sheet tailored to your needs within 24 hours.",
    alternateAnswers: [
      "Getting started is easy — just fill out our contact form and we'll send you a custom quote within 24 hours. Once approved, you can start receiving inventory right away.",
      "Drop us your details via our contact form, and we'll have a custom pricing sheet back to you within a day. From there, onboarding moves fast."
    ]
  },
  {
    category: "Getting Started",
    question: "How fast can we get started?",
    answer: "Pretty quickly! We typically respond to quote requests within 24 hours. Once you approve, onboarding can begin immediately and you can start receiving inventory the same week.",
    alternateAnswers: [
      "We move fast — expect a custom quote within 24 hours, and once you're ready, we can usually start receiving your inventory within days.",
      "Speed is kind of our thing. Quote in 24 hours, immediate onboarding after approval, and most clients are shipping within a week."
    ]
  },
  {
    category: "Getting Started",
    question: "What does the setup process look like?",
    answer: "Simple and fast — you fill out a quick form, we send you custom pricing within 24 hours, and once approved, we get you set up in our system. Most clients are receiving inventory within days of approval.",
    alternateAnswers: [
      "It's pretty streamlined: submit your info, get pricing in 24 hours, approve it, and we handle the rest. Most brands are up and running within a week.",
      "No complicated setup here. Quick form, fast quote, and you're in our system and ready to receive inventory before you know it."
    ]
  },
  {
    category: "Getting Started",
    question: "Is there a minimum order quantity?",
    answer: "We work with brands of all sizes and don't have strict minimum order requirements. Whether you're just starting out or scaling rapidly, we'll create a custom pricing plan that fits your volume and needs."
  },
  {
    category: "Getting Started",
    question: "Can you handle large volumes?",
    answer: "Absolutely! We work with sellers of all sizes, from startups to established brands. We can scale our services to meet your growing business needs."
  },
  // Services
  {
    category: "Services",
    question: "What services does Westfield Prep Center offer?",
    answer: "We offer Amazon FBA prep, Walmart fulfillment, TikTok Shop fulfillment, Shopify order fulfillment, DTC fulfillment, receiving & inspection, polybagging, bubble wrap, bundling, product labeling (including FNSKU), case pack & carton prep, branded packaging, custom kitting, LTL & SPD shipping, and photo proof of every step."
  },
  {
    category: "Services",
    question: "Do you offer Amazon FBA prep?",
    answer: "Yes! We provide comprehensive Amazon FBA prep including FNSKU labeling, polybagging, bundling, case pack prep, and shipment to Amazon fulfillment centers. We stay up-to-date with all Amazon requirements.",
    alternateAnswers: [
      "Amazon FBA prep is one of our specialties. We handle FNSKU labeling, polybagging, bundling, case packs — the whole nine yards. And we stay current on Amazon's ever-changing requirements.",
      "Absolutely — FBA prep is a core service. From labeling to case packing to shipping to Amazon's FCs, we've got you covered."
    ]
  },
  {
    category: "Services",
    question: "Do you support Shopify fulfillment?",
    answer: "Yes! We provide same-day Shopify order fulfillment for orders placed before 2 PM PST. We offer branded packaging, custom inserts, and 99.8% accuracy rate.",
    alternateAnswers: [
      "Shopify fulfillment? That's our bread and butter. Same-day shipping for orders before 2 PM PST, branded packaging options, and a 99.8% accuracy rate.",
      "We're big on Shopify — same-day fulfillment, custom packaging, and an accuracy rate that keeps your customers happy."
    ]
  },
  {
    category: "Services",
    question: "What marketplaces do you support?",
    answer: "We support Amazon, Shopify, Walmart, TikTok Shop, and other major e-commerce platforms. We can handle multi-channel fulfillment from a single inventory pool."
  },
  {
    category: "Services",
    question: "Do you handle returns and removals?",
    answer: "Yes, we can receive and process customer returns, inspect items for restocking, handle exchanges, and provide detailed return reports."
  },
  {
    category: "Services",
    question: "Do you offer kitting and bundling?",
    answer: "Yes! We provide comprehensive kitting services including product assembly, bundling multiple items together, adding promotional inserts, gift boxing, and creating ready-to-ship product sets."
  },
  {
    category: "Services",
    question: "Can you handle subscription box fulfillment?",
    answer: "Yes, we're experienced in subscription box fulfillment with recurring monthly shipments, themed packaging, and custom inserts."
  },
  {
    category: "Services",
    question: "Do you offer white label services?",
    answer: "Yes! We can ship orders without any Westfield branding, using your company's branded packaging, inserts, and packing slips."
  },
  // Speed & Turnaround
  {
    category: "Turnaround",
    question: "How fast is receiving and shipping?",
    answer: "We pride ourselves on same-day turnaround for orders placed before 2 PM PST. Our boutique size allows us to process significantly faster than larger prep centers.",
    alternateAnswers: [
      "Speed is our strength — orders before 2 PM PST ship same day. Being boutique-sized means we move a lot faster than the big warehouses.",
      "Same-day shipping for orders in by 2 PM PST. Our smaller operation is built for speed, not bureaucracy."
    ]
  },
  {
    category: "Turnaround",
    question: "How quickly do you turn orders around?",
    answer: "Orders placed before 2 PM PST ship the same business day. Our boutique operation is built for speed — we process much faster than big-box fulfillment centers.",
    alternateAnswers: [
      "Same-day for orders before 2 PM PST. We're intentionally smaller so we can move faster than the mega-warehouses.",
      "Fast! 2 PM PST is our cutoff for same-day shipping. Being boutique means no red tape slowing things down."
    ]
  },
  {
    category: "Turnaround",
    question: "What is your same-day cutoff time?",
    answer: "Orders placed before 2 PM PST ship the same business day. Orders placed after 2 PM PST will ship the next business day."
  },
  {
    category: "Turnaround",
    question: "What are your business hours?",
    answer: "Our warehouse operates Monday through Friday, 8:00 AM to 5:00 PM Pacific Time. Same-day shipping cutoff is 2:00 PM PST."
  },
  {
    category: "Turnaround",
    question: "Do you offer rush processing?",
    answer: "Yes! Rush services are available for urgent shipments with an additional fee. This ensures priority handling and same-day or next-day completion."
  },
  // Quality & Documentation
  {
    category: "Quality",
    question: "Do you provide photo proof of your work?",
    answer: "Yes! We provide photo verification and quality control documentation for every step of the prep process. Every shipment is documented with timestamped photos."
  },
  {
    category: "Quality",
    question: "What's your accuracy rate?",
    answer: "We maintain a 99.8% accuracy rate for order fulfillment. Every order is double-checked during picking and packing."
  },
  {
    category: "Quality",
    question: "Are you insured?",
    answer: "Yes, we are fully insured with both General Liability and Warehouse Legal Liability insurance to protect your inventory."
  },
  // Location & Shipping
  {
    category: "Location",
    question: "Where is Westfield Prep Center located?",
    answer: "We're based in Los Angeles with easy access to major carriers for efficient shipping to fulfillment centers nationwide. Our strategic West Coast location ensures fast shipping times."
  },
  {
    category: "Location",
    question: "Where are you based?",
    answer: "We're based in Los Angeles with easy access to major carriers for efficient shipping nationwide. Our West Coast location gives us great connectivity to ports, carriers, and fulfillment centers.",
    alternateAnswers: [
      "Los Angeles — right in the heart of one of the country's biggest logistics hubs. Great access to carriers and fast shipping nationwide.",
      "We're LA-based, which gives us fantastic logistics infrastructure and quick access to carriers across the country."
    ]
  },
  {
    category: "Location",
    question: "Do you work nationwide?",
    answer: "Yes! While we're based in Los Angeles, we service brands nationwide. Our West Coast location gives us great access to carriers and fulfillment centers across the country.",
    alternateAnswers: [
      "Absolutely — we're based in LA but ship for brands all across the country. Our location actually makes nationwide shipping super efficient.",
      "We do! LA is our home base, but we work with brands coast to coast."
    ]
  },
  {
    category: "Location",
    question: "Why is Los Angeles a strategic location?",
    answer: "Los Angeles is a major logistics hub with access to the nation's largest port complex (LA/Long Beach), close proximity to international airports, and excellent carrier infrastructure."
  },
  {
    category: "Location",
    question: "Do you offer international shipping?",
    answer: "Yes! We can ship internationally to most countries worldwide. We handle customs documentation and work with international carriers."
  },
  // Fit & Ideal Clients
  {
    category: "Fit",
    question: "Who is Westfield Prep Center a good fit for?",
    answer: "We're ideal for e-commerce sellers on Amazon, Shopify, Walmart, and TikTok Shop who want personalized service, fast turnaround, and transparent communication. We work with brands of all sizes, from startups to established sellers."
  },
  {
    category: "Fit",
    question: "What kind of brands do you work with?",
    answer: "We work with eCommerce brands of all sizes — from startups shipping a few hundred units to established sellers moving thousands monthly. If you sell on Amazon, Shopify, Walmart, or TikTok Shop, we're a great fit.",
    alternateAnswers: [
      "All kinds! From scrappy startups to scaling brands doing thousands of units. If you're selling on Amazon, Shopify, Walmart, or TikTok Shop, we can help.",
      "Everyone from emerging brands to established sellers. Size doesn't matter to us — what matters is that you want a 3PL that moves fast and communicates well."
    ]
  },
  {
    category: "Fit",
    question: "Can you support high volume?",
    answer: "Absolutely! We scale with our clients. Whether you're doing a few hundred units or ramping up to thousands, our operations are built to handle growth.",
    alternateAnswers: [
      "For sure — we grow with you. Whether you're at a few hundred units or scaling to thousands, we're built to keep up.",
      "High volume is no problem. We've designed our operations to scale, so you can grow without worrying about outgrowing your 3PL."
    ]
  },
  {
    category: "Fit",
    question: "What is a 3PL?",
    answer: "A 3PL (Third-Party Logistics) provider handles warehousing, fulfillment, and shipping for e-commerce businesses. We store your inventory, pick and pack orders, and ship them to your customers or marketplace fulfillment centers."
  },
  // Logistics (Guarded)
  {
    category: "Logistics",
    question: "Do you support LTL or FTL shipments?",
    answer: "We support inbound LTL and FTL receiving and can coordinate with carriers for scheduling. The specifics depend on your volume and needs — a fulfillment audit helps us plan the best approach for your freight."
  },
  {
    category: "Logistics",
    question: "Can you assist with customs clearance?",
    answer: "We can assist and coordinate customs-related workflows, helping you navigate the process and receiving your inventory once it clears. We're not a customs broker, but we've helped many clients through this process — let's chat about your specific situation."
  }
];
const GREETING_MESSAGES = [
  "Have questions about Amazon FBA prep or fulfillment?",
  "Need help choosing the right 3PL?",
  "I can help you see if Westfield Prep Center is a good fit.",
  "Thinking about switching 3PLs? I can help with that.",
  "Got questions about our services or turnaround times?"
];
`You are a helpful, friendly assistant for Westfield Prep Center, a Los Angeles-based 3PL and Amazon FBA prep center.

## YOUR PERSONALITY & TONE:
- Be warm, confident, and conversational — like a knowledgeable friend, not a robot
- Acknowledge the user's intent before answering
- Use natural language variations — NEVER repeat the same phrasing twice
- Be helpful even when deferring to human contact

## STRICT RULES - MUST FOLLOW:
1. ONLY answer questions using information from the approved knowledge base.
2. NEVER speculate, infer, or make up information.
3. Keep responses to 3-5 sentences maximum.
4. Use bullet points when listing multiple items.
5. Include maximum 1 CTA per response.
6. If unsure, use a friendly deferral and suggest contacting the team.

## TOPICS YOU MUST DEFER (never answer directly):
- Exact pricing, costs, rates, or quotes
- Contract terms or SLAs
- Guaranteed delivery times or specific timelines
- Legal, tax, or liability questions
- Physical address or warehouse visits

## SAB COMPLIANCE:
- NEVER provide a physical address
- Say "Based in Los Angeles" or "Servicing Los Angeles & nationwide"

## APPROVED KNOWLEDGE BASE:
${APPROVED_FAQ.map((faq) => `Q: ${faq.question}
A: ${faq.answer}`).join("\n\n")}
`;
const useChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const abortControllerRef = useRef(null);
  useEffect(() => {
    const checkEnabled = async () => {
      try {
        const { data, error } = await supabase.from("chatbot_config").select("value").eq("key", "chatbot_enabled").single();
        if (!error && data?.value) {
          const config = data.value;
          setIsEnabled(config.enabled ?? false);
        }
      } catch (err) {
        console.error("Failed to check chatbot config:", err);
        setIsEnabled(false);
      }
    };
    checkEnabled();
  }, []);
  useEffect(() => {
    const randomGreeting = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
    setGreeting(randomGreeting);
  }, []);
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);
  const addAssistantMessage = useCallback((content) => {
    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content,
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, assistantMessage]);
  }, []);
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return;
    setHasUserSentMessage(true);
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    try {
      const messageHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content
      }));
      const response = await fetch(
        `${"https://gqnvkecmxjijrxhggcro.supabase.co"}/functions/v1/chat-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbnZrZWNteGppanJ4aGdnY3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDA1NjMsImV4cCI6MjA3NDkxNjU2M30.9lYv5DtHc_qIsKC2H38yKdSuCTyQPZLhV6hAKiN3xh0"}`
          },
          body: JSON.stringify({ messages: messageHistory }),
          signal: abortControllerRef.current.signal
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: /* @__PURE__ */ new Date()
        }
      ]);
      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let newlineIndex;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages(
                  (prev) => prev.map(
                    (msg) => msg.id === assistantId ? { ...msg, content: assistantContent } : msg
                  )
                );
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
      }
      console.log("[ChatBot] Message sent, response received");
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      console.error("[ChatBot] Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I'm having trouble right now. Please contact our team directly at (818) 935-5478 or use the contact form.",
          timestamp: /* @__PURE__ */ new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);
  return {
    messages,
    isOpen,
    isLoading,
    isEnabled,
    greeting,
    hasUserSentMessage,
    sendMessage,
    toggleChat,
    closeChat,
    addAssistantMessage
  };
};
const ChatBotButton = ({ isOpen, greeting, onClick }) => {
  return /* @__PURE__ */ jsx(AnimatePresence, { children: !isOpen && /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.2 },
      className: "fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-3",
      children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 10, y: 5 },
            animate: { opacity: 1, x: 0, y: 0 },
            transition: { delay: 1, duration: 0.4, ease: "easeOut" },
            className: "max-w-[240px] bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl px-4 py-3 shadow-lg shadow-black/5",
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 font-medium leading-relaxed", children: greeting }),
              /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2 right-6 w-4 h-4 bg-white/90 border-r border-b border-gray-200/50 transform rotate-45" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.button,
          {
            onClick,
            whileHover: { scale: 1.05, y: -2 },
            whileTap: { scale: 0.95 },
            className: "relative w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[hsl(28,100%,50%)] to-[hsl(28,100%,40%)] text-white shadow-xl shadow-[hsl(28,100%,50%)]/30 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[hsl(28,100%,50%)] focus:ring-offset-2 group",
            "aria-label": "Open chat",
            children: [
              /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" }),
              /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full border-2 border-white/40 animate-ping", style: { animationDuration: "2s" } }),
              /* @__PURE__ */ jsx(MessageCircle, { className: "w-8 h-8 drop-shadow-sm" })
            ]
          }
        )
      ]
    }
  ) });
};
const CALENDLY_URL$1 = "https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting";
const renderMessageWithCTAs = (content, onBookCall) => {
  const hasCtaOptions = content.includes("[SHOW_CTA_OPTIONS]");
  const phoneMatch = content.match(/\(818\) 935-5478/);
  let cleanContent = content.replace(/\[SHOW_CTA_OPTIONS\]/g, "").replace(/Get Free Fulfillment Audit/gi, "").replace(/Contact Our Team/gi, "").trim();
  cleanContent = cleanContent.replace(/\.\s*\.$/, ".").replace(/,\s*$/, "").trim();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: cleanContent }),
    hasCtaOptions && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/contact",
          className: "inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-[hsl(28,100%,50%)] to-[hsl(28,100%,40%)] text-white shadow-md shadow-[hsl(28,100%,50%)]/20 hover:shadow-lg hover:shadow-[hsl(28,100%,50%)]/30 hover:scale-[1.02] transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5" }),
            "Get a Free Quote"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            window.open(CALENDLY_URL$1, "_blank");
            onBookCall?.();
          },
          className: "inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }),
            "Book a Call"
          ]
        }
      )
    ] }),
    phoneMatch && /* @__PURE__ */ jsxs(
      "a",
      {
        href: "tel:+18189355478",
        className: "inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-[hsl(28,100%,50%)] to-[hsl(28,100%,40%)] text-white shadow-md shadow-[hsl(28,100%,50%)]/20 hover:shadow-lg hover:shadow-[hsl(28,100%,50%)]/30 hover:scale-[1.02] transition-all duration-200",
        children: [
          /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5" }),
          "(818) 935-5478"
        ]
      }
    )
  ] });
};
const ChatBotMessage = ({ message, onBookCall }) => {
  const isUser = message.role === "user";
  const content = message.content;
  const hasCTAs = content.includes("[SHOW_CTA_OPTIONS]") || content.includes("(818) 935-5478") || content.includes("Get Free Fulfillment Audit") || content.includes("Contact Our Team");
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 10, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.2, ease: "easeOut" },
      className: `flex ${isUser ? "justify-end" : "justify-start"} mb-1`,
      children: [
        !isUser && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(210,30%,12%)] to-[hsl(210,40%,20%)] flex items-center justify-center mr-2 mt-1 shadow-sm", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-white", children: "W" }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `max-w-[85%] px-4 py-3 ${isUser ? "bg-gradient-to-br from-[hsl(28,100%,50%)] to-[hsl(28,100%,42%)] text-white rounded-2xl rounded-br-md shadow-md shadow-[hsl(28,100%,50%)]/20" : "bg-white/90 backdrop-blur-sm border border-gray-100/80 text-gray-800 rounded-2xl rounded-bl-md shadow-sm"}`,
            children: isUser ? /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", children: content }) : hasCTAs ? renderMessageWithCTAs(content, onBookCall) : /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: content })
          }
        )
      ]
    }
  );
};
const QUESTION_CATEGORIES = [
  {
    title: "Getting Started",
    icon: Rocket,
    questions: [
      "How does onboarding work?",
      "How fast can we get started?",
      "What does the setup process look like?"
    ]
  },
  {
    title: "Fulfillment & Logistics",
    icon: Package,
    questions: [
      "Do you help with Amazon FBA prep?",
      "Can you handle Shopify fulfillment?",
      "Do you support LTL or FTL shipments?"
    ]
  },
  {
    title: "Operations & Scale",
    icon: TrendingUp,
    questions: [
      "What kind of brands do you work with?",
      "How quickly do you turn orders around?",
      "Can you support high volume?"
    ]
  },
  {
    title: "About Westfield",
    icon: Building2,
    questions: [
      "What makes you different from other 3PLs?",
      "Where are you based?",
      "Do you work nationwide?"
    ]
  }
];
const ChatBotQuickAsk = ({ visible, onQuestionClick }) => {
  if (!visible) return null;
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className: "space-y-4 pb-3",
      children: QUESTION_CATEGORIES.map((category, categoryIndex) => {
        const Icon = category.icon;
        return /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.2, delay: categoryIndex * 0.05 },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5 text-[hsl(28,100%,50%)]" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wide", children: category.title })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: category.questions.map((question, questionIndex) => /* @__PURE__ */ jsx(
                motion.button,
                {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.15, delay: categoryIndex * 0.05 + questionIndex * 0.02 },
                  whileHover: { scale: 1.02, y: -1 },
                  whileTap: { scale: 0.98 },
                  onClick: () => onQuestionClick(question),
                  className: "text-xs px-3.5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/80 text-gray-700 hover:bg-white hover:border-[hsl(28,100%,50%)]/30 hover:shadow-sm transition-all duration-200 text-left",
                  children: question
                },
                question
              )) })
            ]
          },
          category.title
        );
      })
    }
  );
};
let audioContext = null;
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};
const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.value = 0.3;
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  } catch (error) {
    console.warn("Could not play success sound:", error);
  }
};
const playErrorSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 200;
    oscillator.type = "sawtooth";
    gainNode.gain.value = 0.2;
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch (error) {
    console.warn("Could not play error sound:", error);
  }
};
const playChatSendSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 900;
    oscillator.type = "sine";
    gainNode.gain.value = 0.15;
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  } catch (error) {
    console.warn("Could not play chat send sound:", error);
  }
};
const playChatReceiveSound = () => {
  try {
    const ctx = getAudioContext();
    const frequencies = [500, 700];
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = "sine";
      gainNode.gain.value = 0.12;
      const startTime = ctx.currentTime + index * 0.08;
      const endTime = startTime + 0.08;
      gainNode.gain.setValueAtTime(0.12, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
  } catch (error) {
    console.warn("Could not play chat receive sound:", error);
  }
};
const CALENDLY_URL = "https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting";
const EXCLUDED_ROUTES = [
  "/admin",
  "/client",
  "/login",
  "/reset-password",
  "/thank-you"
];
const ChatBotInner = () => {
  const location = useLocation();
  const {
    messages,
    isOpen,
    isLoading,
    isEnabled,
    greeting,
    hasUserSentMessage,
    sendMessage,
    toggleChat,
    closeChat,
    addAssistantMessage
  } = useChatBot();
  const [input, setInput] = useState("");
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chatbot-muted") === "true";
    }
    return false;
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevMessageCountRef = useRef(messages.length);
  const isExcludedRoute = EXCLUDED_ROUTES.some(
    (route) => location.pathname.startsWith(route)
  );
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant" && !isMuted) {
        playChatReceiveSound();
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, isMuted]);
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem("chatbot-muted", String(newValue));
      return newValue;
    });
  };
  if (!isEnabled || isExcludedRoute) {
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userInput = input.trim();
    setInput("");
    if (!isMuted) {
      playChatSendSound();
    }
    await sendMessage(userInput);
  };
  const handleQuickAskClick = async (question) => {
    if (!isMuted) {
      playChatSendSound();
    }
    await sendMessage(question);
  };
  const handleBookCall = () => {
    window.open(CALENDLY_URL, "_blank");
    addAssistantMessage(
      "Great choice! The Calendly link should have opened in a new tab. Feel free to ask me anything else in the meantime."
    );
  };
  const showQuickAsk = messages.length === 0 && !hasUserSentMessage;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ChatBotButton, { isOpen, greeting, onClick: toggleChat }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95 },
        transition: { duration: 0.25, ease: "easeOut" },
        className: "fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-[calc(100vw-2rem)] max-w-[460px] max-h-[90vh] md:max-h-[640px] bg-gray-50 border border-gray-200/80 rounded-2xl shadow-2xl shadow-black/10 flex flex-col overflow-hidden",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[hsl(210,30%,12%)] to-[hsl(210,35%,18%)]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(28,100%,50%)] to-[hsl(28,100%,40%)] flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-white", children: "W" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm text-white", children: "Westfield Prep Center" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-300", children: "Online • Replies in minutes" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: toggleMute,
                  className: "p-2 rounded-lg hover:bg-white/10 transition-colors",
                  "aria-label": isMuted ? "Unmute sounds" : "Mute sounds",
                  title: isMuted ? "Unmute sounds" : "Mute sounds",
                  children: isMuted ? /* @__PURE__ */ jsx(VolumeX, { className: "w-4 h-4 text-gray-400" }) : /* @__PURE__ */ jsx(Volume2, { className: "w-4 h-4 text-gray-300" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: closeChat,
                  className: "p-2 rounded-lg hover:bg-white/10 transition-colors",
                  "aria-label": "Close chat",
                  children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 text-gray-300" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white", children: [
            messages.length === 0 && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                className: "text-center py-4 px-3",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(210,30%,12%)] to-[hsl(210,40%,20%)] flex items-center justify-center mx-auto mb-3 shadow-lg", children: /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "W" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700 mb-1", children: greeting }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Ask about services, turnaround times, or if we're a good fit." })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              ChatBotQuickAsk,
              {
                visible: showQuickAsk,
                onQuestionClick: handleQuickAskClick
              }
            ),
            messages.map((message) => /* @__PURE__ */ jsx(
              ChatBotMessage,
              {
                message,
                onBookCall: handleBookCall
              },
              message.id
            )),
            isLoading && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 5 },
                animate: { opacity: 1, y: 0 },
                className: "flex items-start gap-2",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(210,30%,12%)] to-[hsl(210,40%,20%)] flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-white", children: "W" }) }),
                  /* @__PURE__ */ jsx("div", { className: "bg-white/90 backdrop-blur-sm border border-gray-100/80 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-gray-400 animate-bounce", style: { animationDelay: "0ms" } }),
                    /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-gray-400 animate-bounce", style: { animationDelay: "150ms" } }),
                    /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-gray-400 animate-bounce", style: { animationDelay: "300ms" } })
                  ] }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
          ] }),
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: handleSubmit,
              className: "p-3 border-t border-gray-200/80 bg-white/80 backdrop-blur-sm",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      ref: inputRef,
                      type: "text",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      placeholder: "Type your question...",
                      className: "flex-1 px-4 py-3.5 text-base rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(28,100%,50%)]/30 focus:border-[hsl(28,100%,50%)]/50 transition-all placeholder:text-gray-400",
                      disabled: isLoading
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    motion.button,
                    {
                      type: "submit",
                      disabled: !input.trim() || isLoading,
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      className: "px-4 py-3.5 rounded-xl bg-gradient-to-r from-[hsl(28,100%,50%)] to-[hsl(28,100%,42%)] text-white shadow-md shadow-[hsl(28,100%,50%)]/20 hover:shadow-lg hover:shadow-[hsl(28,100%,50%)]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all",
                      "aria-label": "Send message",
                      children: /* @__PURE__ */ jsx(Send, { className: "w-5 h-5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-center text-[10px] text-gray-400 mt-2", children: "Powered by Westfield AI" })
              ]
            }
          )
        ]
      }
    ) })
  ] });
};
const ChatBot = () => {
  return /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(ChatBotInner, {}) });
};
const LanguageContext = createContext(null);
const STORAGE_KEY = "westfield_language";
const CACHE_STORAGE_KEY = "westfield_translation_cache";
function normalizeText$1(text) {
  return text.trim().replace(/\s+/g, " ");
}
function loadCacheFromStorage() {
  try {
    const stored = localStorage.getItem(CACHE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load translation cache:", e);
  }
  return {};
}
let saveCacheTimeout = null;
function saveCacheToStorage(cache) {
  if (saveCacheTimeout) {
    clearTimeout(saveCacheTimeout);
  }
  saveCacheTimeout = window.setTimeout(() => {
    try {
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.error("Failed to save translation cache:", e);
    }
  }, 500);
}
function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [isDetecting, setIsDetecting] = useState(true);
  const [translationCache, setTranslationCache] = useState(loadCacheFromStorage);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false);
  const translationCacheRef = useRef(loadCacheFromStorage());
  const currentLanguageRef = useRef("en");
  const pendingTranslationsRef = useRef(/* @__PURE__ */ new Map());
  const batchTimeoutRef = useRef(null);
  const pendingCountRef = useRef(0);
  const transitionTimeoutRef = useRef(null);
  useEffect(() => {
    translationCacheRef.current = translationCache;
    saveCacheToStorage(translationCache);
  }, [translationCache]);
  useEffect(() => {
    currentLanguageRef.current = currentLanguage;
  }, [currentLanguage]);
  useEffect(() => {
    async function loadLanguages() {
      const { data } = await supabase.from("supported_languages").select("*").eq("is_active", true);
      if (data) {
        setSupportedLanguages(data);
      }
    }
    loadLanguages();
  }, []);
  useEffect(() => {
    async function detectLanguage() {
      setIsDetecting(true);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCurrentLanguage(saved);
        setIsDetecting(false);
        return;
      }
      const browserLang = navigator.language?.split("-")[0]?.toLowerCase();
      if (browserLang && browserLang !== "en") {
        const { data: langData } = await supabase.from("supported_languages").select("code").eq("code", browserLang).eq("is_active", true).single();
        if (langData) {
          setCurrentLanguage(browserLang);
          localStorage.setItem(STORAGE_KEY, browserLang);
          setIsDetecting(false);
          return;
        }
      }
      setCurrentLanguage("en");
      setIsDetecting(false);
    }
    detectLanguage();
  }, []);
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);
  const setLanguage = useCallback((lang) => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    if (lang !== "en" && lang !== currentLanguageRef.current) {
      setIsLanguageTransitioning(true);
      pendingCountRef.current = 0;
      setTimeout(() => {
        setIsLanguageTransitioning((prevState) => {
          if (prevState) {
            console.warn("Translation transition timed out - forcing complete");
            pendingCountRef.current = 0;
            return false;
          }
          return prevState;
        });
      }, 1500);
    } else if (lang === "en") {
      setIsLanguageTransitioning(false);
      pendingCountRef.current = 0;
      pendingTranslationsRef.current.clear();
    }
    setCurrentLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);
  const translate = useCallback(async (texts, context) => {
    const lang = currentLanguageRef.current;
    if (lang === "en") {
      return texts;
    }
    const cache = translationCacheRef.current;
    const normalizedTexts = texts.map((t) => normalizeText$1(t));
    const uncachedTexts = [];
    const uncachedIndices = [];
    const results = [...texts];
    normalizedTexts.forEach((text, i) => {
      const cacheKey = `${lang}:${text}`;
      if (cache[cacheKey]) {
        results[i] = cache[cacheKey];
      } else if (text) {
        uncachedTexts.push(text);
        uncachedIndices.push(i);
      }
    });
    if (uncachedTexts.length === 0) {
      return results;
    }
    setIsTranslating(true);
    try {
      const response = await supabase.functions.invoke("translate-content", {
        body: { texts: uncachedTexts, targetLanguage: lang, context }
      });
      if (response.data?.translations) {
        const newCache = {};
        response.data.translations.forEach((t, i) => {
          const originalIndex = uncachedIndices[i];
          results[originalIndex] = t.translated;
          newCache[`${lang}:${t.source}`] = t.translated;
        });
        translationCacheRef.current = { ...translationCacheRef.current, ...newCache };
        setTranslationCache((prev) => ({ ...prev, ...newCache }));
      }
    } catch (error) {
      console.error("Translation failed:", error);
    }
    setIsTranslating(false);
    return results;
  }, []);
  const checkTransitionComplete = useCallback(() => {
    if (pendingCountRef.current <= 0 && pendingTranslationsRef.current.size === 0) {
      setIsLanguageTransitioning(false);
    }
  }, []);
  const processBatch = useCallback(async () => {
    const pending = Array.from(pendingTranslationsRef.current.entries());
    pendingTranslationsRef.current.clear();
    if (pending.length === 0) {
      checkTransitionComplete();
      return;
    }
    const texts = pending.map(([text]) => text);
    try {
      const results = await translate(texts);
      pending.forEach(([text, resolvers], i) => {
        resolvers.forEach((resolve) => {
          resolve(results[i]);
          pendingCountRef.current -= 1;
        });
      });
    } catch (error) {
      console.error("Batch translation failed:", error);
      pending.forEach(([text, resolvers]) => {
        resolvers.forEach((resolve) => {
          resolve(text);
          pendingCountRef.current -= 1;
        });
      });
    }
    if (pendingCountRef.current <= 0 && pendingTranslationsRef.current.size === 0) {
      setIsLanguageTransitioning(false);
    }
  }, [translate]);
  const queueTranslation = useCallback((text) => {
    return new Promise((resolve) => {
      const lang = currentLanguageRef.current;
      if (lang === "en") {
        resolve(text);
        return;
      }
      const normalized = normalizeText$1(text);
      const cacheKey = `${lang}:${normalized}`;
      if (translationCacheRef.current[cacheKey]) {
        resolve(translationCacheRef.current[cacheKey]);
        return;
      }
      pendingCountRef.current += 1;
      const existing = pendingTranslationsRef.current.get(normalized);
      if (existing) {
        existing.push(resolve);
      } else {
        pendingTranslationsRef.current.set(normalized, [resolve]);
      }
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      batchTimeoutRef.current = window.setTimeout(processBatch, 10);
    });
  }, [processBatch]);
  return /* @__PURE__ */ jsx(LanguageContext.Provider, { value: {
    currentLanguage,
    setLanguage,
    supportedLanguages,
    isDetecting,
    translate,
    queueTranslation,
    translationCache,
    isTranslating,
    isLanguageTransitioning
  }, children });
}
function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
function TranslationLoadingOverlay() {
  const { isLanguageTransitioning, currentLanguage } = useLanguage();
  if (!isLanguageTransitioning || currentLanguage === "en") {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 p-6 bg-card rounded-lg shadow-lg border border-border", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }),
    /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Translating..." })
  ] }) });
}
const getCanonicalUrl = (path) => {
  const baseUrl = "https://westfieldprepcenter.com";
  return `${baseUrl}${path}`;
};
const generateMetaTags = (title, description, path, imageUrl, type = "website") => {
  const canonicalUrl = getCanonicalUrl(path);
  const defaultImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png";
  return {
    title,
    description,
    canonical: canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogImage: imageUrl || defaultImage,
    ogType: type,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl || defaultImage
  };
};
const normalizePathname = (pathname) => {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
};
const RouteCanonical = () => {
  const { pathname } = useLocation();
  const canonicalUrl = getCanonicalUrl(normalizePathname(pathname));
  return /* @__PURE__ */ jsx(Head, { prioritizeSeoTags: true, children: /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonicalUrl }) });
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1e3,
      gcTime: 30 * 60 * 1e3,
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnReconnect: "always"
    }
  }
});
const App = () => {
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(LanguageProvider, { children: [
    /* @__PURE__ */ jsx(Toaster$1, {}),
    /* @__PURE__ */ jsx(Toaster, {}),
    /* @__PURE__ */ jsx(GoogleAnalytics, {}),
    /* @__PURE__ */ jsx(TranslationLoadingOverlay, {}),
    /* @__PURE__ */ jsx(RouteCanonical, {}),
    /* @__PURE__ */ jsx(
      Suspense,
      {
        fallback: /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }),
        children: /* @__PURE__ */ jsx(Outlet, {})
      }
    ),
    /* @__PURE__ */ jsx(ChatBot, {})
  ] }) }) });
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Root,
  {
    ref,
    className: cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(NavigationMenuViewport, {})
    ]
  }
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.List,
  {
    ref,
    className: cn("group flex flex-1 list-none items-center justify-center space-x-1", className),
    ...props
  }
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);
const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Trigger,
  {
    ref,
    className: cn(navigationMenuTriggerStyle(), "group", className),
    ...props,
    children: [
      children,
      " ",
      /* @__PURE__ */ jsx(
        ChevronDown,
        {
          className: "relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        }
      )
    ]
  }
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Content,
  {
    ref,
    className: cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className
    ),
    ...props
  }
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: cn("absolute left-0 top-full flex justify-center"), children: /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Viewport,
  {
    className: cn(
      "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
      className
    ),
    ref,
    ...props
  }
) }));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;
const NavigationMenuIndicator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Indicator,
  {
    ref,
    className: cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" })
  }
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;
const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(
  ({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(SheetPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
      children,
      /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [
        /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
      ] })
    ] })
  ] })
);
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, { ref, className: cn("text-lg font-semibold text-foreground", className), ...props }));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const westfieldLogo = "/assets/westfield-logo-BF-8rZ7Z.png";
const trackEvent = (eventName, params) => {
  console.log(`[Analytics] ${eventName}`, { timestamp: (/* @__PURE__ */ new Date()).toISOString(), ...params });
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...params,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
};
const Dialog = SheetPrimitive.Root;
const DialogPortal = SheetPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = SheetPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      onEscapeKeyDown,
      onPointerDownOutside,
      onInteractOutside,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = SheetPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className), ...props });
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = SheetPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
DialogDescription.displayName = SheetPrimitive.Description.displayName;
function normalizeText(text) {
  return text.trim().replace(/\s+/g, " ");
}
function TranslatedText({
  children,
  as = "span",
  className = ""
}) {
  const { currentLanguage, queueTranslation, translationCache, isLanguageTransitioning } = useLanguage();
  const [translated, setTranslated] = useState(children);
  const mountedRef = useRef(true);
  const normalized = useMemo(() => normalizeText(children), [children]);
  const cacheKey = `${currentLanguage}:${normalized}`;
  const cached = translationCache[cacheKey];
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    if (currentLanguage === "en") {
      setTranslated(children);
      return;
    }
    if (cached) {
      setTranslated(cached);
      return;
    }
    queueTranslation(children).then((result) => {
      if (mountedRef.current) {
        setTranslated(result);
      }
    });
  }, [children, currentLanguage, cached, queueTranslation]);
  const isLoading = currentLanguage !== "en" && !cached && isLanguageTransitioning;
  const opacityClass = isLoading ? "opacity-60" : "opacity-100";
  return createElement(as, {
    className: `${className} transition-opacity duration-200 ${opacityClass}`.trim()
  }, translated);
}
function useTranslation() {
  const { currentLanguage, translate, queueTranslation, translationCache, isTranslating } = useLanguage();
  const t = async (text) => {
    if (currentLanguage === "en") return text;
    const normalized = normalizeText(text);
    const cacheKey = `${currentLanguage}:${normalized}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    return queueTranslation(text);
  };
  const tSync = (text) => {
    if (currentLanguage === "en") return text;
    const normalized = normalizeText(text);
    const cacheKey = `${currentLanguage}:${normalized}`;
    return translationCache[cacheKey] || text;
  };
  const tBatch = async (texts, context) => {
    if (currentLanguage === "en") return texts;
    return translate(texts, context);
  };
  return { t, tSync, tBatch, currentLanguage, isTranslating };
}
const CalendlyModal = ({ open, onOpenChange }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const initializeWidget = useCallback(() => {
    if (!containerRef.current || !window.Calendly) return false;
    try {
      containerRef.current.innerHTML = "";
      window.Calendly.initInlineWidget({
        url: "https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting",
        parentElement: containerRef.current,
        prefill: {},
        utm: {}
      });
      setIsLoading(false);
      setHasError(false);
      return true;
    } catch (error) {
      console.error("Calendly init error:", error);
      setHasError(true);
      return false;
    }
  }, []);
  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      return;
    }
    trackEvent("calendly_modal_opened");
    setIsLoading(true);
    setHasError(false);
    const loadAndInit = () => {
      if (window.Calendly) {
        setTimeout(initializeWidget, 100);
        return;
      }
      const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        const checkCalendly = setInterval(() => {
          if (window.Calendly) {
            clearInterval(checkCalendly);
            initializeWidget();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(checkCalendly);
          if (!window.Calendly) setHasError(true);
        }, 5e3);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => {
        setTimeout(initializeWidget, 200);
      };
      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };
    loadAndInit();
  }, [open, initializeWidget]);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[700px] h-[700px] p-0 overflow-hidden", children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "p-6 pb-2", children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl", children: [
      /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-secondary" }),
      /* @__PURE__ */ jsx(TranslatedText, { children: "Schedule a Call with Our Team" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-h-[600px] w-full", children: [
      isLoading && !hasError && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background z-10", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "w-10 h-10 mx-auto text-secondary animate-spin" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Loading calendar..." }) })
      ] }) }),
      hasError && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background z-10", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 p-8", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "w-12 h-12 mx-auto text-muted-foreground" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Unable to load calendar" }) }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://calendly.com/westfieldprepcenter-info/westfield-3pl-meeting",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90",
            children: /* @__PURE__ */ jsx(TranslatedText, { children: "Open in new tab" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: containerRef,
          className: "w-full h-full",
          style: { minHeight: "600px" }
        }
      )
    ] })
  ] }) });
};
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent focus:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, { ref, className: cn("-mx-1 my-1 h-px bg-muted", className), ...props }));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
function LanguageSwitcher({ variant = "default", className = "" }) {
  const { currentLanguage, setLanguage, supportedLanguages, isDetecting } = useLanguage();
  const currentLang = supportedLanguages.find((l) => l.code === currentLanguage);
  if (supportedLanguages.length <= 1) {
    return null;
  }
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: variant === "compact" ? "sm" : "default",
        className: `gap-2 ${className}`,
        disabled: isDetecting,
        children: currentLang ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "text-base", children: currentLang.flag_emoji }),
          variant !== "compact" && /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: currentLang.native_name })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
          variant !== "compact" && /* @__PURE__ */ jsx("span", { children: "Language" })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", className: "min-w-[160px]", children: supportedLanguages.map((lang) => /* @__PURE__ */ jsxs(
      DropdownMenuItem,
      {
        onClick: () => setLanguage(lang.code),
        className: "flex items-center gap-2 cursor-pointer",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-base", children: lang.flag_emoji }),
          /* @__PURE__ */ jsx("span", { className: "flex-1", children: lang.native_name }),
          currentLanguage === lang.code && /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-primary" })
        ]
      },
      lang.code
    )) })
  ] });
}
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const isHomePage = location.pathname === "/";
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };
  const handleScheduleCall = () => {
    trackEvent("schedule_call_clicked", { location: "header" });
    setCalendlyOpen(true);
  };
  const handleMobileNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };
  const dashboardRoutes = ["/admin/dashboard", "/client/dashboard", "/admin/settings", "/client/settings"];
  const isDashboardRoute = dashboardRoutes.includes(location.pathname);
  if (user && role && isDashboardRoute) {
    return null;
  }
  const salesChannels = [
    { path: "/sales-channels/shopify", name: "Shopify", icon: SiShopify, color: "text-[#5E8E3E]" },
    { path: "/sales-channels/amazon", name: "Amazon", icon: SiAmazon, color: "text-[#FF9900]" },
    { path: "/sales-channels/tiktok-shop", name: "TikTok Shop", icon: SiTiktok, color: "text-foreground" },
    { path: "/sales-channels/walmart", name: "Walmart", icon: SiWalmart, color: "text-[#0057A0]" },
    { path: "/sales-channels/etsy", name: "Etsy", icon: SiEtsy, color: "text-[#D5581D]" },
    { path: "/sales-channels/woocommerce", name: "WooCommerce", icon: SiWoo, color: "text-[#674399]" }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "header",
      {
        className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 ${isScrolled ? "bg-background shadow-md" : "bg-background/95 backdrop-blur-sm"}`,
        children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-6", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: "flex items-center flex-shrink-0 cursor-pointer py-2 px-2 rounded-md hover:bg-accent/50 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all",
              onClick: handleLogoClick,
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: westfieldLogo,
                  alt: "Los Angeles Prep Center | Westfield Fulfillment Logo",
                  className: "h-8 md:h-10 w-auto object-contain block"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("nav", { className: "hidden lg:flex items-center gap-8", children: [
            /* @__PURE__ */ jsx(Link, { to: "/", className: "text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Home" }) }),
            /* @__PURE__ */ jsx(Link, { to: "/pricing", className: "text-foreground hover:text-primary transition-colors font-medium text-sm flex items-center gap-1 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "See Your Savings" }) }) }),
            /* @__PURE__ */ jsx(NavigationMenu, { children: /* @__PURE__ */ jsx(NavigationMenuList, { children: /* @__PURE__ */ jsxs(NavigationMenuItem, { children: [
              /* @__PURE__ */ jsx(NavigationMenuTrigger, { className: "bg-transparent hover:bg-transparent data-[state=open]:bg-transparent text-foreground hover:text-primary font-medium text-sm h-auto p-0", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Sales Channels" }) }),
              /* @__PURE__ */ jsx(NavigationMenuContent, { className: "bg-background border border-border shadow-lg z-[60]", children: /* @__PURE__ */ jsxs("div", { className: "w-64 p-2", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider px-2 py-1.5", children: "Featured Platforms" }),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/sales-channels/shopify",
                    className: "flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(SiShopify, { className: "mr-2 h-4 w-4 text-[#5E8E3E]" }),
                      "Shopify"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/sales-channels/amazon",
                    className: "flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(SiAmazon, { className: "mr-2 h-4 w-4 text-[#FF9900]" }),
                      "Amazon"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/sales-channels/tiktok-shop",
                    className: "flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(SiTiktok, { className: "mr-2 h-4 w-4" }),
                      "TikTok Shop"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "h-px bg-border my-2" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider px-2 py-1.5", children: "More Platforms" }),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/sales-channels/walmart",
                    className: "flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(SiWalmart, { className: "mr-2 h-4 w-4 text-[#0057A0]" }),
                      "Walmart"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/sales-channels/etsy",
                    className: "flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(SiEtsy, { className: "mr-2 h-4 w-4 text-[#D5581D]" }),
                      "Etsy"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/sales-channels/woocommerce",
                    className: "flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(SiWoo, { className: "mr-2 h-4 w-4 text-[#674399]" }),
                      "WooCommerce"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "h-px bg-border my-2" }),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/sales-channels",
                    className: "flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer font-medium text-primary",
                    children: "View All Channels →"
                  }
                )
              ] }) })
            ] }) }) }),
            /* @__PURE__ */ jsx(Link, { to: "/integrations", className: "text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Integrations" }) }),
            /* @__PURE__ */ jsx(Link, { to: "/why-choose-us", className: "text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Why Choose Us" }) }),
            /* @__PURE__ */ jsx(Link, { to: "/launchpad", className: "text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Launchpad" }) }),
            /* @__PURE__ */ jsx(Link, { to: "/testimonials", className: "text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Testimonials" }) }),
            /* @__PURE__ */ jsx(Link, { to: "/blog", className: "text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Blog" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden xl:flex items-center gap-4 ml-6", children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "tel:+18189355478",
                className: "flex items-center gap-2 text-primary hover:text-secondary transition-colors group",
                children: [
                  /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 group-hover:scale-110 transition-transform" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: "1.818.935.5478" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: handleScheduleCall,
                variant: "outline",
                size: "default",
                className: "border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold",
                children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 mr-2" }),
                  /* @__PURE__ */ jsx(TranslatedText, { children: "Schedule a Call" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => navigate("/contact"),
                size: "default",
                className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold",
                children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get a Quote" })
              }
            ),
            /* @__PURE__ */ jsx(LanguageSwitcher, { variant: "compact" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex lg:hidden items-center gap-2", children: [
            /* @__PURE__ */ jsxs(Sheet, { open: mobileMenuOpen, onOpenChange: setMobileMenuOpen, children: [
              /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-10 w-10",
                  "aria-label": "Open navigation menu",
                  children: /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
                }
              ) }),
              /* @__PURE__ */ jsxs(SheetContent, { side: "left", className: "w-[300px] sm:w-[350px] flex flex-col p-0", children: [
                /* @__PURE__ */ jsx(SheetHeader, { className: "border-b p-4", children: /* @__PURE__ */ jsx(SheetTitle, { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: westfieldLogo,
                    alt: "Westfield Prep Center",
                    className: "h-8 w-auto object-contain"
                  }
                ) }) }),
                /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleMobileNavClick("/"),
                      className: "flex items-center px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors text-left",
                      children: /* @__PURE__ */ jsx(TranslatedText, { children: "Home" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleMobileNavClick("/pricing"),
                      className: "flex items-center px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors text-left text-secondary",
                      children: /* @__PURE__ */ jsx(TranslatedText, { children: "See Your Savings" })
                    }
                  ),
                  /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "w-full", children: /* @__PURE__ */ jsxs(AccordionItem, { value: "sales-channels", className: "border-none", children: [
                    /* @__PURE__ */ jsx(AccordionTrigger, { className: "px-3 py-3 text-base font-medium rounded-lg hover:bg-accent hover:no-underline [&[data-state=open]]:bg-accent/50", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Sales Channels" }) }),
                    /* @__PURE__ */ jsx(AccordionContent, { className: "pb-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 pl-3", children: [
                      salesChannels.map((channel) => /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => handleMobileNavClick(channel.path),
                          className: "flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-accent transition-colors text-left",
                          children: [
                            /* @__PURE__ */ jsx(channel.icon, { className: `mr-3 h-4 w-4 ${channel.color}` }),
                            channel.name
                          ]
                        },
                        channel.path
                      )),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => handleMobileNavClick("/sales-channels"),
                          className: "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left text-primary",
                          children: [
                            /* @__PURE__ */ jsx(TranslatedText, { children: "View All Channels" }),
                            " →"
                          ]
                        }
                      )
                    ] }) })
                  ] }) }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleMobileNavClick("/integrations"),
                      className: "flex items-center px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors text-left",
                      children: /* @__PURE__ */ jsx(TranslatedText, { children: "Integrations" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleMobileNavClick("/why-choose-us"),
                      className: "flex items-center px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors text-left",
                      children: /* @__PURE__ */ jsx(TranslatedText, { children: "Why Choose Us" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleMobileNavClick("/launchpad"),
                      className: "flex items-center px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors text-left",
                      children: /* @__PURE__ */ jsx(TranslatedText, { children: "Launchpad" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleMobileNavClick("/testimonials"),
                      className: "flex items-center px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors text-left",
                      children: /* @__PURE__ */ jsx(TranslatedText, { children: "Testimonials" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleMobileNavClick("/blog"),
                      className: "flex items-center px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors text-left",
                      children: /* @__PURE__ */ jsx(TranslatedText, { children: "Blog" })
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxs("div", { className: "border-t p-4 space-y-3", children: [
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: "tel:+18189355478",
                      className: "flex items-center gap-3 px-3 py-2 text-primary hover:text-secondary transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5" }),
                        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "1.818.935.5478" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      onClick: () => {
                        setMobileMenuOpen(false);
                        handleScheduleCall();
                      },
                      variant: "outline",
                      className: "w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold",
                      children: [
                        /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 mr-2" }),
                        /* @__PURE__ */ jsx(TranslatedText, { children: "Schedule a Call" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      onClick: () => handleMobileNavClick("/contact"),
                      className: "w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold",
                      children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get a Quote" })
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsx(LanguageSwitcher, { variant: "compact" }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "tel:+18189355478",
                className: "flex items-center gap-1 text-primary hover:text-secondary transition-colors",
                children: /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: handleScheduleCall,
                variant: "outline",
                size: "sm",
                className: "border-secondary text-secondary hidden sm:flex",
                children: /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => navigate("/contact"),
                className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold",
                size: "sm",
                children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get Quote" })
              }
            )
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsx(CalendlyModal, { open: calendlyOpen, onOpenChange: setCalendlyOpen })
  ] });
};
const PremiumHero = () => {
  const navigate = useNavigate();
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const goToContact = () => navigate("/contact");
  const handleScheduleCall = () => {
    trackEvent("schedule_call_clicked", { location: "hero" });
    setCalendlyOpen(true);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { className: "relative w-full overflow-hidden bg-primary", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/hero-warehouse-optimized.webp",
            alt: "Westfield Prep Center loading dock and warehouse interior in Los Angeles",
            fetchpriority: "high",
            width: 1920,
            height: 1080,
            className: "w-full h-full object-cover opacity-90"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0",
            style: {
              background: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.92) 30%, hsl(var(--primary)/0.55) 55%, hsl(var(--primary)/0.15) 80%, transparent 100%)"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-x-0 bottom-0 h-40",
            style: {
              background: "linear-gradient(to bottom, transparent, hsl(var(--primary)/0.6))"
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative container mx-auto px-4 py-20 lg:py-32", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-10 items-center min-h-[560px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 text-primary-foreground", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6", children: [
            /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-secondary animate-pulse" }),
            /* @__PURE__ */ jsx(TranslatedText, { className: "text-xs font-bold tracking-[0.18em] uppercase text-white", children: "Los Angeles 3PL" })
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "font-bold leading-[0.95] tracking-tight text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.25rem]", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Ship 3x Faster" }),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "font-display font-normal italic text-white/95", children: /* @__PURE__ */ jsx(TranslatedText, { children: "with a" }) }),
            " ",
            /* @__PURE__ */ jsxs("span", { className: "relative inline-block text-secondary", children: [
              /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify" }),
              /* @__PURE__ */ jsx("span", { className: "absolute left-0 -bottom-2 h-[6px] w-full bg-secondary/40 rounded-full" })
            ] }),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-secondary", children: /* @__PURE__ */ jsx(TranslatedText, { children: "+ Amazon-Ready 3PL" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-7 text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Full-service fulfillment & FBA prep in 24 hours. Transparent pricing. No monthly minimums." }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-white/90", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-secondary text-secondary" }, i)),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold ml-1.5", children: "4.9" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "h-4 w-px bg-white/25" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold", children: [
              /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-secondary" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "SOC2 Ready" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "h-4 w-px bg-white/25" }),
            /* @__PURE__ */ jsx(TranslatedText, { className: "text-sm font-semibold", children: "Trusted by 500+ brands" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-9 flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: goToContact,
                size: "lg",
                className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg md:text-xl px-10 md:px-12 py-7 md:py-8 shadow-2xl shadow-secondary/40 ring-4 ring-secondary/20 hover:-translate-y-0.5 hover:ring-secondary/30 transition-all group rounded-xl",
                children: [
                  /* @__PURE__ */ jsx(TranslatedText, { children: "Get Free Fulfillment Audit" }),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2.5 w-6 h-6 group-hover:translate-x-1 transition-transform" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => navigate("/pricing"),
                size: "lg",
                variant: "outline",
                className: "border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-primary font-bold text-lg px-10 py-8 transition-all rounded-xl",
                children: /* @__PURE__ */ jsx(TranslatedText, { children: "View Pricing" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-4 text-white/70 text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-secondary" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "No credit card" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-white/30", children: "·" }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-secondary" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "24hr response" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-white/30", children: "·" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleScheduleCall,
                className: "inline-flex items-center gap-1.5 hover:text-secondary transition-colors group",
                children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx(TranslatedText, { className: "font-medium underline-offset-4 group-hover:underline", children: "Schedule a call" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 hidden lg:block relative h-full min-h-[480px]", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-0 w-64 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 p-5 shadow-2xl animate-slide-up", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-secondary animate-pulse" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold tracking-[0.18em] uppercase text-white/80", children: "Live Accuracy" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xl font-bold text-white tracking-tight", children: "99.8" }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-secondary", children: "%" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-white/75 mt-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: "across 2M+ orders shipped" }) })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "absolute bottom-12 left-2 w-72 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 p-5 shadow-2xl animate-slide-up",
              style: { animationDelay: "150ms" },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 text-secondary" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold tracking-[0.18em] uppercase text-white/80", children: "Turnaround" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-5xl font-bold text-white tracking-tight", children: "24" }),
                  /* @__PURE__ */ jsx("span", { className: "font-display italic text-2xl text-secondary", children: "hours" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-white/75 mt-1", children: /* @__PURE__ */ jsx(TranslatedText, { children: "receive → prep → ship, every time" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "absolute bottom-0 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/90 backdrop-blur-sm text-secondary-foreground shadow-xl animate-slide-up",
              style: { animationDelay: "300ms" },
              children: [
                /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-white animate-pulse" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Now onboarding" }) })
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(CalendlyModal, { open: calendlyOpen, onOpenChange: setCalendlyOpen })
  ] });
};
const StructuredData = ({ type, data }) => {
  const getSchema = () => {
    const baseUrl = "https://westfieldprepcenter.com";
    if (type === "contact") {
      return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Westfield Prep Center",
        description: "Contact Westfield Prep Center for Shopify fulfillment, Amazon FBA prep, and e-commerce logistics services in Los Angeles.",
        mainEntity: {
          "@type": "Organization",
          name: "Westfield Prep Center",
          telephone: "+1-818-935-5478",
          email: "info@westfieldprepcenter.com",
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "08:00",
            closes: "17:00"
          }
        }
      };
    }
    if (type === "organization") {
      return {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Warehouse", "LogisticsService", "Service"],
        "@id": `${baseUrl}/#organization`,
        name: "Westfield Prep Center",
        legalName: "Sathatham LLC",
        alternateName: "Westfield Prep",
        description: "Professional Los Angeles Shopify prep center specializing in DTC fulfillment, custom branding, Amazon FBA prep, and multi-channel order processing. Serving e-commerce businesses nationwide.",
        additionalType: "https://www.productontology.org/id/Fulfillment_center",
        url: baseUrl,
        logo: `${baseUrl}/westfield-logo.png`,
        image: `${baseUrl}/westfield-logo.png`,
        telephone: "+18189355478",
        email: "info@westfieldprepcenter.com",
        priceRange: "$$",
        // SAB-compliant address: city/region only, NO street address
        address: {
          "@type": "PostalAddress",
          addressLocality: "Los Angeles",
          addressRegion: "CA",
          addressCountry: "US"
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "34.0522",
          longitude: "-118.2437"
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "08:00",
            closes: "17:00",
            timeZone: "America/Los_Angeles"
          }
        ],
        // SAB service area - covers Los Angeles and nationwide
        serviceArea: [
          {
            "@type": "City",
            name: "Los Angeles",
            containedInPlace: {
              "@type": "State",
              name: "California"
            }
          },
          {
            "@type": "Country",
            name: "United States"
          }
        ],
        areaServed: [
          {
            "@type": "City",
            name: "Los Angeles",
            containedInPlace: {
              "@type": "State",
              name: "California"
            }
          },
          {
            "@type": "Country",
            name: "United States"
          }
        ],
        sameAs: [
          "https://www.linkedin.com/company/westfield-prep-center/?viewAsMember=true",
          "https://www.instagram.com/westfieldprepcenter/",
          "https://x.com/Westfield3PL"
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "E-commerce Fulfillment Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Amazon FBA Prep Services",
                description: "Professional Amazon FBA preparation including labeling, poly-bagging, bubble wrapping, inspection, and shipping to Amazon fulfillment centers"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Shopify Fulfillment",
                description: "Complete Shopify order fulfillment with same-day processing, photo-proof QC, and inventory management"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Multi-Channel Fulfillment",
                description: "Order processing for multiple sales channels including TikTok Shop, Amazon, and direct-to-consumer"
              }
            }
          ]
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "6",
          bestRating: "5",
          worstRating: "1"
        },
        review: [
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Drew" },
            datePublished: "2024-12-01",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            reviewBody: "Excellent service and very professional. They handle our inventory with care and always meet our deadlines."
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Nima Baniasadi" },
            datePublished: "2024-11-15",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            reviewBody: "Great communication and fast turnaround. Highly recommend for anyone looking for reliable fulfillment services."
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Amir Kohan Far" },
            datePublished: "2024-10-20",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            reviewBody: "They've been handling our e-commerce fulfillment for months now and we couldn't be happier. Photo proof of every shipment is a game changer."
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Joshua Meier" },
            datePublished: "2024-09-05",
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            reviewBody: "Professional team that really cares about getting things right. Our Amazon FBA prep has never been smoother."
          }
        ]
      };
    }
    if (type === "service" && data) {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${baseUrl}/#service-${data.serviceType?.toLowerCase().replace(/\s+/g, "-") || "default"}`,
        serviceType: data.serviceType,
        name: data.name,
        description: data.description,
        category: "Prep Center Services",
        // SAB-compliant: Link to main LocalBusiness via @id reference
        provider: {
          "@type": "LocalBusiness",
          "@id": `${baseUrl}/#organization`,
          name: "Westfield Prep Center",
          telephone: "+18189355478"
        },
        // SAB-compliant: No address, only service area
        areaServed: [
          {
            "@type": "City",
            name: "Los Angeles",
            containedInPlace: {
              "@type": "State",
              name: "California"
            }
          },
          {
            "@type": "Country",
            name: "United States"
          }
        ],
        offers: {
          "@type": "AggregateOffer",
          price: "Custom",
          priceCurrency: "USD",
          description: "Custom pricing based on your business needs and volume"
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: data.name,
          itemListElement: data.features?.map((feature, index) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: feature
            }
          }))
        }
      };
    }
    if (type === "faq" && data) {
      const faqArray = Array.isArray(data) ? data : data.questions || data.faqs || [];
      if (!faqArray.length || !faqArray.every((faq) => faq.question && faq.answer)) {
        return null;
      }
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqArray.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      };
    }
    if (type === "reviews") {
      return null;
    }
    if (type === "breadcrumb" && data) {
      const items = data.items || [];
      if (!items.length) return null;
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: `${baseUrl}${item.path}`
        }))
      };
    }
    if (type === "website") {
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: "Westfield Prep Center",
        url: baseUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/blog?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
    }
    if (type === "localBusinessWithService") {
      return null;
    }
    if (type === "collectionPage" && data) {
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Westfield Prep Center Blog",
        description: "Expert insights on Amazon FBA prep, Shopify fulfillment, and e-commerce logistics from our Los Angeles fulfillment center.",
        url: `${baseUrl}/blog`,
        publisher: {
          "@type": "Organization",
          name: "Westfield Prep Center",
          logo: `${baseUrl}/westfield-logo.png`
        },
        mainEntity: {
          "@type": "Blog",
          name: "Westfield Prep Center Blog",
          blogPost: data.posts?.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: `${baseUrl}/blog/${post.slug}`,
            datePublished: post.published_at,
            image: post.cover_image_url ? `${baseUrl}${post.cover_image_url}` : `${baseUrl}/hero-warehouse-optimized.webp`,
            author: {
              "@type": "Person",
              name: post.author_name || "Westfield Prep Team"
            }
          }))
        }
      };
    }
    if (type === "itemList" && data) {
      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Supported E-commerce Platforms",
        description: "Multi-channel fulfillment support for major e-commerce platforms and marketplaces.",
        numberOfItems: data.platforms?.length || 0,
        itemListElement: data.platforms?.map((platform, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: platform.name,
            description: platform.description || `${platform.name} fulfillment services`,
            url: platform.path ? `${baseUrl}${platform.path}` : baseUrl,
            provider: {
              "@type": "Organization",
              name: "Westfield Prep Center"
            }
          }
        }))
      };
    }
    if (type === "product") {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "3PL Fulfillment Pricing",
        description: "Shopify, Amazon, and DTC 3PL pricing starting at $1.00/unit with 24-hour turnaround.",
        brand: {
          "@type": "Organization",
          name: "Westfield Prep Center"
        },
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "1.00",
          highPrice: "2.50",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/pricing`
        },
        review: {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5"
          },
          author: {
            "@type": "Person",
            name: "Shopify Seller"
          }
        }
      };
    }
    if (type === "localBusiness") {
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Westfield Prep Center",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Los Angeles",
          addressRegion: "CA",
          postalCode: "91010",
          addressCountry: "US"
        },
        telephone: "818-935-5478",
        email: "info@westfieldprepcenter.com",
        url: baseUrl
      };
    }
    if (type === "software") {
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Westfield 3PL Integration Platform",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        featureList: [
          "Shopify fulfillment integration",
          "Amazon prep center sync",
          "Order routing and tracking",
          "Real-time inventory sync"
        ],
        url: `${baseUrl}/integrations`
      };
    }
    return {};
  };
  const schema = getSchema();
  if (!schema) return null;
  return /* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(schema) }) });
};
const Footer = () => {
  return /* @__PURE__ */ jsx("footer", { className: "bg-primary text-white py-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-20 xl:gap-24 mb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 min-w-[220px]", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white/95 rounded-md px-3 py-2 w-fit mb-4", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: westfieldLogo,
            alt: "Westfield Prep Center",
            width: "120",
            height: "32",
            className: "h-8 w-auto"
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-white/80 leading-relaxed font-normal", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Los Angeles's Premier E-Commerce Fulfillment & 3PL Partner" }) }),
        /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-secondary font-semibold", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Open 7 Days a Week" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/90", children: "8am - 5pm PT" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 pt-4", children: [
          /* @__PURE__ */ jsx("a", { href: "https://www.linkedin.com/company/westfield-prep-center/?viewAsMember=true", target: "_blank", rel: "noopener noreferrer", className: "text-white/80 hover:text-secondary transition-colors", "aria-label": "Follow us on LinkedIn", children: /* @__PURE__ */ jsx(Linkedin, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("a", { href: "https://www.instagram.com/westfieldprepcenter/", target: "_blank", rel: "noopener noreferrer", className: "text-white/80 hover:text-secondary transition-colors", "aria-label": "Follow us on Instagram", children: /* @__PURE__ */ jsx(Instagram, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("a", { href: "https://x.com/Westfield3PL", target: "_blank", rel: "noopener noreferrer", className: "text-white/80 hover:text-secondary transition-colors", "aria-label": "Follow us on X", children: /* @__PURE__ */ jsx(Twitter, { className: "w-5 h-5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 pr-8 min-w-[200px]", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Contact Us" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-secondary mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsx(TranslatedText, { className: "text-sm", children: "Strategically Located in Los Angeles" })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "tel:+18189355478", className: "flex items-start gap-3 hover:text-secondary transition-colors group", "aria-label": "Call Westfield Prep Center", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 text-secondary mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm break-words", children: "+1 (818) 935-5478" })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "mailto:info@westfieldprepcenter.com", className: "flex items-start gap-3 hover:text-secondary transition-colors group", "aria-label": "Email Westfield Prep Center", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-secondary mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm break-words", children: "info@westfieldprepcenter.com" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 min-w-[200px]", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Services" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Link, { to: "/order-fulfillment", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Order Fulfillment" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Link, { to: "/inventory-management", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Inventory Management" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Link, { to: "/receiving-inspection", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Receiving & Inspection" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Link, { to: "/returns-processing", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Returns Processing" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Link, { to: "/kitting-bundling", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Kitting & Bundling" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Link, { to: "/storage-warehousing", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Storage & Warehousing" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 min-w-[200px]", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Sales Channels" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Link, { to: "/sales-channels/shopify", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Shopify" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Link, { to: "/sales-channels/amazon", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Amazon FBA" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Link, { to: "/sales-channels/tiktok-shop", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "TikTok Shop" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Link, { to: "/sales-channels", className: "block text-sm text-white/80 hover:text-secondary transition-colors relative group", children: /* @__PURE__ */ jsxs("span", { className: "relative", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "All Channels" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 min-w-[200px]", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Quick Links" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Link, { to: "/3pl-los-angeles", className: "block text-sm text-white/80 hover:text-secondary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "3PL Los Angeles" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/testimonials", className: "block text-sm text-white/80 hover:text-secondary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Testimonials" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/why-choose-us", className: "block text-sm text-white/80 hover:text-secondary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Why Choose Us" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/integrations", className: "block text-sm text-white/80 hover:text-secondary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Integrations & API" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/faq", className: "block text-sm text-white/80 hover:text-secondary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "FAQ" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/contact", className: "block text-sm text-white/80 hover:text-secondary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Contact" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/login", className: "block text-sm text-white/80 hover:text-secondary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Client Portal" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-white/20 pt-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-white/70", children: "Westfield Prep Center — a DBA of Sathatham LLC" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "text-sm text-white/70 hover:text-secondary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Terms" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-white/40", children: "•" }),
        /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "text-sm text-white/70 hover:text-secondary transition-colors", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Privacy" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-white/40", children: "•" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-white/60", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " ",
          /* @__PURE__ */ jsx(TranslatedText, { children: "All rights reserved." })
        ] })
      ] })
    ] }) })
  ] }) }) });
};
const PlatformCompatibility = lazy(() => import("./assets/PlatformCompatibility-BcyFGGwM.js"));
const ValueProposition = lazy(() => import("./assets/ValueProposition-DIrQcUkE.js"));
const Services = lazy(() => import("./assets/Services-DNQETp2Z.js"));
const HowItWorksProcess = lazy(() => import("./assets/HowItWorksProcess-DXLTvtex.js"));
const Reviews = lazy(() => import("./assets/Reviews-NmStRpLI.js"));
const LocationShowcase = lazy(() => import("./assets/LocationShowcase-C0Kf2s42.js"));
const UseCaseSection = lazy(() => import("./assets/UseCaseSection-R633p6gR.js"));
const FAQAccordion = lazy(() => import("./assets/FAQAccordion-DqnG3UdR.js"));
const FinalCTA = lazy(() => import("./assets/FinalCTA-CJ3IW5yw.js"));
const Compliance = lazy(() => import("./assets/Compliance-EOqIiOK_.js"));
const StatsStrip = lazy(() => import("./assets/StatsStrip-BBpJNzxk.js"));
const BlogPreview = lazy(() => import("./assets/BlogPreview-C2mS25zy.js"));
const LaunchpadCallout = lazy(() => import("./assets/LaunchpadCallout-DDzr8N89.js"));
const StickyMobileCTA = lazy(() => import("./assets/StickyMobileCTA-D9baN_LR.js"));
const Index = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!loading && user && role) {
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "client") {
        navigate("/client/dashboard", { replace: true });
      }
    }
  }, [user, role, loading, navigate]);
  const faqData = useMemo(
    () => ({
      questions: [
        {
          question: "Do you operate as a Los Angeles 3PL?",
          answer: "Yes, Westfield Prep Center is a service-area-based 3PL operating from Los Angeles, California. We serve e-commerce businesses nationwide, handling their inventory, fulfillment, and prep services from our LA facility. Our strategic location near major ports provides shipping advantages for West Coast distribution."
        },
        {
          question: "Do clients visit your warehouse?",
          answer: "Our facility is not open for public visits. As a service-area business, we handle all client inventory remotely. Clients manage their accounts through our secure online portal and communicate with their dedicated account manager for any needs."
        },
        {
          question: "What areas do you serve from Los Angeles?",
          answer: "While strategically located in Los Angeles for port proximity and West Coast shipping advantages, we serve e-commerce businesses across all 50 states. Clients ship their inventory to us, and we handle fulfillment to their customers nationwide."
        },
        {
          question: "Do you offer Amazon FBA prep in Los Angeles?",
          answer: "Yes! We provide complete Amazon FBA prep services including labeling, poly-bagging, bubble wrapping, inspection, and shipping to Amazon fulfillment centers. Our LA location offers fast transit times to West Coast Amazon warehouses."
        },
        {
          question: "Do you support Shopify fulfillment?",
          answer: "Absolutely! We specialize in Shopify fulfillment with native integration, same-day processing, custom branding options, and full photo documentation. Orders sync automatically and ship with real-time tracking updates."
        }
      ]
    }),
    []
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Los Angeles Fulfillment Center for Shopify and Amazon" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Westfield Prep Center is a Los Angeles fulfillment center offering Shopify Amazon fulfillment, FBA prep, storage, & fast ecommerce shipping. Get started today."
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "keywords",
          content: "3pl shopify, shopify fulfillment center, amazon prep center, FBA prep center los angeles, 3pl pricing, DTC fulfillment, los angeles 3pl"
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "preload", as: "image", href: "/hero-warehouse-optimized.webp" }),
      /* @__PURE__ */ jsx("meta", { name: "geo.region", content: "US-CA" }),
      /* @__PURE__ */ jsx("meta", { name: "geo.position", content: "34.0522;-118.2437" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Westfield Prep Center" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "3PL Fulfillment for Shopify, Amazon & DTC Brands" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          property: "og:description",
          content: "Shopify fulfillment, FBA prep & DTC logistics with real-time integrations. $1–2.50/unit."
        }
      ),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://westfieldprepcenter.com/hero-warehouse-optimized.webp" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@Westfield3PL" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:creator", content: "@Westfield3PL" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "3PL Fulfillment for Shopify, Amazon & DTC Brands" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "twitter:description",
          content: "Westfield is a nationwide 3PL providing Shopify fulfillment, Amazon FBA prep, and DTC logistics. Transparent pricing and 24-hour turnaround."
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://westfieldprepcenter.com/hero-warehouse-optimized.webp" })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "organization" }),
    /* @__PURE__ */ jsx(StructuredData, { type: "website" }),
    /* @__PURE__ */ jsx(StructuredData, { type: "localBusiness" }),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqData }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("div", { className: "pt-20", children: [
        /* @__PURE__ */ jsx(PremiumHero, {}),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[280px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(StatsStrip, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(UseCaseSection, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(ValueProposition, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(Services, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(HowItWorksProcess, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(PlatformCompatibility, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(Reviews, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(LocationShowcase, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(LaunchpadCallout, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(BlogPreview, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[400px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(FAQAccordion, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[300px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(FinalCTA, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[200px]", "aria-hidden": "true" }), children: /* @__PURE__ */ jsx(Compliance, {}) }),
        /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(StickyMobileCTA, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const FAQ = lazy(() => import("./assets/FAQ-DodDFYdR.js"));
const Contact = lazy(() => import("./assets/Contact-CwPX0bNh.js"));
const Pricing = lazy(() => import("./assets/Pricing-LcN1qqUs.js"));
const KittingBundling = lazy(() => import("./assets/KittingBundling-BcLh6hYp.js"));
const LabelingCompliance = lazy(() => import("./assets/LabelingCompliance-D9KRT--R.js"));
const StorageWarehousing = lazy(() => import("./assets/StorageWarehousing-B61RcnrP.js"));
const OrderFulfillment = lazy(() => import("./assets/OrderFulfillment-DpQoBWuJ.js"));
const InventoryManagement = lazy(() => import("./assets/InventoryManagement-CB-BEME7.js"));
const ReceivingInspection = lazy(() => import("./assets/ReceivingInspection-DoPW2Fh4.js"));
const ReturnsProcessing = lazy(() => import("./assets/ReturnsProcessing-CpSgZQBw.js"));
const TOS = lazy(() => import("./assets/TOS-B-ZTJgvp.js"));
const PrivacyPolicy = lazy(() => import("./assets/PrivacyPolicy-DAjGj1o2.js"));
const ThankYou = lazy(() => import("./assets/ThankYou-D2m1OJ0N.js"));
const NotFound = lazy(() => import("./assets/NotFound-DsVWgxj2.js"));
const Login = lazy(() => import("./assets/Login-DpjerLpK.js"));
const ResetPassword = lazy(() => import("./assets/ResetPassword-Bh4m_EKH.js"));
const AdminDashboard = lazy(() => import("./assets/AdminDashboard-DxDl1gMW.js").then((n) => n.A));
const ClientDashboard = lazy(() => import("./assets/ClientDashboard-CA8ka1qT.js"));
const AdminSettings = lazy(() => import("./assets/AdminSettings-R875-IE0.js"));
const ClientSettings = lazy(() => import("./assets/ClientSettings-Bwfr9IUd.js"));
const Testimonials = lazy(() => import("./assets/Testimonials-CI71vbFH.js"));
const Blog = lazy(() => import("./assets/Blog-DzdN8jNz.js"));
const BlogPost = lazy(() => import("./assets/BlogPost-BNLLJJo6.js"));
const WhyChooseUs = lazy(() => import("./assets/WhyChooseUs-Du2UdUJ1.js"));
const Launchpad = lazy(() => import("./assets/Launchpad-cvEJn720.js"));
const SalesChannels = lazy(() => import("./assets/SalesChannels-BZZJyfvV.js"));
const SalesChannelAmazon = lazy(() => import("./assets/Amazon-gakyAin1.js"));
const SalesChannelShopify = lazy(() => import("./assets/Shopify-DzmmpOX9.js"));
const SalesChannelTikTokShop = lazy(() => import("./assets/TikTokShop-c-ydy0H0.js"));
const ThreePLLosAngeles = lazy(() => import("./assets/ThreePLLosAngeles-CxDTux6q.js"));
const Integrations = lazy(() => import("./assets/Integrations-C7XycwP6.js"));
const routes = [
  {
    path: "/",
    Component: App,
    entry: "src/main.tsx",
    children: [
      { index: true, Component: Index },
      { path: "faq", Component: FAQ },
      { path: "contact", Component: Contact },
      { path: "pricing", Component: Pricing },
      { path: "testimonials", Component: Testimonials },
      { path: "why-choose-us", Component: WhyChooseUs },
      { path: "launchpad", Component: Launchpad },
      { path: "3pl-los-angeles", Component: ThreePLLosAngeles },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogPost },
      // Service redirects
      {
        path: "shopify-fulfillment",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/sales-channels/shopify", replace: true })
      },
      {
        path: "amazon-fba-prep",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/sales-channels/amazon", replace: true })
      },
      {
        path: "tiktok-shop-fulfillment",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/sales-channels/tiktok-shop", replace: true })
      },
      { path: "sales-channels", Component: SalesChannels },
      { path: "sales-channels/amazon", Component: SalesChannelAmazon },
      { path: "sales-channels/shopify", Component: SalesChannelShopify },
      { path: "sales-channels/tiktok-shop", Component: SalesChannelTikTokShop },
      { path: "integrations", Component: Integrations },
      { path: "kitting-bundling", Component: KittingBundling },
      { path: "labeling-fnsku", Component: LabelingCompliance },
      { path: "storage-warehousing", Component: StorageWarehousing },
      { path: "order-fulfillment", Component: OrderFulfillment },
      { path: "inventory-management", Component: InventoryManagement },
      { path: "receiving-inspection", Component: ReceivingInspection },
      { path: "returns-processing", Component: ReturnsProcessing },
      // Legacy redirects
      {
        path: "services",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/sales-channels/shopify", replace: true })
      },
      {
        path: "platforms",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/sales-channels/shopify", replace: true })
      },
      {
        path: "platforms/*",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/sales-channels/shopify", replace: true })
      },
      {
        path: "walmart-fulfillment",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/sales-channels/amazon", replace: true })
      },
      { path: "terms", Component: TOS },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "thank-you", Component: ThankYou },
      { path: "login", Component: Login },
      { path: "reset-password", Component: ResetPassword },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "admin/settings", Component: AdminSettings },
      { path: "client/dashboard", Component: ClientDashboard },
      { path: "client/settings", Component: ClientSettings },
      { path: "*", Component: NotFound }
    ]
  }
];
const createRoot = ViteReactSSG({ routes });
if (typeof window !== "undefined" && false) {
  null.then(({ initWebVitals }) => {
    initWebVitals();
  });
}
export {
  Accordion as A,
  Button as B,
  DialogFooter as C,
  Dialog as D,
  toast as E,
  Footer as F,
  CalendlyModal as G,
  Header as H,
  playErrorSound as I,
  playSuccessSound as J,
  buttonVariants as K,
  StructuredData as S,
  TranslatedText as T,
  AccordionItem as a,
  AccordionTrigger as b,
  AccordionContent as c,
  createRoot,
  DialogContent as d,
  DialogHeader as e,
  DialogTitle as f,
  DialogDescription as g,
  TooltipProvider as h,
  Tooltip as i,
  TooltipTrigger as j,
  TooltipContent as k,
  useToast as l,
  cn as m,
  generateMetaTags as n,
  useAuth as o,
  Sheet as p,
  SheetContent as q,
  DropdownMenu as r,
  supabase as s,
  trackEvent as t,
  useTranslation as u,
  DropdownMenuTrigger as v,
  westfieldLogo as w,
  DropdownMenuContent as x,
  DropdownMenuItem as y,
  DropdownMenuSeparator as z
};
