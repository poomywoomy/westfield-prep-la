import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, AlertCircle, PackageX, Clock, ZoomIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sanitizeError } from "@/lib/errorHandler";

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

interface QCImageWithSignedUrl extends QCImage {
  signedUrl?: string;
}

const ClientQCImagesTab = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<QCImageWithSignedUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<QCImageWithSignedUrl | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Refetch images when component mounts or dialog opens
    fetchImages();
    
    // Set up realtime subscription for QC images
    const channel = supabase
      .channel('qc-images-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'qc_images' 
      }, () => {
        fetchImages(); // Refresh images on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

      // Create signed URLs for all images with cache-busting
      const imagesWithSignedUrls = await Promise.all(
        (data || []).map(async (image) => {
          try {
            // Add timestamp for cache-busting
            const timestamp = new Date(image.upload_date).getTime();
            const { data: signedData } = await supabase.storage
              .from('qc-images')
              .createSignedUrl(image.image_url, 3600); // 1 hour expiry
            
            return {
              ...image,
              signedUrl: signedData?.signedUrl ? `${signedData.signedUrl}&v=${timestamp}` : ''
            };
          } catch (err) {
            console.error('Failed to create signed URL:', err);
            return { ...image, signedUrl: '' };
          }
        })
      );

      setImages(imagesWithSignedUrls);
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

  const downloadImage = async (imagePath: string, fileName: string) => {
    try {
      // Create a fresh signed URL for download
      const { data, error } = await supabase.storage
        .from('qc-images')
        .createSignedUrl(imagePath, 60); // 1 minute expiry for download
      
      if (error) throw error;
      if (!data?.signedUrl) throw new Error('Failed to generate download URL');

      const response = await fetch(data.signedUrl);
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
        description: sanitizeError(error, 'storage'),
        variant: "destructive",
      });
    }
  };

  const downloadAllImagesForDate = async (dateImages: QCImageWithSignedUrl[], date: string) => {
    toast({
      title: "Downloading...",
      description: `Starting download of ${dateImages.length} images`,
    });

    for (let i = 0; i < dateImages.length; i++) {
      const image = dateImages[i];
      try {
        // Create a fresh signed URL for each download
        const { data, error } = await supabase.storage
          .from('qc-images')
          .createSignedUrl(image.image_url, 60);
        
        if (error || !data?.signedUrl) {
          console.error(`Failed to get signed URL for image ${i + 1}`, error);
          continue;
        }

        const response = await fetch(data.signedUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${date.replace(/\s+/g, '_')}_image_${i + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to download image ${i + 1}`, error);
      }
    }

    toast({
      title: "Complete",
      description: `Downloaded ${dateImages.length} images`,
    });
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const groupImagesByDate = () => {
    const grouped: { [key: string]: QCImageWithSignedUrl[] } = {};
    images.forEach(image => {
      const date = new Date(image.upload_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(image);
    });
    return grouped;
  };

  const handleImageClick = async (image: QCImageWithSignedUrl) => {
    // Force refresh the signed URL when opening modal
    try {
      const timestamp = Date.now();
      const { data: signedData } = await supabase.storage
        .from('qc-images')
        .createSignedUrl(image.image_url, 3600);
      
      if (signedData?.signedUrl) {
        setSelectedImage({
          ...image,
          signedUrl: `${signedData.signedUrl}&v=${timestamp}`
        });
      } else {
        setSelectedImage(image);
      }
    } catch (err) {
      console.error('Failed to refresh signed URL:', err);
      setSelectedImage(image);
    }
    setDialogOpen(true);
  };

  const getIssueText = (image: QCImageWithSignedUrl) => {
    const issues = [];
    if (image.is_damaged) {
      issues.push(`Damaged Product (Qty: ${image.damage_quantity})`);
    }
    if (image.is_missing) {
      issues.push(`Missing Product (Qty: ${image.missing_quantity})`);
    }
    return issues.join(' • ');
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

  const groupedImages = groupImagesByDate();

  return (
    <>
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
            <div className="space-y-8">
              {Object.entries(groupedImages).map(([date, dateImages]) => (
                <div key={date} className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">{date}</h3>
                      <Badge variant="secondary" className="ml-2">
                        {dateImages.length} {dateImages.length === 1 ? 'image' : 'images'}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadAllImagesForDate(dateImages, date)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Image</TableHead>
                        <TableHead>Issue Details</TableHead>
                        <TableHead className="w-[150px]">Expires In</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dateImages.map(image => {
                        const daysLeft = getDaysUntilExpiry(image.expires_at);
                        const hasIssue = image.is_damaged || image.is_missing;
                        return (
                          <TableRow key={image.id}>
                            <TableCell>
                              <div
                                className={`relative cursor-pointer group ${
                                  hasIssue ? 'border-4 border-red-600 rounded' : ''
                                }`}
                                 onClick={() => handleImageClick(image)}
                              >
                                <img
                                  src={image.signedUrl || ''}
                                  alt="QC Image"
                                  className="w-40 h-40 object-cover rounded"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                                  <ZoomIn className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {hasIssue ? (
                                <div className="space-y-2">
                                  {image.is_damaged && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                      <span className="font-medium text-red-600">
                                        Damaged Product: Quantity {image.damage_quantity}
                                      </span>
                                    </div>
                                  )}
                                  {image.is_missing && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <PackageX className="h-4 w-4 text-red-600 flex-shrink-0" />
                                      <span className="font-medium text-red-600">
                                        Missing Product: Quantity {image.missing_quantity}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">No issues reported</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={daysLeft <= 7 ? "destructive" : "secondary"}>
                                {daysLeft} days
                              </Badge>
                            </TableCell>
                            <TableCell>
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
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>QC Image Details</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedImage.signedUrl || ''}
                  alt="QC Image Enlarged"
                  className="max-h-[60vh] w-auto object-contain rounded"
                />
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Uploaded {new Date(selectedImage.upload_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                {(selectedImage.is_damaged || selectedImage.is_missing) && (
                  <div className="space-y-2 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                    <h4 className="font-semibold text-red-600 dark:text-red-400">Issues Detected</h4>
                    {selectedImage.is_damaged && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span>Damaged Product: Quantity {selectedImage.damage_quantity}</span>
                      </div>
                    )}
                    {selectedImage.is_missing && (
                      <div className="flex items-center gap-2 text-sm">
                        <PackageX className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span>Missing Product: Quantity {selectedImage.missing_quantity}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedImage.notes && (
                  <div className="p-4 bg-muted rounded">
                    <h4 className="font-semibold mb-2">Additional Notes:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedImage.notes}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() =>
                    downloadImage(
                      selectedImage.image_url,
                      `qc-image-${selectedImage.id}.jpg`
                    )
                  }
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientQCImagesTab;
