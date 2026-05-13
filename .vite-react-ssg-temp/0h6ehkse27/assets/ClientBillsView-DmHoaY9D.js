import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { o as useAuth, l as useToast, s as supabase, B as Button } from "../main.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-WfKgKW48.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { S as StatusBadge } from "./status-badge-D65vJr6c.js";
import { C as Collapsible, a as CollapsibleTrigger, b as CollapsibleContent } from "./collapsible-DUtqt5i7.js";
import { FileText, ChevronDown, ChevronRight, Download } from "lucide-react";
import jsPDF from "jspdf";
import { w as westfieldLogo } from "./westfield-logo-pdf-YyCjah_h.js";
import { a as formatDateRange } from "./dateFormatters-DrRoJsWa.js";
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
import "./badge-BbLwm7hH.js";
import "@radix-ui/react-collapsible";
import "date-fns";
import "date-fns-tz";
const SECTION_ORDER = [
  "Standard Operations",
  "Amazon FBA",
  "Walmart WFS",
  "Self Fulfillment",
  "Storage",
  "Additional Services",
  "Other"
];
const ClientBillsView = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => {
    if (user) {
      fetchData();
    }
    const channel = supabase.channel("client-bills-realtime").on("postgres_changes", { event: "*", schema: "public", table: "bills" }, fetchData).on("postgres_changes", { event: "*", schema: "public", table: "bill_items" }, () => {
      if (selectedBill) fetchBillDetails(selectedBill.id);
    }).on("postgres_changes", { event: "*", schema: "public", table: "payments" }, () => {
      if (selectedBill) fetchBillDetails(selectedBill.id);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedBill?.id]);
  const fetchData = async () => {
    try {
      const { data: client, error: clientError } = await supabase.from("clients").select("*").eq("user_id", user?.id).single();
      if (clientError) throw clientError;
      setClientData(client);
      const { data: billsData, error: billsError } = await supabase.from("bills").select("*").eq("client_id", client.id).order("created_at", { ascending: false });
      if (billsError) throw billsError;
      setBills(billsData || []);
      if (billsData && billsData.length > 0 && !selectedBill) {
        setSelectedBill(billsData[0]);
        await fetchBillDetails(billsData[0].id);
      }
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
  const groupedBills = useMemo(() => {
    const openBills = bills.filter((b) => b.status === "open");
    const closedBills = bills.filter((b) => b.status !== "open");
    const grouped = {};
    closedBills.forEach((bill) => {
      const date = new Date(bill.billing_month);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];
      grouped[year][month].push(bill);
    });
    const sortedYears = Object.keys(grouped).map(Number).sort((a, b) => b - a);
    return { openBills, closedBills: grouped, sortedYears };
  }, [bills]);
  const billItemsBySection = useMemo(() => {
    const grouped = {};
    billItems.forEach((item) => {
      const sectionType = item.section_type || "Standard Operations";
      if (!grouped[sectionType]) grouped[sectionType] = [];
      grouped[sectionType].push(item);
    });
    const sortedSections = Object.keys(grouped).sort((a, b) => {
      const indexA = SECTION_ORDER.indexOf(a);
      const indexB = SECTION_ORDER.indexOf(b);
      const orderA = indexA === -1 ? SECTION_ORDER.length : indexA;
      const orderB = indexB === -1 ? SECTION_ORDER.length : indexB;
      return orderA - orderB;
    });
    return { grouped, sortedSections };
  }, [billItems]);
  const [expandedYears, setExpandedYears] = useState(/* @__PURE__ */ new Set());
  const toggleYear = (year) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };
  const getMonthName = (month) => {
    return new Date(2e3, month, 1).toLocaleDateString("en-US", { month: "long" });
  };
  const fetchBillDetails = async (billId) => {
    try {
      const [{ data: items }, { data: pmts }] = await Promise.all([
        supabase.from("bill_items").select("*").eq("bill_id", billId).order("created_at"),
        supabase.from("payments").select("*").eq("bill_id", billId).order("received_at", { ascending: false })
      ]);
      setBillItems(items || []);
      setPayments(pmts || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleBillSelect = (bill) => {
    setSelectedBill(bill);
    fetchBillDetails(bill.id);
  };
  const formatCurrency = (cents) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(cents / 100);
  };
  const calculateSectionSubtotal = (items) => {
    return items.reduce((sum, item) => sum + Number(item.qty_decimal) * item.unit_price_cents, 0);
  };
  const subtotal = billItems.reduce((sum, item) => sum + Number(item.qty_decimal) * item.unit_price_cents, 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount_cents, 0);
  const balance = subtotal - totalPayments;
  const generatePDF = async () => {
    if (!selectedBill || !clientData) return;
    const doc = new jsPDF();
    const img = new Image();
    img.src = westfieldLogo;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const logoWidth = 30;
    const logoHeight = img.height / img.width * logoWidth;
    doc.addImage(img, "JPEG", (210 - logoWidth) / 2, 10, logoWidth, logoHeight);
    let yPos = 10 + logoHeight + 10;
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Bill Statement", 105, yPos, { align: "center" });
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Client:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(clientData.company_name, 50, yPos);
    if (selectedBill.statement_start_date && selectedBill.statement_end_date) {
      doc.setFont("helvetica", "bold");
      doc.text("Period:", 120, yPos);
      doc.setFont("helvetica", "normal");
      const periodText = formatDateRange(selectedBill.statement_start_date, selectedBill.statement_end_date) || "N/A";
      doc.text(periodText, 140, yPos);
    }
    yPos += 15;
    billItemsBySection.sortedSections.forEach((sectionName) => {
      const sectionItems = billItemsBySection.grouped[sectionName];
      const sectionSubtotal = calculateSectionSubtotal(sectionItems);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(sectionName, 20, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Service", 25, yPos);
      doc.text("Qty", 120, yPos, { align: "right" });
      doc.text("Unit Price", 150, yPos, { align: "right" });
      doc.text("Total", 185, yPos, { align: "right" });
      doc.line(25, yPos + 1, 185, yPos + 1);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      sectionItems.forEach((item) => {
        const lineTotal = Number(item.qty_decimal) * item.unit_price_cents / 100;
        doc.text(item.service_name, 25, yPos);
        doc.text(String(item.qty_decimal), 120, yPos, { align: "right" });
        doc.text(`$${(item.unit_price_cents / 100).toFixed(2)}`, 150, yPos, { align: "right" });
        doc.text(`$${lineTotal.toFixed(2)}`, 185, yPos, { align: "right" });
        yPos += 5;
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
      doc.setFont("helvetica", "bold");
      doc.text(`${sectionName} Subtotal:`, 135, yPos);
      doc.text(`$${(sectionSubtotal / 100).toFixed(2)}`, 185, yPos, { align: "right" });
      yPos += 10;
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
    });
    if (payments.length > 0) {
      yPos += 5;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Payments", 20, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      payments.forEach((payment) => {
        doc.text(`${payment.method} - ${new Date(payment.received_at).toLocaleDateString()}`, 25, yPos);
        doc.text(`-$${(payment.amount_cents / 100).toFixed(2)}`, 185, yPos, { align: "right" });
        yPos += 5;
      });
    }
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 135, yPos);
    doc.text(formatCurrency(subtotal), 185, yPos, { align: "right" });
    yPos += 6;
    doc.text("Total Payments:", 135, yPos);
    doc.text(`-${formatCurrency(totalPayments)}`, 185, yPos, { align: "right" });
    yPos += 6;
    doc.line(135, yPos, 190, yPos);
    yPos += 5;
    doc.setFontSize(12);
    doc.text("Balance Due:", 135, yPos);
    doc.text(formatCurrency(balance), 185, yPos, { align: "right" });
    doc.save(`Bill_${selectedBill.label || "Statement"}.pdf`);
  };
  if (loading) {
    return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center", children: "Loading bills..." }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]", children: [
    /* @__PURE__ */ jsxs(Card, { className: "lg:col-span-1 flex flex-col", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex-shrink-0", children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Bill History" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Your billing statements" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "flex-1 overflow-y-auto space-y-4", children: bills.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center py-4", children: "No bills yet" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        groupedBills.openBills.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-primary", children: "Current Bills" }),
          groupedBills.openBills.map((bill) => /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => handleBillSelect(bill),
              className: `p-3 border rounded-lg cursor-pointer transition-colors ${selectedBill?.id === bill.id ? "bg-primary/5 border-primary" : "hover:bg-accent"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: bill.label || new Date(bill.billing_month).toLocaleDateString("en-US", { month: "long", year: "numeric" }) }),
                  bill.statement_start_date && bill.statement_end_date && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-1", children: formatDateRange(bill.statement_start_date, bill.statement_end_date) })
                ] }),
                /* @__PURE__ */ jsx(StatusBadge, { status: bill.status, className: "text-xs" })
              ] })
            },
            bill.id
          ))
        ] }),
        groupedBills.sortedYears.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
            "Past Bills"
          ] }),
          groupedBills.sortedYears.map((year) => /* @__PURE__ */ jsxs(
            Collapsible,
            {
              open: expandedYears.has(year),
              onOpenChange: () => toggleYear(year),
              children: [
                /* @__PURE__ */ jsx(CollapsibleTrigger, { className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: year }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      Object.values(groupedBills.closedBills[year]).flat().length,
                      " bills"
                    ] }),
                    expandedYears.has(year) ? /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx(CollapsibleContent, { className: "space-y-1 pl-2", children: Object.keys(groupedBills.closedBills[year]).map(Number).sort((a, b) => b - a).map((month) => /* @__PURE__ */ jsx("div", { className: "space-y-1", children: groupedBills.closedBills[year][month].map((bill) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => handleBillSelect(bill),
                    className: `p-2 border rounded-lg cursor-pointer transition-colors text-sm ${selectedBill?.id === bill.id ? "bg-primary/5 border-primary" : "hover:bg-accent"}`,
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsx("span", { children: bill.label || getMonthName(month) }),
                      /* @__PURE__ */ jsx(StatusBadge, { status: bill.status, className: "text-xs" })
                    ] })
                  },
                  bill.id
                )) }, month)) })
              ]
            },
            year
          ))
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "lg:col-span-2 flex flex-col", children: selectedBill ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Bill Statement" }),
          selectedBill.statement_start_date && selectedBill.statement_end_date && /* @__PURE__ */ jsx(CardDescription, { children: formatDateRange(selectedBill.statement_start_date, selectedBill.statement_end_date) })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: generatePDF, variant: "outline", children: [
          /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
          "Download PDF"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "flex-1 overflow-y-auto space-y-6", children: [
        billItemsBySection.sortedSections.length > 0 ? billItemsBySection.sortedSections.map((sectionName) => {
          const sectionItems = billItemsBySection.grouped[sectionName];
          const sectionSubtotal = calculateSectionSubtotal(sectionItems);
          return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b pb-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-base", children: sectionName }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                "Subtotal: ",
                formatCurrency(sectionSubtotal)
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableHead, { children: "Service" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Quantity" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Unit Price" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Total" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: sectionItems.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: item.service_name }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: item.qty_decimal }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: formatCurrency(item.unit_price_cents) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right font-semibold", children: formatCurrency(Number(item.qty_decimal) * item.unit_price_cents) })
              ] }, item.id)) })
            ] })
          ] }, sectionName);
        }) : /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground", children: "No line items for this bill" }),
        payments.length > 0 && /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-base mb-3", children: "Payments" }),
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Method" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Amount" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: payments.map((payment) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: payment.method }),
              /* @__PURE__ */ jsx(TableCell, { children: new Date(payment.received_at).toLocaleDateString() }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right font-semibold", children: formatCurrency(payment.amount_cents) })
            ] }, payment.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-4 border-t", children: /* @__PURE__ */ jsxs("div", { className: "w-64 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { children: "Subtotal:" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: formatCurrency(subtotal) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { children: "Total Payments:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-green-600", children: [
              "-",
              formatCurrency(totalPayments)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-base font-bold border-t pt-2", children: [
            /* @__PURE__ */ jsx("span", { children: "Balance Due:" }),
            /* @__PURE__ */ jsx("span", { className: balance > 0 ? "text-destructive" : "text-green-600", children: formatCurrency(balance) })
          ] })
        ] }) })
      ] })
    ] }) : /* @__PURE__ */ jsx(CardContent, { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Select a bill to view details" }) }) })
  ] });
};
export {
  ClientBillsView as default
};
