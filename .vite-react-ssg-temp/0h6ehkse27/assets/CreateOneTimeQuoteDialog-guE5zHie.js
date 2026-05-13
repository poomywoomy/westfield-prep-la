import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { l as useToast, s as supabase, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, B as Button, C as DialogFooter } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea } from "./select-Cb0hy2VC.js";
import { Plus, Trash2, Download, Save } from "lucide-react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-WfKgKW48.js";
import { w as westfieldLogo } from "./westfield-logo-pdf-YyCjah_h.js";
import jsPDF from "jspdf";
const NAVY = { r: 13, g: 33, b: 66 };
const ACCENT_GRAY = { r: 245, g: 245, b: 248 };
const MEDIUM_GRAY = { r: 120, g: 120, b: 120 };
function checkPageBreak(doc, y, threshold = 270) {
  if (y > threshold) {
    doc.addPage();
    return 20;
  }
  return y;
}
async function generateOneTimeQuotePDF(data, logoSrc) {
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
  doc.text("PROJECT QUOTE", 105, 22, { align: "center" });
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
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(20, y - 1, 3, 8, "F");
  doc.setFontSize(12);
  doc.setFont(void 0, "bold");
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text("Project Details", 26, y + 5);
  y += 12;
  doc.setFontSize(10);
  doc.setFont(void 0, "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("Project:", 24, y);
  doc.setFont(void 0, "normal");
  doc.text(data.projectName, 50, y);
  y += 6;
  if (data.estimatedStartDate || data.estimatedEndDate) {
    doc.setFont(void 0, "bold");
    doc.text("Timeline:", 24, y);
    doc.setFont(void 0, "normal");
    const timeline = [data.estimatedStartDate, data.estimatedEndDate].filter(Boolean).join(" → ");
    doc.text(timeline, 50, y);
    y += 6;
  }
  if (data.projectDescription) {
    doc.setFont(void 0, "bold");
    doc.text("Description:", 24, y);
    y += 5;
    doc.setFont(void 0, "normal");
    doc.setFontSize(9);
    const splitDesc = doc.splitTextToSize(data.projectDescription, 165);
    doc.text(splitDesc, 24, y);
    y += splitDesc.length * 4 + 6;
  } else {
    y += 4;
  }
  y = checkPageBreak(doc, y, 240);
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(20, y - 1, 3, 8, "F");
  doc.setFontSize(12);
  doc.setFont(void 0, "bold");
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text("Line Items", 26, y + 5);
  y += 10;
  doc.setFillColor(ACCENT_GRAY.r, ACCENT_GRAY.g, ACCENT_GRAY.b);
  doc.rect(20, y, 170, 7, "F");
  doc.setFontSize(8);
  doc.setFont(void 0, "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("SERVICE", 24, y + 5);
  doc.text("QTY", 130, y + 5, { align: "right" });
  doc.text("UNIT", 155, y + 5, { align: "right" });
  doc.text("TOTAL", 186, y + 5, { align: "right" });
  y += 10;
  let total = 0;
  for (const item of data.lineItems) {
    y = checkPageBreak(doc, y);
    const lineTotal = item.quantity * item.unit_price;
    total += lineTotal;
    doc.setFontSize(10);
    doc.setFont(void 0, "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(item.service_name, 24, y);
    doc.setFont(void 0, "normal");
    doc.text(item.quantity.toString(), 130, y, { align: "right" });
    doc.text(`$${item.unit_price.toFixed(2)}`, 155, y, { align: "right" });
    doc.text(`$${lineTotal.toFixed(2)}`, 186, y, { align: "right" });
    y += 5;
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
  }
  y = checkPageBreak(doc, y, 250);
  y += 4;
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(110, y, 80, 10, "F");
  doc.setFontSize(11);
  doc.setFont(void 0, "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("PROJECT TOTAL", 114, y + 6.5);
  doc.text(`$${total.toFixed(2)}`, 186, y + 6.5, { align: "right" });
  y += 16;
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
  y = checkPageBreak(doc, y, 240);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(20, y, 190, y);
  y += 6;
  doc.setFontSize(7.5);
  doc.setFont(void 0, "italic");
  doc.setTextColor(100, 100, 100);
  const disclaimer = "This is a one-time project quote. Pricing is based on the project scope and quantities described above. Should the scope change materially, Westfield Prep Center reserves the right to revise this quote. Please confirm in writing to proceed with the project.";
  const split = doc.splitTextToSize(disclaimer, 170);
  doc.text(split, 20, y);
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
const ONE_TIME_SERVICES = [
  "Pallet Receiving",
  "Carton Receiving",
  "FNSKU Label",
  "Polybox+Label",
  "Bubble Wrap",
  "Bundling",
  "Additional Label",
  "Kitting",
  "Palletizing",
  "Pick & Pack",
  "Single Product",
  "Hourly Rate (VAS / Project Labor)",
  "Materials (Boxes / Cartons / Polybags)",
  "Custom Entry"
];
const ONE_TIME_NOTES = {
  "Pallet Receiving": "One-time receipt and check-in of pallet(s) for this project",
  "Carton Receiving": "One-time receipt and check-in of carton(s) for this project",
  "FNSKU Label": "Per-unit FNSKU labeling applied during this project",
  "Polybox+Label": "Per-unit polybag + label applied during this project",
  "Bubble Wrap": "Per-unit bubble wrapping for this project",
  "Bundling": "Per-bundle assembly for this project",
  "Additional Label": "Per-unit additional labeling beyond standard for this project",
  "Kitting": "Per-kit assembly for this project",
  "Palletizing": "Per-pallet build & wrap for this project",
  "Pick & Pack": "Per-order pick & pack for this project",
  "Single Product": "Per-order single-item pick & pack for this project",
  "Hourly Rate (VAS / Project Labor)": "Per-hour project labor for value-added services",
  "Materials (Boxes / Cartons / Polybags)": "Project materials charged at Westfield pricing"
};
const ONE_TIME_DEFAULT_PRICES = {
  "Pallet Receiving": 50,
  "Carton Receiving": 3,
  "FNSKU Label": 0.3,
  "Polybox+Label": 0.5,
  "Bubble Wrap": 0.4,
  "Bundling": 0.75,
  "Additional Label": 0.15,
  "Kitting": 1,
  "Palletizing": 25,
  "Pick & Pack": 2.5,
  "Single Product": 1.5,
  "Hourly Rate (VAS / Project Labor)": 45,
  "Materials (Boxes / Cartons / Polybags)": 0
};
function CreateOneTimeQuoteDialog({ open, onOpenChange, existingQuote, onSaved }) {
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("none");
  const [manualClientName, setManualClientName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (open) {
      supabase.from("clients").select("id, company_name, contact_name, email, phone_number").order("company_name").then(({ data }) => {
        setClients(data || []);
      });
    }
  }, [open]);
  useEffect(() => {
    if (existingQuote && open) {
      const d = existingQuote.quote_data || {};
      setSelectedClientId(existingQuote.client_id || "none");
      setManualClientName(d.client_name || "");
      setContactName(d.contact_name || "");
      setEmail(d.email || "");
      setPhone(d.phone || "");
      setProjectName(d.project_name || "");
      setProjectDescription(d.project_description || "");
      setStartDate(d.estimated_start_date || "");
      setEndDate(d.estimated_end_date || "");
      setAdditionalComments(d.additional_comments || "");
      setLineItems((d.line_items || []).map((i) => ({ ...i, id: crypto.randomUUID() })));
    }
  }, [existingQuote, open]);
  const resetForm = () => {
    setSelectedClientId("none");
    setManualClientName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setProjectName("");
    setProjectDescription("");
    setStartDate("");
    setEndDate("");
    setAdditionalComments("");
    setLineItems([]);
  };
  const handleClientChange = (id) => {
    setSelectedClientId(id);
    if (id !== "none") {
      const c = clients.find((c2) => c2.id === id);
      if (c) {
        setManualClientName(c.company_name || "");
        setContactName(c.contact_name || "");
        setEmail(c.email || "");
        setPhone(c.phone_number || "");
      }
    }
  };
  const addLineItem = () => {
    setLineItems([...lineItems, { id: crypto.randomUUID(), service_name: "", quantity: 1, unit_price: 0, notes: "", is_custom: false }]);
  };
  const updateLineItem = (id, field, value) => {
    setLineItems(lineItems.map((i) => i.id === id ? { ...i, [field]: value } : i));
  };
  const handleServiceSelect = (id, selected) => {
    setLineItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      if (selected === "Custom Entry") {
        return { ...i, service_name: "", is_custom: true };
      }
      const next = { ...i, service_name: selected, is_custom: false };
      if (!i.notes || i.notes.trim() === "") {
        next.notes = ONE_TIME_NOTES[selected] || "";
      }
      if (!i.unit_price || i.unit_price === 0) {
        next.unit_price = ONE_TIME_DEFAULT_PRICES[selected] ?? 0;
      }
      return next;
    }));
  };
  const removeLineItem = (id) => {
    setLineItems(lineItems.filter((i) => i.id !== id));
  };
  const total = lineItems.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const buildQuoteData = () => ({
    quote_type: "one_time",
    client_name: manualClientName,
    contact_name: contactName,
    email,
    phone,
    project_name: projectName,
    project_description: projectDescription,
    estimated_start_date: startDate,
    estimated_end_date: endDate,
    additional_comments: additionalComments,
    line_items: lineItems.map(({ id, ...rest }) => {
      const { is_custom, ...clean } = rest;
      return clean;
    }),
    total
  });
  const handleSave = async () => {
    if (!projectName.trim()) {
      toast({ title: "Project name required", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        client_id: selectedClientId !== "none" ? selectedClientId : null,
        quote_data: buildQuoteData(),
        status: "draft"
      };
      if (existingQuote?.id) {
        const { error } = await supabase.from("quotes").update(payload).eq("id", existingQuote.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("quotes").insert(payload);
        if (error) throw error;
      }
      toast({ title: "Saved", description: "One-time quote saved successfully." });
      onSaved?.();
      onOpenChange(false);
      resetForm();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGeneratePDF = async () => {
    if (!projectName.trim()) {
      toast({ title: "Project name required", variant: "destructive" });
      return;
    }
    try {
      setIsSubmitting(true);
      const doc = await generateOneTimeQuotePDF({
        clientName: manualClientName || "Prospective Client",
        contactName: contactName || void 0,
        email: email || void 0,
        phone: phone || void 0,
        date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
        projectName,
        projectDescription: projectDescription || void 0,
        estimatedStartDate: startDate || void 0,
        estimatedEndDate: endDate || void 0,
        lineItems: lineItems.map(({ id, ...rest }) => {
          const { is_custom, ...clean } = rest;
          return clean;
        }),
        additionalComments: additionalComments || void 0
      }, westfieldLogo);
      doc.save(`project-quote-${(manualClientName || projectName).replace(/\s/g, "-")}-${Date.now()}.pdf`);
      toast({ title: "PDF Generated", description: "Project quote downloaded." });
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: (o) => {
    if (!o) resetForm();
    onOpenChange(o);
  }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
      existingQuote ? "Edit" : "Create",
      " One-Time Project Quote"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Client" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Assign to existing client (optional)" }),
            /* @__PURE__ */ jsxs(Select, { value: selectedClientId, onValueChange: handleClientChange, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a client or leave unassigned" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "— Unassigned (Prospect) —" }),
                clients.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.id, children: c.company_name }, c.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Company Name" }),
              /* @__PURE__ */ jsx(Input, { value: manualClientName, onChange: (e) => setManualClientName(e.target.value), placeholder: "Company name" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Contact Name" }),
              /* @__PURE__ */ jsx(Input, { value: contactName, onChange: (e) => setContactName(e.target.value), placeholder: "Contact name" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Email" }),
              /* @__PURE__ */ jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Phone" }),
              /* @__PURE__ */ jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "Phone" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Project Details" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Project Name *" }),
            /* @__PURE__ */ jsx(Input, { value: projectName, onChange: (e) => setProjectName(e.target.value), placeholder: "e.g. Q4 Inventory Audit – 12 pallets" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Project Description" }),
            /* @__PURE__ */ jsx(Textarea, { value: projectDescription, onChange: (e) => setProjectDescription(e.target.value), placeholder: "Describe the scope of the one-time project...", rows: 3 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Estimated Start Date" }),
              /* @__PURE__ */ jsx(Input, { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Estimated End Date" }),
              /* @__PURE__ */ jsx(Input, { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Line Items" }),
          /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", onClick: addLineItem, variant: "secondary", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
            " Add Item"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
          lineItems.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: 'No line items yet. Click "Add Item" to begin.' }),
          lineItems.map((item) => {
            const isCustom = item.is_custom || item.service_name && !ONE_TIME_SERVICES.includes(item.service_name);
            const selectValue = isCustom ? "Custom Entry" : item.service_name || "";
            return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr,80px,100px,auto] gap-2 items-start border-b pb-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Service" }),
                /* @__PURE__ */ jsxs(Select, { value: selectValue, onValueChange: (v) => handleServiceSelect(item.id, v), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a service..." }) }),
                  /* @__PURE__ */ jsx(SelectContent, { className: "bg-popover z-50", children: ONE_TIME_SERVICES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
                ] }),
                isCustom && /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: item.service_name,
                    onChange: (e) => updateLineItem(item.id, "service_name", e.target.value),
                    placeholder: "Custom service name",
                    className: "text-xs"
                  }
                ),
                /* @__PURE__ */ jsx(Textarea, { value: item.notes || "", onChange: (e) => updateLineItem(item.id, "notes", e.target.value), placeholder: "Notes / description (auto-filled, editable)", rows: 2, className: "text-xs" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Qty" }),
                /* @__PURE__ */ jsx(Input, { type: "number", min: "0", step: "1", value: item.quantity, onChange: (e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Unit Price" }),
                /* @__PURE__ */ jsx(Input, { type: "number", min: "0", step: "0.01", value: item.unit_price, onChange: (e) => updateLineItem(item.id, "unit_price", parseFloat(e.target.value) || 0) })
              ] }),
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeLineItem(item.id), className: "mt-5", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
            ] }, item.id);
          }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase", children: "Project Total" }),
            /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold", children: [
              "$",
              total.toFixed(2)
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Additional Comments" }),
        /* @__PURE__ */ jsx(Textarea, { value: additionalComments, onChange: (e) => setAdditionalComments(e.target.value), placeholder: "Optional comments or terms", rows: 3 })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: isSubmitting, children: "Cancel" }),
      /* @__PURE__ */ jsxs(Button, { variant: "secondary", onClick: handleGeneratePDF, disabled: isSubmitting, children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-1" }),
        " Download PDF"
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: handleSave, disabled: isSubmitting, children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 mr-1" }),
        " Save Quote"
      ] })
    ] })
  ] }) });
}
export {
  CreateOneTimeQuoteDialog as C,
  generateOneTimeQuotePDF as g
};
