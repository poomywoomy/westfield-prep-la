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
        .select("id, company_name, contact_name, email, first_name, last_name")
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
    return items.reduce((sum, item) => sum + Number(item.total_amount), 0);
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
    doc.text("Westfield Prep Center", 105, yPos, { align: "center" });
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Monthly Billing Statement", 105, yPos, { align: "center" });
    yPos += 15;

    // Client info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Client Information:", 20, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${clientName}`, 20, yPos);
    yPos += 5;
    doc.text(`Email: ${clientData.email}`, 20, yPos);
    yPos += 10;

    // Billing period
    const billingDate = new Date(cycle.billing_month);
    const monthYear = billingDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/Los_Angeles' });
    doc.text(`Billing Period: ${monthYear}`, 20, yPos);
    yPos += 5;
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })} ${new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })}`, 20, yPos);
    yPos += 10;

    // Group items by section
    const sections: { [key: string]: any[] } = {};
    items.forEach(item => {
      const section = item.section_type || 'Other';
      if (!sections[section]) sections[section] = [];
      sections[section].push(item);
    });

    // Services section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Services", 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    Object.entries(sections).forEach(([sectionName, sectionItems]) => {
      doc.setFont("helvetica", "bold");
      doc.text(sectionName, 20, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");

      sectionItems.forEach(item => {
        const itemType = item.item_type === "adjustment" ? " (Adjustment)" : item.item_type === "custom" ? " (Custom)" : "";
        doc.text(
          `${item.service_name}${itemType}: ${formatCurrency(Number(item.unit_price))} × ${item.quantity} = ${formatCurrency(Number(item.total_amount))}`,
          25,
          yPos
        );
        yPos += 5;

        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });

      yPos += 3;
    });

    // Payments section
    if (payments.length > 0) {
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Payments/Deposits", 20, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");

      payments.forEach((payment) => {
        doc.text(
          `${payment.payment_name} (${payment.payment_method}) - ${new Date(payment.payment_date).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })}: ${formatCurrency(Number(payment.amount))}`,
          25,
          yPos
        );
        yPos += 5;

        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Totals
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Subtotal: ${formatCurrency(calculateSubtotal())}`, 160, yPos);
    yPos += 7;
    doc.text(`Total Payments: ${formatCurrency(calculateTotalPayments())}`, 160, yPos);
    yPos += 7;
    
    const outstanding = calculateOutstanding();
    if (outstanding < 0) {
      doc.text(`Credit Balance: ${formatCurrency(Math.abs(outstanding))}`, 160, yPos);
    } else {
      doc.text(`Outstanding Balance: ${formatCurrency(outstanding)}`, 160, yPos);
    }

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
                    {sectionItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.service_name}
                          {item.item_type && item.item_type !== "quote" && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({item.item_type === "adjustment" ? "Adjustment" : "Custom"})
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(item.unit_price))}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(Number(item.total_amount))}</TableCell>
                      </TableRow>
                    ))}
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
