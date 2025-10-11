import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, AlertCircle, PackageX, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QCImage {
  id: string;
  image_url: string;
  upload_date: string;
  expires_at: string;
  is_damaged: boolean;
  damage_quantity: number;
  is_missing: boolean;
  missing_quantity: number;
  notes: string | null;
}

const ClientQCImagesTab = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<QCImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: clientData } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!clientData) return;

      const { data, error } = await supabase
        .from("qc_images")
        .select("*")
        .eq("client_id", clientData.id)
        .order("upload_date", { ascending: false });

      if (error) throw error;

      setImages(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load QC images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Image downloaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QC Images</CardTitle>
        <CardDescription>
          View quality control images for your products. Images auto-delete after 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No images available yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {images.map(image => {
              const daysLeft = getDaysUntilExpiry(image.expires_at);
              return (
                <Card key={image.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={image.image_url}
                        alt="QC Image"
                        className="w-48 h-48 object-cover rounded"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              Uploaded {new Date(image.upload_date).toLocaleDateString()}
                            </div>
                            <Badge variant={daysLeft <= 7 ? "destructive" : "secondary"}>
                              Expires in {daysLeft} days
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              downloadImage(
                                image.image_url,
                                `qc-image-${image.id}.jpg`
                              )
                            }
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>

                        {(image.is_damaged || image.is_missing) && (
                          <div className="space-y-2">
                            {image.is_damaged && (
                              <div className="flex items-center gap-2 text-sm">
                                <AlertCircle className="h-4 w-4 text-destructive" />
                                <span className="font-medium">Damaged Product:</span>
                                <span>Quantity {image.damage_quantity}</span>
                              </div>
                            )}
                            {image.is_missing && (
                              <div className="flex items-center gap-2 text-sm">
                                <PackageX className="h-4 w-4 text-destructive" />
                                <span className="font-medium">Missing Product:</span>
                                <span>Quantity {image.missing_quantity}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {image.notes && (
                          <div className="p-3 bg-muted rounded text-sm">
                            <p className="font-medium mb-1">Notes:</p>
                            <p className="text-muted-foreground">{image.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientQCImagesTab;
