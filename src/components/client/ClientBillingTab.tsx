import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Download, Lock } from "lucide-react";
import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";

const ClientBillingTab = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [cycle, setCycle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }
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

      const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
      
      // Fetch billing cycle
      const { data: cycleData, error: cycleError } = await supabase
        .from("monthly_billing_cycles")
        .select("*")
        .eq("client_id", client.id)
        .eq("billing_month", currentMonth)
        .single();

      if (cycleError && cycleError.code !== 'PGRST116') throw cycleError;

      setCycle(cycleData);

      if (cycleData) {
        // Fetch billing items
        const { data: itemsData, error: itemsError } = await supabase
          .from("monthly_billing_items")
          .select("*")
          .eq("cycle_id", cycleData.id)
          .order("section_type");

        if (itemsError) throw itemsError;
        setItems(itemsData || []);

        // Fetch payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from("billing_payments")
          .select("*")
          .eq("cycle_id", cycleData.id)
          .order("payment_date", { ascending: false });

        if (paymentsError) throw paymentsError;
        setPayments(paymentsData || []);
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
    return items.reduce((sum, item) => {
      // Exclude "Monthly Deposit" from charges as it's a payment
      if (item.service_name === "Monthly Deposit") return sum;
      return sum + Number(item.total_amount);
    }, 0);
  };

  const calculateTotalPayments = () => {
    return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  };

  const calculateOutstanding = () => {
    return calculateSubtotal() - calculateTotalPayments();
  };

  const generateBillingPDF = async () => {
    if (!cycle || !clientData) return;

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
    doc.text("Monthly Billing Statement", 105, yPos, { align: "center" });
    yPos += 15;

    // Two columns: Westfield on left, Client on right
    const leftX = 20;
    const rightX = 120;
    
    // Westfield Prep Center info (left)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Westfield Prep Center", leftX, yPos);
    doc.setFont("helvetica", "normal");
    doc.text("Navapoom Sathatham", leftX, yPos + 5);
    doc.text("info@westfieldprepcenter.com", leftX, yPos + 10);
    doc.text("818-935-5478", leftX, yPos + 15);

    // Client info (right)
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", rightX, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(clientName, rightX, yPos + 5);
    doc.text(clientData.email, rightX, yPos + 10);
    if (clientData.phone_number) {
      doc.text(clientData.phone_number, rightX, yPos + 15);
    }

    yPos += 25;

    // Billing period
    const billingDate = new Date(cycle.billing_month);
    const monthYear = billingDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/Los_Angeles' });
    const todayDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });
    doc.setFontSize(10);
    doc.text(`Billing Period: ${monthYear}`, leftX, yPos);
    doc.text(`Statement Date: ${todayDate}`, rightX, yPos);
    yPos += 15;

    // Group items by section and filter out 0 quantity
    const groupedItems: { [key: string]: any[] } = {};
    items.forEach(item => {
      // Skip items with 0 quantity and Monthly Deposit
      if (item.quantity === 0 || item.service_name === "Monthly Deposit") return;
      
      const section = item.section_type || 'Other';
      if (!groupedItems[section]) groupedItems[section] = [];
      groupedItems[section].push(item);
    });

    // Services section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Itemized Services", leftX, yPos);
    yPos += 8;

    // Table header
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Service", leftX, yPos);
    doc.text("Qty", 120, yPos, { align: "right" });
    doc.text("Unit Price", 150, yPos, { align: "right" });
    doc.text("Total", 185, yPos, { align: "right" });
    
    // Draw line under header
    doc.line(leftX, yPos + 1, 190, yPos + 1);
    yPos += 6;

    doc.setFont("helvetica", "normal");

    Object.entries(groupedItems).forEach(([section, sectionItems]) => {
      // Section header
      doc.setFont("helvetica", "bold");
      doc.text(section, leftX, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");

      sectionItems.forEach(item => {
        const lineTotal = Number(item.total_amount);
        const itemType = item.item_type === "adjustment" ? " (Adj)" : item.item_type === "custom" ? " (Custom)" : "";
        
        // Service name (with wrapping if too long)
        const serviceName = `${item.service_name}${itemType}`;
        const maxWidth = 100;
        const lines = doc.splitTextToSize(serviceName, maxWidth);
        doc.text(lines, leftX + 2, yPos);
        
        // Qty, Unit Price, Total
        doc.text(String(item.quantity), 120, yPos, { align: "right" });
        doc.text(formatCurrency(Number(item.unit_price)), 150, yPos, { align: "right" });
        doc.text(formatCurrency(lineTotal), 185, yPos, { align: "right" });
        
        yPos += 5 * lines.length;

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
      doc.text("Payments/Deposits", leftX, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Payment", leftX, yPos);
      doc.text("Method", 90, yPos);
      doc.text("Date", 130, yPos);
      doc.text("Amount", 185, yPos, { align: "right" });
      doc.line(leftX, yPos + 1, 190, yPos + 1);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      payments.forEach((payment) => {
        doc.text(payment.payment_name, leftX + 2, yPos);
        doc.text(payment.payment_method, 90, yPos);
        doc.text(new Date(payment.payment_date).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' }), 130, yPos);
        doc.text(formatCurrency(Number(payment.amount)), 185, yPos, { align: "right" });
        yPos += 5;

        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Totals section (in a box at bottom right)
    yPos += 10;
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    const boxX = 135;
    const boxWidth = 55;
    let boxY = yPos;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    
    // Subtotal
    doc.text("Subtotal:", boxX + 2, boxY);
    doc.text(formatCurrency(calculateSubtotal()), boxX + boxWidth - 2, boxY, { align: "right" });
    boxY += 6;
    
    // Total Payments
    doc.text("Total Payments:", boxX + 2, boxY);
    doc.text(formatCurrency(calculateTotalPayments()), boxX + boxWidth - 2, boxY, { align: "right" });
    boxY += 6;
    
    // Draw line
    doc.line(boxX + 2, boxY, boxX + boxWidth - 2, boxY);
    boxY += 5;
    
    // Outstanding Balance
    const outstanding = calculateOutstanding();
    doc.setFontSize(11);
    if (outstanding < 0) {
      doc.text("Credit Balance:", boxX + 2, boxY);
      doc.text(formatCurrency(Math.abs(outstanding)), boxX + boxWidth - 2, boxY, { align: "right" });
    } else {
      doc.text("Balance Due:", boxX + 2, boxY);
      doc.text(formatCurrency(outstanding), boxX + boxWidth - 2, boxY, { align: "right" });
    }
    
    // Draw box around totals
    doc.rect(boxX, yPos - 4, boxWidth, boxY - yPos + 8);

    const fileName = `${clientName.replace(/\s+/g, "_")}_Billing_${monthYear.replace(/\s+/g, "_")}.pdf`;
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

  // Group items by section
  const sections: { [key: string]: any[] } = {};
  items.forEach(item => {
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
          <div>
            <CardTitle>Current Month Billing</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {format(new Date(), "MMMM yyyy")}
              {cycle?.status === 'locked' && (
                <Badge variant="secondary">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
            </CardDescription>
          </div>
          {cycle && items.length > 0 && (
            <Button onClick={generateBillingPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!cycle || items.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No billing data for this month yet.</p>
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
                    {sectionItems.map((item) => {
                      const isMonthlyDeposit = item.service_name === "Monthly Deposit";
                      
                      return (
                        <TableRow key={item.id} className={isMonthlyDeposit ? "bg-green-50" : ""}>
                          <TableCell className="font-medium">
                            {item.service_name}
                            {isMonthlyDeposit && (
                              <span className="text-xs text-green-600 ml-2">(Applied as Payment)</span>
                            )}
                            {item.item_type && item.item_type !== "quote" && !isMonthlyDeposit && (
                              <span className="text-xs text-muted-foreground ml-2">
                                ({item.item_type === "adjustment" ? "Adjustment" : "Custom"})
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Number(item.unit_price))}</TableCell>
                          <TableCell className={`text-right font-semibold ${
                            isMonthlyDeposit ? 'text-green-600' : ''
                          }`}>
                            {formatCurrency(Number(item.total_amount))}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ))}

            {/* Payments section */}
            {payments.length > 0 && (
              <div className="border rounded-lg p-4 bg-green-50">
                <h3 className="font-semibold text-lg mb-3">Payments/Deposits</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Name</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.payment_name}</TableCell>
                        <TableCell>{payment.payment_method}</TableCell>
                        <TableCell className="text-right">
                          {new Date(payment.payment_date).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          {formatCurrency(Number(payment.amount))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Totals section */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Subtotal (MTD Charges):</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Deposits / Payments (MTD):</span>
                <span className="font-bold text-green-600">{formatCurrency(totalPayments)}</span>
              </div>
              <div className="flex justify-between text-xl border-t pt-2">
                <span className="font-bold">Outstanding Balance:</span>
                <span className={`font-bold ${outstanding < 0 ? 'text-green-600' : 'text-foreground'}`}>
                  {outstanding < 0
                    ? `Credit ${formatCurrency(Math.abs(outstanding))}`
                    : formatCurrency(outstanding)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientBillingTab;
