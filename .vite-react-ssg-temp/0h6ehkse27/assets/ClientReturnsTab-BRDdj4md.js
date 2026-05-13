import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { s as supabase, B as Button } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DOpNgkQL.js";
import { startOfDay, parseISO, endOfDay, format } from "date-fns";
import { Loader2, RotateCcw, X, Search, Package, Eye } from "lucide-react";
import { D as DamagedItemReviewDialog } from "./DamagedItemReviewDialog-DaGwIzt7.js";
import "class-variance-authority";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
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
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-tabs";
import "@radix-ui/react-radio-group";
import "./photoUtils-pehMpqiu.js";
import "react-dom";
const getReturnStatusBadge = (status) => {
  const statusMap = {
    requested: { label: "Requested", className: "bg-yellow-500 text-white" },
    approved: { label: "Approved", className: "bg-blue-500 text-white" },
    declined: { label: "Declined", className: "bg-destructive text-destructive-foreground" },
    returned: { label: "Returned", className: "bg-green-600 text-white" },
    closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
    pending: { label: "Pending Review", className: "bg-yellow-500 text-white" },
    submitted: { label: "Decision Submitted", className: "bg-blue-500 text-white" },
    processed: { label: "Processed", className: "bg-green-600 text-white" }
  };
  const config = statusMap[status?.toLowerCase()] || { label: status || "Unknown", className: "bg-muted text-muted-foreground" };
  return /* @__PURE__ */ jsx(Badge, { className: config.className, children: config.label });
};
function ClientReturnsTab({ clientId }) {
  const [activeTab, setActiveTab] = useState("shopify");
  const [shopifyReturns, setShopifyReturns] = useState([]);
  const [manualReturns, setManualReturns] = useState([]);
  const [removalOrders, setRemovalOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  useEffect(() => {
    if (clientId) {
      fetchAllReturns();
    }
  }, [clientId]);
  const fetchAllReturns = async () => {
    setLoading(true);
    try {
      const { data: shopifyData } = await supabase.from("shopify_returns").select("id, shopify_return_id, order_number, status, return_reason, expected_qty, processed_qty, created_at_shopify, synced_at").eq("client_id", clientId).order("synced_at", { ascending: false });
      setShopifyReturns(shopifyData || []);
      const { data: manualData } = await supabase.from("damaged_item_decisions").select(`
          id, sku_id, quantity, status, decision, created_at, qc_photo_urls,
          skus(client_sku, title)
        `).eq("client_id", clientId).eq("source_type", "return").order("created_at", { ascending: false });
      const mappedManual = (manualData || []).map((item) => ({
        id: item.id,
        sku_id: item.sku_id,
        client_sku: item.skus?.client_sku || "Unknown",
        title: item.skus?.title || "Unknown",
        quantity: item.quantity,
        status: item.status,
        decision: item.decision,
        created_at: item.created_at,
        qc_photo_urls: item.qc_photo_urls
      }));
      setManualReturns(mappedManual);
      const { data: removalData } = await supabase.from("removal_orders").select(`
          id, removal_order_number, status, received_at, notes,
          removal_order_lines(received_qty)
        `).eq("client_id", clientId).order("received_at", { ascending: false });
      const mappedRemovals = (removalData || []).map((item) => ({
        id: item.id,
        removal_order_number: item.removal_order_number,
        status: item.status,
        received_at: item.received_at,
        notes: item.notes,
        total_qty: item.removal_order_lines?.reduce((sum, line) => sum + (line.received_qty || 0), 0) || 0,
        line_count: item.removal_order_lines?.length || 0
      }));
      setRemovalOrders(mappedRemovals);
    } catch (error) {
      console.error("Error fetching returns:", error);
    } finally {
      setLoading(false);
    }
  };
  const hasActiveFilters = searchQuery || statusFilter !== "all" || dateFrom || dateTo;
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
  };
  const filteredShopifyReturns = useMemo(() => {
    return shopifyReturns.filter((ret) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = ret.shopify_return_id?.toLowerCase().includes(query);
        const matchesOrder = ret.order_number?.toLowerCase().includes(query);
        if (!matchesId && !matchesOrder) return false;
      }
      if (statusFilter !== "all" && ret.status?.toLowerCase() !== statusFilter) return false;
      if (dateFrom || dateTo) {
        const returnDate = ret.created_at_shopify ? new Date(ret.created_at_shopify) : new Date(ret.synced_at);
        if (dateFrom && returnDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && returnDate > endOfDay(parseISO(dateTo))) return false;
      }
      return true;
    });
  }, [shopifyReturns, searchQuery, statusFilter, dateFrom, dateTo]);
  const filteredManualReturns = useMemo(() => {
    return manualReturns.filter((ret) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!ret.client_sku?.toLowerCase().includes(query) && !ret.title?.toLowerCase().includes(query)) return false;
      }
      if (statusFilter !== "all" && ret.status?.toLowerCase() !== statusFilter) return false;
      if (dateFrom || dateTo) {
        const returnDate = new Date(ret.created_at);
        if (dateFrom && returnDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && returnDate > endOfDay(parseISO(dateTo))) return false;
      }
      return true;
    });
  }, [manualReturns, searchQuery, statusFilter, dateFrom, dateTo]);
  const filteredRemovalOrders = useMemo(() => {
    return removalOrders.filter((ro) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!ro.removal_order_number?.toLowerCase().includes(query)) return false;
      }
      if (statusFilter !== "all" && ro.status?.toLowerCase() !== statusFilter) return false;
      if (dateFrom || dateTo) {
        const roDate = new Date(ro.received_at);
        if (dateFrom && roDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && roDate > endOfDay(parseISO(dateTo))) return false;
      }
      return true;
    });
  }, [removalOrders, searchQuery, statusFilter, dateFrom, dateTo]);
  const handleReviewReturn = (ret) => {
    setSelectedReturn(ret);
    setReviewDialogOpen(true);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) });
  }
  const totalPendingReturns = manualReturns.filter((r) => r.status === "pending").length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(RotateCcw, { className: "h-6 w-6" }),
      "Returns & Removal Orders",
      totalPendingReturns > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "destructive", children: [
        totalPendingReturns,
        " Pending"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { className: "bg-muted/50", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6 pb-4 px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Filters" }),
        hasActiveFilters && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: clearFilters, children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4 mr-1" }),
          "Clear"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Search" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Search...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-10 h-9"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All Statuses" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Statuses" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pending Review" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "submitted", children: "Submitted" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "processed", children: "Processed" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "closed", children: "Closed" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "From Date" }),
          /* @__PURE__ */ jsx(Input, { type: "date", value: dateFrom, onChange: (e) => setDateFrom(e.target.value), className: "h-9" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "To Date" }),
          /* @__PURE__ */ jsx(Input, { type: "date", value: dateTo, onChange: (e) => setDateTo(e.target.value), className: "h-9" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "shopify", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }),
          "Shopify Returns (",
          shopifyReturns.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "manual", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }),
          "Manual Returns (",
          manualReturns.length,
          ")",
          totalPendingReturns > 0 && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "ml-1", children: totalPendingReturns })
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "removal", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }),
          "Removal Orders (",
          removalOrders.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "shopify", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: filteredShopifyReturns.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(RotateCcw, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: shopifyReturns.length === 0 ? "No Shopify returns found" : "No returns match your filters" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Return ID" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Order #" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Reason" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Expected Qty" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Processed Qty" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Date" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: filteredShopifyReturns.map((ret) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: ret.shopify_return_id }),
          /* @__PURE__ */ jsx(TableCell, { children: ret.order_number || "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: getReturnStatusBadge(ret.status) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: ret.return_reason || "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: ret.expected_qty || 0 }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: ret.processed_qty || 0 }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm", children: ret.created_at_shopify ? format(new Date(ret.created_at_shopify), "MMM d, yyyy") : format(new Date(ret.synced_at), "MMM d, yyyy") })
        ] }, ret.id)) })
      ] }) }) }) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "manual", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: filteredManualReturns.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(RotateCcw, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: manualReturns.length === 0 ? "No manual returns found" : "No returns match your filters" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "SKU" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Product" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Quantity" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Decision" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: filteredManualReturns.map((ret) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm", children: ret.client_sku }),
          /* @__PURE__ */ jsx(TableCell, { className: "max-w-[200px] truncate", children: ret.title }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: ret.quantity }),
          /* @__PURE__ */ jsx(TableCell, { children: getReturnStatusBadge(ret.status) }),
          /* @__PURE__ */ jsx(TableCell, { children: ret.decision ? /* @__PURE__ */ jsx(Badge, { variant: "outline", children: ret.decision.replace(/_/g, " ") }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "-" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm", children: format(new Date(ret.created_at), "MMM d, yyyy") }),
          /* @__PURE__ */ jsx(TableCell, { children: ret.status === "pending" ? /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => handleReviewReturn(ret), children: "Review" }) : /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleReviewReturn(ret), children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }) })
        ] }, ret.id)) })
      ] }) }) }) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "removal", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: filteredRemovalOrders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: removalOrders.length === 0 ? "No removal orders found" : "No orders match your filters" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Order #" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Items" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Total Qty" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Received Date" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Notes" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: filteredRemovalOrders.map((ro) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm", children: ro.removal_order_number }),
          /* @__PURE__ */ jsx(TableCell, { children: getReturnStatusBadge(ro.status) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: ro.line_count }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: ro.total_qty }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm", children: format(new Date(ro.received_at), "MMM d, yyyy") }),
          /* @__PURE__ */ jsx(TableCell, { className: "max-w-[200px] truncate text-muted-foreground", children: ro.notes || "-" })
        ] }, ro.id)) })
      ] }) }) }) }) })
    ] }),
    selectedReturn && /* @__PURE__ */ jsx(
      DamagedItemReviewDialog,
      {
        open: reviewDialogOpen,
        onOpenChange: (open) => {
          setReviewDialogOpen(open);
          if (!open) setSelectedReturn(null);
        },
        discrepancy: {
          id: selectedReturn.id,
          client_id: clientId,
          sku_id: selectedReturn.sku_id,
          asn_id: "",
          asn_number: "",
          client_sku: selectedReturn.client_sku,
          title: selectedReturn.title,
          damaged_qty: selectedReturn.quantity,
          qc_photo_urls: selectedReturn.qc_photo_urls || void 0
        },
        onSuccess: fetchAllReturns
      }
    )
  ] });
}
export {
  ClientReturnsTab
};
