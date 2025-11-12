import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PackageX, Package } from "lucide-react";
import { resignPhotoUrls } from "@/lib/photoUtils";

interface MissingItemReviewDialogProps {
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
    missing_qty: number;
    image_url?: string;
    qc_photo_urls?: string[];
  };
  onSuccess?: () => void;
}

export function MissingItemReviewDialog({
  open,
  onOpenChange,
  discrepancy,
  onSuccess,
}: MissingItemReviewDialogProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayPhotos, setDisplayPhotos] = useState<string[]>([]);

  // Re-sign photo URLs when dialog opens
  useEffect(() => {
    if (discrepancy.qc_photo_urls && open) {
      resignPhotoUrls(discrepancy.qc_photo_urls).then(setDisplayPhotos);
    }
  }, [discrepancy.qc_photo_urls, open]);

  const handleAcknowledge = async () => {
    setLoading(true);

    try {
      // Update the existing record instead of inserting a new one
      const { error } = await supabase
        .from("damaged_item_decisions")
        .update({
          decision: "acknowledge",
          client_notes: notes || "Acknowledged missing items",
          submitted_at: new Date().toISOString(),
          status: "submitted", // Change status to 'submitted' when client responds
        })
        .eq("id", discrepancy.id);

      if (error) throw error;

      toast({
        title: "Acknowledged",
        description: "Missing items have been acknowledged",
      });

      onSuccess?.();
      onOpenChange(false);
      setNotes("");
    } catch (error: any) {
      console.error("Error acknowledging missing items:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to acknowledge",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageX className="h-5 w-5 text-red-600" />
            Missing Items Report
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
              <p className="text-sm font-medium text-red-600 mt-2">
                {discrepancy.missing_qty} units missing
              </p>
            </div>
          </div>

          {/* QC Photos Section */}
          <div className="space-y-2">
            <Label>QC Photos (Receiving Documentation)</Label>
            {displayPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayPhotos.map((url, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <img
                      src={url}
                      alt={`QC Photo ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No QC photos available for this discrepancy.
              </div>
            )}
          </div>

          {/* Info Message */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              These items were expected in the shipment but were not received. 
              Please acknowledge this discrepancy. Our team will investigate and follow up.
            </p>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes" className="mb-2 block">
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about these missing items..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAcknowledge} disabled={loading}>
            {loading ? "Acknowledging..." : "Acknowledge"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
