import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useASNs } from "@/hooks/useASNs";
import { format } from "date-fns";
import { Package, Loader2 } from "lucide-react";

interface ClientASNsTabProps {
  clientId: string;
}

export function ClientASNsTab({ clientId }: ClientASNsTabProps) {
  const { data: asns, isLoading } = useASNs(clientId);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      not_received: "secondary",
      receiving: "default",
      received: "outline",
      closed: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status.replace(/_/g, " ")}</Badge>;
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
