import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface DiscrepancyAdminActionsProps {
  open: boolean;
  onClose: () => void;
  discrepancy: any;
  onSuccess: () => void;
}

export const DiscrepancyAdminActions = ({
  open,
  onClose,
  discrepancy,
  onSuccess,
}: DiscrepancyAdminActionsProps) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleClose = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("damaged_item_decisions")
        .update({
          status: "closed",
          admin_closed_at: new Date().toISOString(),
          admin_closed_by: user?.id,
          admin_close_notes: notes || null,
        })
        .eq("id", discrepancy.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discrepancy closed successfully",
      });

      onSuccess();
      onClose();
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReopen = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("damaged_item_decisions")
        .update({
          status: "pending",
          reopened_count: (discrepancy.reopened_count || 0) + 1,
          admin_notes: notes || null,
          submitted_at: null,
          processed_at: null,
        })
        .eq("id", discrepancy.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discrepancy reopened and sent back to client",
      });

      onSuccess();
      onClose();
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!discrepancy) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Admin Actions - {discrepancy.client_sku}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Discrepancy Type:</p>
            <p className="text-sm text-muted-foreground capitalize">{discrepancy.discrepancy_type}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Quantity:</p>
            <p className="text-sm text-muted-foreground">{discrepancy.quantity}</p>
          </div>

          {discrepancy.client_notes && (
            <div>
              <p className="text-sm font-medium">Client Notes:</p>
              <p className="text-sm text-muted-foreground">{discrepancy.client_notes}</p>
            </div>
          )}

          {discrepancy.decision && (
            <div>
              <p className="text-sm font-medium">Client Decision:</p>
              <p className="text-sm text-muted-foreground capitalize">{discrepancy.decision}</p>
            </div>
          )}

          <div>
            <Label htmlFor="admin-notes">Admin Notes</Label>
            <Textarea
              id="admin-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this discrepancy resolution..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReopen} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Reopening..." : "Reopen & Send to Client"}
          </Button>
          <Button onClick={handleClose} disabled={isSubmitting}>
            {isSubmitting ? "Closing..." : "Close Discrepancy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
