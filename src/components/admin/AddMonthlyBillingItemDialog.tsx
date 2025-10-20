import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AddMonthlyBillingItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: {
    service_name: string;
    unit_price: number;
    quantity: number;
    item_type: string;
  }) => void;
}

const AddMonthlyBillingItemDialog = ({
  open,
  onOpenChange,
  onAdd,
}: AddMonthlyBillingItemDialogProps) => {
  const [isFlatAdjustment, setIsFlatAdjustment] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [flatAmount, setFlatAmount] = useState("");

  const handleAdd = () => {
    if (isFlatAdjustment) {
      if (!serviceName || !flatAmount) return;
      
      onAdd({
        service_name: serviceName,
        unit_price: Number(flatAmount),
        quantity: 1,
        item_type: "adjustment",
      });
    } else {
      if (!serviceName || !unitPrice || !quantity) return;
      
      onAdd({
        service_name: serviceName,
        unit_price: Number(unitPrice),
        quantity: Number(quantity),
        item_type: "custom",
      });
    }

    // Reset form
    setServiceName("");
    setUnitPrice("");
    setQuantity("1");
    setFlatAmount("");
    setIsFlatAdjustment(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="flat-adjustment">Flat Cash Adjustment</Label>
            <Switch
              id="flat-adjustment"
              checked={isFlatAdjustment}
              onCheckedChange={setIsFlatAdjustment}
            />
          </div>

          {isFlatAdjustment ? (
            <>
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g., Special Discount"
                />
              </div>

              <div>
                <Label htmlFor="flat-amount">Cash Amount ($)</Label>
                <Input
                  id="flat-amount"
                  type="number"
                  step="0.01"
                  value={flatAmount}
                  onChange={(e) => setFlatAmount(e.target.value)}
                  placeholder="Use negative for credit"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Positive = charge, Negative = credit
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g., Custom Packaging"
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

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Allow negative for credit"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Negative quantity = credit or deduction
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Entry</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMonthlyBillingItemDialog;
