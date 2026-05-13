import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { I as playErrorSound, J as playSuccessSound, m as cn, B as Button, l as useToast, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, C as DialogFooter, s as supabase } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea } from "./select-Cb0hy2VC.js";
import { CameraOff, Camera, Keyboard, X, Package, Save, RefreshCw, Scan, Plus, Paperclip } from "lucide-react";
import { z } from "zod";
import { Html5Qrcode } from "html5-qrcode";
const isTrackingNumber = (barcode) => {
  if (!barcode || barcode.length < 10) return false;
  if (/^1Z[0-9A-Z]{16}$/i.test(barcode)) return true;
  if (/^\d{12}$|^\d{14}$|^\d{15}$|^\d{20}$/.test(barcode)) return true;
  if (/^(94|92)\d{18,32}$/.test(barcode)) return true;
  if (/^\d{20,34}$/.test(barcode)) return true;
  if (/^\d{10,11}$/.test(barcode)) return true;
  return false;
};
const detectCarrier = (trackingNumber) => {
  if (!trackingNumber) return "Unknown";
  if (/^1Z/i.test(trackingNumber)) return "UPS";
  if (/^\d{12}$/.test(trackingNumber)) return "FedEx";
  if (/^\d{15}$/.test(trackingNumber)) return "FedEx";
  if (/^\d{20}$/.test(trackingNumber)) return "FedEx";
  if (/^(94|92)\d{18,32}$/.test(trackingNumber)) return "USPS";
  if (/^\d{20,34}$/.test(trackingNumber)) return "USPS";
  if (/^\d{10,11}$/.test(trackingNumber)) return "DHL";
  return "Unknown";
};
const validateProductBarcode = (barcode) => {
  if (!barcode || !/^\d+$/.test(barcode)) return false;
  if (![8, 12, 13].includes(barcode.length)) return false;
  const digits = barcode.split("").map(Number);
  const checkDigit = digits.pop();
  let sum = 0;
  digits.forEach((digit, index) => {
    const multiplier = (digits.length - index) % 2 === 0 ? 3 : 1;
    sum += digit * multiplier;
  });
  const calculatedCheck = (10 - sum % 10) % 10;
  return calculatedCheck === checkDigit;
};
const detectBarcodeType = (barcode) => {
  if (!barcode) return "unknown";
  if (isTrackingNumber(barcode)) return "tracking";
  if (/^\d{12}$/.test(barcode) && validateProductBarcode(barcode)) return "upc";
  if (/^\d{8}$/.test(barcode) && validateProductBarcode(barcode)) return "upc";
  if (/^\d{13}$/.test(barcode) && validateProductBarcode(barcode)) return "ean";
  if (/^[A-Z0-9\-]+$/i.test(barcode) && barcode.length >= 6) return "code128";
  return "unknown";
};
const normalizeBarcode = (barcode) => {
  return barcode.trim().replace(/\s+/g, "").toUpperCase();
};
const BarcodeScanner = ({
  onScan,
  onError,
  mode = "both",
  continuous = false,
  autoStart = false,
  placeholder = "Scan or type barcode...",
  className,
  disabled = false
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState(mode === "keyboard" || mode === "both");
  const [manualInput, setManualInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const html5QrCodeRef = useRef(null);
  const keyboardBufferRef = useRef("");
  const lastKeyTimeRef = useRef(Date.now());
  const inputRef = useRef(null);
  useEffect(() => {
    if (!keyboardMode) return;
    const handleKeyDown = (e) => {
      const target = e.target;
      if (target.tagName === "INPUT" && target !== inputRef.current) return;
      if (target.tagName === "TEXTAREA") return;
      if (target.isContentEditable) return;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      if (timeDiff > 100) {
        keyboardBufferRef.current = "";
      }
      if (e.key === "Enter" && keyboardBufferRef.current.length > 5) {
        e.preventDefault();
        const barcode = normalizeBarcode(keyboardBufferRef.current);
        const format = detectBarcodeType(barcode);
        handleSuccessfulScan(barcode, format);
        keyboardBufferRef.current = "";
      } else if (e.key.length === 1 && e.key !== "Enter") {
        keyboardBufferRef.current += e.key;
      }
      lastKeyTimeRef.current = currentTime;
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardMode, continuous]);
  useEffect(() => {
    if (autoStart && (mode === "camera" || mode === "both")) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, []);
  const startCamera = async () => {
    if (cameraActive || html5QrCodeRef.current) return;
    try {
      const html5QrCode = new Html5Qrcode("barcode-scanner-preview");
      html5QrCodeRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.777778
        },
        (decodedText) => {
          const barcode = normalizeBarcode(decodedText);
          const format = detectBarcodeType(barcode);
          handleSuccessfulScan(barcode, format);
          if (!continuous) {
            stopCamera();
          }
        },
        (errorMessage) => {
          if (!errorMessage.includes("NotFoundException")) {
            console.warn("Camera scan error:", errorMessage);
          }
        }
      );
      setCameraActive(true);
    } catch (error) {
      console.error("Failed to start camera:", error);
      const errorMsg = "Failed to access camera. Please check permissions.";
      onError?.(errorMsg);
      playErrorSound();
    }
  };
  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (error) {
        console.error("Error stopping camera:", error);
      }
      setCameraActive(false);
    }
  };
  const handleSuccessfulScan = (barcode, format) => {
    if (barcode === lastScan && !continuous) {
      return;
    }
    setLastScan(barcode);
    setScanning(true);
    playSuccessSound();
    setTimeout(() => setScanning(false), 300);
    onScan(barcode, format);
    setTimeout(() => setLastScan(null), 2e3);
  };
  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    const barcode = normalizeBarcode(manualInput);
    const format = detectBarcodeType(barcode);
    if (format === "unknown") {
      playErrorSound();
      onError?.("Invalid barcode format");
      return;
    }
    handleSuccessfulScan(barcode, format);
    setManualInput("");
  };
  const showCamera = mode === "camera" || mode === "both";
  const showKeyboard = mode === "keyboard" || mode === "both";
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-4", className), children: [
    showCamera && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(Label, { children: "Camera Scanner" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: cameraActive ? "destructive" : "outline",
            onClick: () => cameraActive ? stopCamera() : startCamera(),
            children: cameraActive ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(CameraOff, { className: "h-4 w-4 mr-2" }),
              "Stop Camera"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4 mr-2" }),
              "Start Camera"
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          id: "barcode-scanner-preview",
          className: cn(
            "rounded-lg overflow-hidden border-2 transition-colors",
            scanning ? "border-green-500" : "border-border",
            !cameraActive && "min-h-[200px] bg-muted flex items-center justify-center"
          ),
          children: !cameraActive && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: 'Click "Start Camera" to begin scanning' })
        }
      )
    ] }),
    showKeyboard && /* @__PURE__ */ jsxs("div", { className: cn(
      "rounded-lg border-2 p-4 transition-colors",
      scanning ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-border bg-muted"
    ), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(Keyboard, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsx(Label, { children: "Scanner Ready" }),
        scanning && /* @__PURE__ */ jsx("span", { className: "text-xs text-green-600 dark:text-green-400 font-semibold", children: "Scan Detected!" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: keyboardMode ? "USB/Bluetooth scanner active. Scan any barcode to capture." : "Enable keyboard mode to use USB/Bluetooth scanners" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { children: "Manual Entry (Fallback)" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            ref: inputRef,
            value: manualInput,
            onChange: (e) => setManualInput(e.target.value),
            onKeyPress: (e) => e.key === "Enter" && handleManualSubmit(),
            placeholder,
            className: "flex-1",
            disabled,
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            onClick: handleManualSubmit,
            disabled: !manualInput.trim() || disabled,
            children: "Submit"
          }
        ),
        manualInput && /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            onClick: () => setManualInput(""),
            disabled,
            children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    lastScan && /* @__PURE__ */ jsxs("div", { className: "text-xs text-center p-2 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200", children: [
      "Last scan: ",
      /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold", children: lastScan })
    ] })
  ] });
};
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".xlsx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];
const validatePricingDocument = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Only PDF, DOCX, and XLSX allowed" };
  }
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: "Invalid file extension" };
  }
  if (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\")) {
    return { valid: false, error: "Invalid filename" };
  }
  return { valid: true };
};
const validateImageFile = (file) => {
  const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: "File size exceeds 20MB limit" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Only JPEG, PNG, WEBP, GIF, and PDF allowed" };
  }
  if (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\")) {
    return { valid: false, error: "Invalid filename" };
  }
  return { valid: true };
};
const ShipmentTemplateDialog = ({
  open,
  onOpenChange,
  clientId,
  asnData,
  skus,
  onSuccess
}) => {
  const [templateName, setTemplateName] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const handleSave = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        variant: "destructive"
      });
      return;
    }
    if (asnData.lines.length === 0) {
      toast({
        title: "No line items to save",
        variant: "destructive"
      });
      return;
    }
    setSaving(true);
    try {
      const { data: existing } = await supabase.from("shipment_templates").select("id").eq("client_id", clientId).eq("template_name", templateName.trim()).maybeSingle();
      if (existing) {
        throw new Error("Template name already exists for this client");
      }
      const { data: { user } } = await supabase.auth.getUser();
      const { data: template, error: templateError } = await supabase.from("shipment_templates").insert({
        client_id: clientId,
        template_name: templateName.trim(),
        carrier: asnData.carrier || null,
        ship_from: asnData.ship_from || null,
        notes: asnData.notes || null,
        created_by: user?.id || null,
        use_count: 0
      }).select().single();
      if (templateError) throw templateError;
      const { error: linesError } = await supabase.from("shipment_template_lines").insert(
        asnData.lines.map((line) => ({
          template_id: template.id,
          sku_id: line.sku_id,
          expected_units: line.expected_units
        }))
      );
      if (linesError) throw linesError;
      toast({
        title: "Template saved",
        description: `"${templateName}" is now available for quick ASN creation`
      });
      onSuccess();
      onOpenChange(false);
      setTemplateName("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  const getSKUDetails = (skuId) => {
    return skus.find((s) => s.id === skuId);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Save as Template" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "template-name", children: "Template Name *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "template-name",
            value: templateName,
            onChange: (e) => setTemplateName(e.target.value),
            placeholder: "e.g. Weekly Amazon Shipment",
            maxLength: 100
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-4 space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "This template will include:" }),
        asnData.carrier && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Carrier:" }),
          /* @__PURE__ */ jsx("span", { children: asnData.carrier })
        ] }),
        asnData.ship_from && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Ship From:" }),
          /* @__PURE__ */ jsx("span", { children: asnData.ship_from })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("span", { children: [
            asnData.lines.length,
            " SKU line items"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Line Items:" }),
        asnData.lines.map((line, index) => {
          const sku = getSKUDetails(line.sku_id);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center justify-between text-sm p-2 bg-muted/30 rounded",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "flex-1 truncate", children: [
                  index + 1,
                  ". ",
                  sku?.client_sku || "Unknown",
                  " (",
                  sku?.title || "N/A",
                  ")"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground ml-2", children: [
                  line.expected_units,
                  " units"
                ] })
              ]
            },
            index
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          onClick: () => {
            onOpenChange(false);
            setTemplateName("");
          },
          disabled: saving,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(Button, { onClick: handleSave, disabled: saving || !templateName.trim(), children: saving ? "Saving..." : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
        "Save Template"
      ] }) })
    ] })
  ] }) });
};
const quickSKUSchema = z.object({
  client_id: z.string().uuid(),
  client_sku: z.string().trim().min(1, "SKU is required").max(100),
  title: z.string().trim().min(1, "Title is required").max(500)
});
const QuickAddSKUModal = ({ open, onOpenChange, clientId, onSuccess }) => {
  const [formData, setFormData] = useState({
    client_sku: "",
    title: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const validated = quickSKUSchema.parse({
        client_id: clientId,
        client_sku: formData.client_sku,
        title: formData.title
      });
      const { data: existing } = await supabase.from("skus").select("id").eq("client_id", clientId).eq("client_sku", validated.client_sku).maybeSingle();
      if (existing) {
        throw new Error("This SKU already exists for this client");
      }
      const { data: sku, error } = await supabase.from("skus").insert({
        client_id: validated.client_id,
        client_sku: validated.client_sku,
        internal_sku: validated.client_sku,
        title: validated.title,
        status: "active"
      }).select().single();
      if (error) throw error;
      toast({
        title: "Success",
        description: "SKU created successfully"
      });
      onSuccess(sku.id);
      onOpenChange(false);
      setFormData({ client_sku: "", title: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create SKU",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Quick Add SKU" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "client_sku", children: "Client SKU *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "client_sku",
            value: formData.client_sku,
            onChange: (e) => setFormData({ ...formData, client_sku: e.target.value }),
            placeholder: "Enter SKU",
            maxLength: 100,
            autoFocus: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Title *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "title",
            value: formData.title,
            onChange: (e) => setFormData({ ...formData, title: e.target.value }),
            placeholder: "Product title",
            maxLength: 500
          }
        )
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "This creates a basic SKU record. Additional details can be added later." })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: loading, children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: loading, children: loading ? "Creating..." : "Create SKU" })
    ] })
  ] }) });
};
const TemplateSelector = ({
  clientId,
  onSelect,
  className
}) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  useEffect(() => {
    if (clientId) {
      fetchTemplates();
    }
  }, [clientId]);
  const fetchTemplates = async () => {
    setLoading(true);
    const { data } = await supabase.from("shipment_templates").select(`
        *,
        shipment_template_lines(
          *,
          skus(*)
        )
      `).eq("client_id", clientId).order("last_used_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false });
    const validTemplates = (data || []).map((template) => ({
      ...template,
      shipment_template_lines: (template.shipment_template_lines || []).filter(
        (line) => line.skus && line.skus.status === "active"
      )
    })).filter((template) => template.shipment_template_lines.length > 0);
    setTemplates(validTemplates);
    setLoading(false);
  };
  const handleSelect = (id) => {
    setSelectedId(id);
    const template = templates.find((t) => t.id === id);
    if (template) {
      onSelect(template);
    }
  };
  return /* @__PURE__ */ jsxs(Select, { value: selectedId, onValueChange: handleSelect, children: [
    /* @__PURE__ */ jsx(SelectTrigger, { className, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose a template..." }) }),
    /* @__PURE__ */ jsxs(SelectContent, { children: [
      loading && /* @__PURE__ */ jsx(SelectItem, { value: "_loading", disabled: true, children: "Loading templates..." }),
      !loading && templates.length === 0 && /* @__PURE__ */ jsx(SelectItem, { value: "_empty", disabled: true, children: "No templates saved yet" }),
      templates.map((template) => /* @__PURE__ */ jsx(SelectItem, { value: template.id, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full gap-4", children: [
        /* @__PURE__ */ jsx("span", { className: "truncate", children: template.template_name }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            template.shipment_template_lines?.length || 0,
            " SKUs"
          ] }),
          template.use_count > 0 && /* @__PURE__ */ jsxs("span", { children: [
            "• Used ",
            template.use_count,
            "x"
          ] })
        ] })
      ] }) }, template.id))
    ] })
  ] });
};
const COMMON_CARRIERS = [
  "FedEx",
  "UPS",
  "USPS",
  "DHL",
  "Amazon Logistics",
  "Freight"
];
const asnHeaderSchema = z.object({
  client_id: z.string().uuid({ message: "Please select a client" }),
  asn_number: z.string().min(1, { message: "ASN number is required" }),
  carrier: z.string().trim().max(100).nullable().optional(),
  tracking_number: z.string().trim().max(100).nullable().optional(),
  eta: z.string().nullable().optional(),
  ship_from: z.string().trim().max(500).nullable().optional(),
  notes: z.string().max(2e3).nullable().optional()
});
const asnLineSchema = z.object({
  sku_id: z.string().uuid({ message: "Please select a SKU" }),
  expected_units: z.number().int().min(1, "Must be at least 1").max(1e6, "Maximum 1,000,000 units")
});
const ASNFormDialog = ({ open, onOpenChange, onSuccess, asnId, prefillData }) => {
  const isClientLocked = !!prefillData?.client_id && !asnId;
  const [clients, setClients] = useState([]);
  const [skus, setSKUs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    asn_number: "",
    carrier: "",
    tracking_number: "",
    eta: "",
    ship_from: "",
    notes: ""
  });
  const [lines, setLines] = useState([]);
  const [attachments, setAttachments] = useState([]);
  useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [scannerMode, setScannerMode] = useState("manual");
  const [activeScanLine, setActiveScanLine] = useState(null);
  const [showQuickAddSKU, setShowQuickAddSKU] = useState(false);
  useState("");
  const [isCustomCarrier, setIsCustomCarrier] = useState(false);
  const keyboardBuffer = useRef("");
  const keyboardTimeout = useRef(null);
  const { toast } = useToast();
  useEffect(() => {
    if (open) {
      fetchClients();
      if (asnId) {
        loadASN(asnId);
      } else if (prefillData) {
        const carrierValue = prefillData.carrier || "";
        const isCustom = carrierValue !== "" && !COMMON_CARRIERS.includes(carrierValue);
        setIsCustomCarrier(isCustom);
        setFormData({
          client_id: prefillData.client_id || "",
          asn_number: prefillData.asn_number || "",
          carrier: carrierValue,
          tracking_number: prefillData.tracking_number || "",
          eta: prefillData.eta || "",
          ship_from: prefillData.ship_from || "",
          notes: prefillData.notes || ""
        });
        if (prefillData.client_id) {
          fetchSKUs(prefillData.client_id);
          if (!prefillData.asn_number) {
            supabase.rpc("generate_asn_number", { p_client_id: prefillData.client_id }).then(({ data }) => {
              if (data) {
                setFormData((prev) => ({ ...prev, asn_number: data }));
              }
            });
          }
        }
        if (prefillData.lines) {
          setLines(prefillData.lines);
        }
      } else {
        resetForm();
      }
    }
  }, [open, asnId, prefillData]);
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (keyboardTimeout.current) {
        clearTimeout(keyboardTimeout.current);
      }
      if (e.key === "Enter" && keyboardBuffer.current.length > 5) {
        e.preventDefault();
      }
      if (e.key.length === 1 && e.key !== "Enter") {
        keyboardBuffer.current += e.key;
      }
      keyboardTimeout.current = setTimeout(() => {
        const scannedBarcode = normalizeBarcode(keyboardBuffer.current);
        if (scannedBarcode && isTrackingNumber(scannedBarcode)) {
          const carrier = detectCarrier(scannedBarcode);
          setFormData((prev) => ({
            ...prev,
            tracking_number: scannedBarcode,
            carrier
          }));
          toast({
            title: `✓ Tracking Scanned`,
            description: `${carrier} tracking number auto-detected`,
            duration: 2e3
          });
        }
        keyboardBuffer.current = "";
      }, 100);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (keyboardTimeout.current) {
        clearTimeout(keyboardTimeout.current);
      }
    };
  }, [open, toast]);
  const loadASN = async (id) => {
    setLoading(true);
    try {
      const { data: header, error: headerError } = await supabase.from("asn_headers").select("*").eq("id", id).single();
      if (headerError) throw headerError;
      const { data: lines2, error: linesError } = await supabase.from("asn_lines").select("*").eq("asn_id", id);
      if (linesError) throw linesError;
      const carrierValue = header.carrier || "";
      const isCustom = carrierValue !== "" && !COMMON_CARRIERS.includes(carrierValue);
      setIsCustomCarrier(isCustom);
      setFormData({
        client_id: header.client_id,
        asn_number: header.asn_number,
        carrier: carrierValue,
        tracking_number: header.tracking_number || "",
        eta: header.eta || "",
        ship_from: header.ship_from || "",
        notes: header.notes || ""
      });
      await fetchSKUs(header.client_id);
      setLines(lines2.map((line) => ({
        sku_id: line.sku_id,
        expected_units: line.expected_units
      })));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load ASN",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("company_name");
    if (data) setClients(data);
  };
  const fetchSKUs = async (clientId) => {
    const { data } = await supabase.from("skus").select("*").eq("client_id", clientId).eq("status", "active").order("client_sku");
    if (data) setSKUs(data);
  };
  const handleClientChange = async (clientId) => {
    setFormData({ ...formData, client_id: clientId, asn_number: "" });
    fetchSKUs(clientId);
    setLines([]);
    const { data, error } = await supabase.rpc("generate_asn_number", { p_client_id: clientId });
    if (data && !error) {
      setFormData((prev) => ({ ...prev, asn_number: data }));
    }
  };
  const regenerateASNNumber = async () => {
    if (!formData.client_id) return;
    const { data, error } = await supabase.rpc("generate_asn_number", { p_client_id: formData.client_id });
    if (data && !error) {
      setFormData((prev) => ({ ...prev, asn_number: data }));
      toast({ title: "ASN number regenerated" });
    }
  };
  const handleQuickSKUSuccess = async (skuId) => {
    if (formData.client_id) {
      await fetchSKUs(formData.client_id);
      if (lines.length === 0) {
        addLine();
        setTimeout(() => {
          updateLine(0, "sku_id", skuId);
        }, 100);
      } else {
        const emptyLineIndex = lines.findIndex((l) => !l.sku_id);
        if (emptyLineIndex >= 0) {
          updateLine(emptyLineIndex, "sku_id", skuId);
        } else {
          addLine();
          setTimeout(() => {
            updateLine(lines.length, "sku_id", skuId);
          }, 100);
        }
      }
      toast({
        title: "SKU Created",
        description: "SKU has been added to the form"
      });
    }
  };
  const addLine = () => {
    setLines([...lines, { sku_id: "", expected_units: 1, attachments: [] }]);
  };
  const removeLine = (index) => {
    setAttachments(attachments.filter((att) => att.forLine !== index));
    setLines(lines.filter((_, i) => i !== index));
  };
  const updateLine = (index, field, value) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };
  const handleFileInput = (e, lineIndex) => {
    const files = Array.from(e.target.files || []);
    addFiles(files, lineIndex);
  };
  const addFiles = (files, lineIndex) => {
    const validFiles = [];
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive"
        });
        continue;
      }
      const preview = URL.createObjectURL(file);
      validFiles.push({ file, preview, forLine: lineIndex });
    }
    setAttachments([...attachments, ...validFiles]);
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const validatedHeader = asnHeaderSchema.parse({
        ...formData,
        carrier: formData.carrier || null,
        tracking_number: formData.tracking_number || null,
        eta: formData.eta || null,
        ship_from: formData.ship_from || null,
        notes: formData.notes || null
      });
      if (lines.length === 0) {
        throw new Error("Please add at least one line item");
      }
      for (let i = 0; i < lines.length; i++) {
        try {
          asnLineSchema.parse({ sku_id: lines[i].sku_id, expected_units: lines[i].expected_units });
        } catch (err) {
          throw new Error(`Line ${i + 1}: ${err.errors[0].message}`);
        }
      }
      const skuIds = lines.map((l) => l.sku_id);
      if (new Set(skuIds).size !== skuIds.length) {
        throw new Error("Duplicate SKUs are not allowed");
      }
      if (asnId) {
        const { error: headerError } = await supabase.from("asn_headers").update({
          asn_number: validatedHeader.asn_number,
          carrier: validatedHeader.carrier,
          tracking_number: validatedHeader.tracking_number,
          eta: validatedHeader.eta,
          ship_from: validatedHeader.ship_from,
          notes: validatedHeader.notes
        }).eq("id", asnId);
        if (headerError) throw headerError;
        await supabase.from("asn_lines").delete().eq("asn_id", asnId);
        const { error: linesError } = await supabase.from("asn_lines").insert(
          lines.map((line) => ({
            asn_id: asnId,
            sku_id: line.sku_id,
            expected_units: line.expected_units
          }))
        );
        if (linesError) throw linesError;
        toast({
          title: "Success",
          description: `ASN ${validatedHeader.asn_number} updated successfully`
        });
      } else {
        const { data: header, error: headerError } = await supabase.from("asn_headers").insert({
          asn_number: validatedHeader.asn_number,
          client_id: validatedHeader.client_id,
          carrier: validatedHeader.carrier,
          tracking_number: validatedHeader.tracking_number,
          eta: validatedHeader.eta,
          ship_from: validatedHeader.ship_from,
          notes: validatedHeader.notes,
          status: "not_received"
        }).select().single();
        if (headerError) throw headerError;
        const { data: insertedLines, error: linesError } = await supabase.from("asn_lines").insert(
          lines.map((line) => ({
            asn_id: header.id,
            sku_id: line.sku_id,
            expected_units: line.expected_units
          }))
        ).select();
        if (linesError) throw linesError;
        for (const attachment of attachments) {
          const filePath = `${header.id}/${Date.now()}-${attachment.file.name}`;
          const { error: uploadError } = await supabase.storage.from("asn-attachments").upload(filePath, attachment.file);
          if (uploadError) {
            console.error("Upload error:", uploadError);
            continue;
          }
          const { data: { publicUrl } } = supabase.storage.from("asn-attachments").getPublicUrl(filePath);
          await supabase.from("asn_attachments").insert({
            asn_id: header.id,
            asn_line_id: attachment.forLine !== void 0 ? insertedLines?.[attachment.forLine]?.id : null,
            file_url: publicUrl,
            filename: attachment.file.name,
            file_size: attachment.file.size,
            mime_type: attachment.file.type
          });
        }
        attachments.forEach((att) => URL.revokeObjectURL(att.preview));
        toast({
          title: "Success",
          description: `ASN ${validatedHeader.asn_number} created successfully`
        });
      }
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create ASN",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      client_id: "",
      asn_number: "",
      carrier: "",
      tracking_number: "",
      eta: "",
      ship_from: "",
      notes: ""
    });
    setLines([]);
    setSKUs([]);
    setAttachments([]);
  };
  attachments.filter((att) => att.forLine === void 0);
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: asnId ? "Edit ASN" : "Create ASN" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "client", children: "Client *" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.client_id,
                onValueChange: handleClientChange,
                disabled: isClientLocked,
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: isClientLocked ? "bg-muted" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select client" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: clients.map((client) => /* @__PURE__ */ jsx(SelectItem, { value: client.id, children: client.company_name }, client.id)) })
                ]
              }
            ),
            isClientLocked && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Client is automatically set to your account" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "asn_number", children: "ASN Number *" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "asn_number",
                  value: formData.asn_number,
                  onChange: (e) => setFormData({ ...formData, asn_number: e.target.value }),
                  placeholder: "Auto-generated",
                  maxLength: 50
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "icon",
                  onClick: regenerateASNNumber,
                  disabled: !formData.client_id,
                  title: "Regenerate ASN number",
                  children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" })
                }
              )
            ] })
          ] })
        ] }),
        formData.client_id && !asnId && /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-4 bg-muted/30 rounded-lg", children: [
          /* @__PURE__ */ jsx(Label, { children: "Load from Template (optional)" }),
          /* @__PURE__ */ jsx(
            TemplateSelector,
            {
              clientId: formData.client_id,
              onSelect: async (template) => {
                await supabase.from("shipment_templates").update({
                  last_used_at: (/* @__PURE__ */ new Date()).toISOString(),
                  use_count: (template.use_count || 0) + 1
                }).eq("id", template.id);
                setFormData({
                  ...formData,
                  carrier: template.carrier || "",
                  ship_from: template.ship_from || "",
                  notes: template.notes || ""
                });
                if (template.shipment_template_lines) {
                  setLines(template.shipment_template_lines.map((line) => ({
                    sku_id: line.sku_id,
                    expected_units: line.expected_units
                  })));
                }
                toast({
                  title: "Template loaded",
                  description: `"${template.template_name}" applied successfully`
                });
              }
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Quickly create ASN from previously saved template" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "carrier", children: "Carrier" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: isCustomCarrier ? "custom" : formData.carrier,
                onValueChange: (value) => {
                  if (value === "custom") {
                    setIsCustomCarrier(true);
                    setFormData({ ...formData, carrier: "" });
                  } else {
                    setIsCustomCarrier(false);
                    setFormData({ ...formData, carrier: value });
                  }
                },
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select carrier" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    COMMON_CARRIERS.map((carrier) => /* @__PURE__ */ jsx(SelectItem, { value: carrier, children: carrier }, carrier)),
                    /* @__PURE__ */ jsx(SelectItem, { value: "custom", children: "Custom..." })
                  ] })
                ]
              }
            ),
            isCustomCarrier && /* @__PURE__ */ jsx(
              Input,
              {
                id: "carrier-custom",
                value: formData.carrier,
                onChange: (e) => setFormData({ ...formData, carrier: e.target.value }),
                placeholder: "Enter custom carrier name",
                maxLength: 100,
                className: "mt-2"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "tracking", children: "Tracking Number" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "tracking",
                  value: formData.tracking_number,
                  onChange: (e) => setFormData({ ...formData, tracking_number: e.target.value }),
                  maxLength: 100,
                  disabled: scannerMode === "scanner"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: scannerMode === "scanner" ? "default" : "outline",
                  onClick: () => {
                    setScannerMode(scannerMode === "scanner" ? "manual" : "scanner");
                  },
                  title: "Scan tracking barcode",
                  children: /* @__PURE__ */ jsx(Scan, { className: "h-4 w-4" })
                }
              )
            ] }),
            scannerMode === "scanner" && /* @__PURE__ */ jsx(
              BarcodeScanner,
              {
                mode: "keyboard",
                onScan: (barcode) => {
                  setFormData({ ...formData, tracking_number: barcode });
                  setScannerMode("manual");
                  toast({ title: "Tracking number scanned" });
                },
                onError: (error) => {
                  toast({ title: "Scan error", description: error, variant: "destructive" });
                },
                placeholder: "Scan tracking barcode...",
                continuous: false
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "eta", children: "ETA" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "eta",
                type: "date",
                value: formData.eta,
                onChange: (e) => setFormData({ ...formData, eta: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "ship_from", children: "Ship From Location" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "ship_from",
                value: formData.ship_from,
                onChange: (e) => setFormData({ ...formData, ship_from: e.target.value }),
                placeholder: "Location",
                maxLength: 500
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Notes" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "notes",
              value: formData.notes,
              onChange: (e) => setFormData({ ...formData, notes: e.target.value }),
              rows: 3,
              maxLength: 2e3,
              className: "resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t pt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx(Label, { children: "Expected Line Items *" }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: addLine,
                disabled: !formData.client_id,
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
                  "Add Line"
                ]
              }
            )
          ] }),
          lines.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "Select a client and add line items" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: lines.map((line, index) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2 p-2 border rounded-lg", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs(
                Select,
                {
                  value: line.sku_id,
                  onValueChange: (value) => updateLine(index, "sku_id", value),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select SKU" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: skus.map((sku) => /* @__PURE__ */ jsxs(SelectItem, { value: sku.id, children: [
                      sku.client_sku,
                      " - ",
                      sku.title
                    ] }, sku.id)) })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "w-32", children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  min: "1",
                  max: "1000000",
                  value: line.expected_units,
                  onChange: (e) => {
                    const value = e.target.value;
                    const parsed = parseInt(value, 10);
                    updateLine(index, "expected_units", !isNaN(parsed) && parsed > 0 ? parsed : 1);
                  },
                  placeholder: "Qty"
                }
              ) }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "icon",
                  onClick: () => setActiveScanLine(activeScanLine === index ? null : index),
                  title: "Scan product barcode",
                  children: /* @__PURE__ */ jsx(Scan, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "icon",
                  onClick: () => document.getElementById(`line-file-${index}`)?.click(),
                  title: "Attach images to this line",
                  children: /* @__PURE__ */ jsx(Paperclip, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `line-file-${index}`,
                  type: "file",
                  accept: "image/jpeg,image/png,image/webp,image/gif,application/pdf",
                  multiple: true,
                  className: "hidden",
                  onChange: (e) => handleFileInput(e, index)
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  onClick: () => removeLine(index),
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            activeScanLine === index && /* @__PURE__ */ jsx("div", { className: "ml-2 p-3 border-2 border-dashed rounded-md bg-muted/30", children: /* @__PURE__ */ jsx(
              BarcodeScanner,
              {
                mode: "keyboard",
                onScan: async (barcode) => {
                  if (!formData.client_id) return;
                  const { data } = await supabase.functions.invoke("barcode-lookup", {
                    body: {
                      barcode,
                      client_id: formData.client_id,
                      context: "asn_line_selection"
                    }
                  });
                  if (data?.found && data.matched_table === "skus") {
                    updateLine(index, "sku_id", data.matched_id);
                    toast({ title: `Added: ${data.data.title}` });
                    setActiveScanLine(null);
                  } else {
                    toast({
                      title: "SKU not found",
                      description: `No SKU found for barcode: ${barcode}`,
                      variant: "destructive"
                    });
                  }
                },
                onError: (error) => {
                  toast({ title: "Scan error", description: error, variant: "destructive" });
                },
                placeholder: "Scan product barcode...",
                continuous: false
              }
            ) })
          ] }, index)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        !asnId && formData.client_id && lines.length > 0 && /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => setShowSaveTemplate(true),
            children: [
              /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
              "Save as Template"
            ]
          }
        ),
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: loading, children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: loading, children: loading ? "Saving..." : asnId ? "Update" : "Create" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ShipmentTemplateDialog,
      {
        open: showSaveTemplate,
        onOpenChange: setShowSaveTemplate,
        clientId: formData.client_id,
        asnData: {
          carrier: formData.carrier,
          ship_from: formData.ship_from,
          notes: formData.notes,
          lines
        },
        skus,
        onSuccess: () => {
          toast({ title: "Template saved successfully" });
        }
      }
    ),
    /* @__PURE__ */ jsx(
      QuickAddSKUModal,
      {
        open: showQuickAddSKU,
        onOpenChange: setShowQuickAddSKU,
        clientId: formData.client_id,
        onSuccess: handleQuickSKUSuccess
      }
    )
  ] });
};
export {
  ASNFormDialog as A,
  BarcodeScanner as B,
  validatePricingDocument as v
};
