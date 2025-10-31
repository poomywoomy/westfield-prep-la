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
import { AddBillingPaymentDialog } from "./AddBillingPaymentDialog";
import { AddCustomBillingItemDialog } from "./AddCustomBillingItemDialog";
import { CollapsibleBillSection } from "./CollapsibleBillSection";
import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";
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
  const [clientQuotes, setClientQuotes] = useState<Quote[]>([]);
  const [statementStartDate, setStatementStartDate] = useState<string>(bill.statement_start_date || "");
  const [statementEndDate, setStatementEndDate] = useState<string>(bill.statement_end_date || "");
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [addCustomItemOpen, setAddCustomItemOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositBalance, setDepositBalance] = useState(0);
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

      // Fetch bill items
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

      // Fetch quotes for this client
      const { data: quotesData, error: quotesListError } = await supabase
        .from("quotes")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });

      if (quotesListError) throw quotesListError;
      setClientQuotes(quotesData || []);

      // Fetch assigned quote if any
      if (bill.pricing_quote_id) {
        const assigned = quotesData?.find((q) => q.id === bill.pricing_quote_id) || null;
        if (assigned) {
          setQuote(assigned);
        } else {
          const { data: quoteData, error: quoteError } = await supabase
            .from("quotes")
            .select("*")
            .eq("id", bill.pricing_quote_id)
            .single();

          if (quoteError) throw quoteError;
          setQuote(quoteData);
        }
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

    try {
      const { error } = await supabase
        .from("bill_items")
        .update({ qty_decimal: newQty })
        .eq("id", itemId);

      if (error) throw error;

      setBillItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, qty_decimal: newQty } : item
        )
      );

      await recalculateBillTotals();
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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

  const deletePayment = async (paymentId: string) => {
    if (!confirm("Delete this payment?")) return;

    try {
      const { error } = await supabase.from("payments").delete().eq("id", paymentId);

      if (error) throw error;

      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      await recalculateBillTotals();
      onRefresh();

      toast({
        title: "Success",
        description: "Payment deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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

    // Client and date info
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Client:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(client.company_name, 50, yPos);
    doc.setFont("helvetica", "bold");
    doc.text("Statement Date:", 120, yPos);
    doc.setFont("helvetica", "normal");
    const dateRange = statementStartDate && statementEndDate 
      ? `${new Date(statementStartDate).toLocaleDateString()} - ${new Date(statementEndDate).toLocaleDateString()}`
      : new Date().toLocaleDateString();
    doc.text(dateRange, 165, yPos);
    yPos += 15;

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

    if (!confirm("Close this bill? This will generate and download the PDF.")) return;

    try {
      setLoading(true);

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
        title: "Success",
        description: "Bill closed and PDF downloaded",
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
            source: "quote",
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

      if (lineItems.length === 0) {
        toast({ title: "Nothing to add", description: "All services already exist on this bill." });
        return;
      }

      const { error } = await supabase.from("bill_items").insert(lineItems);
      if (error) throw error;

      toast({ title: "Added from quote", description: `${lineItems.length} services added` });
      await fetchBillData();
      await recalculateBillTotals();
      onRefresh();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const updatePricingQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({ pricing_quote_id: quoteId })
        .eq("id", bill.id);
      if (error) throw error;

      const selected = clientQuotes.find((q) => q.id === quoteId) || null;
      setQuote(selected);

      toast({ title: "Quote assigned", description: "Pricing will follow this quote" });

      if (billItems.length === 0 && selected) {
        await populateFromQuote(selected);
      }
      onRefresh();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteBill = async () => {
    if (!confirm("Delete this bill and all its items and payments?")) return;
    try {
      setLoading(true);
      await supabase.from("bill_items").delete().eq("bill_id", bill.id);
      await supabase.from("payments").delete().eq("bill_id", bill.id);
      const { error } = await supabase.from("bills").delete().eq("id", bill.id);
      if (error) throw error;
      toast({ title: "Bill deleted" });
      onRefresh();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
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

  // Group bill items by section type
  const billItemsBySection = billItems.reduce((acc, item) => {
    const sectionType = item.section_type || "Standard Operations";
    if (!acc[sectionType]) {
      acc[sectionType] = [];
    }
    acc[sectionType].push(item);
    return acc;
  }, {} as Record<string, BillItem[]>);

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
              <CardDescription>
                {bill.label || new Date(bill.billing_month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardDescription>
              {statementStartDate && statementEndDate && (
                <p className="text-xs text-muted-foreground">
                  {new Date(statementStartDate).toLocaleDateString()} - {new Date(statementEndDate).toLocaleDateString()}
                </p>
              )}
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
          {/* Statement Date Range */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="statement-start">Statement Start Date *</Label>
              <Input
                id="statement-start"
                type="date"
                value={statementStartDate}
                onChange={(e) => setStatementStartDate(e.target.value)}
                disabled={isClosed}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="statement-end">Statement End Date *</Label>
              <Input
                id="statement-end"
                type="date"
                value={statementEndDate}
                onChange={(e) => setStatementEndDate(e.target.value)}
                disabled={isClosed}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={saveStatementDates} disabled={isClosed || !statementStartDate || !statementEndDate} className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Save Dates
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Date range will display on client side automatically
          </p>

          <div className="text-right">
            <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Balance Due</div>
          </div>

          {/* Pricing Quote */}
          {!isClosed && (
            <div>
              <Label>Pricing Quote</Label>
              <div className="flex gap-2 mt-1">
                <Select value={quote?.id || ""} onValueChange={updatePricingQuote}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a quote" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientQuotes.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {(q.memo || `Quote ${q.id.slice(0,8)}`)} - {q.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  disabled={!quote}
                  onClick={async () => {
                    if (quote) await populateFromQuote(quote);
                  }}
                >
                  Add All Services
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Adds services from the selected quote with quantity 0.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={generatePDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            {!isClosed && (
              <>
                <Button onClick={closeBill} disabled={loading || !statementStartDate || !statementEndDate}>
                  <Lock className="mr-2 h-4 w-4" />
                  Close Bill
                </Button>
                <Button onClick={deleteBill} variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Bill
                </Button>
              </>
            )}
          </div>
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
          {Object.keys(billItemsBySection).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No line items yet. {quote && "Add services from the quote below."}
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(billItemsBySection).map(([sectionType, items]) => {
                const quoteSectionServices = quoteServicesBySection.find(
                  (s) => s.sectionType === sectionType
                )?.services || [];
                
                return (
                  <CollapsibleBillSection
                    key={sectionType}
                    sectionType={sectionType}
                    items={items}
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

      {/* Dialogs */}
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
    </div>
  );
};