import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddCustomBillingItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billId: string;
  onSuccess: () => void;
}

export const AddCustomBillingItemDialog = ({
  open,
  onOpenChange,
  billId,
  onSuccess,
}: AddCustomBillingItemDialogProps) => {
  const [serviceName, setServiceName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!serviceName || !unitPrice || !quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const qty = Number(quantity);
    const price = Number(unitPrice);

    if (isNaN(qty) || isNaN(price)) {
      toast({
        title: "Validation Error",
        description: "Invalid quantity or price",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("bill_items").insert({
        bill_id: billId,
        service_name: serviceName,
        qty_decimal: qty,
        unit_price_cents: Math.round(price * 100),
        line_date: new Date().toISOString().split("T")[0],
        source: "manual",
        note: note || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom line item added",
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setServiceName("");
      setUnitPrice("");
      setQuantity("1");
      setNote("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Line Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="service-name">Service Name</Label>
            <Input
              id="service-name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g., Special Handling"
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="unit-price">Unit Price ($)</Label>
              <Input
                id="unit-price"
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional details..."
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Total: ${(Number(quantity || 0) * Number(unitPrice || 0)).toFixed(2)}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={saving}>
              {saving ? "Adding..." : "Add Line Item"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
