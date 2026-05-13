import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { s as supabase, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, o as useAuth, B as Button } from "../main.mjs";
import { useQuery } from "@tanstack/react-query";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
import { Package, Box, ExternalLink, Truck, X, Search } from "lucide-react";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { format, startOfDay, parseISO, endOfDay } from "date-fns";
import { S as StatusBadge } from "./status-badge-D65vJr6c.js";
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
import "@radix-ui/react-label";
import "@radix-ui/react-select";
const useOutboundShipments = (clientId) => {
  return useQuery({
    queryKey: ["outbound-shipments", clientId],
    queryFn: async () => {
      let query = supabase.from("outbound_shipments").select(`
          *,
          clients(company_name)
        `).order("created_at", { ascending: false });
      if (clientId && clientId !== "all") {
        query = query.eq("client_id", clientId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1e3
  });
};
const useOutboundShipment = (shipmentId) => {
  return useQuery({
    queryKey: ["outbound-shipment", shipmentId],
    queryFn: async () => {
      const { data, error } = await supabase.from("outbound_shipments").select(`
          *,
          clients(company_name),
          outbound_shipment_boxes(*),
          outbound_shipment_lines(
            *,
            skus(client_sku, title, image_url)
          )
        `).eq("id", shipmentId).single();
      if (error) throw error;
      return data;
    },
    staleTime: 1 * 60 * 1e3,
    enabled: !!shipmentId
  });
};
const getTrackingUrl = (carrier, trackingNumber) => {
  const carriers = {
    "UPS": `https://www.ups.com/track?tracknum=${trackingNumber}`,
    "FedEx": `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    "USPS": `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
  };
  return carriers[carrier] || "#";
};
function formatDestination$1(destination) {
  const normalizations = {
    "amazon_fba": "Amazon FBA",
    "walmart_wfs": "Walmart WFS",
    "direct_to_customer": "Direct to Customer",
    "shopify": "Shopify",
    "tiktok_shop": "TikTok Shop"
  };
  const key = destination?.toLowerCase().replace(/\s+/g, "_");
  return normalizations[key] || destination?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "-";
}
const ShipmentDetailDialog = ({ open, onOpenChange, shipmentId }) => {
  const { data: shipment, isLoading } = useOutboundShipment(shipmentId);
  if (isLoading || !shipment) {
    return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-4xl", children: /* @__PURE__ */ jsx("div", { children: "Loading..." }) }) });
  }
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-5 w-5" }),
      "Shipment Details: ",
      shipment.shipment_number
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Client" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: shipment.clients?.company_name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsx(Badge, { variant: shipment.shipment_status === "shipped" ? "default" : "secondary", children: shipment.shipment_status })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Destination" }),
          /* @__PURE__ */ jsx("p", { children: formatDestination$1(shipment.destination_type) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Split Type" }),
          /* @__PURE__ */ jsx("p", { className: "capitalize", children: shipment.shipment_split_type.replace("_", " ") })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Total Units" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: shipment.total_units })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Total Boxes" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: shipment.total_boxes })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Created" }),
          /* @__PURE__ */ jsx("p", { children: format(new Date(shipment.created_at), "MMM d, yyyy 'at' h:mm a") })
        ] }),
        shipment.shipped_at && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Shipped" }),
          /* @__PURE__ */ jsx("p", { children: format(new Date(shipment.shipped_at), "MMM d, yyyy 'at' h:mm a") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsx(Box, { className: "h-5 w-5" }),
          "Boxes"
        ] }),
        /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Box #" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Dimensions (L×W×H)" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Weight" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Carrier" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Tracking" }),
            /* @__PURE__ */ jsx(TableHead, { children: "FBA Shipment ID" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Destination FC" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: shipment.outbound_shipment_boxes?.map((box) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxs(TableCell, { children: [
              "#",
              box.box_number
            ] }),
            /* @__PURE__ */ jsx(TableCell, { children: box.length_in && box.width_in && box.height_in ? `${box.length_in}×${box.width_in}×${box.height_in} in` : "-" }),
            /* @__PURE__ */ jsx(TableCell, { children: box.weight_lbs ? `${box.weight_lbs} lbs` : "-" }),
            /* @__PURE__ */ jsx(TableCell, { children: box.carrier || "-" }),
            /* @__PURE__ */ jsx(TableCell, { children: box.tracking_number && box.carrier ? /* @__PURE__ */ jsxs(
              "a",
              {
                href: getTrackingUrl(box.carrier, box.tracking_number),
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-1 text-primary hover:underline",
                children: [
                  box.tracking_number,
                  /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
                ]
              }
            ) : box.tracking_number || "-" }),
            /* @__PURE__ */ jsx(TableCell, { children: box.fba_shipment_id || "-" }),
            /* @__PURE__ */ jsx(TableCell, { children: box.fba_destination_fc || "-" })
          ] }, box.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5" }),
          "SKUs"
        ] }),
        /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "SKU" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Title" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Quantity" }),
            shipment.shipment_split_type === "amazon_optimized" && /* @__PURE__ */ jsx(TableHead, { children: "Box #" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: shipment.outbound_shipment_lines?.map((line) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono", children: line.skus?.client_sku }),
            /* @__PURE__ */ jsx(TableCell, { children: line.skus?.title }),
            /* @__PURE__ */ jsx(TableCell, { children: line.quantity }),
            shipment.shipment_split_type === "amazon_optimized" && /* @__PURE__ */ jsx(TableCell, { children: line.box_id ? `#${shipment.outbound_shipment_boxes?.find((b) => b.id === line.box_id)?.box_number}` : "-" })
          ] }, line.id)) })
        ] })
      ] }),
      shipment.notes && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Notes" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: shipment.notes })
      ] })
    ] })
  ] }) });
};
function formatDestination(destination) {
  const normalizations = {
    "amazon_fba": "Amazon FBA",
    "walmart_wfs": "Walmart WFS",
    "direct_to_customer": "Direct to Customer",
    "shopify": "Shopify",
    "tiktok_shop": "TikTok Shop"
  };
  const key = destination?.toLowerCase().replace(/\s+/g, "_");
  return normalizations[key] || destination?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "-";
}
const ClientShipmentsTab = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceFilter, setMarketplaceFilter] = useState("all");
  const [skuFilter, setSkuFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [clientId, setClientId] = useState("");
  useEffect(() => {
    const fetchClientId = async () => {
      if (!user?.id) return;
      const { data } = await supabase.from("clients").select("id").eq("user_id", user.id).single();
      if (data) setClientId(data.id);
    };
    fetchClientId();
  }, [user?.id]);
  const { data: shipments, isLoading } = useOutboundShipments(clientId);
  const shippedShipments = shipments?.filter((s) => s.shipment_status === "shipped");
  const hasActiveFilters = searchQuery || marketplaceFilter !== "all" || skuFilter || dateFrom || dateTo;
  const clearFilters = () => {
    setSearchQuery("");
    setMarketplaceFilter("all");
    setSkuFilter("");
    setDateFrom("");
    setDateTo("");
  };
  const filteredShipments = useMemo(() => {
    if (!shippedShipments) return [];
    return shippedShipments.filter((shipment) => {
      if (searchQuery && !shipment.shipment_number.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (marketplaceFilter !== "all") {
        const shipmentMarketplace = shipment.marketplace;
        if (shipmentMarketplace !== marketplaceFilter) return false;
      }
      if (skuFilter) {
        const lines = shipment.outbound_shipment_lines || [];
        const hasMatchingSku = lines.some(
          (line) => line.skus?.client_sku?.toLowerCase().includes(skuFilter.toLowerCase())
        );
        if (!hasMatchingSku) return false;
      }
      if (dateFrom || dateTo) {
        const shippedDate = shipment.shipped_at ? new Date(shipment.shipped_at) : null;
        if (!shippedDate) return false;
        if (dateFrom && shippedDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && shippedDate > endOfDay(parseISO(dateTo))) return false;
      }
      return true;
    });
  }, [shippedShipments, searchQuery, marketplaceFilter, skuFilter, dateFrom, dateTo]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-6 w-6" }),
      "My Outbound Shipments"
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
                placeholder: "Shipment #...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-10 h-9"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Marketplace" }),
          /* @__PURE__ */ jsxs(Select, { value: marketplaceFilter, onValueChange: setMarketplaceFilter, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All Marketplaces" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Marketplaces" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "amazon", children: "Amazon" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "walmart", children: "Walmart" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "tiktok", children: "TikTok" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "other", children: "Other" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "SKU" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Search SKU...",
              value: skuFilter,
              onChange: (e) => setSkuFilter(e.target.value),
              className: "h-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Shipped From" }),
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
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Shipped To" }),
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
    /* @__PURE__ */ jsx("div", { className: "border rounded-lg", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Shipment #" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Shipped Date" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Marketplace" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Destination" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Total Units" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Total Boxes" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center", children: "Loading..." }) }) : filteredShipments?.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center", children: "No shipments found" }) }) : filteredShipments?.map((shipment) => {
        const marketplace = shipment.marketplace;
        const marketplaceOther = shipment.marketplace_other;
        const displayMarketplace = marketplace === "other" ? marketplaceOther : marketplace;
        return /* @__PURE__ */ jsxs(
          TableRow,
          {
            className: "cursor-pointer hover:bg-muted/50",
            onClick: () => setSelectedShipment(shipment.id),
            children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono", children: shipment.shipment_number }),
              /* @__PURE__ */ jsx(TableCell, { children: shipment.shipped_at ? format(new Date(shipment.shipped_at), "MMM d, yyyy") : "-" }),
              /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: displayMarketplace || "-" }),
              /* @__PURE__ */ jsx(TableCell, { children: formatDestination(shipment.destination_type) }),
              /* @__PURE__ */ jsx(TableCell, { children: shipment.total_units }),
              /* @__PURE__ */ jsx(TableCell, { children: shipment.total_boxes }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: "shipped" }) })
            ]
          },
          shipment.id
        );
      }) })
    ] }) }),
    selectedShipment && /* @__PURE__ */ jsx(
      ShipmentDetailDialog,
      {
        open: !!selectedShipment,
        onOpenChange: (open) => !open && setSelectedShipment(null),
        shipmentId: selectedShipment
      }
    )
  ] });
};
export {
  ClientShipmentsTab
};
