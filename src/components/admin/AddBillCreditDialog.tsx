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

interface AddBillCreditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billId: string;
  clientId: string;
  onSuccess: () => void;
}

const AddBillCreditDialog = ({ open, onOpenChange, billId, clientId, onSuccess }: AddBillCreditDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("goodwill");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const handleSave = async () => {
    const amountCents = Math.round(parseFloat(amount) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid credit amount",
        variant: "destructive",
      });
      return;
    }

    if (!memo) {
      toast({
        title: "Missing memo",
        description: "Please provide a reason for this credit",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("credits")
        .insert({
          client_id: clientId,
          bill_id: billId,
          reason,
          amount_cents: amountCents,
          memo,
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
    setReason("goodwill");
    setAmount("");
    setMemo("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Issue Credit</DialogTitle>
          <DialogDescription>
            Issue a credit to reduce the client's balance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="return">Return / Refund</SelectItem>
                <SelectItem value="damage">Damaged Goods</SelectItem>
                <SelectItem value="goodwill">Goodwill / Courtesy</SelectItem>
                <SelectItem value="pricing_error">Pricing Error</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Credit Amount ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Memo (required)</Label>
            <Textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Explain the reason for this credit"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Issuing..." : "Issue Credit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBillCreditDialog;