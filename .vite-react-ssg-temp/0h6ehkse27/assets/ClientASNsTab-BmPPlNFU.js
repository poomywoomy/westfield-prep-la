import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { s as supabase, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, g as DialogDescription, B as Button } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { useQuery } from "@tanstack/react-query";
import { format, startOfDay, parseISO, endOfDay } from "date-fns";
import { Package, Loader2, AlertCircle, X, Search, Eye } from "lucide-react";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DOpNgkQL.js";
import { r as resignPhotoUrls } from "./photoUtils-pehMpqiu.js";
import "class-variance-authority";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
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
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-tabs";
const useASNs = (clientId) => {
  return useQuery({
    queryKey: ["asns", clientId],
    queryFn: async () => {
      let query = supabase.from("asn_headers").select("id, asn_number, client_id, tracking_number, carrier, status, eta, created_at, received_at, closed_at").order("created_at", { ascending: false }).limit(100);
      if (clientId && clientId !== "all") {
        query = query.eq("client_id", clientId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1e3,
    // 2 minutes
    enabled: !!clientId
  });
};
function getASNStatusWithDiscrepancy(status, discrepancies) {
  if (status !== "closed") {
    const statusMap = {
      issue: { label: "Issue", className: "bg-destructive text-destructive-foreground" },
      not_received: { label: "Waiting", className: "bg-background text-foreground border border-border" },
      receiving: { label: "Receiving", className: "bg-orange-500 text-white" },
      received: { label: "Received", className: "bg-muted text-muted-foreground" }
    };
    return statusMap[status] || { label: status.replace(/_/g, " "), className: "bg-muted text-muted-foreground" };
  }
  const hasUnresolvedDiscrepancy = discrepancies.some((disc) => {
    if (disc.discrepancy_type === "missing") {
      return true;
    }
    if (disc.discrepancy_type === "damaged" && disc.decision !== "return_to_inventory") {
      return true;
    }
    return false;
  });
  if (hasUnresolvedDiscrepancy) {
    return { label: "Closed w/ Discrepancy", className: "bg-emerald-600/60 text-white" };
  }
  return { label: "Closed", className: "bg-green-700 text-white" };
}
function ClientASNDetailDialog({ open, onOpenChange, asnId }) {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(null);
  const [lines, setLines] = useState([]);
  const [discrepancies, setDiscrepancies] = useState([]);
  const [displayPhotos, setDisplayPhotos] = useState([]);
  const [returns, setReturns] = useState([]);
  useEffect(() => {
    if (open && asnId) {
      fetchASNDetails();
    }
  }, [open, asnId]);
  const fetchASNDetails = async () => {
    setLoading(true);
    try {
      const { data: headerData, error: headerError } = await supabase.from("asn_headers").select("asn_number, status, eta, received_at, created_at, notes, carrier, tracking_number, client_id").eq("id", asnId).single();
      if (headerError) throw headerError;
      setHeader(headerData);
      const { data: linesData, error: linesError } = await supabase.from("asn_lines").select(`
          id,
          expected_units,
          received_units,
          normal_units,
          damaged_units,
          missing_units,
          quarantined_units,
          skus(client_sku, title, image_url)
        `).eq("asn_id", asnId).order("created_at", { ascending: true });
      if (linesError) throw linesError;
      setLines(linesData || []);
      const { data: discData, error: discError } = await supabase.from("damaged_item_decisions").select(`
          id,
          discrepancy_type,
          quantity,
          qc_photo_urls,
          decision,
          status,
          submitted_at,
          skus(client_sku, title)
        `).eq("asn_id", asnId).order("created_at", { ascending: false });
      if (discError) throw discError;
      setDiscrepancies(discData || []);
      if (headerData?.client_id) {
        const { data: returnsData, error: returnsError } = await supabase.from("shopify_returns").select("id, shopify_return_id, order_number, status, return_reason, expected_qty, processed_qty, created_at_shopify, synced_at").eq("client_id", headerData.client_id).order("synced_at", { ascending: false }).limit(50);
        if (!returnsError && returnsData) {
          setReturns(returnsData);
        }
      }
      const allPhotos = [];
      (discData || []).forEach((disc) => {
        if (disc.qc_photo_urls) {
          allPhotos.push(...disc.qc_photo_urls);
        }
      });
      if (allPhotos.length > 0) {
        const signedPhotos = await resignPhotoUrls(allPhotos);
        setDisplayPhotos(signedPhotos);
      }
    } catch (error) {
      console.error("Error fetching ASN details:", error);
    } finally {
      setLoading(false);
    }
  };
  const getStatusBadge = (status) => {
    const statusConfig = getASNStatusWithDiscrepancy(status, discrepancies);
    return /* @__PURE__ */ jsx(Badge, { className: statusConfig.className, children: statusConfig.label });
  };
  const getLineStatus = (line) => {
    const received = line.received_units || 0;
    const expected = line.expected_units;
    const damaged = line.damaged_units || 0;
    const missing = line.missing_units || 0;
    if (received === 0) return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Pending" });
    if (damaged > 0 || missing > 0) return /* @__PURE__ */ jsx(Badge, { className: "bg-orange-500 text-white", children: "Issues" });
    if (received === expected) return /* @__PURE__ */ jsx(Badge, { className: "bg-green-600 text-white", children: "Complete" });
    return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Partial" });
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-6xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-5 w-5" }),
        "ASN Details: ",
        header?.asn_number || "...",
        header && getStatusBadge(header.status)
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "sr-only", children: "View ASN details including SKUs and QC photos" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : !header ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Failed to load ASN details" })
    ] }) : /* @__PURE__ */ jsxs(Tabs, { defaultValue: "overview", className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "overview", children: "Overview" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "skus", children: "SKUs" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "photos", children: "QC Photos" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "overview", className: "space-y-4", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "ASN Number" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: header.asn_number })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1", children: getStatusBadge(header.status) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "ETA" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: header.eta ? format(new Date(header.eta), "MMM d, yyyy") : "Not set" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Created" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: format(new Date(header.created_at), "MMM d, yyyy") })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Received At" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: header.received_at ? format(new Date(header.received_at), "MMM d, yyyy h:mm a") : "Not yet received" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Carrier" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: header.carrier || "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Tracking Number" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium font-mono text-sm", children: header.tracking_number || "N/A" })
        ] }),
        header.notes && /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Notes" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: header.notes })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "skus", children: lines.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No SKUs in this ASN" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { className: "min-w-[900px]", children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[120px]", children: "SKU" }),
          /* @__PURE__ */ jsx(TableHead, { className: "min-w-[150px]", children: "Title" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right w-[80px]", children: "Expected" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right w-[80px]", children: "Received" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right w-[70px]", children: "Normal" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right w-[70px]", children: "Damaged" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right w-[70px]", children: "Missing" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right w-[90px]", children: "Quarantined" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: lines.map((line) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: line.skus?.client_sku || "N/A" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: line.skus?.title || "Unknown" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: line.expected_units }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: line.received_units || 0 }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: line.normal_units || 0 }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: line.damaged_units ? /* @__PURE__ */ jsx("span", { className: "text-orange-600 font-medium", children: line.damaged_units }) : 0 }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: line.missing_units ? /* @__PURE__ */ jsx("span", { className: "text-destructive font-medium", children: line.missing_units }) : 0 }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: line.quarantined_units || 0 }),
          /* @__PURE__ */ jsx(TableCell, { children: getLineStatus(line) })
        ] }, line.id)) })
      ] }) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "photos", children: displayPhotos.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No QC photos for this ASN" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-6", children: discrepancies.filter((disc) => disc.qc_photo_urls && disc.qc_photo_urls.length > 0).map((disc) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
              disc.skus?.title || "Unknown SKU",
              " (",
              disc.skus?.client_sku || "N/A",
              ")"
            ] }),
            /* @__PURE__ */ jsxs(Badge, { className: "capitalize", children: [
              disc.discrepancy_type,
              " - ",
              disc.quantity,
              " units"
            ] })
          ] }),
          disc.decision && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Decision: ",
            /* @__PURE__ */ jsx("span", { className: "capitalize", children: disc.decision.replace(/_/g, " ") })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: disc.qc_photo_urls?.map((photoUrl, idx) => {
          const photoIndex = displayPhotos.findIndex((p) => p.includes(photoUrl.split("/").pop() || ""));
          const displayUrl = photoIndex >= 0 ? displayPhotos[photoIndex] : photoUrl;
          return /* @__PURE__ */ jsx(
            "a",
            {
              href: displayUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow",
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: displayUrl,
                  alt: `QC Photo ${idx + 1}`,
                  className: "w-full h-48 object-cover"
                }
              )
            },
            idx
          );
        }) })
      ] }) }, disc.id)) }) })
    ] })
  ] }) });
}
function getASNStatusConfig(status, hasDiscrepancy) {
  if (status !== "closed") {
    const statusMap = {
      issue: { label: "Issue", className: "bg-destructive text-destructive-foreground" },
      not_received: { label: "Waiting", className: "bg-background text-foreground border border-border" },
      receiving: { label: "Receiving", className: "bg-orange-500 text-white" },
      received: { label: "Received", className: "bg-muted text-muted-foreground" }
    };
    return statusMap[status] || { label: status.replace(/_/g, " "), className: "bg-muted text-muted-foreground" };
  }
  if (hasDiscrepancy) {
    return { label: "Closed w/ Discrepancy", className: "bg-emerald-600/60 text-white" };
  }
  return { label: "Closed", className: "bg-green-700 text-white" };
}
function ClientASNsTab({ clientId }) {
  const { data: asns, isLoading } = useASNs(clientId);
  const [selectedASNId, setSelectedASNId] = useState(null);
  const [discrepancyMap, setDiscrepancyMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  useEffect(() => {
    if (!asns || asns.length === 0) return;
    const closedAsnIds = asns.filter((asn) => asn.status === "closed").map((asn) => asn.id);
    if (closedAsnIds.length === 0) return;
    const fetchDiscrepancies = async () => {
      const { data, error } = await supabase.from("damaged_item_decisions").select("asn_id, discrepancy_type, decision").in("asn_id", closedAsnIds);
      if (error || !data) return;
      const map = {};
      data.forEach((disc) => {
        if (disc.discrepancy_type === "missing") {
          map[disc.asn_id] = true;
        }
        if (disc.discrepancy_type === "damaged" && disc.decision !== "return_to_inventory") {
          map[disc.asn_id] = true;
        }
      });
      setDiscrepancyMap(map);
    };
    fetchDiscrepancies();
  }, [asns]);
  const uniqueCarriers = useMemo(() => {
    if (!asns) return [];
    const carriers = [...new Set(asns.map((asn) => asn.carrier).filter(Boolean))];
    return carriers.sort();
  }, [asns]);
  const hasActiveFilters = searchQuery || statusFilter !== "all" || carrierFilter !== "all" || dateFrom || dateTo;
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCarrierFilter("all");
    setDateFrom("");
    setDateTo("");
  };
  const getDisplayStatus = (status, asnId) => {
    if (status !== "closed") return status || "not_received";
    const hasDiscrepancy = discrepancyMap[asnId] || false;
    return hasDiscrepancy ? "closed_with_discrepancy" : "closed";
  };
  const filteredASNs = useMemo(() => {
    if (!asns) return [];
    return asns.filter((asn) => {
      if (searchQuery && !asn.asn_number.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (statusFilter !== "all") {
        const displayStatus = getDisplayStatus(asn.status || "not_received", asn.id);
        if (statusFilter === "open") {
          if (displayStatus === "closed" || displayStatus === "closed_with_discrepancy") {
            return false;
          }
        } else if (statusFilter === "closed") {
          if (displayStatus !== "closed") return false;
        } else if (statusFilter === "closed_with_discrepancy") {
          if (displayStatus !== "closed_with_discrepancy") return false;
        }
      }
      if (carrierFilter !== "all" && asn.carrier !== carrierFilter) {
        return false;
      }
      if (dateFrom || dateTo) {
        const receivedDate = asn.received_at ? new Date(asn.received_at) : null;
        if (!receivedDate) return false;
        if (dateFrom && receivedDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && receivedDate > endOfDay(parseISO(dateTo))) return false;
      }
      return true;
    });
  }, [asns, searchQuery, statusFilter, carrierFilter, dateFrom, dateTo, discrepancyMap]);
  const getStatusBadge = (status, asnId) => {
    const hasDiscrepancy = discrepancyMap[asnId] || false;
    const config = getASNStatusConfig(status || "not_received", hasDiscrepancy);
    return /* @__PURE__ */ jsx(Badge, { className: config.className, children: config.label });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-6 w-6" }),
      "Your ASNs"
    ] }) }),
    /* @__PURE__ */ jsx(Card, { className: "bg-muted/50", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6 pb-4 px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Filters" }),
        hasActiveFilters && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: clearFilters, children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4 mr-1" }),
          "Clear"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Search" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "ASN #...",
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
              /* @__PURE__ */ jsx(SelectItem, { value: "open", children: "Open" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "closed", children: "Closed" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "closed_with_discrepancy", children: "Closed w/ Discrepancy" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Carrier" }),
          /* @__PURE__ */ jsxs(Select, { value: carrierFilter, onValueChange: setCarrierFilter, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All Carriers" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Carriers" }),
              uniqueCarriers.map((carrier) => /* @__PURE__ */ jsx(SelectItem, { value: carrier, children: carrier }, carrier))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Received From" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "date",
              value: dateFrom,
              onChange: (e) => setDateFrom(e.target.value),
              className: "h-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Received To" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "date",
              value: dateTo,
              onChange: (e) => setDateTo(e.target.value),
              className: "h-9"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: filteredASNs.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: !asns || asns.length === 0 ? "No ASNs found" : "No ASNs match your filters" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "ASN Number" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Carrier" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Tracking Number" }),
        /* @__PURE__ */ jsx(TableHead, { children: "ETA" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Received At" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Created" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: filteredASNs.map((asn) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxs(TableCell, { className: "font-medium", children: [
          "#",
          asn.asn_number
        ] }),
        /* @__PURE__ */ jsx(TableCell, { children: getStatusBadge(asn.status || "not_received", asn.id) }),
        /* @__PURE__ */ jsx(TableCell, { children: asn.carrier || "-" }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm", children: asn.tracking_number || "-" }),
        /* @__PURE__ */ jsx(TableCell, { children: asn.eta ? format(new Date(asn.eta), "MMM d, yyyy") : "-" }),
        /* @__PURE__ */ jsx(TableCell, { children: asn.received_at ? format(new Date(asn.received_at), "MMM d, yyyy h:mm a") : "-" }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: format(new Date(asn.created_at), "MMM d, yyyy") }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => setSelectedASNId(asn.id),
            children: [
              /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-1" }),
              "View"
            ]
          }
        ) })
      ] }, asn.id)) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(
      ClientASNDetailDialog,
      {
        open: !!selectedASNId,
        onOpenChange: (open) => !open && setSelectedASNId(null),
        asnId: selectedASNId || ""
      }
    )
  ] });
}
export {
  ClientASNsTab
};
