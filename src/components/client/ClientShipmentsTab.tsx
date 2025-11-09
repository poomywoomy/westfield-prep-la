import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOutboundShipments } from "@/hooks/useOutboundShipments";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Search } from "lucide-react";
import { ShipmentDetailDialog } from "@/components/admin/ShipmentDetailDialog";
import { format } from "date-fns";

export const ClientShipmentsTab = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  
  // Get client_id from clients table
  const [clientId, setClientId] = useState<string>("");
  
  useState(() => {
    const fetchClientId = async () => {
      const { data } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user?.id)
        .single();
      if (data) setClientId(data.id);
    };
    if (user?.id) fetchClientId();
  });
  
  const { data: shipments, isLoading } = useOutboundShipments(clientId);

  // Filter for shipped shipments only (RLS will also enforce this)
  const shippedShipments = shipments?.filter(s => s.shipment_status === "shipped");
  
  const filteredShipments = shippedShipments?.filter(shipment =>
    shipment.shipment_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          My Shipments
        </h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by shipment number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment #</TableHead>
              <TableHead>Shipped Date</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Split Type</TableHead>
              <TableHead>Total Units</TableHead>
              <TableHead>Total Boxes</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredShipments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No shipments found</TableCell>
              </TableRow>
            ) : (
              filteredShipments?.map((shipment) => (
                <TableRow
                  key={shipment.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedShipment(shipment.id)}
                >
                  <TableCell className="font-mono">{shipment.shipment_number}</TableCell>
                  <TableCell>{shipment.shipped_at ? format(new Date(shipment.shipped_at), "MMM d, yyyy") : "-"}</TableCell>
                  <TableCell className="capitalize">{shipment.destination_type.replace('_', ' ')}</TableCell>
                  <TableCell className="capitalize">{shipment.shipment_split_type.replace('_', ' ')}</TableCell>
                  <TableCell>{shipment.total_units}</TableCell>
                  <TableCell>{shipment.total_boxes}</TableCell>
                  <TableCell>
                    <Badge variant="default">shipped</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedShipment && (
        <ShipmentDetailDialog
          open={!!selectedShipment}
          onOpenChange={(open) => !open && setSelectedShipment(null)}
          shipmentId={selectedShipment}
        />
      )}
    </div>
  );
};
