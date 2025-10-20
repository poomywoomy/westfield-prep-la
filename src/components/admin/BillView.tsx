import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Download, Lock, Calendar, DollarSign } from "lucide-react";
import { AddBillingPaymentDialog } from "./AddBillingPaymentDialog";
import { AddCustomBillingItemDialog } from "./AddCustomBillingItemDialog";
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
  const [statementDate, setStatementDate] = useState<string>(bill.statement_date || "");
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [addCustomItemOpen, setAddCustomItemOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBillData();
  }, [bill.id]);

  useEffect(() => {
    setStatementDate(bill.statement_date || "");
  }, [bill.statement_date]);

  const fetchBillData = async () => {
    try {
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

      // Fetch quote if bill has one
      if (bill.pricing_quote_id) {
        const { data: quoteData, error: quoteError } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", bill.pricing_quote_id)
          .single();

        if (quoteError) throw quoteError;
        setQuote(quoteData);
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

  const addServiceFromQuote = async (serviceName: string, unitPrice: number) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("bill_items").insert({
        bill_id: bill.id,
        service_name: serviceName,
        qty_decimal: 0,
        unit_price_cents: Math.round(unitPrice * 100),
        line_date: new Date().toISOString().split("T")[0],
        source: "manual",
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

  const saveStatementDate = async () => {
    if (!statementDate) {
      toast({
        title: "Validation Error",
        description: "Please select a statement date",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("bills")
        .update({ statement_date: statementDate })
        .eq("id", bill.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Statement date saved and will show on client side",
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
    doc.text(statementDate || new Date().toLocaleDateString(), 165, yPos);
    yPos += 15;

    // Line items table
    doc.setFont("helvetica", "bold");
    doc.text("Service", 20, yPos);
    doc.text("Qty", 120, yPos, { align: "right" });
    doc.text("Unit Price", 150, yPos, { align: "right" });
    doc.text("Total", 185, yPos, { align: "right" });
    doc.line(20, yPos + 1, 190, yPos + 1);
    yPos += 6;

    doc.setFont("helvetica", "normal");
    billItems.forEach(item => {
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

    yPos += 5;

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
    if (!statementDate) {
      toast({
        title: "Validation Error",
        description: "Please set a statement date before closing",
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

  // Extract services from quote
  const quoteServices: Array<{ serviceName: string; unitPrice: number }> = quote
    ? (() => {
        const data = quote.quote_data as any;
        const services: Array<{ serviceName: string; unitPrice: number }> = [];
        
        if (data.standard_operations && Array.isArray(data.standard_operations)) {
          data.standard_operations.forEach((op: any) => {
            services.push({
              serviceName: op.service_name,
              unitPrice: op.service_price,
            });
          });
        }
        
        if (data.fulfillment_sections && Array.isArray(data.fulfillment_sections)) {
          data.fulfillment_sections.forEach((section: any) => {
            if (section.items && Array.isArray(section.items)) {
              section.items.forEach((item: any) => {
                services.push({
                  serviceName: item.service_name,
                  unitPrice: item.service_price,
                });
              });
            }
          });
        }
        
        return services;
      })()
    : [];

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

  return (
    <div className="space-y-6">
      {/* Bill Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bill Details</CardTitle>
              <CardDescription>
                {client.company_name} - {bill.label || new Date(bill.billing_month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardDescription>
            </div>
            {isClosed && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Closed</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statement Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="statement-date">Statement Date *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="statement-date"
                  type="date"
                  value={statementDate}
                  onChange={(e) => setStatementDate(e.target.value)}
                  disabled={isClosed}
                />
                <Button onClick={saveStatementDate} disabled={isClosed || !statementDate} size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Will display on client side automatically
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Balance Due</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={generatePDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            {!isClosed && (
              <Button onClick={closeBill} disabled={loading || !statementDate}>
                <Lock className="mr-2 h-4 w-4" />
                Close Bill
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                {!isClosed && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {billItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.service_name}</TableCell>
                  <TableCell className="text-right">
                    {!isClosed ? (
                      <Input
                        type="number"
                        value={item.qty_decimal}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        className="w-20 text-right"
                        step="0.01"
                      />
                    ) : (
                      item.qty_decimal
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(item.unit_price_cents / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${(Number(item.qty_decimal) * item.unit_price_cents / 100).toFixed(2)}
                  </TableCell>
                  {!isClosed && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLineItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {billItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isClosed ? 4 : 5} className="text-center text-muted-foreground">
                    No line items yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {!isClosed && quote && quoteServices.length > 0 && (
            <div className="mt-4 p-4 border rounded-lg bg-accent/50">
              <div className="font-semibold mb-2">Add from Quote:</div>
              <div className="flex flex-wrap gap-2">
                {quoteServices.map((service, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => addServiceFromQuote(service.serviceName, service.unitPrice)}
                    disabled={loading}
                  >
                    {service.serviceName} - ${service.unitPrice.toFixed(2)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 text-right">
            <div className="text-lg font-semibold">Subtotal: ${subtotal.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payments</CardTitle>
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
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {!isClosed && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.method}</TableCell>
                  <TableCell>{new Date(payment.received_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${(payment.amount_cents / 100).toFixed(2)}
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
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isClosed ? 3 : 4} className="text-center text-muted-foreground">
                    No payments yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-4 text-right">
            <div className="text-lg font-semibold">Total Payments: ${totalPayments.toFixed(2)}</div>
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