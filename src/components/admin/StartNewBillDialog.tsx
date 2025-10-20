import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

interface StartNewBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  onSuccess: (billId: string) => void;
}

export const StartNewBillDialog = ({ open, onOpenChange, clients, onSuccess }: StartNewBillDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState("");
  const [label, setLabel] = useState("");
  const [memo, setMemo] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!clientId) {
      toast({
        title: "Validation Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Generate billing month from current date
      const now = new Date();
      const billingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

      const { data, error } = await supabase
        .from("bills")
        .insert({
          client_id: clientId,
          billing_month: billingMonth,
          label: label || null,
          memo: memo || null,
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New bill created successfully",
      });

      onSuccess(data.id);
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
    setClientId("");
    setLabel("");
    setMemo("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Bill</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="client">Client *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client" />
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

          <div>
            <Label htmlFor="label">Label (Optional)</Label>
            <Input
              id="label"
              placeholder="e.g., 2025-10 or Project X"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="memo">Notes (Optional)</Label>
            <Textarea
              id="memo"
              placeholder="Internal notes about this bill..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              maxLength={1000}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
