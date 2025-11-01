import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StartBillingCycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any | null;
  onSuccess: (billId: string) => void;
}

export const StartBillingCycleDialog = ({
  open,
  onOpenChange,
  client,
  onSuccess,
}: StartBillingCycleDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [statementStartDate, setStatementStartDate] = useState("");
  const [statementEndDate, setStatementEndDate] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!client) return;

    if (!statementStartDate || !statementEndDate) {
      toast({
        title: "Missing Information",
        description: "Please provide both statement start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (new Date(statementStartDate) >= new Date(statementEndDate)) {
      toast({
        title: "Invalid Date Range",
        description: "Statement start date must be before end date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check for existing open bills
      const { data: existingBills } = await supabase
        .from("bills")
        .select("id")
        .eq("client_id", client.id)
        .eq("status", "open");

      if (existingBills && existingBills.length > 0) {
        toast({
          title: "Open Bill Exists",
          description: "This client already has an open bill. Please close it before starting a new one.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Get active quote
      const { data: activeQuote } = await supabase
        .from("quotes")
        .select("*")
        .eq("client_id", client.id)
        .eq("status", "active")
        .single();

      if (!activeQuote) {
        toast({
          title: "No Active Quote",
          description: "This client has no active pricing quote. Please assign one first.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create the bill
      const billingMonth = new Date(statementStartDate);
      const { data: newBill, error: billError } = await supabase
        .from("bills")
        .insert({
          client_id: client.id,
          billing_month: billingMonth.toISOString().split("T")[0],
          statement_start_date: statementStartDate,
          statement_end_date: statementEndDate,
          status: "open",
          pricing_quote_id: activeQuote.id,
          subtotal_cents: 0,
          amount_due_cents: 0,
        })
        .select()
        .single();

      if (billError) throw billError;

      // Auto-populate from quote
      const quoteData = activeQuote.quote_data as any;
      const itemsToInsert: any[] = [];

      // Add Standard Operations
      if (quoteData.standard_operations) {
        quoteData.standard_operations.forEach((service: any) => {
          itemsToInsert.push({
            bill_id: newBill.id,
            service_name: service.service_name,
            service_code: service.service_code || null,
            unit_price_cents: Math.round(service.price_per_unit * 100),
            qty_decimal: 0,
            section_type: "Standard Operations",
            source: "quote",
          });
        });
      }

      // Add fulfillment sections
      if (quoteData.fulfillment_sections) {
        quoteData.fulfillment_sections.forEach((section: any) => {
          section.items?.forEach((service: any) => {
            itemsToInsert.push({
              bill_id: newBill.id,
              service_name: service.service_name,
              service_code: service.service_code || null,
              unit_price_cents: Math.round(service.price_per_unit * 100),
              qty_decimal: 0,
              section_type: section.type,
              source: "quote",
            });
          });
        });
      }

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from("bill_items")
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast({
        title: "Success",
        description: "Billing cycle started and services auto-populated from quote",
      });

      setStatementStartDate("");
      setStatementEndDate("");
      onSuccess(newBill.id);
    } catch (error: any) {
      console.error("Error starting billing cycle:", error);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Billing Cycle</DialogTitle>
          <DialogDescription>
            Set the statement period for {client?.company_name || client?.contact_name}. 
            All services from the active quote will be auto-populated with quantity 0.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="start-date">Statement Start Date *</Label>
            <Input
              id="start-date"
              type="date"
              value={statementStartDate}
              onChange={(e) => setStatementStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="end-date">Statement End Date *</Label>
            <Input
              id="end-date"
              type="date"
              value={statementEndDate}
              onChange={(e) => setStatementEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Start Billing Cycle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
