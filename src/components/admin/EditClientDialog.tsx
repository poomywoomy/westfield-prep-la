import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
  onSuccess: () => void;
}

const EditClientDialog = ({ open, onOpenChange, client, onSuccess }: EditClientDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    phone_number: "",
    estimated_units_per_month: "",
    receiving_format: "both" as "pallets" | "cartons" | "both",
    extra_prep: false,
    storage: false,
    storage_units_per_month: "",
    admin_notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client.company_name || "",
        contact_name: client.contact_name || "",
        phone_number: client.phone_number || "",
        estimated_units_per_month: client.estimated_units_per_month?.toString() || "",
        receiving_format: client.receiving_format || "both",
        extra_prep: client.extra_prep || false,
        storage: client.storage || false,
        storage_units_per_month: client.storage_units_per_month?.toString() || "",
        admin_notes: client.admin_notes || "",
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("clients")
        .update({
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          phone_number: formData.phone_number,
          estimated_units_per_month: formData.estimated_units_per_month ? parseInt(formData.estimated_units_per_month) : null,
          receiving_format: formData.receiving_format,
          extra_prep: formData.extra_prep,
          storage: formData.storage,
          storage_units_per_month: formData.storage_units_per_month ? parseInt(formData.storage_units_per_month) : null,
          admin_notes: formData.admin_notes,
        })
        .eq("id", client.id);

      if (error) throw error;

      toast({
        title: "Client updated",
        description: "Client information has been updated successfully.",
      });

      onSuccess();
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Update client information and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name *</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_units">Estimated Units/Month</Label>
              <Input
                id="estimated_units"
                type="number"
                value={formData.estimated_units_per_month}
                onChange={(e) => setFormData({ ...formData, estimated_units_per_month: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiving_format">Receiving Format</Label>
              <Select
                value={formData.receiving_format}
                onValueChange={(value: any) => setFormData({ ...formData, receiving_format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pallets">Pallets</SelectItem>
                  <SelectItem value="cartons">Cartons</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.storage && (
              <div className="space-y-2">
                <Label htmlFor="storage_units">Storage Units/Month</Label>
                <Input
                  id="storage_units"
                  type="number"
                  value={formData.storage_units_per_month}
                  onChange={(e) => setFormData({ ...formData, storage_units_per_month: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="extra_prep"
                checked={formData.extra_prep}
                onCheckedChange={(checked) => setFormData({ ...formData, extra_prep: checked as boolean })}
              />
              <Label htmlFor="extra_prep">Extra Prep</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="storage"
                checked={formData.storage}
                onCheckedChange={(checked) => setFormData({ ...formData, storage: checked as boolean })}
              />
              <Label htmlFor="storage">Storage</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_notes">Admin Notes (Internal Only)</Label>
            <Textarea
              id="admin_notes"
              value={formData.admin_notes}
              onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
              placeholder="Internal notes visible only to admin..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
