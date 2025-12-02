import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { format } from "date-fns";
import { Camera, X, Scan, DollarSign, PackageX, AlertTriangle } from "lucide-react";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { playSuccessSound, playErrorSound } from "@/lib/soundEffects";
import { Badge } from "@/components/ui/badge";
import { ScannerStatus } from "@/components/ScannerStatus";
import { ScannerHelpDialog } from "@/components/admin/ScannerHelpDialog";
import { validateImageFile } from "@/lib/fileValidation";

const adjustmentSchema = z.object({
  client_id: z.string().uuid(),
  sku_id: z.string().uuid(),
  location_id: z.string().uuid(),
  qty_delta: z.number().int().min(-1000000).max(1000000).refine(val => val !== 0, "Adjustment quantity cannot be zero"),
  action_type: z.enum(['sale', 'lost', 'damaged']),
  notes: z.string().trim().max(1000).optional(),
});

interface InventoryAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  prefilledClientId?: string;
}

type ActionType = 'sale' | 'lost' | 'damaged';

const ACTION_CONFIG: Record<ActionType, { 
  label: string; 
  icon: React.ReactNode; 
  description: string;
  requiresPhoto: boolean;
  requiresClientReview: boolean;
  discrepancyType?: 'missing' | 'damaged';
}> = {
  sale: {
    label: "Sale",
    icon: <DollarSign className="h-5 w-5" />,
    description: "Direct inventory deduction for a sale",
    requiresPhoto: false,
    requiresClientReview: false,
  },
  lost: {
    label: "Lost Product",
    icon: <PackageX className="h-5 w-5" />,
    description: "Product is missing/lost - sent for client review",
    requiresPhoto: false,
    requiresClientReview: true,
    discrepancyType: 'missing',
  },
  damaged: {
    label: "Damaged Product",
    icon: <AlertTriangle className="h-5 w-5" />,
    description: "Product is damaged - photo required, sent for client review",
    requiresPhoto: true,
    requiresClientReview: true,
    discrepancyType: 'damaged',
  },
};

export const InventoryAdjustmentDialog = ({ open, onOpenChange, onSuccess, prefilledClientId }: InventoryAdjustmentDialogProps) => {
  const [clients, setClients] = useState<any[]>([]);
  const [skus, setSKUs] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    sku_id: "",
    location_id: "",
    qty_delta: "",
    action_type: "" as ActionType | "",
    notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchClients();
      fetchLocations();
      if (prefilledClientId) {
        setFormData(prev => ({ ...prev, client_id: prefilledClientId }));
      }
    }
  }, [open, prefilledClientId]);

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

  const fetchLocations = async () => {
    const { data } = await supabase
      .from("locations")
      .select("id, name, code")
      .eq("is_active", true)
      .order("name");
    setLocations(data || []);
    
    const mainWarehouse = data?.find(loc => loc.code === 'MAIN' || loc.name.toLowerCase().includes('main'));
    if (mainWarehouse && !formData.location_id) {
      setFormData(prev => ({ ...prev, location_id: mainWarehouse.id }));
    }
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
      const filePath = `${clientId}/adjustment/${referenceId}/${timestamp}_${file.name}`;
      
      const { error } = await supabase.storage
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
    try {
      setLoading(true);

      const qtyDelta = parseInt(formData.qty_delta, 10);
      if (isNaN(qtyDelta) || qtyDelta === 0) {
        toast({ title: "Invalid Quantity", description: "Please enter a valid quantity.", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!formData.action_type) {
        toast({ title: "Select Action", description: "Please select an action type.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const actionConfig = ACTION_CONFIG[formData.action_type];

      // Validate photo requirement for damaged
      if (actionConfig.requiresPhoto && photos.length === 0) {
        toast({ title: "Photos Required", description: "Please upload at least one QC photo for damaged products.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const validated = adjustmentSchema.parse({
        client_id: formData.client_id,
        sku_id: formData.sku_id,
        location_id: formData.location_id,
        qty_delta: qtyDelta,
        action_type: formData.action_type,
        notes: formData.notes || undefined,
      });

      const { data: { user } } = await supabase.auth.getUser();

      if (formData.action_type === 'sale') {
        // Direct inventory deduction for sale
        const transactionType = qtyDelta > 0 ? "ADJUSTMENT_PLUS" : "SALE_DECREMENT";
        
        const { error } = await supabase.from("inventory_ledger").insert({
          client_id: validated.client_id,
          sku_id: validated.sku_id,
          location_id: validated.location_id,
          qty_delta: qtyDelta,
          transaction_type: transactionType,
          reason_code: 'sold',
          notes: validated.notes || 'Sale adjustment',
        } as any);

        if (error) throw error;

        // Sync to Shopify
        await supabase.functions.invoke('shopify-push-inventory-single', {
          body: { client_id: validated.client_id, sku_id: validated.sku_id }
        });

        toast({
          title: "Sale Recorded",
          description: `Inventory adjusted by ${qtyDelta > 0 ? '+' : ''}${qtyDelta} units`,
        });

      } else {
        // Lost or Damaged - create entry for client review
        // First create ASN header
        const { data: asnNumberData } = await supabase.rpc('generate_asn_number', { p_client_id: validated.client_id });
        const asnNumber = asnNumberData || `ADJ-${Date.now()}`;

        const { data: asnData, error: asnError } = await supabase
          .from("asn_headers")
          .insert({
            client_id: validated.client_id,
            asn_number: asnNumber,
            status: 'issue',
            received_at: new Date().toISOString(),
            received_by: user?.id,
            notes: `Inventory adjustment - ${actionConfig.label}. ${validated.notes || ''}`,
          })
          .select()
          .single();

        if (asnError) throw asnError;

        // Upload photos if any
        let photoUrls: string[] = [];
        if (photos.length > 0) {
          photoUrls = await uploadPhotos(validated.client_id, asnData.id);
        }

        // Create ASN line
        await supabase.from("asn_lines").insert({
          asn_id: asnData.id,
          sku_id: validated.sku_id,
          expected_units: Math.abs(qtyDelta),
          received_units: Math.abs(qtyDelta),
          damaged_units: actionConfig.discrepancyType === 'damaged' ? Math.abs(qtyDelta) : 0,
          missing_units: actionConfig.discrepancyType === 'missing' ? Math.abs(qtyDelta) : 0,
        });

        // Create damaged_item_decision for client review
        const { error: decisionError } = await supabase
          .from("damaged_item_decisions")
          .insert({
            client_id: validated.client_id,
            asn_id: asnData.id,
            sku_id: validated.sku_id,
            quantity: Math.abs(qtyDelta),
            discrepancy_type: actionConfig.discrepancyType!,
            source_type: 'adjustment',
            status: 'pending',
            qc_photo_urls: photoUrls.length > 0 ? photoUrls : null,
            admin_notes: validated.notes || `${actionConfig.label} reported via inventory adjustment`,
          });

        if (decisionError) throw decisionError;

        toast({
          title: `${actionConfig.label} Reported`,
          description: `${Math.abs(qtyDelta)} units sent for client review`,
        });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Adjustment error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to record adjustment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    if (!formData.client_id) {
      toast({ title: "Please select a client first", variant: "destructive" });
      return;
    }

    const { data } = await supabase.functions.invoke('barcode-lookup', {
      body: { barcode, client_id: formData.client_id, context: 'adjustment' }
    });

    if (data?.found && data.type.startsWith('product_')) {
      const sku = data.data.sku || data.data;
      setFormData({ ...formData, sku_id: sku.id, location_id: data.data.location_id || formData.location_id });
      playSuccessSound();
      toast({ title: "SKU Found", description: `${sku.client_sku} - ${sku.title}` });
    } else {
      playErrorSound();
      toast({ title: "Not Found", description: "Barcode not recognized", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: "",
      sku_id: "",
      location_id: "",
      qty_delta: "",
      action_type: "",
      notes: "",
    });
    setPhotos([]);
    setPhotoPreviews([]);
    setScannerActive(false);
  };

  const selectedActionConfig = formData.action_type ? ACTION_CONFIG[formData.action_type] : null;
  const showPhotoUpload = selectedActionConfig?.requiresPhoto;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inventory Adjustment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Type Selection */}
          <div className="space-y-2">
            <Label>Action Type *</Label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(ACTION_CONFIG) as [ActionType, typeof ACTION_CONFIG[ActionType]][]).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, action_type: key })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.action_type === key 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {config.icon}
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                  {config.requiresClientReview && (
                    <Badge variant="outline" className="mt-2 text-xs">Client Review</Badge>
                  )}
                  {config.requiresPhoto && (
                    <Badge variant="secondary" className="mt-2 ml-1 text-xs">Photo Required</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                <Label>Barcode Scanner</Label>
              </div>
              <div className="flex items-center gap-2">
                <ScannerStatus 
                  isActive={scannerActive} 
                  mode="keyboard" 
                  onHelpClick={() => setShowHelp(true)} 
                />
                <Button
                  variant={scannerActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScannerActive(!scannerActive)}
                >
                  <Scan className="mr-2 h-4 w-4" />
                  {scannerActive ? "Pause" : "Start"}
                </Button>
              </div>
            </div>
            {scannerActive && (
              <BarcodeScanner mode="keyboard" onScan={handleBarcodeScan} />
            )}
          </div>

          {/* Client Selection */}
          <div className="space-y-2">
            <Label>Client *</Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) => setFormData({ ...formData, client_id: value, sku_id: "" })}
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

          {/* SKU Selection */}
          <div className="space-y-2">
            <Label>SKU *</Label>
            <Select
              value={formData.sku_id}
              onValueChange={(value) => setFormData({ ...formData, sku_id: value })}
              disabled={!formData.client_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.client_id ? "Select SKU" : "Select client first"} />
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

          {/* Location Selection */}
          <div className="space-y-2">
            <Label>Location *</Label>
            <Select
              value={formData.location_id}
              onValueChange={(value) => setFormData({ ...formData, location_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label>Quantity *</Label>
            <Input
              type="number"
              placeholder="Enter quantity (negative for deductions)"
              value={formData.qty_delta}
              onChange={(e) => setFormData({ ...formData, qty_delta: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Use negative numbers for deductions (e.g., -5)
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes {formData.action_type !== 'sale' && "(Optional)"}</Label>
            <Textarea
              placeholder="Additional details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          {/* Photo Upload - Only for Damaged */}
          {showPhotoUpload && (
            <div className="space-y-2">
              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                <p className="text-sm font-medium text-orange-800">⚠️ QC Photos Required</p>
                <p className="text-xs text-orange-700">Upload at least one photo to proceed</p>
              </div>

              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                  id="adj-photo-upload"
                />
                <label htmlFor="adj-photo-upload" className="cursor-pointer">
                  <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload photos</p>
                </label>
              </div>

              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`Photo ${index + 1}`} className="w-full h-20 object-cover rounded" />
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
            </div>
          )}

          {/* Info Box */}
          {selectedActionConfig?.requiresClientReview && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This will create a pending item for client review. 
                Inventory will not be adjusted until the client makes a decision.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !formData.client_id || !formData.sku_id || !formData.location_id || !formData.qty_delta || !formData.action_type}
          >
            {loading ? "Processing..." : formData.action_type === 'sale' ? "Record Sale" : "Submit for Review"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <ScannerHelpDialog open={showHelp} onOpenChange={setShowHelp} />
    </Dialog>
  );
};