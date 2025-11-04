import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface QCPhotoUploadProps {
  lineId: string;
  asnNumber: string;
  onPhotosUploaded: (urls: string[]) => void;
  existingPhotos?: string[];
}

export function QCPhotoUpload({ lineId, asnNumber, onPhotosUploaded, existingPhotos = [] }: QCPhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadPhoto = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${asnNumber}/${lineId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('qc-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Generate signed URL for private bucket (48 hour expiry for inspection period)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('qc-images')
      .createSignedUrl(filePath, 172800); // 48 hours

    if (signedError) throw signedError;

    return signedData.signedUrl;
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = validFiles.map(file => uploadPhoto(file));
      const urls = await Promise.all(uploadPromises);
      
      const newPhotos = [...photos, ...urls];
      setPhotos(newPhotos);
      onPhotosUploaded(newPhotos);
      
      toast.success(`${validFiles.length} photo(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      toast.error(error.message || "Failed to upload photos");
    } finally {
      setUploading(false);
    }
  }, [photos, asnNumber, lineId, onPhotosUploaded]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const removePhoto = async (url: string, index: number) => {
    try {
      // Extract path from URL
      const urlParts = url.split('/');
      const pathIndex = urlParts.findIndex(part => part === asnNumber);
      if (pathIndex !== -1) {
        const filePath = urlParts.slice(pathIndex).join('/');
        await supabase.storage.from('qc-images').remove([filePath]);
      }

      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
      onPhotosUploaded(newPhotos);
      toast.success("Photo removed");
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error("Failed to remove photo");
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className={`h-8 w-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="text-sm">
            <span className="font-medium text-foreground">
              {uploading ? 'Uploading...' : 'Drop images here or click to browse'}
            </span>
            <p className="text-muted-foreground mt-1">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`QC Photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePhoto(url, index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
