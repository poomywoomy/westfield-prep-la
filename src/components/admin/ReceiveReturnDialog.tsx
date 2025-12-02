import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Camera, X, Plus, Trash2, Package, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { validateImageFile } from "@/lib/fileValidation";

interface ReceiveReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  type: "return" | "removal_order";
}

interface LineItem {
  sku_id: string;
  sku_code: string;
  title: string;
  quantity: number;
}

export const ReceiveReturnDialog = ({ open, onOpenChange, onSuccess, type }: ReceiveReturnDialogProps) => {
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<any[]>([]);
  const [skus, setSKUs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  
  const [formData, setFormData] = useState({
    client_id: "",
    received_date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
    current_sku_id: "",
    current_quantity: "1",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchClients();
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (formData.client_id) {
      fetchSKUs(formData.client_id);
    } else {
      setSKUs([]);
    }
  }, [formData.client_id]);

  const fetchClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name");
    setClients(data || []);
  };

  const fetchSKUs = async (clientId: string) => {
    const { data } = await supabase
      .from("skus")
      .select("id, client_sku, title")
      .eq("client_id", clientId)
      .eq("status", "active")
      .order("client_sku");
    setSKUs(data || []);
  };

  const addLineItem = () => {
    if (!formData.current_sku_id || !formData.current_quantity) return;
    
    const sku = skus.find(s => s.id === formData.current_sku_id);
    if (!sku) return;

    const existing = lineItems.find(li => li.sku_id === formData.current_sku_id);
    if (existing) {
      setLineItems(lineItems.map(li => 
        li.sku_id === formData.current_sku_id 
          ? { ...li, quantity: li.quantity + parseInt(formData.current_quantity) }
          : li
      ));
    } else {
      setLineItems([...lineItems, {
        sku_id: formData.current_sku_id,
        sku_code: sku.client_sku,
        title: sku.title,
        quantity: parseInt(formData.current_quantity),
      }]);
    }

    setFormData({ ...formData, current_sku_id: "", current_quantity: "1" });
    toast({ title: "SKU Added", description: `${sku.client_sku} added` });
  };

  const removeLineItem = (skuId: string) => {
    setLineItems(lineItems.filter(li => li.sku_id !== skuId));
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    
    files.forEach(file => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({ title: "Invalid File", description: validation.error, variant: "destructive" });
        return;
      }
      validFiles.push(file);
    });

    setPhotos([...photos, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (clientId: string, referenceId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of photos) {
      const timestamp = Date.now();
      const filePath = `${clientId}/${type}/${referenceId}/${timestamp}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from("qc-images")
        .upload(filePath, file);
      
      if (error) {
        console.error("Upload error:", error);
        continue;
      }
      
      uploadedUrls.push(filePath);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (photos.length === 0) {
      toast({ title: "Photos Required", description: "Please upload at least one QC photo", variant: "destructive" });
      return;
    }

    if (lineItems.length === 0) {
      toast({ title: "No Items", description: "Please add at least one SKU", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (type === "return") {
        // Create ASN header for the return
        const { data: asnNumberData } = await supabase.rpc('generate_asn_number', { p_client_id: formData.client_id });
        const asnNumber = asnNumberData || `RTN-${Date.now()}`;

        const { data: asnData, error: asnError } = await supabase
          .from("asn_headers")
          .insert({
            client_id: formData.client_id,
            asn_number: asnNumber,
            status: 'issue',
            received_at: formData.received_date,
            received_by: user?.id,
            notes: `Manual return received. ${formData.notes}`,
          })
          .select()
          .single();

        if (asnError) throw asnError;

        // Upload photos
        const photoUrls = await uploadPhotos(formData.client_id, asnData.id);

        // Create ASN lines and damaged_item_decisions for each line item
        for (const item of lineItems) {
          // Create ASN line
          await supabase.from("asn_lines").insert({
            asn_id: asnData.id,
            sku_id: item.sku_id,
            expected_units: item.quantity,
            received_units: item.quantity,
          });

          // Create damaged_item_decision for client review
          await supabase.from("damaged_item_decisions").insert({
            client_id: formData.client_id,
            asn_id: asnData.id,
            sku_id: item.sku_id,
            quantity: item.quantity,
            discrepancy_type: 'damaged',
            source_type: 'return',
            status: 'pending',
            qc_photo_urls: photoUrls,
            admin_notes: formData.notes,
          });
        }

        toast({ title: "Return Received", description: `${lineItems.length} item(s) sent for client review` });

      } else {
        // Create removal order
        const { data: roNumber } = await supabase.rpc('generate_removal_order_number', { p_client_id: formData.client_id });

        const { data: roData, error: roError } = await supabase
          .from("removal_orders")
          .insert({
            client_id: formData.client_id,
            removal_order_number: roNumber || `RO-${Date.now()}`,
            status: 'pending',
            received_at: formData.received_date,
            received_by: user?.id,
            notes: formData.notes,
          })
          .select()
          .single();

        if (roError) throw roError;

        // Upload photos and update removal order
        const photoUrls = await uploadPhotos(formData.client_id, roData.id);
        
        await supabase
          .from("removal_orders")
          .update({ qc_photo_urls: photoUrls })
          .eq("id", roData.id);

        // Create removal order lines
        for (const item of lineItems) {
          await supabase.from("removal_order_lines").insert({
            removal_order_id: roData.id,
            sku_id: item.sku_id,
            expected_qty: item.quantity,
            received_qty: item.quantity,
          });
        }

        toast({ title: "Removal Order Received", description: `${lineItems.length} item(s) sent for client review` });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      client_id: "",
      received_date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
      current_sku_id: "",
      current_quantity: "1",
    });
    setLineItems([]);
    setPhotos([]);
    setPhotoPreviews([]);
  };

  const canProceedStep1 = formData.client_id && lineItems.length > 0;
  const canProceedStep2 = formData.received_date;
  const canSubmit = photos.length > 0;

  const totalQuantity = lineItems.reduce((sum, li) => sum + li.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "return" ? <RotateCcw className="h-5 w-5" /> : <Package className="h-5 w-5" />}
            {type === "return" ? "Receive Return" : "Receive Removal Order"}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s 
                  ? "bg-primary text-primary-foreground" 
                  : step > s 
                    ? "bg-green-500 text-white" 
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {/* Step 1: Select Client & SKUs */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Client *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.client_id && (
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-6">
                      <Label>SKU</Label>
                      <Select
                        value={formData.current_sku_id}
                        onValueChange={(value) => setFormData({ ...formData, current_sku_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select SKU" />
                        </SelectTrigger>
                        <SelectContent>
                          {skus.map((sku) => (
                            <SelectItem key={sku.id} value={sku.id}>
                              {sku.client_sku} - {sku.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Label>Qty</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.current_quantity}
                        onChange={(e) => setFormData({ ...formData, current_quantity: e.target.value })}
                      />
                    </div>
                    <div className="col-span-3">
                      <Button onClick={addLineItem} disabled={!formData.current_sku_id} className="w-full">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>

                  {lineItems.length > 0 && (
                    <div className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Items ({lineItems.length})</Label>
                        <Badge variant="secondary">{totalQuantity} units total</Badge>
                      </div>
                      {lineItems.map((item) => (
                        <div key={item.sku_id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                          <div>
                            <span className="font-medium">{item.sku_code}</span>
                            <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeLineItem(item.sku_id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Step 2: Date & Notes */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label>Date Received *</Label>
                <Input
                  type="date"
                  value={formData.received_date}
                  onChange={(e) => setFormData({ ...formData, received_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Any additional details about this return..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Summary</p>
                <p className="text-sm text-muted-foreground">
                  {lineItems.length} SKU(s) • {totalQuantity} units • {format(new Date(formData.received_date), "MMM d, yyyy")}
                </p>
              </div>
            </>
          )}

          {/* Step 3: QC Photos (REQUIRED) */}
          {step === 3 && (
            <>
              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg mb-4">
                <p className="text-sm font-medium text-orange-800">⚠️ QC Photos Required</p>
                <p className="text-xs text-orange-700">Upload at least one photo to proceed. Photos help clients make decisions.</p>
              </div>

              <div className="space-y-2">
                <Label>QC Photos *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    capture="environment"
                    onChange={handlePhotoCapture}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Camera className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or take photos</p>
                  </label>
                </div>

                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img src={preview} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {photos.length} photo(s) uploaded
                </p>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Final Summary</p>
                <p className="text-sm text-muted-foreground">
                  {lineItems.length} SKU(s) • {totalQuantity} units • {photos.length} photo(s)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Items will be sent to client for review and decision.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
                {loading ? "Processing..." : "Submit for Client Review"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};