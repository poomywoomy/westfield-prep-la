import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useASNs } from "@/hooks/useASNs";
import { format } from "date-fns";
import { Package, Loader2, Eye } from "lucide-react";
import { ClientASNDetailDialog } from "./ClientASNDetailDialog";

interface ClientASNsTabProps {
  clientId: string;
}

export function ClientASNsTab({ clientId }: ClientASNsTabProps) {
  const { data: asns, isLoading } = useASNs(clientId);
  const [selectedASNId, setSelectedASNId] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!asns || asns.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No ASNs found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your ASNs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ASN Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Received At</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asns.map((asn) => (
                <TableRow key={asn.id}>
                  <TableCell className="font-medium">#{asn.asn_number}</TableCell>
                  <TableCell>{getStatusBadge(asn.status || "not_received")}</TableCell>
                  <TableCell>{asn.carrier || "-"}</TableCell>
                  <TableCell className="font-mono text-sm">{asn.tracking_number || "-"}</TableCell>
                  <TableCell>
                    {asn.eta ? format(new Date(asn.eta), "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell>
                    {asn.received_at ? format(new Date(asn.received_at), "MMM d, yyyy h:mm a") : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(asn.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedASNId(asn.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <ClientASNDetailDialog
        open={!!selectedASNId}
        onOpenChange={(open) => !open && setSelectedASNId(null)}
        asnId={selectedASNId || ""}
      />
    </Card>
  );
}
