import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-WfKgKW48.js";
import { l as useToast, s as supabase, B as Button } from "../main.mjs";
import { Receipt, Plus, Eye, Download, Trash2 } from "lucide-react";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { w as westfieldLogo } from "./westfield-logo-pdf-YyCjah_h.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D7ZcK1Wa.js";
import { C as CreateOneTimeQuoteDialog, g as generateOneTimeQuotePDF } from "./CreateOneTimeQuoteDialog-guE5zHie.js";
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
import "@radix-ui/react-alert-dialog";
import "./input-CSM87NBF.js";
import "./label-B2r_8dgk.js";
import "@radix-ui/react-label";
import "./select-Cb0hy2VC.js";
import "@radix-ui/react-select";
import "jspdf";
const OneTimeQuotesTab = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [deleteQuoteId, setDeleteQuoteId] = useState(null);
  useEffect(() => {
    fetchClients();
    fetchQuotes();
  }, []);
  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("company_name");
    setClients(data || []);
  };
  const fetchQuotes = async () => {
    const { data, error } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: "Failed to fetch quotes", variant: "destructive" });
      return;
    }
    const oneTime = (data || []).filter((q) => q.quote_data?.quote_type === "one_time");
    setQuotes(oneTime);
  };
  const handleDelete = async () => {
    if (!deleteQuoteId) return;
    try {
      const { error } = await supabase.from("quotes").delete().eq("id", deleteQuoteId);
      if (error) throw error;
      toast({ title: "Deleted", description: "One-time quote deleted." });
      setDeleteQuoteId(null);
      fetchQuotes();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };
  const generatePDF = async (quote) => {
    const d = quote.quote_data || {};
    const doc = await generateOneTimeQuotePDF({
      clientName: d.client_name || "Prospective Client",
      contactName: d.contact_name,
      email: d.email,
      phone: d.phone,
      date: new Date(quote.created_at).toLocaleDateString(),
      projectName: d.project_name || "Untitled Project",
      projectDescription: d.project_description,
      estimatedStartDate: d.estimated_start_date,
      estimatedEndDate: d.estimated_end_date,
      lineItems: d.line_items || [],
      additionalComments: d.additional_comments
    }, westfieldLogo);
    doc.save(`project-quote-${d.client_name || "unassigned"}-${Date.now()}.pdf`);
    toast({ title: "PDF Generated" });
  };
  const getClientName = (id) => clients.find((c) => c.id === id)?.company_name;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Receipt, { className: "h-5 w-5" }),
            "One-Time Project Quotes"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Single-project quotes for one-off work (audits, reworks, seasonal projects)" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: () => {
          setEditingQuote(null);
          setIsDialogOpen(true);
        }, children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Create One-Time Quote"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: quotes.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center py-8", children: 'No one-time project quotes yet. Click "Create One-Time Quote" to create one.' }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: quotes.map((quote) => {
        const d = quote.quote_data || {};
        const clientName = getClientName(quote.client_id);
        const total = (d.line_items || []).reduce((s, i) => s + i.quantity * i.unit_price, 0);
        return /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: d.project_name || "Untitled Project" }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "One-Time Project Quote" }),
              quote.client_id ? /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-green-500/10 text-green-700 border-green-500/20", children: clientName }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20", children: "Unassigned" })
            ] }),
            d.client_name && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "For: ",
              d.client_name
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Created: ",
              new Date(quote.created_at).toLocaleDateString(),
              " · ",
              "Total: ",
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
                "$",
                total.toFixed(2)
              ] })
            ] }),
            d.project_description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: d.project_description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
              setEditingQuote(quote);
              setIsDialogOpen(true);
            }, children: [
              /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-1" }),
              " View"
            ] }),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => generatePDF(quote), children: [
              /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-1" }),
              " PDF"
            ] }),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => setDeleteQuoteId(quote.id), children: [
              /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-1" }),
              " Delete"
            ] })
          ] })
        ] }) }, quote.id);
      }) }) })
    ] }),
    /* @__PURE__ */ jsx(
      CreateOneTimeQuoteDialog,
      {
        open: isDialogOpen,
        onOpenChange: (o) => {
          setIsDialogOpen(o);
          if (!o) setEditingQuote(null);
        },
        existingQuote: editingQuote,
        onSaved: fetchQuotes
      }
    ),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteQuoteId, onOpenChange: () => setDeleteQuoteId(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Project Quote" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure you want to delete this one-time project quote? This cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleDelete, children: "Delete" })
      ] })
    ] }) })
  ] });
};
export {
  OneTimeQuotesTab as default
};
