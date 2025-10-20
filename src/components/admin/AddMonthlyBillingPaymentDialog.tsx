import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddMonthlyBillingPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  cycleId: string;
  onSuccess: () => void;
}

const AddMonthlyBillingPaymentDialog = ({
  open,
  onOpenChange,
  clientId,
  cycleId,
  onSuccess,
}: AddMonthlyBillingPaymentDialogProps) => {
  const [paymentName, setPaymentName] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive amount",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("billing_payments").insert({
        client_id: clientId,
        cycle_id: cycleId,
        payment_name: paymentName,
        amount: Number(amount),
        payment_method: paymentMethod,
        payment_date: paymentDate,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setPaymentName("Deposit");
      setAmount("");
      setPaymentMethod("Cash");
      setPaymentDate(new Date().toISOString().split('T')[0]);
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
          <DialogTitle>Record Deposit / Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="payment-name">Payment Name</Label>
            <Input
              id="payment-name"
              value={paymentName}
              onChange={(e) => setPaymentName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Zelle">Zelle</SelectItem>
                <SelectItem value="Wire">Wire</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="payment-date">Payment Date</Label>
            <Input
              id="payment-date"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMonthlyBillingPaymentDialog;
