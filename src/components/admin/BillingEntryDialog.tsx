import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Lock, Edit2 } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";

interface BillingEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
  quote: any;
  onSuccess: () => void;
}

interface BillingItem {
  service_name: string;
  unit_price: number;
  quantity: number;
  section_type?: string;
}

const BillingEntryDialog = ({ open, onOpenChange, client, quote, onSuccess }: BillingEntryDialogProps) => {
  const { toast } = useToast();
  const [items, setItems] = useState<BillingItem[]>([]);
  const [cycle, setCycle] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";

  useEffect(() => {
    if (open && client && quote) {
      loadBillingData();
    }
  }, [open, client, quote]);

  const loadBillingData = async () => {
    // Fetch or create billing cycle for current month
    let { data: cycleData, error: cycleError } = await supabase
      .from("monthly_billing_cycles")
      .select("*")
      .eq("client_id", client.id)
      .eq("billing_month", currentMonth)
      .single();

    if (cycleError && cycleError.code !== 'PGRST116') {
      toast({
        title: "Error",
        description: "Failed to load billing data",
        variant: "destructive",
      });
      return;
    }

    // Create cycle if doesn't exist
    if (!cycleData) {
      const { data: newCycle, error: createError } = await supabase
        .from("monthly_billing_cycles")
        .insert({
          client_id: client.id,
          quote_id: quote.id,
          billing_month: currentMonth,
          status: 'active'
        })
        .select()
        .single();

      if (createError) {
        toast({
          title: "Error",
          description: "Failed to create billing cycle",
          variant: "destructive",
        });
        return;
      }
      cycleData = newCycle;
    }

    setCycle(cycleData);
    setIsLocked(cycleData.status === 'locked');

    // Load existing items or initialize from quote
    const { data: itemsData, error: itemsError } = await supabase
      .from("monthly_billing_items")
      .select("*")
      .eq("cycle_id", cycleData.id);

    if (itemsError) {
      toast({
        title: "Error",
        description: "Failed to load billing items",
        variant: "destructive",
      });
      return;
    }

    // If items exist, use them, otherwise initialize from quote
    if (itemsData && itemsData.length > 0) {
      setItems(itemsData.map(item => ({
        service_name: item.service_name,
        unit_price: Number(item.unit_price),
        quantity: item.quantity,
        section_type: item.section_type
      })));
    } else {
      initializeFromQuote();
    }
  };

  const initializeFromQuote = () => {
    const quoteData = quote.quote_data;
    const billingItems: BillingItem[] = [];

    // Add standard operations
    if (quoteData.standard_operations) {
      quoteData.standard_operations.forEach((item: any) => {
        billingItems.push({
          service_name: item.service_name,
          unit_price: Number(item.service_price),
          quantity: 0,
          section_type: 'Standard Operations'
        });
      });
    }

    // Add fulfillment sections
    if (quoteData.fulfillment_sections) {
      quoteData.fulfillment_sections.forEach((section: any) => {
        section.items.forEach((item: any) => {
          billingItems.push({
            service_name: item.service_name,
            unit_price: Number(item.service_price),
            quantity: 0,
            section_type: section.type
          });
        });
      });
    }

    setItems(billingItems);
  };

  const updateQuantity = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(0, quantity);
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  };

  const saveBilling = async () => {
    if (!cycle) return;
    setIsSaving(true);

    try {
      // Delete existing items
      await supabase
        .from("monthly_billing_items")
        .delete()
        .eq("cycle_id", cycle.id);

      // Insert new items
      const itemsToInsert = items.map(item => ({
        cycle_id: cycle.id,
        service_name: item.service_name,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total_amount: item.unit_price * item.quantity,
        section_type: item.section_type
      }));

      const { error: insertError } = await supabase
        .from("monthly_billing_items")
        .insert(itemsToInsert);

      if (insertError) throw insertError;

      // Update cycle total
      const total = calculateTotal();
      const { error: updateError } = await supabase
        .from("monthly_billing_cycles")
        .update({ total_amount: total })
        .eq("id", cycle.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Billing saved successfully",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const lockCycle = async () => {
    if (!cycle) return;

    const { error } = await supabase
      .from("monthly_billing_cycles")
      .update({ 
        status: 'locked',
        locked_at: new Date().toISOString()
      })
      .eq("id", cycle.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to lock billing cycle",
        variant: "destructive",
      });
      return;
    }

    setIsLocked(true);
    toast({
      title: "Success",
      description: "Billing cycle locked. You can now download PDF.",
    });
  };

  const unlockCycle = async () => {
    if (!cycle) return;

    const { error } = await supabase
      .from("monthly_billing_cycles")
      .update({ 
        status: 'active',
        locked_at: null
      })
      .eq("id", cycle.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to unlock billing cycle",
        variant: "destructive",
      });
      return;
    }

    setIsLocked(false);
    toast({
      title: "Success",
      description: "Billing cycle unlocked for editing.",
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const clientName = client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim();
    const monthYear = format(new Date(currentMonth), "MMMM yyyy");

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
    if (client.email) doc.text(client.email, rightX, infoStartY + 5);

    // Date
    const dateY = infoStartY + 20;
    doc.text(`Billing Period: ${monthYear}`, 20, dateY);
    doc.text(`Invoice Date: ${format(new Date(), "MMM d, yyyy")}`, 20, dateY + 5);

    let y = dateY + 15;

    // Group items by section
    const sections: { [key: string]: BillingItem[] } = {};
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
        doc.text(`$${item.unit_price.toFixed(2)}`, 140, y);
        doc.text(`$${(item.unit_price * item.quantity).toFixed(2)}`, 170, y, { align: "right" });
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
    doc.text(`Total: $${calculateTotal().toFixed(2)}`, 170, y, { align: 'right' });

    doc.save(`Invoice-${clientName.replace(/\s/g, '-')}-${monthYear.replace(' ', '-')}.pdf`);

    toast({
      title: "PDF Generated",
      description: "Invoice downloaded successfully",
    });
  };

  // Group items by section for display
  const sections: { [key: string]: BillingItem[] } = {};
  items.forEach((item, index) => {
    const section = item.section_type || 'Other';
    if (!sections[section]) sections[section] = [];
    sections[section].push({ ...item, index } as any);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              Billing Entry - {client?.company_name || client?.contact_name}
              <span className="text-sm text-muted-foreground ml-2">
                ({format(new Date(currentMonth), "MMMM yyyy")})
              </span>
            </span>
            <div className="flex gap-2">
              {isLocked ? (
                <Button variant="outline" size="sm" onClick={unlockCycle}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Locked
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={lockCycle}>
                  <Lock className="h-4 w-4 mr-2" />
                  Lock Month
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={generatePDF} disabled={!isLocked}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(sections).map(([sectionName, sectionItems]) => (
            <div key={sectionName} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">{sectionName}</h3>
              <div className="space-y-3">
                {(sectionItems as any[]).map((item) => (
                  <div key={item.index} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
                      <Label className="text-sm">{item.service_name}</Label>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm text-muted-foreground">
                        ${item.unit_price.toFixed(2)}
                      </Label>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.index, parseInt(e.target.value) || 0)}
                        disabled={isLocked}
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-3 text-right">
                      <Label className="text-sm font-semibold">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="border-t pt-4 flex items-center justify-between">
            <div className="text-2xl font-bold">
              Monthly Total: ${calculateTotal().toFixed(2)}
            </div>
            <Button onClick={saveBilling} disabled={isSaving || isLocked} size="lg">
              {isSaving ? "Saving..." : "Save Billing"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingEntryDialog;
