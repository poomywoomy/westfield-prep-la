import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";
import { formatDateRange } from "@/lib/dateFormatters";
import type { Database } from "@/integrations/supabase/types";

type Bill = Database["public"]["Tables"]["bills"]["Row"];
type BillItem = Database["public"]["Tables"]["bill_items"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];

const ClientBillsView = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchData();
    }

    const channel = supabase
      .channel('client-bills-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bills' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bill_items' }, () => {
        if (selectedBill) fetchBillDetails(selectedBill.id);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        if (selectedBill) fetchBillDetails(selectedBill.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedBill?.id]);

  const fetchData = async () => {
    try {
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (clientError) throw clientError;
      setClientData(client);

      // Fetch all bills (open and closed) so clients can view their billing history
      const { data: billsData, error: billsError } = await supabase
        .from("bills")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });

      if (billsError) throw billsError;
      setBills(billsData || []);

      if (billsData && billsData.length > 0 && !selectedBill) {
        setSelectedBill(billsData[0]);
        await fetchBillDetails(billsData[0].id);
      }
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

  const fetchBillDetails = async (billId: string) => {
    try {
      const [{ data: items }, { data: pmts }] = await Promise.all([
        supabase.from("bill_items").select("*").eq("bill_id", billId).order("created_at"),
        supabase.from("payments").select("*").eq("bill_id", billId).order("received_at", { ascending: false }),
      ]);

      setBillItems(items || []);
      setPayments(pmts || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBillSelect = (bill: Bill) => {
    setSelectedBill(bill);
    fetchBillDetails(bill.id);
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const subtotal = billItems.reduce((sum, item) => sum + (Number(item.qty_decimal) * item.unit_price_cents), 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount_cents, 0);
  const balance = subtotal - totalPayments;

  const generatePDF = async () => {
    if (!selectedBill || !clientData) return;

    const doc = new jsPDF();
    
    const img = new Image();
    img.src = westfieldLogo;
    await new Promise((resolve) => { img.onload = resolve; });
    
    const logoWidth = 30;
    const logoHeight = (img.height / img.width) * logoWidth;
    doc.addImage(img, 'JPEG', (210 - logoWidth) / 2, 10, logoWidth, logoHeight);

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
    });

    yPos += 5;
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

    yPos += 10;
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

    doc.save(`Bill_${selectedBill.label || 'Statement'}.pdf`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading bills...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Bill History</CardTitle>
          <CardDescription>Your billing statements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {bills.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No bills yet</p>
          ) : (
            bills.map((bill) => (
              <div
                key={bill.id}
                onClick={() => handleBillSelect(bill)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedBill?.id === bill.id ? "bg-primary/5 border-primary" : "hover:bg-accent"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {bill.label || new Date(bill.billing_month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </div>
                    {bill.statement_start_date && bill.statement_end_date && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDateRange(bill.statement_start_date, bill.statement_end_date)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={bill.status === "closed" ? "secondary" : "default"} className="text-xs">
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        {selectedBill ? (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bill Statement</CardTitle>
                  {selectedBill.statement_start_date && selectedBill.statement_end_date && (
                    <CardDescription>
                      {formatDateRange(selectedBill.statement_start_date, selectedBill.statement_end_date)}
                    </CardDescription>
                  )}
                </div>
                <Button onClick={generatePDF} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.service_name}</TableCell>
                      <TableCell className="text-right">{item.qty_decimal}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unit_price_cents)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(Number(item.qty_decimal) * item.unit_price_cents)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {billItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No line items
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {payments.length > 0 && (
                <>
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Payments</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Method</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.method}</TableCell>
                            <TableCell>{new Date(payment.received_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(payment.amount_cents)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4 border-t">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Payments:</span>
                    <span className="font-semibold">-{formatCurrency(totalPayments)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Balance Due:</span>
                    <span>{formatCurrency(balance)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="py-12">
            <p className="text-muted-foreground text-center">Select a bill to view details</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ClientBillsView;
