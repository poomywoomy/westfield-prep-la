import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { m as cn, l as useToast, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, B as Button, C as DialogFooter, s as supabase } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea } from "./select-Cb0hy2VC.js";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { X, Package, Upload } from "lucide-react";
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const SKUFormDialog = ({ open, onClose, sku, clients, isClientView = false, presetClientId }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    client_id: "",
    client_sku: "",
    internal_sku: "",
    asin: "",
    upc: "",
    ean: "",
    title: "",
    brand: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    has_expiration: false,
    has_lot_tracking: false,
    status: "active",
    notes: "",
    low_stock_threshold: "",
    image_url: ""
  });
  useEffect(() => {
    if (sku) {
      setFormData({
        client_id: sku.client_id,
        client_sku: sku.client_sku,
        internal_sku: sku.internal_sku || "",
        asin: sku.asin || "",
        upc: sku.upc || "",
        ean: sku.ean || "",
        title: sku.title,
        brand: sku.brand || "",
        weight: sku.weight?.toString() || "",
        length: sku.length?.toString() || "",
        width: sku.width?.toString() || "",
        height: sku.height?.toString() || "",
        has_expiration: sku.has_expiration,
        has_lot_tracking: sku.has_lot_tracking,
        status: sku.status,
        notes: sku.notes || "",
        low_stock_threshold: sku.low_stock_threshold?.toString() || "",
        image_url: sku.image_url || ""
      });
      setImagePreview(sku.image_url || null);
    } else {
      setFormData({
        client_id: presetClientId || "",
        client_sku: "",
        internal_sku: "",
        asin: "",
        upc: "",
        ean: "",
        title: "",
        brand: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        has_expiration: false,
        has_lot_tracking: false,
        status: "active",
        notes: "",
        low_stock_threshold: "",
        image_url: ""
      });
      setImagePreview(null);
    }
  }, [sku, open]);
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, or GIF image",
        variant: "destructive"
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }
    setUploading(true);
    try {
      const clientId = formData.client_id || presetClientId;
      if (!clientId) {
        throw new Error("Please select a client first");
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${clientId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("sku-images").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("sku-images").getPublicUrl(fileName);
      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);
      toast({
        title: "Image uploaded",
        description: "Product image has been uploaded successfully"
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: "" });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      client_id: formData.client_id,
      client_sku: formData.client_sku,
      internal_sku: formData.internal_sku || formData.client_sku,
      asin: formData.asin || null,
      upc: formData.upc || null,
      ean: formData.ean || null,
      title: formData.title,
      brand: formData.brand || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      length: formData.length ? parseFloat(formData.length) : null,
      width: formData.width ? parseFloat(formData.width) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      has_expiration: formData.has_expiration,
      has_lot_tracking: formData.has_lot_tracking,
      status: formData.status,
      notes: formData.notes || null,
      low_stock_threshold: formData.low_stock_threshold ? parseInt(formData.low_stock_threshold) : null,
      image_url: formData.image_url || null
    };
    const { error } = sku ? await supabase.from("skus").update(payload).eq("id", sku.id) : await supabase.from("skus").insert(payload);
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `SKU ${sku ? "updated" : "created"} successfully`
      });
      onClose();
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: sku ? "Edit SKU" : "Add New SKU" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Product Image" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-24 h-24 border rounded-lg overflow-hidden bg-muted flex items-center justify-center relative", children: imagePreview ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: imagePreview,
                alt: "Product",
                className: "w-full h-full object-cover"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "destructive",
                size: "icon",
                className: "absolute top-1 right-1 h-6 w-6",
                onClick: handleRemoveImage,
                children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
              }
            )
          ] }) : /* @__PURE__ */ jsx(Package, { className: "h-8 w-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/jpeg,image/png,image/webp,image/gif",
                onChange: handleImageUpload,
                className: "hidden",
                id: "sku-image-upload"
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => fileInputRef.current?.click(),
                disabled: uploading || !formData.client_id && !presetClientId,
                children: [
                  /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4 mr-2" }),
                  uploading ? "Uploading..." : "Upload Image"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "JPG, PNG, WebP, GIF (max 10MB). ",
              !formData.client_id && !presetClientId && "Select client first."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        !isClientView && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "client_id", children: "Client *" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: formData.client_id,
              onValueChange: (value) => setFormData({ ...formData, client_id: value }),
              disabled: !!sku || !!presetClientId,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select client" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: clients.map((client) => /* @__PURE__ */ jsx(SelectItem, { value: client.id, children: client.company_name }, client.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "client_sku", children: "Client SKU *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "client_sku",
              value: formData.client_sku,
              onChange: (e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  client_sku: value,
                  internal_sku: formData.internal_sku ? formData.internal_sku : value
                });
              },
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "internal_sku", children: "Internal SKU (Warehouse) *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "internal_sku",
              value: formData.internal_sku,
              onChange: (e) => setFormData({ ...formData, internal_sku: e.target.value }),
              required: true,
              placeholder: "e.g., WH-12345"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Used internally; prefilled from Client SKU." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "asin", children: "ASIN" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "asin",
              value: formData.asin,
              onChange: (e) => setFormData({ ...formData, asin: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "upc", children: "UPC" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "upc",
              value: formData.upc,
              onChange: (e) => setFormData({ ...formData, upc: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "ean", children: "EAN" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "ean",
              value: formData.ean,
              onChange: (e) => setFormData({ ...formData, ean: e.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Title *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "title",
            value: formData.title,
            onChange: (e) => setFormData({ ...formData, title: e.target.value }),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "brand", children: "Brand" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "brand",
            value: formData.brand,
            onChange: (e) => setFormData({ ...formData, brand: e.target.value })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "length", children: "Length" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "length",
              type: "number",
              step: "0.01",
              value: formData.length,
              onChange: (e) => setFormData({ ...formData, length: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "width", children: "Width" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "width",
              type: "number",
              step: "0.01",
              value: formData.width,
              onChange: (e) => setFormData({ ...formData, width: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "height", children: "Height" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "height",
              type: "number",
              step: "0.01",
              value: formData.height,
              onChange: (e) => setFormData({ ...formData, height: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "weight", children: "Weight" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "weight",
              type: "number",
              step: "0.01",
              value: formData.weight,
              onChange: (e) => setFormData({ ...formData, weight: e.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "has_expiration", children: "Has Expiration Date" }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: "has_expiration",
              checked: formData.has_expiration,
              onCheckedChange: (checked) => setFormData({ ...formData, has_expiration: checked })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "has_lot_tracking", children: "Has Lot Tracking" }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: "has_lot_tracking",
              checked: formData.has_lot_tracking,
              onCheckedChange: (checked) => setFormData({ ...formData, has_lot_tracking: checked })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "status", children: "Status" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: formData.status,
            onValueChange: (value) => setFormData({ ...formData, status: value }),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "active", children: "Active" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "inactive", children: "Inactive" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "lowStockThreshold", children: "Low Stock Threshold Override" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "lowStockThreshold",
            type: "number",
            min: "0",
            value: formData.low_stock_threshold,
            onChange: (e) => setFormData({ ...formData, low_stock_threshold: e.target.value }),
            placeholder: "Leave empty to use client default"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Override the client's default threshold for this SKU" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Notes" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "notes",
            value: formData.notes,
            onChange: (e) => setFormData({ ...formData, notes: e.target.value }),
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, children: loading ? "Saving..." : sku ? "Update" : "Create" })
      ] })
    ] })
  ] }) });
};
export {
  SKUFormDialog as S,
  Switch as a
};
