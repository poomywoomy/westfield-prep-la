import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Package } from "lucide-react";

interface DamagedItemReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discrepancy: {
    id: string;
    client_id: string;
    sku_id: string;
    asn_id: string;
    asn_number: string;
    client_sku: string;
    title: string;
    damaged_qty: number;
    image_url?: string;
    qc_photo_urls?: string[];
  };
  onSuccess?: () => void;
}

export function DamagedItemReviewDialog({
  open,
  onOpenChange,
  discrepancy,
  onSuccess,
}: DamagedItemReviewDialogProps) {
  const { toast } = useToast();
  const [decision, setDecision] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!decision) {
      toast({
        title: "Decision Required",
        description: "Please select what to do with the damaged items",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("damaged_item_decisions").insert({
        client_id: discrepancy.client_id,
        asn_id: discrepancy.asn_id,
        sku_id: discrepancy.sku_id,
        quantity: discrepancy.damaged_qty,
        discrepancy_type: "damaged",
        qc_photo_urls: discrepancy.qc_photo_urls || [],
        decision,
        client_notes: notes,
        submitted_at: new Date().toISOString(),
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Decision Submitted",
        description: "Your decision has been sent to admin for processing",
      });

      onSuccess?.();
      onOpenChange(false);
      setDecision("");
      setNotes("");
    } catch (error: any) {
      console.error("Error submitting decision:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit decision",
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
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Review Damaged Items
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4 p-4 border rounded-lg bg-muted/50">
            {discrepancy.image_url ? (
              <img
                src={discrepancy.image_url}
                alt={discrepancy.title}
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold">{discrepancy.title}</p>
              <p className="text-sm text-muted-foreground">SKU: {discrepancy.client_sku}</p>
              <p className="text-sm text-muted-foreground">ASN: {discrepancy.asn_number}</p>
              <p className="text-sm font-medium text-yellow-600 mt-2">
                {discrepancy.damaged_qty} damaged units
              </p>
            </div>
          </div>

          {/* QC Photos */}
          {discrepancy.qc_photo_urls && discrepancy.qc_photo_urls.length > 0 && (
            <div>
              <Label className="mb-2 block">QC Photos</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {discrepancy.qc_photo_urls.map((url, index) => (
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

          {/* Decision Options */}
          <div>
            <Label className="mb-3 block">What should we do with these damaged items?</Label>
            <RadioGroup value={decision} onValueChange={setDecision}>
              <div className="flex items-center space-x-2 p-3 border rounded hover:bg-muted/50">
                <RadioGroupItem value="discard" id="discard" />
                <Label htmlFor="discard" className="flex-1 cursor-pointer">
                  <span className="font-medium">Discard</span>
                  <p className="text-sm text-muted-foreground">Dispose of damaged items</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded hover:bg-muted/50">
                <RadioGroupItem value="sell_as_bstock" id="sell_as_bstock" />
                <Label htmlFor="sell_as_bstock" className="flex-1 cursor-pointer">
                  <span className="font-medium">Sell as B-Stock</span>
                  <p className="text-sm text-muted-foreground">List at reduced price</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded hover:bg-muted/50">
                <RadioGroupItem value="return_to_sender" id="return_to_sender" />
                <Label htmlFor="return_to_sender" className="flex-1 cursor-pointer">
                  <span className="font-medium">Return to Sender</span>
                  <p className="text-sm text-muted-foreground">Ship back to supplier</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded hover:bg-muted/50">
                <RadioGroupItem value="rework" id="rework" />
                <Label htmlFor="rework" className="flex-1 cursor-pointer">
                  <span className="font-medium">Rework/Repair</span>
                  <p className="text-sm text-muted-foreground">Attempt to fix or repackage</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes" className="mb-2 block">
              Additional Instructions (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for the admin..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !decision}>
            {loading ? "Submitting..." : "Submit Decision"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
