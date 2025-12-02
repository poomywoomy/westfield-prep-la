import { useState, useMemo } from "react";
import { useOutboundShipments, useDeleteOutboundShipment } from "@/hooks/useOutboundShipments";
import { useClients } from "@/hooks/useClients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Plus, Search, Trash2, Eye, X } from "lucide-react";
import { CreateOutboundShipmentDialog } from "./CreateOutboundShipmentDialog";
import { ShipmentDetailDialog } from "./ShipmentDetailDialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

// Helper to format destination types with proper capitalization
function formatDestination(destination: string): string {
  const normalizations: Record<string, string> = {
    'amazon_fba': 'Amazon FBA',
    'walmart_wfs': 'Walmart WFS',
    'direct_to_customer': 'Direct to Customer',
    'shopify': 'Shopify',
    'tiktok_shop': 'TikTok Shop',
  };
  const key = destination?.toLowerCase().replace(/\s+/g, '_');
  return normalizations[key] || destination?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '-';
}

export const ShipmentsTab = () => {
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>("all");
  const [skuFilter, setSkuFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [shipmentToDelete, setShipmentToDelete] = useState<{ id: string; clientId: string } | null>(null);
  
  const { data: clients } = useClients();
  const { data: shipments, isLoading } = useOutboundShipments(selectedClient);
  const deleteShipment = useDeleteOutboundShipment();

  const hasActiveFilters = selectedClient !== "all" || searchQuery || marketplaceFilter !== "all" || skuFilter || dateFrom || dateTo;

  const clearFilters = () => {
    setSelectedClient("all");
    setSearchQuery("");
    setMarketplaceFilter("all");
    setSkuFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const filteredShipments = useMemo(() => {
    if (!shipments) return [];
    
    return shipments.filter(shipment => {
      // Search filter
      if (searchQuery && !shipment.shipment_number.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Marketplace filter
      if (marketplaceFilter !== "all") {
        const shipmentMarketplace = (shipment as any).marketplace;
        if (shipmentMarketplace !== marketplaceFilter) return false;
      }
      
      // SKU filter - check shipment lines
      if (skuFilter) {
        const lines = (shipment as any).outbound_shipment_lines || [];
        const hasMatchingSku = lines.some((line: any) => 
          line.skus?.client_sku?.toLowerCase().includes(skuFilter.toLowerCase())
        );
        if (!hasMatchingSku) return false;
      }
      
      // Date range filter
      if (dateFrom || dateTo) {
        const shippedDate = shipment.shipped_at ? new Date(shipment.shipped_at) : null;
        if (!shippedDate) return false;
        
        if (dateFrom && shippedDate < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && shippedDate > endOfDay(parseISO(dateTo))) return false;
      }
      
      return true;
    });
  }, [shipments, searchQuery, marketplaceFilter, skuFilter, dateFrom, dateTo]);

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

      {/* Filters */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6 pb-4 px-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search */}
            <div className="space-y-1.5">
              <Label className="text-xs">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Shipment #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>

            {/* Client Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs">Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="h-9">
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

            {/* Marketplace Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs">Marketplace</Label>
              <Select value={marketplaceFilter} onValueChange={setMarketplaceFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Marketplaces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Marketplaces</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="walmart">Walmart</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SKU Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs">SKU</Label>
              <Input
                placeholder="Search SKU..."
                value={skuFilter}
                onChange={(e) => setSkuFilter(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Date From */}
            <div className="space-y-1.5">
              <Label className="text-xs">Shipped From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Date To */}
            <div className="space-y-1.5">
              <Label className="text-xs">Shipped To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Marketplace</TableHead>
              <TableHead>Destination</TableHead>
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
              filteredShipments?.map((shipment) => {
                const marketplace = (shipment as any).marketplace;
                const marketplaceOther = (shipment as any).marketplace_other;
                const displayMarketplace = marketplace === "other" ? marketplaceOther : marketplace;
                
                return (
                  <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono">{shipment.shipment_number}</TableCell>
                    <TableCell>{(shipment as any).clients?.company_name}</TableCell>
                    <TableCell className="capitalize">{displayMarketplace || "-"}</TableCell>
                    <TableCell>{formatDestination(shipment.destination_type)}</TableCell>
                    <TableCell>
                      <StatusBadge status={shipment.shipment_status} />
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
                );
              })
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
