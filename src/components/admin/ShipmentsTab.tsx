import { useState } from "react";
import { useOutboundShipments, useDeleteOutboundShipment } from "@/hooks/useOutboundShipments";
import { useClients } from "@/hooks/useClients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Search, Trash2, Eye } from "lucide-react";
import { CreateOutboundShipmentDialog } from "./CreateOutboundShipmentDialog";
import { ShipmentDetailDialog } from "./ShipmentDetailDialog";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

export const ShipmentsTab = () => {
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [shipmentToDelete, setShipmentToDelete] = useState<{ id: string; clientId: string } | null>(null);
  
  const { data: clients } = useClients();
  const { data: shipments, isLoading } = useOutboundShipments(selectedClient);
  const deleteShipment = useDeleteOutboundShipment();

  const filteredShipments = shipments?.filter(shipment =>
    shipment.shipment_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!shipmentToDelete) return;
    
    try {
      await deleteShipment.mutateAsync(shipmentToDelete);
      toast.success("Shipment deleted and inventory restored");
      setShipmentToDelete(null);
    } catch (error: any) {
      toast.error("Failed to delete shipment: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Outbound Shipments
        </h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Shipment
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by shipment number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients?.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Split Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Units</TableHead>
              <TableHead>Total Boxes</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Shipped</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredShipments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">No shipments found</TableCell>
              </TableRow>
            ) : (
              filteredShipments?.map((shipment) => (
                <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono">{shipment.shipment_number}</TableCell>
                  <TableCell>{(shipment as any).clients?.company_name}</TableCell>
                  <TableCell className="capitalize">{shipment.destination_type.replace('_', ' ')}</TableCell>
                  <TableCell className="capitalize">{shipment.shipment_split_type.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge variant={shipment.shipment_status === "shipped" ? "default" : "secondary"}>
                      {shipment.shipment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{shipment.total_units}</TableCell>
                  <TableCell>{shipment.total_boxes}</TableCell>
                  <TableCell>{format(new Date(shipment.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{shipment.shipped_at ? format(new Date(shipment.shipped_at), "MMM d, yyyy") : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedShipment(shipment.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShipmentToDelete({ id: shipment.id, clientId: shipment.client_id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateOutboundShipmentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {selectedShipment && (
        <ShipmentDetailDialog
          open={!!selectedShipment}
          onOpenChange={(open) => !open && setSelectedShipment(null)}
          shipmentId={selectedShipment}
        />
      )}

      <AlertDialog open={!!shipmentToDelete} onOpenChange={(open) => !open && setShipmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this shipment? If the shipment was already shipped, inventory will be restored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
