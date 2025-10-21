import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type SKU = Database["public"]["Tables"]["skus"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

interface SKUFormDialogProps {
  open: boolean;
  onClose: () => void;
  sku: SKU | null;
  clients: Client[];
  isClientView?: boolean;
  presetClientId?: string;
}

export const SKUFormDialog = ({ open, onClose, sku, clients, isClientView = false, presetClientId }: SKUFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    client_id: "",
    client_sku: "",
    fnsku: "",
    asin: "",
    upc: "",
    ean: "",
    title: "",
    brand: "",
    unit_cost: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    has_expiration: false,
    has_lot_tracking: false,
    status: "active",
    notes: "",
  });

  useEffect(() => {
    if (sku) {
      setFormData({
        client_id: sku.client_id,
        client_sku: sku.client_sku,
        fnsku: sku.fnsku || "",
        asin: sku.asin || "",
        upc: sku.upc || "",
        ean: sku.ean || "",
        title: sku.title,
        brand: sku.brand || "",
        unit_cost: sku.unit_cost?.toString() || "",
        weight: sku.weight?.toString() || "",
        length: sku.length?.toString() || "",
        width: sku.width?.toString() || "",
        height: sku.height?.toString() || "",
        has_expiration: sku.has_expiration,
        has_lot_tracking: sku.has_lot_tracking,
        status: sku.status,
        notes: sku.notes || "",
      });
    } else {
      setFormData({
        client_id: presetClientId || "",
        client_sku: "",
        fnsku: "",
        asin: "",
        upc: "",
        ean: "",
        title: "",
        brand: "",
        unit_cost: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        has_expiration: false,
        has_lot_tracking: false,
        status: "active",
        notes: "",
      });
    }
  }, [sku, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      client_id: formData.client_id,
      client_sku: formData.client_sku,
      fnsku: formData.fnsku || null,
      asin: formData.asin || null,
      upc: formData.upc || null,
      ean: formData.ean || null,
      title: formData.title,
      brand: formData.brand || null,
      unit_cost: formData.unit_cost ? parseFloat(formData.unit_cost) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      length: formData.length ? parseFloat(formData.length) : null,
      width: formData.width ? parseFloat(formData.width) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      has_expiration: formData.has_expiration,
      has_lot_tracking: formData.has_lot_tracking,
      status: formData.status,
      notes: formData.notes || null,
    };

    const { error } = sku
      ? await supabase.from("skus").update(payload).eq("id", sku.id)
      : await supabase.from("skus").insert(payload);

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `SKU ${sku ? "updated" : "created"} successfully`,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sku ? "Edit SKU" : "Add New SKU"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {!isClientView && (
              <div className="space-y-2">
                <Label htmlFor="client_id">Client *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                  disabled={!!sku || !!presetClientId}
                >
                  <SelectTrigger>
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
            )}

            <div className="space-y-2">
              <Label htmlFor="client_sku">Client SKU *</Label>
              <Input
                id="client_sku"
                value={formData.client_sku}
                onChange={(e) => setFormData({ ...formData, client_sku: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fnsku">FNSKU</Label>
              <Input
                id="fnsku"
                value={formData.fnsku}
                onChange={(e) => setFormData({ ...formData, fnsku: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asin">ASIN</Label>
              <Input
                id="asin"
                value={formData.asin}
                onChange={(e) => setFormData({ ...formData, asin: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upc">UPC</Label>
              <Input
                id="upc"
                value={formData.upc}
                onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ean">EAN</Label>
              <Input
                id="ean"
                value={formData.ean}
                onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>

            {!isClientView && (
              <div className="space-y-2">
                <Label htmlFor="unit_cost">Unit Cost</Label>
                <Input
                  id="unit_cost"
                  type="number"
                  step="0.01"
                  value={formData.unit_cost}
                  onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                type="number"
                step="0.01"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="has_expiration">Has Expiration Date</Label>
              <Switch
                id="has_expiration"
                checked={formData.has_expiration}
                onCheckedChange={(checked) => setFormData({ ...formData, has_expiration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="has_lot_tracking">Has Lot Tracking</Label>
              <Switch
                id="has_lot_tracking"
                checked={formData.has_lot_tracking}
                onCheckedChange={(checked) => setFormData({ ...formData, has_lot_tracking: checked })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : sku ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
