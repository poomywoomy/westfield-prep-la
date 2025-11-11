import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trash2, Plus, Download, Lock, Calendar, DollarSign, Wallet, ArrowLeft, ArrowRight, Copy, Mail, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AddBillingPaymentDialog } from "./AddBillingPaymentDialog";
import { AddCustomBillingItemDialog } from "./AddCustomBillingItemDialog";
import { CollapsibleBillSection } from "./CollapsibleBillSection";
import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";
import { formatDateRange } from "@/lib/dateFormatters";
import type { Database } from "@/integrations/supabase/types";

type Bill = Database["public"]["Tables"]["bills"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];
type Quote = Database["public"]["Tables"]["quotes"]["Row"];
type BillItem = Database["public"]["Tables"]["bill_items"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];

interface BillViewProps {
  bill: Bill;
  client: Client;
  onRefresh: () => void;
}

export const BillView = ({ bill, client, onRefresh }: BillViewProps) => {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [statementStartDate, setStatementStartDate] = useState<string>(bill.statement_start_date || "");
  const [statementEndDate, setStatementEndDate] = useState<string>(bill.statement_end_date || "");
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [addCustomItemOpen, setAddCustomItemOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositBalance, setDepositBalance] = useState(0);
  const [cycleDialogOpen, setCycleDialogOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBillData();
  }, [bill.id]);

  useEffect(() => {
    setStatementStartDate(bill.statement_start_date || "");
    setStatementEndDate(bill.statement_end_date || "");
  }, [bill.statement_start_date, bill.statement_end_date]);

  const fetchBillData = async () => {
    try {
      // Fetch client deposit balance
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("deposit_balance_cents")
        .eq("id", client.id)
        .single();

      if (clientError) throw clientError;
      setDepositBalance((clientData?.deposit_balance_cents || 0) / 100);

      // Fetch bill items first to know if we need to auto-populate
      const { data: itemsData, error: itemsError } = await supabase
        .from("bill_items")
        .select("*")
        .eq("bill_id", bill.id)
        .order("created_at");

      if (itemsError) throw itemsError;
      setBillItems(itemsData || []);

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("bill_id", bill.id)
        .order("received_at", { ascending: false });

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);

      // Ensure statement dates are set once based on billing_month if missing
      if (!bill.statement_start_date || !bill.statement_end_date) {
        const bm = new Date(bill.billing_month);
        const start = new Date(bm.getFullYear(), bm.getMonth(), 1);
        const end = new Date(bm.getFullYear(), bm.getMonth() + 1, 0);
        const toYmd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const startStr = toYmd(start);
        const endStr = toYmd(end);
        await supabase.from("bills").update({ statement_start_date: startStr, statement_end_date: endStr }).eq("id", bill.id);
        setStatementStartDate(startStr);
        setStatementEndDate(endStr);
      }

      // Resolve quote: use attached quote if present, otherwise find active or latest quote
      let resolvedQuote: Quote | null = null;

      if (bill.pricing_quote_id) {
        const { data: quoteData, error: quoteError } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", bill.pricing_quote_id)
          .single();
        if (quoteData && !quoteError) {
          resolvedQuote = quoteData;
          setQuote(quoteData);
        }
      } else {
        // Try active quote first
        const { data: activeQuote } = await supabase
          .from("quotes")
          .select("*")
          .eq("client_id", client.id)
          .eq("status", "active")
          .maybeSingle();
        
        if (activeQuote) {
          resolvedQuote = activeQuote;
          setQuote(activeQuote);
        } else {
          // Fallback to most recent quote (including draft)
          const { data: latestQuote } = await supabase
            .from("quotes")
            .select("*")
            .eq("client_id", client.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (latestQuote) {
            resolvedQuote = latestQuote;
            setQuote(latestQuote);
          }
        }
      }

      // If we have a quote and no items yet, auto-attach and populate
      if (resolvedQuote && (itemsData?.length || 0) === 0) {
        if (!bill.pricing_quote_id) {
          await supabase.from("bills").update({ pricing_quote_id: resolvedQuote.id }).eq("id", bill.id);
        }
        await populateFromQuote(resolvedQuote);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 0) return;

    // Optimistic UI update
    setBillItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, qty_decimal: newQty } : item
      )
    );

    try {
      const { error } = await supabase
        .from("bill_items")
        .update({ qty_decimal: newQty })
        .eq("id", itemId);

      if (error) throw error;

      await recalculateBillTotals();
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // Revert on error
      fetchBillData();
    }
  };

  const addServiceFromQuote = async (serviceName: string, unitPrice: number, sectionType: string) => {
    if (!bill?.id) {
      toast({
        title: "Error",
        description: "Bill ID is missing. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Verify bill exists first
      const { data: billCheck, error: checkError } = await supabase
        .from("bills")
        .select("id")
        .eq("id", bill.id)
        .single();

      if (checkError || !billCheck) {
        toast({
          title: "Error",
          description: "Bill not found. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("bill_items").insert({
        bill_id: bill.id,
        service_name: serviceName,
        qty_decimal: 0,
        unit_price_cents: Math.round(unitPrice * 100),
        line_date: new Date().toISOString().split("T")[0],
        source: "manual",
        section_type: sectionType,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service added",
      });

      fetchBillData();
      await recalculateBillTotals();
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteLineItem = async (itemId: string) => {
    if (!confirm("Delete this line item?")) return;

    try {
      const { error } = await supabase.from("bill_items").delete().eq("id", itemId);

      if (error) throw error;

      setBillItems((prev) => prev.filter((item) => item.id !== itemId));
      await recalculateBillTotals();
      onRefresh();

      toast({
        title: "Success",
        description: "Line item deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Removed - deletePayment is defined later with enhanced functionality

  const recalculateBillTotals = async () => {
    const subtotal = billItems.reduce(
      (sum, item) => sum + (Number(item.qty_decimal) * item.unit_price_cents),
      0
    );

    const totalPayments = payments.reduce(
      (sum, payment) => sum + payment.amount_cents,
      0
    );

    const amountDue = subtotal - totalPayments;

    try {
      const { error } = await supabase
        .from("bills")
        .update({
          subtotal_cents: subtotal,
          amount_due_cents: amountDue,
        })
        .eq("id", bill.id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error recalculating totals:", error);
    }
  };

  const saveStatementDates = async () => {
    if (!statementStartDate || !statementEndDate) {
      toast({
        title: "Validation Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (new Date(statementStartDate) > new Date(statementEndDate)) {
      toast({
        title: "Validation Error",
        description: "Start date must be before end date",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("bills")
        .update({ 
          statement_start_date: statementStartDate,
          statement_end_date: statementEndDate,
        })
        .eq("id", bill.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Statement dates saved and will show on client side",
      });

      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Add logo
    const img = new Image();
    img.src = westfieldLogo;
    await new Promise((resolve) => { img.onload = resolve; });
    
    const logoWidth = 30;
    const logoHeight = (img.height / img.width) * logoWidth;
    doc.addImage(img, 'JPEG', (210 - logoWidth) / 2, 10, logoWidth, logoHeight);

    let yPos = 10 + logoHeight + 10;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Bill Statement", 105, yPos, { align: "center" });
    yPos += 15;

    // Client info (full contact details)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 20, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.text(client.contact_name || client.company_name, 20, yPos);
    yPos += 4;
    doc.text(client.company_name, 20, yPos);
    yPos += 4;
    doc.text(`Phone: ${client.phone_number || 'N/A'}`, 20, yPos);
    yPos += 4;
    doc.text(`Email: ${client.email || 'N/A'}`, 20, yPos);
    yPos += 8;

    // Statement date (always use manual dates, no fallback)
    if (!statementStartDate || !statementEndDate) {
      toast({
        title: "Error",
        description: "Statement dates must be set before generating PDF",
        variant: "destructive",
      });
      return;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text("Statement Period:", 20, yPos);
    doc.setFont("helvetica", "normal");
    const dateRange = formatDateRange(statementStartDate, statementEndDate) || "N/A";
    doc.text(dateRange, 70, yPos);
    yPos += 10;

    // Line items grouped by section
    Object.entries(billItemsBySection).forEach(([sectionType, items]) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Section header
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(sectionType, 20, yPos);
      yPos += 6;

      // Table header
      doc.setFontSize(10);
      doc.text("Service", 20, yPos);
      doc.text("Qty", 120, yPos, { align: "right" });
      doc.text("Unit Price", 150, yPos, { align: "right" });
      doc.text("Total", 185, yPos, { align: "right" });
      doc.line(20, yPos + 1, 190, yPos + 1);
      yPos += 6;

      // Items
      doc.setFont("helvetica", "normal");
      items.forEach(item => {
        const lineTotal = Number(item.qty_decimal) * item.unit_price_cents / 100;
        doc.text(item.service_name, 20, yPos);
        doc.text(String(item.qty_decimal), 120, yPos, { align: "right" });
        doc.text(`$${(item.unit_price_cents / 100).toFixed(2)}`, 150, yPos, { align: "right" });
        doc.text(`$${lineTotal.toFixed(2)}`, 185, yPos, { align: "right" });
        yPos += 5;

        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
      });

      yPos += 8;
    });

    // Payments
    if (payments.length > 0) {
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Payments", 20, yPos);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      payments.forEach(payment => {
        doc.text(`${payment.method} - ${new Date(payment.received_at).toLocaleDateString()}`, 20, yPos);
        doc.text(`-$${(payment.amount_cents / 100).toFixed(2)}`, 185, yPos, { align: "right" });
        yPos += 5;
      });
    }

    // Totals
    yPos += 10;
    const subtotal = billItems.reduce((sum, item) => sum + (Number(item.qty_decimal) * item.unit_price_cents), 0) / 100;
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount_cents, 0) / 100;
    const balance = subtotal - totalPayments;

    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 135, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, 185, yPos, { align: "right" });
    yPos += 6;

    doc.text("Total Payments:", 135, yPos);
    doc.text(`-$${totalPayments.toFixed(2)}`, 185, yPos, { align: "right" });
    yPos += 6;

    doc.line(135, yPos, 190, yPos);
    yPos += 5;

    doc.setFontSize(12);
    doc.text("Balance Due:", 135, yPos);
    doc.text(`$${balance.toFixed(2)}`, 185, yPos, { align: "right" });

    const fileName = `Bill_${client.company_name.replace(/\s+/g, "_")}_${bill.label || new Date(bill.billing_month).toLocaleDateString()}.pdf`;
    doc.save(fileName);
  };

  const closeBill = async () => {
    if (!statementStartDate || !statementEndDate) {
      toast({
        title: "Validation Error",
        description: "Please set statement date range before closing",
        variant: "destructive",
      });
      return;
    }

    setCloseConfirmOpen(true);
  };

  const confirmCloseBill = async () => {
    try {
      setLoading(true);
      setCloseConfirmOpen(false);

      // Generate PDF first
      await generatePDF();

      // Close the bill
      const { error } = await supabase
        .from("bills")
        .update({
          status: "closed",
          closed_at: new Date().toISOString(),
        })
        .eq("id", bill.id);

      if (error) throw error;

      toast({
        title: "Billing Cycle Closed",
        description: "PDF generated and bill locked. View it in Bill History to reopen or download.",
      });

      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const reopenBill = async () => {
    if (!confirm("Reopen this bill? This will allow editing line items and payments again.")) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("bills")
        .update({
          status: "open",
          closed_at: null,
        })
        .eq("id", bill.id);

      if (error) throw error;

      toast({
        title: "Bill Reopened",
        description: "You can now edit this bill again",
      });

      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (paymentId: string) => {
    if (!confirm("Remove this payment? The balance due will be updated.")) return;

    try {
      // Get payment details before deleting
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) return;

      const isDepositApplication = payment.method === "deposit_application" || payment.payment_type === "deposit_application";

      // Delete payment
      const { error } = await supabase.from("payments").delete().eq("id", paymentId);
      if (error) throw error;

      // If it was a deposit application, restore the deposit balance
      if (isDepositApplication) {
        const { error: depositError } = await supabase
          .from("clients")
          .update({
            deposit_balance_cents: Math.round((depositBalance + (payment.amount_cents / 100)) * 100),
          })
          .eq("id", client.id);

        if (depositError) throw depositError;
      }

      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      await recalculateBillTotals();
      fetchBillData();
      onRefresh();

      toast({
        title: "Payment Removed",
        description: isDepositApplication ? "Deposit balance restored" : "Payment deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const populateFromQuote = async (q: Quote) => {
    if (!bill?.id) {
      toast({
        title: "Error",
        description: "Bill ID is missing. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Verify bill exists first
      const { data: billCheck, error: checkError } = await supabase
        .from("bills")
        .select("id")
        .eq("id", bill.id)
        .single();

      if (checkError || !billCheck) {
        toast({
          title: "Error",
          description: "Bill not found. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      const data = q.quote_data as any;
      const now = new Date();
      const lineItems: any[] = [];
      const existingNames = new Set(billItems.map((i) => i.service_name));

      const pushItem = (name: string, price: number, sectionType: string) => {
        if (!existingNames.has(name)) {
          lineItems.push({
            bill_id: bill.id,
            service_name: name,
            qty_decimal: 0,
            unit_price_cents: Math.round(Number(price) * 100),
            line_date: now.toISOString().split("T")[0],
            source: "manual",
            section_type: sectionType,
          });
        }
      };

      if (data?.standard_operations && Array.isArray(data.standard_operations)) {
        data.standard_operations.forEach((op: any) => pushItem(op.service_name, op.service_price, "Standard Operations"));
      }
      if (data?.fulfillment_sections && Array.isArray(data.fulfillment_sections)) {
        data.fulfillment_sections.forEach((section: any) => {
          if (section.items && Array.isArray(section.items)) {
            section.items.forEach((item: any) => pushItem(item.service_name, item.service_price, section.type));
          }
        });
      }
      // Backward compatibility: some quotes may store services in a flat array
      if (data?.services && Array.isArray(data.services)) {
        data.services.forEach((svc: any) => {
          pushItem(svc.service_name, svc.service_price, svc.section_type || "Standard Operations");
        });
      }

      if (lineItems.length === 0) {
        toast({ title: "Nothing to add", description: "All services already exist on this bill." });
        return;
      }

      console.log("Attempting to insert line items:", lineItems);
      const { data: insertData, error } = await supabase.from("bill_items").insert(lineItems).select();
      
      if (error) {
        console.error("Line items insert error:", error);
        throw error;
      }

      console.log("Line items inserted successfully:", insertData);
      toast({ title: "Added from quote", description: `${lineItems.length} services added` });
      await fetchBillData();
      await recalculateBillTotals();
      onRefresh();
    } catch (error: any) {
      console.error("populateFromQuote error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetBill = async () => {
    if (!confirm("⚠️ CAUTION: Reset Bill?\n\nThis will DELETE all line items and payments, then repopulate from quote/pricing with qty=0. Statement dates will be preserved.\n\nThis action cannot be undone.")) return;

    setLoading(true);
    try {
      // Delete all line items
      await supabase.from("bill_items").delete().eq("bill_id", bill.id);

      // Delete all payments
      await supabase.from("payments").delete().eq("bill_id", bill.id);

      const itemsToInsert: any[] = [];

      // Re-populate from quote if available
      if (quote) {
        const quoteData = quote.quote_data as any;

        // Add Standard Operations
        if (quoteData.standard_operations) {
          quoteData.standard_operations.forEach((service: any) => {
            itemsToInsert.push({
              bill_id: bill.id,
              service_name: service.service_name,
              service_code: service.service_code || null,
              unit_price_cents: Math.round((service.service_price || 0) * 100),
              qty_decimal: 0,
              section_type: "Standard Operations",
              source: "manual",
            });
          });
        }

        // Add fulfillment sections
        if (quoteData.fulfillment_sections) {
          quoteData.fulfillment_sections.forEach((section: any) => {
            section.items?.forEach((service: any) => {
              itemsToInsert.push({
                bill_id: bill.id,
                service_name: service.service_name,
                service_code: service.service_code || null,
                unit_price_cents: Math.round((service.service_price || 0) * 100),
                qty_decimal: 0,
                section_type: section.type,
                source: "manual",
              });
            });
          });
        }
      } else {
        // Fallback to custom_pricing if no quote
        const { data: customPricing } = await supabase
          .from("custom_pricing")
          .select("*")
          .eq("client_id", client.id);

        if (customPricing && customPricing.length > 0) {
          customPricing.forEach((pricing: any) => {
            itemsToInsert.push({
              bill_id: bill.id,
              service_name: pricing.service_name,
              unit_price_cents: Math.round(pricing.price_per_unit * 100),
              qty_decimal: 0,
              section_type: pricing.section_type || "Standard Operations",
              source: "manual",
              note: pricing.notes,
            });
          });
        }
      }

      if (itemsToInsert.length > 0) {
        console.log("Attempting to insert reset items:", itemsToInsert);
        const { data: insertData, error: insertError } = await supabase.from("bill_items").insert(itemsToInsert).select();
        
        if (insertError) {
          console.error("Reset bill insert error:", insertError);
          throw insertError;
        }
        console.log("Reset items inserted successfully:", insertData);
      }

      // Recalculate totals
      await recalculateBillTotals();

      toast({
        title: "Bill Reset",
        description: itemsToInsert.length > 0 
          ? `All items and payments cleared, ${itemsToInsert.length} services re-populated.`
          : "Bill cleared. No pricing found to populate.",
      });

      await fetchBillData();
    } catch (error: any) {
      console.error("Error resetting bill:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startNewBillCycle = () => {
    setCycleDialogOpen(true);
  };

  // Extract services from quote grouped by section
  const quoteServicesBySection: Array<{ sectionType: string; services: Array<{ serviceName: string; unitPrice: number }> }> = quote
    ? (() => {
        const data = quote.quote_data as any;
        const sections: Array<{ sectionType: string; services: Array<{ serviceName: string; unitPrice: number }> }> = [];
        
        if (data.standard_operations && Array.isArray(data.standard_operations) && data.standard_operations.length > 0) {
          sections.push({
            sectionType: "Standard Operations",
            services: data.standard_operations.map((op: any) => ({
              serviceName: op.service_name,
              unitPrice: op.service_price,
            })),
          });
        }
        
        if (data.fulfillment_sections && Array.isArray(data.fulfillment_sections)) {
          data.fulfillment_sections.forEach((section: any) => {
            if (section.items && Array.isArray(section.items) && section.items.length > 0) {
              sections.push({
                sectionType: section.type,
                services: section.items.map((item: any) => ({
                  serviceName: item.service_name,
                  unitPrice: item.service_price,
                })),
              });
            }
          });
        }
        
        return sections;
      })()
    : [];

  // Group bill items by section type with Standard Operations first
  const billItemsBySection = billItems.reduce((acc, item) => {
    const sectionType = item.section_type || "Standard Operations";
    if (!acc[sectionType]) {
      acc[sectionType] = [];
    }
    acc[sectionType].push(item);
    return acc;
  }, {} as Record<string, BillItem[]>);

  // Sort sections with Standard Operations always first
  const sortedSections = Object.keys(billItemsBySection).sort((a, b) => {
    if (a === "Standard Operations") return -1;
    if (b === "Standard Operations") return 1;
    return a.localeCompare(b);
  });

  const subtotal = billItems.reduce(
    (sum, item) => sum + (Number(item.qty_decimal) * item.unit_price_cents / 100),
    0
  );

  const totalPayments = payments.reduce(
    (sum, payment) => sum + payment.amount_cents / 100,
    0
  );

  const balance = subtotal - totalPayments;

  const isClosed = bill.status === "closed";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "closed": return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
      case "sent": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "paid": return "bg-green-500/10 text-green-600 dark:text-green-400";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  const paymentProgress = subtotal > 0 ? (totalPayments / subtotal) * 100 : 0;

  const quickApplyDeposit = async () => {
    if (depositBalance <= 0 || balance <= 0) return;
    
    const applyAmount = Math.min(depositBalance, balance);
    
    if (!confirm(`Apply $${applyAmount.toFixed(2)} from deposit balance to this bill?`)) return;

    try {
      setLoading(true);
      const amountCents = Math.round(applyAmount * 100);

      await supabase.from("payments").insert({
        client_id: client.id,
        bill_id: bill.id,
        amount_cents: amountCents,
        received_at: new Date().toISOString().split('T')[0],
        method: "deposit_application",
        payment_type: "deposit_application",
      });

      await supabase.from("clients").update({
        deposit_balance_cents: Math.round((depositBalance - applyAmount) * 100),
      }).eq("id", client.id);

      toast({ title: "Deposit Applied", description: `$${applyAmount.toFixed(2)} applied from deposit` });
      
      fetchBillData();
      await recalculateBillTotals();
      onRefresh();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Bill Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>{client.company_name}</CardTitle>
                <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {statementStartDate && statementEndDate 
                  ? formatDateRange(statementStartDate, statementEndDate)
                  : (bill.label || new Date(bill.billing_month).toLocaleDateString("en-US", { month: "long", year: "numeric" }))}
              </CardDescription>
            </div>
            
            {/* Financial Summary */}
            <div className="text-right space-y-1">
              <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Balance Due</div>
              <Progress value={paymentProgress} className="h-2 w-32" />
              <div className="text-xs text-muted-foreground">
                ${totalPayments.toFixed(2)} / ${subtotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Deposit Balance Banner */}
          {depositBalance > 0 && !isClosed && (
            <div className="flex items-center justify-between p-3 mt-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Deposit Balance Available</span>
                <Badge variant="secondary" className="text-base font-bold">
                  ${depositBalance.toFixed(2)}
                </Badge>
              </div>
              <Button
                size="sm"
                onClick={quickApplyDeposit}
                disabled={loading || balance <= 0}
                variant="outline"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Quick Apply to Bill
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Quote Warning */}
          {!quote && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300">
              No active quote assigned. Click 'Reset Bill' to populate from custom pricing if available.
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={generatePDF} variant="outline" disabled={!statementStartDate || !statementEndDate}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            {isClosed ? (
              <>
                <Button onClick={reopenBill} variant="outline" disabled={loading}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reopen Bill
                </Button>
                <Button onClick={startNewBillCycle} variant="default" disabled={loading}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start New Bill
                </Button>
              </>
            ) : (
              <>
                <Button onClick={closeBill} disabled={loading || !statementStartDate || !statementEndDate} variant="default">
                  <Lock className="mr-2 h-4 w-4" />
                  Close Billing Cycle
                </Button>
                {quote && (
                  <Button onClick={() => populateFromQuote(quote)} variant="outline" disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" />
                    Populate from Quote
                  </Button>
                )}
                <Button onClick={resetBill} variant="outline" disabled={loading}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Bill
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isClosed ? "Bill is closed. Reopen to make changes." : "Set statement dates before closing the billing cycle."}
          </p>
        </CardContent>
      </Card>

      {/* Line Items with Collapsible Sections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            {!isClosed && (
              <Button onClick={() => setAddCustomItemOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Line
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {sortedSections.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No line items yet. Services should have been auto-populated from the quote.
            </div>
          ) : (
            <div className="space-y-2">
              {sortedSections.map((sectionType) => {
                const sectionItems = billItemsBySection[sectionType];
                const quoteSectionServices = quoteServicesBySection.find(
                  (s) => s.sectionType === sectionType
                )?.services || [];
                
                return (
                  <CollapsibleBillSection
                    key={sectionType}
                    sectionType={sectionType}
                    items={sectionItems}
                    isClosed={isClosed}
                    onUpdateQuantity={updateQuantity}
                    onDeleteItem={deleteLineItem}
                    quoteServices={quoteSectionServices}
                    onAddService={(name, price) => addServiceFromQuote(name, price, sectionType)}
                    loading={loading}
                  />
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-end items-center gap-4">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Payments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payments & Deposits</CardTitle>
              <CardDescription>Payment history and deposit applications</CardDescription>
            </div>
            {!isClosed && (
              <Button onClick={() => setAddPaymentOpen(true)} size="sm">
                <DollarSign className="mr-2 h-4 w-4" />
                Add Payment
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Running Balance</TableHead>
                {!isClosed && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, idx) => {
                const isDeposit = payment.method === "deposit_application" || payment.payment_type === "deposit_application";
                let runningBalance = subtotal;
                for (let i = payments.length - 1; i >= idx; i--) {
                  runningBalance -= payments[i].amount_cents / 100;
                }
                
                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {isDeposit ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                          <Wallet className="mr-1 h-3 w-3" />
                          Deposit
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Payment</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {isDeposit ? "Deposit Application" : payment.method}
                    </TableCell>
                    <TableCell>{new Date(payment.received_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                      -${(payment.amount_cents / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${runningBalance.toFixed(2)}
                    </TableCell>
                    {!isClosed && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePayment(payment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isClosed ? 5 : 6} className="text-center text-muted-foreground py-6">
                    No payments yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-6 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>Total Payments:</span>
                <span className="font-medium">-${totalPayments.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Balance Due:</span>
                <span>${balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddBillingPaymentDialog
        open={addPaymentOpen}
        onOpenChange={setAddPaymentOpen}
        billId={bill.id}
        clientId={client.id}
        onSuccess={() => {
          fetchBillData();
          recalculateBillTotals();
          onRefresh();
        }}
      />

      <AddCustomBillingItemDialog
        open={addCustomItemOpen}
        onOpenChange={setAddCustomItemOpen}
        billId={bill.id}
        onSuccess={() => {
          fetchBillData();
          recalculateBillTotals();
          onRefresh();
        }}
      />

      <Dialog open={cycleDialogOpen} onOpenChange={setCycleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Billing Cycle</DialogTitle>
            <DialogDescription>
              Please close this modal and click the client card again to start a new billing cycle.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setCycleDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close This Bill?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Once closed:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>The client will no longer see this bill</li>
                <li>Line items cannot be edited until reopened</li>
                <li>A PDF will be generated automatically</li>
                <li>You can reopen this bill from Bill History if needed</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseBill}>
              Close Bill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};