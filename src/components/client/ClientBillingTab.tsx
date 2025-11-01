import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, DollarSign, Wallet } from "lucide-react";
import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";

const ClientBillingTab = () => {
  const { user } = useAuth();
  const [bill, setBill] = useState<any>(null);
  const [billItems, setBillItems] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }

    // Real-time updates
    const channel = supabase
      .channel('client-bill-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bills' }, () => {
        if (user) fetchBillingData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bill_items' }, () => {
        if (user) fetchBillingData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        if (user) fetchBillingData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchBillingData = async () => {
    try {
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .select("id, company_name, contact_name, email, first_name, last_name, phone_number")
        .eq("user_id", user?.id)
        .single();

      if (clientError) throw clientError;
      setClientData(client);

      // Fetch current open bill only
      const { data: openBills, error: billsError } = await supabase
        .from("bills")
        .select("*")
        .eq("client_id", client.id)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(1);

      if (billsError) throw billsError;

      const currentBill = openBills?.[0] || null;
      setBill(currentBill);

      if (currentBill) {
        // Fetch bill items
        const { data: itemsData, error: itemsError } = await supabase
          .from("bill_items")
          .select("*")
          .eq("bill_id", currentBill.id)
          .order("section_type");

        if (itemsError) throw itemsError;
        setBillItems(itemsData || []);

        // Fetch payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from("payments")
          .select("*")
          .eq("bill_id", currentBill.id)
          .order("received_at", { ascending: false });

        if (paymentsError) throw paymentsError;
        setPayments(paymentsData || []);
      } else {
        setBillItems([]);
        setPayments([]);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => {
      return sum + (Number(item.qty_decimal) * item.unit_price_cents / 100);
    }, 0);
  };

  const calculateTotalPayments = () => {
    return payments.reduce((sum, payment) => sum + (payment.amount_cents / 100), 0);
  };

  const calculateOutstanding = () => {
    return calculateSubtotal() - calculateTotalPayments();
  };

  const generateBillingPDF = async () => {
    if (!bill || !clientData) return;

    const doc = new jsPDF();
    const clientName = clientData.company_name || `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim();

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

    // Client info
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 20, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.text(clientData.contact_name || clientName, 20, yPos);
    yPos += 4;
    doc.text(clientName, 20, yPos);
    yPos += 4;
    doc.text(`Phone: ${clientData.phone_number || 'N/A'}`, 20, yPos);
    yPos += 4;
    doc.text(`Email: ${clientData.email || 'N/A'}`, 20, yPos);
    yPos += 8;

    // Statement dates
    if (bill.statement_start_date && bill.statement_end_date) {
      doc.setFont("helvetica", "bold");
      doc.text("Statement Period:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${new Date(bill.statement_start_date).toLocaleDateString()} - ${new Date(bill.statement_end_date).toLocaleDateString()}`, 70, yPos);
      yPos += 10;
    }

    // Group items by section
    const groupedItems: { [key: string]: any[] } = {};
    billItems.forEach(item => {
      if (item.qty_decimal === 0) return; // Skip 0 quantity items
      const section = item.section_type || 'Other';
      if (!groupedItems[section]) groupedItems[section] = [];
      groupedItems[section].push(item);
    });

    // Services section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Itemized Services", 20, yPos);
    yPos += 8;

    // Table header
    doc.setFontSize(9);
    doc.text("Service", 20, yPos);
    doc.text("Qty", 120, yPos, { align: "right" });
    doc.text("Unit Price", 150, yPos, { align: "right" });
    doc.text("Total", 185, yPos, { align: "right" });
    doc.line(20, yPos + 1, 190, yPos + 1);
    yPos += 6;
    doc.setFont("helvetica", "normal");

    Object.entries(groupedItems).forEach(([section, sectionItems]) => {
      doc.setFont("helvetica", "bold");
      doc.text(section, 20, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");

      sectionItems.forEach(item => {
        const lineTotal = Number(item.qty_decimal) * item.unit_price_cents / 100;
        doc.text(item.service_name, 22, yPos);
        doc.text(String(item.qty_decimal), 120, yPos, { align: "right" });
        doc.text(formatCurrency(item.unit_price_cents / 100), 150, yPos, { align: "right" });
        doc.text(formatCurrency(lineTotal), 185, yPos, { align: "right" });
        yPos += 5;

        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
      });

      yPos += 2;
    });

    // Payments section
    if (payments.length > 0) {
      yPos += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Payments", 20, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.text("Method", 20, yPos);
      doc.text("Date", 90, yPos);
      doc.text("Amount", 185, yPos, { align: "right" });
      doc.line(20, yPos + 1, 190, yPos + 1);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      payments.forEach((payment) => {
        const isDeposit = payment.method === "deposit_application" || payment.payment_type === "deposit_application";
        doc.text(isDeposit ? "Deposit Application" : payment.method, 20, yPos);
        doc.text(new Date(payment.received_at).toLocaleDateString(), 90, yPos);
        doc.text(formatCurrency(payment.amount_cents / 100), 185, yPos, { align: "right" });
        yPos += 5;

        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Totals
    yPos += 10;
    const boxX = 135;
    const boxWidth = 55;
    let boxY = yPos;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    doc.text("Subtotal:", boxX + 2, boxY);
    doc.text(formatCurrency(calculateSubtotal()), boxX + boxWidth - 2, boxY, { align: "right" });
    boxY += 6;

    doc.text("Total Payments:", boxX + 2, boxY);
    doc.text(formatCurrency(calculateTotalPayments()), boxX + boxWidth - 2, boxY, { align: "right" });
    boxY += 6;

    doc.line(boxX + 2, boxY, boxX + boxWidth - 2, boxY);
    boxY += 5;

    const outstanding = calculateOutstanding();
    doc.setFontSize(11);
    doc.text(outstanding < 0 ? "Credit Balance:" : "Balance Due:", boxX + 2, boxY);
    doc.text(formatCurrency(Math.abs(outstanding)), boxX + boxWidth - 2, boxY, { align: "right" });

    doc.rect(boxX, yPos - 4, boxWidth, boxY - yPos + 8);

    const fileName = `${clientName.replace(/\s+/g, "_")}_Billing_${new Date(bill.billing_month).toLocaleDateString().replace(/\//g, '-')}.pdf`;
    doc.save(fileName);

    toast({
      title: "PDF Generated",
      description: "Invoice downloaded successfully",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading billing...</p>
        </CardContent>
      </Card>
    );
  }

  if (!bill) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing Statement</CardTitle>
          <CardDescription>Your current billing information</CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Lock className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No Active Billing Statement</p>
            <p className="text-sm mt-2">Your next billing statement will appear here when available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group items by section
  const sections: { [key: string]: any[] } = {};
  billItems.forEach(item => {
    const section = item.section_type || 'Other';
    if (!sections[section]) sections[section] = [];
    sections[section].push(item);
  });

  const subtotal = calculateSubtotal();
  const totalPayments = calculateTotalPayments();
  const outstanding = calculateOutstanding();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle>Current Billing Statement</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              {bill.statement_start_date && bill.statement_end_date ? (
                <>
                  {new Date(bill.statement_start_date).toLocaleDateString()} - {new Date(bill.statement_end_date).toLocaleDateString()}
                </>
              ) : (
                new Date(bill.billing_month).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              )}
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                Open
              </Badge>
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {billItems.length > 0 && (
              <Button onClick={generateBillingPDF} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-muted rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Subtotal</div>
            <div className="text-2xl font-bold">{formatCurrency(subtotal)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Paid</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPayments)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Balance Due</div>
            <div className={`text-2xl font-bold ${outstanding < 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
              {outstanding < 0 ? `Credit ${formatCurrency(Math.abs(outstanding))}` : formatCurrency(outstanding)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {billItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No line items yet.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(sections).map(([sectionName, sectionItems]) => (
              <div key={sectionName} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{sectionName}</h3>
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
                    {sectionItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.service_name}</TableCell>
                        <TableCell className="text-right">{item.qty_decimal}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unit_price_cents / 100)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(Number(item.qty_decimal) * item.unit_price_cents / 100)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}

        {/* Payments Section */}
        {payments.length > 0 && (
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payments & Deposits
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const isDeposit = payment.method === "deposit_application" || payment.payment_type === "deposit_application";
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
                      <TableCell>{isDeposit ? "Deposit Application" : payment.method}</TableCell>
                      <TableCell>{new Date(payment.received_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(payment.amount_cents / 100)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientBillingTab;