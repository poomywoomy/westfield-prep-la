import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
      // Get client's active quote
      const { data: quotes } = await supabase
        .from("quotes")
        .select("*")
        .eq("client_id", clientId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      const activeQuote = quotes?.[0];

      // Generate billing month from current date
      const now = new Date();
      const billingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

      const { data: bill, error: billError } = await supabase
        .from("bills")
        .insert({
          client_id: clientId,
          billing_month: billingMonth,
          status: "open",
          pricing_quote_id: activeQuote?.id || null,
        })
        .select()
        .single();

      if (billError) throw billError;

      // Auto-populate line items from quote with quantity 0
      if (activeQuote) {
        const quoteData = activeQuote.quote_data as any;
        const lineItems: any[] = [];

        if (quoteData.standard_operations && Array.isArray(quoteData.standard_operations)) {
          quoteData.standard_operations.forEach((op: any) => {
            lineItems.push({
              bill_id: bill.id,
              service_name: op.service_name,
              qty_decimal: 0,
              unit_price_cents: Math.round(op.service_price * 100),
              line_date: now.toISOString().split("T")[0],
              source: "quote",
            });
          });
        }

        if (quoteData.fulfillment_sections && Array.isArray(quoteData.fulfillment_sections)) {
          quoteData.fulfillment_sections.forEach((section: any) => {
            if (section.items && Array.isArray(section.items)) {
              section.items.forEach((item: any) => {
                lineItems.push({
                  bill_id: bill.id,
                  service_name: item.service_name,
                  qty_decimal: 0,
                  unit_price_cents: Math.round(item.service_price * 100),
                  line_date: now.toISOString().split("T")[0],
                  source: "quote",
                });
              });
            }
          });
        }

        if (lineItems.length > 0) {
          const { error: itemsError } = await supabase
            .from("bill_items")
            .insert(lineItems);

          if (itemsError) throw itemsError;
        }
      }

      toast({
        title: "Success",
        description: "New bill created with services from quote",
      });

      onSuccess(bill.id);
      onOpenChange(false);
      setClientId("");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="client">Select Client *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              All services from client's active quote will be auto-populated with quantity 0
            </p>
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