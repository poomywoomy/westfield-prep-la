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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Camera, X, Scan, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { playSuccessSound, playErrorSound } from "@/lib/soundEffects";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScannerStatus } from "@/components/ScannerStatus";
import { ScannerHelpDialog } from "@/components/admin/ScannerHelpDialog";

const adjustmentSchema = z.object({
  client_id: z.string().uuid(),
  sku_id: z.string().uuid(),
  location_id: z.string().uuid(),
  qty_delta: z.number().int().min(-1000000).max(1000000).refine(val => val !== 0, "Adjustment quantity cannot be zero"),
  reason_code: z.enum(['damage', 'rework', 'correction', 'return', 'sold', 'sent_to_amazon', 'sent_to_walmart', 'sent_to_tiktok', 'other']),
  notes: z.string().trim().min(1, "Notes are required").max(1000),
  lot_number: z.string().trim().max(100).nullable().optional(),
  expiry_date: z.date().nullable().optional(),
  mark_as_damaged: z.boolean().optional(),
});

interface InventoryAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  prefilledClientId?: string;
}

interface BatchItem {
  sku_id: string;
  sku_code: string;
  title: string;
  qty_delta: number;
  location_id: string;
  notes: string;
}

export const InventoryAdjustmentDialog = ({ open, onOpenChange, onSuccess, prefilledClientId }: InventoryAdjustmentDialogProps) => {
  const [clients, setClients] = useState<any[]>([]);
  const [skus, setSKUs] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [currentInventory, setCurrentInventory] = useState<{ qty: number; location: string } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    sku_id: "",
    location_id: "",
    qty_delta: "",
    reason_code: "damage",
    notes: "",
    lot_number: "",
    expiry_date: null as Date | null,
    mark_as_damaged: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchClients();
      fetchLocations();
      // Set prefilled client ID if provided
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
    
    // Auto-select Main Warehouse if available
    const mainWarehouse = data?.find(loc => loc.code === 'MAIN' || loc.name.toLowerCase().includes('main'));
    if (mainWarehouse && !formData.location_id) {
      setFormData(prev => ({ ...prev, location_id: mainWarehouse.id }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Parse and validate qty_delta
      const qtyDelta = parseInt(formData.qty_delta, 10);
      if (isNaN(qtyDelta)) {
        toast({
          title: "Invalid Quantity",
          description: "Please enter a valid quantity adjustment.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const validated = adjustmentSchema.parse({
        client_id: formData.client_id,
        sku_id: formData.sku_id,
        location_id: formData.location_id,
        qty_delta: qtyDelta,
        reason_code: formData.reason_code,
        notes: formData.notes,
        lot_number: formData.lot_number || null,
        expiry_date: formData.expiry_date || null,
        mark_as_damaged: formData.mark_as_damaged,
      });

      // All adjustments now use standard ADJUSTMENT_PLUS/ADJUSTMENT_MINUS
      const transactionType = validated.qty_delta > 0 ? "ADJUSTMENT_PLUS" : "ADJUSTMENT_MINUS";
      
      const { data: ledgerData, error } = await supabase.from("inventory_ledger").insert({
        client_id: validated.client_id,
        sku_id: validated.sku_id,
        location_id: validated.location_id,
        qty_delta: validated.qty_delta,
        transaction_type: transactionType,
        reason_code: validated.reason_code,
        notes: validated.notes,
        lot_number: validated.lot_number,
        expiry_date: validated.expiry_date ? format(validated.expiry_date, "yyyy-MM-dd") : null,
      } as any).select();

      if (error) throw error;

      // Handle damaged return workflow
      if (validated.reason_code === 'return' && validated.mark_as_damaged && ledgerData) {
        // Get client info for ASN number
        const { data: clientData } = await supabase
          .from("clients")
          .select("company_name")
          .eq("id", validated.client_id)
          .single();

        // Generate ASN number
        const dateStr = format(new Date(), "yyyyMMdd");
        const clientCode = clientData?.company_name.substring(0, 3).toUpperCase() || "CLT";
        const asnNumber = `RTN-${clientCode}-${dateStr}-${Math.floor(Math.random() * 1000)}`;

        // Create ASN header
        const { data: asnData, error: asnError } = await supabase
          .from("asn_headers")
          .insert({
            client_id: validated.client_id,
            asn_number: asnNumber,
            status: 'issue',
            received_at: new Date().toISOString(),
            notes: `Auto-created from damaged return adjustment. Linked to adjustment: ${ledgerData[0].id}`,
          })
          .select()
          .single();

        if (asnError) throw asnError;

        // Create ASN line
        const { error: lineError } = await supabase
          .from("asn_lines")
          .insert({
            asn_id: asnData.id,
            sku_id: validated.sku_id,
            expected_units: Math.abs(validated.qty_delta),
            received_units: Math.abs(validated.qty_delta),
            damaged_units: Math.abs(validated.qty_delta),
            notes: validated.notes,
          });

        if (lineError) throw lineError;

        // Create damaged item decision for client review
        const { error: decisionError } = await supabase
          .from("damaged_item_decisions")
          .insert({
            client_id: validated.client_id,
            asn_id: asnData.id,
            sku_id: validated.sku_id,
            quantity: Math.abs(validated.qty_delta),
            discrepancy_type: 'damaged',
            status: 'pending',
            admin_notes: 'Damaged return marked during inventory adjustment',
          });

        if (decisionError) throw decisionError;
      }

      toast({
        title: "Adjustment recorded",
        description: `Inventory adjusted by ${validated.qty_delta > 0 ? '+' : ''}${validated.qty_delta} units`,
      });

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
      body: {
        barcode,
        client_id: formData.client_id,
        context: 'adjustment'
      }
    });

    if (data?.found && data.type.startsWith('product_')) {
      const sku = data.data.sku || data.data;
      setFormData({ ...formData, sku_id: sku.id, location_id: data.data.location_id || formData.location_id });
      setCurrentInventory({ qty: data.data.current_qty || 0, location: data.data.location_id || '' });
      playSuccessSound();
      toast({ title: "SKU Found", description: `${sku.client_sku} - ${sku.title}` });
    } else {
      playErrorSound();
      toast({ title: "Not Found", description: "Barcode not recognized", variant: "destructive" });
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos([...photos, ...files]);
    
    files.forEach(file => {
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

  const addToBatch = () => {
    if (!formData.sku_id) return;
    
    const sku = skus.find(s => s.id === formData.sku_id);
    if (!sku) return;

    setBatchItems([...batchItems, {
      sku_id: formData.sku_id,
      sku_code: sku.client_sku,
      title: sku.title,
      qty_delta: parseInt(formData.qty_delta) || 0,
      location_id: formData.location_id,
      notes: formData.notes
    }]);

    // Reset for next scan
    setFormData({ ...formData, sku_id: "", qty_delta: "", notes: "" });
    setCurrentInventory(null);
    toast({ title: "Added to batch", description: `${sku.client_sku} queued` });
  };

  const removeBatchItem = (index: number) => {
    setBatchItems(batchItems.filter((_, i) => i !== index));
  };

  const submitBatchAdjustments = async () => {
    if (batchItems.length === 0) return;
    
    setLoading(true);
    try {
      const entries = batchItems.map(item => ({
        client_id: formData.client_id,
        sku_id: item.sku_id,
        location_id: item.location_id,
        qty_delta: item.qty_delta,
        transaction_type: (item.qty_delta > 0 ? "ADJUSTMENT_PLUS" : "ADJUSTMENT_MINUS") as "ADJUSTMENT_PLUS" | "ADJUSTMENT_MINUS",
        reason_code: formData.reason_code,
        notes: item.notes,
        lot_number: formData.lot_number || null,
        expiry_date: formData.expiry_date ? format(formData.expiry_date, "yyyy-MM-dd") : null,
      }));

      const { error } = await supabase.from("inventory_ledger").insert(entries);
      if (error) throw error;

      toast({ title: "Batch complete", description: `${batchItems.length} adjustments recorded` });
      setBatchItems([]);
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: 'damage' | 'sold' | 'return' | 'sent_to_amazon') => {
    setFormData({ ...formData, reason_code: preset });
    toast({ title: `${preset.replace('_', ' ')} mode activated` });
  };

  const resetForm = () => {
    setFormData({
      client_id: "",
      sku_id: "",
      location_id: "",
      qty_delta: "",
      reason_code: "damage",
      notes: "",
      lot_number: "",
      expiry_date: null,
      mark_as_damaged: false,
    });
    setBatchMode(false);
    setBatchItems([]);
    setPhotos([]);
    setPhotoPreviews([]);
    setCurrentInventory(null);
    setScannerActive(false);
  };

  const showPhotoCapture = formData.reason_code === 'damage';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Inventory Adjustment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Presets */}
          <div className="flex gap-2 p-3 bg-muted/30 rounded-lg flex-wrap">
            <Button variant="outline" size="sm" onClick={() => applyPreset('damage')}>
              📸 Damage Report
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('sold')}>
              💰 Sale
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('return')}>
              ↩️ Return
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('sent_to_amazon')}>
              📦 Sent to Amazon
            </Button>
          </div>

          {/* Batch Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch checked={batchMode} onCheckedChange={setBatchMode} />
              <Label>Batch Mode (scan multiple items)</Label>
            </div>
            {batchMode && <Badge variant="secondary">{batchItems.length} items queued</Badge>}
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
                  {scannerActive ? "Pause Scanner" : "Start Scanner"}
                </Button>
              </div>
            </div>
            {scannerActive && (
              <BarcodeScanner
                mode="keyboard"
                onScan={handleBarcodeScan}
                onError={(error) => toast({ title: "Scan error", description: error, variant: "destructive" })}
                placeholder="Scan product barcode..."
                continuous={batchMode}
              />
            )}
            {currentInventory && (
              <div className="p-2 bg-primary/10 rounded text-sm">
                Current inventory: <strong>{currentInventory.qty} units</strong>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, client_id: value, sku_id: "" });
                }}
              >
                <SelectTrigger id="client">
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

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Select
                value={formData.sku_id}
                onValueChange={(value) => setFormData({ ...formData, sku_id: value })}
                disabled={!formData.client_id}
              >
                <SelectTrigger id="sku">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="qty_delta">Adjustment Quantity *</Label>
            <Input
              id="qty_delta"
              type="number"
              placeholder="e.g., +50 or -25"
              value={formData.qty_delta}
              onChange={(e) => setFormData({ ...formData, qty_delta: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Use + for additions, - for reductions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason_code">Reason Code *</Label>
            <Select
              value={formData.reason_code}
              onValueChange={(value) => setFormData({ ...formData, reason_code: value })}
            >
              <SelectTrigger id="reason_code">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="damage">Damage</SelectItem>
                <SelectItem value="rework">Rework</SelectItem>
                <SelectItem value="correction">Correction</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="sent_to_amazon">Sent to Amazon</SelectItem>
                <SelectItem value="sent_to_walmart">Sent to Walmart</SelectItem>
                <SelectItem value="sent_to_tiktok">Sent to TikTok</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes *</Label>
            <Textarea
              id="notes"
              placeholder="Explain the reason for this adjustment..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lot_number">Lot Number (Optional)</Label>
              <Input
                id="lot_number"
                placeholder="Enter lot number"
                value={formData.lot_number}
                onChange={(e) => setFormData({ ...formData, lot_number: e.target.value })}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiry_date ? format(formData.expiry_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiry_date || undefined}
                    onSelect={(date) => setFormData({ ...formData, expiry_date: date || null })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Photo Evidence for Damage/Shrink */}
          {showPhotoCapture && (
            <div className="space-y-2 p-3 border-2 border-dashed rounded-lg">
              <Label>Photo Evidence</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('photo-input')?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Add Photos
                </Button>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
                <span className="text-xs text-muted-foreground">{photos.length} photos attached</span>
              </div>
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {photoPreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img src={preview} alt={`Photo ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => removePhoto(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mark as Damaged checkbox for returns */}
          {formData.reason_code === 'return' && (
            <div className="flex items-center space-x-2 p-3 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
              <Switch
                id="mark-damaged"
                checked={formData.mark_as_damaged}
                onCheckedChange={(checked) => setFormData({ ...formData, mark_as_damaged: checked })}
              />
              <div className="space-y-1">
                <Label htmlFor="mark-damaged" className="cursor-pointer font-medium">
                  Mark as Damaged Return
                </Label>
                <p className="text-xs text-muted-foreground">
                  Will create ASN and send for client review
                </p>
              </div>
            </div>
          )}

          {/* Batch Items Queue */}
          {batchMode && batchItems.length > 0 && (
            <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
              <Label>Batch Queue ({batchItems.length} items)</Label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {batchItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-background rounded text-sm">
                    <span>{item.sku_code} - {item.title}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.qty_delta > 0 ? "default" : "destructive"}>
                        {item.qty_delta > 0 ? '+' : ''}{item.qty_delta}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeBatchItem(idx)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          {batchMode && batchItems.length > 0 ? (
            <>
              <Button variant="secondary" onClick={addToBatch} disabled={loading || !formData.sku_id}>
                <Plus className="mr-2 h-4 w-4" />
                Add to Batch
              </Button>
              <Button onClick={submitBatchAdjustments} disabled={loading}>
                {loading ? "Submitting..." : `Submit All (${batchItems.length})`}
              </Button>
            </>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Recording..." : "Record Adjustment"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      <ScannerHelpDialog open={showHelp} onOpenChange={setShowHelp} />
    </Dialog>
  );
};
