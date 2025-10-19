import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const quickSKUSchema = z.object({
  client_id: z.string().uuid(),
  client_sku: z.string().trim().min(1, "SKU is required").max(100),
  title: z.string().trim().min(1, "Title is required").max(500),
});

interface QuickAddSKUModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  onSuccess: (skuId: string) => void;
}

export const QuickAddSKUModal = ({ open, onOpenChange, clientId, onSuccess }: QuickAddSKUModalProps) => {
  const [formData, setFormData] = useState({
    client_sku: "",
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const validated = quickSKUSchema.parse({
        client_id: clientId,
        client_sku: formData.client_sku,
        title: formData.title,
      });

      // Check if SKU already exists for this client
      const { data: existing } = await supabase
        .from("skus")
        .select("id")
        .eq("client_id", clientId)
        .eq("client_sku", validated.client_sku)
        .maybeSingle();

      if (existing) {
        throw new Error("This SKU already exists for this client");
      }

      const { data: sku, error } = await supabase
        .from("skus")
        .insert({
          client_id: validated.client_id,
          client_sku: validated.client_sku,
          title: validated.title,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "SKU created successfully",
      });

      onSuccess(sku.id);
      onOpenChange(false);
      setFormData({ client_sku: "", title: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create SKU",
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
          <DialogTitle>Quick Add SKU</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client_sku">Client SKU *</Label>
            <Input
              id="client_sku"
              value={formData.client_sku}
              onChange={e => setFormData({ ...formData, client_sku: e.target.value })}
              placeholder="Enter SKU"
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Product title"
              maxLength={500}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            This creates a basic SKU record. Additional details can be added later.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create SKU"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
