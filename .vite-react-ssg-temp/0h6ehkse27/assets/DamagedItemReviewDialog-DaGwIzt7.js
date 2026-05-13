import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { m as cn, B as Button, l as useToast, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, g as DialogDescription, C as DialogFooter, s as supabase } from "../main.mjs";
import { T as Textarea } from "./select-Cb0hy2VC.js";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle, X, ZoomOut, ZoomIn, ChevronLeft, ChevronRight, AlertTriangle, Package } from "lucide-react";
import { L as Label } from "./label-B2r_8dgk.js";
import { r as resignPhotoUrls } from "./photoUtils-pehMpqiu.js";
import { createPortal } from "react-dom";
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(RadioGroupPrimitive.Root, { className: cn("grid gap-2", className), ...props, ref });
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(Circle, { className: "h-2.5 w-2.5 fill-current text-current" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
const PhotoLightbox = ({ photos, initialIndex = 0, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
  }, [open, initialIndex]);
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          break;
        case "ArrowRight":
          e.preventDefault();
          setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1));
          break;
        case "+":
        case "=":
          e.preventDefault();
          setZoom((prev) => Math.min(5, prev + 0.5));
          break;
        case "-":
          e.preventDefault();
          setZoom((prev) => Math.max(0.5, prev - 0.5));
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [open, photos.length, onClose]);
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) {
        setZoom((prev) => Math.min(5, prev + 0.25));
      } else {
        setZoom((prev) => Math.max(0.5, prev - 0.25));
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => document.removeEventListener("wheel", handleWheel, { capture: true });
  }, [open]);
  if (!open || photos.length === 0) return null;
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      e.preventDefault();
      onClose();
    }
  };
  const handleCloseClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };
  const handleZoomIn = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setZoom((prev) => Math.min(5, prev + 0.5));
  };
  const handleZoomOut = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setZoom((prev) => Math.max(0.5, prev - 0.5));
  };
  const handlePrevious = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };
  const handleNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1));
  };
  const content = /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed inset-0 flex items-center justify-center",
      style: {
        zIndex: 999999,
        backgroundColor: "rgba(0, 0, 0, 0.95)"
      },
      onClick: handleBackdropClick,
      onMouseDown: (e) => e.stopPropagation(),
      onPointerDown: (e) => e.stopPropagation(),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Photo viewer",
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "absolute top-4 right-4 text-white hover:bg-white/20 z-10 h-10 w-10",
            onClick: handleCloseClick,
            "aria-label": "Close photo viewer",
            children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 text-white/80 text-sm font-medium bg-black/50 px-3 py-1.5 rounded-md", children: [
          currentIndex + 1,
          " / ",
          photos.length
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 rounded-lg px-4 py-2.5 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "text-white hover:bg-white/20 h-9 w-9",
              onClick: handleZoomOut,
              disabled: zoom <= 0.5,
              "aria-label": "Zoom out",
              children: /* @__PURE__ */ jsx(ZoomOut, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "text-white text-sm font-medium min-w-[65px] text-center", children: [
            Math.round(zoom * 100),
            "%"
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "text-white hover:bg-white/20 h-9 w-9",
              onClick: handleZoomIn,
              disabled: zoom >= 5,
              "aria-label": "Zoom in",
              children: /* @__PURE__ */ jsx(ZoomIn, { className: "h-5 w-5" })
            }
          )
        ] }),
        photos.length > 1 && currentIndex > 0 && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12",
            onClick: handlePrevious,
            "aria-label": "Previous photo",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-8 w-8" })
          }
        ),
        photos.length > 1 && currentIndex < photos.length - 1 && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12",
            onClick: handleNext,
            "aria-label": "Next photo",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-8 w-8" })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "max-w-[90vw] max-h-[85vh] overflow-auto flex items-center justify-center",
            onClick: (e) => e.stopPropagation(),
            style: { cursor: zoom > 1 ? "grab" : "default" },
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: photos[currentIndex],
                alt: `Photo ${currentIndex + 1} of ${photos.length}`,
                className: "max-w-none select-none transition-transform duration-200 ease-out",
                style: {
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  maxHeight: zoom === 1 ? "85vh" : "none",
                  maxWidth: zoom === 1 ? "90vw" : "none"
                },
                draggable: false
              }
            )
          }
        )
      ]
    }
  );
  return createPortal(content, document.body);
};
function DamagedItemReviewDialog({
  open,
  onOpenChange,
  discrepancy,
  onSuccess
}) {
  const { toast } = useToast();
  const [decision, setDecision] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayPhotos, setDisplayPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  useEffect(() => {
    if (open && discrepancy.qc_photo_urls && discrepancy.qc_photo_urls.length > 0) {
      setPhotosLoading(true);
      resignPhotoUrls(discrepancy.qc_photo_urls).then(setDisplayPhotos).finally(() => setPhotosLoading(false));
    } else {
      setDisplayPhotos([]);
      setPhotosLoading(false);
    }
  }, [open, discrepancy.qc_photo_urls]);
  const handleSubmit = async () => {
    if (!decision) {
      toast({
        title: "Decision Required",
        description: "Please select what to do with the damaged items",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("damaged_item_decisions").update({
        decision,
        client_notes: notes,
        submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
        status: "submitted"
        // Change status to 'submitted' when client responds
      }).eq("id", discrepancy.id);
      if (error) throw error;
      toast({
        title: "Decision Submitted",
        description: "Your decision has been sent to the warehouse team."
      });
      onSuccess?.();
      onOpenChange(false);
      setDecision("");
      setNotes("");
    } catch (error) {
      console.error("Error submitting decision:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit decision",
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
        className: "max-w-2xl max-h-[90vh] overflow-y-auto",
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
              /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-yellow-600" }),
              "Review Damaged Items"
            ] }),
            /* @__PURE__ */ jsx(DialogDescription, { className: "sr-only", children: "Review QC photos and decide what to do with damaged items" })
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
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-yellow-600 mt-2", children: [
                  discrepancy.damaged_qty,
                  " damaged units"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "mb-2 block", children: "QC Photos (click to enlarge)" }),
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
              )) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No QC photos available" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "mb-3 block", children: "What should we do with these damaged items?" }),
              /* @__PURE__ */ jsxs(RadioGroup, { value: decision, onValueChange: setDecision, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded hover:bg-muted/50", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "discard", id: "discard" }),
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "discard", className: "flex-1 cursor-pointer", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Discard" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Dispose of damaged items" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded hover:bg-muted/50", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "return_to_inventory", id: "return_to_inventory" }),
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "return_to_inventory", className: "flex-1 cursor-pointer", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Return to Inventory" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Add back to sellable stock" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded hover:bg-muted/50", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "return_to_sender", id: "return_to_sender" }),
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "return_to_sender", className: "flex-1 cursor-pointer", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Return to Sender" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Ship back to supplier" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded hover:bg-muted/50", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "rework", id: "rework" }),
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "rework", className: "flex-1 cursor-pointer", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Rework/Repair" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Attempt to fix or repackage" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "notes", className: "mb-2 block", children: "Additional Instructions (Optional)" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "notes",
                  value: notes,
                  onChange: (e) => setNotes(e.target.value),
                  placeholder: "Any special instructions for the admin...",
                  rows: 3
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: loading, children: "Cancel" }),
            /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: loading || !decision, children: loading ? "Submitting..." : "Submit Decision" })
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
export {
  DamagedItemReviewDialog as D,
  PhotoLightbox as P
};
