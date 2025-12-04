import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Package } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type SKU = Database["public"]["Tables"]["skus"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

interface SKUFormDialogProps {
  open: boolean;
  onClose: () => void;
  sku: SKU | null;
  clients: Client[];
  isClientView?: boolean;
  presetClientId?: string;
}

export const SKUFormDialog = ({ open, onClose, sku, clients, isClientView = false, presetClientId }: SKUFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    client_id: "",
    client_sku: "",
    internal_sku: "",
    asin: "",
    upc: "",
    ean: "",
    title: "",
    brand: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    has_expiration: false,
    has_lot_tracking: false,
    status: "active",
    notes: "",
    low_stock_threshold: "",
    image_url: "",
  });

  useEffect(() => {
    if (sku) {
      setFormData({
        client_id: sku.client_id,
        client_sku: sku.client_sku,
        internal_sku: (sku as any).internal_sku || "",
        asin: sku.asin || "",
        upc: sku.upc || "",
        ean: sku.ean || "",
        title: sku.title,
        brand: sku.brand || "",
        weight: sku.weight?.toString() || "",
        length: sku.length?.toString() || "",
        width: sku.width?.toString() || "",
        height: sku.height?.toString() || "",
        has_expiration: sku.has_expiration,
        has_lot_tracking: sku.has_lot_tracking,
        status: sku.status,
        notes: sku.notes || "",
        low_stock_threshold: sku.low_stock_threshold?.toString() || "",
        image_url: sku.image_url || "",
      });
      setImagePreview(sku.image_url || null);
    } else {
      setFormData({
        client_id: presetClientId || "",
        client_sku: "",
        internal_sku: "",
        asin: "",
        upc: "",
        ean: "",
        title: "",
        brand: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        has_expiration: false,
        has_lot_tracking: false,
        status: "active",
        notes: "",
        low_stock_threshold: "",
        image_url: "",
      });
      setImagePreview(null);
    }
  }, [sku, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, or GIF image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const clientId = formData.client_id || presetClientId;
      if (!clientId) {
        throw new Error("Please select a client first");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('sku-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sku-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Product image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: "" });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      client_id: formData.client_id,
      client_sku: formData.client_sku,
      internal_sku: formData.internal_sku || formData.client_sku,
      asin: formData.asin || null,
      upc: formData.upc || null,
      ean: formData.ean || null,
      title: formData.title,
      brand: formData.brand || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      length: formData.length ? parseFloat(formData.length) : null,
      width: formData.width ? parseFloat(formData.width) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      has_expiration: formData.has_expiration,
      has_lot_tracking: formData.has_lot_tracking,
      status: formData.status,
      notes: formData.notes || null,
      low_stock_threshold: formData.low_stock_threshold ? parseInt(formData.low_stock_threshold) : null,
      image_url: formData.image_url || null,
    };

    const { error } = sku
      ? await supabase.from("skus").update(payload).eq("id", sku.id)
      : await supabase.from("skus").insert(payload);

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `SKU ${sku ? "updated" : "created"} successfully`,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sku ? "Edit SKU" : "Add New SKU"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 border rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <Package className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="sku-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || (!formData.client_id && !presetClientId)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP, GIF (max 10MB). {!formData.client_id && !presetClientId && "Select client first."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {!isClientView && (
              <div className="space-y-2">
                <Label htmlFor="client_id">Client *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                  disabled={!!sku || !!presetClientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="client_sku">Client SKU *</Label>
              <Input
                id="client_sku"
                value={formData.client_sku}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    client_sku: value,
                    internal_sku: formData.internal_sku ? formData.internal_sku : value,
                  });
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="internal_sku">Internal SKU (Warehouse) *</Label>
              <Input
                id="internal_sku"
                value={formData.internal_sku}
                onChange={(e) => setFormData({ ...formData, internal_sku: e.target.value })}
                required
                placeholder="e.g., WH-12345"
              />
              <p className="text-xs text-muted-foreground">Used internally; prefilled from Client SKU.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asin">ASIN</Label>
              <Input
                id="asin"
                value={formData.asin}
                onChange={(e) => setFormData({ ...formData, asin: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upc">UPC</Label>
              <Input
                id="upc"
                value={formData.upc}
                onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ean">EAN</Label>
              <Input
                id="ean"
                value={formData.ean}
                onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                type="number"
                step="0.01"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="has_expiration">Has Expiration Date</Label>
              <Switch
                id="has_expiration"
                checked={formData.has_expiration}
                onCheckedChange={(checked) => setFormData({ ...formData, has_expiration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="has_lot_tracking">Has Lot Tracking</Label>
              <Switch
                id="has_lot_tracking"
                checked={formData.has_lot_tracking}
                onCheckedChange={(checked) => setFormData({ ...formData, has_lot_tracking: checked })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Low Stock Threshold Override</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              min="0"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
              placeholder="Leave empty to use client default"
            />
            <p className="text-xs text-muted-foreground">
              Override the client's default threshold for this SKU
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : sku ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
