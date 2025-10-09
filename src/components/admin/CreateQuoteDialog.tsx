import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Download, Check } from "lucide-react";
import jsPDF from "jspdf";

interface LineItem {
  id: string;
  service_name: string;
  quantity: number;
  unit_price: number;
  notes: string;
}

interface CreateQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: any[];
  onQuoteCreated: () => void;
}

const CreateQuoteDialog = ({ open, onOpenChange, clients, onQuoteCreated }: CreateQuoteDialogProps) => {
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), service_name: "", quantity: 1, unit_price: 0, notes: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLineItem = () => {
    setLineItems([...lineItems, { 
      id: crypto.randomUUID(), 
      service_name: "", 
      quantity: 1, 
      unit_price: 0, 
      notes: "" 
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const generatePDF = () => {
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    const doc = new jsPDF();
    
    // Add logo and header
    doc.setFillColor(13, 33, 66); // Deep Navy
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("WESTFIELD", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Quote", 105, 30, { align: "center" });

    // Client info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Client: ${client.company_name}`, 20, 55);
    doc.text(`Contact: ${client.contact_name}`, 20, 62);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 69);

    // Line items table
    let y = 85;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Service", 20, y);
    doc.text("Qty", 110, y);
    doc.text("Unit Price", 130, y);
    doc.text("Total", 170, y, { align: "right" });
    
    y += 7;
    doc.setFont(undefined, 'normal');
    
    lineItems.forEach(item => {
      const total = item.quantity * item.unit_price;
      doc.text(item.service_name, 20, y);
      doc.text(item.quantity.toString(), 110, y);
      doc.text(`$${item.unit_price.toFixed(2)}`, 130, y);
      doc.text(`$${total.toFixed(2)}`, 170, y, { align: "right" });
      
      if (item.notes) {
        y += 5;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Notes: ${item.notes}`, 20, y);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
      }
      
      y += 7;
    });

    // Total
    y += 5;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text(`Total: $${calculateTotal().toFixed(2)}`, 170, y, { align: "right" });

    doc.save(`quote-${client.company_name}-${Date.now()}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Quote has been downloaded as PDF",
    });
  };

  const applyToPricing = async () => {
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Delete existing pricing for this client
      await supabase
        .from("custom_pricing")
        .delete()
        .eq("client_id", selectedClientId);

      // Insert new pricing records
      const pricingRecords = lineItems.map(item => ({
        client_id: selectedClientId,
        service_name: item.service_name,
        price_per_unit: item.unit_price,
        notes: item.notes,
      }));

      const { error } = await supabase
        .from("custom_pricing")
        .insert(pricingRecords);

      if (error) throw error;

      // Update client pricing_active flag
      await supabase
        .from("clients")
        .update({ pricing_active: true })
        .eq("id", selectedClientId);

      toast({
        title: "Success",
        description: "Pricing has been applied to client account",
      });

      onQuoteCreated();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedClientId("");
    setLineItems([{ id: crypto.randomUUID(), service_name: "", quantity: 1, unit_price: 0, notes: "" }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Quote</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label>Select Client</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Line Items</Label>
              <Button type="button" size="sm" onClick={addLineItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Line
              </Button>
            </div>

            {lineItems.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Item #{index + 1}</span>
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Name</Label>
                    <Input
                      value={item.service_name}
                      onChange={(e) => updateLineItem(item.id, "service_name", e.target.value)}
                      placeholder="e.g., FBA Prep"
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Unit Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unit_price}
                      onChange={(e) => updateLineItem(item.id, "unit_price", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Total</Label>
                    <Input
                      value={`$${(item.quantity * item.unit_price).toFixed(2)}`}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={item.notes}
                    onChange={(e) => updateLineItem(item.id, "notes", e.target.value)}
                    placeholder="Additional notes for this line item"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-xl font-bold">
              Total: ${calculateTotal().toFixed(2)}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={generatePDF}
                disabled={!selectedClientId || lineItems.some(item => !item.service_name)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={applyToPricing}
                disabled={isSubmitting || !selectedClientId || lineItems.some(item => !item.service_name)}
              >
                <Check className="h-4 w-4 mr-2" />
                Apply to Client Pricing
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteDialog;
