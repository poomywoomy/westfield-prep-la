import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResolveIssueDialogProps {
  asnId: string | null;
  asnNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ResolveIssueDialog({ asnId, asnNumber, open, onOpenChange, onSuccess }: ResolveIssueDialogProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    if (!asnId) return;

    setLoading(true);
    try {
      // First, check if all discrepancies have client decisions
      const { data: asnLines } = await supabase
        .from('asn_lines')
        .select('damaged_units, missing_units, quarantined_units')
        .eq('asn_id', asnId);

      if (!asnLines) throw new Error("Failed to load ASN lines");

      // Count total discrepancies
      const totalDamaged = asnLines.reduce((sum, line) => sum + (line.damaged_units || 0), 0);
      const totalMissing = asnLines.reduce((sum, line) => sum + (line.missing_units || 0), 0);
      const totalQuarantined = asnLines.reduce((sum, line) => sum + (line.quarantined_units || 0), 0);

      // Check if all have decisions
      const { data: decisions } = await supabase
        .from('damaged_item_decisions')
        .select('*')
        .eq('asn_id', asnId);

      const submittedOrProcessed = decisions?.filter(d => 
        d.status === 'submitted' || d.status === 'processed'
      ) || [];

      const decidedDamaged = submittedOrProcessed
        .filter(d => d.discrepancy_type === 'damaged')
        .reduce((sum, d) => sum + d.quantity, 0);
      const decidedMissing = submittedOrProcessed
        .filter(d => d.discrepancy_type === 'missing')
        .reduce((sum, d) => sum + d.quantity, 0);
      const decidedQuarantined = submittedOrProcessed
        .filter(d => d.discrepancy_type === 'quarantined')
        .reduce((sum, d) => sum + d.quantity, 0);

      const pendingDamaged = totalDamaged - decidedDamaged;
      const pendingMissing = totalMissing - decidedMissing;
      const pendingQuarantined = totalQuarantined - decidedQuarantined;

      if (pendingDamaged > 0 || pendingMissing > 0 || pendingQuarantined > 0) {
        const pendingItems = [];
        if (pendingDamaged > 0) pendingItems.push(`${pendingDamaged} damaged`);
        if (pendingMissing > 0) pendingItems.push(`${pendingMissing} missing`);
        if (pendingQuarantined > 0) pendingItems.push(`${pendingQuarantined} quarantined`);

        toast.error(
          `Cannot resolve: Client has not responded to all discrepancies. ${pendingItems.join(', ')} items await client review.`,
          { duration: 5000 }
        );
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      
      // Update all decisions to processed
      const { error: decisionsError } = await supabase
        .from('damaged_item_decisions')
        .update({
          status: 'processed',
          processed_at: new Date().toISOString(),
          processed_by: userData.user?.id,
          admin_notes: notes || 'Resolved via ASN resolution',
        })
        .eq('asn_id', asnId)
        .in('status', ['pending', 'submitted']);

      if (decisionsError) throw decisionsError;

      // Update ASN to closed
      const { error } = await supabase
        .from('asn_headers')
        .update({
          status: 'closed',
          resolved_at: new Date().toISOString(),
          resolved_by: userData.user?.id,
          notes: notes ? `${notes}\n\n[Resolved manually by admin]` : '[Resolved manually by admin]'
        })
        .eq('id', asnId);

      if (error) throw error;

      toast.success("ASN marked as resolved and all discrepancies processed");
      onSuccess();
      onOpenChange(false);
      setNotes("");
    } catch (error: any) {
      console.error('Error resolving ASN:', error);
      toast.error(error.message || "Failed to resolve ASN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark ASN as Resolved</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark <strong>{asnNumber}</strong> as resolved? This will change the status from "Issue" to "Completed".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="resolution-notes">Resolution Notes (Optional)</Label>
          <Textarea
            id="resolution-notes"
            placeholder="Describe how the issue was resolved..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleResolve} disabled={loading}>
            {loading ? "Resolving..." : "Mark as Resolved"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
