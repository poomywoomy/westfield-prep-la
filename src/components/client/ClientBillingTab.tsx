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

  const generateBillingPDF = async () => {
    if (!cycle || !clientData) return;

    const doc = new jsPDF();
    const clientName = clientData.company_name || `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim();
    const monthYear = format(new Date(cycle.billing_month), "MMMM yyyy");

    // Add logo
    const img = new Image();
    img.src = westfieldLogo;
    await new Promise((resolve) => { img.onload = resolve; });
    
    const logoWidth = 30;
    const logoHeight = (img.height / img.width) * logoWidth;
    doc.addImage(img, 'JPEG', (210 - logoWidth) / 2, 10, logoWidth, logoHeight);

    // Header
    const headerY = 10 + logoHeight + 5;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(13, 33, 66);
    doc.text("MONTHLY INVOICE", 105, headerY, { align: "center" });

    // Business info
    const infoStartY = headerY + 12;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text("Westfield Prep Center", 20, infoStartY);
    doc.setFont(undefined, 'normal');
    doc.text("info@westfieldprepcenter.com", 20, infoStartY + 5);
    doc.text("818-935-5478", 20, infoStartY + 10);

    // Client info
    const rightX = 140;
    doc.setFont(undefined, 'bold');
    doc.text(clientName, rightX, infoStartY);
    doc.setFont(undefined, 'normal');
    if (clientData.email) doc.text(clientData.email, rightX, infoStartY + 5);

    // Date
    const dateY = infoStartY + 20;
    doc.text(`Billing Period: ${monthYear}`, 20, dateY);
    doc.text(`Invoice Date: ${format(new Date(), "MMM d, yyyy")}`, 20, dateY + 5);

    let y = dateY + 15;

    // Group items by section
    const sections: { [key: string]: any[] } = {};
    items.filter(item => item.quantity > 0).forEach(item => {
      const section = item.section_type || 'Other';
      if (!sections[section]) sections[section] = [];
      sections[section].push(item);
    });

    // Render each section
    Object.entries(sections).forEach(([sectionName, sectionItems]) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(sectionName, 20, y);
      y += 7;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      sectionItems.forEach(item => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.text(item.service_name, 25, y);
        doc.text(`Qty: ${item.quantity}`, 110, y);
        doc.text(`$${Number(item.unit_price).toFixed(2)}`, 140, y);
        doc.text(`$${Number(item.total_amount).toFixed(2)}`, 170, y, { align: "right" });
        y += 6;
      });

      y += 5;
    });

    // Total
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text(`Total: $${Number(cycle.total_amount).toFixed(2)}`, 170, y, { align: 'right' });

    doc.save(`Invoice-${clientName.replace(/\s/g, '-')}-${monthYear.replace(' ', '-')}.pdf`);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Month Billing</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {format(new Date(), "MMMM yyyy")} - Total: ${cycle ? Number(cycle.total_amount).toFixed(2) : '0.00'}
              {cycle?.status === 'locked' && (
                <Badge variant="secondary">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
            </CardDescription>
          </div>
          {cycle && items.length > 0 && (
            <Button onClick={generateBillingPDF} variant="outline" disabled={cycle.status !== 'locked'}>
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
                        <TableCell className="font-medium">{item.service_name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${Number(item.unit_price).toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold">${Number(item.total_amount).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientBillingTab;
