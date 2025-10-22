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
      const { data: userData } = await supabase.auth.getUser();
      
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

      toast.success("ASN marked as resolved");
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
