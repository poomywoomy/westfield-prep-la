import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { m as cn, K as buttonVariants, s as supabase, B as Button } from "../main.mjs";
import { formatDistanceToNow, subDays, startOfDay, endOfDay, format } from "date-fns";
import { Clock, TrendingDown, Undo2, Edit, Package, Truck, DollarSign, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, CalendarIcon, Search } from "lucide-react";
import { C as Card } from "./card-WfKgKW48.js";
import { I as Input } from "./input-CSM87NBF.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Brv6tPqq.js";
import { DayPicker } from "react-day-picker";
import "vite-react-ssg";
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
import "@radix-ui/react-select";
import "@radix-ui/react-popover";
function ActivityLogItem({ timestamp, type, asnNumber, skuCode, message }) {
  const getIcon = () => {
    switch (type) {
      case "receiving_started":
      case "receiving_paused":
        return /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-yellow-600 dark:text-yellow-400" });
      case "issue_detected":
      case "discrepancy_created":
        return /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-destructive" });
      case "receiving_completed":
      case "discrepancy_resolved":
        return /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5 text-green-600 dark:text-green-400" });
      case "sold":
        return /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" });
      case "shipped":
        return /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" });
      case "transfer":
        return /* @__PURE__ */ jsx(Package, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" });
      case "adjustment":
        return /* @__PURE__ */ jsx(Edit, { className: "h-5 w-5 text-orange-600 dark:text-orange-400" });
      case "return":
        return /* @__PURE__ */ jsx(Undo2, { className: "h-5 w-5 text-green-600 dark:text-green-400" });
      case "low_stock":
        return /* @__PURE__ */ jsx(TrendingDown, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" });
      default:
        return /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-muted-foreground" });
    }
  };
  const getColorClass = () => {
    switch (type) {
      case "receiving_started":
      case "receiving_paused":
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20";
      case "issue_detected":
      case "discrepancy_created":
        return "border-destructive/20 bg-destructive/5";
      case "receiving_completed":
      case "discrepancy_resolved":
      case "return":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20";
      case "sold":
        return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20";
      case "shipped":
      case "transfer":
        return "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20";
      case "adjustment":
        return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20";
      case "low_stock":
        return "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20";
      default:
        return "border-border bg-card";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `flex gap-4 p-4 rounded-lg border ${getColorClass()}`, children: [
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 mt-0.5", children: getIcon() }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: message }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: formatDistanceToNow(new Date(timestamp), { addSuffix: true }) })
      ] }),
      (asnNumber || skuCode) && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
        asnNumber && `ASN: ${asnNumber}`,
        skuCode && `SKU: ${skuCode}`
      ] })
    ] })
  ] });
}
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn("p-3", className),
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames
      },
      components: {
        IconLeft: ({ ..._props }) => /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
        IconRight: ({ ..._props }) => /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
      },
      ...props
    }
  );
}
Calendar.displayName = "Calendar";
function ClientInventoryActivityLog({ clientId }) {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(/* @__PURE__ */ new Date(), 30),
    to: /* @__PURE__ */ new Date()
  });
  const [displayCount, setDisplayCount] = useState(50);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (clientId) {
      fetchActivities();
      const cleanup = subscribeToUpdates();
      return cleanup;
    }
  }, [clientId]);
  useEffect(() => {
    setDisplayCount(50);
  }, [searchQuery, filterType, dateRange]);
  const fetchActivities = async () => {
    try {
      const { data: asns, error: asnError } = await supabase.from("asn_headers").select("id, asn_number, status, received_at, closed_at, created_at").eq("client_id", clientId).order("created_at", { ascending: false });
      if (asnError) throw asnError;
      const { data: adjustments, error: adjError } = await supabase.from("inventory_ledger").select("id, ts, qty_delta, reason_code, notes, transaction_type, source_type, skus(client_sku, title)").eq("client_id", clientId).in("transaction_type", ["ADJUSTMENT_PLUS", "ADJUSTMENT_MINUS", "SALE_DECREMENT", "TRANSFER", "RETURN"]).order("ts", { ascending: false });
      if (adjError) throw adjError;
      const { data: inventorySummary, error: invError } = await supabase.from("inventory_summary").select("sku_id, client_sku, available").eq("client_id", clientId);
      if (invError) console.error("Error fetching inventory summary:", invError);
      const skuIds = inventorySummary?.map((i) => i.sku_id) || [];
      let lowStockItems = [];
      if (skuIds.length > 0) {
        const [skuResult, clientResult] = await Promise.all([
          supabase.from("skus").select("id, title, low_stock_threshold").in("id", skuIds),
          supabase.from("clients").select("default_low_stock_threshold").eq("id", clientId).single()
        ]);
        const skuMap = new Map(skuResult.data?.map((s) => [s.id, s]) || []);
        const defaultThreshold = clientResult.data?.default_low_stock_threshold || 10;
        lowStockItems = inventorySummary?.map((inv) => {
          const sku = skuMap.get(inv.sku_id);
          return {
            sku_id: inv.sku_id,
            client_sku: inv.client_sku,
            title: sku?.title || "",
            available: inv.available || 0,
            threshold: sku?.low_stock_threshold || defaultThreshold
          };
        }).filter((item) => item.available < item.threshold) || [];
      }
      const entries = [];
      asns?.forEach((asn) => {
        if (asn.received_at) {
          entries.push({
            id: `${asn.id}-started`,
            timestamp: asn.received_at,
            type: "receiving_started",
            asnNumber: asn.asn_number,
            message: `Receiving started for ASN ${asn.asn_number}`
          });
        }
        if (asn.status === "issue") {
          entries.push({
            id: `${asn.id}-issue`,
            timestamp: asn.closed_at || asn.received_at || asn.created_at,
            type: "issue_detected",
            asnNumber: asn.asn_number,
            message: `Issue detected with ASN ${asn.asn_number} - Discrepancies found`
          });
        } else if (asn.status === "closed" && asn.closed_at) {
          entries.push({
            id: `${asn.id}-completed`,
            timestamp: asn.closed_at,
            type: "receiving_completed",
            asnNumber: asn.asn_number,
            message: `Receiving completed for ASN ${asn.asn_number}`
          });
        } else if (asn.status === "receiving") {
          entries.push({
            id: `${asn.id}-paused`,
            timestamp: asn.received_at || asn.created_at,
            type: "receiving_paused",
            asnNumber: asn.asn_number,
            message: `Receiving paused for ASN ${asn.asn_number} - Partial shipment received`
          });
        }
      });
      adjustments?.forEach((adj) => {
        const sku = adj.skus;
        const adjRecord = adj;
        let type;
        let message;
        if (adj.transaction_type === "RETURN") {
          type = "return";
          message = `Return processed: ${adj.qty_delta} units of ${sku?.client_sku || "SKU"} - ${adj.notes || "good condition"}`;
        } else if (adj.transaction_type === "SALE_DECREMENT" && adjRecord.source_type === "outbound_shipment") {
          type = "shipped";
          message = `Shipped ${Math.abs(adj.qty_delta)} units of ${sku?.client_sku || "SKU"}`;
        } else if (adj.transaction_type === "SALE_DECREMENT" || adj.reason_code === "sold") {
          type = "sold";
          message = `Sold ${Math.abs(adj.qty_delta)} units of ${sku?.client_sku || "SKU"}`;
        } else if (adj.reason_code && ["sent_to_amazon", "sent_to_walmart", "sent_to_tiktok"].includes(adj.reason_code)) {
          type = "transfer";
          const platform = adj.reason_code.replace("sent_to_", "").replace("_", " ");
          message = `${Math.abs(adj.qty_delta)} units of ${sku?.client_sku || "SKU"} sent to ${platform}`;
        } else {
          type = "adjustment";
          const sign = adj.qty_delta > 0 ? "+" : "";
          const reason = adj.reason_code?.replace("_", " ") || "adjustment";
          message = `Inventory adjusted: ${sign}${adj.qty_delta} units of ${sku?.client_sku || "SKU"} (${reason})`;
        }
        entries.push({
          id: adj.id,
          timestamp: adj.ts,
          type,
          skuCode: sku?.client_sku,
          message
        });
      });
      lowStockItems?.forEach((item) => {
        if (item.available > 0) {
          entries.push({
            id: `low-stock-${item.sku_id}`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            type: "low_stock",
            skuCode: item.client_sku,
            message: `Low stock alert: ${item.title} - Only ${item.available} units remaining (threshold: ${item.threshold})`
          });
        }
      });
      entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(entries);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };
  const subscribeToUpdates = () => {
    const channel = supabase.channel("inventory_activity_log").on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "asn_headers",
        filter: `client_id=eq.${clientId}`
      },
      () => fetchActivities()
    ).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "inventory_ledger",
        filter: `client_id=eq.${clientId}`
      },
      () => fetchActivities()
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  };
  const filteredActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.timestamp);
    if (dateRange.from && activityDate < startOfDay(dateRange.from)) {
      return false;
    }
    if (dateRange.to && activityDate > endOfDay(dateRange.to)) {
      return false;
    }
    if (filterType !== "all") {
      const typeMap = {
        received: ["receiving_started", "receiving_completed"],
        shipped: ["shipped"],
        sold: ["sold", "transfer"],
        returns: ["return"],
        discrepancies: ["issue_detected", "discrepancy_created", "discrepancy_resolved"],
        adjustments: ["adjustment"],
        lowstock: ["low_stock"]
      };
      const validTypes = typeMap[filterType] || [];
      if (validTypes.length > 0 && !validTypes.includes(activity.type)) {
        return false;
      }
    }
    return activity.asnNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || activity.skuCode?.toLowerCase().includes(searchQuery.toLowerCase()) || activity.message.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const visibleActivities = filteredActivities.slice(0, displayCount);
  const canLoadMore = filteredActivities.length > displayCount;
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Loading activity log..." }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsxs(Select, { value: filterType, onValueChange: setFilterType, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full sm:w-[200px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter by type" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Activity" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "received", children: "Received" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "shipped", children: "Shipped" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "sold", children: "Sold" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "returns", children: "Returns" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "discrepancies", children: "Discrepancies" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "adjustments", children: "Adjustments" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "lowstock", children: "Low Stock" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Popover, { children: [
        /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full sm:w-[280px] justify-start", children: [
          /* @__PURE__ */ jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }),
          dateRange.from && dateRange.to ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}` : "Select date range"
        ] }) }),
        /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsx(
          Calendar,
          {
            mode: "range",
            selected: dateRange,
            onSelect: setDateRange,
            numberOfMonths: 2,
            initialFocus: true
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search by ASN, SKU, or description...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-9"
          }
        )
      ] })
    ] }) }),
    filteredActivities.length === 0 ? /* @__PURE__ */ jsx(Card, { className: "p-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No activity found" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: visibleActivities.map((activity) => /* @__PURE__ */ jsx(
        ActivityLogItem,
        {
          timestamp: activity.timestamp,
          type: activity.type,
          asnNumber: activity.asnNumber,
          message: activity.message
        },
        activity.id
      )) }),
      canLoadMore && /* @__PURE__ */ jsx(Card, { className: "p-4 text-center", children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => setDisplayCount((prev) => prev + 50),
          className: "w-full sm:w-auto",
          children: [
            "Load More Activities (",
            filteredActivities.length - displayCount,
            " remaining)"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground text-center", children: [
        "Showing ",
        visibleActivities.length,
        " of ",
        filteredActivities.length,
        " activities"
      ] })
    ] })
  ] });
}
export {
  ClientInventoryActivityLog
};
