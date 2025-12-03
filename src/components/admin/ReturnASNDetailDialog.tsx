import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RotateCcw, Package, Save } from "lucide-react";
import { DragDropPhotoUpload } from "./DragDropPhotoUpload";
import { PhotoLightbox } from "@/components/ui/photo-lightbox";
import { resignPhotoUrls } from "@/lib/photoUtils";
import { format } from "date-fns";

interface ReturnASNDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asnId: string | null;
  onSuccess: () => void;
}

const MARKETPLACE_OPTIONS = ["Amazon", "Walmart", "Shopify", "eBay", "TikTok Shop", "Other"];

export const ReturnASNDetailDialog = ({ open, onOpenChange, asnId, onSuccess }: ReturnASNDetailDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [asn, setAsn] = useState<any>(null);
  const [lines, setLines] = useState<any[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [displayPhotos, setDisplayPhotos] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const [formData, setFormData] = useState({
    return_carrier: "",
    return_tracking: "",
    return_marketplace: "",
    consumer_name: "",
    consumer_address: "",
    consumer_order_number: "",
    notes: "",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (open && asnId) {
      fetchASNDetails();
    }
  }, [open, asnId]);

  const fetchASNDetails = async () => {
    if (!asnId) return;
    setLoading(true);
    
    try {
      // Fetch ASN header
      const { data: asnData, error: asnError } = await supabase
        .from("asn_headers")
        .select("*, clients(company_name)")
        .eq("id", asnId)
        .single();

      if (asnError) throw asnError;
      setAsn(asnData);
      
      setFormData({
        return_carrier: asnData.return_carrier || asnData.carrier || "",
        return_tracking: asnData.return_tracking || asnData.tracking_number || "",
        return_marketplace: asnData.return_marketplace || "",
        consumer_name: asnData.consumer_name || "",
        consumer_address: asnData.consumer_address || "",
        consumer_order_number: asnData.consumer_order_number || "",
        notes: asnData.notes || "",
      });

      // Fetch ASN lines with SKU info
      const { data: linesData } = await supabase
        .from("asn_lines")
        .select("*, skus(client_sku, title, image_url)")
        .eq("asn_id", asnId);
      
      setLines(linesData || []);

      // Fetch photos from damaged_item_decisions
      const { data: decisions } = await supabase
        .from("damaged_item_decisions")
        .select("qc_photo_urls")
        .eq("asn_id", asnId);

      const allPhotos: string[] = [];
      decisions?.forEach(d => {
        if (d.qc_photo_urls) {
          allPhotos.push(...d.qc_photo_urls);
        }
      });
      
      setPhotos(allPhotos);
      
      // Re-sign photo URLs
      if (allPhotos.length > 0) {
        const signedPhotos = await resignPhotoUrls(allPhotos);
        setDisplayPhotos(signedPhotos);
      } else {
        setDisplayPhotos([]);
      }

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!asnId) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from("asn_headers")
        .update({
          return_carrier: formData.return_carrier,
          return_tracking: formData.return_tracking,
          return_marketplace: formData.return_marketplace,
          consumer_name: formData.consumer_name,
          consumer_address: formData.consumer_address,
          consumer_order_number: formData.consumer_order_number,
          notes: formData.notes,
          carrier: formData.return_carrier,
          tracking_number: formData.return_tracking,
        })
        .eq("id", asnId);

      if (error) throw error;

      toast({ title: "Saved", description: "Return details updated successfully" });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNewPhotos = async (newPaths: string[]) => {
    // Update the first damaged_item_decision with new photos
    if (!asnId) return;
    
    const { data: decisions } = await supabase
      .from("damaged_item_decisions")
      .select("id, qc_photo_urls")
      .eq("asn_id", asnId)
      .limit(1);

    if (decisions && decisions.length > 0) {
      const existingUrls = decisions[0].qc_photo_urls || [];
      const updatedUrls = [...existingUrls, ...newPaths];
      
      await supabase
        .from("damaged_item_decisions")
        .update({ qc_photo_urls: updatedUrls })
        .eq("id", decisions[0].id);

      // Refresh photos
      setPhotos(updatedUrls);
      const signedPhotos = await resignPhotoUrls(updatedUrls);
      setDisplayPhotos(signedPhotos);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <div className="flex items-center justify-center p-8">Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-orange-500" />
              Return Details: {asn?.asn_number}
              <Badge className="bg-orange-100 text-orange-700 ml-2">Return</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Return Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm border-b pb-2">Shipping Info</h3>
              
              <div className="space-y-2">
                <Label>Carrier</Label>
                <Input
                  value={formData.return_carrier}
                  onChange={(e) => setFormData({ ...formData, return_carrier: e.target.value })}
                  placeholder="UPS, FedEx, USPS..."
                />
              </div>

              <div className="space-y-2">
                <Label>Tracking Number</Label>
                <Input
                  value={formData.return_tracking}
                  onChange={(e) => setFormData({ ...formData, return_tracking: e.target.value })}
                  placeholder="Enter tracking number"
                />
              </div>

              <div className="space-y-2">
                <Label>Marketplace</Label>
                <Select
                  value={formData.return_marketplace}
                  onValueChange={(value) => setFormData({ ...formData, return_marketplace: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select marketplace" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKETPLACE_OPTIONS.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <h3 className="font-semibold text-sm border-b pb-2 pt-4">Consumer Info</h3>
              
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={formData.consumer_name}
                  onChange={(e) => setFormData({ ...formData, consumer_name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>

              <div className="space-y-2">
                <Label>Order Number</Label>
                <Input
                  value={formData.consumer_order_number}
                  onChange={(e) => setFormData({ ...formData, consumer_order_number: e.target.value })}
                  placeholder="Original order number"
                />
              </div>

              <div className="space-y-2">
                <Label>Customer Address</Label>
                <Textarea
                  value={formData.consumer_address}
                  onChange={(e) => setFormData({ ...formData, consumer_address: e.target.value })}
                  placeholder="Customer return address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>

            {/* Right Column - Items & Photos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm border-b pb-2">Items ({lines.length})</h3>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {lines.map((line) => (
                  <div key={line.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                    {line.skus?.image_url && (
                      <img 
                        src={line.skus.image_url} 
                        alt="" 
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{line.skus?.client_sku}</p>
                      <p className="text-xs text-muted-foreground">{line.skus?.title}</p>
                    </div>
                    <Badge variant="secondary">x{line.received_units || line.expected_units}</Badge>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-sm border-b pb-2 pt-4">QC Photos ({displayPhotos.length})</h3>
              
              {displayPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {displayPhotos.map((url, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handlePhotoClick(idx)}
                    >
                      <img src={url} alt={`QC Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No photos available</p>
              )}

              <div className="pt-2">
                <Label className="text-sm">Add More Photos</Label>
                <DragDropPhotoUpload
                  clientId={asn?.client_id || ""}
                  referenceType="return"
                  onPhotosChange={handleNewPhotos}
                  existingPhotos={[]}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PhotoLightbox
        photos={displayPhotos}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};
