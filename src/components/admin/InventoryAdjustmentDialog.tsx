import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const adjustmentSchema = z.object({
  client_id: z.string().uuid(),
  sku_id: z.string().uuid(),
  location_id: z.string().uuid(),
  qty_delta: z.number().int().min(-1000000).max(1000000).refine(val => val !== 0, "Adjustment quantity cannot be zero"),
  reason_code: z.enum(['cycle_count', 'damage', 'shrink', 'rework', 'correction', 'return', 'other']),
  notes: z.string().trim().min(1, "Notes are required").max(1000),
  lot_number: z.string().trim().max(100).nullable().optional(),
  expiry_date: z.date().nullable().optional(),
});

interface InventoryAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const InventoryAdjustmentDialog = ({ open, onOpenChange, onSuccess }: InventoryAdjustmentDialogProps) => {
  const [clients, setClients] = useState<any[]>([]);
  const [skus, setSKUs] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    sku_id: "",
    location_id: "",
    qty_delta: "",
    reason_code: "cycle_count",
    notes: "",
    lot_number: "",
    expiry_date: null as Date | null,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchClients();
      fetchLocations();
    }
  }, [open]);

  useEffect(() => {
    if (formData.client_id) {
      fetchSKUs(formData.client_id);
    } else {
      setSKUs([]);
    }
  }, [formData.client_id]);

  const fetchClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name");
    setClients(data || []);
  };

  const fetchSKUs = async (clientId: string) => {
    const { data } = await supabase
      .from("skus")
      .select("id, client_sku, title")
      .eq("client_id", clientId)
      .eq("status", "active")
      .order("client_sku");
    setSKUs(data || []);
  };

  const fetchLocations = async () => {
    const { data } = await supabase
      .from("locations")
      .select("id, name, code")
      .eq("is_active", true)
      .order("name");
    setLocations(data || []);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const validated = adjustmentSchema.parse({
        client_id: formData.client_id,
        sku_id: formData.sku_id,
        location_id: formData.location_id,
        qty_delta: parseInt(formData.qty_delta),
        reason_code: formData.reason_code,
        notes: formData.notes,
        lot_number: formData.lot_number || null,
        expiry_date: formData.expiry_date || null,
      });

      // Determine transaction type based on qty_delta sign
      const transactionType = validated.qty_delta > 0 ? "ADJUSTMENT_PLUS" : "ADJUSTMENT_MINUS";
      
      const { error } = await supabase.from("inventory_ledger").insert({
        client_id: validated.client_id,
        sku_id: validated.sku_id,
        location_id: validated.location_id,
        qty_delta: validated.qty_delta,
        transaction_type: transactionType,
        reason_code: validated.reason_code,
        notes: validated.notes,
        lot_number: validated.lot_number,
        expiry_date: validated.expiry_date ? format(validated.expiry_date, "yyyy-MM-dd") : null,
      } as any);

      if (error) throw error;

      toast({
        title: "Adjustment recorded",
        description: `Inventory adjusted by ${validated.qty_delta > 0 ? '+' : ''}${validated.qty_delta} units`,
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Adjustment error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to record adjustment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: "",
      sku_id: "",
      location_id: "",
      qty_delta: "",
      reason_code: "cycle_count",
      notes: "",
      lot_number: "",
      expiry_date: null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Inventory Adjustment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, client_id: value, sku_id: "" });
                }}
              >
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

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Select
                value={formData.sku_id}
                onValueChange={(value) => setFormData({ ...formData, sku_id: value })}
                disabled={!formData.client_id}
              >
                <SelectTrigger id="sku">
                  <SelectValue placeholder={formData.client_id ? "Select SKU" : "Select client first"} />
                </SelectTrigger>
                <SelectContent>
                  {skus.map((sku) => (
                    <SelectItem key={sku.id} value={sku.id}>
                      {sku.client_sku} - {sku.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select
                value={formData.location_id}
                onValueChange={(value) => setFormData({ ...formData, location_id: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qty_delta">Adjustment Quantity *</Label>
              <Input
                id="qty_delta"
                type="number"
                placeholder="e.g., +50 or -25"
                value={formData.qty_delta}
                onChange={(e) => setFormData({ ...formData, qty_delta: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Use + for additions, - for reductions
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason_code">Reason Code *</Label>
            <Select
              value={formData.reason_code}
              onValueChange={(value) => setFormData({ ...formData, reason_code: value })}
            >
              <SelectTrigger id="reason_code">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cycle_count">Cycle Count</SelectItem>
                <SelectItem value="damage">Damage</SelectItem>
                <SelectItem value="shrink">Shrinkage</SelectItem>
                <SelectItem value="rework">Rework</SelectItem>
                <SelectItem value="correction">Correction</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes *</Label>
            <Textarea
              id="notes"
              placeholder="Explain the reason for this adjustment..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lot_number">Lot Number (Optional)</Label>
              <Input
                id="lot_number"
                placeholder="Enter lot number"
                value={formData.lot_number}
                onChange={(e) => setFormData({ ...formData, lot_number: e.target.value })}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiry_date ? format(formData.expiry_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiry_date || undefined}
                    onSelect={(date) => setFormData({ ...formData, expiry_date: date || null })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Recording..." : "Record Adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
