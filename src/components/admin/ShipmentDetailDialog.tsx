import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOutboundShipment } from "@/hooks/useOutboundShipments";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Package, Box, Truck } from "lucide-react";
import { format } from "date-fns";
import { getTrackingUrl } from "@/lib/trackingUrls";

interface ShipmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipmentId: string;
}

export const ShipmentDetailDialog = ({ open, onOpenChange, shipmentId }: ShipmentDetailDialogProps) => {
  const { data: shipment, isLoading } = useOutboundShipment(shipmentId);

  if (isLoading || !shipment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shipment Details: {shipment.shipment_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{(shipment as any).clients?.company_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={shipment.shipment_status === "shipped" ? "default" : "secondary"}>
                {shipment.shipment_status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Destination</p>
              <p className="capitalize">{shipment.destination_type.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Split Type</p>
              <p className="capitalize">{shipment.shipment_split_type.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Units</p>
              <p className="font-medium">{shipment.total_units}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Boxes</p>
              <p className="font-medium">{shipment.total_boxes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p>{format(new Date(shipment.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
            </div>
            {shipment.shipped_at && (
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p>{format(new Date(shipment.shipped_at), "MMM d, yyyy 'at' h:mm a")}</p>
              </div>
            )}
          </div>

          {/* Boxes */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Box className="h-5 w-5" />
              Boxes
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Box #</TableHead>
                  <TableHead>Dimensions (L×W×H)</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>FBA Shipment ID</TableHead>
                  <TableHead>Destination FC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(shipment as any).outbound_shipment_boxes?.map((box: any) => (
                  <TableRow key={box.id}>
                    <TableCell>#{box.box_number}</TableCell>
                    <TableCell>
                      {box.length_in && box.width_in && box.height_in
                        ? `${box.length_in}×${box.width_in}×${box.height_in} in`
                        : "-"}
                    </TableCell>
                    <TableCell>{box.weight_lbs ? `${box.weight_lbs} lbs` : "-"}</TableCell>
                    <TableCell>{box.carrier || "-"}</TableCell>
                    <TableCell>
                      {box.tracking_number && box.carrier ? (
                        <a
                          href={getTrackingUrl(box.carrier, box.tracking_number)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          {box.tracking_number}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        box.tracking_number || "-"
                      )}
                    </TableCell>
                    <TableCell>{box.fba_shipment_id || "-"}</TableCell>
                    <TableCell>{box.fba_destination_fc || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* SKUs */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Truck className="h-5 w-5" />
              SKUs
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Quantity</TableHead>
                  {shipment.shipment_split_type === "amazon_optimized" && <TableHead>Box #</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(shipment as any).outbound_shipment_lines?.map((line: any) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-mono">{line.skus?.client_sku}</TableCell>
                    <TableCell>{line.skus?.title}</TableCell>
                    <TableCell>{line.quantity}</TableCell>
                    {shipment.shipment_split_type === "amazon_optimized" && (
                      <TableCell>
                        {line.box_id
                          ? `#${(shipment as any).outbound_shipment_boxes?.find((b: any) => b.id === line.box_id)?.box_number}`
                          : "-"}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {shipment.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{shipment.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
