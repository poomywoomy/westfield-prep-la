import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X, Upload, RefreshCw, Paperclip, Scan, Save } from "lucide-react";
import { z } from "zod";
import { validateImageFile } from "@/lib/fileValidation";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ShipmentTemplateDialog } from "./ShipmentTemplateDialog";
import { QuickAddSKUModal } from "./QuickAddSKUModal";
import { TemplateSelector } from "./TemplateSelector";
import { detectCarrier, isTrackingNumber, normalizeBarcode } from "@/lib/barcodeDetection";
import type { Database } from "@/integrations/supabase/types";

const COMMON_CARRIERS = [
  "FedEx",
  "UPS",
  "USPS",
  "DHL",
  "Amazon Logistics",
  "OnTrac",
  "LaserShip",
  "Freight",
  "LTL",
  "Ocean Freight",
  "Air Freight",
] as const;

type Client = Database["public"]["Tables"]["clients"]["Row"];
type SKU = Database["public"]["Tables"]["skus"]["Row"];

const asnHeaderSchema = z.object({
  client_id: z.string().uuid({ message: "Please select a client" }),
  asn_number: z.string().min(1, { message: "ASN number is required" }),
  carrier: z.string().trim().max(100).nullable().optional(),
  tracking_number: z.string().trim().max(100).nullable().optional(),
  eta: z.string().nullable().optional(),
  ship_from: z.string().trim().max(500).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

const asnLineSchema = z.object({
  sku_id: z.string().uuid({ message: "Please select a SKU" }),
  expected_units: z.number().int().min(1, "Must be at least 1").max(1000000, "Maximum 1,000,000 units"),
});

interface ASNFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  asnId?: string;
  prefillData?: {
    client_id?: string;
    asn_number?: string;
    carrier?: string;
    tracking_number?: string;
    eta?: string;
    ship_from?: string;
    notes?: string;
    template_id?: string;
    lines?: { sku_id: string; expected_units: number }[];
  };
}

interface ASNLine {
  sku_id: string;
  expected_units: number;
  attachments?: File[];
}

interface ASNAttachment {
  file: File;
  preview: string;
  forLine?: number;
}

export const ASNFormDialog = ({ open, onOpenChange, onSuccess, asnId, prefillData }: ASNFormDialogProps) => {
  // If prefillData includes client_id and we're creating (not editing), lock the client selection
  const isClientLocked = !!prefillData?.client_id && !asnId;
  
  const [clients, setClients] = useState<Client[]>([]);
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    asn_number: "",
    carrier: "",
    tracking_number: "",
    eta: "",
    ship_from: "",
    notes: "",
  });
  const [lines, setLines] = useState<ASNLine[]>([]);
  const [attachments, setAttachments] = useState<ASNAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [scannerMode, setScannerMode] = useState<'manual' | 'scanner'>('manual');
  const [activeScanLine, setActiveScanLine] = useState<number | null>(null);
  const [showQuickAddSKU, setShowQuickAddSKU] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomCarrier, setIsCustomCarrier] = useState(false);
  const keyboardBuffer = useRef<string>("");
  const keyboardTimeout = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchClients();
      if (asnId) {
        loadASN(asnId);
      } else if (prefillData) {
        // Load from prefill (template or tracking intelligence)
        const carrierValue = prefillData.carrier || "";
        const isCustom = carrierValue !== "" && !COMMON_CARRIERS.includes(carrierValue as any);
        setIsCustomCarrier(isCustom);
        setFormData({
          client_id: prefillData.client_id || "",
          asn_number: prefillData.asn_number || "",
          carrier: carrierValue,
          tracking_number: prefillData.tracking_number || "",
          eta: prefillData.eta || "",
          ship_from: prefillData.ship_from || "",
          notes: prefillData.notes || "",
        });
        
        if (prefillData.client_id) {
          fetchSKUs(prefillData.client_id);
          
          // Auto-generate ASN number if not provided
          if (!prefillData.asn_number) {
            supabase.rpc("generate_asn_number", { p_client_id: prefillData.client_id })
              .then(({ data }) => {
                if (data) {
                  setFormData(prev => ({ ...prev, asn_number: data }));
                }
              });
          }
        }
        
        if (prefillData.lines) {
          setLines(prefillData.lines);
        }
      } else {
        resetForm();
      }
    }
  }, [open, asnId, prefillData]);

  // Global keyboard listener for automatic tracking number detection
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Clear timeout on each keydown
      if (keyboardTimeout.current) {
        clearTimeout(keyboardTimeout.current);
      }

      // Prevent default for Enter to avoid form submission
      if (e.key === 'Enter' && keyboardBuffer.current.length > 5) {
        e.preventDefault();
      }

      // Add character to buffer (ignore special keys)
      if (e.key.length === 1 && e.key !== 'Enter') {
        keyboardBuffer.current += e.key;
      }

      // Set timeout to process buffer after 100ms of no input
      keyboardTimeout.current = setTimeout(() => {
        const scannedBarcode = normalizeBarcode(keyboardBuffer.current);
        
        if (scannedBarcode && isTrackingNumber(scannedBarcode)) {
          const carrier = detectCarrier(scannedBarcode);
          
          setFormData(prev => ({
            ...prev,
            tracking_number: scannedBarcode,
            carrier: carrier
          }));
          
          toast({ 
            title: `✓ Tracking Scanned`,
            description: `${carrier} tracking number auto-detected`,
            duration: 2000
          });
        }
        
        keyboardBuffer.current = "";
      }, 100);
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyboardTimeout.current) {
        clearTimeout(keyboardTimeout.current);
      }
    };
  }, [open, toast]);

  const loadASN = async (id: string) => {
    setLoading(true);
    try {
      const { data: header, error: headerError } = await supabase
        .from("asn_headers")
        .select("*")
        .eq("id", id)
        .single();

      if (headerError) throw headerError;

      const { data: lines, error: linesError } = await supabase
        .from("asn_lines")
        .select("*")
        .eq("asn_id", id);

      if (linesError) throw linesError;

      const carrierValue = header.carrier || "";
      const isCustom = carrierValue !== "" && !COMMON_CARRIERS.includes(carrierValue as any);
      setIsCustomCarrier(isCustom);
      setFormData({
        client_id: header.client_id,
        asn_number: header.asn_number,
        carrier: carrierValue,
        tracking_number: header.tracking_number || "",
        eta: header.eta || "",
        ship_from: header.ship_from || "",
        notes: header.notes || "",
      });

      await fetchSKUs(header.client_id);

      setLines(lines.map(line => ({
        sku_id: line.sku_id,
        expected_units: line.expected_units,
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load ASN",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("company_name");
    if (data) setClients(data);
  };

  const fetchSKUs = async (clientId: string) => {
    const { data } = await supabase
      .from("skus")
      .select("*")
      .eq("client_id", clientId)
      .eq("status", "active")
      .order("client_sku");
    if (data) setSKUs(data);
  };

  const handleClientChange = async (clientId: string) => {
    setFormData({ ...formData, client_id: clientId, asn_number: "" });
    fetchSKUs(clientId);
    setLines([]);
    
    // Generate ASN number using database function
    const { data, error } = await supabase.rpc("generate_asn_number", { p_client_id: clientId });
    if (data && !error) {
      setFormData(prev => ({ ...prev, asn_number: data }));
    }
  };

  const regenerateASNNumber = async () => {
    if (!formData.client_id) return;
    
    const { data, error } = await supabase.rpc("generate_asn_number", { p_client_id: formData.client_id });
    if (data && !error) {
      setFormData(prev => ({ ...prev, asn_number: data }));
      toast({ title: "ASN number regenerated" });
    }
  };

  const handleQuickSKUSuccess = async (skuId: string) => {
    // Refresh SKU list
    if (formData.client_id) {
      await fetchSKUs(formData.client_id);
      
      // Add a new line if none exist, or update current line
      if (lines.length === 0) {
        addLine();
        setTimeout(() => {
          updateLine(0, 'sku_id', skuId);
        }, 100);
      } else {
        // Find first empty line or add new one
        const emptyLineIndex = lines.findIndex(l => !l.sku_id);
        if (emptyLineIndex >= 0) {
          updateLine(emptyLineIndex, 'sku_id', skuId);
        } else {
          addLine();
          setTimeout(() => {
            updateLine(lines.length, 'sku_id', skuId);
          }, 100);
        }
      }
      
      toast({
        title: "SKU Created",
        description: "SKU has been added to the form"
      });
    }
  };

  const addLine = () => {
    setLines([...lines, { sku_id: "", expected_units: 1, attachments: [] }]);
  };

  const removeLine = (index: number) => {
    // Remove attachments associated with this line
    setAttachments(attachments.filter(att => att.forLine !== index));
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof ASNLine, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, lineIndex?: number) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files, lineIndex);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, lineIndex?: number) => {
    const files = Array.from(e.target.files || []);
    addFiles(files, lineIndex);
  };

  const addFiles = (files: File[], lineIndex?: number) => {
    const validFiles: ASNAttachment[] = [];

    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive",
        });
        continue;
      }

      const preview = URL.createObjectURL(file);
      validFiles.push({ file, preview, forLine: lineIndex });
    }

    setAttachments([...attachments, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    const attachment = attachments[index];
    URL.revokeObjectURL(attachment.preview);
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate header
      const validatedHeader = asnHeaderSchema.parse({
        ...formData,
        carrier: formData.carrier || null,
        tracking_number: formData.tracking_number || null,
        eta: formData.eta || null,
        ship_from: formData.ship_from || null,
        notes: formData.notes || null,
      });

      // Validate lines
      if (lines.length === 0) {
        throw new Error("Please add at least one line item");
      }

      for (let i = 0; i < lines.length; i++) {
        try {
          asnLineSchema.parse({ sku_id: lines[i].sku_id, expected_units: lines[i].expected_units });
        } catch (err) {
          throw new Error(`Line ${i + 1}: ${(err as z.ZodError).errors[0].message}`);
        }
      }

      // Check for duplicate SKUs
      const skuIds = lines.map(l => l.sku_id);
      if (new Set(skuIds).size !== skuIds.length) {
        throw new Error("Duplicate SKUs are not allowed");
      }

      if (asnId) {
        // Update existing ASN
        const { error: headerError } = await supabase
          .from("asn_headers")
          .update({
            asn_number: validatedHeader.asn_number,
            carrier: validatedHeader.carrier,
            tracking_number: validatedHeader.tracking_number,
            eta: validatedHeader.eta,
            ship_from: validatedHeader.ship_from,
            notes: validatedHeader.notes,
          })
          .eq("id", asnId);

        if (headerError) throw headerError;

        // Delete existing lines
        await supabase.from("asn_lines").delete().eq("asn_id", asnId);

        // Insert new lines
        const { error: linesError } = await supabase
          .from("asn_lines")
          .insert(
            lines.map(line => ({
              asn_id: asnId,
              sku_id: line.sku_id,
              expected_units: line.expected_units,
            }))
          );

        if (linesError) throw linesError;

        toast({
          title: "Success",
          description: `ASN ${validatedHeader.asn_number} updated successfully`,
        });
      } else {
        // Insert ASN header
        const { data: header, error: headerError } = await supabase
          .from("asn_headers")
          .insert({
            asn_number: validatedHeader.asn_number,
            client_id: validatedHeader.client_id,
            carrier: validatedHeader.carrier,
            tracking_number: validatedHeader.tracking_number,
            eta: validatedHeader.eta,
            ship_from: validatedHeader.ship_from,
            notes: validatedHeader.notes,
            status: "not_received",
          })
          .select()
          .single();

        if (headerError) throw headerError;

        // Insert ASN lines
        const { data: insertedLines, error: linesError } = await supabase
          .from("asn_lines")
          .insert(
            lines.map(line => ({
              asn_id: header.id,
              sku_id: line.sku_id,
              expected_units: line.expected_units,
            }))
          )
          .select();

        if (linesError) throw linesError;

        // Upload attachments (only for new ASNs)
      for (const attachment of attachments) {
        const filePath = `${header.id}/${Date.now()}-${attachment.file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from("asn-attachments")
          .upload(filePath, attachment.file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("asn-attachments")
          .getPublicUrl(filePath);

        // Insert attachment record
        await supabase.from("asn_attachments").insert({
          asn_id: header.id,
          asn_line_id: attachment.forLine !== undefined ? insertedLines?.[attachment.forLine]?.id : null,
          file_url: publicUrl,
          filename: attachment.file.name,
          file_size: attachment.file.size,
          mime_type: attachment.file.type,
        });
      }

        // Clean up preview URLs
        attachments.forEach(att => URL.revokeObjectURL(att.preview));

        toast({
          title: "Success",
          description: `ASN ${validatedHeader.asn_number} created successfully`,
        });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create ASN",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: "",
      asn_number: "",
      carrier: "",
      tracking_number: "",
      eta: "",
      ship_from: "",
      notes: "",
    });
    setLines([]);
    setSKUs([]);
    setAttachments([]);
  };

  const globalAttachments = attachments.filter(att => att.forLine === undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{asnId ? "Edit ASN" : "Create ASN"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select 
                value={formData.client_id} 
                onValueChange={handleClientChange}
                disabled={isClientLocked}
              >
                <SelectTrigger className={isClientLocked ? "bg-muted" : ""}>
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
              {isClientLocked && (
                <p className="text-xs text-muted-foreground">
                  Client is automatically set to your account
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="asn_number">ASN Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="asn_number"
                  value={formData.asn_number}
                  onChange={e => setFormData({ ...formData, asn_number: e.target.value })}
                  placeholder="Auto-generated"
                  maxLength={50}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={regenerateASNNumber}
                  disabled={!formData.client_id}
                  title="Regenerate ASN number"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Template Loader */}
          {formData.client_id && !asnId && (
            <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
              <Label>Load from Template (optional)</Label>
              <TemplateSelector
                clientId={formData.client_id}
                onSelect={async (template) => {
                  // Update last_used_at and use_count
                  await supabase
                    .from('shipment_templates')
                    .update({
                      last_used_at: new Date().toISOString(),
                      use_count: (template.use_count || 0) + 1
                    })
                    .eq('id', template.id);

                  // Populate form with template data
                  setFormData({
                    ...formData,
                    carrier: template.carrier || '',
                    ship_from: template.ship_from || '',
                    notes: template.notes || ''
                  });

                  // Populate line items
                  if (template.shipment_template_lines) {
                    setLines(template.shipment_template_lines.map((line: any) => ({
                      sku_id: line.sku_id,
                      expected_units: line.expected_units
                    })));
                  }

                  toast({
                    title: "Template loaded",
                    description: `"${template.template_name}" applied successfully`
                  });
                }}
              />
              <p className="text-xs text-muted-foreground">
                Quickly create ASN from previously saved template
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Select 
                value={isCustomCarrier ? "custom" : formData.carrier}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setIsCustomCarrier(true);
                    setFormData({ ...formData, carrier: "" });
                  } else {
                    setIsCustomCarrier(false);
                    setFormData({ ...formData, carrier: value });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_CARRIERS.map((carrier) => (
                    <SelectItem key={carrier} value={carrier}>
                      {carrier}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
              {isCustomCarrier && (
                <Input
                  id="carrier-custom"
                  value={formData.carrier}
                  onChange={e => setFormData({ ...formData, carrier: e.target.value })}
                  placeholder="Enter custom carrier name"
                  maxLength={100}
                  className="mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <div className="flex gap-2">
                <Input
                  id="tracking"
                  value={formData.tracking_number}
                  onChange={e => setFormData({ ...formData, tracking_number: e.target.value })}
                  maxLength={100}
                  disabled={scannerMode === 'scanner'}
                />
                <Button
                  type="button"
                  variant={scannerMode === 'scanner' ? 'default' : 'outline'}
                  onClick={() => {
                    setScannerMode(scannerMode === 'scanner' ? 'manual' : 'scanner');
                  }}
                  title="Scan tracking barcode"
                >
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
              {scannerMode === 'scanner' && (
                <BarcodeScanner
                  mode="keyboard"
                  onScan={(barcode) => {
                    setFormData({ ...formData, tracking_number: barcode });
                    setScannerMode('manual');
                    toast({ title: "Tracking number scanned" });
                  }}
                  onError={(error) => {
                    toast({ title: "Scan error", description: error, variant: "destructive" });
                  }}
                  placeholder="Scan tracking barcode..."
                  continuous={false}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eta">ETA</Label>
              <Input
                id="eta"
                type="date"
                value={formData.eta}
                onChange={e => setFormData({ ...formData, eta: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ship_from">Ship From Location</Label>
              <Input
                id="ship_from"
                value={formData.ship_from}
                onChange={e => setFormData({ ...formData, ship_from: e.target.value })}
                placeholder="Location"
                maxLength={500}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              maxLength={2000}
              className="resize-none"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <Label>Expected Line Items *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLine}
                disabled={!formData.client_id}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Line
              </Button>
            </div>

            {lines.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Select a client and add line items
              </p>
            )}

            <div className="space-y-2">
              {lines.map((line, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-end gap-2 p-2 border rounded-lg">
                    <div className="flex-1">
                      <Select
                        value={line.sku_id}
                        onValueChange={value => updateLine(index, "sku_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select SKU" />
                        </SelectTrigger>
                        <SelectContent>
                          {skus.map(sku => (
                            <SelectItem key={sku.id} value={sku.id}>
                              {sku.client_sku} - {sku.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        min="1"
                        max="1000000"
                        value={line.expected_units}
                        onChange={e => {
                          const value = e.target.value;
                          const parsed = parseInt(value, 10);
                          updateLine(index, "expected_units", !isNaN(parsed) && parsed > 0 ? parsed : 1);
                        }}
                        placeholder="Qty"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setActiveScanLine(activeScanLine === index ? null : index)}
                      title="Scan product barcode"
                    >
                      <Scan className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById(`line-file-${index}`)?.click()}
                      title="Attach images to this line"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <input
                      id={`line-file-${index}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                      multiple
                      className="hidden"
                      onChange={e => handleFileInput(e, index)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLine(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {activeScanLine === index && (
                    <div className="ml-2 p-3 border-2 border-dashed rounded-md bg-muted/30">
                      <BarcodeScanner
                        mode="keyboard"
                        onScan={async (barcode) => {
                          if (!formData.client_id) return;
                          
                          const { data } = await supabase.functions.invoke('barcode-lookup', {
                            body: { 
                              barcode, 
                              client_id: formData.client_id,
                              context: 'asn_line_selection'
                            }
                          });
                          
                          if (data?.found && data.matched_table === 'skus') {
                            updateLine(index, "sku_id", data.matched_id);
                            toast({ title: `Added: ${data.data.title}` });
                            setActiveScanLine(null);
                          } else {
                            toast({ 
                              title: "SKU not found", 
                              description: `No SKU found for barcode: ${barcode}`,
                              variant: "destructive" 
                            });
                          }
                        }}
                        onError={(error) => {
                          toast({ title: "Scan error", description: error, variant: "destructive" });
                        }}
                        placeholder="Scan product barcode..."
                        continuous={false}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        <DialogFooter>
          {!asnId && formData.client_id && lines.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSaveTemplate(true)}
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Template
            </Button>
          )}
          
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : asnId ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <ShipmentTemplateDialog
        open={showSaveTemplate}
        onOpenChange={setShowSaveTemplate}
        clientId={formData.client_id}
        asnData={{
          carrier: formData.carrier,
          ship_from: formData.ship_from,
          notes: formData.notes,
          lines: lines
        }}
        skus={skus}
        onSuccess={() => {
          toast({ title: "Template saved successfully" });
        }}
      />

      <QuickAddSKUModal
        open={showQuickAddSKU}
        onOpenChange={setShowQuickAddSKU}
        clientId={formData.client_id}
        onSuccess={handleQuickSKUSuccess}
      />
    </Dialog>
  );
};
