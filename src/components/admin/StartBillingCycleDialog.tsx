import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!client) return;

    setLoading(true);

    try {
      // Auto-calculate current month dates
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const toYmd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const statementStartDate = toYmd(start);
      const statementEndDate = toYmd(end);
      const billingMonth = statementStartDate;

      // Check for existing bills for the current month (any status)
      const { data: existingBills } = await supabase
        .from("bills")
        .select("id, status")
        .eq("client_id", client.id)
        .eq("billing_month", billingMonth);

      if (existingBills && existingBills.length > 0) {
        const existingBill = existingBills[0];
        if (existingBill.status === "open") {
          toast({
            title: "Open Bill Exists",
            description: "This client already has an open bill for this month. Please close it before starting a new one.",
            variant: "destructive",
          });
        } else if (existingBill.status === "closed") {
          const monthName = new Date(billingMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });
          toast({
            title: "Closed Bill Exists",
            description: `A closed bill already exists for ${monthName}. View it in the Bill History tab to reopen or download PDF.`,
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      }

      // Robust pricing resolution: active quote → latest draft → custom pricing
      let pricingQuoteId: string | null = null;
      const itemsToInsert: any[] = [];
      let resolvedQuote: any = null;

      // 1) Try active quote
      const { data: activeQuote } = await supabase
        .from("quotes")
        .select("*")
        .eq("client_id", client.id)
        .eq("status", "active")
        .maybeSingle();

      if (activeQuote) {
        resolvedQuote = activeQuote;
      } else {
        // 2) Try most recent quote (including draft)
        const { data: latestQuote } = await supabase
          .from("quotes")
          .select("*")
          .eq("client_id", client.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestQuote) {
          resolvedQuote = latestQuote;
        }
      }

      if (resolvedQuote) {
        pricingQuoteId = resolvedQuote.id;
        const quoteData = resolvedQuote.quote_data as any;

        // Support multiple quote schemas
        // New schema: standard_operations
        if (quoteData.standard_operations) {
          quoteData.standard_operations.forEach((service: any) => {
            itemsToInsert.push({
              service_name: service.service_name,
              service_code: service.service_code || null,
              unit_price_cents: Math.round((service.service_price || 0) * 100),
              qty_decimal: 0,
              section_type: "Standard Operations",
              source: "manual",
            });
          });
        }

        // New schema: fulfillment_sections
        if (quoteData.fulfillment_sections) {
          quoteData.fulfillment_sections.forEach((section: any) => {
            section.items?.forEach((service: any) => {
              itemsToInsert.push({
                service_name: service.service_name,
                service_code: service.service_code || null,
                unit_price_cents: Math.round((service.service_price || 0) * 100),
                qty_decimal: 0,
                section_type: section.type,
                source: "manual",
              });
            });
          });
        }

        // Old schema: flat services array
        if (quoteData.services && Array.isArray(quoteData.services)) {
          quoteData.services.forEach((service: any) => {
            itemsToInsert.push({
              service_name: service.service_name,
              service_code: service.service_code || null,
              unit_price_cents: Math.round((service.service_price || 0) * 100),
              qty_decimal: 0,
              section_type: service.section_type || "Standard Operations",
              source: "manual",
            });
          });
        }
      } else {
        // 3) Fallback to custom_pricing
        const { data: customPricing } = await supabase
          .from("custom_pricing")
          .select("*")
          .eq("client_id", client.id);

        if (!customPricing || customPricing.length === 0) {
          toast({
            title: "No Pricing Found",
            description: "This client has no quote or custom pricing. Please configure pricing first.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        pricingQuoteId = null;
        customPricing.forEach((pricing: any) => {
          itemsToInsert.push({
            service_name: pricing.service_name,
            service_code: null,
            unit_price_cents: Math.round(pricing.price_per_unit * 100),
            qty_decimal: 0,
            section_type: pricing.section_type || "Standard Operations",
            source: "manual",
            note: pricing.notes,
          });
        });
      }

      // TODO: Shopify product type billing check temporarily disabled due to Supabase TypeScript complexity
      // When this is re-enabled, check for:
      // 1. SKUs with product_type='single' and shopify_variant_id not null
      // 2. SKUs with product_type='kit' and shopify_variant_id not null
      // 3. Show toast warning if custom_pricing missing 'single_product_fee' or 'kit_product_fee'
      // Admin should manually verify pricing includes these service types for Shopify-connected clients

      // Create the bill
      const { data: newBill, error: billError } = await supabase
        .from("bills")
        .insert({
          client_id: client.id,
          billing_month: billingMonth,
          statement_start_date: statementStartDate,
          statement_end_date: statementEndDate,
          status: "open",
          pricing_quote_id: pricingQuoteId,
          subtotal_cents: 0,
          amount_due_cents: 0,
        })
        .select()
        .single();

      if (billError) throw billError;

      // Add bill_id to all items
      itemsToInsert.forEach(item => {
        item.bill_id = newBill.id;
      });

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from("bill_items")
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast({
        title: "Success",
        description: `Billing cycle started with ${itemsToInsert.length} services auto-populated`,
      });

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
            Statement dates will be auto-set to the current month. 
            Services from the client's pricing will be preloaded with quantity 0.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click "Start Billing Cycle" to create a new bill for <strong>{client?.company_name || client?.contact_name}</strong>.
            The system will automatically set the billing period to the current month and populate all services.
          </p>
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
