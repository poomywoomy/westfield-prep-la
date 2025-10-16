import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, FileText } from "lucide-react";
import { validatePricingDocument } from "@/lib/fileValidation";
import { sanitizeError } from "@/lib/errorHandler";
import { clientUpdateSchema } from "@/lib/clientValidation";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
  onSuccess: () => void;
}

const EditClientDialog = ({ open, onOpenChange, client, onSuccess }: EditClientDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    estimated_units_per_month: "",
    receiving_format: "both" as "pallets" | "cartons" | "both",
    extra_prep: false,
    storage: false,
    storage_units_per_month: "",
    storage_method: "" as "shelf_storage" | "cubic_foot_storage" | "",
    admin_notes: "",
    fulfillment_services: [] as Array<"fba_prep" | "wfs_prep" | "tiktok_prep" | "self_fulfilled" | "shopify" | "returns_processing">,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client.company_name || "",
        first_name: client.first_name || "",
        last_name: client.last_name || "",
        phone_number: client.phone_number || "",
        estimated_units_per_month: client.estimated_units_per_month?.toString() || "",
        receiving_format: client.receiving_format || "both",
        extra_prep: client.extra_prep || false,
        storage: client.storage || false,
        storage_units_per_month: client.storage_units_per_month?.toString() || "",
        storage_method: client.storage_method || "",
        admin_notes: client.admin_notes || "",
        fulfillment_services: client.fulfillment_services || [],
      });
      setExistingFileUrl(client.pricing_document_url || "");
      setSelectedFile(null);
    }
  }, [client]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validatePricingDocument(file);
      
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validatePricingDocument(file);
      
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return null;

    setUploadingFile(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${client.id}-${Date.now()}.${fileExt}`;
      const filePath = `pricing-docs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('qc-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Return the file path, not a public URL (bucket is now private)
      return filePath;
    } catch (error: any) {
      toast({
        title: "File upload failed",
        description: sanitizeError(error, 'storage'),
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const removeExistingFile = async () => {
    try {
      await supabase
        .from("clients")
        .update({ pricing_document_url: null })
        .eq("id", client.id);
      
      setExistingFileUrl("");
      toast({
        title: "File removed",
        description: "Pricing document has been removed.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: sanitizeError(error, 'database'),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let documentUrl = existingFileUrl;
      
      // Upload new file if selected
      if (selectedFile) {
        const uploadedPath = await handleFileUpload();
        if (uploadedPath) {
          documentUrl = uploadedPath;
        }
      }

      // Prepare data for validation
      const dataToValidate = {
        company_name: formData.company_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        estimated_units_per_month: formData.estimated_units_per_month ? parseInt(formData.estimated_units_per_month) : null,
        receiving_format: formData.receiving_format,
        extra_prep: formData.extra_prep,
        storage: formData.storage,
        storage_units_per_month: formData.storage_units_per_month ? parseInt(formData.storage_units_per_month) : null,
        storage_method: formData.storage_method || null,
        admin_notes: formData.admin_notes,
        fulfillment_services: formData.fulfillment_services,
        pricing_document_url: documentUrl || null,
      };

      // Validate data with zod schema
      const validationResult = clientUpdateSchema.safeParse(dataToValidate);
      
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: "Validation error",
          description: firstError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("clients")
        .update({
          ...validationResult.data,
          contact_name: `${validationResult.data.first_name} ${validationResult.data.last_name}`.trim(),
        })
        .eq("id", client.id);

      if (error) throw error;

      toast({
        title: "Client updated",
        description: "Client information has been updated successfully.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: sanitizeError(error, 'database'),
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
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Update client information and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_units">Estimated Units/Month</Label>
              <Input
                id="estimated_units"
                type="number"
                value={formData.estimated_units_per_month}
                onChange={(e) => setFormData({ ...formData, estimated_units_per_month: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiving_format">Receiving Format</Label>
              <Select
                value={formData.receiving_format}
                onValueChange={(value: any) => setFormData({ ...formData, receiving_format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pallets">Pallets</SelectItem>
                  <SelectItem value="cartons">Cartons</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.storage && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="storage_units">Storage Units/Month</Label>
                  <Input
                    id="storage_units"
                    type="number"
                    value={formData.storage_units_per_month}
                    onChange={(e) => setFormData({ ...formData, storage_units_per_month: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage_method">Storage Method</Label>
                  <Select
                    value={formData.storage_method}
                    onValueChange={(value: any) => setFormData({ ...formData, storage_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shelf_storage">Shelf Storage</SelectItem>
                      <SelectItem value="cubic_foot_storage">Cubic Foot Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3">
            <Label>Fulfillment Services</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fba_prep"
                  checked={formData.fulfillment_services.includes('fba_prep')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'fba_prep'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'fba_prep') });
                    }
                  }}
                />
                <Label htmlFor="fba_prep" className="font-normal cursor-pointer">FBA Prep</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wfs_prep"
                  checked={formData.fulfillment_services.includes('wfs_prep')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'wfs_prep'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'wfs_prep') });
                    }
                  }}
                />
                <Label htmlFor="wfs_prep" className="font-normal cursor-pointer">WFS Prep</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tiktok_prep"
                  checked={formData.fulfillment_services.includes('tiktok_prep')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'tiktok_prep'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'tiktok_prep') });
                    }
                  }}
                />
                <Label htmlFor="tiktok_prep" className="font-normal cursor-pointer">TikTok Shop Prep</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="self_fulfilled"
                  checked={formData.fulfillment_services.includes('self_fulfilled')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'self_fulfilled'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'self_fulfilled') });
                    }
                  }}
                />
                <Label htmlFor="self_fulfilled" className="font-normal cursor-pointer">Self-Fulfilled Shipment</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shopify"
                  checked={formData.fulfillment_services.includes('shopify')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'shopify'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'shopify') });
                    }
                  }}
                />
                <Label htmlFor="shopify" className="font-normal cursor-pointer">Shopify</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="returns_processing"
                  checked={formData.fulfillment_services.includes('returns_processing')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, fulfillment_services: [...formData.fulfillment_services, 'returns_processing'] });
                    } else {
                      setFormData({ ...formData, fulfillment_services: formData.fulfillment_services.filter(s => s !== 'returns_processing') });
                    }
                  }}
                />
                <Label htmlFor="returns_processing" className="font-normal cursor-pointer">Returns Processing</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="extra_prep"
                checked={formData.extra_prep}
                onCheckedChange={(checked) => setFormData({ ...formData, extra_prep: checked as boolean })}
              />
              <Label htmlFor="extra_prep">Extra Prep</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="storage"
                checked={formData.storage}
                onCheckedChange={(checked) => setFormData({ ...formData, storage: checked as boolean })}
              />
              <Label htmlFor="storage">Storage</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_notes">Admin Notes (Internal Only)</Label>
            <Textarea
              id="admin_notes"
              value={formData.admin_notes}
              onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
              placeholder="Internal notes visible only to admin..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Pricing Document</Label>
            <div className="space-y-3">
              {existingFileUrl && !selectedFile && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Current pricing document</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeExistingFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {selectedFile ? (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop a file here, or click to browse
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
