import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const CreateClientDialog = ({ open, onOpenChange, onSuccess }: CreateClientDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone_number: "",
    estimated_units_per_month: "",
    receiving_format: "both" as "pallets" | "cartons" | "both",
    extra_prep: false,
    storage: false,
    storage_units_per_month: "",
    billing_frequency: "end_of_month" as "pay_as_go" | "end_of_month",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tempPassword = generatePassword();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Create profile
      await supabase.from("profiles").insert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.contact_name,
        company_name: formData.company_name,
        phone_number: formData.phone_number,
      });

      // Assign client role
      await supabase.from("user_roles").insert({
        user_id: authData.user.id,
        role: "client",
      });

      // Create client record
      await supabase.from("clients").insert({
        user_id: authData.user.id,
        company_name: formData.company_name,
        contact_name: formData.contact_name,
        email: formData.email,
        phone_number: formData.phone_number,
        estimated_units_per_month: formData.estimated_units_per_month ? parseInt(formData.estimated_units_per_month) : null,
        receiving_format: formData.receiving_format,
        extra_prep: formData.extra_prep,
        storage: formData.storage,
        storage_units_per_month: formData.storage_units_per_month ? parseInt(formData.storage_units_per_month) : null,
        billing_frequency: formData.billing_frequency,
        temp_password: tempPassword,
        password_expires_at: expiresAt.toISOString(),
      });

      toast({
        title: "Client created",
        description: `Temporary password: ${tempPassword} (expires in 24 hours)`,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
          <DialogDescription>
            Add a new client account with a temporary 24-hour password.
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
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

            <div className="space-y-2">
              <Label htmlFor="billing_frequency">Billing Frequency</Label>
              <Select
                value={formData.billing_frequency}
                onValueChange={(value: any) => setFormData({ ...formData, billing_frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pay_as_go">Pay As Go</SelectItem>
                  <SelectItem value="end_of_month">End of Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage_units">Storage Units/Month</Label>
              <Input
                id="storage_units"
                type="number"
                value={formData.storage_units_per_month}
                onChange={(e) => setFormData({ ...formData, storage_units_per_month: e.target.value })}
              />
            </div>
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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;
