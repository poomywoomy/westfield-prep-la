import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { l as useToast, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, g as DialogDescription, B as Button, s as supabase, C as DialogFooter, h as TooltipProvider, i as Tooltip, j as TooltipTrigger, k as TooltipContent, o as useAuth, r as DropdownMenu, v as DropdownMenuTrigger, x as DropdownMenuContent, y as DropdownMenuItem } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-WfKgKW48.js";
import { C as Checkbox } from "./checkbox-B9ll9gww.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { Loader2, AlertCircle, ExternalLink, Image, Edit, PackagePlus, ShoppingCart, Package2, Trash2, Package, Download, Search, Trash } from "lucide-react";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { toast } from "sonner";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D7ZcK1Wa.js";
import { format } from "date-fns";
import { S as SKUFormDialog } from "./SKUFormDialog-D171tANM.js";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
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
import "@radix-ui/react-checkbox";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-switch";
function BulkProductActionsDialog({
  open,
  onOpenChange,
  action,
  selectedProducts,
  onSuccess
}) {
  const { toast: toast2 } = useToast();
  const [loading, setLoading] = useState(false);
  const [priceAdjustment, setPriceAdjustment] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("percentage");
  const [newServiceType, setNewServiceType] = useState("");
  const handleBulkUpdate = async () => {
    try {
      setLoading(true);
      if (action === "update-price") {
        toast2({
          title: "Not supported",
          description: "Price updates are not available for the new inventory system",
          variant: "destructive"
        });
        onOpenChange(false);
        return;
      } else if (action === "update-service") {
        toast2({
          title: "Not supported",
          description: "Service type updates are not available for the new inventory system",
          variant: "destructive"
        });
        onOpenChange(false);
        return;
      } else if (action === "delete") {
        const ids = selectedProducts.map((p) => p.id);
        const { error } = await supabase.from("skus").delete().in("id", ids);
        if (error) throw error;
        toast2({
          title: "Products deleted",
          description: `Deleted ${selectedProducts.length} products`
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Bulk action error:", error);
      toast2({
        title: "Action failed",
        description: error instanceof Error ? error.message : "Failed to perform bulk action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const getDialogTitle = () => {
    switch (action) {
      case "update-price":
        return "Bulk Price Update";
      case "update-service":
        return "Bulk Service Type Update";
      case "delete":
        return "Delete Products";
      default:
        return "Bulk Action";
    }
  };
  const getDialogDescription = () => {
    switch (action) {
      case "update-price":
        return `Update prices for ${selectedProducts.length} selected products`;
      case "update-service":
        return `Update service type for ${selectedProducts.length} selected products`;
      case "delete":
        return `This will permanently delete ${selectedProducts.length} products. This action cannot be undone.`;
      default:
        return "";
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: getDialogTitle() }),
      /* @__PURE__ */ jsx(DialogDescription, { children: getDialogDescription() })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      action === "update-price" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Adjustment Type" }),
          /* @__PURE__ */ jsxs(Select, { value: adjustmentType, onValueChange: (v) => setAdjustmentType(v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "percentage", children: "Percentage (%)" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "fixed", children: "Fixed Amount ($)" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Adjustment Value" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              step: "0.01",
              placeholder: adjustmentType === "percentage" ? "e.g., 10 for +10%" : "e.g., 5.00",
              value: priceAdjustment,
              onChange: (e) => setPriceAdjustment(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: adjustmentType === "percentage" ? "Enter positive number to increase, negative to decrease" : "Enter amount to add (use negative for decrease)" })
        ] })
      ] }),
      action === "update-service" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Service Type" }),
        /* @__PURE__ */ jsxs(Select, { value: newServiceType, onValueChange: setNewServiceType, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select service type" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "FBA Prep", children: "FBA Prep" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "WFS Prep", children: "WFS Prep" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "TikTok Prep", children: "TikTok Prep" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Shopify Fulfillment", children: "Shopify Fulfillment" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Kitting", children: "Kitting" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Labeling", children: "Labeling" })
          ] })
        ] })
      ] }),
      action === "delete" && /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-destructive/50 bg-destructive/10 p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive", children: [
        "You are about to delete ",
        selectedProducts.length,
        " products. This action is permanent and cannot be undone."
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: loading, children: "Cancel" }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: handleBulkUpdate,
          disabled: loading,
          variant: action === "delete" ? "destructive" : "default",
          children: [
            loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            action === "delete" ? "Delete" : "Update",
            " Products"
          ]
        }
      )
    ] })
  ] }) });
}
function DeleteSKUDialog({ sku, open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [hasInventory, setHasInventory] = useState(false);
  const [hasReferences, setHasReferences] = useState(false);
  const checkDependencies = async () => {
    if (!sku) return;
    setLoading(true);
    try {
      const { data: inventory } = await supabase.from("inventory_summary").select("on_hand").eq("sku_id", sku.id).maybeSingle();
      const { data: asnLines } = await supabase.from("asn_lines").select("id").eq("sku_id", sku.id).limit(1);
      setHasInventory((inventory?.on_hand ?? 0) > 0);
      setHasReferences((asnLines?.length ?? 0) > 0);
    } catch (error) {
      console.error("Error checking dependencies:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!sku) return;
    setLoading(true);
    try {
      if (hasInventory || hasReferences) {
        const { error } = await supabase.from("skus").update({ status: "deleted" }).eq("id", sku.id);
        if (error) throw error;
        toast.success("SKU marked as deleted (has inventory/references)");
      } else {
        const { error } = await supabase.from("skus").delete().eq("id", sku.id);
        if (error) throw error;
        toast.success("SKU deleted successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting SKU:", error);
      toast.error(error.message || "Failed to delete SKU");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { onOpenAutoFocus: checkDependencies, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-destructive" }),
        "Delete SKU"
      ] }),
      /* @__PURE__ */ jsxs(DialogDescription, { children: [
        "Are you sure you want to delete ",
        /* @__PURE__ */ jsx("strong", { children: sku?.client_sku }),
        " (",
        sku?.title,
        ")?"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "py-4 text-center text-muted-foreground", children: "Checking dependencies..." }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      hasInventory && /* @__PURE__ */ jsxs("div", { className: "rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3 text-sm text-yellow-800 dark:text-yellow-200", children: [
        /* @__PURE__ */ jsx("strong", { children: "Warning:" }),
        " This SKU has active inventory. It will be marked as deleted but not removed from the system."
      ] }),
      hasReferences && /* @__PURE__ */ jsxs("div", { className: "rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3 text-sm text-yellow-800 dark:text-yellow-200", children: [
        /* @__PURE__ */ jsx("strong", { children: "Warning:" }),
        " This SKU is referenced in ASNs. It will be marked as deleted but not removed from the system."
      ] }),
      !hasInventory && !hasReferences && /* @__PURE__ */ jsx("div", { className: "rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 text-sm text-blue-800 dark:text-blue-200", children: "This SKU has no inventory or references and will be permanently deleted." })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: loading, children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: handleDelete, disabled: loading, children: loading ? "Deleting..." : "Delete SKU" })
    ] })
  ] }) });
}
const SKUDiscrepanciesDialog = ({
  open,
  onOpenChange,
  skuId,
  clientSku,
  onResolved
}) => {
  const [discrepancies, setDiscrepancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast: toast2 } = useToast();
  useEffect(() => {
    if (open && skuId) {
      fetchDiscrepancies();
    }
  }, [open, skuId]);
  const fetchDiscrepancies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("damaged_item_decisions").select(`
        *,
        asn_headers(asn_number, status),
        skus(client_sku, title)
      `).eq("sku_id", skuId).order("created_at", { ascending: false });
    if (error) {
      toast2({
        title: "Error",
        description: "Failed to load discrepancies",
        variant: "destructive"
      });
    } else {
      setDiscrepancies(data || []);
    }
    setLoading(false);
  };
  const getDiscrepancyTypeBadge = (type) => {
    const variants = {
      damaged: "destructive",
      missing: "secondary",
      quarantined: "default"
    };
    return /* @__PURE__ */ jsx(Badge, { variant: variants[type] || "default", children: type.toUpperCase() });
  };
  const getDecisionBadge = (decision) => {
    if (!decision) return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Pending" });
    const labels = {
      discard: "Discard",
      sell_as_bstock: "Sell",
      "sell-as-b-stock": "Sell",
      return_to_inventory: "Return to Inventory",
      return_to_sender: "Return to Sender",
      return: "Return to Sender",
      rework: "Rework/Repair",
      acknowledge: "Acknowledged"
    };
    const variants = {
      discard: "destructive",
      sell_as_bstock: "secondary",
      "sell-as-b-stock": "secondary",
      return_to_inventory: "secondary",
      return_to_sender: "default",
      return: "default",
      rework: "default",
      acknowledge: "secondary"
    };
    const label = labels[decision] || decision;
    return /* @__PURE__ */ jsx(Badge, { variant: variants[decision] || "default", children: label });
  };
  const getStatusBadge = (status) => {
    if (status === "submitted" || status === "processed") {
      return /* @__PURE__ */ jsx(Badge, { className: "bg-green-600 hover:bg-green-700 text-white", children: "Responded" });
    }
    return /* @__PURE__ */ jsx(Badge, { className: "bg-red-600 hover:bg-red-700 text-white", children: "Awaiting Response" });
  };
  const handleViewPhotos = (urls) => {
    if (urls && urls.length > 0) {
      window.open(urls[0], "_blank");
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-6xl max-h-[80vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
      "Discrepancies: ",
      clientSku
    ] }) }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Loading discrepancies..." }) : discrepancies.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground", children: "No discrepancies found" }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsx(TableHead, { children: "ASN" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Type" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Quantity" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Client Decision" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Client Notes" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Admin Notes" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Photos" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: discrepancies.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "text-sm whitespace-nowrap", children: format(new Date(item.created_at), "MMM d, yyyy") }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
            "#",
            item.asn_headers?.asn_number
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              onClick: () => window.open(`/admin/dashboard?asn=${item.asn_id}`, "_blank"),
              children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { children: getDiscrepancyTypeBadge(item.discrepancy_type) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right font-medium", children: item.quantity }),
        /* @__PURE__ */ jsx(TableCell, { children: getStatusBadge(item.status) }),
        /* @__PURE__ */ jsx(TableCell, { children: getDecisionBadge(item.decision) }),
        /* @__PURE__ */ jsx(TableCell, { className: "max-w-[200px] truncate text-sm text-muted-foreground", children: item.client_notes || "-" }),
        /* @__PURE__ */ jsx(TableCell, { className: "max-w-[200px] truncate text-sm text-muted-foreground", children: item.admin_resolution_notes || "-" }),
        /* @__PURE__ */ jsx(TableCell, { children: item.qc_photo_urls && item.qc_photo_urls.length > 0 ? /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "gap-2",
            onClick: () => handleViewPhotos(item.qc_photo_urls),
            children: [
              /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" }),
              item.qc_photo_urls.length
            ]
          }
        ) : /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "-" }) })
      ] }, item.id)) })
    ] }) })
  ] }) });
};
function SKUDetailedHistoryDialog({
  open,
  onOpenChange,
  skuId,
  clientSku,
  title
}) {
  const [timePeriod, setTimePeriod] = useState("month");
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState({ received: 0, sold: 0, returns: 0 });
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [showSKUEdit, setShowSKUEdit] = useState(false);
  const [skuData, setSkuData] = useState(null);
  const [clients, setClients] = useState([]);
  const [discrepancyCount, setDiscrepancyCount] = useState(0);
  const [showDiscrepancies, setShowDiscrepancies] = useState(false);
  const { toast: toast2 } = useToast();
  useEffect(() => {
    if (open && skuId) {
      fetchHistory();
      fetchSKU();
      fetchClients();
      fetchDiscrepancies();
    }
  }, [open, skuId, timePeriod]);
  const fetchSKU = async () => {
    const { data } = await supabase.from("skus").select("*").eq("id", skuId).single();
    setSkuData(data);
  };
  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("company_name");
    setClients(data || []);
  };
  const fetchDiscrepancies = async () => {
    const { count } = await supabase.from("damaged_item_decisions").select("*", { count: "exact", head: true }).eq("sku_id", skuId);
    setDiscrepancyCount(count || 0);
  };
  const getDateRange = (period) => {
    const now = /* @__PURE__ */ new Date();
    const startDate = /* @__PURE__ */ new Date();
    switch (period) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth());
        startDate.setDate(1);
        break;
      case "last_month":
        startDate.setMonth(now.getMonth() - 1);
        startDate.setDate(1);
        break;
      case "3_months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6_months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear());
        startDate.setMonth(0);
        startDate.setDate(1);
        break;
    }
    return { startDate, endDate: now };
  };
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange(timePeriod);
      const { data, error } = await supabase.from("inventory_ledger").select("*, locations(name), skus(client_sku, title)").eq("sku_id", skuId).gte("ts", startDate.toISOString()).lte("ts", endDate.toISOString()).order("ts", { ascending: false });
      if (error) throw error;
      setHistory(data || []);
      calculateMetrics(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };
  const calculateMetrics = (transactions) => {
    const received = transactions.filter((t) => t.transaction_type === "RECEIPT").reduce((sum, t) => sum + (t.qty_delta || 0), 0);
    const sold = transactions.filter((t) => t.transaction_type === "SALE_DECREMENT" || t.reason_code === "sold").reduce((sum, t) => sum + Math.abs(t.qty_delta || 0), 0);
    const returns = transactions.filter((t) => t.transaction_type === "RETURN" || t.reason_code === "return").reduce((sum, t) => sum + (t.qty_delta || 0), 0);
    setMetrics({ received, sold, returns });
  };
  const getTransactionTypeLabel = (type) => {
    const labels = {
      RECEIPT: "Received",
      SALE_DECREMENT: "Sold",
      TRANSFER: "Transfer",
      ADJUSTMENT_PLUS: "Adj +",
      ADJUSTMENT_MINUS: "Adj -",
      RETURN: "Return",
      DAMAGED: "Damaged",
      QUARANTINED: "Quarantined",
      MISSING: "Missing"
    };
    return labels[type] || type;
  };
  const getTransactionBadgeVariant = (type) => {
    if (type === "RECEIPT" || type === "RETURN" || type === "ADJUSTMENT_PLUS") return "default";
    if (type === "SALE_DECREMENT" || type === "ADJUSTMENT_MINUS") return "secondary";
    if (type === "DAMAGED" || type === "MISSING") return "destructive";
    return "outline";
  };
  const handleDeleteEntry = (entryId) => {
    setEntryToDelete(entryId);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!entryToDelete) return;
    const entryData = history.find((e) => e.id === entryToDelete);
    try {
      const { error } = await supabase.from("inventory_ledger").delete().eq("id", entryToDelete);
      if (error) throw error;
      toast2({
        title: "Deleted",
        description: `${getTransactionTypeLabel(entryData?.transaction_type || "")} removed`
      });
      fetchHistory();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Delete failed",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-5xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "pb-4 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg", children: clientSku }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground truncate", children: title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setShowSKUEdit(true),
            children: [
              /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4 mr-1" }),
              "Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Select, { value: timePeriod, onValueChange: (value) => setTimePeriod(value), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[140px] h-9", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "today", children: "Today" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "yesterday", children: "Yesterday" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "week", children: "This Week" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "month", children: "This Month" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "last_month", children: "Last Month" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "3_months", children: "3 Months" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "6_months", children: "6 Months" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "year", children: "This Year" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 my-4", children: [
      /* @__PURE__ */ jsx(Card, { className: "bg-green-50 border-green-200", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(PackagePlus, { className: "h-4 w-4 text-green-600" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-green-700", children: "Received" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-green-600", children: [
          "+",
          metrics.received
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "bg-blue-50 border-blue-200", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4 text-blue-600" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-blue-700", children: "Sold" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-blue-600", children: metrics.sold })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "bg-amber-50 border-amber-200", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(Package2, { className: "h-4 w-4 text-amber-600" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-amber-700", children: "Returns" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-amber-600", children: [
          "+",
          metrics.returns
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(
        Card,
        {
          className: "bg-red-50 border-red-200 cursor-pointer hover:bg-red-100 transition-colors",
          onClick: () => setShowDiscrepancies(true),
          children: /* @__PURE__ */ jsxs(CardContent, { className: "p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 text-red-600" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-red-700", children: "Issues" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-red-600", children: discrepancyCount })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "text-xs py-2", children: "Date" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-xs py-2", children: "Type" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-xs py-2", children: "Location" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-xs py-2 text-right", children: "Qty" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-xs py-2", children: "Reason" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-xs py-2", children: "Notes" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-xs py-2 w-10" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center text-muted-foreground py-8", children: "Loading..." }) }) : history.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center text-muted-foreground py-8", children: "No transactions found for this period" }) }) : history.map((entry) => /* @__PURE__ */ jsxs(TableRow, { className: "text-sm", children: [
        /* @__PURE__ */ jsx(TableCell, { className: "py-2 text-xs whitespace-nowrap", children: format(new Date(entry.ts), "MMM d, h:mm a") }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-2", children: /* @__PURE__ */ jsx(Badge, { variant: getTransactionBadgeVariant(entry.transaction_type), className: "text-xs px-1.5 py-0", children: getTransactionTypeLabel(entry.transaction_type) }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-2 text-xs", children: entry.locations?.name || "-" }),
        /* @__PURE__ */ jsxs(TableCell, { className: `py-2 text-right font-medium text-xs ${entry.qty_delta > 0 ? "text-green-600" : "text-red-600"}`, children: [
          entry.qty_delta > 0 ? "+" : "",
          entry.qty_delta
        ] }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-2 text-xs", children: entry.reason_code ? /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: entry.reason_code.replace("_", " ") }) : "-" }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-2 text-xs max-w-[150px]", children: /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("span", { className: "truncate block", children: entry.notes || "-" }) }),
          entry.notes && /* @__PURE__ */ jsx(TooltipContent, { className: "max-w-xs", children: /* @__PURE__ */ jsx("p", { children: entry.notes }) })
        ] }) }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "py-2", children: entry.transaction_type !== "RECEIPT" && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-7 w-7",
            onClick: () => handleDeleteEntry(entry.id),
            children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
          }
        ) })
      ] }, entry.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Entry?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure you want to delete this entry? This will affect inventory calculations and cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      SKUFormDialog,
      {
        open: showSKUEdit,
        onClose: () => {
          setShowSKUEdit(false);
          fetchHistory();
          fetchSKU();
        },
        sku: skuData,
        clients,
        isClientView: false
      }
    ),
    /* @__PURE__ */ jsx(
      SKUDiscrepanciesDialog,
      {
        open: showDiscrepancies,
        onOpenChange: setShowDiscrepancies,
        skuId,
        clientSku,
        onResolved: fetchDiscrepancies
      }
    )
  ] }) });
}
function ClientProductsTab() {
  const { user } = useAuth();
  const { toast: toast2 } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(/* @__PURE__ */ new Set());
  useState("all");
  useState(false);
  const [bulkDialog, setBulkDialog] = useState({ open: false, action: "update-price" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSKU, setDeletingSKU] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    if (user) {
      fetchProducts();
      const channel = supabase.channel("inventory_updates").on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inventory_ledger"
        },
        (payload) => {
          console.log("Inventory update received:", payload);
          fetchProducts();
        }
      ).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(
        (p) => p.client_sku?.toLowerCase().includes(searchTerm.toLowerCase()) || p.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [searchTerm, products]);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data: client } = await supabase.from("clients").select("id").eq("user_id", user?.id).single();
      if (!client) return;
      const { data: skuData, error: skuError } = await supabase.from("skus").select("*").eq("client_id", client.id).order("created_at", { ascending: false });
      if (skuError) throw skuError;
      const { data: inventoryData } = await supabase.from("inventory_summary").select("*").eq("client_id", client.id);
      const startOfMonth = /* @__PURE__ */ new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const productsWithMetrics = await Promise.all((skuData || []).map(async (sku) => {
        const inventory = (inventoryData || []).find((inv) => inv.sku_id === sku.id);
        const { data: decrementData } = await supabase.from("inventory_ledger").select("qty_delta, source_type").eq("sku_id", sku.id).in("transaction_type", ["SALE_DECREMENT"]).gte("ts", startOfMonth.toISOString());
        const shippedThisMonth = Math.abs(
          decrementData?.filter((entry) => entry.source_type === "outbound_shipment").reduce((sum, entry) => sum + (entry.qty_delta || 0), 0) || 0
        );
        const soldThisMonth = Math.abs(
          decrementData?.filter((entry) => entry.source_type !== "outbound_shipment").reduce((sum, entry) => sum + (entry.qty_delta || 0), 0) || 0
        );
        return {
          ...sku,
          on_hand: inventory?.on_hand || 0,
          available: inventory?.available || 0,
          reserved: inventory?.reserved || 0,
          sold_this_month: soldThisMonth,
          shipped_this_month: shippedThisMonth
        };
      }));
      setProducts(productsWithMetrics);
      setFilteredProducts(productsWithMetrics);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast2({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(/* @__PURE__ */ new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
    }
  };
  const toggleSelectProduct = (id) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };
  const getSelectedProductsData = () => {
    return products.filter((p) => selectedProducts.has(p.id));
  };
  const handleBulkAction = (action) => {
    setBulkDialog({ open: true, action });
  };
  const exportToCSV = () => {
    const headers = ["SKU", "Product Name", "Brand", "On Hand", "Available", "Reserved", "Sold (Month)", "Shipped (Month)", "Notes"];
    const rows = filteredProducts.map((p) => [
      p.client_sku,
      p.title || "",
      p.brand || "",
      p.on_hand || 0,
      p.available || 0,
      p.reserved || 0,
      p.sold_this_month || 0,
      p.shipped_this_month || 0,
      p.notes || ""
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Loading products..." }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Package, { className: "h-5 w-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Your Products" }),
            /* @__PURE__ */ jsxs(CardDescription, { children: [
              filteredProducts.length,
              " products with inventory tracking"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(Button, { onClick: exportToCSV, variant: "outline", size: "sm", children: [
          /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
          "Export CSV"
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Search by SKU or product name...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10"
            }
          )
        ] }),
        selectedProducts.size > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-muted rounded-lg", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
            selectedProducts.size,
            " selected"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 ml-auto", children: [
            /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", children: [
                /* @__PURE__ */ jsx(Edit, { className: "mr-2 h-4 w-4" }),
                "Bulk Actions"
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuContent, { children: /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  onClick: () => handleBulkAction("delete"),
                  className: "text-destructive",
                  children: [
                    /* @__PURE__ */ jsx(Trash, { className: "mr-2 h-4 w-4" }),
                    "Delete Products"
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: () => setSelectedProducts(/* @__PURE__ */ new Set()),
                children: "Clear"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { className: "w-full", children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50", children: [
            /* @__PURE__ */ jsx(TableHead, { className: "w-12", children: /* @__PURE__ */ jsx(
              Checkbox,
              {
                checked: selectedProducts.size === filteredProducts.length && filteredProducts.length > 0,
                onCheckedChange: toggleSelectAll
              }
            ) }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-16", children: "Image" }),
            /* @__PURE__ */ jsx(TableHead, { className: "min-w-[120px]", children: "SKU" }),
            /* @__PURE__ */ jsx(TableHead, { className: "min-w-[180px]", children: "Product Name" }),
            /* @__PURE__ */ jsx(TableHead, { className: "min-w-[100px]", children: "Brand" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right min-w-[90px]", children: "On Hand" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right min-w-[90px]", children: "Available" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right min-w-[90px]", children: "Reserved" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right min-w-[100px]", children: "Sold (Month)" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right min-w-[110px]", children: "Shipped (Month)" }),
            /* @__PURE__ */ jsx(TableHead, { className: "min-w-[80px]", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: filteredProducts.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 11, className: "text-center text-muted-foreground py-8", children: "No products found" }) }) : filteredProducts.map((product) => /* @__PURE__ */ jsxs(
            TableRow,
            {
              className: "cursor-pointer hover:bg-muted/50 h-16",
              onClick: () => {
                setSelectedProduct(product);
                setHistoryDialogOpen(true);
              },
              children: [
                /* @__PURE__ */ jsx(TableCell, { onClick: (e) => e.stopPropagation(), className: "py-3", children: /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    checked: selectedProducts.has(product.id),
                    onCheckedChange: () => toggleSelectProduct(product.id)
                  }
                ) }),
                /* @__PURE__ */ jsx(TableCell, { className: "py-3", children: product.image_url ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: product.image_url,
                    alt: product.title || "Product",
                    className: "w-12 h-12 object-cover rounded border"
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-muted rounded border flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "h-6 w-6 text-muted-foreground" }) }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm font-semibold py-3", children: product.client_sku }),
                /* @__PURE__ */ jsx(TableCell, { className: "py-3", children: product.title || "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "py-3", children: product.brand || "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right font-semibold text-base py-3", children: product.on_hand }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right font-semibold text-base text-green-600 py-3", children: product.available }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right font-semibold text-base text-amber-600 py-3", children: product.reserved }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right font-semibold text-base text-blue-600 py-3", children: product.sold_this_month }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right font-semibold text-base text-purple-600 py-3", children: product.shipped_this_month }),
                /* @__PURE__ */ jsx(TableCell, { className: "py-3", children: /* @__PURE__ */ jsx(
                  Badge,
                  {
                    variant: product.status === "active" ? "default" : "secondary",
                    className: product.status === "active" ? "bg-green-600 hover:bg-green-700 text-white" : "",
                    children: product.status === "active" ? "Active" : product.status
                  }
                ) })
              ]
            },
            product.id
          )) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      BulkProductActionsDialog,
      {
        open: bulkDialog.open,
        onOpenChange: (open) => setBulkDialog({ ...bulkDialog, open }),
        action: bulkDialog.action,
        selectedProducts: getSelectedProductsData(),
        onSuccess: () => {
          setSelectedProducts(/* @__PURE__ */ new Set());
          fetchProducts();
        }
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteSKUDialog,
      {
        sku: deletingSKU,
        open: deleteDialogOpen,
        onOpenChange: setDeleteDialogOpen,
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingSKU(null);
          fetchProducts();
        }
      }
    ),
    /* @__PURE__ */ jsx(
      SKUDetailedHistoryDialog,
      {
        open: historyDialogOpen,
        onOpenChange: setHistoryDialogOpen,
        skuId: selectedProduct?.id || "",
        clientSku: selectedProduct?.client_sku || "",
        title: selectedProduct?.title || ""
      }
    )
  ] });
}
export {
  ClientProductsTab as default
};
