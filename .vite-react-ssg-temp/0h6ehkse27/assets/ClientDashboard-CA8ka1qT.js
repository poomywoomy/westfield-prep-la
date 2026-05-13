import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { s as supabase, B as Button, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, g as DialogDescription, o as useAuth, l as useToast, w as westfieldLogo } from "../main.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DOpNgkQL.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-CFvO6VPc.js";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Home, Package, FileText, RotateCcw, Truck, Activity, DollarSign, Settings, LogOut } from "lucide-react";
import { S as SKUFormDialog } from "./SKUFormDialog-D171tANM.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-FolYmCWY.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import "vite-react-ssg";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@supabase/supabase-js";
import "framer-motion";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-tabs";
import "@radix-ui/react-avatar";
import "./input-CSM87NBF.js";
import "./label-B2r_8dgk.js";
import "@radix-ui/react-label";
import "./select-Cb0hy2VC.js";
import "@radix-ui/react-select";
import "@radix-ui/react-switch";
function InventoryDiscrepancyAlert() {
  const [discrepancies, setDiscrepancies] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDiscrepancies();
    const channel = supabase.channel("inventory-audit-client").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "inventory_audit_log",
      filter: "status=eq.pending"
    }, () => {
      fetchDiscrepancies();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const fetchDiscrepancies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: client } = await supabase.from("clients").select("id").eq("user_id", user.id).single();
      if (!client) return;
      const { data, error } = await supabase.from("inventory_audit_log").select(`
          *,
          skus(client_sku, title)
        `).eq("client_id", client.id).eq("status", "pending").order("audit_timestamp", { ascending: false }).limit(5);
      if (error) throw error;
      setDiscrepancies(data || []);
    } catch (error) {
      console.error("Failed to fetch discrepancies:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading || discrepancies.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Alert, { variant: "default", className: "border-yellow-500", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-yellow-500" }),
      /* @__PURE__ */ jsx(AlertTitle, { children: "Inventory Sync Notice" }),
      /* @__PURE__ */ jsxs(AlertDescription, { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          discrepancies.length,
          " SKU",
          discrepancies.length > 1 ? "s have" : " has",
          " inventory differences being investigated."
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setShowDialog(true),
            children: "View Details"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: showDialog, onOpenChange: setShowDialog, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Inventory Discrepancies" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "We've detected differences between your app inventory and Shopify. Our team is investigating and will auto-correct these shortly." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3 max-h-[400px] overflow-y-auto", children: discrepancies.map((disc) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: disc.skus.client_sku }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: disc.skus.title })
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Under Review" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 text-sm mt-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Your Inventory" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-lg", children: disc.app_inventory })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Shopify" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-lg", children: disc.shopify_inventory })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Difference" }),
            /* @__PURE__ */ jsxs("div", { className: `font-bold text-lg ${disc.difference > 0 ? "text-green-500" : "text-red-500"}`, children: [
              disc.difference > 0 ? "+" : "",
              disc.difference
            ] })
          ] })
        ] })
      ] }, disc.id)) }),
      /* @__PURE__ */ jsx(Alert, { children: /* @__PURE__ */ jsx(AlertDescription, { className: "text-xs", children: "These discrepancies are automatically logged and our system attempts to correct them. If issues persist, please contact support." }) })
    ] }) })
  ] });
}
const ClientBillsView = lazy(() => import("./ClientBillsView-DmHoaY9D.js"));
const ClientProductsTab = lazy(() => import("./ClientProductsTab-k-TW9-WW.js"));
const ClientShipmentsTab = lazy(() => import("./ClientShipmentsTab-Cnx5YWKx.js").then((m) => ({ default: m.ClientShipmentsTab })));
const ClientInventoryActivityLog = lazy(() => import("./ClientInventoryActivityLog-C19kBlZL.js").then((m) => ({ default: m.ClientInventoryActivityLog })));
const ClientAnalyticsDashboard = lazy(() => import("./ClientAnalyticsDashboard-BT93kCIs.js").then((m) => ({ default: m.ClientAnalyticsDashboard })));
const ClientASNsTab = lazy(() => import("./ClientASNsTab-BmPPlNFU.js").then((m) => ({ default: m.ClientASNsTab })));
const ClientReturnsTab = lazy(() => import("./ClientReturnsTab-BRDdj4md.js").then((m) => ({ default: m.ClientReturnsTab })));
const ClientDashboard = () => {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState("");
  const [showSKUDialog, setShowSKUDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");
  const prefetchHandlers = {
    products: () => queryClient.prefetchQuery({ queryKey: ["client-skus", clientId], staleTime: 6e4 }),
    orders: () => queryClient.prefetchQuery({ queryKey: ["client-orders", clientId], staleTime: 6e4 }),
    asns: () => queryClient.prefetchQuery({ queryKey: ["client-asns", clientId], staleTime: 6e4 }),
    shipments: () => queryClient.prefetchQuery({ queryKey: ["client-shipments", clientId], staleTime: 6e4 }),
    billing: () => queryClient.prefetchQuery({ queryKey: ["client-bills", clientId], staleTime: 6e4 }),
    returns: () => queryClient.prefetchQuery({ queryKey: ["client-returns", clientId], staleTime: 6e4 })
  };
  useEffect(() => {
    if (user) {
      fetchClientName();
    }
  }, [user]);
  const fetchClientName = async () => {
    try {
      const { data, error } = await supabase.from("clients").select("id, contact_name, status").eq("user_id", user?.id).single();
      if (!error && data) {
        setClientId(data.id);
        setClientName(data.contact_name);
        const statusUpdateKey = `client_status_updated_${user?.id}`;
        const hasUpdatedStatus = localStorage.getItem(statusUpdateKey);
        if (!hasUpdatedStatus && data.status === "pending") {
          const { error: updateError } = await supabase.from("clients").update({ status: "active" }).eq("user_id", user?.id);
          if (!updateError) {
            localStorage.setItem(statusUpdateKey, "true");
          }
        }
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }
      if (role !== "client") {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access this area.",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }
    }
  }, [user, role, loading, navigate, toast]);
  const handleLogout = async () => {
    await logout();
    toast({ title: "Logged out", description: "You have been logged out successfully." });
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Loading..." }) });
  }
  if (!user || role !== "client") {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex w-full", children: [
    /* @__PURE__ */ jsxs("aside", { className: "w-64 border-r bg-card flex flex-col h-screen fixed left-0 top-0 z-40", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-b flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Link, { to: "/client/dashboard", children: /* @__PURE__ */ jsx("img", { src: westfieldLogo, alt: "Westfield Logo", className: "h-16 w-auto" }) }) }),
      /* @__PURE__ */ jsxs("nav", { className: "flex-1 p-4 space-y-1 overflow-y-auto", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            className: `w-full justify-start gap-3 ${activeTab === "analytics" ? "bg-muted text-primary" : "hover:bg-muted"}`,
            onClick: () => setActiveTab("analytics"),
            children: [
              /* @__PURE__ */ jsx(Home, { className: "h-5 w-5" }),
              "Dashboard"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            className: `w-full justify-start gap-3 ${activeTab === "products" ? "bg-muted text-primary" : "hover:bg-muted"}`,
            onClick: () => setActiveTab("products"),
            onMouseEnter: () => prefetchHandlers.products?.(),
            children: [
              /* @__PURE__ */ jsx(Package, { className: "h-5 w-5" }),
              "Products"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            className: `w-full justify-start gap-3 ${activeTab === "asns" ? "bg-muted text-primary" : "hover:bg-muted"}`,
            onClick: () => setActiveTab("asns"),
            onMouseEnter: () => prefetchHandlers.asns?.(),
            children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
              "ASNs"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            className: `w-full justify-start gap-3 ${activeTab === "returns" ? "bg-muted text-primary" : "hover:bg-muted"}`,
            onClick: () => setActiveTab("returns"),
            onMouseEnter: () => prefetchHandlers.returns?.(),
            children: [
              /* @__PURE__ */ jsx(RotateCcw, { className: "h-5 w-5" }),
              "Returns"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            className: `w-full justify-start gap-3 ${activeTab === "shipments" ? "bg-muted text-primary" : "hover:bg-muted"}`,
            onClick: () => setActiveTab("shipments"),
            onMouseEnter: () => prefetchHandlers.shipments?.(),
            children: [
              /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5" }),
              "Outbound Shipments"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            className: `w-full justify-start gap-3 ${activeTab === "activity" ? "bg-muted text-primary" : "hover:bg-muted"}`,
            onClick: () => setActiveTab("activity"),
            children: [
              /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5" }),
              "Activity Log"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            className: `w-full justify-start gap-3 ${activeTab === "billing" ? "bg-muted text-primary" : "hover:bg-muted"}`,
            onClick: () => setActiveTab("billing"),
            onMouseEnter: () => prefetchHandlers.billing?.(),
            children: [
              /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5" }),
              "Billing"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-t space-y-3 flex-shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsx(Avatar, { children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground", children: clientName?.charAt(0).toUpperCase() || "U" }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("p", { className: "font-medium text-sm truncate", children: clientName || "Client" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full justify-start gap-2",
              onClick: () => navigate("/client/settings"),
              children: [
                /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }),
                "Settings"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full justify-start gap-2",
              onClick: handleLogout,
              children: [
                /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
                "Logout"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 ml-64 overflow-auto", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-8 py-6", children: [
      clientName && /* @__PURE__ */ jsx("div", { className: "mb-6 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-4", children: /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold", children: [
        "Welcome back, ",
        clientName
      ] }) }),
      /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "hidden", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "analytics", children: "Analytics" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "products", children: "Products" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "asns", children: "ASNs" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "returns", children: "Returns" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "shipments", children: "Shipments" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "activity", children: "Activity" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "billing", children: "Billing" })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "analytics", forceMount: true, className: "data-[state=inactive]:hidden", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }), children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(InventoryDiscrepancyAlert, {}),
          /* @__PURE__ */ jsx(ClientAnalyticsDashboard, { clientId })
        ] }) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "products", forceMount: true, className: "data-[state=inactive]:hidden", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }), children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { onClick: () => setShowSKUDialog(true), children: [
            /* @__PURE__ */ jsx(Package, { className: "mr-2 h-4 w-4" }),
            "Create SKU"
          ] }) }),
          /* @__PURE__ */ jsx(ClientProductsTab, {})
        ] }) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "asns", forceMount: true, className: "data-[state=inactive]:hidden", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }), children: /* @__PURE__ */ jsx(ClientASNsTab, { clientId }) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "returns", forceMount: true, className: "data-[state=inactive]:hidden", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }), children: /* @__PURE__ */ jsx(ClientReturnsTab, { clientId }) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "shipments", forceMount: true, className: "data-[state=inactive]:hidden", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }), children: /* @__PURE__ */ jsx(ClientShipmentsTab, {}) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "activity", forceMount: true, className: "data-[state=inactive]:hidden", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }), children: /* @__PURE__ */ jsx(ClientInventoryActivityLog, { clientId }) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "billing", forceMount: true, className: "data-[state=inactive]:hidden", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }), children: /* @__PURE__ */ jsx(ClientBillsView, {}) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      SKUFormDialog,
      {
        open: showSKUDialog,
        onClose: () => setShowSKUDialog(false),
        sku: null,
        clients: [],
        isClientView: true,
        presetClientId: clientId
      }
    )
  ] });
};
export {
  ClientDashboard as default
};
