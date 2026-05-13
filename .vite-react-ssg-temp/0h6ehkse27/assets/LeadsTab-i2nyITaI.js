import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { l as useToast, B as Button, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, s as supabase } from "../main.mjs";
import { T as Textarea } from "./select-Cb0hy2VC.js";
import { I as Input } from "./input-CSM87NBF.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-WfKgKW48.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { Loader2, Sparkles, AlertTriangle, Check, Copy, Eye, Trash2 } from "lucide-react";
import { f as formatDateTimePT } from "./dateFormatters-DrRoJsWa.js";
import ReactMarkdown from "react-markdown";
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
import "@radix-ui/react-select";
import "date-fns";
import "date-fns-tz";
function LeadsTab() {
  const { toast } = useToast();
  const [rawData, setRawData] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [ediDetected, setEdiDetected] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewLead, setViewLead] = useState(null);
  const fetchLeads = async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(50);
    if (!error && data) setLeads(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchLeads();
  }, []);
  const handleAnalyze = async () => {
    if (!rawData.trim()) {
      toast({ title: "Paste lead data", description: "Please paste the lead information first.", variant: "destructive" });
      return;
    }
    setAnalyzing(true);
    setAnalysis("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const response = await fetch(
        `${"https://gqnvkecmxjijrxhggcro.supabase.co"}/functions/v1/analyze-lead`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            raw_data: rawData,
            company_name: companyName || extractCompanyName(rawData)
          })
        }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }
      const result = await response.json();
      setAnalysis(result.analysis);
      setEdiDetected(result.edi_detected || false);
      if (result.saved) fetchLeads();
      toast({ title: "Analysis complete", description: `Lead "${result.lead?.company_name || companyName}" analyzed successfully.` });
    } catch (err) {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };
  const extractCompanyName = (text) => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      if (/^company$/i.test(lines[i]) && lines[i + 1]) return lines[i + 1];
    }
    return lines[0] || "Unknown";
  };
  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: "Analysis copied to clipboard." });
    setTimeout(() => setCopied(false), 2e3);
  };
  const handleDelete = async (id) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete lead.", variant: "destructive" });
    } else {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast({ title: "Deleted", description: "Lead removed." });
    }
  };
  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
    }
  };
  const statusColor = (s) => {
    if (s === "accepted") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Lead Analyzer" }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Paste Lead Information" }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Company name (auto-detected if left empty)",
            value: companyName,
            onChange: (e) => setCompanyName(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            placeholder: "Paste the full lead data here (company info, volumes, services, storage requirements, etc.)...",
            value: rawData,
            onChange: (e) => setRawData(e.target.value),
            className: "min-h-[200px] font-mono text-sm"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { onClick: handleAnalyze, disabled: analyzing || !rawData.trim(), children: [
            analyzing ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 mr-2" }),
            analyzing ? "Analyzing..." : "Analyze Lead"
          ] }),
          rawData && /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
            setRawData("");
            setCompanyName("");
            setAnalysis("");
            setEdiDetected(false);
          }, children: "Clear" })
        ] })
      ] })
    ] }),
    ediDetected && /* @__PURE__ */ jsx(Card, { className: "border-red-400 bg-red-50 dark:bg-red-950/30 dark:border-red-800", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 py-4", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-red-800 dark:text-red-300", children: "⚠️ EDI Requirement Detected" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 dark:text-red-400", children: "This lead mentions EDI integration in their requirements. Confirm EDI capability before accepting." })
      ] })
    ] }) }),
    analysis && (() => {
      const parts = analysis.split("---RESPONSE---");
      const summary = parts[0]?.trim() || "";
      const response = parts[1]?.trim() || "";
      return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        summary && /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Summary" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground whitespace-pre-wrap", children: summary }) })
        ] }),
        response && /* @__PURE__ */ jsxs(Card, { className: "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg text-emerald-800 dark:text-emerald-300", children: "Ready to Copy" }),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCopy(response), className: "border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:hover:bg-emerald-900", children: [
              copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 mr-1" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4 mr-1" }),
              copied ? "Copied" : "Copy Response"
            ] })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-sm whitespace-pre-wrap", children: response }) })
        ] }),
        !response && summary && /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "AI Analysis" }),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCopy(analysis), children: [
              copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 mr-1" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4 mr-1" }),
              copied ? "Copied" : "Copy"
            ] })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-none dark:prose-invert", children: /* @__PURE__ */ jsx(ReactMarkdown, { children: analysis }) }) })
        ] })
      ] });
    })(),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Lead History" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-4", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }) }) : leads.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No leads analyzed yet." }) : /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Company" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: leads.map((lead) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: lead.company_name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: formatDateTimePT(lead.created_at) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Badge,
            {
              variant: statusColor(lead.status),
              className: "cursor-pointer",
              onClick: () => {
                const next = lead.status === "pending" ? "accepted" : lead.status === "accepted" ? "rejected" : "pending";
                handleStatusChange(lead.id, next);
              },
              children: lead.status
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => setViewLead(lead), title: "View", children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }),
            lead.ai_analysis && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleCopy(lead.ai_analysis), title: "Copy", children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(lead.id), title: "Delete", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
          ] }) })
        ] }, lead.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!viewLead, onOpenChange: () => setViewLead(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: viewLead?.company_name }) }),
      viewLead?.ai_analysis && (() => {
        const parts = viewLead.ai_analysis.split("---RESPONSE---");
        const summary = parts[0]?.trim() || "";
        const responseText = parts[1]?.trim() || "";
        return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          summary && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-sm mb-2", children: "Summary" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground whitespace-pre-wrap", children: summary })
          ] }),
          responseText ? /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-lg p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-sm text-emerald-800 dark:text-emerald-300", children: "Acceptance Response" }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCopy(responseText), className: "border-emerald-300 dark:border-emerald-700", children: [
                copied ? /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 mr-1" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3 mr-1" }),
                copied ? "Copied" : "Copy"
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm whitespace-pre-wrap", children: responseText })
          ] }) : /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-none dark:prose-invert", children: /* @__PURE__ */ jsx(ReactMarkdown, { children: viewLead.ai_analysis }) })
        ] });
      })()
    ] }) })
  ] });
}
export {
  LeadsTab,
  LeadsTab as default
};
