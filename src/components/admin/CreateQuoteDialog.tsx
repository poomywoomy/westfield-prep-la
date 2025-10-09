import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Download, Check, FileText } from "lucide-react";
import jsPDF from "jspdf";

interface LineItem {
  id: string;
  service_name: string;
  service_price: number;
  notes: string;
  showNotes: boolean;
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
  const [manualClientName, setManualClientName] = useState("");
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), service_name: "", service_price: 0, notes: "", showNotes: false }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLineItem = () => {
    setLineItems([...lineItems, { 
      id: crypto.randomUUID(), 
      service_name: "", 
      service_price: 0, 
      notes: "",
      showNotes: false
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

  const toggleNotes = (id: string) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, showNotes: !item.showNotes } : item
    ));
  };

  const generatePDF = () => {
    const clientName = useManualEntry ? manualClientName : clients.find(c => c.id === selectedClientId)?.company_name;
    if (!clientName) {
      toast({
        title: "Error",
        description: "Please provide a client name",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    
    // Add logo and header
    doc.setFillColor(13, 33, 66); // Deep Navy
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("WESTFIELD", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Service Quote", 105, 30, { align: "center" });

    // Client info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Client: ${clientName}`, 20, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 62);

    // Line items
    let y = 80;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Service", 20, y);
    doc.text("Price", 170, y, { align: "right" });
    
    y += 7;
    doc.setFont(undefined, 'normal');
    
    lineItems.forEach(item => {
      doc.text(item.service_name, 20, y);
      doc.text(`$${item.service_price.toFixed(2)}`, 170, y, { align: "right" });
      
      if (item.notes && item.showNotes) {
        y += 5;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const splitNotes = doc.splitTextToSize(`Notes: ${item.notes}`, 150);
        doc.text(splitNotes, 20, y);
        y += (splitNotes.length * 3);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
      }
      
      y += 7;
    });

    doc.save(`quote-${clientName.replace(/\s/g, '-')}-${Date.now()}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Quote has been downloaded as PDF",
    });
  };

  const saveQuote = async () => {
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client to save the quote",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const quoteData = {
        client_name: clients.find(c => c.id === selectedClientId)?.company_name,
        line_items: lineItems.map(item => ({
          service_name: item.service_name,
          service_price: item.service_price,
          notes: item.notes
        })),
        created_date: new Date().toISOString()
      };

      const { error } = await supabase
        .from("quotes")
        .insert({
          client_id: selectedClientId,
          quote_data: quoteData,
          status: 'saved'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote has been saved",
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
        price_per_unit: item.service_price,
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
    setManualClientName("");
    setUseManualEntry(false);
    setLineItems([{ id: crypto.randomUUID(), service_name: "", service_price: 0, notes: "", showNotes: false }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Quote</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={useManualEntry ? "default" : "outline"}
                size="sm"
                onClick={() => setUseManualEntry(!useManualEntry)}
              >
                {useManualEntry ? "Using Manual Entry" : "Manual Entry"}
              </Button>
            </div>

            {useManualEntry ? (
              <div>
                <Label>Client Name</Label>
                <Input
                  value={manualClientName}
                  onChange={(e) => setManualClientName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
            ) : (
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
            )}
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
              <div key={item.id} className="border-b pb-3 space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Service Name</Label>
                      <Input
                        value={item.service_name}
                        onChange={(e) => updateLineItem(item.id, "service_name", e.target.value)}
                        placeholder="e.g., FBA Prep"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Service Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.service_price}
                        onChange={(e) => updateLineItem(item.id, "service_price", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
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

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleNotes(item.id)}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {item.showNotes ? "Hide Note" : "Add Note"}
                  </Button>
                </div>

                {item.showNotes && (
                  <Textarea
                    value={item.notes}
                    onChange={(e) => updateLineItem(item.id, "notes", e.target.value)}
                    placeholder="Additional notes for this service"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={generatePDF}
              disabled={(!selectedClientId && !manualClientName) || lineItems.some(item => !item.service_name)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {!useManualEntry && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveQuote}
                  disabled={isSubmitting || !selectedClientId || lineItems.some(item => !item.service_name)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Save Quote
                </Button>
                <Button
                  onClick={applyToPricing}
                  disabled={isSubmitting || !selectedClientId || lineItems.some(item => !item.service_name)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply to Client Pricing
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteDialog;
