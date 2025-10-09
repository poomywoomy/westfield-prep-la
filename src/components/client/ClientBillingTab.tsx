import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";

const ClientBillingTab = () => {
  const { user } = useAuth();
  const [charges, setCharges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [clientData, setClientData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCharges();
    }
  }, [user]);

  const fetchCharges = async () => {
    try {
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .select("id, company_name, contact_name, email")
        .eq("user_id", user?.id)
        .single();

      if (clientError) throw clientError;
      setClientData(client);

      const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
      const { data, error } = await supabase
        .from("billing_charges")
        .select("*")
        .eq("client_id", client.id)
        .eq("billing_month", currentMonth)
        .order("charge_date", { ascending: false });

      if (error) throw error;

      setCharges(data || []);
      const total = (data || []).reduce((sum, charge) => sum + Number(charge.total_amount), 0);
      setTotalAmount(total);
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

  const generateBillingPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const monthYear = format(currentDate, "MMMM yyyy");

    // Add logo
    doc.addImage(westfieldLogo, "JPEG", 20, 15, 40, 15);

    // Company info
    doc.setFontSize(10);
    doc.text("Westfield Prep Center", 150, 20);
    doc.text("5750 Smithway St Suite 100", 150, 25);
    doc.text("Commerce, CA 90040", 150, 30);

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text("Invoice", 20, 50);

    // Client info
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Bill To:`, 20, 60);
    doc.setFont(undefined, 'bold');
    doc.text(clientData?.company_name || "", 20, 66);
    doc.setFont(undefined, 'normal');
    doc.text(clientData?.contact_name || "", 20, 72);
    doc.text(clientData?.email || "", 20, 78);

    // Invoice details
    doc.text(`Invoice Date: ${format(currentDate, "MMM d, yyyy")}`, 150, 60);
    doc.text(`Billing Period: ${monthYear}`, 150, 66);
    doc.text(`Invoice #: ${format(currentDate, "yyyyMM")}-${clientData?.id?.substring(0, 8) || ""}`, 150, 72);

    // Table header
    let y = 95;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y, 170, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.text("Service", 25, y + 5);
    doc.text("Qty", 110, y + 5);
    doc.text("Unit Price", 130, y + 5);
    doc.text("Total", 165, y + 5);

    // Table rows
    y += 12;
    doc.setFont(undefined, 'normal');
    charges.forEach((charge) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(charge.service_name.substring(0, 45), 25, y);
      if (charge.description) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(charge.description.substring(0, 50), 25, y + 4);
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
      }
      doc.text(charge.quantity.toString(), 110, y);
      doc.text(`$${Number(charge.unit_price).toFixed(2)}`, 130, y);
      doc.text(`$${Number(charge.total_amount).toFixed(2)}`, 165, y);
      
      y += charge.description ? 10 : 8;
    });

    // Total
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text(`Total: $${totalAmount.toFixed(2)}`, 165, y, { align: 'right' });

    // Footer
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(128, 128, 128);
    const footerY = 280;
    doc.text("Thank you for your business!", 105, footerY, { align: 'center' });
    doc.text("Questions? Contact us at info@westfieldprepcenter.com", 105, footerY + 5, { align: 'center' });

    doc.save(`Westfield-Invoice-${monthYear.replace(" ", "-")}.pdf`);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Month Billing</CardTitle>
            <CardDescription>
              {format(new Date(), "MMMM yyyy")} - Total: ${totalAmount.toFixed(2)}
            </CardDescription>
          </div>
          {charges.length > 0 && (
            <Button onClick={generateBillingPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {charges.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No charges for this month.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charges.map((charge) => (
                <TableRow key={charge.id}>
                  <TableCell className="font-medium">{charge.service_name}</TableCell>
                  <TableCell>{charge.quantity}</TableCell>
                  <TableCell>${charge.unit_price}</TableCell>
                  <TableCell className="font-medium">${charge.total_amount}</TableCell>
                  <TableCell>{format(new Date(charge.charge_date), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientBillingTab;
