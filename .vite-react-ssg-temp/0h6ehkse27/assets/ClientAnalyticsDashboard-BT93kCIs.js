import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { s as supabase, l as useToast, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, g as DialogDescription, C as DialogFooter, B as Button } from "../main.mjs";
import { P as PhotoLightbox, D as DamagedItemReviewDialog } from "./DamagedItemReviewDialog-DaGwIzt7.js";
import { T as Textarea, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { PackageX, Package, Box, TrendingDown, AlertTriangle, TrendingUp, FileText, Truck, History, FilePlus, PlusCircle, LifeBuoy, Search, Loader2, CheckCircle, AlertCircle, DollarSign, RotateCcw } from "lucide-react";
import { r as resignPhotoUrls } from "./photoUtils-pehMpqiu.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-WfKgKW48.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { S as Skeleton } from "./skeleton-6MvOnm4j.js";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DOpNgkQL.js";
import { b as formatDatePT } from "./dateFormatters-DrRoJsWa.js";
import { A as AlertDialog, a as AlertDialogContent, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, g as AlertDialogAction } from "./alert-dialog-D7ZcK1Wa.js";
import { I as Input } from "./input-CSM87NBF.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { A as ASNFormDialog } from "./ASNFormDialog-B0PvkEvQ.js";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { endOfDay, startOfDay, subDays, startOfYear, startOfMonth, addDays, format } from "date-fns";
import "vite-react-ssg";
import "react-router-dom";
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
import "@radix-ui/react-radio-group";
import "react-dom";
import "@radix-ui/react-select";
import "@radix-ui/react-label";
import "@radix-ui/react-tabs";
import "date-fns-tz";
import "@radix-ui/react-alert-dialog";
import "zod";
import "html5-qrcode";
const useClientIssues = (clientId, sourceType) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [damagedCount, setDamagedCount] = useState(0);
  const [missingCount, setMissingCount] = useState(0);
  const fetchIssues = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      let query = supabase.from("damaged_item_decisions").select(`
          *,
          skus(client_sku, title, image_url),
          asn_headers(asn_number)
        `).eq("client_id", clientId).eq("status", "pending");
      if (sourceType) {
        query = query.eq("source_type", sourceType);
      }
      query = query.is("submitted_at", null);
      const { data, error } = await query;
      if (error) throw error;
      const mappedIssues = (data || []).map((item) => ({
        ...item,
        client_sku: item.skus?.client_sku,
        title: item.skus?.title,
        image_url: item.skus?.image_url,
        asn_number: item.asn_headers?.asn_number
      }));
      setIssues(mappedIssues);
      const damaged = mappedIssues.filter((i) => i.discrepancy_type === "damaged").length;
      const missing = mappedIssues.filter((i) => i.discrepancy_type === "missing").length;
      setDamagedCount(damaged);
      setMissingCount(missing);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (clientId) {
      fetchIssues();
    }
  }, [clientId, sourceType]);
  return {
    issues,
    loading,
    damagedCount,
    missingCount,
    totalCount: issues.length,
    refetch: fetchIssues
  };
};
function MissingItemReviewDialog({
  open,
  onOpenChange,
  discrepancy,
  onSuccess
}) {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayPhotos, setDisplayPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  useEffect(() => {
    if (discrepancy.qc_photo_urls && open) {
      setPhotosLoading(true);
      resignPhotoUrls(discrepancy.qc_photo_urls).then(setDisplayPhotos).finally(() => setPhotosLoading(false));
    } else {
      setDisplayPhotos([]);
      setPhotosLoading(false);
    }
  }, [discrepancy.qc_photo_urls, open]);
  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("damaged_item_decisions").update({
        decision: "acknowledge",
        client_notes: notes || "Acknowledged missing items",
        submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
        status: "submitted"
        // Change status to 'submitted' when client responds
      }).eq("id", discrepancy.id);
      if (error) throw error;
      toast({
        title: "Acknowledged",
        description: "Missing items have been acknowledged"
      });
      onSuccess?.();
      onOpenChange(false);
      setNotes("");
    } catch (error) {
      console.error("Error acknowledging missing items:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to acknowledge",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(
      DialogContent,
      {
        className: "max-w-lg",
        onOpenAutoFocus: (e) => e.preventDefault(),
        onEscapeKeyDown: (e) => {
          if (lightboxOpen) {
            e.preventDefault();
          }
        },
        onPointerDownOutside: (e) => {
          if (lightboxOpen) {
            e.preventDefault();
          }
        },
        onInteractOutside: (e) => {
          if (lightboxOpen) {
            e.preventDefault();
          }
        },
        children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(PackageX, { className: "h-5 w-5 text-red-600" }),
              "Missing Items Report"
            ] }),
            /* @__PURE__ */ jsx(DialogDescription, { className: "sr-only", children: "Review and acknowledge missing items from your shipment" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4 p-4 border rounded-lg bg-muted/50", children: [
              discrepancy.image_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: discrepancy.image_url,
                  alt: discrepancy.title,
                  className: "w-20 h-20 object-cover rounded"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-muted rounded flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "h-8 w-8 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold", children: discrepancy.title }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "SKU: ",
                  discrepancy.client_sku
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "ASN: ",
                  discrepancy.asn_number
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-red-600 mt-2", children: [
                  discrepancy.missing_qty,
                  " units missing"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "QC Photos (click to enlarge)" }),
              photosLoading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "w-full h-32 bg-muted rounded animate-pulse" }, i)) }) : displayPhotos.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: displayPhotos.map((url, index) => /* @__PURE__ */ jsx(
                "img",
                {
                  src: url,
                  alt: `QC Photo ${index + 1}`,
                  loading: index < 2 ? "eager" : "lazy",
                  decoding: "async",
                  className: "w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity",
                  onClick: (e) => {
                    e.stopPropagation();
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }
                },
                index
              )) }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "No QC photos available for this discrepancy." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-4 bg-yellow-50 border border-yellow-200 rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-yellow-800", children: "These items were expected in the shipment but were not received. Please acknowledge this discrepancy. Our team will investigate and follow up." }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "notes", className: "mb-2 block", children: "Additional Comments (Optional)" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "notes",
                  value: notes,
                  onChange: (e) => setNotes(e.target.value),
                  placeholder: "Any additional information about these missing items...",
                  rows: 3
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: loading, children: "Cancel" }),
            /* @__PURE__ */ jsx(Button, { onClick: handleAcknowledge, disabled: loading, children: loading ? "Acknowledging..." : "Acknowledge" })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      PhotoLightbox,
      {
        photos: displayPhotos,
        initialIndex: lightboxIndex,
        open: lightboxOpen,
        onClose: () => setLightboxOpen(false)
      }
    )
  ] });
}
const SKUDetailDialog = ({ open, onOpenChange, skuId, clientId }) => {
  const { data: skuData, isLoading } = useQuery({
    queryKey: ["sku-detail", skuId],
    queryFn: async () => {
      const now = /* @__PURE__ */ new Date();
      const startOfMonth2 = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const { data: inventoryData, error: invError } = await supabase.from("inventory_summary_complete").select("*").eq("sku_id", skuId).eq("client_id", clientId).maybeSingle();
      if (invError) throw invError;
      const { data: skuDetails, error: skuError } = await supabase.from("skus").select("low_stock_threshold, image_url, title, client_sku, internal_sku").eq("id", skuId).single();
      if (skuError) throw skuError;
      const { data: receivedData } = await supabase.from("inventory_ledger").select("qty_delta").eq("sku_id", skuId).eq("client_id", clientId).in("transaction_type", ["RECEIPT", "ADJUSTMENT_PLUS"]).gte("ts", startOfMonth2.toISOString()).lte("ts", endOfMonth.toISOString());
      const receivedMonth = receivedData?.reduce((sum, r) => sum + r.qty_delta, 0) || 0;
      const { data: soldData } = await supabase.from("inventory_ledger").select("qty_delta").eq("sku_id", skuId).eq("client_id", clientId).in("transaction_type", ["SALE_DECREMENT", "TRANSFER"]).gte("ts", startOfMonth2.toISOString()).lte("ts", endOfMonth.toISOString());
      const soldMonth = Math.abs(soldData?.reduce((sum, s) => sum + s.qty_delta, 0) || 0);
      const { data: discrepanciesData } = await supabase.from("damaged_item_decisions").select("id, quantity, discrepancy_type").eq("sku_id", skuId).eq("client_id", clientId).in("status", ["pending", "submitted", "processed"]);
      const discrepanciesCount = discrepanciesData?.length || 0;
      return {
        ...inventoryData,
        title: skuDetails?.title,
        client_sku: skuDetails?.client_sku,
        internal_sku: skuDetails?.internal_sku,
        image_url: skuDetails?.image_url,
        reorder_point: skuDetails?.low_stock_threshold || 10,
        received_month: receivedMonth,
        sold_month: soldMonth,
        discrepancies: discrepanciesCount
      };
    },
    enabled: open && !!skuId
  });
  const { data: recentASNs, isLoading: asnsLoading } = useQuery({
    queryKey: ["sku-asns", skuId],
    queryFn: async () => {
      const { data, error } = await supabase.from("asn_lines").select(`
          id,
          received_units,
          expected_units,
          created_at,
          asn_headers!inner (
            id,
            asn_number,
            status,
            received_at,
            is_return
          )
        `).eq("sku_id", skuId).order("created_at", { ascending: false }).limit(10);
      if (error) throw error;
      return data;
    },
    enabled: open && !!skuId
  });
  const { data: recentShipments, isLoading: shipmentsLoading } = useQuery({
    queryKey: ["sku-shipments", skuId],
    queryFn: async () => {
      const { data, error } = await supabase.from("outbound_shipment_lines").select(`
          id,
          quantity,
          created_at,
          outbound_shipments!inner (
            id,
            shipment_number,
            shipment_status,
            destination_type,
            marketplace,
            shipped_at
          )
        `).eq("sku_id", skuId).order("created_at", { ascending: false }).limit(10);
      if (error) throw error;
      return data;
    },
    enabled: open && !!skuId
  });
  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["sku-transactions", skuId],
    queryFn: async () => {
      const { data, error } = await supabase.from("inventory_ledger").select("id, qty_delta, transaction_type, source_type, notes, ts").eq("sku_id", skuId).eq("client_id", clientId).order("ts", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
    enabled: open && !!skuId
  });
  const getStockStatus = () => {
    if (!skuData) return { label: "Unknown", color: "gray" };
    const available = skuData.available || 0;
    const reorderPoint = skuData.reorder_point || 10;
    if (available === 0) return { label: "Out of Stock", color: "red" };
    if (available <= reorderPoint) return { label: "Low Stock", color: "orange" };
    return { label: "In Stock", color: "green" };
  };
  const stockStatus = getStockStatus();
  const formatDestination = (dest, marketplace) => {
    if (marketplace) return marketplace.charAt(0).toUpperCase() + marketplace.slice(1);
    return dest === "amazon_fba" ? "Amazon FBA" : dest === "walmart_wfs" ? "Walmart WFS" : dest;
  };
  const getTransactionLabel = (type) => {
    const labels = {
      "RECEIPT": "Received",
      "ADJUSTMENT_PLUS": "Adjustment (+)",
      "ADJUSTMENT_MINUS": "Adjustment (-)",
      "SALE_DECREMENT": "Sold/Shipped",
      "TRANSFER": "Transfer",
      "RETURN": "Return"
    };
    return labels[type] || type;
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-5 w-5" }),
      "SKU Details"
    ] }) }),
    isLoading ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-48 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-24 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-32 w-full" })
    ] }) : skuData ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "h-32 w-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0", children: skuData.image_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: skuData.image_url,
            alt: skuData.title || "Product",
            className: "h-full w-full object-cover"
          }
        ) : /* @__PURE__ */ jsx(Package, { className: "h-16 w-16 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: skuData.title || "Untitled Product" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
            "SKU: ",
            skuData.internal_sku || skuData.client_sku
          ] }),
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "secondary",
              className: `mt-2 ${stockStatus.color === "red" ? "bg-red-100 text-red-700 border-red-200" : stockStatus.color === "orange" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-green-100 text-green-700 border-green-200"}`,
              children: stockStatus.label
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-blue-600" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Available" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: skuData.available || 0 })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(Box, { className: "h-4 w-4 text-purple-600" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "On Hand" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: skuData.on_hand || 0 })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-orange-600" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Reserved" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: skuData.reserved || 0 })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-red-600" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Reorder At" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: skuData.reorder_point || 10 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-green-600" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Received (Month)" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: skuData.received_month || 0 })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-blue-600" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Sold (Month)" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: skuData.sold_month || 0 })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-red-600" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Discrepancies" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: skuData.discrepancies || 0 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "asns", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "asns", className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
            "ASNs"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "shipments", className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" }),
            "Shipments"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "transactions", className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(History, { className: "h-4 w-4" }),
            "Transactions"
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "asns", className: "mt-4", children: asnsLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-32 w-full" }) : recentASNs && recentASNs.length > 0 ? /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "ASN #" }),
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Type" }),
            /* @__PURE__ */ jsx("th", { className: "text-right p-3 font-medium", children: "Qty" }),
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: recentASNs.map((asn) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsx("td", { className: "p-3 font-mono text-xs", children: asn.asn_headers?.asn_number }),
            /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx(Badge, { variant: asn.asn_headers?.is_return ? "destructive" : "secondary", children: asn.asn_headers?.is_return ? "Return" : "Inbound" }) }),
            /* @__PURE__ */ jsx("td", { className: "p-3 text-right", children: asn.received_units || asn.expected_units }),
            /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: asn.asn_headers?.status }) }),
            /* @__PURE__ */ jsx("td", { className: "p-3 text-muted-foreground", children: asn.asn_headers?.received_at ? formatDatePT(asn.asn_headers.received_at) : "-" })
          ] }, asn.id)) })
        ] }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-10 w-10 mx-auto mb-2 opacity-30" }),
          /* @__PURE__ */ jsx("p", { children: "No ASNs found for this SKU" })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "shipments", className: "mt-4", children: shipmentsLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-32 w-full" }) : recentShipments && recentShipments.length > 0 ? /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Shipment #" }),
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Destination" }),
            /* @__PURE__ */ jsx("th", { className: "text-right p-3 font-medium", children: "Qty" }),
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: recentShipments.map((shipment) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsx("td", { className: "p-3 font-mono text-xs", children: shipment.outbound_shipments?.shipment_number }),
            /* @__PURE__ */ jsx("td", { className: "p-3", children: formatDestination(
              shipment.outbound_shipments?.destination_type,
              shipment.outbound_shipments?.marketplace
            ) }),
            /* @__PURE__ */ jsx("td", { className: "p-3 text-right", children: shipment.quantity }),
            /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: shipment.outbound_shipments?.shipment_status }) }),
            /* @__PURE__ */ jsx("td", { className: "p-3 text-muted-foreground", children: shipment.outbound_shipments?.shipped_at ? formatDatePT(shipment.outbound_shipments.shipped_at) : formatDatePT(shipment.created_at) })
          ] }, shipment.id)) })
        ] }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Truck, { className: "h-10 w-10 mx-auto mb-2 opacity-30" }),
          /* @__PURE__ */ jsx("p", { children: "No shipments found for this SKU" })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "transactions", className: "mt-4", children: transactionsLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-32 w-full" }) : recentTransactions && recentTransactions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Type" }),
            /* @__PURE__ */ jsx("th", { className: "text-right p-3 font-medium", children: "Qty" }),
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Source" }),
            /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium", children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: recentTransactions.map((tx) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx(
              Badge,
              {
                variant: tx.qty_delta > 0 ? "default" : "secondary",
                className: tx.qty_delta > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                children: getTransactionLabel(tx.transaction_type)
              }
            ) }),
            /* @__PURE__ */ jsxs("td", { className: `p-3 text-right font-medium ${tx.qty_delta > 0 ? "text-green-600" : "text-red-600"}`, children: [
              tx.qty_delta > 0 ? "+" : "",
              tx.qty_delta
            ] }),
            /* @__PURE__ */ jsx("td", { className: "p-3 text-muted-foreground text-xs", children: tx.source_type || "-" }),
            /* @__PURE__ */ jsx("td", { className: "p-3 text-muted-foreground", children: formatDatePT(tx.ts) })
          ] }, tx.id)) })
        ] }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(History, { className: "h-10 w-10 mx-auto mb-2 opacity-30" }),
          /* @__PURE__ */ jsx("p", { children: "No transactions found for this SKU" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs mt-1", children: "ASNs and shipments will appear here once inventory activity occurs." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-800", children: [
        /* @__PURE__ */ jsx("strong", { children: "Available:" }),
        " Units ready to ship",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("strong", { children: "On Hand:" }),
        " Total physical units in warehouse",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("strong", { children: "Reserved:" }),
        " Units allocated to pending orders"
      ] }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 mx-auto mb-2 opacity-30" }),
      /* @__PURE__ */ jsx("p", { children: "SKU not found" })
    ] })
  ] }) });
};
const QuickActionsCard = ({
  onAddASN,
  onRequestShipment,
  onContactSupport
}) => {
  return /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-950/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50" }),
    /* @__PURE__ */ jsx(CardHeader, { className: "relative z-10", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Quick Actions" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 relative z-10", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onRequestShipment,
          className: "w-full justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] group",
          children: [
            /* @__PURE__ */ jsx(FilePlus, { size: 18, className: "group-hover:rotate-12 transition-transform" }),
            "Request Outbound Shipment"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onAddASN,
          variant: "outline",
          className: "w-full justify-center gap-2 hover:bg-muted/50 transition-all group",
          children: [
            /* @__PURE__ */ jsx(PlusCircle, { size: 18, className: "text-orange-500" }),
            "Add New ASN"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onContactSupport,
          variant: "outline",
          className: "w-full justify-center gap-2 hover:bg-muted/50 transition-all",
          children: [
            /* @__PURE__ */ jsx(LifeBuoy, { size: 18, className: "text-muted-foreground" }),
            "Contact Support"
          ]
        }
      )
    ] })
  ] });
};
const RequestShipmentDialog = ({ open, onOpenChange, clientId, onSuccess }) => {
  const [platform, setPlatform] = useState("");
  const [otherPlatform, setOtherPlatform] = useState("");
  const [shipmentType, setShipmentType] = useState("carton");
  const [shipmentDate, setShipmentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [skus, setSKUs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [overRequestWarning, setOverRequestWarning] = useState(null);
  const { toast } = useToast();
  useEffect(() => {
    if (open && clientId) {
      fetchRealSKUs();
    } else {
      resetForm();
    }
  }, [open, clientId]);
  const fetchRealSKUs = async () => {
    setLoading(true);
    try {
      const { data: inventoryData, error: invError } = await supabase.from("inventory_summary").select("sku_id, client_sku, available").eq("client_id", clientId).gt("available", 0);
      if (invError) throw invError;
      const skuIds = (inventoryData || []).map((item) => item.sku_id);
      if (skuIds.length === 0) {
        setSKUs([]);
        setLoading(false);
        return;
      }
      const { data: skusData, error: skusError } = await supabase.from("skus").select("id, client_sku, title, image_url").in("id", skuIds);
      if (skusError) throw skusError;
      const transformedSkus = (inventoryData || []).map((invItem) => {
        const skuData = (skusData || []).find((s) => s.id === invItem.sku_id);
        return {
          id: invItem.sku_id,
          client_sku: skuData?.client_sku || invItem.client_sku,
          title: skuData?.title || "Unknown Product",
          image_url: skuData?.image_url || null,
          available: invItem.available
        };
      }).sort((a, b) => a.client_sku.localeCompare(b.client_sku));
      setSKUs(transformedSkus);
    } catch (error) {
      console.error("Error fetching SKUs:", error);
      toast({
        title: "Error Loading SKUs",
        description: error.message,
        variant: "destructive"
      });
      setSKUs([]);
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setPlatform("");
    setOtherPlatform("");
    setShipmentType("carton");
    setShipmentDate("");
    setNotes("");
    setSearchQuery("");
    setQuantities({});
    setSKUs([]);
    setOverRequestWarning(null);
  };
  const handleQuantityChange = (skuId, value) => {
    const qty = parseInt(value) || 0;
    if (qty < 0) return;
    const sku = skus.find((s) => s.id === skuId);
    if (sku && qty > sku.available) {
      setOverRequestWarning({
        skuId,
        skuName: sku.client_sku,
        requested: qty,
        available: sku.available
      });
    }
    setQuantities((prev) => ({
      ...prev,
      [skuId]: qty
    }));
  };
  const handleSubmit = async () => {
    if (!platform) {
      toast({
        title: "Platform Required",
        description: "Please select a platform",
        variant: "destructive"
      });
      return;
    }
    if (platform === "other" && !otherPlatform.trim()) {
      toast({
        title: "Platform Name Required",
        description: "Please specify the platform name",
        variant: "destructive"
      });
      return;
    }
    if (!shipmentDate) {
      toast({
        title: "Shipment Date Required",
        description: "Please select a shipment date",
        variant: "destructive"
      });
      return;
    }
    const selectedSkus = Object.entries(quantities).filter(([_, qty]) => qty > 0).map(([sku_id, quantity]) => ({ sku_id, quantity }));
    if (selectedSkus.length === 0) {
      toast({
        title: "No SKUs Selected",
        description: "Please add at least one SKU with quantity > 0",
        variant: "destructive"
      });
      return;
    }
    setSubmitting(true);
    try {
      const { data: request, error: requestError } = await supabase.from("shipment_requests").insert({
        client_id: clientId,
        requested_ship_date: shipmentDate,
        marketplace: platform === "other" ? "other" : platform,
        marketplace_other: platform === "other" ? otherPlatform : null,
        shipment_type: shipmentType,
        notes: notes || null,
        status: "pending"
      }).select().single();
      if (requestError) throw requestError;
      const { error: linesError } = await supabase.from("shipment_request_lines").insert(
        selectedSkus.map((sku) => ({
          request_id: request.id,
          sku_id: sku.sku_id,
          quantity: sku.quantity
        }))
      );
      if (linesError) throw linesError;
      const platformName = platform === "other" ? otherPlatform : platform;
      toast({
        title: "Request Submitted",
        description: `Your shipment request for ${platformName} has been submitted. Admin will review shortly.`
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  const filteredSKUs = skus.filter(
    (sku) => sku.client_sku.toLowerCase().includes(searchQuery.toLowerCase()) || sku.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedCount = Object.values(quantities).filter((q) => q > 0).length;
  const totalUnits = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Request Outbound Shipment" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 flex-1 overflow-y-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "platform", children: "Destination Platform *" }),
          /* @__PURE__ */ jsxs(Select, { value: platform, onValueChange: setPlatform, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "platform", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select platform" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "amazon", children: "Amazon FBA" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "walmart", children: "Walmart WFS" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "tiktok", children: "TikTok Shop" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "other", children: "Other" })
            ] })
          ] }),
          platform === "other" && /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Enter platform name",
              value: otherPlatform,
              onChange: (e) => setOtherPlatform(e.target.value),
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "shipmentType", children: "Shipment Type *" }),
          /* @__PURE__ */ jsxs(Select, { value: shipmentType, onValueChange: setShipmentType, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "shipmentType", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "carton", children: "Carton" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "pallet", children: "Pallet" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "shipmentDate", children: "Shipment Date *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "shipmentDate",
              type: "date",
              value: shipmentDate,
              onChange: (e) => setShipmentDate(e.target.value),
              min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Select Products" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Search SKUs...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-10"
              }
            )
          ] }),
          loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-primary" }) }) : filteredSKUs.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center p-8 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 mx-auto mb-2 opacity-50" }),
            /* @__PURE__ */ jsx("p", { children: "No SKUs with available inventory" })
          ] }) : /* @__PURE__ */ jsx("div", { className: "border rounded-lg max-h-96 overflow-y-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "SKU" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Product" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Available" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Quantity" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: filteredSKUs.map((sku) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: sku.client_sku }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                sku.image_url ? /* @__PURE__ */ jsx("img", { src: sku.image_url, alt: sku.title, className: "h-8 w-8 rounded object-cover" }) : /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: sku.title })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: sku.available }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  max: sku.available,
                  value: quantities[sku.id] || "",
                  onChange: (e) => handleQuantityChange(sku.id, e.target.value),
                  placeholder: "0",
                  className: "w-24 text-right"
                }
              ) })
            ] }, sku.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Notes (Optional)" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "Add any special instructions or requirements...",
              rows: 3
            }
          )
        ] }),
        selectedCount > 0 && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-muted rounded-lg space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Request Summary" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            selectedCount,
            " SKU",
            selectedCount !== 1 ? "s" : "",
            " • ",
            totalUnits,
            " total units • ",
            shipmentType === "carton" ? "Carton" : "Pallet",
            " shipment"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: submitting, children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: submitting || selectedCount === 0 || !platform, children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Submitting..."
        ] }) : "Submit Request" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!overRequestWarning, onOpenChange: () => setOverRequestWarning(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Quantity Exceeds Available Inventory" }),
      /* @__PURE__ */ jsxs(AlertDialogDescription, { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "You requested ",
          /* @__PURE__ */ jsx("strong", { children: overRequestWarning?.requested }),
          " units of",
          " ",
          /* @__PURE__ */ jsx("strong", { children: overRequestWarning?.skuName }),
          ", but only",
          " ",
          /* @__PURE__ */ jsx("strong", { children: overRequestWarning?.available }),
          " are available."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Are you sure you want to proceed?" })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => {
              if (overRequestWarning) {
                setQuantities((prev) => ({
                  ...prev,
                  [overRequestWarning.skuId]: overRequestWarning.available
                }));
              }
              setOverRequestWarning(null);
            },
            children: "Modify Request"
          }
        ),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => setOverRequestWarning(null), children: "Proceed Anyway" })
      ] })
    ] }) })
  ] });
};
const ContactSupportDialog = ({ open, onOpenChange, clientId, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [issueType, setIssueType] = useState("");
  const [otherIssueText, setOtherIssueText] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const { toast } = useToast();
  useEffect(() => {
    if (open && clientId) {
      fetchClientInfo();
      setTicketId(null);
    } else {
      resetForm();
    }
  }, [open, clientId]);
  const fetchClientInfo = async () => {
    try {
      const { data, error } = await supabase.from("clients").select("email, phone_number").eq("id", clientId).single();
      if (error) throw error;
      setEmail(data.email);
      setPhone(data.phone_number || "");
    } catch (error) {
      console.error("Error fetching client info:", error);
    }
  };
  const resetForm = () => {
    setIssueType("");
    setOtherIssueText("");
    setContactMethod("");
    setMessage("");
  };
  const handleSubmit = async () => {
    if (!issueType || !message.trim() || !contactMethod) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    if (issueType === "other" && !otherIssueText.trim()) {
      toast({
        title: "Please Specify Issue Type",
        description: "Please describe the type of issue",
        variant: "destructive"
      });
      return;
    }
    setSubmitting(true);
    try {
      const { data: clientData } = await supabase.from("clients").select("company_name").eq("id", clientId).single();
      const { data: ticket, error: ticketError } = await supabase.from("support_tickets").insert({
        client_id: clientId,
        issue_category: issueType === "other" ? otherIssueText : issueType,
        preferred_contact_method: contactMethod,
        contact_email: email,
        contact_phone: phone,
        issue_description: message,
        status: "open"
      }).select().single();
      if (ticketError) throw ticketError;
      const { data: emailResult, error: emailError } = await supabase.functions.invoke("send-support-ticket-email", {
        body: {
          clientId,
          clientName: clientData?.company_name || "Client",
          email,
          phone,
          issueType,
          preferredContactMethod: contactMethod,
          message,
          otherIssueText: issueType === "other" ? otherIssueText : void 0
        }
      });
      if (emailError) {
        console.error("Email delivery error:", emailError);
        toast({
          title: "Ticket Created (Email Failed)",
          description: "Your ticket was saved but email notification failed. We'll still process your request.",
          variant: "destructive"
        });
      } else {
        const adminSent = emailResult?.adminEmailSent;
        const clientSent = emailResult?.clientEmailSent;
        if (!adminSent && !clientSent) {
          toast({
            title: "Ticket Created (Both Emails Failed)",
            description: "Your ticket was saved but email notifications failed. We'll still process your request.",
            variant: "destructive"
          });
        } else if (adminSent && !clientSent) {
          toast({
            title: "Ticket Created",
            description: "Your ticket was created, but confirmation email could not be delivered.",
            className: "bg-yellow-50 border-yellow-200 text-yellow-900"
          });
        } else if (!adminSent && clientSent) {
          toast({
            title: "Ticket Created (Admin Email Failed)",
            description: "You received confirmation but admin notification failed.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Support Ticket Created",
            description: "We'll respond shortly via your preferred contact method."
          });
        }
      }
      setTicketId(ticket.id);
      onSuccess();
      setTimeout(() => onOpenChange(false), 2e3);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Failed to Submit Ticket",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Contact Support" }) }),
    ticketId ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center space-y-4", children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "h-16 w-16 text-green-600 mx-auto" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: "Message Sent" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Your message will be sent to:" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-primary mt-2", children: "admin@westfieldprepcenter.com" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "We'll respond shortly via email." })
      ] })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Email *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: email,
                onChange: (e) => setEmail(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Phone *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: phone,
                onChange: (e) => setPhone(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "issueType", children: "Issue Type *" }),
          /* @__PURE__ */ jsxs(Select, { value: issueType, onValueChange: setIssueType, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "issueType", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select issue type" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Technical", children: "Technical" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "ASN", children: "ASN" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Integration", children: "Integration" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "SKU", children: "SKU" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Returns", children: "Returns" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Discrepancies", children: "Discrepancies" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Shipping", children: "Shipping" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Shipment Creation", children: "Shipment Creation" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Billing", children: "Billing" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "other", children: "Other" })
            ] })
          ] }),
          issueType === "other" && /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Please specify issue type",
              value: otherIssueText,
              onChange: (e) => setOtherIssueText(e.target.value),
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "contactMethod", children: "Preferred Contact Method *" }),
          /* @__PURE__ */ jsxs(Select, { value: contactMethod, onValueChange: setContactMethod, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "contactMethod", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select contact method" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Email", children: "Email" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Phone", children: "Phone" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Text Message", children: "Text Message" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "message", children: "Message *" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "message",
              value: message,
              onChange: (e) => setMessage(e.target.value),
              placeholder: "Describe your issue...",
              rows: 6
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: submitting, children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: submitting, children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Submitting..."
        ] }) : "Submit Ticket" })
      ] })
    ] })
  ] }) });
};
const DashboardStatsRow = ({ salesToday, shippedToday, pendingAction, loading }) => {
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  useEffect(() => {
    const fetchInvoice = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: client } = await supabase.from("clients").select("id").eq("user_id", user.id).single();
      if (client) {
        const { data: bill } = await supabase.from("bills").select("id").eq("client_id", client.id).eq("status", "open").maybeSingle();
        if (bill) {
          const { data: billItems } = await supabase.from("bill_items").select("qty_decimal, unit_price_cents").eq("bill_id", bill.id);
          const subtotal = (billItems || []).reduce((sum, item) => {
            return sum + Number(item.qty_decimal) * item.unit_price_cents;
          }, 0);
          const { data: payments } = await supabase.from("payments").select("amount_cents").eq("bill_id", bill.id);
          const totalPayments = (payments || []).reduce((sum, p) => sum + p.amount_cents, 0);
          const outstanding = subtotal - totalPayments;
          setInvoiceTotal(outstanding / 100);
        } else {
          setInvoiceTotal(0);
        }
      }
    };
    fetchInvoice();
  }, []);
  const stats = [
    {
      title: "Sales Today",
      value: loading ? "..." : salesToday.toString(),
      icon: Package,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      borderColor: "border-orange-100 dark:border-orange-900"
    },
    {
      title: "Shipped Today",
      value: loading ? "..." : shippedToday.toString(),
      icon: Truck,
      iconColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-100 dark:border-green-900"
    },
    {
      title: "Pending Action",
      value: loading ? "..." : pendingAction.toString(),
      icon: AlertCircle,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      borderColor: "border-amber-100 dark:border-amber-900"
    },
    {
      title: "Current Invoice",
      value: loading ? "..." : `$${invoiceTotal.toFixed(2)}`,
      icon: DollarSign,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-100 dark:border-blue-900"
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: stats.map((stat) => /* @__PURE__ */ jsx(Card, { className: "p-8 hover:shadow-md transition-all", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: `p-4 ${stat.bgColor} border ${stat.borderColor} rounded-lg`, children: /* @__PURE__ */ jsx(stat.icon, { className: `h-8 w-8 ${stat.iconColor}` }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-muted-foreground mb-1", children: stat.title }),
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold tracking-tight", children: stat.value })
    ] })
  ] }) }, stat.title)) });
};
const OperationalAlertsPanel = ({
  discrepancies,
  returns,
  lowStock,
  onReviewClick,
  loading
}) => {
  const [activeTab, setActiveTab] = useState("discrepancies");
  return /* @__PURE__ */ jsx(Card, { className: "overflow-hidden min-h-[280px]", children: /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
    /* @__PURE__ */ jsxs(TabsList, { className: "w-full justify-start rounded-none border-b bg-muted/50 p-0 h-auto", children: [
      /* @__PURE__ */ jsxs(
        TabsTrigger,
        {
          value: "discrepancies",
          className: "rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-background gap-2 px-6 py-4",
          children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-amber-600" }),
            "Discrepancies",
            discrepancies.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-1", children: discrepancies.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        TabsTrigger,
        {
          value: "returns",
          className: "rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-background gap-2 px-6 py-4",
          children: [
            /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4 text-orange-600" }),
            "Returns",
            returns.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-1", children: returns.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        TabsTrigger,
        {
          value: "lowStock",
          className: "rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-background gap-2 px-6 py-4",
          children: [
            /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-red-600" }),
            "Low Stock",
            lowStock.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-1", children: lowStock.length })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(TabsContent, { value: "discrepancies", className: "m-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "Loading..." }) : discrepancies.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-muted-foreground", children: "No discrepancies found" }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 border-b", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Ref ID" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Type" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Issue" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: discrepancies.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/50 transition-colors", children: [
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 font-medium", children: [
          item.client_sku || item.sku_id,
          item.asn_number && /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-xs ml-1", children: [
            "(",
            item.asn_number,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-muted-foreground capitalize", children: item.discrepancy_type?.replace("_", " ") || item.source_type }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs", children: item.discrepancy_type === "damaged" ? `${item.quantity} damaged units` : `${item.quantity} missing units` }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => onReviewClick(item),
            children: "Resolve"
          }
        ) })
      ] }, item.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsx(TabsContent, { value: "returns", className: "m-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "Loading..." }) : returns.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-muted-foreground", children: "No returns found" }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 border-b", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Return ID" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Product" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Reason" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: returns.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/50 transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium", children: item.id }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-muted-foreground", children: item.title || item.client_sku }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-muted-foreground capitalize", children: item.discrepancy_type?.replace("_", " ") }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => onReviewClick(item),
            children: "Resolve"
          }
        ) })
      ] }, item.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsx(TabsContent, { value: "lowStock", className: "m-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-muted-foreground", children: "Loading..." }) : lowStock.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-muted-foreground", children: "No low stock items" }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 border-b", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "SKU" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Product Name" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Available" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: lowStock.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/50 transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium", children: item.client_sku }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-muted-foreground", children: item.title }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-red-600 dark:text-red-400 font-bold", children: item.available }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => onReviewClick(item),
            children: "View"
          }
        ) })
      ] }, item.sku_id)) })
    ] }) }) })
  ] }) });
};
const useChartData = (clientId, timeframe) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (clientId) {
      fetchChartData();
    }
  }, [clientId, timeframe]);
  const fetchChartData = async () => {
    setLoading(true);
    try {
      let startDate;
      let endDate = endOfDay(/* @__PURE__ */ new Date());
      let days = 0;
      let groupBy = "day";
      switch (timeframe) {
        case "7days":
          days = 7;
          startDate = startOfDay(subDays(endDate, days - 1));
          break;
        case "30days":
          days = 30;
          startDate = startOfDay(subDays(endDate, days - 1));
          break;
        case "90days":
          days = 90;
          startDate = startOfDay(subDays(endDate, days - 1));
          break;
        case "mtd":
          startDate = startOfMonth(endDate);
          days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
          break;
        case "ytd":
          startDate = startOfYear(endDate);
          days = 12;
          groupBy = "month";
          break;
        default:
          days = 7;
          startDate = startOfDay(subDays(endDate, days - 1));
      }
      const { data: ordersData } = await supabase.from("shopify_orders").select("created_at_shopify").eq("client_id", clientId).gte("created_at_shopify", startDate.toISOString()).lte("created_at_shopify", endDate.toISOString());
      const { data: receivedData } = await supabase.from("inventory_ledger").select("ts, qty_delta").eq("client_id", clientId).eq("transaction_type", "RECEIPT").gte("ts", startDate.toISOString()).lte("ts", endDate.toISOString());
      const { data: shippedData } = await supabase.from("inventory_ledger").select("ts, qty_delta").eq("client_id", clientId).in("transaction_type", ["SALE_DECREMENT", "TRANSFER"]).gte("ts", startDate.toISOString()).lte("ts", endDate.toISOString());
      const orderVolume = [];
      const unitsReceived = [];
      const unitsShipped = [];
      if (groupBy === "month") {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = endDate.getMonth();
        for (let i = 0; i <= currentMonth; i++) {
          const monthStart = new Date(endDate.getFullYear(), i, 1);
          const monthEnd = new Date(endDate.getFullYear(), i + 1, 0, 23, 59, 59, 999);
          const ordersCount = ordersData?.filter((o) => {
            const orderDate = new Date(o.created_at_shopify);
            return orderDate >= monthStart && orderDate <= monthEnd;
          }).length || 0;
          const receivedCount = receivedData?.filter((r) => {
            const recDate = new Date(r.ts);
            return recDate >= monthStart && recDate <= monthEnd;
          }).reduce((sum, r) => sum + r.qty_delta, 0) || 0;
          const shippedCount = Math.abs(shippedData?.filter((s) => {
            const shipDate = new Date(s.ts);
            return shipDate >= monthStart && shipDate <= monthEnd;
          }).reduce((sum, s) => sum + s.qty_delta, 0) || 0);
          orderVolume.push({ name: monthNames[i], value: ordersCount, date: monthStart });
          unitsReceived.push({ name: monthNames[i], value: receivedCount, date: monthStart });
          unitsShipped.push({ name: monthNames[i], value: shippedCount, date: monthStart });
        }
      } else {
        for (let i = 0; i < days; i++) {
          const date = addDays(startDate, i);
          const dayStart = startOfDay(date);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);
          let label = "";
          if (timeframe === "7days") {
            label = format(date, "EEE");
          } else if (timeframe === "90days") {
            label = format(date, "MMM d");
          } else if (timeframe === "mtd") {
            label = format(date, "MMM d");
          } else {
            label = format(date, "MMM d");
          }
          const ordersCount = ordersData?.filter((o) => {
            const orderDate = new Date(o.created_at_shopify);
            return orderDate >= dayStart && orderDate <= dayEnd;
          }).length || 0;
          const receivedCount = receivedData?.filter((r) => {
            const recDate = new Date(r.ts);
            return recDate >= dayStart && recDate <= dayEnd;
          }).reduce((sum, r) => sum + r.qty_delta, 0) || 0;
          const shippedCount = Math.abs(shippedData?.filter((s) => {
            const shipDate = new Date(s.ts);
            return shipDate >= dayStart && shipDate <= dayEnd;
          }).reduce((sum, s) => sum + s.qty_delta, 0) || 0);
          orderVolume.push({ name: label, value: ordersCount, date: dayStart });
          unitsReceived.push({ name: label, value: receivedCount, date: dayStart });
          unitsShipped.push({ name: label, value: shippedCount, date: dayStart });
        }
      }
      setData({ orderVolume, unitsReceived, unitsShipped, timeframe });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setData({
        orderVolume: [],
        unitsReceived: [],
        unitsShipped: [],
        timeframe
      });
    } finally {
      setLoading(false);
    }
  };
  return { data, loading };
};
const datasetLabels = {
  orderVolume: "Order Volume",
  unitsReceived: "Units Received",
  unitsShipped: "Units Shipped"
};
const timeframeLabels = {
  "7days": "Last 7 Days",
  "30days": "Last 30 Days",
  "90days": "Last 90 Days",
  "mtd": "Month-to-Date",
  "ytd": "Year-to-Date"
};
const OrderVolumeChart = ({ clientId }) => {
  const [activeDataset, setActiveDataset] = useState("orderVolume");
  const [timeframe, setTimeframe] = useState("7days");
  const { data, loading } = useChartData(clientId, timeframe);
  const currentData = data?.[activeDataset] || [];
  const getXAxisTicks = () => {
    if (timeframe === "mtd" && currentData.length > 0) {
      return currentData.filter((_, i) => i % 2 === 0).map((d) => d.name);
    } else if (timeframe === "30days" && currentData.length > 0) {
      const step = Math.max(1, Math.floor(currentData.length / 15));
      return currentData.filter((_, i) => i % step === 0).map((d) => d.name);
    } else if (timeframe === "90days" && currentData.length > 0) {
      const step = Math.max(1, Math.floor(currentData.length / 15));
      return currentData.filter((_, i) => i % step === 0).map((d) => d.name);
    }
    return void 0;
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Performance Metrics" }),
      /* @__PURE__ */ jsxs(Select, { value: timeframe, onValueChange: (value) => setTimeframe(value), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[160px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "7days", children: "Last 7 Days" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "30days", children: "Last 30 Days" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "90days", children: "Last 90 Days" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "mtd", children: "Month-to-Date" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "ytd", children: "Year-to-Date" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: activeDataset === "orderVolume" ? "default" : "outline",
            onClick: () => setActiveDataset("orderVolume"),
            className: "flex-1",
            children: "Order Volume"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: activeDataset === "unitsReceived" ? "default" : "outline",
            onClick: () => setActiveDataset("unitsReceived"),
            className: "flex-1",
            children: "Units Received"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: activeDataset === "unitsShipped" ? "default" : "outline",
            onClick: () => setActiveDataset("unitsShipped"),
            className: "flex-1",
            children: "Units Shipped"
          }
        )
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "h-[350px] flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) }) : /* @__PURE__ */ jsx("div", { className: "h-[350px] w-full min-h-[350px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", minHeight: 350, children: /* @__PURE__ */ jsxs(AreaChart, { data: currentData, children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorValue", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "hsl(var(--primary))", stopOpacity: 0.3 }),
          /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "hsl(var(--primary))", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
        /* @__PURE__ */ jsx(
          XAxis,
          {
            dataKey: "name",
            stroke: "hsl(var(--muted-foreground))",
            fontSize: 12,
            ticks: getXAxisTicks()
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            stroke: "hsl(var(--muted-foreground))",
            fontSize: 12
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            contentStyle: {
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px"
            },
            labelStyle: { color: "hsl(var(--foreground))" }
          }
        ),
        /* @__PURE__ */ jsx(
          Area,
          {
            type: "monotone",
            dataKey: "value",
            stroke: "hsl(var(--primary))",
            strokeWidth: 2,
            fillOpacity: 1,
            fill: "url(#colorValue)"
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground text-center", children: [
        "Showing ",
        datasetLabels[activeDataset],
        " - ",
        timeframeLabels[timeframe]
      ] })
    ] })
  ] });
};
const analyticsCache = /* @__PURE__ */ new Map();
const CACHE_TTL = 6e4;
const useAnalytics = (clientId, dateRange) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const requestIdRef = useRef(0);
  useEffect(() => {
    if (clientId) {
      fetchAnalytics();
    }
  }, [clientId, dateRange.start.getTime(), dateRange.end.getTime()]);
  const fetchAnalytics = async () => {
    if (!clientId || !dateRange.start || !dateRange.end) {
      setLoading(false);
      return;
    }
    const startMs = dateRange.start.getTime();
    const endMs = dateRange.end.getTime();
    const cacheKey = `${clientId}:${startMs}-${endMs}`;
    const cached = analyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setData(cached.data);
      setLoading(false);
      return;
    }
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;
    setLoading(true);
    try {
      const { start, end } = dateRange;
      const [
        ordersResult,
        shippedData,
        receivedData,
        returnsData,
        discrepanciesData,
        clientData,
        lowStockData,
        inventoryData,
        topPerformingData
      ] = await Promise.all([
        // Orders count
        supabase.from("shopify_orders").select("*", { count: "exact", head: true }).eq("client_id", clientId).gte("created_at_shopify", start.toISOString()).lte("created_at_shopify", end.toISOString()),
        // Units shipped
        supabase.from("inventory_ledger").select("qty_delta").eq("client_id", clientId).in("transaction_type", ["SALE_DECREMENT", "TRANSFER"]).gte("ts", start.toISOString()).lte("ts", end.toISOString()),
        // Units received
        supabase.from("inventory_ledger").select("qty_delta").eq("client_id", clientId).in("transaction_type", ["RECEIPT", "ADJUSTMENT_PLUS"]).gte("ts", start.toISOString()).lte("ts", end.toISOString()),
        // Returns
        supabase.from("inventory_ledger").select("qty_delta").eq("client_id", clientId).eq("transaction_type", "RETURN").gte("ts", start.toISOString()).lte("ts", end.toISOString()),
        // Discrepancies (ALL statuses created within date range - cumulative metric)
        supabase.from("damaged_item_decisions").select("discrepancy_type, source_type, quantity, status").eq("client_id", clientId).in("status", ["pending", "submitted", "processed", "closed"]).gte("created_at", start.toISOString()).lte("created_at", end.toISOString()),
        // Client threshold
        supabase.from("clients").select("default_low_stock_threshold").eq("id", clientId).single(),
        // Low stock - fetch inventory summary
        supabase.from("inventory_summary").select("sku_id, client_sku, available").eq("client_id", clientId),
        // Current inventory
        supabase.from("inventory_summary").select("available").eq("client_id", clientId),
        // Top performing SKUs
        supabase.from("inventory_ledger").select("sku_id, qty_delta, skus(client_sku, title, image_url)").eq("client_id", clientId).in("transaction_type", ["SALE_DECREMENT", "TRANSFER"]).gte("ts", start.toISOString()).lte("ts", end.toISOString())
      ]);
      const ordersCount = ordersResult.count;
      const unitsShipped = Math.abs(
        shippedData.data?.reduce((sum, row) => sum + (row.qty_delta || 0), 0) || 0
      );
      const unitsReceived = receivedData.data?.reduce((sum, row) => sum + (row.qty_delta || 0), 0) || 0;
      const returns = returnsData.data?.reduce((sum, row) => sum + (row.qty_delta || 0), 0) || 0;
      const discrepancies = {
        total: discrepanciesData.data?.length || 0,
        receiving: {
          damaged: {
            count: discrepanciesData.data?.filter((d) => d.source_type === "receiving" && d.discrepancy_type === "damaged").length || 0,
            total: discrepanciesData.data?.filter((d) => d.source_type === "receiving" && d.discrepancy_type === "damaged").reduce((sum, d) => sum + d.quantity, 0) || 0
          },
          missing: {
            count: discrepanciesData.data?.filter((d) => d.source_type === "receiving" && d.discrepancy_type === "missing").length || 0,
            total: discrepanciesData.data?.filter((d) => d.source_type === "receiving" && d.discrepancy_type === "missing").reduce((sum, d) => sum + d.quantity, 0) || 0
          }
        },
        return: {
          damaged: {
            count: discrepanciesData.data?.filter((d) => d.source_type === "return" && d.discrepancy_type === "damaged").length || 0,
            total: discrepanciesData.data?.filter((d) => d.source_type === "return" && d.discrepancy_type === "damaged").reduce((sum, d) => sum + d.quantity, 0) || 0
          },
          missing: {
            count: discrepanciesData.data?.filter((d) => d.source_type === "return" && d.discrepancy_type === "missing").length || 0,
            total: discrepanciesData.data?.filter((d) => d.source_type === "return" && d.discrepancy_type === "missing").reduce((sum, d) => sum + d.quantity, 0) || 0
          }
        }
      };
      const defaultThreshold = clientData.data?.default_low_stock_threshold || 10;
      const inventorySkuIds = lowStockData.data?.map((i) => i.sku_id) || [];
      let skuDetailsMap = /* @__PURE__ */ new Map();
      if (inventorySkuIds.length > 0) {
        const { data: skuDetails } = await supabase.from("skus").select("id, title, image_url, low_stock_threshold").in("id", inventorySkuIds);
        skuDetails?.forEach((sku) => {
          skuDetailsMap.set(sku.id, {
            title: sku.title || "",
            image_url: sku.image_url,
            low_stock_threshold: sku.low_stock_threshold
          });
        });
      }
      const lowStock = lowStockData.data?.map((item) => {
        const skuDetail = skuDetailsMap.get(item.sku_id);
        const threshold = skuDetail?.low_stock_threshold || defaultThreshold;
        return {
          sku_id: item.sku_id,
          client_sku: item.client_sku || "",
          title: skuDetail?.title || "",
          image_url: skuDetail?.image_url || null,
          available: item.available || 0,
          threshold,
          last_activity: null
        };
      }).filter((item) => item.available < item.threshold) || [];
      const currentInventory = inventoryData.data?.reduce((sum, row) => sum + (row.available || 0), 0) || 0;
      const skuShipments = /* @__PURE__ */ new Map();
      topPerformingData.data?.forEach((item) => {
        const current = skuShipments.get(item.sku_id) || 0;
        skuShipments.set(item.sku_id, current + Math.abs(item.qty_delta));
      });
      const topPerforming = Array.from(skuShipments.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([sku_id, units_shipped]) => {
        const skuData = topPerformingData.data?.find((d) => d.sku_id === sku_id)?.skus;
        return {
          sku_id,
          client_sku: skuData?.client_sku || "",
          title: skuData?.title || "",
          image_url: skuData?.image_url || null,
          units_shipped
        };
      });
      if (currentRequestId !== requestIdRef.current) {
        return;
      }
      const analyticsData = {
        orders: ordersCount || 0,
        unitsShipped,
        unitsReceived,
        returns,
        discrepancies,
        lowStock,
        currentInventory,
        topPerforming
      };
      analyticsCache.set(cacheKey, { data: analyticsData, timestamp: Date.now() });
      setData(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, refetch: fetchAnalytics };
};
const ClientAnalyticsDashboard = ({ clientId }) => {
  const queryClient = useQueryClient();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [showASNDialog, setShowASNDialog] = useState(false);
  const [showShipmentRequestDialog, setShowShipmentRequestDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const todayRange = useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    return {
      start: startOfDay(now),
      end: endOfDay(now)
    };
  }, []);
  const shipmentIssues = useClientIssues(clientId, "receiving");
  const returnIssues = useClientIssues(clientId, "return");
  const todayData = useAnalytics(clientId, todayRange);
  const lowStockIssues = useMemo(
    () => todayData.data?.lowStock.map((item) => ({
      id: item.sku_id,
      client_id: clientId,
      sku_id: item.sku_id,
      asn_id: "",
      quantity: item.available,
      discrepancy_type: "low_stock",
      source_type: "inventory",
      client_sku: item.client_sku,
      title: item.title,
      image_url: item.image_url
    })) || [],
    [todayData.data?.lowStock, clientId]
  );
  const handleReviewIssue = (issue) => {
    setSelectedIssue(issue);
    if (issue.discrepancy_type === "low_stock") {
      setDialogType("sku");
    } else {
      setDialogType(issue.discrepancy_type === "damaged" ? "damaged" : "missing");
    }
  };
  const handleCloseDialog = () => {
    setDialogType(null);
    setSelectedIssue(null);
    shipmentIssues.refetch();
    returnIssues.refetch();
  };
  const totalPendingActions = useMemo(
    () => shipmentIssues.issues.length + returnIssues.issues.length + lowStockIssues.length,
    [shipmentIssues.issues.length, returnIssues.issues.length, lowStockIssues.length]
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsx(
      DashboardStatsRow,
      {
        salesToday: todayData.data?.orders || 0,
        shippedToday: todayData.data?.unitsShipped || 0,
        pendingAction: totalPendingActions,
        loading: todayData.loading
      }
    ),
    /* @__PURE__ */ jsx(OrderVolumeChart, { clientId }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx(
        OperationalAlertsPanel,
        {
          discrepancies: shipmentIssues.issues,
          returns: returnIssues.issues,
          lowStock: lowStockIssues,
          onReviewClick: handleReviewIssue,
          loading: shipmentIssues.loading || returnIssues.loading || todayData.loading
        }
      ) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        QuickActionsCard,
        {
          onAddASN: () => setShowASNDialog(true),
          onRequestShipment: () => setShowShipmentRequestDialog(true),
          onContactSupport: () => setShowSupportDialog(true)
        }
      ) })
    ] }),
    dialogType === "damaged" && selectedIssue && /* @__PURE__ */ jsx(
      DamagedItemReviewDialog,
      {
        open: true,
        onOpenChange: (open) => !open && handleCloseDialog(),
        discrepancy: {
          id: selectedIssue.id,
          client_id: selectedIssue.client_id,
          sku_id: selectedIssue.sku_id,
          asn_id: selectedIssue.asn_id,
          asn_number: selectedIssue.asn_number || "",
          client_sku: selectedIssue.client_sku || "",
          title: selectedIssue.title || "",
          damaged_qty: selectedIssue.quantity,
          image_url: selectedIssue.image_url,
          qc_photo_urls: selectedIssue.qc_photo_urls
        },
        onSuccess: handleCloseDialog
      }
    ),
    dialogType === "missing" && selectedIssue && /* @__PURE__ */ jsx(
      MissingItemReviewDialog,
      {
        open: true,
        onOpenChange: (open) => !open && handleCloseDialog(),
        discrepancy: {
          id: selectedIssue.id,
          client_id: selectedIssue.client_id,
          sku_id: selectedIssue.sku_id,
          asn_id: selectedIssue.asn_id,
          asn_number: selectedIssue.asn_number || "",
          client_sku: selectedIssue.client_sku || "",
          title: selectedIssue.title || "",
          missing_qty: selectedIssue.quantity,
          image_url: selectedIssue.image_url
        },
        onSuccess: handleCloseDialog
      }
    ),
    dialogType === "sku" && selectedIssue && /* @__PURE__ */ jsx(
      SKUDetailDialog,
      {
        open: true,
        onOpenChange: (open) => !open && handleCloseDialog(),
        skuId: selectedIssue.sku_id,
        clientId
      }
    ),
    /* @__PURE__ */ jsx(
      ASNFormDialog,
      {
        open: showASNDialog,
        onOpenChange: setShowASNDialog,
        onSuccess: () => {
          setShowASNDialog(false);
          queryClient.invalidateQueries({ queryKey: ["asns", clientId] });
        },
        prefillData: {
          client_id: clientId
        }
      }
    ),
    /* @__PURE__ */ jsx(
      RequestShipmentDialog,
      {
        open: showShipmentRequestDialog,
        onOpenChange: setShowShipmentRequestDialog,
        clientId,
        onSuccess: () => {
          setShowShipmentRequestDialog(false);
        }
      }
    ),
    /* @__PURE__ */ jsx(
      ContactSupportDialog,
      {
        open: showSupportDialog,
        onOpenChange: setShowSupportDialog,
        clientId,
        onSuccess: () => {
          setShowSupportDialog(false);
        }
      }
    )
  ] });
};
export {
  ClientAnalyticsDashboard
};
