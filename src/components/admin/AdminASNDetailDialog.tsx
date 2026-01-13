import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, AlertCircle, X, Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { resignPhotoUrls } from "@/lib/photoUtils";
import { useToast } from "@/hooks/use-toast";
import { DragDropPhotoUpload } from "./DragDropPhotoUpload";

interface AdminASNDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asnId: string | null;
  onSuccess?: () => void;
}

interface ASNHeader {
  asn_number: string;
  status: string;
  eta: string | null;
  received_at: string | null;
  created_at: string;
  notes: string | null;
  carrier: string | null;
  tracking_number: string | null;
  client_id: string;
  closed_at: string | null;
}

interface ASNLine {
  id: string;
  expected_units: number;
  received_units: number | null;
  normal_units: number | null;
  damaged_units: number | null;
  missing_units: number | null;
  quarantined_units: number | null;
  skus: {
    client_sku: string;
    internal_sku: string | null;
    title: string;
    image_url: string | null;
  } | null;
}

interface Discrepancy {
  id: string;
  discrepancy_type: string;
  quantity: number;
  qc_photo_urls: string[] | null;
  decision: string | null;
  status: string;
  submitted_at: string | null;
  admin_notes: string | null;
  sku_id: string;
  skus: {
    client_sku: string;
    internal_sku: string | null;
    title: string;
  } | null;
}

export function AdminASNDetailDialog({ open, onOpenChange, asnId, onSuccess }: AdminASNDetailDialogProps) {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<ASNHeader | null>(null);
  const [lines, setLines] = useState<ASNLine[]>([]);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [displayPhotoMap, setDisplayPhotoMap] = useState<Map<string, string>>(new Map());
  const [addingPhotosTo, setAddingPhotosTo] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && asnId) {
      fetchASNDetails();
    }
  }, [open, asnId]);

  const fetchASNDetails = async () => {
    if (!asnId) return;
    setLoading(true);
    try {
      // Fetch ASN header
      const { data: headerData, error: headerError } = await supabase
        .from("asn_headers")
        .select("asn_number, status, eta, received_at, created_at, notes, carrier, tracking_number, client_id, closed_at")
        .eq("id", asnId)
        .single();

      if (headerError) throw headerError;
      setHeader(headerData);

      // Fetch ASN lines with internal_sku
      const { data: linesData, error: linesError } = await supabase
        .from("asn_lines")
        .select(`
          id,
          expected_units,
          received_units,
          normal_units,
          damaged_units,
          missing_units,
          quarantined_units,
          skus(client_sku, internal_sku, title, image_url)
        `)
        .eq("asn_id", asnId)
        .order("created_at", { ascending: true });

      if (linesError) throw linesError;
      setLines(linesData || []);

      // Fetch discrepancies with QC photos
      const { data: discData, error: discError } = await supabase
        .from("damaged_item_decisions")
        .select(`
          id,
          discrepancy_type,
          quantity,
          qc_photo_urls,
          decision,
          status,
          submitted_at,
          admin_notes,
          sku_id,
          skus(client_sku, internal_sku, title)
        `)
        .eq("asn_id", asnId)
        .order("created_at", { ascending: false });

      if (discError) throw discError;
      setDiscrepancies(discData || []);

      // Collect and re-sign all photos
      const photoMap = new Map<string, string>();
      const allPhotos: string[] = [];
      (discData || []).forEach((disc) => {
        if (disc.qc_photo_urls) {
          allPhotos.push(...disc.qc_photo_urls);
        }
      });

      if (allPhotos.length > 0) {
        const signedPhotos = await resignPhotoUrls(allPhotos);
        allPhotos.forEach((original, idx) => {
          photoMap.set(original, signedPhotos[idx]);
        });
        setDisplayPhotoMap(photoMap);
      }
    } catch (error) {
      console.error("Error fetching ASN details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      issue: { label: "Discrepancies", className: "bg-destructive text-destructive-foreground" },
      not_received: { label: "Not Received", className: "bg-background text-foreground border border-border" },
      receiving: { label: "Receiving", className: "bg-yellow-600 text-white" },
      closed: { label: "Completed", className: "bg-green-700 text-white" },
    };
    const config = statusMap[status] || { label: status.replace(/_/g, " "), className: "bg-muted text-muted-foreground" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getLineStatus = (line: ASNLine) => {
    const received = line.received_units || 0;
    const expected = line.expected_units;
    const damaged = line.damaged_units || 0;
    const missing = line.missing_units || 0;

    if (received === 0) return <Badge variant="secondary">Pending</Badge>;
    if (damaged > 0 || missing > 0) return <Badge className="bg-orange-500 text-white">Issues</Badge>;
    if (received === expected) return <Badge className="bg-green-600 text-white">Complete</Badge>;
    return <Badge variant="outline">Partial</Badge>;
  };

  const getDisplaySku = (sku: { client_sku: string; internal_sku: string | null } | null) => {
    if (!sku) return "N/A";
    return sku.internal_sku ? `${sku.internal_sku} (${sku.client_sku})` : sku.client_sku;
  };

  const handleDeletePhoto = async (discrepancyId: string, photoPath: string) => {
    try {
      // Find the discrepancy
      const discrepancy = discrepancies.find(d => d.id === discrepancyId);
      if (!discrepancy || !discrepancy.qc_photo_urls) return;

      // Remove photo from array
      const updatedUrls = discrepancy.qc_photo_urls.filter(url => url !== photoPath);

      // Update damaged_item_decisions
      const { error: updateError } = await supabase
        .from('damaged_item_decisions')
        .update({ qc_photo_urls: updatedUrls })
        .eq('id', discrepancyId);

      if (updateError) throw updateError;

      // Delete from storage
      await supabase.storage.from('qc-images').remove([photoPath]);

      // Delete from qc_images table
      await supabase.from('qc_images').delete().eq('file_path', photoPath);

      toast({ title: "Photo deleted" });
      fetchASNDetails();
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      toast({ title: "Error", description: "Failed to delete photo", variant: "destructive" });
    }
  };

  const handlePhotosAdded = async (discrepancyId: string, newPaths: string[]) => {
    try {
      const discrepancy = discrepancies.find(d => d.id === discrepancyId);
      const currentUrls = discrepancy?.qc_photo_urls || [];
      const updatedUrls = [...currentUrls, ...newPaths];

      const { error } = await supabase
        .from('damaged_item_decisions')
        .update({ qc_photo_urls: updatedUrls })
        .eq('id', discrepancyId);

      if (error) throw error;

      toast({ title: "Photos added" });
      setAddingPhotosTo(null);
      fetchASNDetails();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding photos:", error);
      toast({ title: "Error", description: "Failed to add photos", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            ASN Details: {header?.asn_number || "..."}
            {header && getStatusBadge(header.status)}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !header ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load ASN details</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skus">SKUs</TabsTrigger>
              <TabsTrigger value="photos">
                QC Photos {discrepancies.some(d => d.qc_photo_urls?.length) && (
                  <Badge variant="secondary" className="ml-2">
                    {discrepancies.reduce((sum, d) => sum + (d.qc_photo_urls?.length || 0), 0)}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ASN Number</p>
                      <p className="font-medium">{header.asn_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">{getStatusBadge(header.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ETA</p>
                      <p className="font-medium">
                        {header.eta ? format(new Date(header.eta), "MMM d, yyyy") : "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">{format(new Date(header.created_at), "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Received At</p>
                      <p className="font-medium">
                        {header.received_at ? format(new Date(header.received_at), "MMM d, yyyy h:mm a") : "Not yet received"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Closed At</p>
                      <p className="font-medium">
                        {header.closed_at ? format(new Date(header.closed_at), "MMM d, yyyy h:mm a") : "Not yet closed"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p className="font-medium">{header.carrier || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-medium font-mono text-sm">{header.tracking_number || "N/A"}</p>
                    </div>
                    {header.notes && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm mt-1">{header.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skus">
              {lines.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No SKUs in this ASN</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <Table className="min-w-[900px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">SKU</TableHead>
                        <TableHead className="min-w-[150px]">Title</TableHead>
                        <TableHead className="text-right w-[80px]">Expected</TableHead>
                        <TableHead className="text-right w-[80px]">Received</TableHead>
                        <TableHead className="text-right w-[70px]">Normal</TableHead>
                        <TableHead className="text-right w-[70px]">Damaged</TableHead>
                        <TableHead className="text-right w-[70px]">Missing</TableHead>
                        <TableHead className="text-right w-[90px]">Quarantined</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell className="font-mono text-xs">
                            {getDisplaySku(line.skus)}
                          </TableCell>
                          <TableCell className="text-sm">{line.skus?.title || "Unknown"}</TableCell>
                          <TableCell className="text-right">{line.expected_units}</TableCell>
                          <TableCell className="text-right">{line.received_units || 0}</TableCell>
                          <TableCell className="text-right">{line.normal_units || 0}</TableCell>
                          <TableCell className="text-right">
                            {line.damaged_units ? (
                              <span className="text-orange-600 font-medium">{line.damaged_units}</span>
                            ) : (
                              0
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {line.missing_units ? (
                              <span className="text-destructive font-medium">{line.missing_units}</span>
                            ) : (
                              0
                            )}
                          </TableCell>
                          <TableCell className="text-right">{line.quarantined_units || 0}</TableCell>
                          <TableCell>{getLineStatus(line)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="photos">
              {discrepancies.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No discrepancies for this ASN</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {discrepancies.map((disc) => (
                    <Card key={disc.id}>
                      <CardContent className="pt-6">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">
                              {disc.skus?.title || "Unknown SKU"} ({getDisplaySku(disc.skus)})
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge className="capitalize">
                                {disc.discrepancy_type} - {disc.quantity} units
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAddingPhotosTo(addingPhotosTo === disc.id ? null : disc.id)}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Add Photos
                              </Button>
                            </div>
                          </div>
                          {disc.decision && (
                            <p className="text-sm text-muted-foreground">
                              Decision: <span className="capitalize">{disc.decision.replace(/_/g, " ")}</span>
                            </p>
                          )}
                          {disc.admin_notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Admin Notes: {disc.admin_notes}
                            </p>
                          )}
                        </div>

                        {/* Add photos section */}
                        {addingPhotosTo === disc.id && header && (
                          <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                            <DragDropPhotoUpload
                              clientId={header.client_id}
                              referenceType="asn"
                              referenceId={asnId || undefined}
                              onPhotosChange={(paths) => handlePhotosAdded(disc.id, paths)}
                              maxPhotos={10}
                            />
                          </div>
                        )}

                        {/* Photo grid */}
                        {disc.qc_photo_urls && disc.qc_photo_urls.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {disc.qc_photo_urls.map((photoPath, idx) => {
                              const displayUrl = displayPhotoMap.get(photoPath) || photoPath;
                              return (
                                <div
                                  key={idx}
                                  className="relative group border rounded-lg overflow-hidden"
                                >
                                  <a
                                    href={displayUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                  >
                                    <img
                                      src={displayUrl}
                                      alt={`QC Photo ${idx + 1}`}
                                      className="w-full h-36 object-cover"
                                    />
                                  </a>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeletePhoto(disc.id, photoPath)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No photos uploaded for this discrepancy</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
