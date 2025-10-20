import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type BillItem = Database["public"]["Tables"]["bill_items"]["Row"];
type Quote = Database["public"]["Tables"]["quotes"]["Row"];

interface RepriceBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billId: string;
  billItems: BillItem[];
  quote: Quote | null;
  onSuccess: () => void;
}

export const RepriceBillDialog = ({
  open,
  onOpenChange,
  billId,
  billItems,
  quote,
  onSuccess,
}: RepriceBillDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState<"all" | "after_date" | "selected">("all");
  const [afterDate, setAfterDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  if (!quote?.quote_data || typeof quote.quote_data !== 'object' || !('services' in quote.quote_data)) {
    return null;
  }

  const quoteServices = quote.quote_data.services as any[];

  const handleReprice = async () => {
    if (!quote) return;

    setLoading(true);

    try {
      let itemsToUpdate = billItems;

      if (scope === "after_date" && afterDate) {
        itemsToUpdate = billItems.filter((item) => item.line_date >= afterDate);
      } else if (scope === "selected") {
        itemsToUpdate = billItems.filter((item) => selectedIds.has(item.id));
      }

      if (itemsToUpdate.length === 0) {
        toast({
          title: "No Items",
          description: "No items match the selected scope",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Update each item with new pricing from quote
      for (const item of itemsToUpdate) {
        const quoteService = quoteServices.find((s: any) => s.name === item.service_name);
        if (quoteService) {
          const newPrice = Math.round(parseFloat(quoteService.price) * 100); // Convert to cents

          await supabase
            .from("bill_items")
            .update({
              unit_price_cents: newPrice,
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.id);
        }
      }

      toast({
        title: "Success",
        description: `Repriced ${itemsToUpdate.length} items`,
      });

      onSuccess();
      onOpenChange(false);
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

  const toggleSelection = (itemId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedIds(newSelected);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reprice Existing Lines</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={scope} onValueChange={(v: any) => setScope(v)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All lines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="after_date" id="after_date" />
              <Label htmlFor="after_date">Only lines after date:</Label>
              <Input
                type="date"
                value={afterDate}
                onChange={(e) => setAfterDate(e.target.value)}
                disabled={scope !== "after_date"}
                className="w-48"
              />
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selected" id="selected" />
              <Label htmlFor="selected">Selected lines (manual)</Label>
            </div>
          </RadioGroup>

          {scope === "selected" && (
            <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {billItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {item.service_name} - ${(item.unit_price_cents / 100).toFixed(2)} x {item.qty_decimal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-semibold mb-2">Preview Changes</h4>
            <p className="text-sm text-muted-foreground">
              This will update pricing based on the current active quote. Old prices will be replaced with new prices
              from the quote.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleReprice} disabled={loading}>
            {loading ? "Updating..." : "Reprice Lines"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
