import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteSKUDialogProps {
  sku: {
    id: string;
    client_sku: string;
    title: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteSKUDialog({ sku, open, onOpenChange, onSuccess }: DeleteSKUDialogProps) {
  const [loading, setLoading] = useState(false);
  const [hasInventory, setHasInventory] = useState(false);
  const [hasReferences, setHasReferences] = useState(false);

  const checkDependencies = async () => {
    if (!sku) return;
    
    setLoading(true);
    try {
      // Check for inventory
      const { data: inventory } = await supabase
        .from('inventory_summary')
        .select('on_hand')
        .eq('sku_id', sku.id)
        .maybeSingle();

      // Check for ASN references
      const { data: asnLines } = await supabase
        .from('asn_lines')
        .select('id')
        .eq('sku_id', sku.id)
        .limit(1);

      setHasInventory((inventory?.on_hand ?? 0) > 0);
      setHasReferences((asnLines?.length ?? 0) > 0);
    } catch (error) {
      console.error('Error checking dependencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!sku) return;

    setLoading(true);
    try {
      if (hasInventory || hasReferences) {
        // Soft delete - change status to 'deleted'
        const { error } = await supabase
          .from('skus')
          .update({ status: 'deleted' })
          .eq('id', sku.id);

        if (error) throw error;
        toast.success("SKU marked as deleted (has inventory/references)");
      } else {
        // Hard delete - completely remove
        const { error } = await supabase
          .from('skus')
          .delete()
          .eq('id', sku.id);

        if (error) throw error;
        toast.success("SKU deleted successfully");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting SKU:', error);
      toast.error(error.message || "Failed to delete SKU");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={checkDependencies}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Delete SKU
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{sku?.client_sku}</strong> ({sku?.title})?
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-4 text-center text-muted-foreground">Checking dependencies...</div>
        ) : (
          <div className="space-y-3">
            {hasInventory && (
              <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3 text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> This SKU has active inventory. It will be marked as deleted but not removed from the system.
              </div>
            )}
            {hasReferences && (
              <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3 text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> This SKU is referenced in ASNs. It will be marked as deleted but not removed from the system.
              </div>
            )}
            {!hasInventory && !hasReferences && (
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 text-sm text-blue-800 dark:text-blue-200">
                This SKU has no inventory or references and will be permanently deleted.
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete SKU"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
