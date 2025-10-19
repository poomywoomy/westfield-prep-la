import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface CreateBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Array<{ id: string; company_name: string }>;
  preSelectedClientId?: string;
  onSuccess: (billId: string, clientId: string) => void;
}

export function CreateBillDialog({
  open,
  onOpenChange,
  clients,
  preSelectedClientId,
  onSuccess
}: CreateBillDialogProps) {
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState(preSelectedClientId || "");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate month options (last 12 months + next 6 months)
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let i = -12; i <= 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = format(date, 'MMMM yyyy');
      options.push({ value, label });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  const handleCreate = async () => {
    if (!selectedClientId) {
      toast({
        title: "Client Required",
        description: "Please select a client",
        variant: "destructive"
      });
      return;
    }

    if (!selectedMonth) {
      toast({
        title: "Month Required",
        description: "Please select a billing month",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Convert YYYY-MM to YYYY-MM-01 for database
      const billingMonth = `${selectedMonth}-01`;

      const { data, error } = await supabase
        .from('bills')
        .insert({
          client_id: selectedClientId,
          billing_month: billingMonth,
          status: 'open',
          opened_at: new Date().toISOString(),
          subtotal_cents: 0,
          discount_cents: 0,
          amount_due_cents: 0,
          memo: memo.trim() || null
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Bill Already Exists",
            description: "A bill for this client and month already exists",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Bill Created",
        description: "New bill has been created successfully"
      });

      onSuccess(data.id, selectedClientId);
      onOpenChange(false);
      
      // Reset form
      setSelectedClientId(preSelectedClientId || "");
      setSelectedMonth(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      });
      setMemo("");
    } catch (error) {
      console.error('Error creating bill:', error);
      toast({
        title: "Error",
        description: "Failed to create bill",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="client">Client</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="month">Billing Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger id="month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Add notes about this bill..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create Bill"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
