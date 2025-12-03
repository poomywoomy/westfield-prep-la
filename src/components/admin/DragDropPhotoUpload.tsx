import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateImageFile } from "@/lib/fileValidation";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragDropPhotoUploadProps {
  clientId: string;
  referenceType: "asn" | "return" | "removal_order" | "adjustment";
  referenceId?: string;
  onPhotosChange: (paths: string[]) => void;
  existingPhotos?: string[];
  required?: boolean;
  maxPhotos?: number;
  className?: string;
}

export const DragDropPhotoUpload = ({
  clientId,
  referenceType,
  referenceId,
  onPhotosChange,
  existingPhotos = [],
  required = false,
  maxPhotos = 10,
  className,
}: DragDropPhotoUploadProps) => {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [displayUrls, setDisplayUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  // Re-sign URLs for display
  useEffect(() => {
    const signUrls = async () => {
      if (photos.length === 0) {
        setDisplayUrls([]);
        return;
      }

      const signedUrls = await Promise.all(
        photos.map(async (path) => {
          // If it's already a full URL (preview), return as-is
          if (path.startsWith("data:") || path.startsWith("blob:")) {
            return path;
          }
          const { data } = await supabase.storage
            .from("qc-images")
            .createSignedUrl(path, 3600);
          return data?.signedUrl || path;
        })
      );
      setDisplayUrls(signedUrls);
    };
    signUrls();
  }, [photos]);

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const refId = referenceId || "pending";
    const filePath = `${clientId}/${referenceType}/${refId}/${timestamp}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("qc-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast({
        title: "Upload Failed",
        description: uploadError.message,
        variant: "destructive",
      });
      return null;
    }

    // Insert into qc_images table for 30-day auto-deletion tracking
    const { data: signedUrlData } = await supabase.storage
      .from("qc-images")
      .createSignedUrl(filePath, 3600);

    await supabase.from("qc_images").insert({
      client_id: clientId,
      file_path: filePath,
      image_url: signedUrlData?.signedUrl || filePath,
    });

    return filePath;
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (!clientId) {
        toast({
          title: "Client Required",
          description: "Please select a client first",
          variant: "destructive",
        });
        return;
      }

      const remainingSlots = maxPhotos - photos.length;
      if (remainingSlots <= 0) {
        toast({
          title: "Maximum Photos",
          description: `Maximum ${maxPhotos} photos allowed`,
          variant: "destructive",
        });
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      const validFiles: File[] = [];

      for (const file of filesToProcess) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast({
            title: "Invalid File",
            description: validation.error,
            variant: "destructive",
          });
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      setUploading(true);
      const uploadedPaths: string[] = [];

      for (const file of validFiles) {
        const path = await uploadPhoto(file);
        if (path) {
          uploadedPaths.push(path);
        }
      }

      if (uploadedPaths.length > 0) {
        const newPhotos = [...photos, ...uploadedPaths];
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
        toast({
          title: "Photos Uploaded",
          description: `${uploadedPaths.length} photo(s) uploaded successfully`,
        });
      }

      setUploading(false);
    },
    [clientId, photos, maxPhotos, onPhotosChange, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const removePhoto = async (index: number) => {
    const pathToRemove = photos[index];

    // Delete from storage
    if (!pathToRemove.startsWith("data:") && !pathToRemove.startsWith("blob:")) {
      await supabase.storage.from("qc-images").remove([pathToRemove]);
      // Delete from qc_images table
      await supabase.from("qc_images").delete().eq("file_path", pathToRemove);
    }

    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          uploading && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id={`photo-upload-${referenceType}`}
          disabled={uploading}
        />
        <label
          htmlFor={`photo-upload-${referenceType}`}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {uploading ? (
            <>
              <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">
                {dragActive ? "Drop photos here" : "Drag & drop photos or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP up to 10MB each • {photos.length}/{maxPhotos} photos
              </p>
            </>
          )}
        </label>
      </div>

      {/* Photo Previews */}
      {displayUrls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {displayUrls.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              {url ? (
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                  onClick={() => window.open(url, "_blank")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
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

      {/* Required indicator */}
      {required && photos.length === 0 && (
        <p className="text-xs text-destructive">* At least one photo is required</p>
      )}
    </div>
  );
};
