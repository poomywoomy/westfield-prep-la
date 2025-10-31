import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Wallet, CreditCard, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [paymentType, setPaymentType] = useState<"regular_payment" | "deposit_application">("regular_payment");
  const [paymentMethod, setPaymentMethod] = useState("check");
  const [receivedAt, setReceivedAt] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);
  const [depositBalance, setDepositBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchDepositBalance();
    }
  }, [open, clientId]);

  const fetchDepositBalance = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("deposit_balance_cents")
        .eq("id", clientId)
        .single();

      if (error) throw error;
      setDepositBalance((data?.deposit_balance_cents || 0) / 100);
    } catch (error: any) {
      console.error("Error fetching deposit balance:", error);
    }
  };

  const handleSave = async () => {
    const amountNum = Number(amount);
    
    if (!amount || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive amount",
        variant: "destructive",
      });
      return;
    }

    if (paymentType === "deposit_application" && amountNum > depositBalance) {
      toast({
        title: "Insufficient Deposit Balance",
        description: `Available deposit: $${depositBalance.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const amountCents = Math.round(amountNum * 100);
      
      // Insert payment record
      const { error: paymentError } = await supabase.from("payments").insert({
        client_id: clientId,
        bill_id: billId,
        amount_cents: amountCents,
        received_at: receivedAt,
        method: paymentType === "deposit_application" ? "deposit_application" : paymentMethod,
        memo: memo || null,
        payment_type: paymentType,
      });

      if (paymentError) throw paymentError;

      // If deposit application, deduct from client's deposit balance
      if (paymentType === "deposit_application") {
        const { error: balanceError } = await supabase
          .from("clients")
          .update({
            deposit_balance_cents: Math.round((depositBalance - amountNum) * 100),
          })
          .eq("id", clientId);

        if (balanceError) throw balanceError;
      }

      toast({
        title: "Success",
        description: paymentType === "deposit_application" 
          ? "Deposit applied successfully" 
          : "Payment recorded successfully",
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setAmount("");
      setPaymentType("regular_payment");
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Deposit Balance Display */}
          <Alert>
            <Wallet className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Current Deposit Balance</span>
              <Badge variant="secondary" className="text-base font-semibold">
                ${depositBalance.toFixed(2)}
              </Badge>
            </AlertDescription>
          </Alert>

          {/* Payment Type Selection */}
          <div className="space-y-3">
            <Label>Payment Type</Label>
            <RadioGroup value={paymentType} onValueChange={(val) => setPaymentType(val as any)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="regular_payment" id="regular" />
                <Label htmlFor="regular" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Regular Payment</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Record a new payment received
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="deposit_application" id="deposit" />
                <Label htmlFor="deposit" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span className="font-medium">Apply from Deposit Balance</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use existing deposit balance (Available: ${depositBalance.toFixed(2)})
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={paymentType === "deposit_application" ? depositBalance : undefined}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-lg"
            />
            {paymentType === "deposit_application" && Number(amount) > depositBalance && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Amount exceeds available deposit balance
              </p>
            )}
          </div>

          {/* Payment Method - only for regular payments */}
          {paymentType === "regular_payment" && (
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
          )}

          {/* Received Date */}
          <div>
            <Label htmlFor="received-at">
              {paymentType === "deposit_application" ? "Application Date" : "Received Date"}
            </Label>
            <Input
              id="received-at"
              type="date"
              value={receivedAt}
              onChange={(e) => setReceivedAt(e.target.value)}
            />
          </div>

          {/* Memo */}
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

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Processing..." : paymentType === "deposit_application" ? "Apply Deposit" : "Save Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
