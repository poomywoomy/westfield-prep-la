import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddBillingPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  billId: string;
  onSuccess: () => void;
}

export const AddBillingPaymentDialog = ({
  open,
  onOpenChange,
  clientId,
  billId,
  onSuccess,
}: AddBillingPaymentDialogProps) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("check");
  const [receivedAt, setReceivedAt] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState("");
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
      const amountCents = Math.round(Number(amount) * 100);
      
      const { error } = await supabase.from("payments").insert({
        client_id: clientId,
        bill_id: billId,
        amount_cents: amountCents,
        received_at: receivedAt,
        method: paymentMethod,
        memo: memo || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setAmount("");
      setPaymentMethod("check");
      setReceivedAt(new Date().toISOString().split('T')[0]);
      setMemo("");
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
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="wire">Wire Transfer</SelectItem>
                <SelectItem value="ach">ACH</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="received-at">Received Date</Label>
            <Input
              id="received-at"
              type="date"
              value={receivedAt}
              onChange={(e) => setReceivedAt(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Input
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Payment reference..."
              maxLength={200}
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
