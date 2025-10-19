import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddBillItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billId: string;
  clientId: string;
  onSuccess: () => void;
}

const AddBillItemDialog = ({ open, onOpenChange, billId, clientId, onSuccess }: AddBillItemDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [customName, setCustomName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [note, setNote] = useState("");
  const [skuRef, setSkuRef] = useState("");

  useEffect(() => {
    if (open && clientId) {
      fetchServices();
    }
  }, [open, clientId]);

  const fetchServices = async () => {
    try {
      // Get active quote for this client
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .select("quote_data")
        .eq("client_id", clientId)
        .eq("status", "active")
        .single();

      if (quoteError) throw quoteError;

      // Extract services from quote
      const quoteData = quote.quote_data as any;
      const allServices: any[] = [];

      if (quoteData.standard_operations) {
        allServices.push(...quoteData.standard_operations.map((s: any) => ({
          name: s.service_name,
          price: s.service_price,
          section: 'Standard Operations'
        })));
      }

      if (quoteData.fulfillment_sections) {
        quoteData.fulfillment_sections.forEach((section: any) => {
          allServices.push(...section.items.map((s: any) => ({
            name: s.service_name,
            price: s.service_price,
            section: section.type
          })));
        });
      }

      setServices(allServices);
    } catch (error: any) {
      toast({
        title: "Error loading services",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
    const service = services.find(s => s.name === serviceName);
    if (service) {
      setUnitPrice((service.price * 100).toString()); // Convert to cents
    }
  };

  const handleSave = async () => {
    const qtyDecimal = parseFloat(quantity);
    const unitPriceCents = Math.round(parseFloat(unitPrice) * 100);
    const discountCents = Math.round(parseFloat(discount) * 100);

    if (isNaN(qtyDecimal) || qtyDecimal <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(unitPriceCents) || unitPriceCents < 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid unit price",
        variant: "destructive",
      });
      return;
    }

    const serviceName = selectedService === "custom" ? customName : selectedService;
    if (!serviceName) {
      toast({
        title: "Missing service name",
        description: "Please select or enter a service name",
        variant: "destructive",
      });
      return;
    }

    const service = services.find(s => s.name === selectedService);
    const sectionType = service?.section || 'Other';

    setLoading(true);
    try {
      const { error } = await supabase
        .from("bill_items")
        .insert({
          bill_id: billId,
          service_name: serviceName,
          qty_decimal: qtyDecimal,
          unit_price_cents: unitPriceCents,
          discount_cents: discountCents,
          source: selectedService === "custom" ? "manual" : "manual",
          sku_ref: skuRef || null,
          note: note || null,
          section_type: sectionType,
        });

      if (error) throw error;

      onSuccess();
      onOpenChange(false);
      resetForm();
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

  const resetForm = () => {
    setSelectedService("");
    setCustomName("");
    setQuantity("1");
    setUnitPrice("");
    setDiscount("0");
    setNote("");
    setSkuRef("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bill Item</DialogTitle>
          <DialogDescription>
            Add a line item to this bill
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Service</Label>
            <Select value={selectedService} onValueChange={handleServiceSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Item</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service.name} value={service.name}>
                    {service.name} (${service.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedService === "custom" && (
            <div className="space-y-2">
              <Label>Custom Service Name</Label>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter service name"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Unit Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={unitPrice ? (parseFloat(unitPrice) / 100).toFixed(2) : ""}
                onChange={(e) => setUnitPrice((parseFloat(e.target.value) * 100).toString())}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Discount ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={discount ? (parseFloat(discount) / 100).toFixed(2) : "0"}
              onChange={(e) => setDiscount((parseFloat(e.target.value) * 100).toString())}
            />
          </div>

          <div className="space-y-2">
            <Label>SKU Reference (optional)</Label>
            <Input
              value={skuRef}
              onChange={(e) => setSkuRef(e.target.value)}
              placeholder="SKU or product code"
            />
          </div>

          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional notes"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBillItemDialog;