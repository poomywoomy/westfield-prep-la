import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const generatePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;
  
  // Ensure at least one of each character type
  const array = new Uint32Array(16);
  crypto.getRandomValues(array);
  
  let password = [
    uppercase[array[0] % uppercase.length],
    lowercase[array[1] % lowercase.length],
    numbers[array[2] % numbers.length],
    special[array[3] % special.length],
  ];
  
  // Fill rest with random characters
  for (let i = 4; i < 16; i++) {
    password.push(allChars[array[i] % allChars.length]);
  }
  
  // Shuffle to randomize positions
  const shuffleArray = new Uint32Array(16);
  crypto.getRandomValues(shuffleArray);
  return password.sort(() => 0.5 - shuffleArray[0] / 0xFFFFFFFF).join('');
};

const CreateClientDialog = ({ open, onOpenChange, onSuccess }: CreateClientDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    estimated_units_per_month: "",
    receiving_format: "both" as "pallets" | "cartons" | "both",
    extra_prep: false,
    storage: false,
    storage_units_per_month: "",
    admin_notes: "",
    fulfillment_services: [] as Array<"fba_prep" | "wfs_prep" | "tiktok_prep" | "self_fulfilled" | "shopify" | "returns_processing">,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tempPassword = generatePassword();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Create client using edge function with service role
      const { data: clientData, error: clientError } = await supabase.functions.invoke('create-client', {
        body: {
          email: formData.email,
          tempPassword: tempPassword,
          company_name: formData.company_name,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          estimated_units_per_month: formData.estimated_units_per_month ? parseInt(formData.estimated_units_per_month) : null,
          receiving_format: formData.receiving_format,
          extra_prep: formData.extra_prep,
          storage: formData.storage,
          storage_units_per_month: formData.storage_units_per_month ? parseInt(formData.storage_units_per_month) : null,
          admin_notes: formData.admin_notes,
          fulfillment_services: formData.fulfillment_services,
          password_expires_at: expiresAt.toISOString(),
        }
      });

      if (clientError) throw clientError;
      if (!clientData?.success) throw new Error(clientData?.error || "Failed to create client");

      // Send credentials email
      try {
        await supabase.functions.invoke('send-client-credentials', {
          body: {
            email: formData.email,
            companyName: formData.company_name,
            contactName: `${formData.first_name} ${formData.last_name}`,
            tempPassword: tempPassword,
          },
        });
        console.log('Credentials email sent successfully');
      } catch (emailError: any) {
        console.error('Failed to send credentials email:', emailError);
        // Don't throw - client was created successfully
      }

      toast({
        title: "Client created",
        description: `An email with login credentials has been sent to ${formData.email}`,
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
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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

          <div className="space-y-3">
            <Label>Fulfillment Services</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fba_prep"
                  checked={formData.fulfillment_services.includes('fba_prep')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'fba_prep'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'fba_prep') });
                    }
                  }}
                />
                <Label htmlFor="fba_prep" className="font-normal cursor-pointer">FBA Prep</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wfs_prep"
                  checked={formData.fulfillment_services.includes('wfs_prep')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'wfs_prep'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'wfs_prep') });
                    }
                  }}
                />
                <Label htmlFor="wfs_prep" className="font-normal cursor-pointer">WFS Prep</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tiktok_prep"
                  checked={formData.fulfillment_services.includes('tiktok_prep')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'tiktok_prep'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'tiktok_prep') });
                    }
                  }}
                />
                <Label htmlFor="tiktok_prep" className="font-normal cursor-pointer">TikTok Shop Prep</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="self_fulfilled"
                  checked={formData.fulfillment_services.includes('self_fulfilled')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'self_fulfilled'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'self_fulfilled') });
                    }
                  }}
                />
                <Label htmlFor="self_fulfilled" className="font-normal cursor-pointer">Self-Fulfilled Shipment</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shopify"
                  checked={formData.fulfillment_services.includes('shopify')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'shopify'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'shopify') });
                    }
                  }}
                />
                <Label htmlFor="shopify" className="font-normal cursor-pointer">Shopify</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="returns_processing"
                  checked={formData.fulfillment_services.includes('returns_processing')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'returns_processing'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'returns_processing') });
                    }
                  }}
                />
                <Label htmlFor="returns_processing" className="font-normal cursor-pointer">Returns Processing</Label>
              </div>
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
              {loading ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;
