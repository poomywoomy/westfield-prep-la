import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Save, AlertCircle, PackageX } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface QCImage {
  id: string;
  file: File;
  preview: string;
  is_damaged: boolean;
  damage_quantity: number;
  is_missing: boolean;
  missing_quantity: number;
  notes: string;
}

const QCImagesTab = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [images, setImages] = useState<QCImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
      return;
    }

    setClients(data || []);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client first",
        variant: "destructive",
      });
      return;
    }

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith("image/")
    );

    addFiles(files);
  }, [selectedClientId, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client first",
        variant: "destructive",
      });
      return;
    }

    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file =>
        file.type.startsWith("image/")
      );
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    const newImages: QCImage[] = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      is_damaged: false,
      damage_quantity: 0,
      is_missing: false,
      missing_quantity: 0,
      notes: "",
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const updateImage = (id: string, updates: Partial<QCImage>) => {
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  const handleSave = async () => {
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload images to storage and create database records
      for (const image of images) {
        const fileExt = image.file.name.split(".").pop();
        const fileName = `${selectedClientId}/${Date.now()}_${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("qc-images")
          .upload(fileName, image.file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("qc-images")
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from("qc_images")
          .insert({
            client_id: selectedClientId,
            image_url: urlData.publicUrl,
            is_damaged: image.is_damaged,
            damage_quantity: image.damage_quantity,
            is_missing: image.is_missing,
            missing_quantity: image.missing_quantity,
            notes: image.notes,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: "QC images uploaded and sent to client",
      });

      // Clean up
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      setSelectedClientId("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QC Images Upload</CardTitle>
        <CardDescription>
          Upload quality control images for clients. Images auto-delete after 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Select Client</Label>
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a client" />
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

        {selectedClientId && (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Drag & drop images here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="file-input"
                onChange={handleFileInput}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                Browse Files
              </Button>
            </div>

            {images.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">
                    Uploaded Images ({images.length})
                  </h3>
                  <Button
                    onClick={handleSave}
                    disabled={isUploading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Save & Send to Client"}
                  </Button>
                </div>

                <div className="grid gap-4">
                  {images.map(image => (
                    <Card key={image.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={image.preview}
                            alt="QC Preview"
                            className="w-32 h-32 object-cover rounded"
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                {image.file.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeImage(image.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={image.is_damaged}
                                    onCheckedChange={(checked) =>
                                      updateImage(image.id, {
                                        is_damaged: checked as boolean,
                                      })
                                    }
                                  />
                                  <Label className="flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    Damaged Product
                                  </Label>
                                </div>
                                {image.is_damaged && (
                                  <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={image.damage_quantity || ""}
                                    onChange={(e) =>
                                      updateImage(image.id, {
                                        damage_quantity: parseInt(e.target.value) || 0,
                                      })
                                    }
                                  />
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={image.is_missing}
                                    onCheckedChange={(checked) =>
                                      updateImage(image.id, {
                                        is_missing: checked as boolean,
                                      })
                                    }
                                  />
                                  <Label className="flex items-center gap-1">
                                    <PackageX className="h-4 w-4" />
                                    Missing Product
                                  </Label>
                                </div>
                                {image.is_missing && (
                                  <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={image.missing_quantity || ""}
                                    onChange={(e) =>
                                      updateImage(image.id, {
                                        missing_quantity: parseInt(e.target.value) || 0,
                                      })
                                    }
                                  />
                                )}
                              </div>
                            </div>

                            <Textarea
                              placeholder="Additional notes..."
                              value={image.notes}
                              onChange={(e) =>
                                updateImage(image.id, { notes: e.target.value })
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QCImagesTab;
