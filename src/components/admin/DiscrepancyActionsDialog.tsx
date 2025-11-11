import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Package } from "lucide-react";
import { resignPhotoUrls } from "@/lib/photoUtils";

interface DiscrepancyActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  decision: {
    id: string;
    client_id: string;
    asn_id: string;
    sku_id: string;
    quantity: number;
    discrepancy_type: string;
    decision: string;
    client_notes: string;
    submitted_at: string;
    status: string;
    source_type?: string;
    client_sku?: string;
    title?: string;
    asn_number?: string;
    qc_photo_urls?: string[];
  };
  onSuccess?: () => void;
}

export function DiscrepancyActionsDialog({
  open,
  onOpenChange,
  decision,
  onSuccess,
}: DiscrepancyActionsDialogProps) {
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayPhotos, setDisplayPhotos] = useState<string[]>([]);

  // Re-sign photo URLs when dialog opens
  useEffect(() => {
    if (open && decision.qc_photo_urls && decision.qc_photo_urls.length > 0) {
      resignPhotoUrls(decision.qc_photo_urls).then(setDisplayPhotos);
    } else {
      setDisplayPhotos([]);
    }
  }, [open, decision.qc_photo_urls]);

  const getDecisionLabel = (dec: string) => {
    const labels: Record<string, string> = {
      discard: "Discard",
      sell_as_bstock: "Sell",
      return_to_sender: "Return to Sender",
      rework: "Rework/Repair",
      acknowledge: "Acknowledged",
    };
    return labels[dec] || dec;
  };

  const handleProcess = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update decision as processed
      const { error } = await supabase
        .from("damaged_item_decisions")
        .update({
          status: "processed",
          processed_at: new Date().toISOString(),
          processed_by: user.id,
          admin_notes: adminNotes,
        })
        .eq("id", decision.id);

      if (error) throw error;

      toast({
        title: "Decision Processed",
        description: "Discrepancy has been marked as processed",
      });

      onSuccess?.();
      onOpenChange(false);
      setAdminNotes("");
    } catch (error: any) {
      console.error("Error processing decision:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process decision",
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
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Process Client Decision
            {decision.source_type && (
              <Badge 
                variant="outline" 
                className={decision.source_type === "return" ? "border-blue-500 text-blue-600 ml-2" : "border-amber-500 text-amber-600 ml-2"}
              >
                {decision.source_type === "return" ? "🔄 Return" : "📦 Receiving"}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">{decision.title || "Product"}</p>
              <Badge variant={decision.discrepancy_type === "damaged" ? "default" : "destructive"}>
                {decision.discrepancy_type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">SKU: {decision.client_sku}</p>
            {decision.asn_number && (
              <p className="text-sm text-muted-foreground">ASN: {decision.asn_number}</p>
            )}
            <p className="text-sm font-medium mt-2">Quantity: {decision.quantity} units</p>
            <p className="text-xs text-muted-foreground mt-1">
              Source: {decision.source_type === "return" ? "Customer Return Processing" : "Inbound Receiving"}
            </p>
          </div>

          {/* Client Decision */}
          <div>
            <Label className="mb-2 block">Client Decision</Label>
            <div className="p-4 border rounded-lg">
              <p className="font-medium text-lg mb-2">{getDecisionLabel(decision.decision)}</p>
              {decision.client_notes && (
                <p className="text-sm text-muted-foreground">{decision.client_notes}</p>
              )}
            </div>
          </div>

          {/* QC Photos */}
          {displayPhotos.length > 0 && (
            <div>
              <Label className="mb-2 block">QC Photos</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {displayPhotos.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`QC Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Guidance */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Next Steps {decision.source_type && `(${decision.source_type === "return" ? "Return" : "Receiving"} Workflow)`}:
            </p>
            {decision.decision === "discard" && (
              <p className="text-sm text-blue-800">
                {decision.source_type === "return" 
                  ? "• Item returned by customer in damaged condition" 
                  : "• Item received damaged during inbound shipment"}<br />
                • Remove items from inventory<br />
                • Document disposal for records
              </p>
            )}
            {decision.decision === "sell_as_bstock" && (
              <p className="text-sm text-blue-800">
                {decision.source_type === "return" 
                  ? "• Customer return - cosmetic damage only" 
                  : "• Received with minor damage"}<br />
                • Create new SKU variant for B-stock<br />
                • Adjust pricing and list for sale
              </p>
            )}
            {decision.decision === "return_to_sender" && (
              <p className="text-sm text-blue-800">
                {decision.source_type === "return" 
                  ? "• Return to original customer" 
                  : "• Return to supplier/sender"}<br />
                • Generate return shipping label<br />
                • Package items for return
              </p>
            )}
            {decision.decision === "rework" && (
              <p className="text-sm text-blue-800">
                {decision.source_type === "return" 
                  ? "• Customer return - repairable" 
                  : "• Received damaged but repairable"}<br />
                • Move to rework area<br />
                • Schedule inspection and repair
              </p>
            )}
            {decision.decision === "acknowledge" && (
              <p className="text-sm text-blue-800">
                {decision.source_type === "return" 
                  ? "• Customer return - missing items acknowledged" 
                  : "• Inbound shipment - missing items acknowledged"}<br />
                • Client has acknowledged the discrepancy<br />
                • Follow up with carrier/supplier if needed
              </p>
            )}
          </div>

          {/* Admin Notes */}
          <div>
            <Label htmlFor="admin-notes" className="mb-2 block">
              Processing Notes
            </Label>
            <Textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Document actions taken..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleProcess} disabled={loading}>
            {loading ? "Processing..." : "Mark as Processed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
