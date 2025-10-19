import { useState } from "react";
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

interface AddBillPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billId: string;
  clientId: string;
  onSuccess: () => void;
}

const AddBillPaymentDialog = ({ open, onOpenChange, billId, clientId, onSuccess }: AddBillPaymentDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("card");
  const [amount, setAmount] = useState("");
  const [externalRef, setExternalRef] = useState("");
  const [memo, setMemo] = useState("");
  const [receivedAt, setReceivedAt] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = async () => {
    const amountCents = Math.round(parseFloat(amount) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("payments")
        .insert({
          client_id: clientId,
          bill_id: billId,
          method,
          amount_cents: amountCents,
          external_ref: externalRef || null,
          received_at: receivedAt,
          memo: memo || null,
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
    setMethod("card");
    setAmount("");
    setExternalRef("");
    setMemo("");
    setReceivedAt(new Date().toISOString().split('T')[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment received for this bill
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="ach">ACH / Bank Transfer</SelectItem>
                <SelectItem value="wire">Wire Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="manual">Manual / Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Date Received</Label>
            <Input
              type="date"
              value={receivedAt}
              onChange={(e) => setReceivedAt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Reference / Transaction ID (optional)</Label>
            <Input
              value={externalRef}
              onChange={(e) => setExternalRef(e.target.value)}
              placeholder="Stripe charge ID, check number, etc."
            />
          </div>

          <div className="space-y-2">
            <Label>Memo (optional)</Label>
            <Textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Additional notes about this payment"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Recording..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBillPaymentDialog;