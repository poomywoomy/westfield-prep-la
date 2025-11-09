import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface ReturnProcessingDialogProps {
  open?: boolean;
  onClose: () => void;
  skuId?: string;
  clientId?: string;
  skuCode?: string;
  onSuccess?: () => void;
  returnId?: string;
  expectedReturn?: {
    shopify_return_id: string;
    order_number: string | null;
    expected_qty: number;
    line_items: any;
    client_id: string;
  };
}

export const ReturnProcessingDialog = ({
  open = true,
  onClose,
  skuId: propSkuId,
  clientId: propClientId,
  skuCode,
  onSuccess,
  returnId,
  expectedReturn,
}: ReturnProcessingDialogProps) => {
  const [skuId, setSkuId] = useState<string>(propSkuId || "");
  const [clientId, setClientId] = useState<string>(propClientId || expectedReturn?.client_id || "");
  const [expectedQty, setExpectedQty] = useState<number>(expectedReturn?.expected_qty || 0);
  const [goodQty, setGoodQty] = useState<number>(0);
  const [damagedQty, setDamagedQty] = useState<number>(0);
  const [missingQty, setMissingQty] = useState<number>(0);
  const [damagedAction, setDamagedAction] = useState<"discard" | "client">("client");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (expectedReturn) {
      setExpectedQty(expectedReturn.expected_qty);
      setClientId(expectedReturn.client_id);
    }
  }, [expectedReturn]);

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    if (!expectedReturn) {
      setExpectedQty(0);
    }
    setGoodQty(0);
    setDamagedQty(0);
    setMissingQty(0);
    setDamagedAction("client");
    setPhotoFile(null);
  };

  const handleExpectedQtyChange = (value: number) => {
    setExpectedQty(value);
    // Auto-calculate missing
    const missing = value - goodQty - damagedQty;
    setMissingQty(Math.max(0, missing));
  };

  const handleGoodQtyChange = (value: number) => {
    setGoodQty(value);
    const missing = expectedQty - value - damagedQty;
    setMissingQty(Math.max(0, missing));
  };

  const handleDamagedQtyChange = (value: number) => {
    setDamagedQty(value);
    const missing = expectedQty - goodQty - value;
    setMissingQty(Math.max(0, missing));
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;

    const fileExt = photoFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${clientId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("adjustment-photos")
      .upload(filePath, photoFile);

    if (uploadError) {
      console.error("Photo upload error:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("adjustment-photos")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (goodQty + damagedQty + missingQty !== expectedQty) {
      toast({
        title: "Invalid Quantities",
        description: "Total must match expected quantity",
        variant: "destructive",
      });
      return;
    }

    if (damagedQty > 0 && damagedAction === "discard" && !photoFile) {
      toast({
        title: "Photo Required",
        description: "Photo is required when discarding damaged items",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      // Get location
      const { data: locations } = await supabase
        .from("locations")
        .select("id")
        .eq("is_active", true)
        .limit(1);
      const locationId = locations?.[0]?.id;

      // Process good condition units
      if (goodQty > 0) {
        await supabase.from("inventory_ledger").insert({
          client_id: clientId,
          sku_id: skuId,
          location_id: locationId,
          qty_delta: goodQty,
          transaction_type: "RETURN",
          user_id: userId,
          notes: "Return processed - good condition",
        });

        // Sync to Shopify immediately with error handling
        const { data: syncData, error: syncError } = await supabase.functions.invoke(
          'shopify-push-inventory-single',
          { body: { client_id: clientId, sku_id: skuId } }
        );
        
        if (syncError) {
          console.error('Shopify sync error:', syncError);
          toast({
            variant: 'destructive',
            title: 'Shopify sync failed',
            description: syncError.message || 'Failed to update Shopify inventory'
          });
        } else if (syncData?.success === false) {
          console.warn('Shopify sync incomplete:', syncData.message);
          toast({
            variant: 'default',
            title: 'Shopify not updated',
            description: syncData.message || 'SKU not mapped to Shopify'
          });
        }
      }

      // Process damaged units
      if (damagedQty > 0) {
        if (damagedAction === "discard") {
          const photoUrl = await uploadPhoto();
          await supabase.from("inventory_ledger").insert({
            client_id: clientId,
            sku_id: skuId,
            location_id: locationId,
            qty_delta: -damagedQty,
            transaction_type: "ADJUSTMENT_MINUS",
            reason_code: "damage",
            user_id: userId,
            notes: photoUrl ? `Damaged return discarded. Photo: ${photoUrl}` : "Damaged return discarded",
          });
        } else {
          await supabase.from("damaged_item_decisions").insert({
            client_id: clientId,
            asn_id: null,
            sku_id: skuId,
            quantity: damagedQty,
            discrepancy_type: "damaged",
            source_type: "return",
            status: "pending",
            client_notes: "Return processing - damaged units",
          });
        }
      }

      // Process missing units
      if (missingQty > 0) {
        await supabase.from("damaged_item_decisions").insert({
          client_id: clientId,
          asn_id: null,
          sku_id: skuId,
          quantity: missingQty,
          discrepancy_type: "missing",
          source_type: "return",
          status: "pending",
          client_notes: "Return processing - missing units",
        });
      }

      // Update shopify_returns if this is from Shopify
      if (returnId) {
        await supabase
          .from("shopify_returns")
          .update({
            status: "completed",
            processed_qty: goodQty + damagedQty + missingQty,
            received_at: new Date().toISOString(),
          })
          .eq("id", returnId);
      }

      toast({
        title: "Success",
        description: "Return processed successfully. Syncing inventory to Shopify...",
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Return processing error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process return",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Process Return {expectedReturn && `- Shopify Order #${expectedReturn.order_number}`}
          </DialogTitle>
          {expectedReturn && (
            <p className="text-sm text-muted-foreground">
              Return ID: #{expectedReturn.shopify_return_id.slice(-8)}
            </p>
          )}
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="expectedQty">Expected Return Quantity *</Label>
            <Input
              id="expectedQty"
              type="number"
              min="0"
              value={expectedQty}
              onChange={(e) => handleExpectedQtyChange(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goodQty">Good Condition</Label>
              <Input
                id="goodQty"
                type="number"
                min="0"
                max={expectedQty}
                value={goodQty}
                onChange={(e) => handleGoodQtyChange(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Returns to stock</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="damagedQty">Damaged</Label>
              <Input
                id="damagedQty"
                type="number"
                min="0"
                max={expectedQty}
                value={damagedQty}
                onChange={(e) => handleDamagedQtyChange(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">See action below</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="missingQty">Missing</Label>
              <Input
                id="missingQty"
                type="number"
                value={missingQty}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Auto-calculated</p>
            </div>
          </div>

          {damagedQty > 0 && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label>Damaged Units Action *</Label>
                <Select value={damagedAction} onValueChange={(v: any) => setDamagedAction(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Send to Client for Decision</SelectItem>
                    <SelectItem value="discard">Discard Immediately</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {damagedAction === "discard" && (
                <div className="space-y-2">
                  <Label>Photo Evidence (Required) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Photo required when discarding damaged items
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="p-4 bg-primary/10 rounded-lg">
            <h4 className="font-semibold mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Expected:</div>
              <div className="font-bold">{expectedQty} units</div>
              <div>Good → Stock:</div>
              <div className="text-green-600 font-bold">{goodQty} units</div>
              {damagedQty > 0 && (
                <>
                  <div>Damaged → {damagedAction === "discard" ? "Discard" : "Client"}:</div>
                  <div className="text-amber-600 font-bold">{damagedQty} units</div>
                </>
              )}
              {missingQty > 0 && (
                <>
                  <div>Missing → Client:</div>
                  <div className="text-red-600 font-bold">{missingQty} units</div>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || expectedQty === 0}>
            {loading ? "Processing..." : "Process Return"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
