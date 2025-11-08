import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  const [statementStartDate, setStatementStartDate] = useState("");
  const [statementEndDate, setStatementEndDate] = useState("");
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

    if (!statementStartDate || !statementEndDate) {
      toast({
        title: "Validation Error",
        description: "Please enter statement start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (new Date(statementStartDate) > new Date(statementEndDate)) {
      toast({
        title: "Validation Error",
        description: "Start date must be before end date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if client already has an open bill
      const { data: existingBills } = await supabase
        .from("bills")
        .select("id")
        .eq("client_id", clientId)
        .eq("status", "open");

      if (existingBills && existingBills.length > 0) {
        toast({
          title: "Validation Error",
          description: "This client already has an open bill. Please close it first.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Get client's active quote
      const { data: quotes } = await supabase
        .from("quotes")
        .select("*")
        .eq("client_id", clientId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      const activeQuote = quotes?.[0];

      // If no active quote, check for custom_pricing
      let pricingQuoteId: string | null = null;
      const itemsToInsert: any[] = [];
      const now = new Date();

      if (!activeQuote) {
        // Check if custom_pricing exists
        const { data: customPricing } = await supabase
          .from("custom_pricing")
          .select("*")
          .eq("client_id", clientId);

        if (!customPricing || customPricing.length === 0) {
          toast({
            title: "No Pricing Found",
            description: "This client has no active quote and no custom pricing. Please create/activate a quote or apply pricing first.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Use custom_pricing instead
        pricingQuoteId = null;
        customPricing.forEach((pricing: any) => {
          itemsToInsert.push({
            service_name: pricing.service_name,
            unit_price_cents: Math.round(pricing.price_per_unit * 100),
            qty_decimal: 0,
            line_date: now.toISOString().split("T")[0],
            section_type: pricing.section_type || "Standard Operations",
            source: "pricing",
            note: pricing.notes,
          });
        });
      } else {
        pricingQuoteId = activeQuote.id;

        // Auto-populate from quote
        const quoteData = activeQuote.quote_data as any;

        if (quoteData.standard_operations && Array.isArray(quoteData.standard_operations)) {
          quoteData.standard_operations.forEach((op: any) => {
            itemsToInsert.push({
              service_name: op.service_name,
              qty_decimal: 0,
              unit_price_cents: Math.round(op.service_price * 100),
              line_date: now.toISOString().split("T")[0],
              source: "quote",
              section_type: "Standard Operations",
            });
          });
        }

        if (quoteData.fulfillment_sections && Array.isArray(quoteData.fulfillment_sections)) {
          quoteData.fulfillment_sections.forEach((section: any) => {
            if (section.items && Array.isArray(section.items)) {
              section.items.forEach((item: any) => {
                itemsToInsert.push({
                  service_name: item.service_name,
                  qty_decimal: 0,
                  unit_price_cents: Math.round(item.service_price * 100),
                  line_date: now.toISOString().split("T")[0],
                  source: "quote",
                  section_type: section.type || "Other Services",
                });
              });
            }
          });
        }
      }

      // Generate billing month from statement start date
      const billingMonth = statementStartDate.substring(0, 7) + "-01";

      const { data: bill, error: billError } = await supabase
        .from("bills")
        .insert({
          client_id: clientId,
          billing_month: billingMonth,
          status: "open",
          pricing_quote_id: pricingQuoteId,
          statement_start_date: statementStartDate,
          statement_end_date: statementEndDate,
        })
        .select()
        .single();

      if (billError) throw billError;

      // Add bill_id to all items and insert
      if (itemsToInsert.length > 0) {
        itemsToInsert.forEach(item => {
          item.bill_id = bill.id;
        });

        const { error: itemsError } = await supabase
          .from("bill_items")
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast({
        title: "Success",
        description: `New bill created with ${itemsToInsert.length} services auto-populated`,
      });

      onSuccess(bill.id);
      onOpenChange(false);
      setClientId("");
      setStatementStartDate("");
      setStatementEndDate("");
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
          </div>

          <div>
            <Label htmlFor="start">Statement Start Date *</Label>
            <Input
              id="start"
              type="date"
              value={statementStartDate}
              onChange={(e) => setStatementStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="end">Statement End Date *</Label>
            <Input
              id="end"
              type="date"
              value={statementEndDate}
              onChange={(e) => setStatementEndDate(e.target.value)}
            />
          </div>

          <p className="text-xs text-muted-foreground bg-muted p-3 rounded">
            All services from client's active quote or custom pricing will be auto-populated with quantity 0. Statement dates are required.
          </p>
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