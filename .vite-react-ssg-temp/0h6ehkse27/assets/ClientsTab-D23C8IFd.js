import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { l as useToast, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, g as DialogDescription, B as Button, s as supabase, C as DialogFooter } from "../main.mjs";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription } from "./card-WfKgKW48.js";
import { Plus, Edit2, Trash2, Check, Download, Save, CheckCircle, FileText, X, Upload, Edit, RefreshCw } from "lucide-react";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea } from "./select-Cb0hy2VC.js";
import { C as Checkbox } from "./checkbox-B9ll9gww.js";
import { a as Switch } from "./SKUFormDialog-D171tANM.js";
import { w as westfieldLogo } from "./westfield-logo-pdf-YyCjah_h.js";
import jsPDF from "jspdf";
import { C as CreateOneTimeQuoteDialog } from "./CreateOneTimeQuoteDialog-guE5zHie.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { format } from "date-fns";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DOpNgkQL.js";
import { v as validatePricingDocument } from "./ASNFormDialog-B0PvkEvQ.js";
import { z } from "zod";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D7ZcK1Wa.js";
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
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-switch";
import "@radix-ui/react-tabs";
import "html5-qrcode";
import "@radix-ui/react-alert-dialog";
const CreateClientDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    estimated_units_per_month: "",
    receiving_format: "both",
    extra_prep: false,
    storage: false,
    storage_units_per_month: "",
    storage_method: "",
    admin_notes: "",
    fulfillment_services: []
  });
  const { toast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: clientData, error: clientError } = await supabase.functions.invoke("create-client", {
        body: {
          email: formData.email,
          company_name: formData.company_name,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          estimated_units_per_month: formData.estimated_units_per_month ? parseInt(formData.estimated_units_per_month) : null,
          receiving_format: formData.receiving_format,
          extra_prep: formData.extra_prep,
          storage: formData.storage,
          storage_units_per_month: formData.storage_units_per_month ? parseInt(formData.storage_units_per_month) : null,
          storage_method: formData.storage_method || null,
          admin_notes: formData.admin_notes,
          fulfillment_services: formData.fulfillment_services
        }
      });
      if (clientError) {
        console.error("Edge function error:", clientError);
        const errorMessage = clientError?.message || clientError?.context?.error || "Failed to create client. Please try again.";
        throw new Error(errorMessage);
      }
      if (!clientData?.success) {
        const errorMessage = clientData?.error || "Failed to create client";
        console.error("Client creation failed:", errorMessage);
        throw new Error(errorMessage);
      }
      toast({
        title: "Client Created Successfully",
        description: clientData?.is_new_user ? "Welcome email sent with temporary 24-hour password. Client should change password on first login." : "Client account updated successfully."
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Create client error:", error);
      toast({
        title: "Error creating client",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Create New Client" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Add a new client account with a temporary 24-hour password." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "company_name", children: "Company Name" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "company_name",
              value: formData.company_name,
              onChange: (e) => setFormData({ ...formData, company_name: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "first_name", children: "First Name *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "first_name",
              value: formData.first_name,
              onChange: (e) => setFormData({ ...formData, first_name: e.target.value }),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "last_name", children: "Last Name *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "last_name",
              value: formData.last_name,
              onChange: (e) => setFormData({ ...formData, last_name: e.target.value }),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              value: formData.email,
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "phone_number", children: "Phone Number *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "phone_number",
              value: formData.phone_number,
              onChange: (e) => setFormData({ ...formData, phone_number: e.target.value }),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "estimated_units", children: "Estimated Units/Month" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "estimated_units",
              type: "number",
              value: formData.estimated_units_per_month,
              onChange: (e) => setFormData({ ...formData, estimated_units_per_month: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "receiving_format", children: "Receiving Format" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: formData.receiving_format,
              onValueChange: (value) => setFormData({ ...formData, receiving_format: value }),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "pallets", children: "Pallets" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "cartons", children: "Cartons" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "both", children: "Both" })
                ] })
              ]
            }
          )
        ] }),
        formData.storage && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "storage_units", children: "Storage Units/Month" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "storage_units",
                type: "number",
                value: formData.storage_units_per_month,
                onChange: (e) => setFormData({ ...formData, storage_units_per_month: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "storage_method", children: "Storage Method" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.storage_method,
                onValueChange: (value) => setFormData({ ...formData, storage_method: value }),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select storage method" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "shelf_storage", children: "Shelf Storage" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "cubic_foot_storage", children: "Cubic Foot Storage" })
                  ] })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Label, { children: "Fulfillment Services" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg border", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "fba_prep",
                checked: formData.fulfillment_services.includes("fba_prep"),
                onCheckedChange: (checked) => {
                  if (checked) {
                    setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "fba_prep"] });
                  } else {
                    setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "fba_prep") });
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "fba_prep", className: "font-normal cursor-pointer", children: "FBA Prep" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "wfs_prep",
                checked: formData.fulfillment_services.includes("wfs_prep"),
                onCheckedChange: (checked) => {
                  if (checked) {
                    setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "wfs_prep"] });
                  } else {
                    setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "wfs_prep") });
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "wfs_prep", className: "font-normal cursor-pointer", children: "WFS Prep" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "tiktok_prep",
                checked: formData.fulfillment_services.includes("tiktok_prep"),
                onCheckedChange: (checked) => {
                  if (checked) {
                    setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "tiktok_prep"] });
                  } else {
                    setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "tiktok_prep") });
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "tiktok_prep", className: "font-normal cursor-pointer", children: "TikTok Shop Prep" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "self_fulfilled",
                checked: formData.fulfillment_services.includes("self_fulfilled"),
                onCheckedChange: (checked) => {
                  if (checked) {
                    setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "self_fulfilled"] });
                  } else {
                    setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "self_fulfilled") });
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "self_fulfilled", className: "font-normal cursor-pointer", children: "Self-Fulfilled Shipment" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "returns_processing",
                checked: formData.fulfillment_services.includes("returns_processing"),
                onCheckedChange: (checked) => {
                  if (checked) {
                    setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "returns_processing"] });
                  } else {
                    setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "returns_processing") });
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "returns_processing", className: "font-normal cursor-pointer", children: "Returns Processing" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "extra_prep",
              checked: formData.extra_prep,
              onCheckedChange: (checked) => setFormData({ ...formData, extra_prep: checked })
            }
          ),
          /* @__PURE__ */ jsx(Label, { htmlFor: "extra_prep", children: "Extra Prep" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "storage",
              checked: formData.storage,
              onCheckedChange: (checked) => setFormData({ ...formData, storage: checked })
            }
          ),
          /* @__PURE__ */ jsx(Label, { htmlFor: "storage", children: "Storage" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "admin_notes", children: "Admin Notes (Internal Only)" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "admin_notes",
            value: formData.admin_notes,
            onChange: (e) => setFormData({ ...formData, admin_notes: e.target.value }),
            placeholder: "Internal notes visible only to admin...",
            rows: 4
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, children: loading ? "Creating..." : "Create Client" })
      ] })
    ] })
  ] }) });
};
const NAVY = { r: 13, g: 33, b: 66 };
const ACCENT_GRAY = { r: 245, g: 245, b: 248 };
const MEDIUM_GRAY = { r: 120, g: 120, b: 120 };
const STORAGE_BILLING_NOTES$1 = {
  "Small Bin Storage": "Per small bin, per month",
  "Medium Bin Storage": "Per medium bin, per month",
  "Large Bin Storage": "Per large bin, per month",
  "Pallet Storage": "Per pallet, per month",
  "Shelf Storage": "Per shelf, per month"
};
const PALLET_PREFIX = "The minimum monthly payment is dictated by the stored pallet amount. ";
const EXCLUSION_SUFFIX = " Shipping costs, carton usage fees, and polybag usage fees are excluded from this calculation.";
const MINIMUM_SPEND_TEXT = {
  "250_then_500": "Client agrees to a minimum monthly service spend of $250.00 per month for the first three (3) months, increasing to $500.00 per month thereafter.",
  "500": "Client agrees to a minimum monthly service spend of $500.00 per month.",
  "500_flat": "Client agrees to a minimum monthly service spend of $500.00 per month.",
  "1000": "Client agrees to a minimum monthly service spend of $1,000.00 per month.",
  "1000_flat": "Client agrees to a minimum monthly service spend of $1,000.00 per month."
};
function getMinimumSpendText(tier) {
  if (tier.startsWith("custom:")) {
    const payload = tier.slice(7);
    if (payload.includes("_then_")) {
      const [introStr, ongoingStr] = payload.split("_then_");
      const intro = parseInt(introStr, 10);
      const ongoing = parseInt(ongoingStr, 10);
      if (!intro || intro < 1 || !ongoing || ongoing < 1) return null;
      return `${PALLET_PREFIX}Client agrees to a minimum monthly service spend of $${intro.toLocaleString("en-US")}.00 per month for the first three (3) months, increasing to $${ongoing.toLocaleString("en-US")}.00 per month thereafter.${EXCLUSION_SUFFIX}`;
    }
    const amount = parseInt(payload, 10);
    if (!amount || amount < 1) return null;
    const formatted = amount.toLocaleString("en-US");
    return `${PALLET_PREFIX}Client agrees to a minimum monthly service spend of $${formatted}.00 per month.${EXCLUSION_SUFFIX}`;
  }
  const base = MINIMUM_SPEND_TEXT[tier];
  if (!base) return null;
  return `${PALLET_PREFIX}${base}${EXCLUSION_SUFFIX}`;
}
function checkPageBreak(doc, y, threshold = 270) {
  if (y > threshold) {
    doc.addPage();
    return 20;
  }
  return y;
}
function drawSectionHeader(doc, title, subtitle, y) {
  y = checkPageBreak(doc, y, 260);
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(20, y - 1, 3, 8, "F");
  doc.setFontSize(12);
  doc.setFont(void 0, "bold");
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(title, 26, y + 5);
  y += 10;
  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont(void 0, "normal");
    doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
    doc.text(subtitle, 26, y);
    y += 5;
  }
  doc.setFillColor(ACCENT_GRAY.r, ACCENT_GRAY.g, ACCENT_GRAY.b);
  doc.rect(20, y, 170, 7, "F");
  doc.setFontSize(8);
  doc.setFont(void 0, "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("SERVICE", 24, y + 5);
  doc.text("PRICE", 175, y + 5, { align: "right" });
  y += 10;
  return y;
}
function drawServiceItem(doc, item, y) {
  y = checkPageBreak(doc, y);
  doc.setFontSize(10);
  doc.setFont(void 0, "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(item.service_name, 24, y);
  doc.text(`$${item.service_price.toFixed(2)}`, 175, y, { align: "right" });
  y += 5;
  const billingNote = STORAGE_BILLING_NOTES$1[item.service_name];
  if (billingNote) {
    doc.setFontSize(7.5);
    doc.setFont(void 0, "normal");
    doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
    doc.text(billingNote, 28, y);
    y += 4;
  }
  if (item.notes) {
    doc.setFontSize(7.5);
    doc.setFont(void 0, "normal");
    doc.setTextColor(100, 100, 100);
    const splitNotes = doc.splitTextToSize(item.notes, 145);
    doc.text(splitNotes, 28, y);
    y += splitNotes.length * 3.5 + 1;
  }
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.2);
  doc.line(24, y + 1, 186, y + 1);
  y += 4;
  return y;
}
async function generateQuotePDF(data, logoSrc) {
  const doc = new jsPDF();
  const img = new Image();
  img.src = logoSrc;
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(0, 0, 210, 42, "F");
  const logoWidth = 28;
  const logoHeight = img.height / img.width * logoWidth;
  doc.addImage(img, "JPEG", 16, 7, logoWidth, logoHeight);
  doc.setFontSize(20);
  doc.setFont(void 0, "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SERVICE QUOTE", 105, 22, { align: "center" });
  doc.setFontSize(9);
  doc.setFont(void 0, "normal");
  doc.setTextColor(200, 210, 230);
  doc.text("Westfield Prep Center  |  Los Angeles, CA", 105, 30, { align: "center" });
  const infoY = 48;
  doc.setFillColor(ACCENT_GRAY.r, ACCENT_GRAY.g, ACCENT_GRAY.b);
  doc.roundedRect(15, infoY, 180, 32, 2, 2, "F");
  doc.setFontSize(9);
  doc.setFont(void 0, "bold");
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text("FROM", 22, infoY + 7);
  doc.setFont(void 0, "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);
  doc.text("Westfield Prep Center", 22, infoY + 13);
  doc.text("Navapoom Sathatham", 22, infoY + 18);
  doc.text("info@westfieldprepcenter.com", 22, infoY + 23);
  doc.text("818-935-5478", 22, infoY + 28);
  const rx = 130;
  doc.setFont(void 0, "bold");
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text("TO", rx, infoY + 7);
  doc.setFont(void 0, "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(data.clientName || "Prospective Client", rx, infoY + 13);
  let cy = infoY + 18;
  if (data.contactName) {
    doc.text(data.contactName, rx, cy);
    cy += 5;
  }
  if (data.email) {
    doc.text(data.email, rx, cy);
    cy += 5;
  }
  if (data.phone) {
    doc.text(data.phone, rx, cy);
  }
  doc.setFontSize(8);
  doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
  doc.text(`Date: ${data.date}`, 22, infoY + 38);
  doc.setDrawColor(NAVY.r, NAVY.g, NAVY.b);
  doc.setLineWidth(0.5);
  doc.line(15, infoY + 42, 195, infoY + 42);
  let y = infoY + 50;
  if (data.isTeamQuote && data.teamQuoteItems?.length) {
    y = drawSectionHeader(doc, "Team Quote Services", "Custom services and pricing for your team.", y);
    for (const item of data.teamQuoteItems) {
      y = drawServiceItem(doc, item, y);
    }
    y += 5;
  } else {
    if (data.standardOperations?.length) {
      y = drawSectionHeader(doc, "Standard Operations", "Basic warehouse intake and account setup fees.", y);
      for (const item of data.standardOperations) {
        y = drawServiceItem(doc, item, y);
      }
      y += 5;
    }
    if (data.fulfillmentSections?.length) {
      for (const section of data.fulfillmentSections) {
        if (section.items.length > 0) {
          const subtitle = section.type === "Amazon FBA" ? "Standard prep services for FBA shipments." : section.type === "Self Fulfillment" ? "Prep, pack, and ship for non-FBA or DTC orders." : `${section.type} fulfillment services.`;
          y = drawSectionHeader(doc, section.type, subtitle, y);
          for (const item of section.items) {
            y = drawServiceItem(doc, item, y);
          }
          y += 5;
        }
      }
    }
  }
  const spendText = data.minimumSpendTier ? getMinimumSpendText(data.minimumSpendTier) : null;
  if (spendText) {
    y = checkPageBreak(doc, y, 240);
    doc.setDrawColor(NAVY.r, NAVY.g, NAVY.b);
    doc.setLineWidth(0.8);
    doc.setFillColor(250, 251, 255);
    const splitSpend = doc.splitTextToSize(spendText, 155);
    const boxHeight = 12 + splitSpend.length * 4;
    doc.roundedRect(20, y, 170, boxHeight, 2, 2, "FD");
    doc.setFontSize(9);
    doc.setFont(void 0, "bold");
    doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
    doc.text("MINIMUM MONTHLY SPEND", 28, y + 7);
    doc.setFontSize(8);
    doc.setFont(void 0, "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(splitSpend, 28, y + 14);
    y += boxHeight + 8;
  }
  if (data.additionalComments) {
    y = checkPageBreak(doc, y, 240);
    doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
    doc.rect(20, y - 1, 3, 8, "F");
    doc.setFontSize(12);
    doc.setFont(void 0, "bold");
    doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
    doc.text("Additional Comments", 26, y + 5);
    y += 12;
    doc.setFontSize(9);
    doc.setFont(void 0, "normal");
    doc.setTextColor(50, 50, 50);
    const splitComments = doc.splitTextToSize(data.additionalComments, 165);
    doc.text(splitComments, 24, y);
    y += splitComments.length * 4 + 8;
  }
  y = checkPageBreak(doc, y, 220);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(20, y, 190, y);
  y += 6;
  doc.setFontSize(7.5);
  doc.setFont(void 0, "italic");
  doc.setTextColor(100, 100, 100);
  const disclaimer1 = "All pricing provided in this quote is based on the unit volumes disclosed at the time of issuance. If the number of units received, stored, or processed fluctuates materially (up or down), Westfield Prep Center reserves the right to adjust pricing to reflect the updated volume and service requirements. Please contact us if your monthly inbound or stored unit counts change and you wish to request a re-evaluation of this quote.";
  const split1 = doc.splitTextToSize(disclaimer1, 170);
  doc.text(split1, 20, y);
  y += split1.length * 3.5 + 4;
  y = checkPageBreak(doc, y, 250);
  const disclaimer2 = "If there are any materials that we are missing that will be used in your brand's shipment operations, or if we are missing anything or made any mistake, please let us know so we can adjust the quote accordingly.";
  const split2 = doc.splitTextToSize(disclaimer2, 170);
  doc.text(split2, 20, y);
  y += split2.length * 3.5 + 8;
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(NAVY.r, NAVY.g, NAVY.b);
    doc.setLineWidth(0.5);
    doc.line(15, 282, 195, 282);
    doc.setFontSize(7);
    doc.setFont(void 0, "normal");
    doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
    doc.text("Westfield Prep Center  |  info@westfieldprepcenter.com  |  818-935-5478", 105, 287, { align: "center" });
    doc.text(`Page ${i} of ${pageCount}`, 105, 291, { align: "center" });
  }
  return doc;
}
const STANDARD_SERVICES$1 = [
  "Account Startup Fee",
  "Pallet Receiving",
  "Carton Receiving",
  "Pallet Storage",
  "Small Bin Storage",
  "Medium Bin Storage",
  "Large Bin Storage",
  "Shelf Storage",
  "Returns Handling",
  "Custom Entry"
];
const STORAGE_BILLING_NOTES = {
  "Small Bin Storage": "Per small bin, per month",
  "Medium Bin Storage": "Per medium bin, per month",
  "Large Bin Storage": "Per large bin, per month",
  "Pallet Storage": "Per pallet, per month",
  "Shelf Storage": "Per shelf, per month"
};
const AUTO_NOTES$1 = {
  "Account Startup Fee": "One-time charge for WMS training, WMS usage, and account support",
  "Pallet Receiving": "Per pallet received and checked into warehouse",
  "Carton Receiving": "Per carton received and checked into warehouse",
  "Returns Handling": "Covers receiving, inspection, client consultation on disposition, and processing of return actions",
  "FNSKU Label": "Per unit, applied to each product for Amazon FBA compliance",
  "Polybox+Label": "Per unit, polybagged and labeled for marketplace compliance",
  "Bubble Wrap": "Per unit, bubble wrapped for protection during transit",
  "Bundling": "Per bundle, combining multiple items into a single sellable unit",
  "Additional Label": "Per label, any extra labeling beyond standard requirements",
  "Shipment Box": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Polybag Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Carton Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Single Product": "Per order, pick and pack for single-item orders",
  "Kitting": "Per kit assembled, combining components into a single unit",
  "Bubble Wrapping": "Per unit, bubble wrapped for shipping protection",
  "Palletizing": "Per pallet, building and wrapping pallets for B2B or wholesale shipments",
  "Pick & Pack": "Per order, picking items and packing for shipment",
  "Base Order Fee": "Covers dropping the order, printing the packing slip, and staging the box",
  "Per-Unit Pick Fee": "Per unit picked from inventory for B2B orders",
  "Case/Carton Picking": "Per master carton picked, for shipping full sealed cartons without opening",
  "Hourly Rate (VAS/B2B Prep)": "Per hour for value-added services, big-box retail compliance, EDI integration, and custom prep",
  ...STORAGE_BILLING_NOTES
};
const DEFAULT_PRICES$1 = {
  "Account Startup Fee": 500,
  "Small Bin Storage": 4,
  "Medium Bin Storage": 5,
  "Large Bin Storage": 6,
  "Pallet Storage": 25,
  "Shelf Storage": 20,
  "Returns Handling": 1,
  "Carton Receiving": 3,
  "Pallet Receiving": 50,
  "Base Order Fee": 10,
  "Per-Unit Pick Fee": 0.15,
  "Case/Carton Picking": 3,
  "Hourly Rate (VAS/B2B Prep)": 45
};
const MARKETPLACE_SERVICES$1 = [
  "FNSKU Label",
  "Polybox+Label",
  "Bubble Wrap",
  "Bundling",
  "Additional Label",
  "Shipment Box",
  "Carton Usage",
  "Custom Entry"
];
const SELF_FULFILLMENT_SERVICES$1 = [
  "Single Product",
  "Bundling",
  "Kitting",
  "Bubble Wrapping",
  "Polybag Usage",
  "Carton Usage",
  "Custom Entry"
];
const B2B_SERVICES = [
  "Base Order Fee",
  "Per-Unit Pick Fee",
  "Case/Carton Picking",
  "Hourly Rate (VAS/B2B Prep)",
  "Pick & Pack",
  "Palletizing",
  "Bubble Wrapping",
  "Shipment Box",
  "Carton Usage",
  "Custom Entry"
];
const MINIMUM_SPEND_TIERS = {
  "250_then_500": "$250/mo for 3 months, then $500/mo",
  "500": "$500/mo flat",
  "1000": "$1,000/mo flat",
  "custom": "Custom Tier (intro + ongoing)"
};
function CreateQuoteDialog({
  open,
  onOpenChange
}) {
  const { toast } = useToast();
  const [manualClientName, setManualClientName] = useState("");
  const [manualContactName, setManualContactName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [minimumSpendTier, setMinimumSpendTier] = useState("250_then_500");
  const [customMinimumAmount, setCustomMinimumAmount] = useState("");
  const [customIntroAmount, setCustomIntroAmount] = useState("");
  const [standardItems, setStandardItems] = useState([]);
  const [fulfillmentSections, setFulfillmentSections] = useState([]);
  const [additionalComments, setAdditionalComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTeamQuote, setIsTeamQuote] = useState(false);
  const [teamQuoteItems, setTeamQuoteItems] = useState([]);
  const addStandardItem = () => {
    setStandardItems([...standardItems, {
      id: crypto.randomUUID(),
      service_name: "",
      service_price: 0,
      notes: "",
      isEditing: true
    }]);
  };
  const removeStandardItem = (id) => {
    setStandardItems(standardItems.filter((item) => item.id !== id));
  };
  const updateStandardItem = (id, field, value) => {
    setStandardItems(standardItems.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "service_name") {
        if (!item.notes && AUTO_NOTES$1[value]) {
          updated.notes = AUTO_NOTES$1[value];
        }
        if (item.service_price === 0 && DEFAULT_PRICES$1[value]) {
          updated.service_price = DEFAULT_PRICES$1[value];
        }
      }
      return updated;
    }));
  };
  const addFulfillmentSection = (type) => {
    setFulfillmentSections([...fulfillmentSections, {
      id: crypto.randomUUID(),
      type,
      items: []
    }]);
  };
  const removeFulfillmentSection = (id) => {
    setFulfillmentSections(fulfillmentSections.filter((section) => section.id !== id));
  };
  const addFulfillmentItem = (sectionId) => {
    setFulfillmentSections(fulfillmentSections.map(
      (section) => section.id === sectionId ? { ...section, items: [...section.items, {
        id: crypto.randomUUID(),
        service_name: "",
        service_price: 0,
        notes: "",
        isEditing: true
      }] } : section
    ));
  };
  const removeFulfillmentItem = (sectionId, itemId) => {
    setFulfillmentSections(fulfillmentSections.map(
      (section) => section.id === sectionId ? { ...section, items: section.items.filter((item) => item.id !== itemId) } : section
    ));
  };
  const updateFulfillmentItem = (sectionId, itemId, field, value) => {
    setFulfillmentSections(fulfillmentSections.map(
      (section) => section.id === sectionId ? {
        ...section,
        items: section.items.map((item) => {
          if (item.id !== itemId) return item;
          const updated = { ...item, [field]: value };
          if (field === "service_name") {
            if (!item.notes && AUTO_NOTES$1[value]) {
              updated.notes = AUTO_NOTES$1[value];
            }
            if (item.service_price === 0 && DEFAULT_PRICES$1[value]) {
              updated.service_price = DEFAULT_PRICES$1[value];
            }
          }
          return updated;
        })
      } : section
    ));
  };
  const handleGeneratePDF = async () => {
    try {
      let resolvedMinimumTier = minimumSpendTier || void 0;
      if (minimumSpendTier === "custom") {
        const ongoing = parseInt(customMinimumAmount, 10);
        if (!ongoing || ongoing < 1) {
          toast({
            title: "Invalid ongoing amount",
            description: "Enter a whole-dollar ongoing minimum spend (numbers only).",
            variant: "destructive"
          });
          return;
        }
        const introRaw = customIntroAmount.trim();
        if (introRaw === "") {
          resolvedMinimumTier = `custom:${ongoing}`;
        } else {
          const intro = parseInt(introRaw, 10);
          if (!intro || intro < 1) {
            toast({
              title: "Invalid intro amount",
              description: "Leave intro blank for no intro period, or enter a whole-dollar amount.",
              variant: "destructive"
            });
            return;
          }
          resolvedMinimumTier = `custom:${intro}_then_${ongoing}`;
        }
      }
      setIsSubmitting(true);
      const clientName = manualClientName.trim() || `Quote-${(/* @__PURE__ */ new Date()).getTime()}`;
      const doc = await generateQuotePDF({
        clientName,
        contactName: manualContactName || void 0,
        email: manualEmail || void 0,
        phone: manualPhone || void 0,
        date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
        standardOperations: standardItems.map((i) => ({ service_name: i.service_name, service_price: i.service_price, notes: i.notes })),
        fulfillmentSections: fulfillmentSections.map((s) => ({ type: s.type, items: s.items.map((i) => ({ service_name: i.service_name, service_price: i.service_price, notes: i.notes })) })),
        teamQuoteItems: teamQuoteItems.map((i) => ({ service_name: i.service_name, service_price: i.service_price, notes: i.notes })),
        additionalComments: additionalComments || void 0,
        minimumSpendTier: resolvedMinimumTier,
        isTeamQuote
      }, westfieldLogo);
      doc.save(`quote-${clientName.replace(/\s/g, "-")}-${Date.now()}.pdf`);
      toast({
        title: "PDF Generated",
        description: "Quote has been downloaded as PDF"
      });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  const toggleItemEdit = (id, isStandard, sectionId) => {
    if (isStandard) {
      setStandardItems(standardItems.map(
        (item) => item.id === id ? { ...item, isEditing: !item.isEditing } : item
      ));
    } else if (sectionId) {
      setFulfillmentSections(fulfillmentSections.map(
        (section) => section.id === sectionId ? {
          ...section,
          items: section.items.map(
            (item) => item.id === id ? { ...item, isEditing: !item.isEditing } : item
          )
        } : section
      ));
    }
  };
  const generateDefaultStandardItems = () => {
    return STANDARD_SERVICES$1.filter((s) => s !== "Custom Entry").map((service) => ({
      id: crypto.randomUUID(),
      service_name: service,
      service_price: DEFAULT_PRICES$1[service] || 0,
      notes: AUTO_NOTES$1[service] || "",
      isEditing: false
    }));
  };
  useEffect(() => {
    if (open && standardItems.length === 0 && !isTeamQuote) {
      setStandardItems(generateDefaultStandardItems());
    }
  }, [open]);
  const resetForm = () => {
    setManualClientName("");
    setManualContactName("");
    setManualEmail("");
    setManualPhone("");
    setMinimumSpendTier("250_then_500");
    setCustomMinimumAmount("");
    setCustomIntroAmount("");
    setStandardItems(generateDefaultStandardItems());
    setFulfillmentSections([]);
    setAdditionalComments("");
    setIsTeamQuote(false);
    setTeamQuoteItems([]);
  };
  const getServiceOptions = (sectionType) => {
    if (!sectionType) return STANDARD_SERVICES$1;
    if (sectionType === "Self Fulfillment" || sectionType === "TikTok Shop") return SELF_FULFILLMENT_SERVICES$1;
    if (sectionType === "B2B") return B2B_SERVICES;
    return MARKETPLACE_SERVICES$1;
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: (isOpen) => {
    if (!isOpen) {
      resetForm();
    } else if (standardItems.length === 0 && !isTeamQuote) {
      setStandardItems(generateDefaultStandardItems());
    }
    onOpenChange(isOpen);
  }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Generate Quote PDF" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg bg-muted/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-base", children: "Team Quote Mode" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Custom services only - clears standard operations and fulfillment sections" })
        ] }),
        /* @__PURE__ */ jsx(
          Switch,
          {
            checked: isTeamQuote,
            onCheckedChange: (checked) => {
              setIsTeamQuote(checked);
              if (checked) {
                setStandardItems([]);
                setFulfillmentSections([]);
              }
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "company-name", children: "Company Name" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "company-name",
              placeholder: "Enter company name (optional)",
              value: manualClientName,
              onChange: (e) => setManualClientName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "contact-name", children: "Contact Name" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "contact-name",
              placeholder: "Enter contact name (optional)",
              value: manualContactName,
              onChange: (e) => setManualContactName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              placeholder: "Enter email (optional)",
              value: manualEmail,
              onChange: (e) => setManualEmail(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Phone" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "phone",
              placeholder: "Enter phone (optional)",
              value: manualPhone,
              onChange: (e) => setManualPhone(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 border rounded-lg p-4 bg-muted/30", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Minimum Monthly Spend" }),
        /* @__PURE__ */ jsxs(Select, { value: minimumSpendTier, onValueChange: (v) => {
          setMinimumSpendTier(v);
          if (v !== "custom") {
            setCustomMinimumAmount("");
            setCustomIntroAmount("");
          }
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select minimum spend tier (optional)" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(MINIMUM_SPEND_TIERS).map(([key, label]) => /* @__PURE__ */ jsx(SelectItem, { value: key, children: label }, key)) })
        ] }),
        minimumSpendTier === "custom" && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "custom-intro-amount", className: "text-xs", children: "Intro Period Amount ($) — optional" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "custom-intro-amount",
                inputMode: "numeric",
                pattern: "[0-9]*",
                placeholder: "e.g. 500",
                value: customIntroAmount,
                onChange: (e) => setCustomIntroAmount(e.target.value.replace(/[^0-9]/g, ""))
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Leave blank for no intro period. Applies to months 1–3." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "custom-min-amount", className: "text-xs", children: "Ongoing Amount ($) — required after 3 months" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "custom-min-amount",
                inputMode: "numeric",
                pattern: "[0-9]*",
                placeholder: "e.g. 1000",
                value: customMinimumAmount,
                onChange: (e) => setCustomMinimumAmount(e.target.value.replace(/[^0-9]/g, ""))
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Whole dollars only. Numerical characters." })
          ] })
        ] }),
        minimumSpendTier && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "text-xs", onClick: () => {
          setMinimumSpendTier("");
          setCustomMinimumAmount("");
          setCustomIntroAmount("");
        }, children: "Clear selection" })
      ] }),
      !isTeamQuote && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Standard Operations" }),
          /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", onClick: addStandardItem, variant: "secondary", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
            "Add Service"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: standardItems.map((item) => /* @__PURE__ */ jsx("div", { className: `border-b pb-3 ${item.isEditing || !item.service_name ? "space-y-2" : ""}`, children: !item.isEditing && item.service_name ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.service_name }),
            /* @__PURE__ */ jsxs("span", { className: "ml-4 text-muted-foreground", children: [
              "$",
              item.service_price.toFixed(2)
            ] }),
            item.notes && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: item.notes })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => toggleItemEdit(item.id, true), children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeStandardItem(item.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr,150px,auto] gap-4 items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Service" }),
              item.service_name === "Custom Entry" || item.service_name && !STANDARD_SERVICES$1.includes(item.service_name) ? /* @__PURE__ */ jsx(
                Input,
                {
                  value: item.service_name === "Custom Entry" ? "" : item.service_name,
                  onChange: (e) => updateStandardItem(item.id, "service_name", e.target.value),
                  placeholder: "Enter custom service",
                  autoFocus: true
                }
              ) : /* @__PURE__ */ jsxs(
                Select,
                {
                  value: item.service_name || void 0,
                  onValueChange: (value) => {
                    if (value === "Custom Entry") {
                      updateStandardItem(item.id, "service_name", "Custom Entry");
                    } else {
                      updateStandardItem(item.id, "service_name", value);
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select service" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: STANDARD_SERVICES$1.map((service) => /* @__PURE__ */ jsx(SelectItem, { value: service, children: /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { children: service }),
                      AUTO_NOTES$1[service] && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: AUTO_NOTES$1[service] })
                    ] }) }, service)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Price ($)" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  min: "0",
                  value: item.service_price,
                  onChange: (e) => updateStandardItem(item.id, "service_price", parseFloat(e.target.value) || 0)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              item.service_name && /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => toggleItemEdit(item.id, true), className: "mt-6", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeStandardItem(item.id), className: "mt-6", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Notes (optional)" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                value: item.notes,
                onChange: (e) => updateStandardItem(item.id, "notes", e.target.value),
                placeholder: "Add notes for this service",
                rows: 2
              }
            )
          ] })
        ] }) }, item.id)) })
      ] }),
      !isTeamQuote && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Fulfillment Services" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", variant: "secondary", onClick: () => addFulfillmentSection("Amazon FBA"), children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " Amazon FBA"
            ] }),
            /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", variant: "secondary", onClick: () => addFulfillmentSection("Walmart WFS"), children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " Walmart WFS"
            ] }),
            /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", variant: "secondary", onClick: () => addFulfillmentSection("TikTok Shop"), children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " TikTok Shop"
            ] }),
            /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", variant: "secondary", onClick: () => addFulfillmentSection("Self Fulfillment"), children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " Self Fulfillment"
            ] }),
            /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", variant: "secondary", onClick: () => addFulfillmentSection("B2B"), children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " B2B"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: fulfillmentSections.map((section) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { className: "font-semibold", children: section.type }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", variant: "secondary", onClick: () => addFulfillmentItem(section.id), children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
                " Add Service"
              ] }),
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeFulfillmentSection(section.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
            ] })
          ] }),
          section.items.map((item) => /* @__PURE__ */ jsx("div", { className: `border-b pb-3 ${item.isEditing || !item.service_name ? "space-y-2" : ""}`, children: !item.isEditing && item.service_name ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.service_name }),
              /* @__PURE__ */ jsxs("span", { className: "ml-4 text-muted-foreground", children: [
                "$",
                item.service_price.toFixed(2)
              ] }),
              item.notes && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: item.notes })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => toggleItemEdit(item.id, false, section.id), children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeFulfillmentItem(section.id, item.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
            ] })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr,150px,auto] gap-4 items-start", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Service" }),
                item.service_name === "Custom Entry" || item.service_name && !getServiceOptions(section.type).includes(item.service_name) ? /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: item.service_name === "Custom Entry" ? "" : item.service_name,
                    onChange: (e) => updateFulfillmentItem(section.id, item.id, "service_name", e.target.value),
                    placeholder: "Enter custom service",
                    autoFocus: true
                  }
                ) : /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: item.service_name || void 0,
                    onValueChange: (value) => {
                      if (value === "Custom Entry") {
                        updateFulfillmentItem(section.id, item.id, "service_name", "Custom Entry");
                      } else {
                        updateFulfillmentItem(section.id, item.id, "service_name", value);
                      }
                    },
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select service" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: getServiceOptions(section.type).map((service) => /* @__PURE__ */ jsx(SelectItem, { value: service, children: /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("div", { children: service }),
                        AUTO_NOTES$1[service] && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: AUTO_NOTES$1[service] })
                      ] }) }, service)) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Price ($)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    step: "0.01",
                    min: "0",
                    value: item.service_price,
                    onChange: (e) => updateFulfillmentItem(section.id, item.id, "service_price", parseFloat(e.target.value) || 0)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                item.service_name && /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => toggleItemEdit(item.id, false, section.id), className: "mt-6", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeFulfillmentItem(section.id, item.id), className: "mt-6", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Notes (optional)" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  value: item.notes,
                  onChange: (e) => updateFulfillmentItem(section.id, item.id, "notes", e.target.value),
                  placeholder: "Add notes for this service",
                  rows: 2
                }
              )
            ] })
          ] }) }, item.id))
        ] }, section.id)) })
      ] }),
      isTeamQuote && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Team Quote Services" }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: () => {
                setTeamQuoteItems([...teamQuoteItems, {
                  id: crypto.randomUUID(),
                  service_name: "",
                  service_price: 0,
                  notes: "",
                  isEditing: true
                }]);
              },
              variant: "secondary",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
                "Add Service"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: teamQuoteItems.map((item) => /* @__PURE__ */ jsx("div", { className: "border-b pb-3 space-y-2", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr,150px,100px,auto] gap-4 items-start", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Custom Service" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: item.service_name,
                onChange: (e) => {
                  setTeamQuoteItems(teamQuoteItems.map(
                    (i) => i.id === item.id ? { ...i, service_name: e.target.value } : i
                  ));
                },
                placeholder: "Enter service name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Quantity" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                min: "1",
                value: item.notes || "1",
                onChange: (e) => {
                  setTeamQuoteItems(teamQuoteItems.map(
                    (i) => i.id === item.id ? { ...i, notes: e.target.value } : i
                  ));
                },
                placeholder: "Qty"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Price ($)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                step: "0.01",
                min: "0",
                value: item.service_price,
                onChange: (e) => {
                  setTeamQuoteItems(teamQuoteItems.map(
                    (i) => i.id === item.id ? { ...i, service_price: parseFloat(e.target.value) || 0 } : i
                  ));
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => {
                setTeamQuoteItems(teamQuoteItems.filter((i) => i.id !== item.id));
              },
              className: "mt-6",
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] }) }, item.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "comments", children: "Additional Comments" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "comments",
            placeholder: "Add any additional comments or notes (optional)",
            value: additionalComments,
            onChange: (e) => setAdditionalComments(e.target.value),
            rows: 4
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(DialogFooter, { className: "gap-2", children: /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: handleGeneratePDF,
        disabled: isSubmitting,
        children: [
          /* @__PURE__ */ jsx(Download, { className: "w-4 h-4 mr-2" }),
          "Download PDF"
        ]
      }
    ) })
  ] }) });
}
const GENERIC_ERROR_MESSAGES = {
  "auth": "Authentication failed. Please check your credentials and try again.",
  "database": "Unable to process your request. Please try again later.",
  "network": "Connection error. Please check your internet connection.",
  "permission": "You do not have permission to perform this action.",
  "validation": "Invalid input provided. Please check your data.",
  "storage": "File operation failed. Please try again.",
  "default": "An unexpected error occurred. Please contact support if this persists."
};
const sanitizeError = (error, category = "default") => {
  return GENERIC_ERROR_MESSAGES[category];
};
const clientUpdateSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(200, "Company name must be less than 200 characters"),
  first_name: z.string().trim().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  last_name: z.string().trim().min(1, "Last name is required").max(100, "Last name must be less than 100 characters"),
  phone_number: z.string().trim().min(1, "Phone number is required").max(50, "Phone number must be less than 50 characters").regex(/^[+\d\s\-()]+$/, "Phone number can only contain digits, spaces, and + - ( )"),
  estimated_units_per_month: z.number().int("Must be a whole number").min(0, "Cannot be negative").max(1e7, "Value too large").nullable().optional(),
  receiving_format: z.enum(["pallets", "cartons", "both"], {
    errorMap: () => ({ message: "Invalid receiving format" })
  }),
  extra_prep: z.boolean(),
  storage: z.boolean(),
  storage_units_per_month: z.number().int("Must be a whole number").min(0, "Cannot be negative").max(1e5, "Value too large").nullable().optional(),
  storage_method: z.enum(["shelf_storage", "cubic_foot_storage"]).nullable().optional(),
  admin_notes: z.string().max(5e3, "Admin notes must be less than 5000 characters").optional(),
  fulfillment_services: z.array(
    z.enum(["fba_prep", "wfs_prep", "tiktok_prep", "self_fulfilled", "shopify", "returns_processing"])
  ).max(10, "Too many fulfillment services selected"),
  pricing_document_url: z.string().max(500, "URL too long").nullable().optional()
});
const STANDARD_SERVICES = [
  "Account Startup Fee",
  "Pallet Receiving",
  "Carton Receiving",
  "Pallet Storage",
  "Small Bin Storage",
  "Medium Bin Storage",
  "Large Bin Storage",
  "Shelf Storage",
  "Returns Handling",
  "Custom Entry"
];
const MARKETPLACE_SERVICES = [
  "FNSKU Label",
  "Polybox+Label",
  "Bubble Wrap",
  "Bundling",
  "Kitting",
  "Additional Label",
  "Shipment Box",
  "Polybag Usage",
  "Carton Usage",
  "Custom Entry"
];
const SELF_FULFILLMENT_SERVICES = [
  "Single Product",
  "Oversized Product",
  "Bundling",
  "Kitting",
  "Bubble Wrapping",
  "Polybag Usage",
  "Carton Usage",
  "Custom Entry"
];
const AUTO_NOTES = {
  "Account Startup Fee": "One-time charge for WMS training, WMS usage, and account support",
  "Returns Handling": "Covers receiving, inspection, client consultation on disposition, and processing of return actions",
  "Polybag Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Carton Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Small Bin Storage": "Per small bin, per month",
  "Medium Bin Storage": "Per medium bin, per month",
  "Large Bin Storage": "Per large bin, per month",
  "Pallet Storage": "Per pallet, per month"
};
const DEFAULT_PRICES = {
  "Account Startup Fee": 500,
  "Small Bin Storage": 4,
  "Medium Bin Storage": 5,
  "Large Bin Storage": 6
};
const ClientPricingTab = ({ clientId, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [standardItems, setStandardItems] = useState([]);
  const [fulfillmentSections, setFulfillmentSections] = useState([]);
  useEffect(() => {
    fetchPricing();
  }, [clientId]);
  const fetchPricing = async () => {
    const { data } = await supabase.from("custom_pricing").select("*").eq("client_id", clientId);
    if (data && data.length > 0) {
      const standard = [];
      const sections = /* @__PURE__ */ new Map();
      data.forEach((item) => {
        const pricingItem = {
          id: item.id,
          service_name: item.service_name,
          price_per_unit: item.price_per_unit || 0,
          notes: item.notes || "",
          section_type: item.section_type || "Standard Operations"
        };
        if (item.section_type === "Standard Operations") {
          standard.push(pricingItem);
        } else {
          if (!sections.has(item.section_type)) {
            sections.set(item.section_type, {
              id: crypto.randomUUID(),
              type: item.section_type,
              items: []
            });
          }
          sections.get(item.section_type).items.push(pricingItem);
        }
      });
      setStandardItems(standard);
      setFulfillmentSections(Array.from(sections.values()));
    }
  };
  const addStandardItem = () => {
    setStandardItems([...standardItems, {
      id: crypto.randomUUID(),
      service_name: "",
      price_per_unit: 0,
      notes: "",
      section_type: "Standard Operations"
    }]);
    setIsDirty(true);
  };
  const removeStandardItem = (id) => {
    setStandardItems(standardItems.filter((item) => item.id !== id));
    setIsDirty(true);
  };
  const updateStandardItem = (id, field, value) => {
    setStandardItems(standardItems.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "service_name") {
        if (!item.notes && AUTO_NOTES[value]) {
          updated.notes = AUTO_NOTES[value];
        }
        if (item.price_per_unit === 0 && DEFAULT_PRICES[value]) {
          updated.price_per_unit = DEFAULT_PRICES[value];
        }
      }
      return updated;
    }));
    setIsDirty(true);
  };
  const addFulfillmentSection = (type) => {
    setFulfillmentSections([...fulfillmentSections, {
      id: crypto.randomUUID(),
      type,
      items: []
    }]);
    setIsDirty(true);
  };
  const removeFulfillmentSection = (id) => {
    setFulfillmentSections(fulfillmentSections.filter((section) => section.id !== id));
    setIsDirty(true);
  };
  const addFulfillmentItem = (sectionId) => {
    setFulfillmentSections(fulfillmentSections.map(
      (section) => section.id === sectionId ? { ...section, items: [...section.items, {
        id: crypto.randomUUID(),
        service_name: "",
        price_per_unit: 0,
        notes: "",
        section_type: section.type
      }] } : section
    ));
    setIsDirty(true);
  };
  const removeFulfillmentItem = (sectionId, itemId) => {
    setFulfillmentSections(fulfillmentSections.map(
      (section) => section.id === sectionId ? { ...section, items: section.items.filter((item) => item.id !== itemId) } : section
    ));
    setIsDirty(true);
  };
  const updateFulfillmentItem = (sectionId, itemId, field, value) => {
    setFulfillmentSections(fulfillmentSections.map(
      (section) => section.id === sectionId ? {
        ...section,
        items: section.items.map((item) => {
          if (item.id !== itemId) return item;
          const updated = { ...item, [field]: value };
          if (field === "service_name") {
            if (!item.notes && AUTO_NOTES[value]) {
              updated.notes = AUTO_NOTES[value];
            }
            if (item.price_per_unit === 0 && DEFAULT_PRICES[value]) {
              updated.price_per_unit = DEFAULT_PRICES[value];
            }
          }
          return updated;
        })
      } : section
    ));
    setIsDirty(true);
  };
  const savePricing = async () => {
    setLoading(true);
    try {
      await supabase.from("custom_pricing").delete().eq("client_id", clientId);
      const itemsToInsert = [];
      standardItems.forEach((item) => {
        if (item.service_name) {
          itemsToInsert.push({
            client_id: clientId,
            service_name: item.service_name,
            price_per_unit: item.price_per_unit,
            notes: item.notes,
            section_type: "Standard Operations"
          });
        }
      });
      fulfillmentSections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.service_name) {
            itemsToInsert.push({
              client_id: clientId,
              service_name: item.service_name,
              price_per_unit: item.price_per_unit,
              notes: item.notes,
              section_type: section.type
            });
          }
        });
      });
      if (itemsToInsert.length > 0) {
        const { error } = await supabase.from("custom_pricing").insert(itemsToInsert);
        if (error) throw error;
      }
      const { data: activeQuote } = await supabase.from("quotes").select("id, quote_data").eq("client_id", clientId).eq("status", "active").order("activated_at", { ascending: false }).limit(1).single();
      if (activeQuote) {
        const quoteData = activeQuote.quote_data || {};
        const existingStandardOps = quoteData.standard_operations || [];
        standardItems.forEach((item) => {
          if (item.service_name) {
            const existingIndex = existingStandardOps.findIndex(
              (op) => op.service_name === item.service_name
            );
            if (existingIndex >= 0) {
              existingStandardOps[existingIndex].service_price = item.price_per_unit;
            } else {
              existingStandardOps.push({
                service_name: item.service_name,
                service_price: item.price_per_unit,
                service_code: null
              });
            }
          }
        });
        const existingFulfillmentSections = quoteData.fulfillment_sections || [];
        fulfillmentSections.forEach((section) => {
          let existingSection = existingFulfillmentSections.find(
            (s) => s.type === section.type
          );
          if (!existingSection) {
            existingSection = { type: section.type, items: [] };
            existingFulfillmentSections.push(existingSection);
          }
          section.items.forEach((item) => {
            if (item.service_name) {
              const existingItemIndex = existingSection.items.findIndex(
                (i) => i.service_name === item.service_name
              );
              if (existingItemIndex >= 0) {
                existingSection.items[existingItemIndex].service_price = item.price_per_unit;
              } else {
                existingSection.items.push({
                  service_name: item.service_name,
                  service_price: item.price_per_unit,
                  service_code: null
                });
              }
            }
          });
        });
        await supabase.from("quotes").update({
          quote_data: {
            standard_operations: existingStandardOps,
            fulfillment_sections: existingFulfillmentSections
          }
        }).eq("id", activeQuote.id);
      }
      const { data: openBill } = await supabase.from("bills").select("id").eq("client_id", clientId).eq("status", "open").order("cycle_start", { ascending: false }).limit(1).single();
      if (openBill) {
        const { data: existingBillItems } = await supabase.from("bill_items").select("service_name, section_type").eq("bill_id", openBill.id);
        const existingSet = new Set(
          existingBillItems?.map((item) => `${item.service_name}:${item.section_type}`) || []
        );
        const newBillItems = [];
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        standardItems.forEach((item) => {
          if (item.service_name && !existingSet.has(`${item.service_name}:Standard Operations`)) {
            newBillItems.push({
              bill_id: openBill.id,
              service_name: item.service_name,
              unit_price_cents: Math.round(item.price_per_unit * 100),
              qty_decimal: 0,
              line_date: today,
              source: "pricing",
              section_type: "Standard Operations"
            });
          }
        });
        fulfillmentSections.forEach((section) => {
          section.items.forEach((item) => {
            if (item.service_name && !existingSet.has(`${item.service_name}:${section.type}`)) {
              newBillItems.push({
                bill_id: openBill.id,
                service_name: item.service_name,
                unit_price_cents: Math.round(item.price_per_unit * 100),
                qty_decimal: 0,
                line_date: today,
                source: "pricing",
                section_type: section.type
              });
            }
          });
        });
        if (newBillItems.length > 0) {
          await supabase.from("bill_items").insert(newBillItems);
        }
      }
      toast({
        title: "Pricing saved",
        description: "Client pricing has been updated successfully"
      });
      setIsDirty(false);
      onSuccess();
    } catch (error) {
      console.error("Error saving pricing:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleActivateQuote = async () => {
    setLoading(true);
    try {
      if (isDirty) {
        await savePricing();
      }
      await supabase.from("quotes").update({ status: "draft" }).eq("client_id", clientId).eq("status", "active");
      const standardOperations = standardItems.filter((item) => item.service_name).map((item) => ({
        service_name: item.service_name,
        service_price: item.price_per_unit,
        service_code: null
      }));
      const fulfillmentSectionsData = fulfillmentSections.map((section) => ({
        type: section.type,
        items: section.items.filter((item) => item.service_name).map((item) => ({
          service_name: item.service_name,
          service_price: item.price_per_unit,
          service_code: null
        }))
      })).filter((section) => section.items.length > 0);
      const quoteData = {
        standard_operations: standardOperations,
        fulfillment_sections: fulfillmentSectionsData
      };
      const { error: quoteError } = await supabase.from("quotes").insert({
        client_id: clientId,
        status: "active",
        quote_data: quoteData,
        activated_at: (/* @__PURE__ */ new Date()).toISOString(),
        memo: "Auto-activated from pricing tab"
      });
      if (quoteError) throw quoteError;
      toast({
        title: "Quote Activated",
        description: "Pricing quote has been activated successfully. You can now start billing cycles from the Billing tab."
      });
      onSuccess();
    } catch (error) {
      console.error("Error activating quote:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Client Pricing" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Set custom pricing for this client's services" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { onClick: savePricing, disabled: loading || !isDirty, children: [
          /* @__PURE__ */ jsx(Save, { className: "w-4 h-4 mr-2" }),
          "Save Pricing"
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleActivateQuote, disabled: loading, variant: "default", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 mr-2" }),
          "Activate Quote"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium", children: "Standard Operations" }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: addStandardItem, children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
          "Add Item"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: standardItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-2 items-start p-3 bg-muted/30 rounded", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-4", children: /* @__PURE__ */ jsxs(
          Select,
          {
            value: item.service_name,
            onValueChange: (value) => updateStandardItem(item.id, "service_name", value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select service" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: STANDARD_SERVICES.map((service) => /* @__PURE__ */ jsx(SelectItem, { value: service, children: service }, service)) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            step: "0.01",
            placeholder: "Price",
            value: item.price_per_unit,
            onChange: (e) => updateStandardItem(item.id, "price_per_unit", parseFloat(e.target.value) || 0)
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-5", children: /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Notes",
            value: item.notes,
            onChange: (e) => updateStandardItem(item.id, "notes", e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-1 flex justify-end", children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => removeStandardItem(item.id),
            children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
          }
        ) })
      ] }, item.id)) })
    ] }),
    fulfillmentSections.map((section) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium", children: section.type }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => addFulfillmentItem(section.id), children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
            "Add Item"
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              onClick: () => removeFulfillmentSection(section.id),
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: section.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-2 items-start p-3 bg-muted/30 rounded", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-4", children: /* @__PURE__ */ jsxs(
          Select,
          {
            value: item.service_name,
            onValueChange: (value) => updateFulfillmentItem(section.id, item.id, "service_name", value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select service" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: (section.type === "Self Fulfillment" ? SELF_FULFILLMENT_SERVICES : MARKETPLACE_SERVICES).map((service) => /* @__PURE__ */ jsx(SelectItem, { value: service, children: service }, service)) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            step: "0.01",
            placeholder: "Price",
            value: item.price_per_unit,
            onChange: (e) => updateFulfillmentItem(section.id, item.id, "price_per_unit", parseFloat(e.target.value) || 0)
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-5", children: /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Notes",
            value: item.notes,
            onChange: (e) => updateFulfillmentItem(section.id, item.id, "notes", e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-1 flex justify-end", children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => removeFulfillmentItem(section.id, item.id),
            children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
          }
        ) })
      ] }, item.id)) })
    ] }, section.id)),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => addFulfillmentSection("Amazon FBA"),
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
            "Add Amazon FBA"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => addFulfillmentSection("Walmart WFS"),
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
            "Add Walmart WFS"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => addFulfillmentSection("TikTok Shop"),
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
            "Add TikTok Shop"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => addFulfillmentSection("Self Fulfillment"),
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
            "Add Self Fulfillment"
          ]
        }
      )
    ] })
  ] });
};
const EditClientDialog = ({ open, onOpenChange, client, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    estimated_units_per_month: "",
    receiving_format: "both",
    extra_prep: false,
    storage: false,
    storage_units_per_month: "",
    storage_method: "",
    admin_notes: "",
    fulfillment_services: []
  });
  const { toast } = useToast();
  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client.company_name || "",
        first_name: client.first_name || "",
        last_name: client.last_name || "",
        phone_number: client.phone_number || "",
        estimated_units_per_month: client.estimated_units_per_month?.toString() || "",
        receiving_format: client.receiving_format || "both",
        extra_prep: client.extra_prep || false,
        storage: client.storage || false,
        storage_units_per_month: client.storage_units_per_month?.toString() || "",
        storage_method: client.storage_method || "",
        admin_notes: client.admin_notes || "",
        fulfillment_services: client.fulfillment_services || []
      });
      setExistingFileUrl(client.pricing_document_url || "");
      setSelectedFile(null);
    }
  }, [client]);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validatePricingDocument(file);
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validatePricingDocument(file);
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };
  const handleFileUpload = async () => {
    if (!selectedFile) return null;
    setUploadingFile(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${client.id}-${Date.now()}.${fileExt}`;
      const filePath = `pricing-docs/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("qc-images").upload(filePath, selectedFile);
      if (uploadError) throw uploadError;
      return filePath;
    } catch (error) {
      toast({
        title: "File upload failed",
        description: sanitizeError(error, "storage"),
        variant: "destructive"
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };
  const removeFile = () => {
    setSelectedFile(null);
  };
  const removeExistingFile = async () => {
    try {
      await supabase.from("clients").update({ pricing_document_url: null }).eq("id", client.id);
      setExistingFileUrl("");
      toast({
        title: "File removed",
        description: "Pricing document has been removed."
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: sanitizeError(error, "database"),
        variant: "destructive"
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let documentUrl = existingFileUrl;
      if (selectedFile) {
        const uploadedPath = await handleFileUpload();
        if (uploadedPath) {
          documentUrl = uploadedPath;
        }
      }
      const dataToValidate = {
        company_name: formData.company_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        estimated_units_per_month: formData.estimated_units_per_month ? parseInt(formData.estimated_units_per_month) : null,
        receiving_format: formData.receiving_format,
        extra_prep: formData.extra_prep,
        storage: formData.storage,
        storage_units_per_month: formData.storage_units_per_month ? parseInt(formData.storage_units_per_month) : null,
        storage_method: formData.storage_method || null,
        admin_notes: formData.admin_notes,
        fulfillment_services: formData.fulfillment_services,
        pricing_document_url: documentUrl || null
      };
      const validationResult = clientUpdateSchema.safeParse(dataToValidate);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: "Validation error",
          description: firstError.message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const { error } = await supabase.from("clients").update({
        ...validationResult.data,
        contact_name: `${validationResult.data.first_name} ${validationResult.data.last_name}`.trim()
      }).eq("id", client.id);
      if (error) throw error;
      toast({
        title: "Client updated",
        description: "Client information has been updated successfully."
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: sanitizeError(error, "database"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Client" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Update client information and settings." })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "details", className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "details", children: "Details" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "pricing", children: "Pricing" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "details", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "company_name", children: "Company Name *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "company_name",
                value: formData.company_name,
                onChange: (e) => setFormData({ ...formData, company_name: e.target.value }),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "first_name", children: "First Name *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "first_name",
                value: formData.first_name,
                onChange: (e) => setFormData({ ...formData, first_name: e.target.value }),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "last_name", children: "Last Name *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "last_name",
                value: formData.last_name,
                onChange: (e) => setFormData({ ...formData, last_name: e.target.value }),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone_number", children: "Phone Number *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "phone_number",
                value: formData.phone_number,
                onChange: (e) => setFormData({ ...formData, phone_number: e.target.value }),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "estimated_units", children: "Estimated Units/Month" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "estimated_units",
                type: "number",
                value: formData.estimated_units_per_month,
                onChange: (e) => setFormData({ ...formData, estimated_units_per_month: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "receiving_format", children: "Receiving Format" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.receiving_format,
                onValueChange: (value) => setFormData({ ...formData, receiving_format: value }),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "pallets", children: "Pallets" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "cartons", children: "Cartons" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "both", children: "Both" })
                  ] })
                ]
              }
            )
          ] }),
          formData.storage && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "storage_units", children: "Storage Units/Month" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "storage_units",
                  type: "number",
                  value: formData.storage_units_per_month,
                  onChange: (e) => setFormData({ ...formData, storage_units_per_month: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "storage_method", children: "Storage Method" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: formData.storage_method,
                  onValueChange: (value) => setFormData({ ...formData, storage_method: value }),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select storage method" }) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "shelf_storage", children: "Shelf Storage" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "cubic_foot_storage", children: "Cubic Foot Storage" })
                    ] })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { children: "Fulfillment Services" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "fba_prep",
                  checked: formData.fulfillment_services.includes("fba_prep"),
                  onCheckedChange: (checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "fba_prep"] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "fba_prep") });
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "fba_prep", className: "font-normal cursor-pointer", children: "FBA Prep" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "wfs_prep",
                  checked: formData.fulfillment_services.includes("wfs_prep"),
                  onCheckedChange: (checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "wfs_prep"] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "wfs_prep") });
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "wfs_prep", className: "font-normal cursor-pointer", children: "WFS Prep" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "tiktok_prep",
                  checked: formData.fulfillment_services.includes("tiktok_prep"),
                  onCheckedChange: (checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "tiktok_prep"] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "tiktok_prep") });
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "tiktok_prep", className: "font-normal cursor-pointer", children: "TikTok Shop Prep" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "self_fulfilled",
                  checked: formData.fulfillment_services.includes("self_fulfilled"),
                  onCheckedChange: (checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "self_fulfilled"] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "self_fulfilled") });
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "self_fulfilled", className: "font-normal cursor-pointer", children: "Self-Fulfilled Shipment" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "returns_processing",
                  checked: formData.fulfillment_services.includes("returns_processing"),
                  onCheckedChange: (checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, "returns_processing"] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter((s) => s !== "returns_processing") });
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "returns_processing", className: "font-normal cursor-pointer", children: "Returns Processing" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "extra_prep",
                checked: formData.extra_prep,
                onCheckedChange: (checked) => setFormData({ ...formData, extra_prep: checked })
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "extra_prep", children: "Extra Prep" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "storage",
                checked: formData.storage,
                onCheckedChange: (checked) => setFormData({ ...formData, storage: checked })
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "storage", children: "Storage" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "admin_notes", children: "Admin Notes (Internal Only)" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "admin_notes",
              value: formData.admin_notes,
              onChange: (e) => setFormData({ ...formData, admin_notes: e.target.value }),
              placeholder: "Internal notes visible only to admin...",
              rows: 4
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Pricing Document" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            existingFileUrl && !selectedFile && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-muted rounded-lg border", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-primary" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Current pricing document" })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: removeExistingFile,
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            selectedFile ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-muted rounded-lg border", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-primary" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: selectedFile.name })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: removeFile,
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }) : /* @__PURE__ */ jsxs(
              "div",
              {
                className: `border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`,
                onDragEnter: handleDrag,
                onDragLeave: handleDrag,
                onDragOver: handleDrag,
                onDrop: handleDrop,
                children: [
                  /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "Drag and drop a file here, or click to browse" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      id: "file-upload",
                      className: "hidden",
                      onChange: handleFileSelect,
                      accept: ".pdf,.doc,.docx,.xls,.xlsx"
                    }
                  ),
                  /* @__PURE__ */ jsx("label", { htmlFor: "file-upload", children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsx("span", { children: "Browse Files" }) }) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, children: loading ? "Updating..." : "Update Client" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "pricing", children: /* @__PURE__ */ jsx(ClientPricingTab, { clientId: client?.id, onSuccess }) })
    ] })
  ] }) });
};
const DeleteClientDialog = ({ open, onOpenChange, client, onSuccess }) => {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      toast({
        title: "Confirmation required",
        description: 'Please type "DELETE" to confirm.',
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("clients").delete().eq("id", client.id);
      if (error) throw error;
      toast({
        title: "Client deleted",
        description: "The client has been permanently deleted."
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setConfirmText("");
    }
  };
  return /* @__PURE__ */ jsx(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
    /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Client" }),
      /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
        "This action cannot be undone. This will permanently delete the client account for",
        " ",
        /* @__PURE__ */ jsx("strong", { children: client?.company_name }),
        " and all associated data."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2 py-4", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "confirm", children: 'Type "DELETE" to confirm' }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "confirm",
          value: confirmText,
          onChange: (e) => setConfirmText(e.target.value),
          placeholder: "DELETE"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: () => setConfirmText(""), children: "Cancel" }),
      /* @__PURE__ */ jsx(
        AlertDialogAction,
        {
          onClick: handleDelete,
          disabled: loading || confirmText !== "DELETE",
          className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          children: loading ? "Deleting..." : "Delete Client"
        }
      )
    ] })
  ] }) });
};
const ClientsList = ({ clients, loading, onRefresh }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  if (loading) {
    return /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center py-8", children: "Loading clients..." });
  }
  if (clients.length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center py-8", children: "No clients yet. Create your first client!" });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Company" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Contact" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Email" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Created" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: clients.map((client) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: client.company_name }),
        /* @__PURE__ */ jsx(TableCell, { children: client.contact_name }),
        /* @__PURE__ */ jsx(TableCell, { children: client.email }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Badge,
          {
            variant: client.status === "active" ? "default" : client.status === "inactive" ? "destructive" : "secondary",
            className: client.status === "active" ? "bg-green-600 hover:bg-green-700 text-white" : "",
            children: client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : "Pending"
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { children: format(new Date(client.created_at), "MMM d, yyyy") }),
        /* @__PURE__ */ jsxs(TableCell, { className: "text-right space-x-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => {
                setSelectedClient(client);
                setShowEditDialog(true);
              },
              children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => {
                setSelectedClient(client);
                setShowDeleteDialog(true);
              },
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" })
            }
          )
        ] })
      ] }, client.id)) })
    ] }),
    selectedClient && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        EditClientDialog,
        {
          open: showEditDialog,
          onOpenChange: setShowEditDialog,
          client: selectedClient,
          onSuccess: () => {
            setShowEditDialog(false);
            onRefresh();
          }
        }
      ),
      /* @__PURE__ */ jsx(
        DeleteClientDialog,
        {
          open: showDeleteDialog,
          onOpenChange: setShowDeleteDialog,
          client: selectedClient,
          onSuccess: () => {
            setShowDeleteDialog(false);
            onRefresh();
          }
        }
      )
    ] })
  ] });
};
const ClientsTab = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [showOneTimeQuoteDialog, setShowOneTimeQuoteDialog] = useState(false);
  const { toast } = useToast();
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClients();
    const channel = supabase.channel("clients-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "clients"
      },
      (payload) => {
        fetchClients();
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Clients Management" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Create and manage client accounts" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            onClick: fetchClients,
            disabled: loading,
            children: [
              /* @__PURE__ */ jsx(RefreshCw, { className: `mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}` }),
              "Refresh"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Button, { onClick: () => setShowCreateDialog(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Create Client"
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: () => setShowQuoteDialog(true), variant: "secondary", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Create Quote (Prospect)"
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: () => setShowOneTimeQuoteDialog(true), variant: "outline", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Create One-Time Quote"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(
      ClientsList,
      {
        clients,
        loading,
        onRefresh: fetchClients
      }
    ) }),
    /* @__PURE__ */ jsx(
      CreateClientDialog,
      {
        open: showCreateDialog,
        onOpenChange: setShowCreateDialog,
        onSuccess: fetchClients
      }
    ),
    /* @__PURE__ */ jsx(
      CreateQuoteDialog,
      {
        open: showQuoteDialog,
        onOpenChange: setShowQuoteDialog
      }
    ),
    /* @__PURE__ */ jsx(
      CreateOneTimeQuoteDialog,
      {
        open: showOneTimeQuoteDialog,
        onOpenChange: setShowOneTimeQuoteDialog
      }
    )
  ] });
};
export {
  ClientsTab as default
};
