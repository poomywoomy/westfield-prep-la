import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface BulkProductActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'update-price' | 'update-service' | 'delete';
  selectedProducts: any[];
  onSuccess: () => void;
}

export function BulkProductActionsDialog({
  open,
  onOpenChange,
  action,
  selectedProducts,
  onSuccess,
}: BulkProductActionsDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [priceAdjustment, setPriceAdjustment] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<'fixed' | 'percentage'>('percentage');
  const [newServiceType, setNewServiceType] = useState("");

  const handleBulkUpdate = async () => {
    try {
      setLoading(true);

      if (action === 'update-price') {
        const adjustment = parseFloat(priceAdjustment);
        if (isNaN(adjustment)) {
          toast({
            title: "Invalid input",
            description: "Please enter a valid number",
            variant: "destructive",
          });
          return;
        }

        // Update each product individually
        for (const product of selectedProducts) {
          const currentPrice = Number(product.default_unit_price || 0);
          const newPrice = adjustmentType === 'percentage'
            ? currentPrice * (1 + adjustment / 100)
            : currentPrice + adjustment;
          
          const { error } = await supabase
            .from('client_skus')
            .update({ default_unit_price: Math.max(0, newPrice) })
            .eq('id', product.id);

          if (error) throw error;
        }

        toast({
          title: "Prices updated",
          description: `Updated ${selectedProducts.length} products`,
        });
      } else if (action === 'update-service') {
        if (!newServiceType) {
          toast({
            title: "Invalid input",
            description: "Please select a service type",
            variant: "destructive",
          });
          return;
        }

        // Update each product individually
        for (const product of selectedProducts) {
          const { error } = await supabase
            .from('client_skus')
            .update({ default_service_type: newServiceType })
            .eq('id', product.id);

          if (error) throw error;
        }

        toast({
          title: "Service types updated",
          description: `Updated ${selectedProducts.length} products`,
        });
      } else if (action === 'delete') {
        const ids = selectedProducts.map(p => p.id);
        const { error } = await supabase
          .from('client_skus')
          .delete()
          .in('id', ids);

        if (error) throw error;

        toast({
          title: "Products deleted",
          description: `Deleted ${selectedProducts.length} products`,
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "Failed to perform bulk action",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDialogTitle = () => {
    switch (action) {
      case 'update-price':
        return 'Bulk Price Update';
      case 'update-service':
        return 'Bulk Service Type Update';
      case 'delete':
        return 'Delete Products';
      default:
        return 'Bulk Action';
    }
  };

  const getDialogDescription = () => {
    switch (action) {
      case 'update-price':
        return `Update prices for ${selectedProducts.length} selected products`;
      case 'update-service':
        return `Update service type for ${selectedProducts.length} selected products`;
      case 'delete':
        return `This will permanently delete ${selectedProducts.length} products. This action cannot be undone.`;
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {action === 'update-price' && (
            <>
              <div className="space-y-2">
                <Label>Adjustment Type</Label>
                <Select value={adjustmentType} onValueChange={(v: any) => setAdjustmentType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Adjustment Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={adjustmentType === 'percentage' ? "e.g., 10 for +10%" : "e.g., 5.00"}
                  value={priceAdjustment}
                  onChange={(e) => setPriceAdjustment(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  {adjustmentType === 'percentage' 
                    ? 'Enter positive number to increase, negative to decrease'
                    : 'Enter amount to add (use negative for decrease)'}
                </p>
              </div>
            </>
          )}

          {action === 'update-service' && (
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select value={newServiceType} onValueChange={setNewServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FBA Prep">FBA Prep</SelectItem>
                  <SelectItem value="WFS Prep">WFS Prep</SelectItem>
                  <SelectItem value="TikTok Prep">TikTok Prep</SelectItem>
                  <SelectItem value="Shopify Fulfillment">Shopify Fulfillment</SelectItem>
                  <SelectItem value="Kitting">Kitting</SelectItem>
                  <SelectItem value="Labeling">Labeling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {action === 'delete' && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                You are about to delete {selectedProducts.length} products. This action is permanent and cannot be undone.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkUpdate}
            disabled={loading}
            variant={action === 'delete' ? 'destructive' : 'default'}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {action === 'delete' ? 'Delete' : 'Update'} Products
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
