import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Package, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { resignPhotoUrls } from "@/lib/photoUtils";

interface ClientASNDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asnId: string;
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
  skus: {
    client_sku: string;
    title: string;
  } | null;
}

export function ClientASNDetailDialog({ open, onOpenChange, asnId }: ClientASNDetailDialogProps) {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<ASNHeader | null>(null);
  const [lines, setLines] = useState<ASNLine[]>([]);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [displayPhotos, setDisplayPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (open && asnId) {
      fetchASNDetails();
    }
  }, [open, asnId]);

  const fetchASNDetails = async () => {
    setLoading(true);
    try {
      // Fetch ASN header
      const { data: headerData, error: headerError } = await supabase
        .from("asn_headers")
        .select("asn_number, status, eta, received_at, created_at, notes, carrier, tracking_number")
        .eq("id", asnId)
        .single();

      if (headerError) throw headerError;
      setHeader(headerData);

      // Fetch ASN lines
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
          skus(client_sku, title, image_url)
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
          skus(client_sku, title)
        `)
        .eq("asn_id", asnId)
        .order("created_at", { ascending: false });

      if (discError) throw discError;
      setDiscrepancies(discData || []);

      // Collect and re-sign all photos
      const allPhotos: string[] = [];
      (discData || []).forEach((disc) => {
        if (disc.qc_photo_urls) {
          allPhotos.push(...disc.qc_photo_urls);
        }
      });

      if (allPhotos.length > 0) {
        const signedPhotos = await resignPhotoUrls(allPhotos);
        setDisplayPhotos(signedPhotos);
      }
    } catch (error) {
      console.error("Error fetching ASN details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      issue: { label: "Issue", className: "bg-destructive text-destructive-foreground" },
      closed: { label: "Closed", className: "bg-green-600 text-white" },
      not_received: { label: "Waiting", className: "bg-background text-foreground border border-border" },
      receiving: { label: "Receiving", className: "bg-orange-500 text-white" },
      received: { label: "Received", className: "bg-muted text-muted-foreground" },
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <TabsTrigger value="photos">QC Photos</TabsTrigger>
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
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p className="font-medium">{header.carrier || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
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
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">Expected</TableHead>
                        <TableHead className="text-right">Received</TableHead>
                        <TableHead className="text-right">Normal</TableHead>
                        <TableHead className="text-right">Damaged</TableHead>
                        <TableHead className="text-right">Missing</TableHead>
                        <TableHead className="text-right">Quarantined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell className="font-mono text-sm">
                            {line.skus?.client_sku || "N/A"}
                          </TableCell>
                          <TableCell>{line.skus?.title || "Unknown"}</TableCell>
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
              {displayPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No QC photos for this ASN</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {discrepancies
                    .filter((disc) => disc.qc_photo_urls && disc.qc_photo_urls.length > 0)
                    .map((disc) => (
                      <Card key={disc.id}>
                        <CardContent className="pt-6">
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">
                                {disc.skus?.title || "Unknown SKU"} ({disc.skus?.client_sku || "N/A"})
                              </p>
                              <Badge className="capitalize">
                                {disc.discrepancy_type} - {disc.quantity} units
                              </Badge>
                            </div>
                            {disc.decision && (
                              <p className="text-sm text-muted-foreground">
                                Decision: <span className="capitalize">{disc.decision.replace(/_/g, " ")}</span>
                              </p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {disc.qc_photo_urls?.map((photoUrl, idx) => {
                              const photoIndex = displayPhotos.findIndex((p) => p.includes(photoUrl.split("/").pop() || ""));
                              const displayUrl = photoIndex >= 0 ? displayPhotos[photoIndex] : photoUrl;
                              return (
                                <a
                                  key={idx}
                                  href={displayUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                  <img
                                    src={displayUrl}
                                    alt={`QC Photo ${idx + 1}`}
                                    className="w-full h-48 object-cover"
                                  />
                                </a>
                              );
                            })}
                          </div>
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
